// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Provides generic canvas functions
class CanvasUtils {
    static SHOW_CENTERS_DOT_ID = {}

    // DEBUG // Can be used to display a dot at the specified shape pos (which is normally not visible)
    static toggleCenter(canvas, shape, radius=5, color=[255,0,0,1]) {
        if (!CanvasUtils.SHOW_CENTERS_DOT_ID[shape.id]) {
            const dot = new Dot([0,0], radius, color, null, shape)
            CanvasUtils.SHOW_CENTERS_DOT_ID[shape.id] = dot.id
            canvas.add(dot)
        } else {
            canvas.remove(CanvasUtils.SHOW_CENTERS_DOT_ID[shape.id])
            delete CanvasUtils.SHOW_CENTERS_DOT_ID[shape.id]
        }
    }

    // DEBUG // Create dots at provided intersection points
    static showIntersectionPoints(canvas, res) {
        const s_d1 = new Dot(res.source.inner, 3, [255,0,0,1]),
            s_d2 = new Dot(res.source.outer, 3, [255,0,0,0.45]),
            t_d1 = new Dot(res.target.outer, 3, [255,0,0,0.45]),
            t_d2 = new Dot(res.target.inner, 3, [255,0,0,1])
        
        canvas.add(s_d1)
        canvas.add(s_d2)
        canvas.add(t_d1)
        canvas.add(t_d2)
    }

    // returns true if the provided dot is the first one of the shape
    static firstDotOnly(dot) {
        return dot.id==dot.parent.firstDot.id
    }
    
    // Generic function to draw an outer ring around a dot (forceBatching allows to force batching even if a URL filter is defined)
    static drawOuterRing(dot, renderStyles, radiusMultiplier, forceBatching) {
        const color = renderStyles.colorObject??renderStyles, opacityThreshold = Color.OPACITY_VISIBILITY_THRESHOLD, filter = renderStyles._filter

        if (color[3]<opacityThreshold || color.a<opacityThreshold) return;

        if (filter&&filter.indexOf("#")!==-1 && !forceBatching) dot.render.stroke(Render.getArc(dot.pos, (dot.radius||1)*radiusMultiplier), renderStyles)
        else dot.render.batchStroke(Render.getArc(dot.pos, (dot.radius||1)*radiusMultiplier), renderStyles)
    }
    
    // Generic function to draw connection between the specified dot and a sourcePos (forceBatching allows to force batching even if a URL filter is defined)
    static drawLine(dot, target, renderStyles, radiusPaddingMultiplier=0, lineType=Render.getLine, spread, forceBatching) {
        const color = renderStyles.colorObject??renderStyles, opacityThreshold = Color.OPACITY_VISIBILITY_THRESHOLD, filter = renderStyles._filter
        
        if (color[3]<opacityThreshold || color.a<opacityThreshold) return;

        if (radiusPaddingMultiplier) {// also, only if sourcePos is Dot
            const res = dot.getLinearIntersectPoints(target, (target.radius??_Obj.DEFAULT_RADIUS)*radiusPaddingMultiplier, dot, dot.radius*radiusPaddingMultiplier)
            if (filter&&filter.indexOf("#")!==-1 && !forceBatching) dot.render.stroke(lineType(res[0][0], res[1][0], spread), renderStyles)
            else dot.render.batchStroke(lineType(res[0][0], res[1][0], spread), renderStyles)
        } else {
            if (filter&&filter.indexOf("#")!==-1 && !forceBatching) dot.render.stroke(lineType(dot.pos, target.pos??target, spread), renderStyles)
            else dot.render.batchStroke(lineType(dot.pos, target.pos??target, spread), renderStyles)
        }
    }

    // Generic function to draw connections between the specified dot and all the dots in its connections property (forceBatching allows to force batching even if a URL filter is defined)
    static drawDotConnections(dot, renderStyles, radiusPaddingMultiplier=0, lineType=Render.getLine, spread, forceBatching) {
        const render = dot.render, dotPos = dot.pos, dotConnections = dot.connections, dc_ll = dot.connections.length, color = renderStyles.colorObject??renderStyles, opacityThreshold = Color.OPACITY_VISIBILITY_THRESHOLD, filter = renderStyles._filter, hasURLFilter = filter&&filter.indexOf("#")!==-1

        if (!lineType) lineType=Render.getLine

        if (dc_ll) {
            if (color[3]<opacityThreshold || color.a<opacityThreshold) return;

            if (radiusPaddingMultiplier) {
                const dotRadiusPadding = dot.radius*radiusPaddingMultiplier
                for (let i=0;i<dc_ll;i++) {
                    const c = dotConnections[i], res = dot.getLinearIntersectPoints(c, c.radius*radiusPaddingMultiplier, dot, dotRadiusPadding)
                    if (hasURLFilter && !forceBatching) render.stroke(lineType(res[0][0], res[1][0], spread), renderStyles)
                    else render.batchStroke(lineType(res[0][0], res[1][0], spread), renderStyles)
                }
            } else for (let i=0;i<dc_ll;i++) {
                if (hasURLFilter && !forceBatching) render.stroke(lineType(dotPos, dotConnections[i].pos, spread), renderStyles)
                else render.batchStroke(lineType(dotPos, dotConnections[i].pos, spread), renderStyles)
            }
        }
    }

    // Generic function to get a callback that can make a dot draggable and throwable
    static getDraggableDotCB() {
        let mouseup = false, dragAnim = null
        return (dot, mouse, dist, ratio, pickableRadius=50)=>{
            if (mouse.clicked && dist < pickableRadius) {
                mouseup = true
                if (dot?.currentBacklogAnim?.id == dragAnim?.id && dragAnim) dragAnim.end()
                dot.x = mouse.x
                dot.y = mouse.y
            } else if (mouseup) {
                mouseup = false
                dragAnim = dot.addForce(Math.min(CDEUtils.mod(Math.min(mouse.speed,3000), ratio)/4, 300), mouse.dir, 750+ratio*1200, Anim.easeOutQuad)
            }
        }
    }

    // Returns a callback allowing a dot to have a custom trail effect
    static getTrailEffectCB(canvas, obj, length=8, moveEffectCB=null, disableDefaultMovements=false) {
        let trail = [], trailPos = new Array(length).fill(obj.pos), lastPos = null, equals = CDEUtils.posEquals, isDefaultMovements = !disableDefaultMovements
        for (let i=0;i<length;i++) {
            const trailObj = obj.duplicate()
            trail.push(trailObj)
            canvas.add(trailObj)
        }

        return (mouse)=>{
            let pos = CDEUtils.unlinkArr2(obj.pos), isMoving = false
            if (!equals(lastPos, pos)) {
                trailPos.shift()
                trailPos.push(pos)

                if (isDefaultMovements) for (let i=0;i<length;i++) trail[i].moveAt(trailPos[i])

                lastPos = pos
                isMoving = true
            }
            if (moveEffectCB) for (let i=0;i<length;i++) moveEffectCB(trail[i], (i+1)/length, isMoving, mouse, trailPos[i], i)
        }
    }

    // Generic function to rotate the gradient of an object
    static rotateGradient(obj, duration=1000, speed=1, isFillColor=false) {
        return obj.playAnim(new Anim((prog)=>obj[isFillColor?"fillColorRaw":"colorRaw"].rotation=-speed*360*prog, duration))
    }

    // Rotates the provided obj for it to face the target. Offsets: top:90, right:0, bottom:270, left:180
    static lookAt(obj, target, offset=0) {
        const t = target?.pos??target
        obj.rotation = offset-CDEUtils.toDeg(Math.atan2(obj.pos[1]-t[1], -(obj.pos[0]-t[0])))
    }

    // Draws the minimal rectangular area fitting the provided object
    static drawOutline(render, obj, color=[255,0,0,1]) {
        const bounds = obj.getBounds()
        render.batchStroke(Render.getPositionsRect(bounds[0], bounds[1]), color?.color||color)
    }

    // Draws the minimal rectangular area fitting the provided object
    static drawOutlineAccurate(render, obj, color=[0,50,255,1]) {
        render.batchStroke(obj.getBoundsAccurate(), color?.color||color)
    }

    // Draws a dot at the provided pos
    static drawPos(render, pos, color=[255,0,0,1], radius) {
        render.batchStroke(Render.getArc(pos, radius), color?.color||color)
    }

    // Provides quick generic shape declarations
    static SHAPES = {
        DEBUG_SHAPE: (pos, dots)=>{
            return new Shape(pos||[100,100], dots||[new Dot(), new Dot([100]), new Dot([,100]), new Dot([100,100])])
        },
        THROWABLE_DOT: (pos, radius, color)=>{
            const dragAnim = CanvasUtils.getDraggableDotCB()
            return new Shape(pos||[10,10],new Dot(), radius, color, null, (render, dot, ratio, res, m, dist, shape)=>dragAnim(shape.firstDot, m, dist, ratio))
        }
    }

    /**
     * Creates a simple drawable area with mouse control, as a canvas object
     * @param {Canvas} CVS: The Canvas instance to use
     * @param {[[x1, y1], [x2, y2]]?} borderPositions: The two corners delimiting the draw area
     * @param {RenderStyles | [r,g,b,a]?} renderStyles: The style profile / color of the drawings
     * @param {Number?} newLineMoveThreshold: The number mouse events to wait before drawing a line
     * @param {Color | [r,g,b,a]?} borderColor: The color of the border
     * @returns The create object
     */
    static createDrawingBoard(CVS, borderPositions=[[0,0], CVS.size], renderStyles=[255,0,0,1], newLineMoveThreshold=Math.min(1, (CVS.fpsLimit||60)/15), borderColor=Color.DEFAULT_RGBA) {
        let d_ll = 0, render = CVS.render, cvsStatic = Canvas.STATIC, thresholdAt=0, obj = new Shape(null, [new Dot(borderPositions[0]), new Dot(borderPositions[1], )], 0, null, 0, null, null, ()=>[], ()=>{
            for (let i=0;i<d_ll;i++) render.batchStroke(obj.setupResults[i], renderStyles)
            if (borderColor && (borderColor.a || borderColor[3])) CanvasUtils.drawOutline(render, obj, borderColor)
        }, null, true)
        CVS.add(obj)

        CVS.mouse.addListener(obj, Mouse.LISTENER_TYPES.DOWN, (pos)=>{
            const path = new Path2D(), x = pos[0], y = pos[1]
            path.moveTo(x, y)
            path.arc(x, y, (renderStyles.lineWidth||render.defaultProfile.lineWidth)/4, 0, CDEUtils.CIRC)
            d_ll = obj.setupResults.push(path)
        })

        CVS.mouse.addListener(obj, Mouse.LISTENER_TYPES.ENTER, (pos, mouse)=>{
            if (mouse.clicked) {
                const path = new Path2D(), x = pos[0], y = pos[1]
                path.moveTo(x, y)
                d_ll = obj.setupResults.push(path)
            }
        })

        CVS.mouse.addListener(obj, Mouse.LISTENER_TYPES.MOVE, (pos,mouse)=>{
            if ((++thresholdAt)==newLineMoveThreshold) {
                const lastPos = mouse.lastPos, path = obj.setupResults[d_ll-1]
                if (path && mouse.clicked && obj.isWithin(lastPos)) {
                    path.lineTo(pos[0], pos[1], lastPos[0], lastPos[1])
                    if (CVS.fpsLimit == cvsStatic) for (let i=0;i<d_ll;i++) render.stroke(obj.setupResults[i], renderStyles)
                }
                thresholdAt=0
            }
        })
        
        return obj
    }

    /**
     * Creates a blank, setup/loop only, object. Can be used to draw non objects.
     * @param {Canvas} CVS: The Canvas instance to use
     * @param {Function} setupCB: Function called on object's initialization. (this, this.parent)=>
     * @param {Function} loopCB Function called each frame for this object (this)=>
     * @returns The created empty Shape object
     */
    static createEmptyObj(CVS, setupCB, loopCB) {
        const obj = new Shape(null, null, 0, null, 0, null, undefined, setupCB, loopCB, null, true)
        CVS.add(obj)
        return obj
    }

    // Provides generic follow paths
    static FOLLOW_PATHS = {
        INFINITY_SIGN: (width, height, progressOffset)=>{
            width??=100
            height??=50
            progressOffset??=0
            return [[0, (prog)=>{
                const progress = CDEUtils.CIRC*((prog+progressOffset)%1)
                return [width*Math.sin(progress), height*Math.sin(2*progress)]
            }]]
        },
        CIRCLE: (width, height, progressOffset)=>{
            width??=100
            height??=100
            progressOffset??=0
            return [[0, (prog)=>{
                const progress = CDEUtils.CIRC*((prog+progressOffset)%1)
                return [width*Math.cos(progress), height*Math.sin(progress)]
            }]]
        },
        RECTANGLE: (width, height, progressOffset)=>{
            width??=100
            height??=100
            progressOffset??=0
            return [[0, (prog)=>{
                const pos = ((prog+progressOffset)%1)*2*(width+height)
                if (pos < width) return [pos, 0]
                else if (pos < width+height) return [width, pos-width]
                else if (pos < 2*width+height) return [width-(pos-(width+height)), height]
                else return [0, height-(pos-(2*width+height))]
            }]]
        },

        QUADRATIC: (width, height, isFliped)=>{
            width ??= 100
            height ??= 200
            const maxNaturalHeight = Math.pow(width/2,2)
            return [[0, (prog)=>{
                let x = (prog-0.5)*width, y = height*((Math.pow(x,2))/maxNaturalHeight)
                if (isFliped) y = height-y
                return [x, y]
            }]]
        },
        LINEAR: (width, a)=>{
            width ??= 100
            a ??= 1
            return [[0, (prog)=>{
                const x = prog*width, y = a*x
                return [x, y]
            }]]
        },
        SINE_WAVE: (width, height)=>{
            width ??= 100
            height ??= 100
            return [[0, (prog)=>{
                const x = prog*width, y = height*Math.sin((CDEUtils.CIRC*x)/width)
                return [x, y]
            }]]
        },
        COSINE_WAVE: (width, height)=>{
            width ??= 100
            height ??= 100
            return [[0, (prog)=>{
                const x = prog*width, y = height*Math.cos((CDEUtils.CIRC*x)/width)
                return [x, y]
            }]]
        },
        RELATIVE: (forceX, forceY)=>{// Doesn't move the obj, unless provided a x/y value. Also accepts other generic follow paths as x/y values.
            forceX??= undefined
            forceY??= undefined
            let isForceXFn = false, isForceYFn = false
            if (Array.isArray(forceX)) {
                forceX = forceX.flat()[1]
                isForceXFn = true
            }
            if (Array.isArray(forceY)) {
                forceY = forceY.flat()[1]
                isForceYFn = true
            }
            return [[0,(prog)=>[isForceXFn?forceX(prog)[0]:forceX, isForceYFn?forceY(prog)[1]:forceX]]]
        }
    }
}