// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Provides generic canvas functions
class CanvasUtils {
    static SHOW_CENTERS_DOT_ID = {}

    // DEBUG // Can be used to display a dot at the specified shape pos (which is normally not visible)
    static toggleCenter(shape, radius=5, color=[255,0,0,1]) {
        if (!CanvasUtils.SHOW_CENTERS_DOT_ID[shape.id]) {
            const dot = new Dot([0,0], radius, color, null, shape)
            CanvasUtils.SHOW_CENTERS_DOT_ID[shape.id] = dot.id
            CVS.add(dot, true)
        } else {
            CVS.remove(CanvasUtils.SHOW_CENTERS_DOT_ID[shape.id])
            delete CanvasUtils.SHOW_CENTERS_DOT_ID[shape.id]
        }
    }

    // DEBUG // Create dots at provided intersection points
    static showIntersectionPoints(res) {
        const s_d1 = new Dot(res.source.inner, 3, [255,0,0,1]),
            s_d2 = new Dot(res.source.outer, 3, [255,0,0,0.45]),
            t_d1 = new Dot(res.target.outer, 3, [255,0,0,0.45]),
            t_d2 = new Dot(res.target.inner, 3, [255,0,0,1])
        
        CVS.add(s_d1, true)
        CVS.add(s_d2, true)
        CVS.add(t_d1, true)
        CVS.add(t_d2, true)
    }
    
    // Generic function to draw an outer ring around a dot
    static drawOuterRing(dot, renderStyles, radiusMultiplier) {
        const color = renderStyles.colorObject??renderStyles

        // skip if not visible
        if (color[3]<Color.OPACITY_VISIBILITY_THRESHOLD || color.a<Color.OPACITY_VISIBILITY_THRESHOLD) return;

        dot.render.stroke(Render.getArc(dot.pos, dot.radius*radiusMultiplier), renderStyles)
    }
    
    // Generic function to draw connection between the specified dot and a sourcePos
    static drawLine(dot, target, renderStyles, radiusPaddingMultiplier=0) {
        const endPos = target.pos??target, color = renderStyles.colorObject??renderStyles
        
        // skip if not visible
        if (color[3]<Color.OPACITY_VISIBILITY_THRESHOLD || color.a<Color.OPACITY_VISIBILITY_THRESHOLD) return;

        if (radiusPaddingMultiplier) {// also, only if sourcePos is Dot
            const res = dot.getLinearIntersectPoints(target, (target.radius??Obj.DEFAULT_RADIUS)*radiusPaddingMultiplier, dot, dot.radius*radiusPaddingMultiplier)
            dot.render.stroke(Render.getLine(res.source.inner, res.target.inner), renderStyles)
        } else dot.render.stroke(Render.getLine(dot.pos, endPos), renderStyles)
    }

    // Generic function to draw connections between the specified dot and all the dots in its connections property
    static drawDotConnections(dot, renderStyles, radiusPaddingMultiplier=0, isDestinationOver=true) {
        const ctx = dot.ctx, dc_ll = dot.connections.length, color = renderStyles.colorObject??renderStyles

        // skip if not visible
        if (color[3]<Color.OPACITY_VISIBILITY_THRESHOLD || color.a<Color.OPACITY_VISIBILITY_THRESHOLD) return;

        if (isDestinationOver) ctx.globalCompositeOperation = "destination-over"

        if (dc_ll) for (let i=0;i<dc_ll;i++) {
            const c = dot.connections[i]
            if (radiusPaddingMultiplier) {
                const res = dot.getLinearIntersectPoints(c, c.radius*radiusPaddingMultiplier, dot, dot.radius*radiusPaddingMultiplier)
                dot.render.stroke(Render.getLine(res.source.inner, res.target.inner), renderStyles)
            } else dot.render.stroke(Render.getLine(dot.pos, c.pos), renderStyles)
        }
        
        if (isDestinationOver) ctx.globalCompositeOperation = "source-over"
    }

    // Generic function to get a callback that can make a dot draggable and throwable
    static getDraggableDotCB() {
        let mouseup = false, dragAnim = null
        return (dot, mouse, dist, ratio, pickableRadius=50)=>{
            if (mouse.clicked && dist < pickableRadius) {
                mouseup = true
                if (dot?.currentBacklogAnim?.id === dragAnim?.id && dragAnim) dragAnim.end()
                dot.x = mouse.x
                dot.y = mouse.y
            } else if (mouseup) {
                mouseup = false
                dragAnim = dot.addForce(Math.min(CDEUtils.mod(Math.min(mouse.speed,3000), ratio)/4, 300), mouse.dir, 750+ratio*1200, Anim.easeOutQuad)
            }
        }
    }

    // Generic function to rotate the gradient of an object
    static rotateGradient(obj, duration=1000, speed=1, isFillColor=false) {
        return obj.playAnim(new Anim((prog)=>obj[isFillColor?"fillColorRaw":"colorRaw"].rotation=-speed*360*prog, duration))
    }

    // Provides quick generic shape declarations
    static SHAPES = class {// DOC TODO
        static DEBUG_SHAPE(pos, dots) {
            return new Shape(pos||[100,100], dots||[new Dot(), new Dot([100]), new Dot([,100]), new Dot([100,100])])
        }

        static THROWABLE_DOT(pos, radius, color) {
            const dragAnim = CanvasUtils.getDraggableDotCB()
            return new Shape(pos||[10,10],new Dot(), radius, color, null, (render, dot, ratio, m, dist, shape)=>{
                dragAnim(shape.firstDot, m, dist, ratio)
            })
        }
    }

    // Provides generic follow paths
    static FOLLOW_PATHS = class {
        static INFINITY_SIGN(width, height, progressOffset) {
            width??=100
            height??=50
            progressOffset??=0
            return [[0, (prog)=>{
                const progress = CDEUtils.CIRC*((prog+progressOffset)%1)
                return [width*Math.sin(progress), height*Math.sin(2*progress)]
            }]]
        }

        static CIRCLE(width, height, progressOffset) {
            width??=100
            height??=100
            progressOffset??=0
            return [[0, (prog)=>{
                const progress = CDEUtils.CIRC*((prog+progressOffset)%1)
                return [width*Math.cos(progress), height*Math.sin(progress)]
            }]]
        }
        
        static RECTANGLE(width, height, progressOffset) {
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
        }

        static QUADRATIC(width, height, isFliped) {
            width ??= 100
            height ??= 200
            const maxNaturalHeight = Math.pow(width/2,2)
            return [[0, (prog)=>{
                let x = (prog-0.5)*width, y = height*((Math.pow(x,2))/maxNaturalHeight)
                if (isFliped) y = height-y
                return [x, y]
            }]]
        }

        static LINEAR(width, a) {
            width ??= 100
            a ??= 1
            return [[0, (prog)=>{
                const x = prog*width, y = a*x
                return [x, y]
            }]]
        }

        static SINE_WAVE(width, height) {
            width ??= 100
            height ??= 100
            return [[0, (prog)=>{
                const x = prog*width, y = height*Math.sin((CDEUtils.CIRC*x)/width)
                return [x, y]
            }]]
        }

        static COSINE_WAVE(width, height) {
            width ??= 100
            height ??= 100
            return [[0, (prog)=>{
                const x = prog*width, y = height*Math.cos((CDEUtils.CIRC*x)/width)
                return [x, y]
            }]]
        }

        // Doesn't move the dot, unless provided a x/y value. Also accepts other generic follow paths as x/y values.
        static RELATIVE(forceX, forceY) {
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