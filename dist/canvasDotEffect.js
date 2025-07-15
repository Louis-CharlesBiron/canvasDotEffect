'use strict';
// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

class CDEUtils {
    static DEFAULT_ACCEPTABLE_DIFFERENCE = 0.0000001
    static CIRC = 2*Math.PI
    static TO_DEGREES = Math.PI/180

    // Returns the element at the specified index, starting from the end of the array
    static getLast(arr, index=0) {
        return arr[arr.length-1-index]
    }

    // Adds an element to the specified index of the array
    static addAt(arr, el, index=0) {
        return arr.slice(0, index).concat(el, arr.slice(index))
    }

    // returns a random number within the min and max range. Can generate decimals
    static random(min, max, decimals=0) {
        if (decimals) {
            const precision = decimals**10
            return Math.round((Math.random()*(max-min)+min)*precision)/precision
        } else return (Math.random()*(max-min)+min)>>0
    }

    // clamps a numeric value between the min and max 
    static clamp(value, min=Infinity, max=Infinity) {
        return value < min ? min : value > max ? max : value
    }

    // returns whether a value is defined
    static isDefined(v) {
        return v != null
    }

    // returns whether a value is a function
    static isFunction(v) {
        return typeof v == "function"
    }

    // rounds a number to a specific decimal point
    static round(num, decimals=1) {
        const precision = 10**decimals
        return Math.round(num*precision)/precision
    }

    // creates a copy of the provided array. (only for length 2)
    static unlinkArr2(arr) {
        return [arr[0], arr[1]]
    }

    // creates a copy of the provided array. (only for length 3)
    static unlinkArr3(arr) {
        return [arr[0], arr[1], arr[2]]
    }

    // creates a copy of the provided array. (input format: [ [x, y], [x, y] ], or [x, y])
    static unlinkPositions(arr) {
        const isArray = Array.isArray, unlinkArr2 = CDEUtils.unlinkArr2,  o1 = arr?.[0], o2 = arr?.[1]
        return isArray(arr) ? [isArray(o1)?unlinkArr2(o1):o1, isArray(o2)?unlinkArr2(o2):o2] : arr
    }

    // returns the rotated position 
    static rotatePos(pos=[0,0], deg=0, centerPos=[0,0]) {
        const rad = CDEUtils.toRad(deg), cos=Math.cos(rad), sin=Math.sin(rad), sx = pos[0]-centerPos[0], sy = pos[1]-centerPos[1]
        return [sx*cos-sy*sin+centerPos[0], sx*sin+sy*cos+centerPos[1]]
    }

    // returns the rotated position 
    static scalePos(pos=[0,0], scale=[1,1], centerPos=[0,0]) {
        const sx = pos[0]-centerPos[0], sy = pos[1]-centerPos[1]
        return [sx*scale[0]+centerPos[0], sy*scale[1]+centerPos[1]]
    }

    // returns the center pos of the provided positions
    static getPositionsCenter(positions) {
        return [(positions[0][0]+positions[1][0])/2, (positions[0][1]+positions[1][1])/2]
    }

    // Returns the pythagorian distance between 2 points
    static getDist(x1, y1, x2, y2) {
        return Math.sqrt((x1-x2)**2 + (y1-y2)**2)
    }

    // Returns the "a", "b" and "function" values formed by a line between 2 positions
    static getLinearFn(pos1, pos2) {
        const a = (pos2[1]-pos1[1])/(pos2[0]-pos1[0]), b = -a*pos1[0]+pos1[1]
        return [a, b, (x)=>a*x+b, pos1]
    }

    // Returns the "a", "b" and "function" values of the perpendicular line. 
    static getPerpendicularLinearFn(linearFnResult) {
        const a = -1/linearFnResult[0], pos = linearFnResult[3], b = -a*pos[0]+pos[1]
        return [a, b, (x)=>a*x+b, pos]
    }

    // Returns a random value in a randomArray
    static getValueFromRange(minMax) {
        return Array.isArray(minMax) ? CDEUtils.random(minMax[0], minMax[1]) : minMax 
    }

    // Shallow array equals
    static arrayEquals(arr1, arr2) {
        if (arr1.length !== arr2.length) return false
        return arr1.every((v, i)=>v==arr2[i])
    }
    
    // adds a pos to another
    static addPos(pos1, pos2) {
        return [pos1[0]+pos2[0], pos1[1]+pos2[1]]
    }
    
    // substracts a pos to another
    static subPos(pos1, pos2) {
        return [pos1[0]-pos2[0], pos1[1]-pos2[1]]
    }

    // substracts a pos to another
    static mulPos(pos1, pos2) {
        return [pos1[0]*pos2[0], pos1[1]*pos2[1]]
    }

    // substracts a pos to another
    static divPos(pos1, pos2) {
        return [pos1[0]/pos2[0], pos1[1]/pos2[1]]
    }

    // pos array equals
    static posEquals(arr1, arr2) {
        return arr2 && arr1 && arr1[0]==arr2[0] && arr1[1]==arr2[1]
    }

    // positions array equals
    static positionsEquals(arr1, arr2) {
        return arr1 && arr2 && arr1[0][0]==arr2[0][0] && arr1[0][1]==arr2[0][1] && arr1[1][0]==arr2[1][0] && arr1[1][1]==arr2[1][1]
    }

    /**
    * Returns the interpolated number between (max) and (max - range) 
    * @param {Number} max: the max value to return
    * @param {Number} ratio: the linear interpolation progress (0 to 1)
    * @param {Number} range: defines the range of the max value to be used, inverts direction when negated
                            [if range=max, then (0 to max) will be used] or
                            [if range=max/2, only (max/2 to max) will be used] or
                            [if range=0, only (max to max) will be used]
    */
    static mod(max, ratio, range=max) {
        return max-ratio*range-(range<0)*max
    }

    // returns converted given degrees into radians 
    static toRad(deg) {
        return deg*CDEUtils.TO_DEGREES
    }

    // returns converted given radians into degrees 
    static toDeg(rad) {
        return rad/CDEUtils.TO_DEGREES
    }

    /**
    * Rounds the specied decimal number if it's close enough to its rounded value 
    * @param {Number} num: a decimal number 
    * @param {Number} acceptableDiff: the minimal difference between the given decimal number and it's rounded conterpart, for them be considered the same 
    * @returns The potentially adjusted number
    */
    static getAcceptableDiff(num, acceptableDiff=CDEUtils.DEFAULT_ACCEPTABLE_DIFFERENCE) {
        const rounded = Math.round(num)
        return rounded-num <= acceptableDiff ? rounded : num
    }

    /**
    * @param {[Number|Object]} arr: array containing numbers or objects a numberic property 
    * @param {String?} propPath: the path of the compared value if the array is containing objects 
    * @returns the [min, max] values of the array
    */
    static getMinMax(arr, propPath=null) {
       let min = Infinity, max = -Infinity, ll = arr.length
       for (let i=0;i<ll;i++) {
            const v = propPath ? +arr[i][propPath] : arr[i]
            if (v < min) min = v
            if (v > max) max = v
       }
       return [min, max]
    }

    /**
    * Calls a function repeatedly with a delay between calls
    * @param {Number} iterationCount: the number of time the callback is called
    * @param {Function} callback: the function to call (i)=>
    * @param {Number} delay: delay between each calls
    */
    static repeatedTimeout(iterationCount, callback, delay=5) {
        let at = 0
        for (let i=0;i<iterationCount;i++) {
            setTimeout(()=>callback(i),at+=delay)
        }
    }

    // console.log with the stack trace (DEBUG)
    static stackTraceLog(...logs) {
        try {
            throw new Error("stackTraceLog")
        } catch(e) {console.log(e, ...logs)}
    }
}
// Create an instance of the FPSCounter and run every frame: either getFpsRaw for raw fps AND/OR getFps for averaged fps
class FPSCounter {
    constructor(avgSampleSize) {
        this._t = []
        this._maxFps=0
        this._avgSampleSize = avgSampleSize||10
        this._avg = []
    }

    getFpsRaw() {//run in the loop
        let n=performance.now(), fps
        while (this._t.length>0 && this._t[0]<=n-1000) this._t.shift()
        fps = this._t.push(n)
        if (this._maxFps < fps) this._maxFps = fps
        return fps
    }

    getFps() {//or run in the loop
        this._avg.push(this.getFpsRaw())
        if (this._avg.length > this._avgSampleSize) this._avg.shift()
        return Math.floor(Math.min(this._avg.reduce((a, b)=>a+b,0)/this._avgSampleSize, this._maxFps))
    }

    get maxFps() {return this._maxFps-1}
    get avgSample() {return this._avgSampleSize}
    get fpsRaw() {return this._t.length}
    
    set avgSample(s) {this._avgSampleSize = s}
}
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

    // TODO manage color/line styles
    static createDrawingBoard(CVS, borderPositions=[[0,0], CVS.size], renderStyles=[255,0,0,1], borderColor=Color.DEFAULT_RGBA, newLineMoveThreshold=Math.min(6, (CVS.fpsLimit||60)/15)) {
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
// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Represents a color value
class Color {
    static DEFAULT_COLOR = "aliceblue"
    static DEFAULT_RGBA = [240, 248, 255, 1]
    static DEFAULT_COLOR_VALUE = "rgba(240, 248, 255, 1)"
    static CSS_COLOR_TO_RGBA_CONVERTIONS = {transparent:[0,0,0,0],aliceblue:[240,248,255,1],antiquewhite:[250,235,215,1],aqua:[0,255,255,1],aquamarine:[127,255,212,1],azure:[240,255,255,1],beige:[245,245,220,1],bisque:[255,228,196,1],black:[0,0,0,1],blanchedalmond:[255,235,205,1],blue:[0,0,255,1],blueviolet:[138,43,226,1],brown:[165,42,42,1],burlywood:[222,184,135,1],cadetblue:[95,158,160,1],chartreuse:[127,255,0,1],chocolate:[210,105,30,1],coral:[255,127,80,1],cornflowerblue:[100,149,237,1],cornsilk:[255,248,220,1],crimson:[220,20,60,1],cyan:[0,255,255,1],darkblue:[0,0,139,1],darkcyan:[0,139,139,1],darkgoldenrod:[184,134,11,1],darkgray:[169,169,169,1],darkgreen:[0,100,0,1],darkkhaki:[189,183,107,1],darkmagenta:[139,0,139,1],darkolivegreen:[85,107,47,1],darkorange:[255,140,0,1],darkorchid:[153,50,204,1],darkred:[139,0,0,1],darksalmon:[233,150,122,1],darkseagreen:[143,188,143,1],darkslateblue:[72,61,139,1],darkslategray:[47,79,79,1],darkturquoise:[0,206,209,1],darkviolet:[148,0,211,1],deeppink:[255,20,147,1],deepskyblue:[0,191,255,1],dimgray:[105,105,105,1],dodgerblue:[30,144,255,1],firebrick:[178,34,34,1],floralwhite:[255,250,240,1],forestgreen:[34,139,34,1],fuchsia:[255,0,255,1],gainsboro:[220,220,220,1],ghostwhite:[248,248,255,1],gold:[255,215,0,1],goldenrod:[218,165,32,1],gray:[128,128,128,1],grey:[128,128,128,1],green:[0,128,0,1],greenyellow:[173,255,47,1],honeydew:[240,255,240,1],hotpink:[255,105,180,1],indianred:[205,92,92,1],indigo:[75,0,130,1],ivory:[255,255,240,1],khaki:[240,230,140,1],lavender:[230,230,250,1],lavenderblush:[255,240,245,1],lawngreen:[124,252,0,1],lemonchiffon:[255,250,205,1],lightblue:[173,216,230,1],lightcoral:[240,128,128,1],lightcyan:[224,255,255,1],lightgoldenrodyellow:[250,250,210,1],lightgray:[211,211,211,1],lightgreen:[144,238,144,1],lightpink:[255,182,193,1],lightsalmon:[255,160,122,1],lightseagreen:[32,178,170,1],lightskyblue:[135,206,250,1],lightslategray:[119,136,153,1],lightsteelblue:[176,224,230,1],lightyellow:[255,255,224,1],lime:[0,255,0,1],limegreen:[50,205,50,1],linen:[250,240,230,1],magenta:[255,0,255,1],maroon:[128,0,0,1],mediumaquamarine:[102,205,170,1],mediumblue:[0,0,205,1],mediumorchid:[186,85,211,1],mediumpurple:[147,112,219,1],mediumseagreen:[60,179,113,1],mediumslateblue:[123,104,238,1],mediumspringgreen:[0,250,154,1],mediumturquoise:[72,209,204,1],mediumvioletred:[199,21,133,1],midnightblue:[25,25,112,1],mintcream:[245,255,250,1],mistyrose:[255,228,225,1],moccasin:[255,228,181,1],navajowhite:[255,222,173,1],navy:[0,0,128,1],oldlace:[253,245,230,1],olive:[128,128,0,1],olivedrab:[107,142,35,1],orange:[255,165,0,1],orangered:[255,69,0,1],orchid:[218,112,214,1],palegoldenrod:[238,232,170,1],palegreen:[152,251,152,1],paleturquoise:[175,238,238,1],palevioletred:[219,112,147,1],papayawhip:[255,239,213,1],peachpuff:[255,218,185,1],peru:[205,133,63,1],pink:[255,192,203,1],plum:[221,160,221,1],powderblue:[176,224,230,1],purple:[128,0,128,1],rebeccapurple:[102,51,153,1],red:[255,0,0,1],rosybrown:[188,143,143,1],royalblue:[65,105,225,1],saddlebrown:[139,69,19,1],salmon:[250,128,114,1],sandybrown:[244,164,96,1],seagreen:[46,139,87,1],seashell:[255,245,238,1],sienna:[160,82,45,1],silver:[192,192,192,1],skyblue:[135,206,235,1],slateblue:[106,90,205,1],slategray:[112,128,144,1],snow:[255,250,250,1],springgreen:[0,255,127,1],steelblue:[70,130,180,1],tan:[210,180,140,1],teal:[0,128,128,1],thistle:[216,191,216,1],tomato:[255,99,71,1],turquoise:[64,224,208,1],violet:[238,130,238,1],wheat:[245,222,179,1],white:[255,255,255,1],whitesmoke:[245,245,245,1],yellow:[255,255,0,1],yellowgreen:[154,205,50,1]}
    static RGBA_TO_CSS_COLOR_CONVERTIONS = {"0,0,0,0":"transparent","240,248,255,1":"aliceblue","250,235,215,1":"antiquewhite","0,255,255,1":"aqua","127,255,212,1":"aquamarine","240,255,255,1":"azure","245,245,220,1":"beige","255,228,196,1":"bisque","0,0,0,1":"black","255,235,205,1":"blanchedalmond","0,0,255,1":"blue","138,43,226,1":"blueviolet","165,42,42,1":"brown","222,184,135,1":"burlywood","95,158,160,1":"cadetblue","127,255,0,1":"chartreuse","210,105,30,1":"chocolate","255,127,80,1":"coral","100,149,237,1":"cornflowerblue","255,248,220,1":"cornsilk","220,20,60,1":"crimson","0,0,139,1":"darkblue","0,139,139,1":"darkcyan","184,134,11,1":"darkgoldenrod","169,169,169,1":"darkgray","0,100,0,1":"darkgreen","189,183,107,1":"darkkhaki","139,0,139,1":"darkmagenta","85,107,47,1":"darkolivegreen","255,140,0,1":"darkorange","153,50,204,1":"darkorchid","139,0,0,1":"darkred","233,150,122,1":"darksalmon","143,188,143,1":"darkseagreen","72,61,139,1":"darkslateblue","47,79,79,1":"darkslategray","0,206,209,1":"darkturquoise","148,0,211,1":"darkviolet","255,20,147,1":"deeppink","0,191,255,1":"deepskyblue","105,105,105,1":"dimgray","30,144,255,1":"dodgerblue","178,34,34,1":"firebrick","255,250,240,1":"floralwhite","34,139,34,1":"forestgreen","220,220,220,1":"gainsboro","248,248,255,1":"ghostwhite","255,215,0,1":"gold","218,165,32,1":"goldenrod","128,128,128,1":"gray","0,128,0,1":"green","173,255,47,1":"greenyellow","240,255,240,1":"honeydew","255,105,180,1":"hotpink","205,92,92,1":"indianred","75,0,130,1":"indigo","255,255,240,1":"ivory","240,230,140,1":"khaki","230,230,250,1":"lavender","255,240,245,1":"lavenderblush","124,252,0,1":"lawngreen","255,250,205,1":"lemonchiffon","173,216,230,1":"lightblue","240,128,128,1":"lightcoral","224,255,255,1":"lightcyan","250,250,210,1":"lightgoldenrodyellow","211,211,211,1":"lightgray","144,238,144,1":"lightgreen","255,182,193,1":"lightpink","255,160,122,1":"lightsalmon","32,178,170,1":"lightseagreen","135,206,250,1":"lightskyblue","119,136,153,1":"lightslategray","176,224,230,1":"lightsteelblue","255,255,224,1":"lightyellow","0,255,0,1":"lime","50,205,50,1":"limegreen","250,240,230,1":"linen","255,0,255,1":"magenta","128,0,0,1":"maroon","102,205,170,1":"mediumaquamarine","0,0,205,1":"mediumblue","186,85,211,1":"mediumorchid","147,112,219,1":"mediumpurple","60,179,113,1":"mediumseagreen","123,104,238,1":"mediumslateblue","0,250,154,1":"mediumspringgreen","72,209,204,1":"mediumturquoise","199,21,133,1":"mediumvioletred","25,25,112,1":"midnightblue","245,255,250,1":"mintcream","255,228,225,1":"mistyrose","255,228,181,1":"moccasin","255,222,173,1":"navajowhite","0,0,128,1":"navy","253,245,230,1":"oldlace","128,128,0,1":"olive","107,142,35,1":"olivedrab","255,165,0,1":"orange","255,69,0,1":"orangered","218,112,214,1":"orchid","238,232,170,1":"palegoldenrod","152,251,152,1":"palegreen","175,238,238,1":"paleturquoise","219,112,147,1":"palevioletred","255,239,213,1":"papayawhip","255,218,185,1":"peachpuff","205,133,63,1":"peru","255,192,203,1":"pink","221,160,221,1":"plum","128,0,128,1":"purple","102,51,153,1":"rebeccapurple","255,0,0,1":"red","188,143,143,1":"rosybrown","65,105,225,1":"royalblue","139,69,19,1":"saddlebrown","250,128,114,1":"salmon","244,164,96,1":"sandybrown","46,139,87,1":"seagreen","255,245,238,1":"seashell","160,82,45,1":"sienna","192,192,192,1":"silver","135,206,235,1":"skyblue","106,90,205,1":"slateblue","112,128,144,1":"slategray","255,250,250,1":"snow","0,255,127,1":"springgreen","70,130,180,1":"steelblue","210,180,140,1":"tan","0,128,128,1":"teal","216,191,216,1":"thistle","255,99,71,1":"tomato","64,224,208,1":"turquoise","238,130,238,1":"violet","245,222,179,1":"wheat","255,255,255,1":"white","245,245,245,1":"whitesmoke","255,255,0,1":"yellow","154,205,50,1":"yellowgreen"}
    static FORMATS = {RGBA:"RGBA", TEXT:"TEXT", HEX:"HEX", GRADIENT:"GRADIENT", PATTERN:"PATTERN", COLOR:"COLOR", HSV:"HSVA"}
    static CONVERTABLE_FORMATS = {RGBA:"RGBA", TEXT:"TEXT", HEX:"HEX", HSV:"HSVA"}
    static STRICT_FORMATS = {RGBA:"RGBA", COLOR:"COLOR"}
    static DEFAULT_TEMPERANCE = 0
    static SEARCH_STARTS = {TOP_LEFT:"TOP_LEFT", BOTTOM_RIGHT:"BOTTOM_RIGHT"}
    static DEFAULT_SEARCH_START = Color.SEARCH_STARTS.TOP_LEFT
    static DEFAULT_DECIMAL_ROUNDING_POINT = 3
    static OPACITY_VISIBILITY_THRESHOLD = 0.05
    
    #rgba = null // cached rgba value
    #hsv = null  // cached hsv value
    constructor(color, isChannel) {
        this._color = color instanceof Color ? color._color : color||Color.DEFAULT_COLOR // the color value declaration, in any supported format
        this._format = Color.getFormat(this._color) // the format of the color
        this.#updateCache()

        this._isChannel = isChannel||false // if true, this instance will be used as a color channel and will not duplicate
    }

    // updates the cached rgba value
    #updateCache() {
        if (this._format == Color.FORMATS.GRADIENT || this._format == Color.FORMATS.PATTERN) this.#rgba = this.#hsv = []
        else {
            this.#rgba = this._format !== Color.FORMATS.RGBA ? this.convertTo() : Color.#unlinkRGBA(this._color)
            const rgba = this.#rgba, DDRP = Color.DEFAULT_DECIMAL_ROUNDING_POINT, round = CDEUtils.round
            rgba[0] = round(rgba[0], DDRP)
            rgba[1] = round(rgba[1], DDRP)
            rgba[2] = round(rgba[2], DDRP)
            rgba[3] = round(rgba[3], DDRP)
            this.#hsv = Color.convertTo(this.#rgba, Color.FORMATS.HSV)
        }
    }

    // converts a color to another color format
    static convertTo(color, format=Color.CONVERTABLE_FORMATS.RGBA) {
        let inputFormat = Color.getFormat(color), convertedColor = color, formats = Color.CONVERTABLE_FORMATS, RGBA=formats.RGBA, HEX=formats.HEX, TEXT=formats.TEXT, HSV=formats.HSV

        if (format==RGBA) {
            if (inputFormat==HEX) convertedColor = Color.#hexToRgba(color)
            else if (inputFormat==TEXT) convertedColor = Color.#unlinkRGBA(Color.CSS_COLOR_TO_RGBA_CONVERTIONS[color])
            else if (inputFormat==HSV) convertedColor = Color.#hsvToRgba(color)
        } else if (format==HEX) {
            if (inputFormat==RGBA) convertedColor = Color.#rgbaToHex(color)
            else Color.#rgbaToHex(Color.convertTo(color, RGBA))
        } else if (format==TEXT) {
            if (inputFormat==RGBA) convertedColor = Color.RGBA_TO_CSS_COLOR_CONVERTIONS[color.toString()] ?? color
            else convertedColor = Color.RGBA_TO_CSS_COLOR_CONVERTIONS[Color.convertTo(color, RGBA).toString()] ?? color
        } else if (format==HSV) {
            if (inputFormat==RGBA) convertedColor = Color.#rgbaToHsv(color)
            else convertedColor = Color.#rgbaToHsv(Color.convertTo(color, RGBA))
        }

        return convertedColor
    }
    // instance version
    convertTo(color=this._color, format=Color.CONVERTABLE_FORMATS.RGBA) {
        return Color.convertTo(color, format)
    }

    /**
     * Returns a random color value
     * @param {Color.CONVERTABLE_FORMATS} outputFormat: the result's ouput format, one of CONVERTABLE_FORMATS
     * @param {Boolean} randomizeAlpha: whether the alpha is also randomized, if false, alpha defaults to 1
     * @param {Array} rRange: if defined, defines the min/max range to chose the r value from
     * @param {Array} gRange: if defined, defines the min/max range to chose the g value from
     * @param {Array} bRange: if defined, defines the min/max range to chose the b value from
     * @param {Array} aRange: if defined, defines the min/max range to chose the a value from
     */
    static random(outputFormat=Color.CONVERTABLE_FORMATS.RGBA, randomizeAlpha=false, rRange=[0,255], gRange=[0,255], bRange=[0,255], aRange=[0,1]) {
        const formats = Color.CONVERTABLE_FORMATS, random = CDEUtils.random, randomRGBA = [random(...rRange), random(...gRange), random(...bRange), randomizeAlpha?random(...aRange, 2):1]
        if (outputFormat==formats.HEX) return Color.convertTo(randomRGBA, formats.HEX)
        else if (outputFormat==formats.TEXT) return Color.convertTo(randomRGBA, formats.TEXT)
        else if (outputFormat==formats.HSV) return Color.convertTo(randomRGBA, formats.HSV)
        else return randomRGBA
    }

    // converts rbga to hsv (without alpha)
    static #rgbaToHsv(rgba) {
        let r = rgba[0]/255, g = rgba[1]/255, b = rgba[2]/255,
            min = Math.min(r, g, b), max = Math.max(r, g, b),
            hue, diff = max-min
    
        if (max==min) hue = 0
        else {
            if (max==r) hue = (g-b)/diff
            else if (max==g) hue = (b-r)/diff+2
            else hue = (r-g)/diff+4
            hue = (360+hue*60)%360
        }

        return [hue, max&&(diff/max)*100, max*100]
    }

    // create a separate copy of an RGBA array
    static #unlinkRGBA(rgba) {
        return [rgba[0], rgba[1], rgba[2], rgba[3]]
    }

    // converts hsv to rbga (without default alpha)
    static #hsvToRgba(hsva) {
        let hue = hsva[0], sat = hsva[1]/100, bright = hsva[2]/100,
        chro = bright*sat, x = chro*(1-Math.abs(((hue/60)%2)-1)), dc = bright-chro,
        r, g, b
    
        if (0<=hue&&hue<60) {r=chro;g=x;b=0}
        else if (60<=hue&&hue<120) {r=x;g=chro;b=0}
        else if (120<=hue&&hue<180) {r=0;g=chro;b=x}
        else if (180<=hue&&hue<240) {r=0;g=x;b=chro}
        else if (240<=hue&&hue<300) {r=x;g=0;b=chro}
        else {r=chro;g=0;b=x}

        return [Math.round((r+dc)*255), Math.round((g+dc)*255), Math.round((b+dc)*255), 1]
    }
    
    // converts rbga to hex
    static #rgbaToHex(rgba) {
        return "#"+rgba.reduce((a,b,i)=>a+=(i&&!(i%3)?Math.round(b*255):b).toString(16).padStart(2,"0"),"")
    }

    // converts hex to rgba
    static #hexToRgba(hex) {
        return hex.padEnd(9, "F").match(/[a-z0-9]{2}/gi).reduce((a,b,i)=>a.concat(parseInt(b, 16)/(i&&!(i%3)?255:1)),[])
    }

    // returns the format of the provided color
    static getFormat(color) {
        return Array.isArray(color) ?
            (color.length == 4 ? Color.FORMATS.RGBA : Color.FORMATS.HSV) :
        color instanceof Color ? Color.FORMATS.COLOR :
        color instanceof Gradient ? Color.FORMATS.GRADIENT :
        color instanceof Pattern ? Color.FORMATS.PATTERN :
        color.includes("#") ? Color.FORMATS.HEX : Color.FORMATS.TEXT
    }

    // ajust color values to Color instances
    static adjust(color) {
        return color instanceof Color ? color.isChannel?color:color.duplicate() : new Color(color)
    }
    
    // formats a rgba array to a usable rgba value
    static formatRgba(arrayRgba) {
        return Array.isArray(arrayRgba) ? `rgba(${arrayRgba[0]}, ${arrayRgba[1]}, ${arrayRgba[2]}, ${arrayRgba[3]})` : null
    }

    // creates an rgba array
    static rgba(r=255, g=255, b=255, a=1) {
        const round = CDEUtils.round, roundingPoint = Color.DEFAULT_DECIMAL_ROUNDING_POINT
        return [round(r, roundingPoint), round(g, roundingPoint), round(b, roundingPoint), round(a, roundingPoint)]
    }

    // returns the usable value of a color from any supported format
    static getColorValue(color) {
        if (typeof color=="string" || color instanceof CanvasGradient || color instanceof CanvasPattern) return color
        else if (color instanceof _DynamicColor) return color.value
        else return Color.formatRgba(color) ?? color.color
    }

    /**
     * Returns the first pos where the provided color is found in the canvas
     * @param {Canvas} canvas: Canvas instance
     * @param {Color} color: Color instance
     * @param {Boolean} useAlpha: Whether the search considers opacity
     * @param {Number} temperance: The validity margin for the r,g,b,a values
     * @param {SEARCH_STARTS} searchStart: Direction from which the search starts
     * @param {[width, height]} areaSize: The search area. (Defaults to the canvas size)
     * @returns The found pos [x,y] or null if nothing was found
     */
    static findFirstPos(canvas, color, useAlpha=false, temperance=Color.DEFAULT_TEMPERANCE, searchStart=Color.DEFAULT_SEARCH_START, areaSize=[]) {
        let width = areaSize[0]??canvas.width, height = areaSize[1]??canvas.height,
            data = canvas.ctx.getImageData(0, 0, width, height).data,
            x, y, yi, xi, currentR, currentG, currentB, currentA, ow = 4*width,
            r = color.r??color[0], g = color.g??color[1], b = color.b??color[2], a = (color.a??color[3])*255,
            br = r-temperance, bg = g-temperance, bb = b-temperance, ba = a-temperance,
            tr = r+temperance, tg = g+temperance, tb = b+temperance, ta = a+temperance,
            isSearchTL = searchStart==Color.SEARCH_STARTS.TOP_LEFT,
            startX = isSearchTL?0:width-1, endX = isSearchTL?width:-1, stepX = isSearchTL?1:-1,
            startY = isSearchTL?0:height-1, endY = isSearchTL?height:-1, stepY = isSearchTL?1:-1

            for (y=startY;y!=endY;y+=stepY) {
                yi = y*ow
                for (x=startX;x!=endX;x+=stepX) {
                    xi = yi+x*4
                    currentR = data[xi] 
                    if (temperance) {
                        if (currentR >= br && currentR <= tr) {
                            currentG = data[xi+1]
                            currentB = data[xi+2]
                            if (currentG >= bg && currentG <= tg && currentB >= bb && currentB <= tb && (!useAlpha || (currentA >= ba && currentA <= ta))) return [x, y]
                        }
                    } else if (currentR == r) if (data[xi+1] == g && data[xi+2] == b && (!useAlpha || data[xi+3] == a)) return [x, y]
                }
            }

        return null
    }

    // returns a new instance of the same color
    duplicate(dynamicColorPositions) {
        const formats = Color.FORMATS, format = this._format
        if (format == formats.GRADIENT || format == formats.PATTERN) return new Color(this._color.duplicate(dynamicColorPositions))
        else return new Color(Color.#unlinkRGBA(this.#rgba))
    }

    toString() {
        let colorValue = Color.getColorValue(this._color)
        if (colorValue instanceof CanvasGradient || colorValue instanceof CanvasPattern) colorValue = this._color.toString()
        return colorValue
    }

    // returns the usable value of the color
    get color() {
        const formats = Color.FORMATS, format = this._format
        if (format == formats.GRADIENT || format == formats.PATTERN) return this._color.value
        else return Color.formatRgba(this.#rgba)
    }
    get colorRaw() {return this._color} // returns the declaration of the color
    get isChannel() {return this._isChannel}
    get rgba() {return this.#rgba}
    get hsv() {return this.#hsv}
    get r() {return this.#rgba[0]}
    get g() {return this.#rgba[1]}
    get b() {return this.#rgba[2]}
    get a() {return this.#rgba[3]}
    get hue() {return this.#hsv[0]}
    get saturation() {return this.#hsv[1]}
    get brightness() {return this.#hsv[2]}

    set color(color) {
        this._color = color?._color||color
        this._format = Color.getFormat(this._color)
        this.#updateCache()
    }
    set r(r) {this.#rgba[0] = CDEUtils.round(r, Color.DEFAULT_DECIMAL_ROUNDING_POINT)}
    set g(g) {this.#rgba[1] = CDEUtils.round(g, Color.DEFAULT_DECIMAL_ROUNDING_POINT)}
    set b(b) {this.#rgba[2] = CDEUtils.round(b, Color.DEFAULT_DECIMAL_ROUNDING_POINT)}
    set a(a) {this.#rgba[3] = CDEUtils.round(a, Color.DEFAULT_DECIMAL_ROUNDING_POINT)}
    set rgba(rgba) {
        this.#rgba[0] = CDEUtils.round(rgba[0], Color.DEFAULT_DECIMAL_ROUNDING_POINT)
        this.#rgba[1] = CDEUtils.round(rgba[1], Color.DEFAULT_DECIMAL_ROUNDING_POINT)
        this.#rgba[2] = CDEUtils.round(rgba[2], Color.DEFAULT_DECIMAL_ROUNDING_POINT)
        this.#rgba[3] = CDEUtils.round(rgba[3], Color.DEFAULT_DECIMAL_ROUNDING_POINT)
    }
    set hue(hue) {
        hue = hue%360
        if (this.#hsv[0] != hue) {
            this.#hsv[0] = hue
            this.#rgba = Color.#hsvToRgba(this.#hsv)
        }
    }
    set saturation(saturation) {
        saturation = saturation>100?100:saturation
        if (this.#hsv[1] != saturation) {
        this.#hsv[1] = saturation
        this.#rgba = Color.#hsvToRgba(this.#hsv)
        }
    }
    set brightness(brightness) {
        brightness = brightness>100?100:brightness
        if (this.#hsv[2] != brightness) {
            this.#hsv[2] = brightness
            this.#rgba = Color.#hsvToRgba(this.#hsv)
        }
    }
}

const colors = Object.entries(Color.CSS_COLOR_TO_RGBA_CONVERTIONS), c_ll = colors.length
for (let i=0;i<c_ll;i++) {
    const color = colors[i]
    Object.defineProperty(Color, color[0], {get() {return color[1]}})
}
// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Abstract class, provides color attributes to other classes
class _HasColor {
    constructor(color) {
        this._initColor = color       // declaration color value || (ctx, this)=>{return color value}
        this._color = this._initColor // the current color or gradient of the object
    }
    
    // returns the value of the inital color declaration
    getInitColor() {
        return CDEUtils.isFunction(this._initColor) ? this._initColor(this) : this._initColor||null
    }

    get colorObject() {return this._color}
    get colorRaw() {return this._color.colorRaw}
    get color() {return this._color?.color}
    get initColor() {return this._initColor}
    get rgba() {return this._color.rgba}
    get r() {return this._color.r}
    get g() {return this._color.g}
    get b() {return this._color.b}
    get a() {return this._color.a}
    get hsv() {return this._color.hsv}
    get hue() {return this._color.hue}
    get saturation() {return this._color.saturation}
    get brightness() {return this._color.brightness}

    set color(color) {
        const c = this._color
        if (!c || c?.colorRaw?.toString() !== color?.toString()) {
            const specialColor = color?.colorRaw||color
            if (specialColor?.positions==_DynamicColor.PLACEHOLDER) {
                if (!color.isChannel) color = specialColor.duplicate()
                else color = specialColor 
                color.initPositions = this
            }

            if (c instanceof Color) c.color = color
            else this._color = Color.adjust(color)
        }
    }
    set r(r) {this._color.r = r}
    set g(g) {this._color.g = g}
    set b(b) {this._color.b = b}
    set a(a) {this._color.a = a}
    set hue(hue) {this._color.hue = hue}
    set saturation(saturation) {this._color.saturation = saturation}
    set brightness(brightness) {this._color.brightness = brightness}
    set initColor(initColor) {this._initColor = initColor}
}
class GridAssets {
    static D = ["t","r","b","l","tr","br","bl","tl","i"].reduce((a,b,i)=>(a.places.push([a[b]=1<<i,(ar)=>{if(i==0){return -ar}else if(i==1){return 1}else if(i==2){return ar}else if(i==3){return -1}else if(i==4){return 1-ar}else if(i==5){return ar+1}else if(i==6){return ar-1}else if(i==7){return -ar-1}else if(i==8){return 0}}]),a),{places:[]})
    static DEFAULT_SOURCE = GridAssets.fontSource5x5

    static get fontSource5x5() {
        const D = GridAssets.D
        return {
            width:5,
            height:5,
            A: [
                [2,D.bl+D.br],
                [1,D.bl],[3,D.br],
                [0,D.r+D.b],[1,D.r],[2,D.r],[3,D.r],[4,D.b],
                [0,D.b],[4,D.b],
                [0],[4]
            ],B: [
                [0,D.r+D.b],[,D.r],[,D.r],[,D.br],
                [0,D.b],[4,D.bl],
                [0,D.r+D.b],[,D.r],[,D.r],[,D.br],
                [0,D.b],[4,D.bl],
                [0,D.r],[,D.r],[,D.r],[]
            ],C: [
                [1,D.r+D.bl],[,D.r],[,D.r],[],
                [0,D.b],
                [0,D.b],
                [0,D.br],
                [-1,D.r],[2,D.r],[,D.r],[]
            ],D: [
                [0,D.r+D.b],[,D.r],[,D.r],[,D.br],
                [0,D.b],[4,D.b],
                [0,D.b],[4,D.b],
                [0,D.b],[4,D.bl],
                [0,D.r],[,D.r],[,D.r],[]
            ],E: [
                [0,D.r+D.b],[,D.r],[,D.r],[,D.r],[],
                [0,D.b],
                [0,D.b+D.r],[,D.r],[,D.r],[,D.r],
                [0,D.b],
                [0,D.r],[,D.r],[,D.r],[,D.r],[]
            ],F: [
                [0,D.r+D.b],[,D.r],[,D.r],[,D.r],[],
                [0,D.b],
                [0,D.b+D.r],[,D.r],[,D.r],[],
                [0,D.b],
                [0]
            ],G: [
                [1,D.r+D.bl],[,D.r],[,D.r],[],
                [0,D.b],
                [0,D.b],[3,D.r],[4,D.b],
                [0,D.br],[4,D.b],
                [1,D.r],[,D.r],[,D.r],[]
            ],H: [
                [0,D.r+D.b],[4,D.b],
                [0,D.b],[4,D.b],
                [0,D.b+D.r],[,D.r],[,D.r],[,D.r],[,D.b],
                [0,D.b],[4,D.b],
                [0],[4]
            ],I: [
                [1,D.r],[,D.b+D.r],[],
                [2,D.b],
                [2,D.b],
                [2,D.b],
                [1,D.r],[,D.r],[]
            ],J: [
                [1,D.r],[,D.r],[,D.b+D.r],[],
                [3,D.b],
                [3,D.b],
                [0,D.br],[3,D.bl],
                [1,D.r],[,D.r]
            ],K: [
                [0,D.b],[3,D.bl],
                [0,D.b],[2,D.bl],
                [0,D.b+D.r],[,D.r+D.br],
                [0,D.b],[2,D.br],
                [0],[3,D.r]
            ],L: [
                [0,D.b],
                [0,D.b],
                [0,D.b],
                [0,D.b],
                [0,D.r],[,D.r],[,D.r],[,D.r]
            ],M: [
                [0,D.b+D.br],[4,D.b+D.bl],
                [0,D.b],[,D.br],[3,D.bl],[4,D.b],
                [0,D.b],[2],[4,D.b],
                [0,D.b],[4,D.b],
                [0],[4]
            ],N: [
                [0,D.b+D.br],[4,D.b],
                [0,D.b],[,D.br],[4,D.b],
                [0,D.b],[2,D.br],[4,D.b],
                [0,D.b],[3,D.br],[4,D.b],
                [0],[4]
            ],O: [
                [1,D.bl+D.r],[,D.r],[,D.br],
                [0,D.b],[4,D.b],
                [0,D.b],[4,D.b],
                [0,D.b+D.br],[4,D.b+D.bl],
                [1,D.r],[,D.r],[,D.r]
            ],P: [
                [0,D.r+D.b],[,D.r],[,D.br],
                [0,D.b],[3,D.bl],
                [0,D.b+D.r],[,D.r],[],
                [0,D.b],
                [0]
            ],Q: [
                [1,D.bl+D.r],[,D.r],[,D.br],
                [0,D.b],[4,D.b],
                [0,D.b],[4,D.b],
                [0,D.b+D.br],[3,D.br],[,D.bl],
                [1,D.r],[,D.r],[],[]
            ],R: [
                [0,D.r+D.b],[,D.r],[,D.br],
                [0,D.b],[3,D.bl],
                [0,D.b+D.r],[,D.r+D.br],[],
                [0,D.b],[2,D.br],
                [0],[3]
            ],S: [
                [1,D.r+D.bl],[,D.r],[,D.r],[],
                [0,D.br],
                [-1,D.r],[2,D.r],[,D.br],
                [-4,D.bl],
                [0,D.r+D.bl],[,D.r],[,D.r],[]
            ],T: [
                [0,D.r],[,D.r],[,D.b+D.r],[,D.r],[],
                [2,D.b],
                [2,D.b],
                [2,D.b],
                [2]
            ],U: [
                [0,D.r+D.b],[4,D.b],
                [0,D.b],[4,D.b],
                [0,D.b+D.r],[4,D.b],
                [0,D.br],[4,D.bl],
                [1,D.r],[,D.r],[,D.r]
            ],V: [
                [0,D.r+D.b],[4,D.b],
                [0,D.b],[4,D.b],
                [0,D.br],[4,D.bl],
                [1,D.br],[3,D.bl],
                [2,D.r],
            ],W: [
                [0,D.b+D.br],[4,D.b+D.bl],
                [0,D.b],[4,D.b],
                [0,D.b],[2,D.bl+D.br],[4,D.b],
                [0,D.b],[,D.bl],[3,D.br],[4,D.b],
                [0],[4]
            ],X: [
                [0,D.br],[4,D.bl],
                [1,D.br],[3,D.bl],
                [2,D.br+D.bl],
                [1,D.bl],[3,D.br],
                [0],[4]
            ],Y: [
                [0,D.br],[4,D.bl],
                [1,D.br],[3,D.bl],
                [2,D.b],
                [2,D.b],
                [2]
            ],Z: [
                [0,D.r],[,D.r],[,D.r],[,D.r],[,D.bl],
                [3,D.bl],
                [2,D.bl],
                [1,D.bl],
                [0,D.r],[,D.r],[,D.r],[,D.r],[]
            ],a: [
                [Infinity],
                [1,D.bl+D.r],[,D.br],
                [0,D.b],[3,D.b],
                [0,D.br],[3,D.bl+D.br],
                [1,D.r],[],[4,]
            ],b: [
                [0,D.b],
                [0,D.b],
                [0,D.b+D.r],[,D.r],[,D.br],
                [0,D.b],[3,D.bl],
                [0,D.r],[,D.r],[,D.r]
            ],c: [
                [Infinity],
                [1,D.r+D.bl],[,D.r],[],
                [0,D.b],
                [0,D.br],
                [-1,D.r],[2,D.r],[]
            ],d: [
                [3,D.b],
                [3,D.b],
                [1,D.bl+D.r],[,D.r],[,D.b],
                [0,D.br],[3,D.b],
                [1,D.r],[,D.r],[]
            ],e: [
                [1,D.r+D.bl],[,D.br],
                [0,D.b],[3,D.bl],
                [0,D.b+D.r],[,D.r],[],
                [0,D.br],[3,D.bl],
                [1,D.r],[]
            ],f: [
                [1,D.b+D.r],[],
                [1,D.b],
                [0,D.r],[,D.r+D.b],[],
                [1,D.b],
                [1]
            ],g: [
                [1,D.bl+D.r],[,D.br],
                [0,D.br],[3,D.bl],
                [1,D.r],[,D.br],
                [0,D.br],[3,D.bl],
                [1,D.r],[]
            ],h: [
                [0,D.b],
                [0,D.b],
                [0,D.b+D.r],[,D.r],[,D.br],
                [0,D.b],[3,D.b],
                [0],[3]
            ],i: [
                [Infinity],
                [1,D.i],
                [1,D.b],
                [1,D.b],
                [1]
            ],j: [
                [2,D.i],
                [2,D.b],
                [2,D.b],
                [0,D.br],[2,D.bl],
                [1]
            ],k: [
                [0,D.b],
                [0,D.b],[2,D.bl],
                [0,D.b],[2,D.bl],
                [0,D.b+D.r],[,D.br],
                [0],[2]
            ],l: [
                [0,D.b],
                [0,D.b],
                [0,D.b],
                [0,D.b],
                [0],
            ],m: [
                [Infinity],
                [1,D.bl+D.br],[3,D.bl+D.br],
                [0,D.b],[2,D.b],[4,D.b],
                [0,D.b],[2,D.b],[4,D.b],
                [0],[2],[4],
            ],n: [
                [Infinity],
                [0,D.b],[,D.bl+D.r],[,D.bl+D.br],
                [0,D.b],[3,D.b],
                [0,D.b],[3,D.b],
                [0],[3],
            ],o: [
                [Infinity],
                [1,D.bl+D.r],[,D.br],
                [0,D.b],[3,D.b],
                [0,D.br],[3,D.bl],
                [1,D.r],[],
            ],p: [
                [1,D.r+D.bl],[,D.br],
                [0,D.b],[3,D.bl],
                [0,D.b+D.r],[,D.r],[],
                [0,D.b],
                [0]
            ],q: [
                [1,D.r+D.bl],[,D.br],
                [0,D.br],[3,D.b],
                [1,D.r],[,D.r],[,D.b],
                [3,D.b],
                [3]
            ],r: [
                [Infinity],
                [0,D.b],[,D.bl+D.r],[],
                [0,D.b],
                [0,D.b],
                [0],
            ],s: [
                [Infinity],
                [2,D.bl+D.br],
                [1,D.br],[3],
                [1,D.br],[2,D.r],[,D.b],
                [2,D.r],[]
            ],t: [
                [2,D.b],
                [1,D.r],[,D.b+D.r],[],
                [2,D.b],
                [2,D.b],
                [2]
            ],u: [
                [Infinity],
                [0,D.b],[2,D.b],
                [0,D.b],[2,D.b],
                [0,D.br],[2,D.bl+D.br],
                [1,D.r],[3,]
            ],v: [
                [Infinity],
                [1,D.b],[3,D.b],
                [1,D.b],[3,D.b],
                [1,D.br],[3,D.bl],
                [2,D.r],
            ],w: [
                [Infinity],
                [0,D.b],[2,D.b],[4,D.b],
                [0,D.b],[2,D.b],[4,D.b],
                [0,D.br],[2,D.bl+D.br],[4,D.bl],
                [1],[3],
            ],x: [
                [1,D.b],[3,D.b],
                [1,D.br],[3,D.bl],
                [2,D.br+D.bl],
                [1,D.b],[3,D.b],
                [1],[3],
            ],y: [
                [Infinity],
                [1,D.b],[3,D.b],
                [1,D.br],[3,D.bl],
                [2,D.b],
                [2]
            ],z: [
                [Infinity],
                [0,D.r],[,D.r],[,D.r],[,D.bl],
                [2,D.bl],
                [1,D.bl],
                [0,D.r],[,D.r],[,D.r],[]
            ],"!": [
                [3,D.b],
                [3,D.b],
                [3,D.b],
                [3],
                [3, D.i],
            ],"?": [
                [1,D.r+D.bl],[,D.r],[,D.br],
                [0],[4,D.bl],
                [3,D.bl],
                [2],
                [2, D.i],
            ],"@": [
                [1,D.bl+D.r],[,D.r],[,D.br],
                [0,D.b],[2,D.bl+D.br],[4,D.b],
                [0,D.b],[1,D.br],[3,D.b],[4,D.b],
                [0,D.b+D.br],[2,D.r],[3,D.r],[4],
                [1,D.r],[,D.r],[,D.r]
            ],"#": [
                [1,D.b],[3,D.b],
                [0,D.r],[1,D.b+D.r],[2,D.r],[3,D.b+D.r],[],
                [1,D.b],[3,D.b],
                [0,D.r],[1,D.b+D.r],[2,D.r],[3,D.b+D.r],[],
                [1],[3],
            ],"$": [
                [1,D.r+D.bl],[,D.r+D.b],[,D.r],[],
                [0,D.br],[2,D.b],
                [1,D.r],[2,D.r+D.b],[,D.br],
                [2,D.b],[4,D.bl],
                [0,D.r+D.bl],[,D.r],[,D.r],[]
            ],"%": [
                [0,D.r+D.b],[1,D.b],[4,D.bl],
                [0,D.r],[],[3,D.bl],
                [2,D.bl],
                [1,D.bl],[3,D.r+D.b],[4,D.b],
                [0],[3,D.r],[]
            ],"^": [
                [2,D.br+D.bl],
                [1],[3],
            ],"&": [
                [0,D.r+D.br],[,D.r],[,D.r],[,D.bl],
                [1,D.br],[2,D.bl],
                [1,D.bl],[2,D.br],
                [0,D.br],[3,D.br],[,D.bl],
                [1,D.r],[2,D.r],[3],[],
            ],"*": [
                [1,D.br],[,D.b],[,D.bl],
                [1,D.r],[,D.r],[],
                [1,D.tr],[,D.t],[,D.tl]
            ],"(": [
                [3,D.bl],
                [2,D.b],
                [2,D.b],
                [2,D.br],
                [-3]
            ],")": [
                [1,D.br],
                [-2,D.b],
                [2,D.b],
                [2,D.bl],
                [1]
            ],"{": [
                [3,D.bl],
                [2,D.b],
                [1,D.r],[2,D.b],
                [2,D.br],
                [-3]
            ],"}": [
                [1,D.br],
                [-2,D.b],
                [2,D.b+D.r],[],
                [2,D.bl],
                [1]
            ],",": [
                [Infinity],
                [Infinity],
                [Infinity],
                [1,D.bl],
                [0]
            ],".": [
                [Infinity],
                [Infinity],
                [Infinity],
                [Infinity],
                [0,D.i]
            ],"+": [
                [Infinity],
                [2,D.b],
                [1,D.r],[2,D.b+D.r],[],
                [2],
            ],"_": [
                [Infinity],
                [Infinity],
                [Infinity],
                [Infinity],
                [0,D.r],[,D.r],[,D.r],[,D.r],[,D.r],
            ],"-": [
                [Infinity],
                [Infinity],
                [1,D.r],[,D.r],[]
            ],"=": [
                [Infinity],
                [1,D.r],[,D.r],[,D.r],
                [Infinity],
                [1,D.r],[,D.r],[,D.r],
            ],";": [
                [2,D.r+D.b],[3,D.b],
                [2,D.r],[],
                [2,D.r+D.b],[3,D.b],
                [2,D.r],[,D.b],
                [3],
            ],":": [
                [Infinity],
                [2,D.r+D.b],[3,D.b],
                [2,D.r],[],
                [2,D.r+D.b],[3,D.b],
                [2,D.r],[],
            ],"[": [
                [2,D.b+D.r],[3],
                [2,D.b],
                [2,D.b],
                [2,D.b],
                [2,D.r],[3]
            ],"]": [
                [1,D.r],[2,D.b],
                [2,D.b],
                [2,D.b],
                [2,D.b],
                [1,D.r],[2]
            ],"'": [
                [0,D.b],
                [0]
            ],"|": [
                [2,D.b],
                [2,D.b],
                [2,D.b],
                [2,D.b],
                [2],
            ],"/": [
                [4,D.bl],
                [3,D.bl],
                [2,D.bl],
                [1,D.bl],
                [0]
            ],"\\": [
                [0,D.br],
                [-1,D.br],
                [-2,D.br],
                [-3,D.br],
                [-4]
            ],"0": [
                [1,D.bl+D.r],[,D.br],
                [0,D.b],[3,D.b],
                [0,D.b],[,D.r],[],[,D.b],
                [0,D.b+D.br],[3,D.b+D.bl],
                [1,D.r],[,D.r]
            ],"1": [
                [2,D.b+D.bl],
                [1],[,D.b],
                [2,D.b],
                [2,D.b],
                [1,D.r],[,D.r],[],
            ],"2": [
                [1,D.r+D.bl],[,D.br],
                [0],[3,D.bl],
                [2,D.bl],
                [1,D.bl],
                [0,D.r],[,D.r],[,D.r],[,D.r],
            ],"3": [
                [1,D.r+D.bl],[,D.br],
                [0],[3,D.bl],
                [2,D.br],
                [0,D.br],[3,D.bl],
                [1,D.r],[,D.r]
            ],"4": [
                [3,D.b+D.bl],
                [2,D.bl],[,D.b],
                [1,D.bl],[3,D.b],
                [0,D.r],[,D.r],[,D.r],[,D.r+D.b],[,D.r],
                [3],
            ],"5": [
                [1,D.r+D.b],[,D.r],[,D.r],[],
                [1,D.b],
                [-1,D.r],[2,D.r],[,D.br],
                [-4,D.bl],
                [1,D.r+D.bl],[,D.r],[]
            ],"6": [
                [0,D.r+D.b],[,D.r],[,D.r],[,D.r],
                [0,D.b],
                [0,D.r+D.b],[,D.r],[,D.r],[,D.r+D.b],
                [0,D.b],[3,D.b],
                [0,D.r],[,D.r],[,D.r],[,D.r],
            ],"7": [
                [0,D.r],[,D.r],[,D.r],[,D.b],
                [3,D.bl],
                [1,D.r],[,D.bl+D.r],[],
                [1,D.bl],
                [0]
            ],"8": [
                [1,D.bl+D.r],[,D.br],
                [0,D.br],[3,D.bl],
                [1,D.bl+D.r],[,D.br],
                [0,D.b+D.br],[3,D.b+D.bl],
                [1,D.r],[,D.r]
            ],"9": [
                [1,D.r+D.bl],[,D.br],
                [0,D.br],[3,D.bl+D.b],
                [1,D.r],[],[,D.b],
                [3,D.b],
                [3],
            ]
        }
    }
}
// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don"t use or credit this code as your own.
//

// Represents the user"s keyboard
class TypingDevice {
    static KEYS = {A:"A", B:"B", C:"C", D:"D", E:"E", F:"F", G:"G", H:"H", I:"I", J:"J", K:"K", L:"L", M:"M", N:"N", O:"O", P:"P", Q:"Q", R:"R", S:"S", T:"T", U:"U", V:"V", W:"W", X:"X", Y:"Y", Z:"Z", DIGIT_0:"0", DIGIT_1:"1", DIGIT_2:"2", DIGIT_3:"3", DIGIT_4:"4", DIGIT_5:"5", DIGIT_6:"6", DIGIT_7:"7", DIGIT_8:"8", DIGIT_9:"9", SPACE:" ", ENTER:"ENTER", TAB:"TAB", BACKSPACE:"BACKSPACE", ESCAPE:"ESCAPE", SHIFT:"SHIFT", CONTROL:"CONTROL", ALT:"ALT", ALT_GRAPH:"ALTGRAPH", META:"META", CAPS_LOCK:"CAPSLOCK", CONTEXT_MENU:"CONTEXTMENU", ARROW_UP:"ARROWUP", ARROW_DOWN:"ARROWDOWN", ARROW_LEFT:"ARROWLEFT", ARROW_RIGHT:"ARROWRIGHT", HOME:"HOME", END:"END", PAGE_UP:"PAGEUP", PAGE_DOWN:"PAGEDOWN", INSERT:"INSERT", DELETE:"DELETE", F1:"F1", F2:"F2", F3:"F3", F4:"F4", F5:"F5", F6:"F6", F7:"F7", F8:"F8", F9:"F9", F10:"F10", F11:"F11", F12:"F12", F13:"F13", F14:"F14", F15:"F15", F16:"F16", F17:"F17", F18:"F18", F19:"F19", F20:"F20", F21:"F21", F22:"F22", F23:"F23", F24:"F24", NUMPAD_0:"NUMPAD0", NUMPAD_1:"NUMPAD1", NUMPAD_2:"NUMPAD2", NUMPAD_3:"NUMPAD3", NUMPAD_4:"NUMPAD4", NUMPAD_5:"NUMPAD5", NUMPAD_6:"NUMPAD6", NUMPAD_7:"NUMPAD7", NUMPAD_8:"NUMPAD8", NUMPAD_9:"NUMPAD9", NUMPAD_ADD:"NUMPADADD", NUMPAD_SUBTRACT:"NUMPADSUBTRACT", NUMPAD_MULTIPLY:"NUMPADMULTIPLY", NUMPAD_DIVIDE:"NUMPADDIVIDE", NUMPAD_DECIMAL:"NUMPADDECIMAL", NUMPAD_ENTER:"NUMPADENTER", PAUSE:"PAUSE", PRINT_SCREEN:"PRINTSCREEN", SCROLL_LOCK:"SCROLLLOCK", NUM_LOCK:"NUMLOCK", LAUNCH_APPLICATION_1:"LAUNCHAPPLICATION1", LAUNCH_APPLICATION_2:"LAUNCHAPPLICATION2", BRACKET_LEFT:"BRACKETLEFT", BRACKET_RIGHT:"BRACKETRIGHT", SEMICOLON:"SEMICOLON", QUOTE:"QUOTE", COMMA:"COMMA", PERIOD:"PERIOD", SLASH:"SLASH", BACKSLASH:"BACKSLASH", EQUAL:"EQUAL", MINUS:"MINUS", BACKQUOTE:"BACKQUOTE", AUDIO_VOLUME_UP:"AUDIOVOLUMEUP", AUDIO_VOLUME_DOWN:"AUDIOVOLUMEDOWN", AUDIO_VOLUME_MUTE:"AUDIOVOLUMEMUTE", MEDIA_PLAY_PAUSE:"MEDIAPLAYPAUSE", MEDIA_NEXT_TRACK:"MEDIANEXTTRACK", MEDIA_PREVIOUS_TRACK:"MEDIAPREVIOUSTRACK", MEDIA_STOP:"MEDIASTOP", BROWSER_BACK:"BROWSERBACK", BROWSER_FORWARD:"BROWSERFORWARD", BROWSER_REFRESH:"BROWSERREFRESH", BROWSER_STOP:"BROWSERSTOP", BROWSER_SEARCH:"BROWSERSEARCH", BROWSER_FAVORITES:"BROWSERFAVORITES", BROWSER_HOME:"BROWSERHOME"}

    constructor() {
        this._keysPressed = [] // Current keys pressed (down)
    }

    // sets a key as down based on a keydown event
    setDown(e) {
        const key = e.key?.toUpperCase()
        if (key && !this.isDown(key)) this._keysPressed.push({key, keyCode:e.keyCode})
    }

    // sets a key as up based on a keyup event
    setUp(e) {
        const key = e.key?.toUpperCase()
        if (key && this.isDown(key)) this._keysPressed = this._keysPressed.filter(v=>v.key!==key)
    }

    // returns whether the provided key, (any of, if keys is an array) is down
    isDown(keys) {
        const isMultipleKeys = Array.isArray(keys), keysPressed = this.keysPressed

        if (!isMultipleKeys) return keysPressed.includes(keys?.toUpperCase())
        else {
            const k_ll = keys.length
            for (let i=0;i<k_ll;i++) {
                const key = keys[i]?.toUpperCase()
                if (keysPressed.includes(key)) return true
            }
        }

        return false
    }

    // returns whether any key is pressed
    hasKeysDown() {
        return Boolean(this._keysPressed.length)
    }

    get keysPressedRaw() {return this._keysPressed}
    get keysPressed() {return this._keysPressed.map(v=>v.key)}
    get keyCodesPressed() {return this._keysPressed.map(v=>v.keyCode)}

	set keysPressed(keysPressed) {this._keysPressed = keysPressed}
}
// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Represents the user's mouse
class Mouse {
    static DEFAULT_MOUSE_DECELERATION = 0.8
    static DEFAULT_MOUSE_MOVE_TRESHOLD = 0.1
    static DEFAULT_MOUSE_ANGULAR_DECELERATION = 0.2
    static #LISTENER_ID_GIVER = 0
    static LISTENER_TYPES = {CLICK:0, DOWN:0, UP:1, MAIN_DOWN:0, MAIN_UP:1, MIDDLE_DOWN:2, MIDDLE_UP:3, RIGHT_DOWN:4, RIGHT_UP:5, EXTRA_FOWARD_DOWN:6, EXTRA_FOWARD_UP:7, EXTRA_BACK_DOWN:8, EXTRA_BACK_UP:9, MOVE:10, ENTER:11, LEAVE:12, EXIT:12}
    
    #lastX = null // previous x value of the mouse on the canvas, updated each frame
    #lastY = null // previous y value of the mouse on the canvas, updated each frame
    #wasWithin = []
    constructor(ctx) {
        this._ctx = ctx                  // canvas 2d context
        this._valid = false              // whether the mouse pos is valid (is inside the canvas and initialized)
        this._x = null                   // current x value of the mouse on the canvas
        this._y = null                   // current y value of the mouse on the canvas
        this._lastPos = [0,0]            // last mouse pos, updated each move event
        this._rawX = null                // current x value of the mouse on the canvas without any offsets
        this._rawY = null                // current y value of the mouse on the canvas without any offsets
        this._dir = null                 // direction in degrees of the mouse
        this._speed = null               // speed in px/s of the mouse
        this._clicked = false            // whether the main button of the mouse is active
        this._rightClicked = false       // whether the secondary button of the mouse is active
        this._scrollClicked = false      // whether the scroll button of the mouse is active (pressed)
        this._extraForwardClicked = false// whether the extra foward button of the mouse is active (not present on every mouse)
        this._extraBackClicked = false   // whether the extra back button of the mouse is active (not present on every mouse)
        this._holdValue = null           // a custom manual value. Ex: can be used to easily reference an object the mouse is holding
        this._listeners = []             // list of all current listeners

        this._moveListenersOptimizationEnabled = true // when true, only checks move listeners on mouse move, else checks every frame
    }

    // calculates and sets the current mouse speed (run every frame)
    calcSpeed(deltaTime) {
        const DECELERATION = Mouse.DEFAULT_MOUSE_DECELERATION
        if (isFinite(this.#lastX) && isFinite(this.#lastY) && deltaTime) {
            this._speed = this._speed*DECELERATION+(CDEUtils.getDist(this._x, this._y, this.#lastX, this.#lastY)/deltaTime)*(1-DECELERATION)
            if (this._speed < Mouse.DEFAULT_MOUSE_MOVE_TRESHOLD) this._speed = 0
        } else this._speed = 0

        this.#lastX = this._x
        this.#lastY = this._y
    }

    // calculates and set the current mouse direction (run on mouse move)
    calcAngle() {
        const dx = this._x-this.#lastX, dy = this._y-this.#lastY
        if (isFinite(dx) && isFinite(dy) && (dx||dy)) {
            let angle = (-CDEUtils.toDeg(Math.atan2(dy, dx))+360)%360, diff = angle-this._dir
            diff += (360*(diff<-180))-(360*(diff>180))
            this._dir = (this._dir+diff*Mouse.DEFAULT_MOUSE_ANGULAR_DECELERATION+360)%360
        } else this._dir = 0
    }

    // given an mouse event, sets the current mouse active buttons
    updateMouseClicks(e) {
        const isMouseDownEvent = e.type=="mousedown"||e.type=="touchstart", TYPES = Mouse.LISTENER_TYPES
        if (e.button==0) {
            this._clicked = isMouseDownEvent
            this.checkListeners(isMouseDownEvent?TYPES.MAIN_DOWN:TYPES.MAIN_UP)
        }
        else if (e.button==1) {
            this._scrollClicked = isMouseDownEvent
            this.checkListeners(isMouseDownEvent?TYPES.MIDDLE_DOWN:TYPES.MIDDLE_UP)
        }
        else if (e.button==2) {
            this._rightClicked = isMouseDownEvent
            this.checkListeners(isMouseDownEvent?TYPES.RIGHT_DOWN:TYPES.RIGHT_UP)
        }
        else if (e.button==3) {
            this._extraBackClicked = isMouseDownEvent
            this.checkListeners(isMouseDownEvent?TYPES.EXTRA_BACK_DOWN:TYPES.EXTRA_BACK_UP)
        }
        else if (e.button==4) {
            this._extraForwardClicked = isMouseDownEvent
            this.checkListeners(isMouseDownEvent?TYPES.EXTRA_FOWARD_DOWN:TYPES.EXTRA_FOWARD_UP)
        }
    }

    // invalidates mouse position
    invalidate() {
        this._x = Infinity
        this._y = Infinity
        this._rawX = Infinity
        this._rawY = Infinity
    }
    
    // updates current mouse position considering page offsets
    updatePos(x, y, offset) {
        this._valid = true
        this._rawX = x
        this._rawY = y
        this._x = x-offset[0]
        this._y = y-offset[1]

        if (this._moveListenersOptimizationEnabled) {
            this.checkListeners(Mouse.LISTENER_TYPES.ENTER)
            this.checkListeners(Mouse.LISTENER_TYPES.LEAVE)
        }

        this._lastPos[0] = this._x
        this._lastPos[1] = this._y
        this.checkListeners(Mouse.LISTENER_TYPES.MOVE)
    }

    // sets and returns whether the current mouse position is valid
    checkValid() {
        if (this._x == Infinity || this._x == null || this._y == Infinity || this._y == null) return this._valid = false
        else if (!this._valid) return this._valid = true
    }

    /**
     * Adds a custom mouse event listener binded to an object/area
     * @param {canvas object - [[x1,y1],[x2,y2]]} obj: Either a canvas object or a positions array 
     * @param {LISTENER_TYPES} type: One of Mouse.LISTENER_TYPES
     * @param {Function} callback: a custom function called upon event trigger. (obj, mousePos)=> 
     * @param {Boolean} useAccurateBounds: If true, uses the obj's accurate bounds calculation
     * @param {Boolean} forceStaticPositions: If true, stores the obj positions statically, rather than the entire object 
     * @returns The listener id
     */
    addListener(obj, type, callback, useAccurateBounds=false, forceStaticPositions=false) {
        const hasAccurateBounds = useAccurateBounds&&obj.getBoundsAccurate, listener = [forceStaticPositions?(hasAccurateBounds?obj.getBoundsAccurate():obj.getBounds()):obj, callback, hasAccurateBounds, Mouse.#LISTENER_ID_GIVER++]
        if (!this._listeners[type]) this._listeners[type] = []
        this._listeners[type].push(listener)
        return listener[2]
    }

    // checks conditions for every listeners of a certain type, if valid, calls the listeners callback as such: (obj, mousePos)=>
    checkListeners(type) {
        const typedListeners = this._listeners[type], typedListeners_ll = typedListeners?.length

        if (typedListeners_ll) {
            let TYPES = Mouse.LISTENER_TYPES, mousePos = this.pos, validation = true

            if (type >= TYPES.ENTER) {
                validation = 2
                if (type==TYPES.LEAVE) validation = 1

                for (let i=0;i<typedListeners_ll;i++) {
                    const typedListener = typedListeners[i], obj = typedListener[0], callback = typedListener[1], hasAccurateBounds = typedListener[2], isPath2D = obj instanceof Path2D, isStaticBounds = Array.isArray(obj)||isPath2D,
                           nowWithin = ((!isStaticBounds && (hasAccurateBounds?obj.isWithinAccurate(mousePos):obj.isWithin(mousePos))) || (isStaticBounds && this.isWithin(mousePos, obj, isPath2D)))
                    
                    if (this._moveListenersOptimizationEnabled) {
                        if ((nowWithin*2)+((!isStaticBounds && (hasAccurateBounds?obj.isWithinAccurate(this._lastPos):obj.isWithin(this._lastPos))) || (isStaticBounds && this.isWithin(this._lastPos, obj, isPath2D)))==validation) callback(mousePos, this, obj)
                    } else {
                        const wasWithin = this.#wasWithin[typedListener[3]]
                        if (!wasWithin && nowWithin) {
                            this.#wasWithin[typedListener[3]] = true
                            if (validation==2) callback(mousePos, this, obj)
                        } else if (!nowWithin && wasWithin) {
                            this.#wasWithin[typedListener[3]] = false
                            if (validation==1) callback(mousePos, this, obj)
                        }
                    }
                }
            } else {
                if (type==TYPES.MAIN_DOWN||type==TYPES.RIGHT_DOWN||type==TYPES.MIDDLE_DOWN||type==TYPES.EXTRA_BACK_DOWN||type==TYPES.EXTRA_FOWARD_DOWN) validation = this._clicked
                else if (type==TYPES.MAIN_UP||type==TYPES.RIGHT_UP||type==TYPES.MIDDLE_UP||type==TYPES.EXTRA_BACK_UP||type==TYPES.EXTRA_FOWARD_UP) validation = !this._clicked
                else validation = true

                for (let i=0;i<typedListeners_ll;i++) {
                    const [obj, callback, hasAccurateBounds] = typedListeners[i], isPath2D = obj instanceof Path2D, isStaticBounds = Array.isArray(obj)||isPath2D
                    if (validation && ((!isStaticBounds && (hasAccurateBounds?obj.isWithinAccurate(mousePos):obj.isWithin(mousePos))) || (isStaticBounds && this.isWithin(mousePos, obj, isPath2D)))) callback(mousePos, this, obj)
                }
            }
        }
    }

    /**
     * Updates an existing listener
     * @param {LISTENER_TYPES} type: One of Mouse.LISTENER_TYPES
     * @param {Number} id: listener's id 
     * @param {canvas object | [[x1,y1],[x2,y2]]?} newObj: if provided, updates the listeners's obj to this value
     * @param {Function?} newCallback: if provided, updates the listeners's callback to this value
     * @param {Boolean} useAccurateBounds: If true, uses the obj's accurate bounds calculation
     * @param {Boolean} forceStaticPositions: If true, stores the obj positions statically, rather than the entire object 
     */
    updateListener(type, id, newObj, newCallback, useAccurateBounds, forceStaticPositions=false) {
        const listener = this._listeners[type][this._listeners[type].findIndex(l=>l[3]==(id?.[3]??id))]
        if (newObj) listener[0] = forceStaticPositions?((useAccurateBounds && obj.getBoundsAccurate) ? obj.getBoundsAccurate() : obj.getBounds()) : obj
        if (newCallback) listener[1] = newCallback
        if (CDEUtils.isDefined(useAccurateBounds)) listener[2] = useAccurateBounds
    }

    /**
     * Removes one or all exisiting listeners of a certain type 
     * @param {LISTENER_TYPES} type: One of Mouse.LISTENER_TYPES
     * @param {Number | String} id: Either the listener's id or * to remove all listeners of this type 
     */
    removeListener(type, id) {
        this._listeners[type] = id=="*"?[]:this._listeners[type].filter(l=>l[3]!==(id?.[3]??id))
    }

    // returns whether the provided pos is inside the provided positions
    isWithin(pos, positions, isPath2D) {
        const [x,y]=pos
        if (isPath2D) return this._ctx.isPointInPath(positions, pos[0], pos[1])
        else return x >= positions[0][0] && x <= positions[1][0] && y >= positions[0][1] && y <= positions[1][1]
    }

    get ctx() {return this._ctx}
	get valid() {return this._valid}
	get x() {return this._x}
	get y() {return this._y}
	get pos() {return [this._x, this._y]}
    get rawX() {return this._rawX}
	get rawY() {return this._rawY}
	get rawPos() {return [this._rawX, this._rawY]}
	get deltaTimeLastX() {return this.#lastX}
	get deltaTimeLastY() {return this.#lastY}
	get lastX() {return this._lastPos[0]}
	get lastY() {return this._lastPos[0]}
	get lastPos() {return this._lastPos}
	get dir() {return this._dir}
	get speed() {return this._speed}
	get clicked() {return this._clicked}
	get scrollClicked() {return this._scrollClicked}
	get rightClicked() {return this._rightClicked}
	get extraBackClicked() {return this._extraBackClicked}
	get extraForwardClicked() {return this._extraForwardClicked}
	get holdValue() {return this._holdValue}
	get listeners() {return this._listeners}
    get moveListenersOptimizationEnabled() {return this._moveListenersOptimizationEnabled}

    set ctx(ctx) {this._ctx = ctx}
	set valid(valid) {this._valid = valid}
	set dir(_dir) {this._dir = _dir}
	set speed(_speed) {this._speed = _speed}
	set clicked(_clicked) {this._clicked = _clicked}
	set scrollClicked(_scrollClicked) {this._scrollClicked = _scrollClicked}
	set rightClicked(_rightClicked) {this._rightClicked = _rightClicked}
	set extraBackClicked(_extraBackClicked) {this._extraBackClicked = _extraBackClicked}
	set extraForwardClicked(_extraForwardClicked) {this._extraForwardClicked = _extraForwardClicked}
	set holdValue(holdValue) {this._holdValue = holdValue}
}
// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Drawing manager, centralises most context operation
class Render {
    static PROFILE_ID_GIVER = -1
    static TEXT_PROFILE_ID_GIVER = -1
    static COMPOSITE_OPERATIONS = {SOURCE_OVER: "source-over", SOURCE_IN: "source-in", SOURCE_OUT: "source-out", SOURCE_ATOP: "source-atop", DESTINATION_OVER: "destination-over", DESTINATION_IN: "destination-in", DESTINATION_OUT: "destination-out", DESTINATION_ATOP: "destination-atop", LIGHTER: "lighter", COPY: "copy", XOR: "xor", MULTIPLY: "multiply", SCREEN: "screen", OVERLAY: "overlay", DARKEN: "darken", LIGHTEN: "lighten", COLOR_DODGE: "color-dodge", COLOR_BURN: "color-burn", HARD_LIGHT: "hard-light", SOFT_LIGHT: "soft-light", DIFFERENCE: "difference", EXCLUSION: "exclusion", HUE: "hue", SATURATION: "saturation", COLOR: "color", LUMINOSITY: "luminosity"}
    static FILTERS = {BLUR:v=>`blur(${v}px)`,BRIGHTNESS:v=>`brightness(${v})`,CONTRAST:v=>`contrast(${v})`,DROPSHADOW:(value)=>`drop-shadow(${value})`,GRAYSCALE:v=>`grayscale(${v})`,HUE_ROTATE:v=>`hue-rotate(${v}deg)`,INVERT:v=>`invert(${v})`,OPACITY:v=>`opacity(${v})`,SATURATE:v=>`saturate(${v})`,SEPIA:v=>`sepia(${v})`,URL:v=>`url(${v})`}
    static DEFAULT_COMPOSITE_OPERATION = Render.COMPOSITE_OPERATIONS.SOURCE_OVER
    static DEFAULT_FILTER = "none"
    static DEFAULT_ALPHA = 1
    static PATH_TYPES = {LINEAR:Render.getLine, QUADRATIC:Render.getQuadCurve, CUBIC_BEZIER:Render.getBezierCurve, ARC:Render.getArc, ARC_TO:Render.getArcTo, ELLIPSE:Render.getEllispe, RECT:Render.getRect, POSITIONS_RECT:Render.getPositionsRect, ROUND_RECT:Render.getRoundRect, POSITIONS_ROUND_RECT:Render.getPositionsRoundRect}
    static LINE_TYPES = {LINEAR:Render.getLine, QUADRATIC:Render.getQuadCurve, CUBIC_BEZIER:Render.getBezierCurve}
    static DRAW_METHODS = {FILL:"FILL", STROKE:"STROKE"}
    static COLOR_TRANSFORMS = {NONE:null, INVERT:1, GRAYSCALE:2, SEPIA:3, RANDOMIZE:4, STATIC:5, MULTIPLY:6, BGRA:7, TINT:8, FORCE_TINT:9}

    #currentCtxVisuals = [Color.DEFAULT_COLOR_VALUE, Render.DEFAULT_FILTER, Render.DEFAULT_COMPOSITE_OPERATION, Render.DEFAULT_ALPHA]
    #currentCtxStyles = RenderStyles.DEFAULT_PROFILE.getStyles()
    #currentCtxTextStyles = TextStyles.DEFAULT_PROFILE.getStyles()
    constructor(ctx) {
        this._ctx = ctx               // Canvas context
        this._batchedStrokes = {}     // current batch of strokes
        this._batchedFills = {}       // current batch of fills
        this._bactchedStandalones = []// current array of drawings callbacks to be called once everything else has been drawn

        this._defaultProfile = RenderStyles.DEFAULT_PROFILE.duplicate(this)// default style profile template
        this._profile1 = this._defaultProfile.duplicate()                  // default style profile 1
        this._profile2 = this._defaultProfile.duplicate()                  // default style profile 2
        this._profile3 = this._defaultProfile.duplicate()                  // default style profile 3
        this._profile4 = this._defaultProfile.duplicate()                  // default style profile 4
        this._profile5 = this._defaultProfile.duplicate()                  // default style profile 5
        this._profiles = []                                                // list of custom style profiles

        this._defaultTextProfile = TextStyles.DEFAULT_PROFILE.duplicate(this)// default text style profile template
        this._textProfile1 = this._defaultTextProfile.duplicate()            // default text style profile 1
        this._textProfile2 = this._defaultTextProfile.duplicate()            // default text style profile 2
        this._textProfile3 = this._defaultTextProfile.duplicate()            // default text style profile 3
        this._textProfile4 = this._defaultTextProfile.duplicate()            // default text style profile 4
        this._textProfile5 = this._defaultTextProfile.duplicate()            // default text style profile 5
        this._textProfiles = []                                              // list of custom text style profiles
    }

    // instanciates and returns a path containing a line
    static getLine(startPos, endPos) {
        const path = new Path2D()
        path.moveTo(startPos[0],startPos[1])
        path.lineTo(endPos[0], endPos[1])
        return path
    }

    // instanciates and returns a path containing a quadratic curve
    static getQuadCurve(startPos, endPos, controlPos) {
        if (!Array.isArray(controlPos)) controlPos = Render.getDefaultQuadraticControlPos(startPos, endPos, controlPos||undefined)

        const path = new Path2D()
        path.moveTo(startPos[0],startPos[1])
        path.quadraticCurveTo(controlPos[0], controlPos[1], endPos[0], endPos[1])
        return path
    }

    // returns a control pos to create a decent default quadratic curve
    static getDefaultQuadraticControlPos(startPos, endPos, spread=1) {
        return [endPos[0]*spread, startPos[1]*spread]
    }

    // instanciates and returns a path containing a cubic bezier curve
    static getBezierCurve(startPos, endPos, controlPos1, controlPos2) {
        if (!controlPos2 || !controlPos1) {
            const controlPoses = Render.getDefaultBezierControlPos(startPos, endPos, controlPos1||undefined)
            controlPos1 = controlPoses[0]
            controlPos2 ??= controlPoses[1]
        }
    
        const path = new Path2D()
        path.moveTo(startPos[0], startPos[1])
        path.bezierCurveTo(controlPos1[0], controlPos1[1], controlPos2[0], controlPos2[1], endPos[0], endPos[1])
        return path
    }

    // returns 2 control positions to create a decent default bezier curve
    static getDefaultBezierControlPos(startPos, endPos, spread=0.75) {
        const [startX, startY] = startPos, [endX, endY] = endPos
        return [[startX+(endX-startX)*(1-spread), startY+(endY-startY)*spread], [endX-(endX-startX)*(1-spread), endY-(endY-startY)*spread]]
    }

    // instanciates and returns a path containing an arc
    static getArc(pos, radius=5, startRadian=0, endRadian=CDEUtils.CIRC) {
        const path = new Path2D()
        path.arc(pos[0], pos[1], radius, startRadian, endRadian)
        return path
    }

    // instanciates and returns a path containing an arcTo
    static getArcTo(startPos, controlPos1, controlPos2, radius) {
        const path = new Path2D()
        path.moveTo(startPos[0], startPos[1])
        path.arcTo(controlPos1[0], controlPos1[1], controlPos2[0], controlPos2[1], radius)
        return path
    }

    // instanciates and returns a path containing an ellipse
    static getEllispe(centerPos, radiusX, radiusY, rotationRadian=0, startRadian=0, endRadian=CDEUtils.CIRC, counterclockwise=false) {
        const path = new Path2D()
        path.ellipse(centerPos[0], centerPos[1], radiusX, radiusY, rotationRadian, startRadian, endRadian, counterclockwise)
        return path
    }

    // instanciates and returns a path containing an rectangle
    static getRect(pos, width, height) {
        const path = new Path2D()
        path.rect(pos[0], pos[1], width, height)
        return path
    }

    // instanciates and returns a path containing an rectangle
    static getPositionsRect(pos, pos2) {
        const path = new Path2D(), x1 = pos[0], y1 = pos[1]
        path.rect(x1, y1, pos2[0]-x1, pos2[1]-y1)
        return path
    }

    // instanciates and returns a path containing an rounded rectangle
    static getRoundRect(pos, width, height, radius) {
        const path = new Path2D()
        path.roundRect(pos[0], pos[1], width, height, radius)
        return path
    }

    // instanciates and returns a path containing an rounded rectangle
    static getPositionsRoundRect(pos, pos2, radius=5) {
        const path = new Path2D(), x1 = pos[0], y1 = pos[1]
        path.roundRect(x1, y1, pos2[0]-x1, pos2[1]-y1, radius)
        return path
    }

    // creates and adds a new custom RenderStyles profile base on a given base profile
    createCustomStylesProfile(baseProfile=this._defaultProfile) {
        const profile = baseProfile.duplicate()
        this._profiles.push(profile)
        return profile
    }

    // creates and adds a new custom TextStyles profile base on a given base profile
    createCustomTextStylesProfile(baseTextProfile=this._defaultTextProfile) {
        const textProfile = baseTextProfile.duplicate()
        this._textProfiles.push(textProfile)
        return textProfile
    }

    // Queues a path to be stroked in batch at the end of the current frame. RenderStyles can either be a strict color or a RenderStyle profile
    batchStroke(path, renderStyles=Color.DEFAULT_RGBA, forceVisualEffects=[]) {
        if ((renderStyles[3]??renderStyles.a??1) > Color.OPACITY_VISIBILITY_THRESHOLD) {
            const batch = this._batchedStrokes, filter = forceVisualEffects[0], compositeOperation = forceVisualEffects[1], opacity = forceVisualEffects[2], profileKey = renderStyles instanceof RenderStyles ? renderStyles.toString(undefined, filter, compositeOperation, opacity) : this._defaultProfile.toString(renderStyles, filter, compositeOperation, opacity)
            if (!batch[profileKey]) batch[profileKey] = new Path2D()
            batch[profileKey].addPath(path)
        }
    }

    // Queues a path to be filled in batch at the end of the current frame. RenderStyles can either be a strict color or a RenderStyle profile
    batchFill(path, renderStyles=Color.DEFAULT_RGBA, forceVisualEffects=[]) {
        if ((renderStyles[3]??renderStyles.a??1) > Color.OPACITY_VISIBILITY_THRESHOLD) {
            const batch = this._batchedFills, filter = forceVisualEffects[0], compositeOperation = forceVisualEffects[1], opacity = forceVisualEffects[2], profileKey = renderStyles instanceof RenderStyles ? renderStyles.fillOptimizedToString(undefined, filter, compositeOperation, opacity) : this._defaultProfile.fillOptimizedToString(renderStyles, filter, compositeOperation, opacity)
            if (!batch[profileKey]) batch[profileKey] = new Path2D()
            batch[profileKey].addPath(path)
        } 
    }

    // Fills and strokes all batched paths
    drawBatched() {
        const strokes = Object.entries(this._batchedStrokes), s_ll = strokes.length,
              fills = Object.entries(this._batchedFills), f_ll = fills.length,
              ctx = this._ctx,
              standalones = this._bactchedStandalones, o_ll = standalones.length,
              gradientSep = Gradient.SERIALIZATION_SEPARATOR, patternSep = Pattern.SERIALIZATION_SEPARATOR,
              DEF_FILTER = Render.DEFAULT_FILTER, DEF_COMP = Render.DEFAULT_COMPOSITE_OPERATION, DEF_ALPHA = Render.DEFAULT_ALPHA

        for (let i=0;i<s_ll;i++) {
            let stroke = strokes[i], profileKey = stroke[0], path = stroke[1], profile = profileKey.split(RenderStyles.SERIALIZATION_SEPARATOR), colorValue = profile[0], lineDash = profile[5]
            if (colorValue.includes(gradientSep)) colorValue = Gradient.getCanvasGradientFromString(ctx, colorValue)
            else if (colorValue.includes(patternSep)) colorValue = Pattern.LOADED_PATTERN_SOURCES[colorValue.split(patternSep)[0]].value
        
            let lineDashValue = []
            if (lineDash) {
                let l_ll = lineDash.length, at = 0
                for (let i=0;i<=l_ll;i++) {
                    if (lineDash[i]=="," || i==l_ll) {
                        const v = +(lineDash.slice(at, i).trim())
                        if (v) lineDashValue.push(v)
                        at = i+1
                    }
                }
            } else lineDashValue[0] = 0

            RenderStyles.apply(this, colorValue, profile[1], profile[2], profile[3], profile[4], lineDashValue, profile[6], profile[7], profile[8])
            ctx.stroke(path)
        }
        RenderStyles.apply(this, null, DEF_FILTER, DEF_COMP, DEF_ALPHA)

        for (let i=0;i<f_ll;i++) {
            let fill = fills[i], profileKey = fill[0], path = fill[1], profile = profileKey.split(RenderStyles.SERIALIZATION_SEPARATOR), colorValue = profile[0]
            if (colorValue.includes(gradientSep)) colorValue = Gradient.getCanvasGradientFromString(ctx, colorValue)
            else if (colorValue.includes(patternSep)) colorValue = Pattern.LOADED_PATTERN_SOURCES[colorValue.split(patternSep)[0]].value
            RenderStyles.apply(this, colorValue, profile[1], profile[2], profile[3])
            ctx.fill(path)
        }
        RenderStyles.apply(this, null, DEF_FILTER, DEF_COMP, DEF_ALPHA)

        if (o_ll) {
            for (let i=0;i<o_ll;i++) standalones[i]()
            this._bactchedStandalones = []
        }

        this._batchedStrokes = {}
        this._batchedFills = {}
    }

    // directly strokes a path on the canvas. RenderStyles can either be a strict color or a RenderStyle profile
    stroke(path, renderStyles=Color.DEFAULT_RGBA, forceVisualEffects=[]) {
        if ((renderStyles[3]??renderStyles.a??1) > Color.OPACITY_VISIBILITY_THRESHOLD) {
            const filter = forceVisualEffects[0], compositeOperation = forceVisualEffects[1], opacity = forceVisualEffects[2]
            if (renderStyles instanceof RenderStyles) renderStyles.apply(undefined, filter, compositeOperation, opacity)
            else this._defaultProfile.apply(renderStyles, filter, compositeOperation, opacity)

            this._ctx.stroke(path)
            RenderStyles.apply(this, null, Render.DEFAULT_FILTER, Render.DEFAULT_COMPOSITE_OPERATION, Render.DEFAULT_ALPHA)
        }
    }

    // directly fills a path on the canvas. RenderStyles can either be a strict color or a RenderStyle profile
    fill(path, renderStyles=Color.DEFAULT_RGBA, forceVisualEffects=[]) {
        if ((renderStyles[3]??renderStyles.a??1) > Color.OPACITY_VISIBILITY_THRESHOLD) {
            const filter = forceVisualEffects[0], compositeOperation = forceVisualEffects[1], opacity = forceVisualEffects[2]
            if (renderStyles instanceof RenderStyles) renderStyles.apply(undefined, filter, compositeOperation, opacity)
            else this._defaultProfile.apply(renderStyles, filter, compositeOperation, opacity)

            this._ctx.fill(path)
            RenderStyles.apply(this, null, Render.DEFAULT_FILTER, Render.DEFAULT_COMPOSITE_OPERATION, Render.DEFAULT_ALPHA)
        }
    }

    // directly strokes text on the canvas. TextStyles can either be a strict color or a TextStyles profile
    strokeText(text, pos, color, textStyles, maxWidth=undefined, lineHeight=TextDisplay.DEFAULT_LINE_HEIGHT, visualEffects=[]) {
        if (text) {
            const colorValue = Color.getColorValue(color), currentCtxVisuals = this.#currentCtxVisuals, ctx = this._ctx
            if (textStyles instanceof TextStyles) textStyles.apply()
            else this._defaultTextProfile.apply(textStyles)
        
            if (color && currentCtxVisuals[0] !== colorValue) currentCtxVisuals[0] = ctx.strokeStyle = ctx.fillStyle = colorValue
            if (visualEffects?.length) RenderStyles.apply(this, null, visualEffects[0], visualEffects[1], visualEffects[2])
            
            if (text.includes("\n")) {
                const lines = text.split("\n"), lines_ll = lines.length
                for (let i=0;i<lines_ll;i++) ctx.strokeText(lines[i], pos[0], pos[1]+i*lineHeight, maxWidth)
            } else ctx.strokeText(text, pos[0], pos[1], maxWidth)

            RenderStyles.apply(this, null, Render.DEFAULT_FILTER, Render.DEFAULT_COMPOSITE_OPERATION, Render.DEFAULT_ALPHA)
        }
    }

    // directly fills text on the canvas. TextStyles can either be a strict color or a TextStyles profile
    fillText(text, pos, color, textStyles, maxWidth=undefined, lineHeight=TextDisplay.DEFAULT_LINE_HEIGHT, visualEffects=[]) {
        if (text) {
            const colorValue = Color.getColorValue(color), currentCtxVisuals = this.#currentCtxVisuals, ctx = this._ctx
            if (textStyles instanceof TextStyles) textStyles.apply()
            else this._defaultTextProfile.apply(textStyles)

            if (color && currentCtxVisuals[0] !== colorValue) currentCtxVisuals[0] = ctx.strokeStyle = ctx.fillStyle = colorValue
            if (visualEffects?.length) RenderStyles.apply(this, null, visualEffects[0], visualEffects[1], visualEffects[2])

            if (text.includes("\n")) {
                const lines = text.split("\n"), lines_ll = lines.length
                for (let i=0;i<lines_ll;i++) ctx.fillText(lines[i], pos[0], pos[1]+i*lineHeight, maxWidth)
            } else ctx.fillText(text, pos[0], pos[1], maxWidth)

            RenderStyles.apply(this, null, Render.DEFAULT_FILTER, Render.DEFAULT_COMPOSITE_OPERATION, Render.DEFAULT_ALPHA)
        }
    }

    // directly draws an image on the canvas
    drawImage(img, pos, size, croppingPositions, visualEffects=[]) {
        if (visualEffects?.length) RenderStyles.apply(this, null, visualEffects[0], visualEffects[1], visualEffects[2])

        if (croppingPositions) {
            const [[cropStartX, cropStartY], [cropEndX, cropEndY]] = croppingPositions
            this._ctx.drawImage(img, cropStartX, cropStartY, cropEndX-cropStartX, cropEndY-cropStartX, pos[0], pos[1], size[0], size[1])
        } else this._ctx.drawImage(img, pos[0], pos[1], size[0], size[1])

        RenderStyles.apply(this, null, Render.DEFAULT_FILTER, Render.DEFAULT_COMPOSITE_OPERATION, Render.DEFAULT_ALPHA)
    }

    // directly draws an image on the canvas once everything else has been drawn
    drawLateImage(img, pos, size, croppingPositions, visualEffects=[]) {
        this._bactchedStandalones.push(()=>{
            if (visualEffects?.length) RenderStyles.apply(this, null, visualEffects[0], visualEffects[1], visualEffects[2])

            if (croppingPositions) {
                const [[cropStartX, cropStartY], [cropEndX, cropEndY]] = croppingPositions
                this._ctx.drawImage(img, cropStartX, cropStartY, cropEndX-cropStartX, cropEndY-cropStartX, pos[0], pos[1], size[0], size[1])
            } else this._ctx.drawImage(img, pos[0], pos[1], size[0], size[1])

            RenderStyles.apply(this, null, Render.DEFAULT_FILTER, Render.DEFAULT_COMPOSITE_OPERATION, Render.DEFAULT_ALPHA)
        })
    }

    /**
     * Replaces a color on the canvas by another one in a specified area
     * @param {Color | [r,g,b,a]} targetColor: The color to be replaced by newColor
     * @param {Color | [r,g,b,a]} newColor: The color replacing targetColor
     * @param {Number, [rT,gT,bT]} temperance: The validity margin for the r, g, b values of the targetColor
     * @param {[[x, y], [x, y]] | null} area: A positions array defining the area to replace the color in
     * @param {Number} densityDivider: The higher the divider, the more pixels will skip the processing. (Defaults to 1, meaning every pixel gets processed)
     * @param {Boolean} preventLate: If true, doesn't include colors from batched operations
     */
    replaceColor(targetColor, newColor=Color.DEFAULT_RGBA, temperance=Color.DEFAULT_TEMPERANCE, area=null, densityDivider=1, preventLate=false) {
        const core = ()=>{
            const ctx = this._ctx, cvs = ctx.canvas, startX = area?.[0]?.[0]??0, startY = area?.[0]?.[1]??0,
            img = ctx.getImageData(startX, startY, (area?.[1]?.[0]-startX)||cvs.width, (area?.[1]?.[1]-startY)||cvs.height), data = img.data, d_ll = data.length,
            r = targetColor.r??targetColor[0], g = targetColor.g??targetColor[1], b = targetColor.b??targetColor[2],
            nr = newColor.r??newColor[0], ng = newColor.g??newColor[1], nb = newColor.b??newColor[2], na = (newColor.a??newColor[3])*255,
            pxStep = 4*(densityDivider>0?densityDivider:1)

            if (temperance) {
                let currentR, currentG, currentB, rT = temperance[0]??temperance, gT = temperance[1]??temperance, bT = temperance[2]??temperance, br = r-rT, bg = g-gT, bb = b-bT, tr = r+rT, tg = g+gT, tb = b+bT
                for (let i=0;i<d_ll;i+=pxStep) {
                    currentR = data[i]
                    if (currentR >= br && currentR <= tr) {
                        currentG = data[i+1]
                        currentB = data[i+2]
                        if (currentG >= bg && currentG <= tg && currentB >= bb && currentB <= tb) {
                            data[i]   = nr
                            data[i+1] = ng
                            data[i+2] = nb
                            data[i+3] = na
                        }
                    }
                }
            }
            else for (let i=0;i<d_ll;i+=pxStep) {
                if (data[i] == r && data[i+1] == g && data[i+2] == b) {
                    data[i]   = nr
                    data[i+1] = ng
                    data[i+2] = nb
                    data[i+3] = na
                }
            }
            ctx.putImageData(img, startX, startY)
        }

        if (preventLate) core()
        else this._bactchedStandalones.push(core)
    }

    /**
     * Applies pixel manipulation to a specified area
     * @param {Render.COLOR_TRANSFORMS} transform 
     * @param {Number | Array} modifier: the modifier value 
     * @param {[[x, y], [x, y]] | null} area: A positions array defining the area to replace the color in
     * @param {Number} densityDivider: The higher the divider, the more pixels will skip the processing. (Defaults to 1, meaning every pixel gets processed)
     * @param {Boolean} preventLate: If true, doesn't include colors from batched operations
     */
    transformArea(transform=COLOR_TRANSFORMS.NONE, modifier, area=null, densityDivider=1, preventLate=false) {
        if (transform) {
            const core = ()=>{
                const ctx = this._ctx, cvs = ctx.canvas, startX = area?.[0]?.[0]??0, startY = area?.[0]?.[1]??0,
                img = ctx.getImageData(startX, startY, (area?.[1]?.[0]-startX)||cvs.width, (area?.[1]?.[1]-startY)||cvs.height),
                data = img.data, d_ll = data.length, transforms = Render.COLOR_TRANSFORMS, random = CDEUtils.random, pxStep = 4*(densityDivider>0?densityDivider:1)

                if (transform==transforms.INVERT) {
                    modifier??=1
                    for (let i=0;i<d_ll;i+=pxStep) {
                        const r=data[i], g=data[i+1], b=data[i+2]
                        data[i]   = (modifier*255)-r
                        data[i+1] = (modifier*255)-g
                        data[i+2] = (modifier*255)-b
                    }
                } else if (transform==transforms.GRAYSCALE) {
                    modifier??=1
                    for (let i=0;i<d_ll;i+=pxStep) {
                        const average = (data[i]+data[i+1]+data[i+2])/3
                        data[i]   = average*modifier
                        data[i+1] = average*modifier
                        data[i+2] = average*modifier
                    }
                } else if (transform==transforms.SEPIA) {
                    modifier??=1
                    for (let i=0;i<d_ll;i+=pxStep) {
                        const r=data[i], g=data[i+1], b=data[i+2]
                        data[i]   = (r*.393+g*.769+b*.189)*modifier
                        data[i+1] = (r*.349+g*.686+b*.168)*modifier
                        data[i+2] = (r*.272+g*.534+b*.131)*modifier
                    }
                } else if (transform==transforms.RANDOMIZE) {
                    modifier||=[0, 255]
                    for (let i=0;i<d_ll;i+=pxStep) {
                        data[i]   = random(modifier[0], modifier[1])
                        data[i+1] = random(modifier[0], modifier[1])
                        data[i+2] = random(modifier[0], modifier[1])
                    }
                } else if (transform==transforms.STATIC) {
                    modifier||=[0, 255]
                    for (let i=0;i<d_ll;i+=pxStep) data[i] = data[i+1] = data[i+2] = random(modifier[0], modifier[1])
                }
                else if (transform==transforms.MULTIPLY) {
                    modifier??=1
                    for (let i=0;i<d_ll;i+=pxStep) {
                        data[i]   *= modifier
                        data[i+1] *= modifier
                        data[i+2] *= modifier
                    }
                } else if (transform==transforms.BGRA) {
                    modifier??=1
                    for (let i=0;i<d_ll;i+=pxStep) {
                        const r=data[i], g=data[i+1], b=data[i+2]
                        data[i]   = b*modifier
                        data[i+1] = g*modifier
                        data[i+2] = r*modifier
                    }
                } else if (transform==transforms.TINT) {
                    modifier||=[255,255,255,1]
                    for (let i=0;i<d_ll;i+=pxStep) {
                        data[i]   += modifier[0]
                        data[i+1] += modifier[1]
                        data[i+2] += modifier[2]
                        data[i+3] += modifier[3]
                    }
                } else if (transform==transforms.FORCE_TINT) {
                    modifier||=[255,255,255,1]
                    for (let i=0;i<d_ll;i+=pxStep) {
                        data[i]   = modifier[0]
                        data[i+1] = modifier[1]
                        data[i+2] = modifier[2]
                    }
                }
        
                ctx.putImageData(img, startX, startY)
            }

            if (preventLate) core()
            else this._bactchedStandalones.push(core)
        }
    }

    /**
     * The generate() function allows the generation of a custom graph
     * @param {[x, y]} startPos: pos array defining the starting pos
     * @param {Function} yFn: a function providing a Y value depanding on a given X value. (x)=>{... return y}
     * @param {Number} width: the width in pixels of the generation result. Negative values will generate reversed left-side graphs
     * @param {Number} segmentCount: precision in segments of the generated result
     * @param {Function} baseGeneration: callback returning a path2d which will receive this generation result
     * @returns {Path2D | null} The generated path or null if the width or segmentCount is lower than 1
     */
    static generate(startPos, yFn, width, segmentCount=100, baseGeneration=null) {
        startPos??=[0,0]
        yFn??=()=>0
        width??=100
        segmentCount??=100

        const dir = Math.sign(width), w = Math.abs(width)+.1
        if (w > 1 && segmentCount > 1) {
            const segmentWidth = (w-.1)/segmentCount, ix = startPos[0], iy = startPos[1], path = baseGeneration?baseGeneration(startPos, yFn, width, segmentCount):new Path2D()
            path.moveTo(ix, iy+yFn(0))
            for (let x=0;x<=w;x+=segmentWidth) path.lineTo(ix+(x*dir), iy+yFn(x*dir))
            return path
        }
        return null
    }

    /**
     * Given the following parameters, returns the endPos of a path generated with Render.generate()
     * @param {[x, y]} startPos: pos array defining the starting pos
     * @param {Function} yFn: a function providing a Y value depanding on a given X value. (x)=>{... return y}
     * @param {Number} width: the width in pixels of the generation result
     * @returns {[x, y]} the end pos
     */
    static getGenerationEndPos(startPos, yFn, width) {
        return CDEUtils.addPos(startPos, [width, CDEUtils.round(yFn(width), _BaseObj.POSITION_PRECISION)])
    }

    /**
     * Create a path connecting all the pos/obj provided in parameter
     * @param {Array} posArrays: An array of pos or obj to draw a connection to. The connections are drawn in order of their index.
     * @param {Render.LINE_TYPES | null} lineType: The line type used to create the path. Leave null/undefined for slightly more optimized linear lines. 
     * @returns The created path.
     */
      static composePath(posArrays, lineType) {
        const path = new Path2D(), a_ll = posArrays.length, firstPos = posArrays[0]
        path.moveTo(firstPos[0], firstPos[1])
        for (let i=1;i<a_ll;i++) {
            const pos = posArrays[i].pos||posArrays[i]
            if (lineType) path.addPath(lineType(posArrays[i-1].pos||posArrays[i-1], pos))
            else path.lineTo(pos[0], pos[1])
        }
        return path
    }

    /**
     * Combines all provided paths together
     * @param {Array} paths: an array containing path2ds 
     * @returns A single path2d containing all of the provided paths
     */
    static mergePaths(paths) {
        const p_ll = paths.length, initPath = paths[0]
        for (let i=1;i<p_ll;i++) initPath.addPath(paths[i])
        return initPath
    }

    static Y_FUNCTIONS = {
        SINUS: (height=100, periodWidth=100)=>{
            height??=100
            periodWidth??=100
            periodWidth = (2*Math.PI/Math.abs(periodWidth))

            const sin = Math.sin, a = (Math.abs(height)/2)*Math.sign(height)
            return x=>a*sin(periodWidth*x)
        },
        COSINUS: (height=100, periodWidth=100)=>{
            height??=100
            periodWidth??=100
            periodWidth = (2*Math.PI/Math.abs(periodWidth))

            const cos = Math.cos, a = (Math.abs(height)/2)*Math.sign(height)
            return x=>a*cos(periodWidth*x)
        },
        LINEAR: (a=1)=>{
            a??=1
            return x=>a*x
        }
    }

	get ctx() {return this._ctx}
	get batchedStrokes() {return this._batchedStrokes}
	get batchedFills() {return this._bactchedStandalones}
	get batchedStandalones() {return this._batchedImages}
	get defaultProfile() {return this._defaultProfile}
	get profile1() {return this._profile1}
	get profile2() {return this._profile2}
	get profile3() {return this._profile3}
	get profile4() {return this._profile4}
	get profile5() {return this._profile5}
	get profiles() {return this._profiles}
    get defaultTextProfile() {return this._defaultTextProfile}
	get textProfile1() {return this._textProfile1}
	get textProfile2() {return this._textProfile2}
	get textProfile3() {return this._textProfile3}
	get textProfile4() {return this._textProfile4}
	get textProfile5() {return this._textProfile5}
	get textProfiles() {return this._textProfiles}
	get currentCtxVisuals() {return this.#currentCtxVisuals}
	get currentCtxStyles() {return this.#currentCtxStyles}
	get currentCtxTextStyles() {return this.#currentCtxTextStyles}

	set ctx(_ctx) {this._ctx = _ctx}
	set defaultProfile(_defaultProfile) {this._defaultProfile = _defaultProfile}
	set profile1(_profile1) {this._profile1 = _profile1}
	set profile2(_profile2) {this._profile2 = _profile2}
	set profile3(_profile3) {this._profile3 = _profile3}
	set profile4(_profile4) {this._profile4 = _profile4}
	set profile5(_profile5) {this._profile5 = _profile5}
	set profiles(_profiles) {this._profiles = _profiles}
    set defaultTextProfile(_defaultTextProfile) {this._defaultTextProfile = _defaultTextProfile}
	set textProfile1(_textProfile1) {this._textProfile1 = _textProfile1}
	set textProfile2(_textProfile2) {this._textProfile2 = _textProfile2}
	set textProfile3(_textProfile3) {this._textProfile3 = _textProfile3}
	set textProfile4(_textProfile4) {this._textProfile4 = _textProfile4}
	set textProfile5(_textProfile5) {this._textProfile5 = _textProfile5}
	set textProfiles(_textProfiles) {this._textProfiles = _textProfiles}
	set currentCtxVisuals(currentCtxVisuals) {this.#currentCtxVisuals = currentCtxVisuals}
	set currentCtxStyles(currentCtxStyles) {this.#currentCtxStyles = currentCtxStyles}
	set currentCtxTextStyles(currentCtxTextStyles) {this.#currentCtxTextStyles = currentCtxTextStyles}
}
// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Represents a styling profile for text
class TextStyles {
    static CAPS_VARIANTS = {NORMAL:"normal", SMALL_CAPS:"small-caps", ALL_SMALL_CAPS:"all-small-caps", PETITE_CAPS:"petite-caps", ALL_PETITE_CAPS:"all-petite-caps", UNICASE:"unicase", TILTING_CAPS:"tilting-caps"}
    static DIRECTIONS = {LEFT_TO_RIGHT:"ltr", RIGHT_TO_LEFT:"rtl", INHERIT:"inherit"}
    static STRETCHES = {ULTRA_CONDENSED:"ultra-condensed", EXTRA_CONDENSED:"extra-condensed", CONDENSED:"condensed", SEMI_CONDENSED:"semi-condensed", NORMAL:"normal", SEMI_EXPANDED:"semi-expanded", EXPANDED:"expanded", EXTRA_EXPANDED:"extra-expanded", ULTRA_EXPANDED:"ultra-expanded"}
    static KERNINGS = {AUTO:"auto", NORMAL:"normal", NONE:"none"}
    static ALIGNMENTS = {LEFT:"left", RIGHT:"right", CENTER:"center", START:"start", END:"end"}
    static BASELINES = {TOP:"top", BOTTOM:"bottom", HANGING:"hanging", MIDDLE:"middle", ALPHABETIC:"alphabetic", IDEOGRAPHIC:"ideographic"}
    static RENDERINGS = {AUTO:"auto", FAST:"optimizeSpeed", LEGIBLE:"optimizeLegibility", PRECISE:"geometricPrecision"}
    static DEFAULT_FONT = "32px Arial"
    static DEFAULT_LETTER_SPACING = "2px"
    static DEFAULT_WORD_SPACING = "4px"
    static DEFAULT_FONT_VARIANT_CAPS = TextStyles.CAPS_VARIANTS.NORMAL
    static DEFAULT_DIRECTION = TextStyles.DIRECTIONS.LEFT_TO_RIGHT
    static DEFAULT_FONT_STRETCH = TextStyles.STRETCHES.NORMAL
    static DEFAULT_FONT_KERNING = TextStyles.KERNINGS.NORMAL
    static DEFAULT_TEXT_ALIGN = TextStyles.ALIGNMENTS.CENTER
    static DEFAULT_TEXT_BASELINE = TextStyles.BASELINES.MIDDLE
    static DEFAULT_TEXT_RENDERING = TextStyles.RENDERINGS.FAST
    static DEFAULT_PROFILE = new TextStyles(null, TextStyles.DEFAULT_FONT, TextStyles.DEFAULT_LETTER_SPACING, TextStyles.DEFAULT_WORD_SPACING, TextStyles.DEFAULT_FONT_VARIANT_CAPS, TextStyles.DEFAULT_DIRECTION, TextStyles.DEFAULT_FONT_STRETCH, TextStyles.DEFAULT_FONT_KERNING, TextStyles.DEFAULT_TEXT_ALIGN, TextStyles.DEFAULT_TEXT_BASELINE, TextStyles.DEFAULT_TEXT_RENDERING)
    static SUPPORTED_FONTS_FORMATS = ["woff","woff2","ttf","otf"]
    static #FONTFACE_NAME_OFFSET = 1

    #ctx = null
    constructor(render, font, letterSpacing, wordSpacing, fontVariantCaps, direction, fontStretch, fontKerning, textAlign, textBaseline, textRendering) {
        this._id = Render.TEXT_PROFILE_ID_GIVER++                                    // profile id
        this._render = render                                                        // Canvas render instance
        this.#ctx = render?.ctx                                                      // Canvas context
        this._font = font??TextStyles.DEFAULT_FONT                                   // text font-style, font-variant, font-weight, font-size, line-height, font-family
        this._letterSpacing = letterSpacing??TextStyles.DEFAULT_LETTER_SPACING       // gaps in px between letters
        this._wordSpacing = wordSpacing??TextStyles.DEFAULT_WORD_SPACING             // gaps in px between words
        this._fontVariantCaps = fontVariantCaps??TextStyles.DEFAULT_FONT_VARIANT_CAPS// specifies alternative capitalization
        this._direction = direction??TextStyles.DEFAULT_DIRECTION                    // text direction
        this._fontStretch = fontStretch??TextStyles.DEFAULT_FONT_STRETCH             // text streching
        this._fontKerning = fontKerning??TextStyles.DEFAULT_FONT_KERNING             // whether the default spacing of certain letters is uniform 
        this._textAlign = textAlign??TextStyles.DEFAULT_TEXT_ALIGN                   // text horizontal alignment
        this._textBaseline = textBaseline??TextStyles.DEFAULT_TEXT_BASELINE          // text vertical alignment
        this._textRendering = textRendering??TextStyles.DEFAULT_TEXT_RENDERING       // text rendering optimization method
    }

    // returns a separate copy of the profile
    duplicate(render=this._render, font=this._font, letterSpacing=this._letterSpacing, wordSpacing=this._wordSpacing, fontVariantCaps=this._fontVariantCaps, direction=this._direction, fontStretch=this._fontStretch, fontKerning=this._fontKerning, textAlign=this._textAlign, textBaseline=this._textBaseline, textRendering=this._textRendering) {
        return new TextStyles(render, font, letterSpacing, wordSpacing, fontVariantCaps, direction, fontStretch, fontKerning, textAlign, textBaseline, textRendering)
    }

    // returns the profile's styles as an array
    getStyles() {
        return [this._font, this._letterSpacing, this._wordSpacing, this._fontVariantCaps, this._direction, this._fontStretch, this._fontKerning, this._textAlign, this._textBaseline, this._textRendering]
    }

    // updates a profile's attributes and returns the updated version
    update(font, letterSpacing, wordSpacing, fontVariantCaps, direction, fontStretch, fontKerning, textAlign, textBaseline, textRendering) {
        if (font) this._font = font
        if (letterSpacing) this._letterSpacing = typeof letterSpacing=="number"?letterSpacing+"px":letterSpacing
        if (wordSpacing) this._wordSpacing = typeof wordSpacing=="number"?wordSpacing+"px":wordSpacing
        if (fontVariantCaps) this._fontVariantCaps = fontVariantCaps
        if (direction) this._direction = direction
        if (fontStretch) this._fontStretch = fontStretch
        if (fontKerning) this._fontKerning = fontKerning 
        if (textAlign) this._textAlign = textAlign 
        if (textBaseline) this._textBaseline = textBaseline 
        if (textRendering) this._textRendering = textRendering 
        return this
    }

    // directly applies the styles of the profile
    apply(font=this._font, letterSpacing=this._letterSpacing, wordSpacing=this._wordSpacing, fontVariantCaps=this._fontVariantCaps, direction=this._direction, fontStretch=this._fontStretch, fontKerning=this._fontKerning, textAlign=this._textAlign, textBaseline=this._textBaseline, textRendering=this._textRendering) {
        const ctx = this.#ctx, currentTextStyles = this._render.currentCtxTextStyles
        if (font && currentTextStyles[0] !== font) currentTextStyles[0] = ctx.font = font
        if (letterSpacing && currentTextStyles[1] !== letterSpacing) currentTextStyles[1] = ctx.letterSpacing = letterSpacing
        if (wordSpacing && currentTextStyles[2] !== wordSpacing) currentTextStyles[2] = ctx.wordSpacing = wordSpacing
        if (fontVariantCaps && currentTextStyles[3] !== fontVariantCaps) currentTextStyles[3] = ctx.fontVariantCaps = fontVariantCaps
        if (direction && currentTextStyles[4] !== direction) currentTextStyles[4] = ctx.direction = direction
        if (fontStretch && currentTextStyles[5] !== fontStretch) currentTextStyles[5] = ctx.fontStretch = fontStretch
        if (fontKerning && currentTextStyles[6] !== fontKerning) currentTextStyles[6] = ctx.fontKerning = fontKerning
        if (textAlign && currentTextStyles[7] !== textAlign) currentTextStyles[7] = ctx.textAlign = textAlign
        if (textBaseline && currentTextStyles[8] !== textBaseline) currentTextStyles[8] = ctx.textBaseline = textBaseline
        if (textRendering && currentTextStyles[9] !== textRendering) currentTextStyles[9] = ctx.textRendering = textRendering
    }

    // directly applies the styles of the profile
    static apply(ctx, font, letterSpacing, wordSpacing, fontVariantCaps, direction, fontStretch, fontKerning, textAlign, textBaseline, textRendering) {
        const currentTextStyles = [ctx.font, ctx.letterSpacing, ctx.wordSpacing, ctx.fontVariantCaps, ctx.direction, ctx.fontStretch, ctx.fontKerning, ctx.textAlign, ctx.textBaseline, ctx.textRendering]
        if (font && currentTextStyles[0] !== font) currentTextStyles[0] = ctx.font = font
        if (letterSpacing && currentTextStyles[1] !== letterSpacing) currentTextStyles[1] = ctx.letterSpacing = letterSpacing
        if (wordSpacing && currentTextStyles[2] !== wordSpacing) currentTextStyles[2] = ctx.wordSpacing = wordSpacing
        if (fontVariantCaps && currentTextStyles[3] !== fontVariantCaps) currentTextStyles[3] = ctx.fontVariantCaps = fontVariantCaps
        if (direction && currentTextStyles[4] !== direction) currentTextStyles[4] = ctx.direction = direction
        if (fontStretch && currentTextStyles[5] !== fontStretch) currentTextStyles[5] = ctx.fontStretch = fontStretch
        if (fontKerning && currentTextStyles[6] !== fontKerning) currentTextStyles[6] = ctx.fontKerning = fontKerning
        if (textAlign && currentTextStyles[7] !== textAlign) currentTextStyles[7] = ctx.textAlign = textAlign
        if (textBaseline && currentTextStyles[8] !== textBaseline) currentTextStyles[8] = ctx.textBaseline = textBaseline
        if (textRendering && currentTextStyles[9] !== textRendering) currentTextStyles[9] = ctx.textRendering = textRendering
    }
    
    /**
     * Returns whether the provided font file type is supported
     * @param {String | File} file: the file or filename 
     * @returns Whether the font file is supported or not
     */
    static isFontFormatSupported(file) {
        const name = (file?.name||file).toLowerCase()
        return TextStyles.SUPPORTED_FONTS_FORMATS.some(ext=>name.endsWith("."+ext))
    }

    /**
     * Loads a custom font by file or url. Direct font files are loaded using the FontFace api, while non direct font source are loaded via an HTML <link> element.
     * @param {String | ArrayBuffer | TypedArray} src: The source of the font, either a file or a url
     * @param {String?} fontFaceName: The font family name of the custom font (Only applicable for FontFace load)
     * @param {Object?} fontFaceDescriptors: Object defining the font properties (Only applicable for FontFace load) 
     * @param {Function?} readyCB: Callback called upon custom font loading completed. (fontFace, fontFamily)=>{...} (Only applicable for FontFace load)
     * @param {Function?} errorCB: Callback called upon custom font loading errors. (error)=>{...} (Only applicable for FontFace load) 
     * @returns The loaded font via a FontFace instance or a <link> element
     */
    static loadCustomFont(src, fontFaceName=null, fontFaceDescriptors={}, readyCB=null, errorCB=(e)=>console.warn("Error loading font:", src, e)) {
        if (TextStyles.isFontFormatSupported(src) || src instanceof ArrayBuffer || src instanceof Int8Array || src instanceof Uint8Array || src instanceof Uint8ClampedArray || src instanceof Int16Array || src instanceof Uint16Array || src instanceof Int32Array || src instanceof Uint32Array || src instanceof Float32Array || src instanceof Float64Array || src instanceof BigInt64Array || src instanceof BigUint64Array) {
            const font = new FontFace(fontFaceName||"customFont"+TextStyles.#FONTFACE_NAME_OFFSET++, `url(${src})`, fontFaceDescriptors)
            font.load().then((fontData)=>{
                document.fonts.add(fontData)
                if (CDEUtils.isFunction(readyCB)) readyCB(font, font.family)
            }).catch((e)=>{if (CDEUtils.isFunction(errorCB)) errorCB(e)})
            return font
        } else {
            const link = document.createElement("link")
            link.rel = "stylesheet"
            link.type = "text/css"
            link.href = src
            link.id = "customFont"+TextStyles.#FONTFACE_NAME_OFFSET++
            return document.querySelector("head").appendChild(link)
        }
    }

    get id() {return this.id}
    get render() {return this._render}
	get font() {return this._font}
	get letterSpacing() {return +this._letterSpacing.replace("px","")}
	get wordSpacing() {return +this._wordSpacing.replace("px","")}
	get fontVariantCaps() {return this._fontVariantCaps}
	get direction() {return this._direction}
	get fontStretch() {return this._fontStretch}
	get fontKerning() {return this._fontKerning}
	get textAlign() {return this._textAlign}
	get textBaseline() {return this._textBaseline}
	get textRendering() {return this._textRendering}

	set render(render) {
        this._render = render
        this.#ctx = render.ctx
    }
	set font(_font) {this._font = _font}
	set letterSpacing(_letterSpacing) {this._letterSpacing = typeof _letterSpacing=="number"?_letterSpacing+"px":_letterSpacing}
	set wordSpacing(_wordSpacing) {this._wordSpacing = typeof _wordSpacing=="number"?_wordSpacing+"px":_wordSpacing}
	set fontVariantCaps(_fontVariantCaps) {this._fontVariantCaps = _fontVariantCaps}
	set direction(_direction) {this._direction = _direction}
	set fontStretch(_fontStretch) {this._fontStretch = _fontStretch}
	set fontKerning(_fontKerning) {this._fontKerning = _fontKerning}
	set textAlign(_textAlign) {this._textAlign = _textAlign}
	set textBaseline(_textBaseline) {this._textBaseline = _textBaseline}
	set textRendering(_textRendering) {this._textRendering = _textRendering}
}
// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Represents a styling profile for paths
class RenderStyles extends _HasColor {
    static JOIN_TYPES = {MITER:"miter", BEVEL:"bevel", ROUND:"round"} // spiky, flat, round
    static CAP_TYPES = {BUTT:"butt", SQUARE:"square", ROUND:"round"}  // short, long, round
    static DEFAULT_WIDTH = 2
    static DEFAULT_CAP = RenderStyles.CAP_TYPES.ROUND
    static DEFAULT_JOIN = RenderStyles.JOIN_TYPES.MITER
    static DEFAULT_DASH = []
    static DEFAULT_DASH_OFFSET = 0
    static SERIALIZATION_SEPARATOR = "%"
    static DEFAULT_PROFILE = new RenderStyles(null, Color.DEFAULT_RGBA, Render.DEFAULT_FILTER, Render.DEFAULT_COMPOSITE_OPERATION, Render.DEFAULT_ALPHA, RenderStyles.DEFAULT_WIDTH, RenderStyles.DEFAULT_DASH, RenderStyles.DEFAULT_DASH_OFFSET, RenderStyles.DEFAULT_JOIN, RenderStyles.DEFAULT_CAP)

    #ctx = null
    constructor(render, color, filter, compositeOperation, opacity, lineWidth, lineDash, lineDashOffset, lineJoin, lineCap) {
        super(color)
        if (render) this.color = this.getInitColor()
        this._id = Render.PROFILE_ID_GIVER++                                             // profile id
        this._render = render                                                            // Canvas render instance
        this.#ctx = render?.ctx                                                          // Canvas context
        this._filter = filter??Render.DEFAULT_FILTER                                     // filter value 
        this._compositeOperation = compositeOperation??Render.DEFAULT_COMPOSITE_OPERATION// composite operation used        
        this._opacity = opacity??Render.DEFAULT_ALPHA                                    // opacity value
        this._lineWidth = lineWidth??RenderStyles.DEFAULT_WIDTH                          // width of drawn line
        this._lineDash = lineDash??RenderStyles.DEFAULT_DASH                             // gaps length within the line
        this._lineDashOffset = lineDashOffset??RenderStyles.DEFAULT_DASH_OFFSET          // line gaps offset
        this._lineJoin = lineJoin??RenderStyles.DEFAULT_JOIN                             // determines the shape of line joins
        this._lineCap = lineCap??RenderStyles.DEFAULT_CAP                                // determines the shape of line ends
    }

    // returns a separate copy of the profile
    duplicate(render=this._render, color=this._color, filter=this._filter, compositeOperation=this._compositeOperation, opacity=this._opacity, lineWidth=this._lineWidth, lineDash=this._lineDash, lineDashOffset=this._lineDashOffset, lineJoin=this._lineJoin, lineCap=this._lineCap) {
        return new RenderStyles(render, color, filter, compositeOperation, opacity, lineWidth, lineDash, lineDashOffset, lineJoin, lineCap)
    }

    // returns the profile's styles as an array
    getStyles() {
        return [this._filter, this._compositeOperation, this._opacity, this._lineWidth, this._lineDash, this._lineDashOffset, this._lineJoin, this._lineCap]
    }

    // serializes the styles profile
    toString(color=this._color, filter=this._filter, compositeOperation=this._compositeOperation, opacity=this._opacity, lineWidth=this._lineWidth, lineDash=this._lineDash, lineDashOffset=this._lineDashOffset, lineJoin=this._lineJoin, lineCap=this._lineCap) {
        let sep = RenderStyles.SERIALIZATION_SEPARATOR, colorValue = Color.getColorValue(color)
        if (colorValue instanceof CanvasGradient || colorValue instanceof CanvasPattern) colorValue = color.toString()
        return colorValue+sep+filter+sep+compositeOperation+sep+opacity+sep+lineWidth+sep+lineDash+sep+lineDashOffset+sep+lineJoin+sep+lineCap
    }

    // serializes the styles profile, but only the color value and visual effects
    fillOptimizedToString(color=this._color, filter=this._filter, compositeOperation=this._compositeOperation, opacity=this._opacity) {
        let sep = RenderStyles.SERIALIZATION_SEPARATOR, colorValue = Color.getColorValue(color)
        if (colorValue instanceof CanvasGradient || colorValue instanceof CanvasPattern) colorValue = color.toString()
        return colorValue+sep+filter+sep+compositeOperation+sep+opacity
    }

    // updates a profile's attributes and returns the updated version
    update(color, filter, compositeOperation, opacity, lineWidth, lineDash, lineDashOffset, lineJoin, lineCap) {
        if (color) this.color = color
        if (filter) this._filter = filter
        if (compositeOperation) this._compositeOperation = compositeOperation
        if (opacity!=null) this._opacity = opacity
        if (lineWidth) this._lineWidth = lineWidth
        if (lineDash) this._lineDash = lineDash
        if (lineDashOffset) this._lineDashOffset = lineDashOffset
        if (lineJoin) this._lineJoin = lineJoin
        if (lineCap) this._lineCap = lineCap
        return this
    }

    // directly applies the styles of the profile
    apply(color=this._color, filter=this._filter, compositeOperation=this._compositeOperation, opacity=this._opacity, lineWidth=this._lineWidth, lineDash=this._lineDash, lineDashOffset=this._lineDashOffset, lineJoin=this._lineJoin, lineCap=this._lineCap) {
        const ctx = this.#ctx, colorValue = Color.getColorValue(color), currentStyles = this._render.currentCtxStyles, currentCtxVisuals = this._render.currentCtxVisuals
        if (color && currentCtxVisuals[0] !== colorValue) currentCtxVisuals[0] = ctx.strokeStyle = ctx.fillStyle = colorValue
        if (filter && currentCtxVisuals[1] !== filter) currentCtxVisuals[1] = ctx.filter = filter
        if (compositeOperation && currentCtxVisuals[2] !== compositeOperation) currentCtxVisuals[2] = ctx.globalCompositeOperation = compositeOperation
        if (opacity!=null && currentCtxVisuals[3] !== opacity) currentCtxVisuals[3] = ctx.globalAlpha = opacity
        if (lineWidth!=null && currentStyles[0] !== lineWidth) currentStyles[0] = ctx.lineWidth = lineWidth
        if (lineDash) {
            const lineDashString = lineDash.toString()
            if (currentStyles[1] !== lineDashString) {
                currentStyles[1] = lineDashString
                ctx.setLineDash(lineDash)
            }
        }
        if (lineDashOffset!==null && currentStyles[2] !== lineDashOffset) currentStyles[2] = ctx.lineDashOffset = lineDashOffset
        if (lineJoin && currentStyles[3] !== lineJoin) currentStyles[3] = ctx.lineJoin = lineJoin
        if (lineCap && currentStyles[4] !== lineCap) currentStyles[4] = ctx.lineCap = lineCap
    }

    // directly applies the provided styles
    static apply(render, color, filter, compositeOperation, opacity, lineWidth, lineDash, lineDashOffset, lineJoin, lineCap) {
        const ctx = render.ctx, colorValue = color&&Color.getColorValue(color), currentStyles = render.currentCtxStyles, currentCtxVisuals = render.currentCtxVisuals
        if (color && currentCtxVisuals[0] !== colorValue) currentCtxVisuals[0] = ctx.strokeStyle = ctx.fillStyle = colorValue
        if (filter && currentCtxVisuals[1] !== filter) currentCtxVisuals[1] = ctx.filter = filter
        if (compositeOperation && currentCtxVisuals[2] !== compositeOperation) currentCtxVisuals[2] = ctx.globalCompositeOperation = compositeOperation
        if (opacity!=null && currentCtxVisuals[3] !== opacity) currentCtxVisuals[3] = ctx.globalAlpha = opacity
        if (lineWidth!=null && currentStyles[0] !== lineWidth) currentStyles[0] = ctx.lineWidth = lineWidth
        if (lineDash) {
            const lineDashString = lineDash.toString()
            if (currentStyles[1] !== lineDashString) {
                currentStyles[1] = lineDashString
                ctx.setLineDash(lineDash)
            }
        }
        if (lineDashOffset!==null && currentStyles[2] !== lineDashOffset) currentStyles[2] = ctx.lineDashOffset = lineDashOffset
        if (lineJoin && currentStyles[3] !== lineJoin) currentStyles[3] = ctx.lineJoin = lineJoin
        if (lineCap && currentStyles[4] !== lineCap) currentStyles[4] = ctx.lineCap = lineCap
    }


    get id() {return this.id}
	get render() {return this._render}
	get lineWidth() {return this._lineWidth}
	get lineCap() {return this._lineCap}
	get lineJoin() {return this._lineJoin}
	get lineDash() {return this._lineDash}
	get lineDashOffset() {return this._lineDashOffset}

	set render(render) {
        this._render = render
        this.#ctx = render.ctx
    }
	set lineWidth(_lineWidth) {return this._lineWidth = _lineWidth}
	set lineCap(_lineCap) {return this._lineCap = _lineCap}
	set lineJoin(_lineJoin) {return this._lineJoin = _lineJoin}
	set lineDash(_lineDash) {return this._lineDash = _lineDash}
	set lineDashOffset(_lineDashOffset) {return this._lineDashOffset = _lineDashOffset}
}
// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

const CDE_CANVAS_TIMEOUT_FUNCTION = window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame||function(fn){window.setTimeout(()=>fn(performance.now()),1000/60)}

// Represents a html canvas element
class Canvas {
    static DOMParser = new DOMParser()
    static CANVAS_ID_GIVER = 0
    static ELEMENT_ID_GIVER = 0
    static DEFAULT_MAX_DELTATIME_MS = 130
    static DEFAULT_MAX_DELTATIME = Canvas.DEFAULT_MAX_DELTATIME_MS/1000
    static DEFAULT_MAXDELAY_MULTIPLIER = 0.44
    static DEFAULT_CANVAS_ACTIVE_AREA_PADDING = 25
    static DEFAULT_CVSDE_ATTR = "_CVSDE"
    static DEFAULT_CVSFRAMEDE_ATTR = "_CVSDE_F"
    static DEFAULT_CUSTOM_SVG_FILTER_ID_PREFIX = "CDE_FE_"
    static DEFAULT_CUSTOM_SVG_FILTER_CONTAINER_ID = Canvas.DEFAULT_CUSTOM_SVG_FILTER_ID_PREFIX+"CONTAINER"
    static CURSOR_STYLES = {CUSTOM:(filepath, offsetPos=[0,0], fallbackCursorStyle=Canvas.CURSOR_STYLES.AUTO)=>`url("${filepath}") ${offsetPos.join(" ")}, ${fallbackCursorStyle}`, AUTO:"auto", POINTER:"pointer", DEFAULT:"default", CROSSHAIR:"crosshair", MOVE:"move", TEXT:"text", WAIT:"wait", HELP:"help", NONE:"none", GRAB:"grab", GRABBING:"grabbing", ALL_SCROLL:"all-scroll", COL_RESIZE:"col-resize", ROW_RESIZE:"row-resize", N_RESIZE:"n-resize", E_RESIZE:"e-resize", S_RESIZE:"s-resize", W_RESIZE:"w-resize", NE_RESIZE:"ne-resize", NW_RESIZE:"nw-resize", SE_RESIZE:"se-resize", SW_RESIZE:"sw-resize", ZOOM_IN:"zoom-in", ZOOM_OUT:"zoom-out", NO_DROP:"no-drop", COPY:"copy", NOT_ALLOWED:"not-allowed", VERTICAL_TEXT:"vertical-text", CELL:"cell", CONTEXT_MENU:"context-menu", EXT_RESIZE:"ext-resize", DEFAULT_ARROW:"default", UNSET:"unset"}
    static LOADED_SVG_FILTERS = {}
    static DEFAULT_CTX_SETTINGS = {"imageSmoothingEnabled":false, "font":TextStyles.DEFAULT_FONT, "letterSpacing":TextStyles.DEFAULT_LETTER_SPACING, "wordSpacing":TextStyles.DEFAULT_WORD_SPACING, "fontVariantCaps":TextStyles.DEFAULT_FONT_VARIANT_CAPS, "direction":TextStyles.DEFAULT_DIRECTION, "fontSretch":TextStyles.DEFAULT_FONT_STRETCH, "fontKerning":TextStyles.DEFAULT_FONT_KERNING, "textAlign":TextStyles.DEFAULT_TEXT_ALIGN, "textBaseline":TextStyles.DEFAULT_TEXT_BASELINE, "textRendering":TextStyles.DEFAULT_TEXT_RENDERING, "lineDashOffset":RenderStyles.DEFAULT_DASH_OFFSET, "lineJoin":RenderStyles.DEFAULT_JOIN, "lineCap":RenderStyles.DEFAULT_CAP, "lineWidth":RenderStyles.DEFAULT_WIDTH, "fillStyle":Color.DEFAULT_COLOR, "stokeStyle":Color.DEFAULT_COLOR}
    static DEFAULT_CANVAS_WIDTH = 800
    static DEFAULT_CANVAS_HEIGHT = 800
    static DEFAULT_CANVAS_STYLES = {position:"absolute",top:"0",left:"0",width:"100%",height:"100%","background-color":"transparent",border:"none",outline:"none","pointer-events":"none !important","z-index":0,padding:"0 !important",margin:"0","-webkit-transform":"translate3d(0, 0, 0)","-moz-transform": "translate3d(0, 0, 0)","-ms-transform": "translate3d(0, 0, 0)","transform": "translate3d(0, 0, 0)","touch-action":"none","-webkit-user-select":"none","user-select":"none"}
    static STATIC_MODE = 0
    static STATIC = "static"
    static STATES = {STOPPED:0, LOOPING:1, REQUESTED_STOP:2}
    static #ON_LOAD_CALLBACKS = []
    static #ON_FIRST_INTERACT_CALLBACKS = []
    static DEFAULT_MOUSE_MOVE_THROTTLE_DELAY = 10

    #lastFrame = 0           // default last frame time
    #lastLimitedFrame = 0    // last frame time for limited fps
    #fixedTimeStampOffset = 0// fixed requestanimationframe timestamp in ms
    #maxTime = null          // max time between frames
    #timeStamp = null        // requestanimationframe timestamp in ms
    #cachedEls = []          // cached canvas elements to draw
    #cachedEls_ll = null     // cached canvas elements count/length
    #cachedSize = null       // cached canvas size
    #lastScrollValues = [window.scrollX, window.screenY] // last window scroll x/y values
    #mouseMoveCB = null      // the custom mouseMoveCB. Used for mobile adjustments
    #visibilityChangeLastState = null // stores the cvs state before document visibility change
    constructor(cvs, loopingCB, fpsLimit=null, visibilityChangeCB, cvsFrame, settings=Canvas.DEFAULT_CTX_SETTINGS, willReadFrequently=false) {
        this._id = Canvas.CANVAS_ID_GIVER++                           // Canvas instance id
        this._cvs = cvs                                               // html canvas element or an OffscreenCanvas instance
        if (!this.isOffscreenCanvas) {
            this._frame = cvsFrame??cvs?.parentElement                    // html parent of canvas element
            this._cvs.setAttribute(Canvas.DEFAULT_CVSDE_ATTR, true)       // set styles selector for canvas
            this._frame.setAttribute(Canvas.DEFAULT_CVSFRAMEDE_ATTR, true)// set styles selector for parent
            this.visibilityChangeCB = visibilityChangeCB                  // callback with the actions to be taken on document visibility change (isVisible, CVS, e)=>
        }
        this._ctx = this._cvs.getContext("2d", {willReadFrequently})  // canvas context
        this._settings = this.updateSettings(settings||Canvas.DEFAULT_CTX_SETTINGS)// set context settings
        this._els = {refs:[], defs:[]}                                // arrs of objects to .draw() | refs (source): [Object that contains drawable obj], defs: [regular drawable objects]
        this._state = 0                                               // canvas drawing loop state. 0:off, 1:on, 2:awaiting stop
        this._loopingCB = loopingCB                                   // custom callback called along with the loop() function
        this.fpsLimit = fpsLimit                                      // delay between each frame to limit fps
        this._speedModifier = 1                                       // animation/drawing speed multiplier
        this.#maxTime = this.#getMaxTime(fpsLimit)                    // max time between frames
        this._deltaTime = null                                        // useable delta time in seconds
        this._fixedTimeStamp = null                                   // fixed timestamp in ms
        this._windowListeners = this.#initWindowListeners()           // [onresize, onvisibilitychange, onscroll, onload]
        this._viewPos = [0,0]                                         // context view offset
        if (!this.isOffscreenCanvas) {
            const frameCBR = this._frame?.getBoundingClientRect()??{width:Canvas.DEFAULT_CANVAS_WIDTH, height:Canvas.DEFAULT_CANVAS_HEIGHT}
            this.setSize(frameCBR.width, frameCBR.height)             // init size
            this.#initStyles()                                        // init styles
        } else this.#cachedSize = [this._cvs.width, this._cvs.height]
        this._typingDevice = new TypingDevice()                        // keyboard info
        this._mouse = new Mouse(this._ctx)                             // mouse info
        if (!this.isOffscreenCanvas) this._offset = this.updateOffset()// cvs page offset
        this._render = new Render(this._ctx)                           // render instance
        this._anims = []                                               // current animations
        this._mouseMoveThrottlingDelay = Canvas.DEFAULT_MOUSE_MOVE_THROTTLE_DELAY// mouse move throttling delay
    }

    // sets css styles on the canvas and the parent
    #initStyles() {
        const style = document.createElement("style")
        style.appendChild(document.createTextNode(`[${Canvas.DEFAULT_CVSFRAMEDE_ATTR}]{position:relative !important;outline: none;}canvas[${Canvas.DEFAULT_CVSDE_ATTR}]{${Object.entries(Canvas.DEFAULT_CANVAS_STYLES).reduce((a,b)=>a+=`${b[0]}:${b[1]};`,"")}}`))
        this._cvs.appendChild(style)
        this._frame.setAttribute("tabindex", 0)
        this._cvs.setAttribute("draggable", "false")
    }

    // sets resize and visibility change listeners on the window
    #initWindowListeners() {
        const onresize=()=>{
            const render = this._render, [lineWidth, lineDash, lineDashOffset, lineJoin, lineCap] = render.currentCtxStyles, [font, letterSpacing, wordSpacing, fontVariantCaps, direction, fontStretch, fontKerning, textAlign, textBaseline, textRendering] = render.currentCtxTextStyles, [color, filter, compositeOperation, alpha] = render.currentCtxVisuals
            this.setSize()
            this._ctx.strokeStyle = this._ctx.fillStyle = Color.getColorValue(color)
            RenderStyles.apply(render, null, filter, compositeOperation, alpha, lineWidth, lineDash, lineDashOffset, lineJoin, lineCap)
            TextStyles.apply(this._ctx, font, letterSpacing, wordSpacing, fontVariantCaps, direction, fontStretch, fontKerning, textAlign, textBaseline, textRendering)
            this.moveViewAt(this._viewPos)
            if (this.fpsLimit==Canvas.STATIC || this._state==Canvas.STATES.STOPPED) this.drawSingleFrame()
        },
        onvisibilitychange=e=>this._visibilityChangeCB(!document.hidden, this, e),
        onscroll=()=>{
          const scrollX = window.scrollX, scrollY = window.scrollY
          this.updateOffset()
          this._mouse.updatePos(this._mouse.x+(scrollX-this.#lastScrollValues[0]), this._mouse.y+(scrollY-this.#lastScrollValues[1]), [0,0])
          this.#mouseMovements()
          this.#lastScrollValues[0] = scrollX
          this.#lastScrollValues[1] = scrollY
        },
        onLoad=e=>{
          const callbacks = Canvas.#ON_LOAD_CALLBACKS, cb_ll = callbacks?.length
          if (cb_ll) for (let i=0;i<cb_ll;i++) callbacks[i](e, this)
          Canvas.#ON_LOAD_CALLBACKS = null
        }

        if (!this.isOffscreenCanvas) {
            window.addEventListener("resize", onresize)
            window.addEventListener("visibilitychange", onvisibilitychange)
            window.addEventListener("scroll", onscroll)
        }
        window.addEventListener("load", onLoad)
        return this.isOffscreenCanvas ? {removeOnloadListener:()=>window.removeEventListener("load", onLoad)} : {
            removeOnreziseListener:()=>window.removeEventListener("resize", onresize),
            removeOnvisibilitychangeListener:()=>window.removeEventListener("visibilitychange", onvisibilitychange),
            removeOnscrollListener:()=>window.removeEventListener("scroll", onscroll),
            removeOnloadListener:()=>window.removeEventListener("load", onLoad)
        }
    }

    // sets the cursor style on the canvas
    setCursorStyle(cursorStyle=Canvas.CURSOR_STYLES.DEFAULT) {
        const frame = this._frame
        if (frame.style.cursor !== cursorStyle) frame.style.cursor = cursorStyle
    }

    // adds a callback to be called once the document is loaded
    static addOnLoadCallback(callback) {
        if (CDEUtils.isFunction(callback) && Canvas.#ON_LOAD_CALLBACKS) Canvas.#ON_LOAD_CALLBACKS.push(callback)
    }

    // adds a callback to be called once the document has been interacted with for the first time
    static addOnFirstInteractCallback(callback) {
        if (CDEUtils.isFunction(callback) && Canvas.#ON_FIRST_INTERACT_CALLBACKS) Canvas.#ON_FIRST_INTERACT_CALLBACKS.push(callback)
    }

    /**
     * Loads a custom svg filter to use
     * @param {String} svgContent: string containing the svg filter, e.g: `<svg><filter id="someId"> ... the filter contents </svg>`
     * @param {String?} id: the id of the svg filter. (Takes the one of the svgContent <filter> element if not defined) 
     * @returns the usable id
     */
    static loadSVGFilter(svgContent, id) {
        let container = document.getElementById(Canvas.DEFAULT_CUSTOM_SVG_FILTER_CONTAINER_ID), svg = new DOMParser().parseFromString(svgContent, "text/html").body.firstChild, filter = svg.querySelector("filter"), parent = document.createElement("div")
        if (!id) id = filter.id
        else filter.id = id
        parent.id = Canvas.DEFAULT_CUSTOM_SVG_FILTER_ID_PREFIX+id
        parent.appendChild(svg)

        if (!container) {
            container = document.createElement("div")
            container.id = Canvas.DEFAULT_CUSTOM_SVG_FILTER_CONTAINER_ID
            document.head.appendChild(container)
        }
        container.appendChild(parent)
        Canvas.LOADED_SVG_FILTERS[id] = [...filter.children]
        return id
    }

    // returns the filter elements of a loaded svg filter
    static getSVGFilter(id) {
        return Canvas.LOADED_SVG_FILTERS[id]
    }

    // deletes a loaded svg filter
    static removeSVGFilter(id) {
        id = Canvas.DEFAULT_CUSTOM_SVG_FILTER_ID_PREFIX+id
        document.getElementById(id).remove()
        delete Canvas.LOADED_SVG_FILTERS[id]
    }

    // updates the calculated canvas offset in the page
    updateOffset() {
        const {width, height, x, y} = this._cvs.getBoundingClientRect()
        return this._offset = [Math.round((x+width)-this.width)+this._viewPos[0], Math.round((y+height)-this.height)+this._viewPos[1]]
    }

    // main loop, runs every frame
    #loop(time, wasRestarted) {
        const frameTime = (time-this.#lastFrame)*this._speedModifier, fpsLimit = this._fpsLimit

        if (fpsLimit) {
            const timeDiff = time-this.#lastLimitedFrame
            if (timeDiff >= fpsLimit) {
                this._fixedTimeStamp = ((this.#timeStamp += frameTime)-this.#fixedTimeStampOffset)
                if (!wasRestarted) this.#loopCore(time)
                this.#lastFrame = time
                this.#lastLimitedFrame = time-(timeDiff%fpsLimit)
            }
        } else {
            this._fixedTimeStamp = ((this.#timeStamp += frameTime)-this.#fixedTimeStampOffset)
            if (!wasRestarted) this.#loopCore(time)
            this.#lastFrame = time
        }

        if (this._state==1) CDE_CANVAS_TIMEOUT_FUNCTION(this.#loop.bind(this))
        else this._state = 0
    }

    /**
     * Plays a single frame of the drawing loop.
     * @param {Number?} customTime: if provided, forces a time jump. Else doesn't affect time
     */
    drawSingleFrame(customTime=null) {
        let mouse = this._mouse, loopingCB = this._loopingCB, hasCustomTime = customTime!=null, deltaTime = hasCustomTime ? this.#calcDeltaTime(customTime) : this._deltaTime
        if (!mouse._moveListenersOptimizationEnabled) {
            mouse.checkListeners(Mouse.LISTENER_TYPES.ENTER)
            mouse.checkListeners(Mouse.LISTENER_TYPES.LEAVE)
        }

        this.clear()
        this.draw()
        this._render.drawBatched()
        if (loopingCB) this._loopingCB(deltaTime)

        if (hasCustomTime) {
            const anims = this._anims, a_ll = anims.length
            this.#timeStamp = this._fixedTimeStamp = customTime
            if (a_ll) for (let i=0;i<a_ll;i++) anims[i].getFrame(this.#timeStamp, deltaTime)
        }
    }

    // core actions of the main loop
    #loopCore(time) {
        const deltaTime = this.#calcDeltaTime(time), mouse = this._mouse, loopingCB = this._loopingCB

        mouse.calcSpeed(deltaTime)
        if (!mouse._moveListenersOptimizationEnabled) {
            mouse.checkListeners(Mouse.LISTENER_TYPES.ENTER)
            mouse.checkListeners(Mouse.LISTENER_TYPES.LEAVE)
        }

        this.clear()
        this.draw()
        this._render.drawBatched()
        if (loopingCB) this._loopingCB(deltaTime)

        const anims = this._anims, a_ll = anims.length
        if (a_ll) for (let i=0;i<a_ll;i++) anims[i].getFrame(this.timeStamp, deltaTime)
    }

    // starts the canvas drawing loop
    startLoop() {
        if (this._state!=1) {
            if (this._state==2) return this._state = 1
            this._state = 1
            if (this.#lastFrame) this.#fixedTimeStampOffset += (performance.now()-this.#lastFrame)*this._speedModifier
            this.#loop(this.#timeStamp||0, true)
        }
    }
    // starts the canvas drawing loop
    start() {
        this.startLoop()
    }

    // stops the canvas drawing loop
    stopLoop() {
        if (this._state) this._state = 2
    }
    // stops the canvas drawing loop
    stop() {
        this.stopLoop()
    }

    // calculates and sets the deltaTime
    #calcDeltaTime(time=0) {
        const deltaTime = (time-this.#lastFrame)/1000, maxTime = this.#maxTime/1000
        return this._deltaTime = deltaTime>maxTime ? maxTime : deltaTime
    }

    // calculates the max time between frames according to the fpsLimit
    #getMaxTime(fpsLimit) {
        return fpsLimit ? fpsLimit < 7 ? (((14-fpsLimit)*1.05)**3)*Canvas.DEFAULT_MAXDELAY_MULTIPLIER : Math.max((360-fpsLimit)*Canvas.DEFAULT_MAXDELAY_MULTIPLIER, 50) : Canvas.DEFAULT_MAX_DELTATIME_MS
    }

    // updates cached canvas elements
    updateCachedAllEls() {
        const cachedEls = []
        cachedEls.push(...this.refs)
        this._els.refs.forEach(source=>cachedEls.push(...source.asSource))
        cachedEls.push(...this._els.defs)
        this.#cachedEls = cachedEls
        this.#cachedEls_ll = cachedEls.length
    }

    // calls the draw function on all canvas objects
    draw() {
        const els = this.#cachedEls, els_ll = this.#cachedEls_ll, render = this._render, deltaTime = this._deltaTime*this._speedModifier, timeStamp = this.timeStamp
        for (let i=0;i<els_ll;i++) {
            const el = els[i], margin = el.activationMargin
            if (!(margin===true) && el.initialized && !this.isWithin(el.pos, margin) || !el.draw) continue
            el.draw(render, timeStamp, deltaTime)
        }
    }

    // clears the canvas
    clear(x=0, y=0, x2=this.width, y2=this.height) {
        if (this._viewPos[0] || this._viewPos[1]) {
            this.save()
            this.resetTransformations()
            this._ctx.clearRect(x, y, x2, y2)
            this.restore()
        } else this._ctx.clearRect(x, y, x2, y2)
    }

    // initializes the canvas as static
    initializeStatic() {
        this.fpsLimit = 0
        this.draw()
        this.drawStatic()
        
        const imageDisplays = this.getObjs(ImageDisplay), id_ll = imageDisplays.length
        for (let i=0;i<id_ll;i++) {
            const imageDisplay = imageDisplays[i]
            if (imageDisplay.setupCB === null) imageDisplay.setupCB = el=>el.draw(this.render, this.timeStamp*this._speedModifier, this._deltaTime)
            else if (CDEUtils.isFunction(imageDisplay.setupCB)) {
                const oldCB = imageDisplay.setupCB
                imageDisplay.setupCB = (el, parent)=>{
                    el.draw(this.render, this.timeStamp*this._speedModifier, this._deltaTime)
                    oldCB(el, parent)
                }
            }
        }
    }

    // draws a single frame (use with static canvas)
    drawStatic() {
        this.draw()
        this._render.drawBatched()
        if (CDEUtils.isFunction(this._loopingCB)) this._loopingCB()
    }

    // clears the canvas and draws a single frame (use with static canvas)
    cleanDrawStatic() {
        this.clear()
        this.drawStatic()
    }

    // resets every fragile references
    resetReferences() {
        this.refs.filter(ref=>ref.fragile).forEach(r=>r.reset())
    }

    // discards all current context transformations
    resetTransformations() {
        this.ctx.setTransform(1,0,0,1,0,0)
    }

    // moves the context to a specific x/y value
    moveViewAt(pos) {
        let [x, y] = pos
        this.resetTransformations()
        this._ctx.translate(x=(CDEUtils.isDefined(x)&&isFinite(x))?x:0,y=(CDEUtils.isDefined(y)&&isFinite(y))?y:0)
        this._viewPos[0] = x
        this._viewPos[1] = y
        
        this.updateOffset()
        this._mouse.updatePos(this._mouse.rawX, this._mouse.rawY, this._offset)
        this.#mouseMovements()
    }

    // moves the context by specified x/y values
    moveViewBy(pos) {
        let [x, y] = pos
        this._ctx.translate(x=(CDEUtils.isDefined(x)&&isFinite(x))?x:0,y=(CDEUtils.isDefined(y)&&isFinite(y))?y:0)
        this._viewPos[0] += x
        this._viewPos[1] += y

        this.updateOffset()
        this._mouse.updatePos(this._mouse.rawX, this._mouse.rawY, this._offset)
        this.#mouseMovements()
    }

    // Smoothly moves to coords in set time
    moveViewTo(pos, time, easing, initPos) {
        time??=1000
        easing??=Anim.easeInOutQuad
        initPos??=this._viewPos

        let [fx, fy] = pos, [ix, iy] = initPos, lx = ix, ly = iy
        if (!CDEUtils.isDefined(fx)) fx = ix??0
        if (!CDEUtils.isDefined(fy)) fy = iy??0

        const fdx = fx-ix, fdy = fy-iy
        if (fdx || fdy) {
            return this.playAnim(new Anim((prog)=>{
                const nx = ix+fdx*prog, ny = iy+fdy*prog, dx = nx-lx, dy = ny-ly
                this._ctx.translate(dx,dy)

                this._viewPos[0] += dx
                this._viewPos[1] += dy
                lx = nx
                ly = ny

                this.updateOffset()
                this._mouse.updatePos(this._mouse.rawX, this._mouse.rawY, this._offset)
                this.#mouseMovements()
            }, time, easing))
        }
    }

    // adds an animation to play
    playAnim(anim) {
        const initEndCB = anim.endCB
        anim.endCB=()=>{
            this._anims = this._anims.filter(a=>a.id!==anim.id)
            if (CDEUtils.isFunction(initEndCB)) initEndCB()
        }
        this._anims.push(anim)
        return anim
    }

    // sets the width and height in px of the canvas element. If "forceCSSupdate" is true, it also force the resizes on the frame with css
    setSize(forceWidth, forceHeight, forceCSSupdate) {
        const {width, height} = this._frame.getBoundingClientRect(), w = forceWidth??width, h = forceHeight??height

        if (this._cvs.width !== w || this._cvs.width !== h) {
            this._cvs.width = w??width
            this._cvs.height = h??height
            if (forceCSSupdate) {
                this._frame.style.width = this.width+"px"
                this._frame.style.height = this.height+"px"
            }
            this.updateSettings()
            this.updateOffset()
        }

        this.#cachedSize = [this._cvs.width, this._cvs.height]
    }

    // updates current canvas settings
    updateSettings(settings) {
        const st = settings||this._settings
        if (st) {
            Object.entries(st).forEach(s=>this._ctx[s[0]]=s[1])
            return this._settings=st
        } else return null
    }

    // add 1 or many objects, as a (def)inition or as a (ref)erence (source). if "inactive" is true, it only initializes the obj, without adding it to the canvas
    add(objs, inactive=false) {
        const l = objs&&(objs.length??1)
        for (let i=0;i<l;i++) {
            const obj = objs[i]??objs
            obj._parent = this
            
            if (CDEUtils.isFunction(obj.initialize)) obj.initialize()
            if (!inactive) this._els[obj.asSource?"refs":"defs"].push(obj)

        }
        this.updateCachedAllEls()
        return objs
    }

    // removes any element from the canvas by id
    remove(id) {
        if (id=="*") this._els = {refs:[], defs:[]}
        else {
            this._els.defs = this._els.defs.filter(el=>el.id!==id)
            this._els.refs = this._els.refs.filter(source=>source.id!==id)
        }
        this.updateCachedAllEls()
    }

    // removes all objects added to the canvas
    removeAllObjects() {
        this.remove("*")
    }

    // get any element from the canvas by id
    get(id) {
        const els = this.#cachedEls, e_ll = this.#cachedEls_ll
        for (let i=0;i<e_ll;i++) {
            const el = els[i]
            if (el.id==id) return el
        }
        return null
    }

    // removes any element from the canvas by instance type
    getObjs(instance) {
        return this.allEls.filter(x=>x instanceof instance)
    }

    // saves the context parameters
    save() {
        this._ctx.save()
    }
    
    // restore the saved context parameters
    restore() {
        this._ctx.restore()
    }

    // ran on first user interaction
    static #onFirstInteraction(e) {
        if (e.type!=="keydown" || (e.type=="keydown"&&e.key.length==1)) {
            const callbacks = Canvas.#ON_FIRST_INTERACT_CALLBACKS, cb_ll = callbacks?.length
            if (cb_ll) for (let i=0;i<cb_ll;i++) callbacks[i](e)
            Canvas.#ON_FIRST_INTERACT_CALLBACKS = null
        }
    }

    // called on mouse move
    #mouseMovements(cb, e) {
        // update ratioPos to mouse pos if not overwritten
        const refs = this.refs, r_ll = refs.length
        for (let i=0;i<r_ll;i++) {
            const ref = refs[i]
            if (!ref.ratioPosCB && ref.ratioPosCB !== false) ref.ratioPos = this._mouse.pos
        }
        this._mouse.checkValid()
        if (CDEUtils.isFunction(cb)) cb(this._mouse, e)
    }
    

    // defines the onmousemove listener
    setMouseMove(cb, global) {
        if (!this.isOffscreenCanvas) {
            let lastEventTime=0
            this.#mouseMoveCB = cb
            const onmousemove=e=>{
                const time = this.timeStamp
                if (time-lastEventTime > this._mouseMoveThrottlingDelay) {
                    lastEventTime = time
                    this._mouse.updatePos(e.x, e.y, this._offset)
                    this._mouse.calcAngle()         
                    this.#mouseMovements(cb, e)
                }
            }, ontouchmove=e=>{
                const touches = e.touches, time = this.timeStamp
                if (time-lastEventTime > this._mouseMoveThrottlingDelay && touches.length==1) {
                    lastEventTime = time
                    e.preventDefault()
                    e.x = CDEUtils.round(touches[0].clientX, 1)
                    e.y = CDEUtils.round(touches[0].clientY, 1)
                    this._mouse.updatePos(e.x, e.y, this._offset)
                    this._mouse.calcAngle()            
                    this.#mouseMovements(cb, e)
                }
            }, element = global ? document : this._frame
            element.addEventListener("mousemove", onmousemove)
            element.addEventListener("touchmove", ontouchmove)
            return ()=>{
                element.removeEventListener("mousemove", onmousemove)
                element.removeEventListener("touchmove", ontouchmove)
            }            
        } else return false
    }

    // defines the onmouseleave listener
    setMouseLeave(cb, global) {
        if (!this.isOffscreenCanvas) {
            const onmouseleave=e=>{
                this._mouse.invalidate()
                this.#mouseMovements(cb, e)
            }, element = global ? document : this._frame
            element.addEventListener("mouseleave", onmouseleave)
            return ()=>element.removeEventListener("mouseleave", onmouseleave)            
        } else return false
    }

    // called on any mouse clicks
    #mouseClicks(cb, e, preventOnFirstInteractionTrigger) {
        this._mouse.updateMouseClicks(e)
        if (CDEUtils.isFunction(cb)) cb(this._mouse, e)
        if (!preventOnFirstInteractionTrigger && Canvas.#ON_FIRST_INTERACT_CALLBACKS) Canvas.#onFirstInteraction(e)
    }

    // defines the onmousedown listener
    setMouseDown(cb, global) {
        if (!this.isOffscreenCanvas) {
            let isTouch = false
            const ontouchstart=e=>{
                isTouch = true
                const touches = e.touches
                if (touches.length==1) {
                    e.preventDefault()
                    e.x = CDEUtils.round(touches[0].clientX, 1)
                    e.y = CDEUtils.round(touches[0].clientY, 1)
                    e.button = 0
                    this._mouse.updatePos(e.x, e.y, this._offset)
                    this._mouse.calcAngle()            
                    this.#mouseMovements(this.#mouseMoveCB, e)
                    this.#mouseClicks(cb, e, true)
                }
            }, onmousedown=e=>{
                if (!isTouch) this.#mouseClicks(cb, e)
                isTouch = false
            }, element = global ? document : this._frame
            element.addEventListener("touchstart", ontouchstart)
            element.addEventListener("mousedown", onmousedown)
            return ()=>{
                element.removeEventListener("touchstart", ontouchstart)
                element.removeEventListener("mousedown", onmousedown)
            }
        } else return false
    }

    // defines the onmouseup listener
    setMouseUp(cb, global) {
        if (!this.isOffscreenCanvas) {
            let isTouch = false
            const ontouchend=e=>{
                isTouch = true
                const changedTouches = e.changedTouches
                if (!e.touches.length) {
                    e.preventDefault()
                    e.x = CDEUtils.round(changedTouches[0].clientX, 1)
                    e.y = CDEUtils.round(changedTouches[0].clientY, 1)
                    e.button = 0
                    this.#mouseClicks(cb, e)

                    this._mouse.invalidate()
                    e.x = Infinity
                    e.y = Infinity
                    this.#mouseMovements(cb, e)
                }     
            }, onmouseup=e=>{
                if (!isTouch) this.#mouseClicks(cb, e)
                isTouch = false
            }, element = global ? document : this._frame
            element.addEventListener("touchend", ontouchend)
            element.addEventListener("mouseup", onmouseup)
            return ()=>{
                element.removeEventListener("touchend", ontouchend)
                element.removeEventListener("mouseup", onmouseup)
            }
        } else return false
    }

    // defines the onkeydown listener
    setKeyDown(cb, global) {
        if (!this.isOffscreenCanvas) {
            const onkeydown=e=>{
                this._typingDevice.setDown(e)
                if (CDEUtils.isFunction(cb)) cb(this._typingDevice, e)
            }, globalFirstInteractOnKeyDown=e=>{if (Canvas.#ON_FIRST_INTERACT_CALLBACKS) Canvas.#onFirstInteraction(e)}, element = global ? document : this._frame
            element.addEventListener("keydown", onkeydown)
            document.addEventListener("keydown", globalFirstInteractOnKeyDown)
            return ()=>element.removeEventListener("keydown", onkeydown)            
        } else return false
    }

    // defines the onkeyup listener
    setKeyUp(cb, global) {
        if (!this.isOffscreenCanvas) {
            const onkeyup=e=>{
                this._typingDevice.setUp(e)
                if (CDEUtils.isFunction(cb)) cb(this._typingDevice, e)
            }, element = global ? document : this._frame
            element.addEventListener("keyup", onkeyup)
            return ()=>element.removeEventListener("keyup", onkeyup)            
        } else return false
    }

    // returns the center [x,y] of the canvas
    getCenter() {
        return [this.width/2, this.height/2]
    }

    // returns whether the provided position is within the canvas bounds
    isWithin(pos, padding=0) {
        const viewPos = this._viewPos
        return pos[0] >= -padding-viewPos[0] && pos[0] <= this.#cachedSize[0]+padding-viewPos[0] && pos[1] >= -padding-viewPos[1] && pos[1] <= this.#cachedSize[1]+padding-viewPos[1]
    }

    // returns the px value of the provided pourcent value. PourcentileValue should be a number between 0 and 1. UseWidth determines whether the width or height should be used.
    pct(pourcentileValue, useWidth=true) {
        return useWidth ? this.width*pourcentileValue : this.height*pourcentileValue
    }

    // Returns the px values of the provided pourcent values. PourcentilePos should be an array(2) of numbers between 0 and 1. ReferenceDims is the reference dimensions used to calculate the values
    getResponsivePos(pourcentilePos, referenceDims=this.size) {
        return [pourcentilePos[0]*referenceDims[0], pourcentilePos[1]*referenceDims[1]]
    }

    // Enables checks for mouse enter/leave listeners every frame
    enableAccurateMouseMoveListenersMode() {
        this.mouseMoveListenersOptimizationEnabled = false
    }

    // Disables checks for mouse enter/leave listeners every frame (only checks on mouse movements)
    disableAccurateMouseMoveListenersMode() {
        this.mouseMoveListenersOptimizationEnabled = true
    }

    /**
     * Disables all mouse move throttling cause by the mouseMoveThrottlingDelay property.
     */
    disableMouseMoveThrottling() {
        this._mouseMoveThrottlingDelay = 0
    }
    
	get id() {return this._id}
	get cvs() {return this._cvs}
	get frame() {return this._frame}
	get ctx() {return this._ctx}
	get width() {return this.#cachedSize?.[0]}
	get height() {return this.#cachedSize?.[1]}
	get size() {return this.#cachedSize}
	get settings() {return this._settings}
	get loopingCB() {return this._loopingCB}
	get looping() {return this._state==1}
	get stopped() {return this._state==0}
    get state() {return this._state}
	get deltaTime() {return this._deltaTime}
	get windowListeners() {return this._windowListeners}
	get timeStamp() {return this._fixedTimeStamp||this.#timeStamp}
	get timeStampRaw() {return this.#timeStamp}
	get els() {return this._els}
	get mouse() {return this._mouse}
	get typingDevice() {return this._typingDevice}
	get keyboard() {return this._typingDevice}
	get offset() {return this._offset}
    get defs() {return this._els.defs}
    get refs() {return this._els.refs}
    get allDefsAndRefs() {return this.defs.concat(this.refs)}
    get allEls() {return this.allDefsAndRefs.flatMap(x=>x.dots||x)}
    get fpsLimitRaw() {return this._fpsLimit}
    get fpsLimit() {
        const isStatic = !isFinite(this._fpsLimit)
        return this._fpsLimit==null||isStatic ? isStatic ? "static" : null : 1/(this._fpsLimit/1000)
    }
    get visibilityChangeCB() {return this._visibilityChangeCB}
    get maxTime() {return this.#maxTime}
    get viewPos() {return this._viewPos}
    get render() {return this._render}
    get speedModifier() {return this._speedModifier}
    get anims() {return this._anims}
    get mouseMoveListenersOptimizationEnabled() {return this._mouse._moveListenersOptimizationEnabled}
    get isOffscreenCanvas() {return this._cvs instanceof OffscreenCanvas} 
    get mouseMoveThrottlingDelay() {return this._mouseMoveThrottlingDelay}

	set id(id) {this._id = id}
	set loopingCB(loopingCB) {this._loopingCB = loopingCB}
	set width(w) {this.setSize(w, null)}
	set height(h) {this.setSize(null, h)}
	set offset(offset) {this._offset = offset}
	set fpsLimit(fpsLimit) {
        this._fpsLimit = CDEUtils.isDefined(fpsLimit)&&isFinite(fpsLimit) ? 1000/Math.max(fpsLimit, 0) : null
        this.#maxTime = this.#getMaxTime(fpsLimit)
    }
    set visibilityChangeCB(visibilityChangeCB) {
        this.#visibilityChangeLastState = this._state
        this._visibilityChangeCB = (isVisible, CVS, e)=>{
            if (!isVisible) this.#visibilityChangeLastState = this._state
            if (this.#visibilityChangeLastState==1) {
                if (isVisible) {
                    this.startLoop()
                    this.resetReferences()
                } else this.stopLoop()
            }
            if (CDEUtils.isFunction(visibilityChangeCB)) visibilityChangeCB(isVisible, CVS, e)
        }
    }
    set speedModifier(speedModifier) {this._speedModifier = speedModifier}
    set mouseMoveListenersOptimizationEnabled(enabled) {this._mouse._moveListenersOptimizationEnabled = enabled}
    set mouseMoveThrottlingDelay(mouseMoveThrottlingDelay) {this._mouseMoveThrottlingDelay = mouseMoveThrottlingDelay}
}
// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Allows the creation of smooth progress based animations 
class Anim {
    static #ANIM_ID_GIVER = 0
    static DEFAULT_DURATION = 1000

    constructor(animation, duration, easing, endCB) {
        this._id = Anim.#ANIM_ID_GIVER++                  // animation id
        this._animation = animation                      // the main animation (clampedProgress, playCount, progress)=>
        this._duration = duration??Anim.DEFAULT_DURATION // duration in ms, negative values make the animation repeat infinitly
        this._easing = easing||Anim.linear               // easing function (x)=>
        this._endCB = endCB                  // function called when animation is over

        this._startTime = null // start time
        this._progress = 0     // animation progress
        this._playCount = 0    // how many time the animation has played
    }
    
    // progresses the animation 1 frame fowards (loops each frame) 
    getFrame(time, deltaTime) {
        const isInfinite = this._duration<0, duration = isInfinite?-this._duration:this._duration, startTime = this._startTime
        if (!this._playCount || isInfinite) {
            // SET START TIME
            if (!startTime) this._startTime = time
            // PLAY ANIMATION
            else if (time<startTime+duration) {
                this._progress = this._easing((time-startTime)/duration)
                this._animation(this._progress, this._playCount, deltaTime, this.progress)
            }
            // REPEAT IF NEGATIVE DURATION
            else if (isInfinite) this.reset(true, deltaTime)
            // END
            else this.end(deltaTime)
        }
    }

    // ends the animation
    end(deltaTime) {
        this._animation(1, this._playCount++, deltaTime, 1)
        if (CDEUtils.isFunction(this._endCB)) this._endCB()
    }

    // resets the animation
    reset(isInfiniteReset, deltaTime) {
        if (isInfiniteReset) this._animation(1, this._playCount++, deltaTime, 1)
        else this._playCount = 0
        this._progress = 0
        this._startTime = null
    }

    get id() {return this._id}
    get animation() {return this._animation}
	get duration() {return this._duration}
	get easing() {return this._easing}
	get endCB() {return this._endCB}
	get startTime() {return this._startTime}
	get progress() {return CDEUtils.clamp(this._progress, 0, 1)}
	get progressRaw() {return this._progress}
	get playCount() {return this._playCount}

	set animation(_animation) {return this._animation = _animation}
	set duration(_duration) {return this._duration = _duration}
	set easing(_easing) {return this._easing = _easing}
	set endCB(_endCB) {return this._endCB = _endCB}

    // Easings from: https://easings.net/
    static easeInSine=x=>1-Math.cos(x*Math.PI/2)
    static easeOutSine=x=>Math.sin(x*Math.PI/2)
    static easeInOutSine=x=>-(Math.cos(Math.PI*x)-1)/2

    static easeInCubic=x=>x*x*x
    static easeOutCubic=x=>1-Math.pow(1-x,3)
    static easeInOutCubic=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2

    static easeInQuint=x=>x*x*x*x*x
    static easeOutQuint=x=>1-Math.pow(1-x,5)
    static easeInOutQuint=x=>x<.5?16*x*x*x*x*x:1-Math.pow(-2*x+2,5)/2

    static easeInCirc=x=>1-Math.sqrt(1-Math.pow(x,2))
    static easeOutCirc=x=>Math.sqrt(1-Math.pow(x-1,2))
    static easeInOutCirc=x=>x<.5?(1-Math.sqrt(1-Math.pow(2*x,2)))/2:(Math.sqrt(1-Math.pow(-2*x+2,2))+1)/2

    static easeInElastic=x=>0==x?0:1==x?1:-Math.pow(2,10*x-10)*Math.sin((10*x-10.75)*(2*Math.PI/3))
    static easeOutElastic=x=>0==x?0:1==x?1:Math.pow(2,-10*x)*Math.sin((10*x-.75)*(2*Math.PI/3))+1
    static easeInOutElastic=x=>0==x?0:1==x?1:x<.5?-Math.pow(2,20*x-10)*Math.sin((20*x-11.125)*(2*Math.PI)/4.5)/2:Math.pow(2,-20*x+10)*Math.sin((20*x-11.125)*(2*Math.PI)/4.5)/2+1

    static easeInQuad=x=>x*x
    static easeOutQuad=x=>1-(1-x)*(1-x)
    static easeInOutQuad=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2

    static easeInQuart=x=>x*x*x*x
    static easeOutQuart=x=>1-Math.pow(1-x,4)
    static easeInOutQuart=x=>x<.5?8*x*x*x*x:1-Math.pow(-2*x+2,4)/2

    static easeInExpo=x=>0==x?0:Math.pow(2,10*x-10)
    static easeOutExpo=x=>1==x?1:1-Math.pow(2,-10*x)
    static easeInOutExpo=x=>0==x?0:1==x?1:x<.5?Math.pow(2,20*x-10)/2:(2-Math.pow(2,-20*x+10))/2

    static easeInBack=x=>2.70158*x*x*x-1.70158*x*x
    static easeOutBack=x=>1+2.70158*Math.pow(x-1,3)+1.70158*Math.pow(x-1,2)
    static easeInOutBack=x=>x<.5?Math.pow(2*x,2)*(7.189819*x-2.5949095)/2:(Math.pow(2*x-2,2)*(3.5949095*(2*x-2)+2.5949095)+2)/2

    static easeInBounce=x=>1-Anim.easeOutBounce(1-x)
    static easeOutBounce=x=>x<1/2.75?7.5625*x*x:x<2/2.75?7.5625*(x-=1.5/2.75)*x+.75:x<2.5/2.75?7.5625*(x-=2.25/2.75)*x+.9375:7.5625*(x-=2.625/2.75)*x+.984375
    static easeInOutBounce=x=>x<.5?(1-Anim.easeOutBounce(1-2*x))/2:(1+Anim.easeOutBounce(2*x-1))/2

    static linear=x=>x
}
// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Abstract canvas obj class
class _BaseObj extends _HasColor {
    static DEFAULT_POS = [0,0]
    static ABSOLUTE_ANCHOR = [0,0]
    static POSITION_PRECISION = 6

    #lastAnchorPos = [0,0]
    constructor(pos, color, setupCB, loopCB, anchorPos, activationMargin) {
        super(color)
        this._id = Canvas.ELEMENT_ID_GIVER++     // canvas obj id
        this._initPos = pos||[0,0]               // initial position : [x,y] || (Canvas)=>{return [x,y]}
        this._pos = [0,0]                        // current position from the center of the object : [x,y]
        this._setupCB = setupCB??null            // called on object's initialization (this, this.parent)=>
        this._loopCB = loopCB                    // called each frame for this object (this)=>
        this._setupResults = null                // return value of the setupCB call
        this._anchorPos = anchorPos              // current reference point from which the object's pos will be set
        this._activationMargin = activationMargin??Canvas.DEFAULT_CANVAS_ACTIVE_AREA_PADDING // the px margin amount where the object remains active when outside the canvas visual bounds. If "true", the object will always remain active.
        
        this._parent = null                      // the object's parent
        this._rotation = 0                       // the object's rotation in degrees 
        this._scale = [1,1]                      // the object's scale factors: [scaleX, scaleY]
        this._anims = {backlog:[], currents:[]}  // all "currents" animations playing are playing simultaneously, the backlog animations run in a queue, one at a time
        this._visualEffects = null               // the visual effects modifers of the objects: [filter, compositeOperation, opacity]
        this._initialized = false                // whether the object has been initialized yet
    }

    // Runs when the object gets added to a canvas instance
    initialize() {
        this._pos = this.getInitPos()||_BaseObj.DEFAULT_POS
        this.color = this.getInitColor()
        this.setAnchoredPos()
        if (CDEUtils.isFunction(this._setupCB)) {
            const setupResults = this._setupCB(this, this.parent)
            if (setupResults !== undefined) this._setupResults = setupResults
        }
    }

    // Runs every frame
    draw(time, deltaTime) {
        this.setAnchoredPos()
        const loopCB = this._loopCB
        if (loopCB && this.initialized) loopCB(this, deltaTime)

        let anims = this._anims.currents
        if (this._anims.backlog[0]) anims = [...anims, this._anims.backlog[0]]
        const a_ll = anims.length
        if (a_ll) for (let i=0;i<a_ll;i++) anims[i].getFrame(time, deltaTime)
    }

    // returns the value of the inital color declaration
    getInitColor() {
        return CDEUtils.isFunction(this._initColor) ? this._initColor(this.render??this.parent.render, this) : this._initColor||null
    }

    // returns the value of the inital pos declaration
    getInitPos() {
        return CDEUtils.isFunction(this._initPos) ? CDEUtils.unlinkArr2(this._initPos(this._parent instanceof Canvas?this:this._parent, this)) : CDEUtils.unlinkArr2(this.adjustPos(this._initPos))
    }

    // sets the pos of the object according to its anchorPos
    setAnchoredPos() {
        const anchorPos = this.hasAnchorPosChanged
        if (anchorPos) {
            const [anchorPosX, anchorPosY] = anchorPos
            this.relativeX += anchorPosX-this.#lastAnchorPos[0]
            this.relativeY += anchorPosY-this.#lastAnchorPos[1]
            this.#lastAnchorPos = anchorPos
        }
    }

    // Teleports to given coords
    moveAt(pos) {
        const [x, y] = pos
        if (CDEUtils.isDefined(x) && isFinite(x)) this.x = x
        if (CDEUtils.isDefined(y) && isFinite(y)) this.y = y
    }

    // Teleports to incremented coords
    moveBy(pos) {
        const [x, y] = pos
        if (CDEUtils.isDefined(x) && isFinite(x)) this.x += x
        if (CDEUtils.isDefined(y) && isFinite(y)) this.y += y
    }

    // Smoothly moves to coords in set time
    moveTo(pos, time, easing, initPos, isUnique, force) {
        time??=1000
        easing??=Anim.easeInOutQuad
        initPos??=this.pos_
        isUnique??=true
        force??=true

        const [ix, iy] = initPos, [fx, fy] = this.adjustPos(pos), dx = fx-ix, dy = fy-iy
        return this.playAnim(new Anim((prog)=>{
            this.x = ix+dx*prog
            this.y = iy+dy*prog
        }, time, easing), isUnique, force)
    }

    // Rotates the object clock-wise by a specified degree increment around its pos
    rotateBy(deg) {
        this.rotation = (this._rotation+deg)%360
    }

    // Rotates the object to a specified degree around its pos
    rotateAt(deg) {
        this.rotation = deg%360
    }

    // Smoothly rotates the object to a specified degree around its pos
    rotateTo(deg, time=1000, easing=Anim.easeInOutQuad, isUnique=false, force=false) {
        const ir = this._rotation, dr = deg-this._rotation
        return this.playAnim(new Anim((prog)=>this.rotateAt(ir+dr*prog), time, easing), isUnique, force)
    }

    // Scales the object by a specified amount [scaleX, scaleY] from its pos
    scaleBy(scale) {
        let [scaleX, scaleY] = scale
        if (!CDEUtils.isDefined(scaleX)) scaleX = this._scale[0]
        if (!CDEUtils.isDefined(scaleY)) scaleY = this._scale[1]
        this.scale[0] *= scaleX
        this.scale[1] *= scaleY
    }

    // Scales the object to a specified amount [scaleX, scaleY] from its pos
    scaleAt(scale) {
        this.scale = scale
    }

    // Smoothly scales the text to a specified amount [scaleX, scaleY] from its pos
    scaleTo(scale, time=1000, easing=Anim.easeInOutQuad, centerPos=this.pos, isUnique=false, force=false) {
        const is = CDEUtils.unlinkArr2(this._scale), dsX = scale[0]-is[0], dsY = scale[1]-is[1]
        return this.playAnim(new Anim(prog=>this.scaleAt([is[0]+dsX*prog, is[1]+dsY*prog], centerPos), time, easing), isUnique, force)
    }

    /**
    * Used to make an object follow a custom path
    * @param {Number} duration: duration of the animation in ms
    * @param {Function} easing: easing function 
    * @param {Function?} action: custom callback that can be called in addition to the movement                                                        //newProg is 'prog' - the progress delimeter of the range
    * @param {[[Number, Function], ...]} progressSeparations: list of callback paired with a progress range, the callback must return a position (prog, newProg, initX, initY)=>return [x,y]
    * progressSeparations example: [0:(prog)=>[x1, y1]], [0.5:(prog, fprog)=>[x2, y2]] -> from 0% to 49% the pos from 1st callback is applied, from 50%-100% the pos from 2nd callback is applied  
    */
    follow(duration, easing, action, progressSeparations) {
        let [ix, iy] = this._pos, ps_ll = progressSeparations.length-1
        this.playAnim(new Anim((prog)=>{
            let progSep = null
            if (prog<0) prog=0
            for (let i=ps_ll;i>=0;i--) {
                let progressSepIndex = progressSeparations[i]
                if (progressSepIndex[0] <= prog) {
                    progSep = progressSepIndex
                    break
                }
            }
            const [nx, ny] = progSep[1](prog, prog-progSep[0], this, ix, iy)
            this.moveAt([ix+nx, iy+ny])
            if (CDEUtils.isFunction(action)) action(prog, this)
        }, duration, easing))
    }

    // moves the obj in specified direction at specified distance(force)
    addForce(distance, dir, time=1000, easing=Anim.easeInOutQuad, isUnique=true, animForce=true) {
        let rDir = CDEUtils.toRad(dir), ix = this.x, iy = this.y,
            dx = CDEUtils.getAcceptableDiff(distance*Math.cos(rDir), CDEUtils.DEFAULT_ACCEPTABLE_DIFFERENCE),
            dy = CDEUtils.getAcceptableDiff(distance*Math.sin(rDir), CDEUtils.DEFAULT_ACCEPTABLE_DIFFERENCE)
        
        return this.playAnim(new Anim(prog=>{
            this.x = ix+dx*prog
            this.y = iy-dy*prog
        }, time, easing), isUnique, animForce)
    }

    // adds an animation to play. "isUnique" makes it so the animation gets queue in the backlog. "force" terminates the current backlog animation and replaces it with the specified "anim"
    playAnim(anim, isUnique, force) {
        if (isUnique && this.currentBacklogAnim && force) {
            this.currentBacklogAnim.end()
            CDEUtils.addAt(this._anims.backlog, anim, 0)
        }
        const initEndCB = anim.endCB
        anim.endCB=()=>{
            if (isUnique) this._anims.backlog.shift()
            else this._anims.currents = this._anims.currents.filter(a=>a.id!==anim.id)
            
            if (CDEUtils.isFunction(initEndCB)) initEndCB()
        }
        this._anims[isUnique?"backlog":"currents"].push(anim)
        return anim
    }

    // clears all blacklog and currents anim
    clearAnims() {
        this._anims.backlog = []
        this._anims.currents = []
    }

    // allows flexible pos declarations
    adjustPos(pos) {
        let [x, y] = pos
        if (!CDEUtils.isDefined(x)) x = this.x??0
        if (!CDEUtils.isDefined(y)) y = this.y??0
        return [x, y]
    }

    // deletes the object from the canvas
    remove() {
        this._parent.remove(this._id)
    }

    // returns whether the provided pos is in the provided positions
    isWithin(pos, positions) {
        return pos[0] >= positions[0][0] && pos[0] <= positions[1][0] && pos[1] >= positions[0][1] && pos[1] <= positions[1][1]
    }

    // returns the center pos of the provided positions
    getCenter(positions) {
        return CDEUtils.getPositionsCenter(positions)
    }

    // returns the 4 corners of the provided positions accounting for rotation and scale. corners -> [TOP-LEFT, BOTTOM-RIGHT, TOP-RIGHT, BOTTOM-LEFT]
    getCorners(positions, padding=0, rotation, scale, centerPos=this.getCenter(positions)) {
        const rotatePos = CDEUtils.rotatePos, scalePos = CDEUtils.scalePos

        positions[2] = [positions[1][0], positions[0][1]]
        positions[3] = [positions[0][0], positions[1][1]]
        
        if (scale) {
            positions[0] = scalePos(positions[0], scale, centerPos)
            positions[1] = scalePos(positions[1], scale, centerPos)
            positions[2] = scalePos(positions[2], scale, centerPos)
            positions[3] = scalePos(positions[3], scale, centerPos)
        }
        if (rotation) {
            positions[0] = rotatePos(positions[0], rotation, centerPos)
            positions[1] = rotatePos(positions[1], rotation, centerPos)
            positions[2] = rotatePos(positions[2], rotation, centerPos)
            positions[3] = rotatePos(positions[3], rotation, centerPos)
        }

        padding??=0
        if (padding) {
            padding = typeof padding=="number" ? [padding, padding, padding, padding] : [padding[0],padding[1]??padding[0], padding[2]??padding[0], padding[3]??padding[1]]

            positions[0][0] -= padding[3]
            positions[0][1] -= padding[0]
            positions[2][0] += padding[1]
            positions[2][1] -= padding[0]
            positions[1][0] += padding[1]
            positions[1][1] += padding[2]
            positions[3][0] -= padding[3]
            positions[3][1] += padding[2]
        }

        return positions
    }

    // returns the minimal rectangular area defined by the provided positions
    getBounds(positions, padding, rotation, scale, centerPos=this.getCenter(positions)) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity

        positions = this.getCorners(positions, 0, rotation, scale, centerPos)

        const p_ll = positions.length
        for (let i=0;i<p_ll; i++) {
            let [x, y] = positions[i]
            if (x < minX) minX = x
            if (x > maxX) maxX = x
            if (y < minY) minY = y
            if (y > maxY) maxY = y
        }   
        
        padding??=0
        padding = typeof padding=="number" ? [padding, padding, padding, padding] : [padding[0],padding[1]??padding[0], padding[2]??padding[0], padding[3]??padding[1]]

        return [[minX-padding[3], minY-padding[0]],[maxX+padding[1], maxY+padding[2]]]
    }

	get id() {return this._id}
    get x() {return this._pos[0]}
    get y() {return this._pos[1]}
    get pos() {return this._pos}
    get pos_() {return CDEUtils.unlinkArr2(this._pos)}
    get relativeX() {return this.x-this.anchorPos[0]}
    get relativeY() {return this.y-this.anchorPos[1]}
    get relativePos() {return [this.relativeX, this.relativeY]}
    get stringPos() {return this.x+","+this.y}
	get initPos() {return this._initPos}
    get currentBacklogAnim() {return this._anims.backlog[0]}
    get anims() {return this._anims}
    get setupCB() {return this._setupCB}
    get loopCB() {return this._loopCB}
    get loopingCB() {return this._loopCB}
    get setupResults() {return this._setupResults}
    get initialized() {return this._initialized}
    get activationMargin() {return this._activationMargin}
    get anchorPosRaw() {return this._anchorPos}
    get anchorPos() {// returns the anchorPos value
        if (Array.isArray(this._anchorPos)) return this._anchorPos
        else if (!this._anchorPos) return (this.parent instanceof Canvas) ? [0,0] : this.parent?.pos_
        else if (this._anchorPos instanceof _BaseObj) return this._anchorPos.pos_
        else if (CDEUtils.isFunction(this._anchorPos)) {
            const res = this._anchorPos(this, this.parent)
            return CDEUtils.unlinkArr2((res?.pos_||res||[0,0]))
        }
    }
    get lastAnchorPos() {return this.#lastAnchorPos}
    get hasAnchorPosChanged() {
        const anchorPos = this.anchorPos
        return !CDEUtils.posEquals(this.#lastAnchorPos, anchorPos)&&anchorPos
    }
    get parent() {return this._parent}
    get rotation() {return this._rotation}
    get scale() {return this._scale}
    get visualEffects() {return this._visualEffects??[]}
    get visualEffects_() {
        const visualEffects = this._visualEffects
        return visualEffects?CDEUtils.unlinkArr3(visualEffects):[]
    }
    get filter() {return this._visualEffects?.[0]??Render.DEFAULT_FILTER}
    get compositeOperation() {return this._visualEffects?.[1]??Render.DEFAULT_COMPOSITE_OPERATION}
    get opacity() {return this._visualEffects?.[2]??Render.DEFAULT_ALPHA}
    get safeColorObject() {return this.initialized&&this._color}


    set x(x) {this._pos[0] = CDEUtils.round(x, _BaseObj.POSITION_PRECISION)}
    set y(y) {this._pos[1] = CDEUtils.round(y, _BaseObj.POSITION_PRECISION)}
    set pos(pos) {
        this.x = pos[0]
        this.y = pos[1]
    }
    set relativeX(x) {this.x = this.anchorPos[0]+x}
    set relativeY(y) {this.y = this.anchorPos[1]+y}
    set relativePos(pos) {
        this.relativeX = CDEUtils.round(pos[0], _BaseObj.POSITION_PRECISION)
        this.relativeY = CDEUtils.round(pos[1], _BaseObj.POSITION_PRECISION)
    }
    set initPos(initPos) {this._initPos = initPos}
    set setupCB(cb) {this._setupCB = cb}
    set loopCB(cb) {this._loopCB = cb}
    set loopingCB(cb) {this._loopCB = cb}
    set setupResults(value) {this._setupResults = value}
    set initialized(init) {this._initialized = init}
    set activationMargin(activationMargin) {this._activationMargin = activationMargin}
    set anchorPos(anchorPos) {this.anchorPosRaw = anchorPos}
    set anchorPosRaw(anchorPos) {this._anchorPos = anchorPos}
    set lastAnchorPos(lastAnchorPos) {this.#lastAnchorPos = lastAnchorPos}
    set rotation(_rotation) {this._rotation = _rotation%360}
    set scale(scale) {
        let [scaleX, scaleY] = scale
        if (!CDEUtils.isDefined(scaleX)) scaleX = this._scale[0]
        if (!CDEUtils.isDefined(scaleY)) scaleY = this._scale[1]
        this._scale[0] = scaleX
        this._scale[1] = scaleY
    }
    set visualEffects(visualEffects) {this._visualEffects = !visualEffects?.length ? null : CDEUtils.unlinkArr3(visualEffects)}
    set filter(filter) {
        const visualEffects = this._visualEffects
        if (!visualEffects) this._visualEffects = [filter]
        else visualEffects[0] = filter
    }
    set compositeOperation(compositeOperation) {
        const visualEffects = this._visualEffects
        if (!visualEffects) this._visualEffects = [,compositeOperation]
        else visualEffects[1] = compositeOperation
    }
    set opacity(opacity) {
        const visualEffects = this._visualEffects
        if (!visualEffects) this._visualEffects = [,,opacity]
        else visualEffects[2] = opacity
    }
}
// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Displays audio as an object
class AudioDisplay extends _BaseObj {
    static LOADED_IR_BUFFERS = []
    static SUPPORTED_AUDIO_FORMATS = ["mp3", "wav", "ogg", "aac", "m4a", "opus", "flac"]
    static SOURCE_TYPES = {FILE_PATH:"string", DYNAMIC:"[object Object]", MICROPHONE:"MICROPHONE", SCREEN_AUDIO:"SCREEN_AUDIO", VIDEO:HTMLVideoElement, AUDIO:HTMLAudioElement}
    static MINIMAL_FFT = 1
    static MAXIMAL_FFT = 32768
    static DEFAULT_SAMPLE_COUNT = 64
    static DEFAULT_BINCB = (render, bin, pos, audioDisplay)=>{
        const barWidth = 2, barHeight = 100*bin, spacing = 5
        render.batchFill(Render.getRect(pos, barWidth, barHeight), audioDisplay._color, audioDisplay.visualEffects)
        pos[0] += spacing
        return [pos]
    }
    static DEFAULT_BINCB_TRANSFORMABLE = (render, bin, pos, audioDisplay)=>{
        const barWidth = 2, barHeight = 100*bin, spacing = 5
        render.fill(Render.getRect(pos, barWidth, barHeight), audioDisplay._color, audioDisplay.visualEffects)
        pos[0] += spacing
        return [pos]
    }
    static BIN_CALLBACKS = {DEFAULT:AudioDisplay.DEFAULT_BINCB, CIRCLE:AudioDisplay.CIRCLE(), BARS:AudioDisplay.BARS(), TOP_WAVE:AudioDisplay.TOP_WAVE()}
    static MICROPHONE_CHANNELS = {MONO:1, STEREO:2}
    static DEFAULT_MICROPHONE_DELAY = 1
    static DEFAULT_MICROPHONE_AUTO_GAIN_CONTROL = false
    static DEFAULT_MICROPHONE_ECHO_CANCELLATION = false
    static DEFAULT_MICROPHONE_NOISE_SUPPRESSION = false
    static DEFAULT_MICROPHONE_CHANNEL_COUNT = AudioDisplay.MICROPHONE_CHANNELS.STEREO
    static DEFAULT_MICROPHONE_SAMPLE_RATE = 48000
    static DEFAULT_MICROPHONE_SAMPLE_SIZE = 16
    static DEFAULT_MICROPHONE_SETTINGS = AudioDisplay.loadMicrophone()
    static DEFAULT_SCREEN_AUDIO_SETTINGS = AudioDisplay.loadScreenAudio()
    static MAX_NORMALISED_DATA_VALUE = 255/128
    static MAX_DELAY_TIME = 179
    static ERROR_TYPES = {NO_PERMISSION:0, DEVICE_IN_USE:1, SOURCE_DISCONNECTED:2, FILE_NOT_FOUND:3, NOT_AVAILABLE:4, NOT_SUPPORTED:5}
    static BIQUAD_FILTER_TYPES = {DEFAULT:"allpass", ALLPASS:"allpass", BANDPASS:"bandpass", HIGHPASS:"highpass", HIGHSHELF:"highshelf", LOWPASS:"lowpass", LOWSHELF:"lowshelf", NOTCH:"notch", PEAKING:"peaking"}
    static IS_MICROPHONE_SUPPORTED = ()=>!!navigator?.mediaDevices?.getUserMedia
    static IS_SCREEN_ADUIO_SUPPORTED = ()=>!!navigator?.mediaDevices?.getDisplayMedia

    #buffer_ll = null // the length of data
    #data = null      // the fft data values (raw bins)
    #fft = null       // the fftSize
    constructor(source, pos, color, binCB, sampleCount, disableAudio, offsetPourcent, errorCB, setupCB, loopCB, anchorPos, activationMargin) {
        super(pos, color, setupCB, loopCB, anchorPos, activationMargin)
        this._source = source??""                                         // the source of the audio
        this._binCB = binCB??AudioDisplay.DEFAULT_BINCB                   // callback called for each bin of the audio, use this to create the display (render, bin, atPos, audioDisplay, accumulator, i, sampleCount, rawBin)=>{... return? [ [newX, newY], newAccumulatorValue ]}
        this._sampleCount = sampleCount??AudioDisplay.DEFAULT_SAMPLE_COUNT// the max count of bins, (fftSize is calculated by the nearest valid value). Ex: if sampleCount is "32" and the display style is "BARS", 32 bars will be displayed
        this._disableAudio = disableAudio??false                          // whether the audio output is disabled or not (does not affect the visual display) 
        this._offsetPourcent = offsetPourcent??0                          // the offset pourcent (0..1) in the bins when calling binCB. 
        this._errorCB = errorCB                                           // a callback called if there is an error with the source (errorType, e?)=>
        this._transformable = 0                                           // if above 0, allows transformations with non batched canvas operations

        // audio stuff
        this._audioCtx = new AudioContext()
        Canvas.addOnFirstInteractCallback(()=>this._audioCtx.resume())
        this._audioAnalyser = this._audioCtx.createAnalyser()
        this._gainNode = this._audioCtx.createGain()
        this._biquadFilterNode = this._audioCtx.createBiquadFilter()
        this._biquadFilterNode.type = AudioDisplay.BIQUAD_FILTER_TYPES.DEFAULT
        this._convolverNode = this._audioCtx.createConvolver()
        this._waveShaperNode = this._audioCtx.createWaveShaper()
        this._dynamicsCompressorNode = this._audioCtx.createDynamicsCompressor()
        this._pannerNode = this._audioCtx.createPanner()
        this._delayNode = this._audioCtx.createDelay(AudioDisplay.MAX_DELAY_TIME)
        this.#fft = this._audioAnalyser.fftSize = Math.max(32, 2**Math.round(Math.log2(this._sampleCount*2)))
        this.#buffer_ll = this._audioAnalyser.frequencyBinCount
        this.#data = new Uint8Array(this.#buffer_ll)
    }

    initialize() {
        this.initializeSource()
        this._pos = this.getInitPos()||_BaseObj.DEFAULT_POS
        this.setAnchoredPos()
        super.initialize()
    }

    draw(render, time, deltaTime) {
        if (this.initialized) {
            const ctx = render.ctx, hasScaling = this._scale[0]!==1||this._scale[1]!==1, hasTransforms = this._rotation||hasScaling, data = this.#data

            let viewPos
            if (this._transformable) {
                if (hasTransforms) {
                    const cx = this._pos[0], cy = this._pos[1]
                    viewPos = this.parent.viewPos
                    ctx.translate(cx, cy)
                    if (this._rotation) ctx.rotate(CDEUtils.toRad(this._rotation))
                    if (hasScaling) ctx.scale(this._scale[0], this._scale[1])
                    ctx.translate(-cx, -cy)
                }
            }
   
            this._audioAnalyser.getByteFrequencyData(data)
            let atPos = this.pos_, accumulator = null, smapleCount = this._sampleCount, offset = (this._offsetPourcent%1)*(this.#fft/2), adjusted_ll = Math.round(0.49+smapleCount)-offset, ii=-offset, i=offset>>0
            for (;ii<adjusted_ll;ii++,i=(i+1)%smapleCount) {
                const bin = data[i], res = this._binCB(render, bin/128, atPos, this, accumulator, i, smapleCount, bin), newPos = res?.[0], newAcc = res?.[1]
                if (newPos) atPos = newPos
                if (newAcc) accumulator = newAcc
            }

            if (this._transformable && hasTransforms) ctx.setTransform(1,0,0,1,viewPos[0],viewPos[1])
        }
        super.draw(time, deltaTime)
    }

    // updates the "transformable" attribute according to whether any rotation/scale are setted
    #updateTransformable() {
        const hasTransforms = this._rotation || this._scale[0]!=1 || this._scale[1]!=1
        if (hasTransforms && this._transformable < 2) this._transformable = 2
        else if (!hasTransforms && this._transformable) this._transformable--
    }

    // (NOT ALWAYS RELIABLE) returns whether the provided pos is in the audio display
    isWithin(pos, padding, rotation, scale) {
        return super.isWithin(pos, this.getBounds(padding, rotation, scale), padding)
    }

    // (NOT ALWAYS RELIABLE) returns the raw a minimal rectangular area containing all of the audio display (no scale/rotation)
    #getRectBounds(binWidth=2, binHeight=100, binSpacing=5) {
        const pos = this._pos, sizeX = this._sampleCount*(binWidth*binSpacing)/2
        return [[pos[0],pos[1]], [pos[0]+sizeX,pos[1]+binHeight*2]]
    }

    // (NOT ALWAYS RELIABLE) returns the center pos of the audio display
    getCenter() {
        return super.getCenter(this.#getRectBounds())
    }

    // (NOT ALWAYS RELIABLE) returns the minimal rectangular area containing all of the audio display
    getBounds(padding, rotation=this._rotation, scale=this._scale) {
        const positions = this.#getRectBounds()
        return super.getBounds(positions, padding, rotation, scale, this._pos)
    }

    // Final source initializes step
    initializeSource(source=this._source) {
        AudioDisplay.initializeDataSource(source, (audio, isStream)=>{
            this._source = audio

            if (isStream) {
                audio.oninactive=e=>{if (CDEUtils.isFunction(this._errorCB)) this._errorCB(AudioDisplay.ERROR_TYPES.SOURCE_DISCONNECTED, source, e)}
                this._source = this._audioCtx.createMediaStreamSource(audio)
                this._source.connect(this._gainNode)
            } else this._audioCtx.createMediaElementSource(audio).connect(this._gainNode)
            
            this._gainNode.connect(this._biquadFilterNode)
            this._biquadFilterNode.connect(this._waveShaperNode)
            this._waveShaperNode.connect(this._dynamicsCompressorNode)
            this._dynamicsCompressorNode.connect(this._pannerNode)
            this._pannerNode.connect(this._delayNode)
            this._delayNode.connect(this._audioAnalyser)
            if (!this._disableAudio) this._audioAnalyser.connect(this._audioCtx.destination)

            this._initialized = true
            if (CDEUtils.isFunction(this._setupCB)) this._setupResults = this._setupCB(this, this._parent, this._source)
        }, this._errorCB)
    }

    // Initializes a AudioDisplay data source
    static initializeDataSource(dataSrc, loadCallback, errorCB) {
        const types = AudioDisplay.SOURCE_TYPES
        if (typeof dataSrc==types.FILE_PATH) {
            if (AudioDisplay.isAudioFormatSupported(dataSrc)) AudioDisplay.#initAudioDataSource(AudioDisplay.loadAudio(dataSrc), loadCallback, errorCB)
            else if (ImageDisplay.isVideoFormatSupported(dataSrc)) AudioDisplay.#initAudioDataSource(ImageDisplay.loadVideo(dataSrc), loadCallback, errorCB)
            else if (CDEUtils.isFunction(errorCB)) errorCB(AudioDisplay.ERROR_TYPES.NOT_SUPPORTED, dataSrc) 
        } else if (dataSrc.toString()==types.DYNAMIC) {
            if (dataSrc.type==types.MICROPHONE) AudioDisplay.#initMicrophoneDataSource(dataSrc.settings, loadCallback, errorCB)
            else if (dataSrc.type==types.SCREEN_AUDIO) AudioDisplay.#initScreenAudioDataSource(dataSrc.settings, loadCallback, errorCB)
        } else if (dataSrc instanceof types.VIDEO || dataSrc instanceof types.AUDIO) AudioDisplay.#initAudioDataSource(dataSrc, loadCallback, errorCB)
        else if (dataSrc instanceof MediaStream) {
            if (dataSrc.getAudioTracks().length && CDEUtils.isFunction(loadCallback)) loadCallback(dataSrc, true)
            else if (CDEUtils.isFunction(errorCB)) errorCB(AudioDisplay.ERROR_TYPES.NO_AUDIO_TRACK, dataSrc)
        }
    }

    // Initializes a audio data source
    static #initAudioDataSource(dataSource, loadCallback, errorCB) {
        const initLoad=()=>{if (CDEUtils.isFunction(loadCallback)) loadCallback(dataSource)}
        dataSource.onerror=e=>{if (CDEUtils.isFunction(errorCB)) errorCB(AudioDisplay.ERROR_TYPES.FILE_NOT_FOUND, dataSource, e)}
        if (dataSource.readyState) initLoad()
        else dataSource.onloadeddata=initLoad
    }

    // Initializes a camera audio capture data source
    static #initMicrophoneDataSource(settings=true, loadCallback, errorCB) {
        if (AudioDisplay.IS_MICROPHONE_SUPPORTED()) navigator.mediaDevices.getUserMedia({audio:settings}).then(src=>{
            if (src.getAudioTracks().length && CDEUtils.isFunction(loadCallback)) loadCallback(src, true)
            else if (CDEUtils.isFunction(errorCB)) errorCB(AudioDisplay.ERROR_TYPES.NO_AUDIO_TRACK, settings)
        }).catch(e=>{if (CDEUtils.isFunction(errorCB)) errorCB(AudioDisplay.ERROR_TYPES.NO_PERMISSION, settings, e)})
        else if (CDEUtils.isFunction(errorCB)) errorCB(AudioDisplay.ERROR_TYPES.NOT_AVAILABLE, settings)
    }

    // Initializes a screen audio capture data source
    static #initScreenAudioDataSource(settings=true, loadCallback, errorCB) {
        if (AudioDisplay.IS_MICROPHONE_SUPPORTED()) navigator.mediaDevices.getDisplayMedia({audio:settings}).then(src=>{
            if (src.getAudioTracks().length && CDEUtils.isFunction(loadCallback)) loadCallback(src, true)
            else if (CDEUtils.isFunction(errorCB)) errorCB(AudioDisplay.ERROR_TYPES.NO_AUDIO_TRACK, settings)
        }).catch(e=>{if (CDEUtils.isFunction(errorCB)) errorCB(AudioDisplay.ERROR_TYPES.NO_PERMISSION, settings, e)})
        else if (CDEUtils.isFunction(errorCB)) errorCB(AudioDisplay.ERROR_TYPES.NOT_AVAILABLE, settings)
    }

    // Returns a usable video source
    static loadAudio(path, looping=true, autoPlay=true) {
        const audio = new Audio(path)
        audio.preload = "auto"
        audio.loop = looping
        if (autoPlay) {
            audio.autoplay = autoPlay
            ImageDisplay.playMedia(audio)
        }
        return audio
    }

    // returns a usable microphone capture source
    static loadMicrophone(autoGainControl, echoCancellation, noiseSuppression, isStereo, delay, sampleRate, sampleSize) {
        autoGainControl??=AudioDisplay.DEFAULT_MICROPHONE_AUTO_GAIN_CONTROL
        echoCancellation??=AudioDisplay.DEFAULT_MICROPHONE_ECHO_CANCELLATION
        noiseSuppression??=AudioDisplay.DEFAULT_MICROPHONE_NOISE_SUPPRESSION
        isStereo??=true
        delay??=AudioDisplay.DEFAULT_MICROPHONE_DELAY
        sampleRate??=AudioDisplay.DEFAULT_MICROPHONE_SAMPLE_RATE
        sampleSize??=AudioDisplay.DEFAULT_MICROPHONE_SAMPLE_SIZE
        return {
            type:AudioDisplay.SOURCE_TYPES.MICROPHONE,
            settings:{
                autoGainControl,
                channelCount: isStereo?2:1,
                echoCancellation,
                latency: delay,
                noiseSuppression,
                sampleRate,
                sampleSize,
            }
        }
    }

    // returns a usable screen audio capture source 
    static loadScreenAudio(autoGainControl, echoCancellation, noiseSuppression, isStereo, delay, sampleRate, sampleSize) {
        autoGainControl??=AudioDisplay.DEFAULT_MICROPHONE_AUTO_GAIN_CONTROL
        echoCancellation??=AudioDisplay.DEFAULT_MICROPHONE_ECHO_CANCELLATION
        noiseSuppression??=AudioDisplay.DEFAULT_MICROPHONE_NOISE_SUPPRESSION
        isStereo??=true
        delay??=AudioDisplay.DEFAULT_MICROPHONE_DELAY
        sampleRate??=AudioDisplay.DEFAULT_MICROPHONE_SAMPLE_RATE
        sampleSize??=AudioDisplay.DEFAULT_MICROPHONE_SAMPLE_SIZE
        return {
            type:AudioDisplay.SOURCE_TYPES.SCREEN_AUDIO,
            settings:{
                autoGainControl,
                channelCount: isStereo?2:1,
                echoCancellation,
                latency: delay,
                noiseSuppression,
                sampleRate,
                sampleSize,
            }
        }
    }

    // provides a generic customizable distortion curve to use with the waveShaperNode.curve (based on https://stackoverflow.com/questions/22312841/waveshaper-node-in-webaudio-how-to-emulate-distortion)
    static getDistortionCurve(intensity) {
        if (!intensity) return null
        let n_samples = 44100, curve = new Float32Array(n_samples), i=0
        for (;i<n_samples;i++) {
            const x = i*2/n_samples-1
            curve[i] = (3+intensity)*x*20*CDEUtils.TO_DEGREES/(Math.PI+intensity*Math.abs(x))
        }
        return curve
    }

    // connects the convolverNode to the audio chain
    connectConvolver() {
        this._biquadFilterNode.disconnect(0)
        this._biquadFilterNode.connect(this._convolverNode)
        this._convolverNode.connect(this._dynamicsCompressorNode)
    }

    // disconnects the convolverNode from the audio chain
    disconnectConvolver() {
        this._biquadFilterNode.disconnect(0)
        this._biquadFilterNode.connect(this._dynamicsCompressorNode)
    }

    // loads a impulse response file into a usable buffer
    loadImpulseResponse(filePath, readyCallback=buffer=>{this.setReverb(buffer);this.connectConvolver()}) {
        fetch(filePath).then(res=>res.arrayBuffer()).then(data=>this._audioCtx.decodeAudioData(data)).then(buffer=>{
            AudioDisplay.LOADED_IR_BUFFERS.push(buffer)
            if (CDEUtils.isFunction(readyCallback)) readyCallback(buffer)
        })
    }

    // sets the gain value of the audio 
    setVolume(gain=1) {
        this._gainNode.gain.value = gain
    }

    // sets the filter type of the biquadFilterNode
    setBiquadFilterType(filterType=AudioDisplay.BIQUAD_FILTER_TYPES.DEFAULT) {
        this._biquadFilterNode.type = filterType
    }

    // sets the distortion curve of the waveShaperNode
    setDistortionCurve(intensity=null) {
        this._waveShaperNode.curve = typeof intensity=="number" ? AudioDisplay.getDistortionCurve(intensity) : intensity
    }

    // sets the 3D position of the audio's origin
    setOriginPos(x=0, y=0, z=0, secondsOffset=0) {
        const time = this._audioCtx.currentTime
        if (x!=null) this._pannerNode.positionX.setValueAtTime(x, time+secondsOffset)
        if (y!=null) this._pannerNode.positionY.setValueAtTime(y, time+secondsOffset)
        if (z!=null) this._pannerNode.positionZ.setValueAtTime(z, time+secondsOffset)
    }

    // sets the audio feedback delay (in seconds)
    setDelay(seconds=0) {
        this._delayNode.delayTime.value = seconds > AudioDisplay.MAX_DELAY_TIME ? AudioDisplay.MAX_DELAY_TIME : seconds
    }

    // sets the convolverNode impulse response buffer
    setReverb(buffer=null) {
        if (buffer) this._convolverNode.buffer = buffer
        else this.disconnectConvolver()
    }
    
    // resets all audio modifiers to their default values (-> no audio changes)
    resetAudioModifiers() {
        this.setVolume()
        this.setBiquadFilterType()
        this.setDistortionCurve()
        this.setOriginPos()
        this.setDelay()
        this.setReverb()
    }

    /**
     * Returns whether the provided audio file type is supported
     * @param {String | File} file: the file or filename 
     * @returns Whether the audio file is supported or not
     */
    static isAudioFormatSupported(file) {
        const name = (file?.name||file).toLowerCase()
        return AudioDisplay.SUPPORTED_AUDIO_FORMATS.some(ext=>name.endsWith("."+ext))
    }

    /**
     * @returns Returns all the supported file formats in a string usable in a HTML file input
     */
    static getSupportedHTMLAcceptValue() {
        return "."+AudioDisplay.SUPPORTED_AUDIO_FORMATS.join(", .")
    }

    /**
     * Returns the name of the errors
     * @param {AudioDisplay.ERROR_TYPES} errorCode: The error code contained in ERROR_TYPES
     * @returns the name of the error based on the error code
     */
    static getErrorFromCode(errorCode) {
        return Object.keys(AudioDisplay.ERROR_TYPES)[errorCode]
    }

    // returns a separate copy of this AudioDisplay instance
    duplicate(source=this._source, pos=this.pos_, color=this._color, binCB=this._binCB, sampleCount=this._sampleCount, disableAudio=this._disableAudio, offsetPourcent=this._offsetPourcent, errorCB=this._errorCB, setupCB=this._setupCB, loopCB=this._loopCB, anchorPos=this._anchorPos, activationMargin=this._activationMargin) {
        const colorObject = color, colorRaw = colorObject.colorRaw, audioDisplay = new AudioDisplay(
            source instanceof MediaStreamAudioSourceNode ? source.mediaStream.clone() : source.cloneNode(), 
            pos,
            (_,audioDisplay)=>(colorRaw instanceof Gradient||colorRaw instanceof Pattern)?colorRaw.duplicate(Array.isArray(colorRaw.initPositions)?null:audioDisplay):colorObject.duplicate(),
            binCB,
            sampleCount,
            disableAudio,
            offsetPourcent,
            errorCB,
            setupCB,
            loopCB,
            anchorPos,
            activationMargin
        )
        audioDisplay._scale = CDEUtils.unlinkArr2(this._scale)
        audioDisplay._rotation = this._rotation
        audioDisplay._visualEffects = this.visualEffects_
        
        return this.initialized ? audioDisplay : null
    }

    // GENERIC DISPLAYS
    // generic binCB for waveform display
    static BARS(maxHeight, minHeight, spacing, barWidth, transformable) {
        maxHeight??=100
        minHeight??=0
        spacing??=1
        barWidth??=2
        
        maxHeight = maxHeight/AudioDisplay.MAX_NORMALISED_DATA_VALUE
        minHeight = minHeight/AudioDisplay.MAX_NORMALISED_DATA_VALUE

        if (transformable) {
            return (render, bin, pos, audioDisplay)=>{
                const barHeight = minHeight+maxHeight*bin
                render.fill(Render.getRect(pos, barWidth, barHeight), audioDisplay._color, audioDisplay.visualEffects)
                pos[0] += spacing
                return [pos]
            }
        } else {
            return (render, bin, pos, audioDisplay)=>{
                const barHeight = minHeight+maxHeight*bin
                render.batchFill(Render.getRect(pos, barWidth, barHeight), audioDisplay._color, audioDisplay.visualEffects)
                pos[0] += spacing
                return [pos]
            }
        }
    }

    // generic binCB for circular display
    static CIRCLE(maxRadius, minRadius, transformable, precision) {
        maxRadius??=100
        minRadius??=0
        precision??=2

        maxRadius = maxRadius/AudioDisplay.MAX_NORMALISED_DATA_VALUE
        minRadius = minRadius/AudioDisplay.MAX_NORMALISED_DATA_VALUE

        if (transformable) {
            return (render, bin, pos, audioDisplay, accumulator, i)=>{
                if (i%precision==0) render.stroke(Render.getArc(pos, minRadius+maxRadius*bin), audioDisplay._color, audioDisplay.visualEffects)
            }
        } else {
            return (render, bin, pos, audioDisplay, accumulator, i)=>{
                if (i%precision==0) render.batchStroke(Render.getArc(pos, minRadius+maxRadius*bin), audioDisplay._color, audioDisplay.visualEffects)
            }
        }
    }

    // generic binCB for sin-ish wave display
    static TOP_WAVE(maxHeight, minHeight, spacing, transformable, precision) {
        maxHeight??=100
        minHeight??=0
        spacing??=1
        precision??=2

        maxHeight = maxHeight/AudioDisplay.MAX_NORMALISED_DATA_VALUE
        minHeight = minHeight/AudioDisplay.MAX_NORMALISED_DATA_VALUE

        if (transformable) {
            return (render, bin, pos, audioDisplay, accumulator, i, sampleCount)=>{
                const barHeight = minHeight+maxHeight*bin
                if (!i) {
                    accumulator = new Path2D()
                    accumulator.moveTo(pos[0], pos[1]+barHeight)
                } else if (i%precision==0) accumulator.lineTo(pos[0], pos[1]+barHeight)
                
                if (i==sampleCount-1) render.stroke(accumulator, audioDisplay._color, audioDisplay.visualEffects)
                pos[0] += spacing
                    
                return [pos, accumulator]
            }
        } else {
            return (render, bin, pos, audioDisplay, accumulator, i, sampleCount)=>{
                const barHeight = minHeight+maxHeight*bin
                if (!i) {
                    accumulator = new Path2D()
                    accumulator.moveTo(pos[0], pos[1]+barHeight)
                } else if (i%precision==0) accumulator.lineTo(pos[0], pos[1]+barHeight)
                
                if (i==sampleCount-1) render.batchStroke(accumulator, audioDisplay._color, audioDisplay.visualEffects)
                pos[0] += spacing
                    
                return [pos, accumulator]
            }
        }
    }

    // generic binCB for spiral particle cloud display
    static CLOUD(maxRadius, minRadius, particleRadius, transformable, precision, angleStep) {
        maxRadius??=100
        minRadius??=0
        particleRadius??=2
        precision??=2
        angleStep??=0.1
    
        maxRadius = maxRadius/AudioDisplay.MAX_NORMALISED_DATA_VALUE
        minRadius = minRadius/AudioDisplay.MAX_NORMALISED_DATA_VALUE

        if (transformable) {
            return (render, bin, pos, audioDisplay, accumulator, i) => {
                const radius = minRadius+maxRadius*bin, angle = angleStep*i
                if (!(i%precision)) render.fill(Render.getArc([pos[0]+radius*Math.cos(angle), pos[1]+radius*Math.sin(angle)], particleRadius), audioDisplay._color, audioDisplay.visualEffects)
                return [pos]
            }
        } else {
            return (render, bin, pos, audioDisplay, accumulator, i) => {
                const radius = minRadius+maxRadius*bin, angle = angleStep*i
                if (!(i%precision)) render.batchFill(Render.getArc([pos[0]+radius*Math.cos(angle), pos[1]+radius*Math.sin(angle)], particleRadius), audioDisplay._color, audioDisplay.visualEffects)
                return [pos]
            }
        }
    }

    get source() {return this._source}
	get binCB() {return this._binCB}
	get sampleCount() {return this._sampleCount}
	get disableAudio() {return this._disableAudio}
	get offsetPourcent() {return this._offsetPourcent}
	get errorCB() {return this._errorCB}
	get audioCtx() {return this._audioCtx}
	get audioAnalyser() {return this._audioAnalyser}
    get gainNode() {return this._gainNode}
	get biquadFilterNode() {return this._biquadFilterNode}
	get convolverNode() {return this._convolverNode}
	get waveShaperNode() {return this._waveShaperNode}
	get dynamicsCompressorNode() {return this._dynamicsCompressorNode}
	get pannerNode() {return this._pannerNode}
	get delayNode() {return this._delayNode}
    get data() {return this.#data}
    get fft() {return this.#fft}
    get bufferLength() {return this.#buffer_ll}
    get transformable() {return this._transformable}

    get video() {return this._source}
    get image() {return this._source}
    get paused() {return this._source?.paused}
    get isPaused() {return this.paused}
    get playbackRate() {return this._source?.playbackRate}
    get speed() {return this.playbackRate}
    get currentTime() {return this._source?.currentTime}
    get loop() {return this._source?.loop}
    get isLooping() {return this.loop}

    set paused(paused) {
        try {
            if (paused) this._source.pause()
            else ImageDisplay.playMedia(this._source)
        }catch(e){}
    }
    set isPaused(isPaused) {this.paused = isPaused}
    set playbackRate(playbackRate) {this._source.playbackRate = playbackRate}
    set speed(speed) {this.playbackRate = speed}
    set currentTime(currentTime) {this._source.currentTime = currentTime}
    set loop(loop) {this._source.loop = loop}
    set isLooping(isLooping) {this.loop = isLooping}

	set binCB(_binCB) {this._binCB = _binCB}
	set sampleCount(_sampleCount) {
        this._sampleCount = _sampleCount
        this.#fft = this._audioAnalyser.fftSize = Math.max(32, 2**Math.round(Math.log2(this._sampleCount*2)))
        this.#buffer_ll = this._audioAnalyser.frequencyBinCount
        this.#data = new Uint8Array(this.#buffer_ll)
    }
	set disableAudio(_disableAudio) {
        this._disableAudio = _disableAudio
        if (_disableAudio) this._audioAnalyser.disconnect(this._audioCtx.destination)
        else this._audioAnalyser.connect(this._audioCtx.destination)
    }
	set offsetPourcent(_offsetPourcent) {this._offsetPourcent = _offsetPourcent}
	set errorCB(_errorCB) {this._errorCB = _errorCB}
    set transformable(transformable) {this._transformable = transformable}
    set rotation(rotation) {
        super.rotation = rotation
        this.#updateTransformable()
    }
    set scale(scale) {
        super.scale = scale
        this.#updateTransformable()
    }
}
// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Displays an image or a video as an object
class ImageDisplay extends _BaseObj {
    static SUPPORTED_IMAGE_FORMATS = ["jpg","jpeg","png","gif","svg","webp","bmp","tiff","ico","heif","heic"]
    static SUPPORTED_VIDEO_FORMATS = ["mp4","webm","ogv","mov","avi","mkv","flv","wmv","3gp","m4v"]
    static DEFAULT_WIDTH = 128
    static DEFAULT_HEIGHT = 128
    static SOURCE_TYPES = {FILE_PATH:"string", DYNAMIC:"[object Object]", CAMERA:"CAMERA", CAPTURE:"CAPTURE", IMAGE:HTMLImageElement, SVG:SVGImageElement, BITMAP_PROMISE:Promise, BITMAP:ImageBitmap, VIDEO:HTMLVideoElement, CANVAS:HTMLCanvasElement, OFFSCREEN_CANVAS:OffscreenCanvas}
    static DYNAMIC_SOURCE_TYPES = {VIDEO:HTMLVideoElement, CANVAS:HTMLCanvasElement, OFFSCREEN_CANVAS:OffscreenCanvas}
    static RESOLUTIONS = {SD:[640, 480], HD:[1280, 720], FULL_HD:[1920, 1080], "4K":[3840,2160], FOURK:[3840,2160], MAX:[3840,2160]}
    static CAMERA_FACING_MODES = {USER:"user", ENVIRONMENT:"environment"}
    static DEFAULT_FACING_MODE = ImageDisplay.CAMERA_FACING_MODES.USER
    static DEFAULT_CAMERA_RESOLUTION = ImageDisplay.RESOLUTIONS.HD
    static DEFAULT_CAMERA_FRAME_RATE = 30
    static DEFAULT_CAMERA_SETTINGS = ImageDisplay.loadCamera()
    static DEFAULT_CAMERAS = {CAMERA_SD:ImageDisplay.loadCamera(ImageDisplay.RESOLUTIONS.SD), CAMERA_HD:ImageDisplay.loadCamera(ImageDisplay.RESOLUTIONS.HD), CAMERA_FULL_HD:ImageDisplay.loadCamera(ImageDisplay.RESOLUTIONS.FULL_HD), CAMERA_4K:ImageDisplay.loadCamera(ImageDisplay.RESOLUTIONS.FOURK), CAMERA:ImageDisplay.DEFAULT_CAMERA_SETTINGS,}
    static CAPTURE_MEDIA_SOURCES = {SCREEN:"screen", WINDOW:"window", TAB:"tab"}
    static CAPTURE_CURSOR = {ALWAYS:"always", MOTION:"motion", NONE:"none"}
    static DEFAULT_CAPTURE_RESOLUTION = ImageDisplay.RESOLUTIONS.HD
    static DEFAULT_CAPTURE_MEDIA_SOURCE = "screen"
    static DEFAULT_CAPTURE_FRAME_RATE = 30
    static DEFAULT_CAPTURE_CURSOR = "always"
    static DEFAULT_CAPTURE_SETTINGS = ImageDisplay.loadCapture()
    static DEFAULT_CAPTURES = {CAPTURE_SD:ImageDisplay.loadCapture(ImageDisplay.RESOLUTIONS.SD), CAPTURE_HD:ImageDisplay.loadCamera(ImageDisplay.RESOLUTIONS.HD), CAPTURE_FULL_HD:ImageDisplay.loadCamera(ImageDisplay.RESOLUTIONS.FULL_HD), CAPTURE_4k:ImageDisplay.loadCamera(ImageDisplay.RESOLUTIONS.FOURK), CAPTURE:ImageDisplay.DEFAULT_CAPTURE_SETTINGS}
    static ERROR_TYPES = {NO_PERMISSION:0, DEVICE_IN_USE:1, SOURCE_DISCONNECTED:2, FILE_NOT_FOUND:3, NOT_AVAILABLE:4, NOT_SUPPORTED:5}
    static IS_CAMERA_SUPPORTED = ()=>!!navigator?.mediaDevices?.getUserMedia
    static IS_SCREEN_RECORD_SUPPORTED = ()=>!!navigator?.mediaDevices?.getDisplayMedia

    #naturalSize = null
    constructor(source, pos, size, errorCB, setupCB, loopCB, anchorPos, activationMargin) {
        super(pos, null, setupCB, loopCB, anchorPos, activationMargin)
        this._source = source               // the data source
        this._size = size||[]               // the display size of the image (resizes)
        this._errorCB = errorCB             // a callback called if there is an error with the source (errorType, e?)=>
        this._sourceCroppingPositions = null// data source cropping positions delimiting a rectangle, [ [startX, startY], [endX, endY] ] (Defaults to no cropping)
    }

    initialize() {
        ImageDisplay.initializeDataSource(this._source, (data, naturalSize)=>{
            this._source = data
            this.#naturalSize = naturalSize
            this.size = this._size
            this._initialized = true
            if (CDEUtils.isFunction(this._setupCB)) this._setupResults = this._setupCB(this, this._parent, this._source)
        }, this._errorCB)

        this._pos = this.getInitPos()||_BaseObj.DEFAULT_POS
        this.setAnchoredPos()
    }

    draw(render, time, deltaTime) {
        if (this.initialized) {
            const source = this._source
            if (source instanceof HTMLVideoElement && (!source.src && !source.srcObject?.active)) return;

            const ctx = render.ctx, hasScaling = this._scale[0]!==1||this._scale[1]!==1, hasTransforms = this._rotation||hasScaling

            let viewPos
            if (hasTransforms) {
                const cx = this.centerX, cy = this.centerY
                viewPos = this.parent.viewPos
                ctx.translate(cx, cy)
                if (this._rotation) ctx.rotate(CDEUtils.toRad(this._rotation))
                if (hasScaling) ctx.scale(this._scale[0], this._scale[1])
                ctx.translate(-cx, -cy)
            }

            if (source instanceof HTMLCanvasElement) render.drawLateImage(source, this._pos, this._size, this._sourceCroppingPositions, this.visualEffects)
            else render.drawImage(source, this._pos, this._size, this._sourceCroppingPositions, this.visualEffects)

            if (hasTransforms) ctx.setTransform(1,0,0,1,viewPos[0],viewPos[1])
        }
        super.draw(time, deltaTime)
    }

    static initializeDataSource(dataSrc, loadCallback, errorCB) {
        const types = ImageDisplay.SOURCE_TYPES
        if (typeof dataSrc==types.FILE_PATH) {
            if (ImageDisplay.isImageFormatSupported(dataSrc)) ImageDisplay.loadImage(dataSrc, errorCB).onload=e=>ImageDisplay.#initData(e.target, loadCallback)
            else if (ImageDisplay.isVideoFormatSupported(dataSrc)) ImageDisplay.#initVideoDataSource(ImageDisplay.loadVideo(dataSrc), loadCallback, errorCB)
            else if (CDEUtils.isFunction(errorCB)) errorCB(ImageDisplay.ERROR_TYPES.NOT_SUPPORTED, dataSrc) 
        } else if (dataSrc instanceof types.IMAGE || dataSrc instanceof types.SVG) {
            const fakeLoaded = dataSrc.getAttribute("fakeload")
            if (dataSrc.complete && dataSrc.src && !fakeLoaded) ImageDisplay.#initData(dataSrc, loadCallback)
            else dataSrc.onload=()=>{
                if (fakeLoaded) dataSrc.removeAttribute("fakeload")
                ImageDisplay.#initData(dataSrc, loadCallback)
            }
        } else if (dataSrc.toString()==types.DYNAMIC) {
            if (dataSrc.type==types.CAMERA) ImageDisplay.#initCameraDataSource(dataSrc.settings, loadCallback, errorCB)
            else if (dataSrc.type==types.CAPTURE) ImageDisplay.#initCaptureDataSource(dataSrc.settings, loadCallback, errorCB)
        } else if (dataSrc instanceof types.VIDEO) ImageDisplay.#initVideoDataSource(dataSrc, loadCallback, errorCB)
        else if (dataSrc instanceof types.CANVAS || dataSrc instanceof types.BITMAP || dataSrc instanceof types.OFFSCREEN_CANVAS) ImageDisplay.#initData(dataSrc, loadCallback)
        else if (dataSrc instanceof MediaStream) ImageDisplay.#initMediaStream(dataSrc, loadCallback, errorCB)
        else if (dataSrc instanceof types.BITMAP_PROMISE) dataSrc.then(bitmap=>ImageDisplay.#initData(bitmap, loadCallback))
    }

    // initializes a data source
    static #initData(dataSource, loadCallback, width=dataSource.width||ImageDisplay.DEFAULT_WIDTH, height=dataSource.height||ImageDisplay.DEFAULT_HEIGHT) {
        if (CDEUtils.isFunction(loadCallback)) loadCallback(dataSource, [width, height])
    }

    // Initializes a video data source
    static #initVideoDataSource(dataSource, loadCallback, errorCB) {
        const fn=()=>this.#initData(dataSource, loadCallback, dataSource.videoWidth, dataSource.videoHeight)
        dataSource.onerror=e=>{if (CDEUtils.isFunction(errorCB)) errorCB(ImageDisplay.ERROR_TYPES.FILE_NOT_FOUND, dataSource, e)}
        if (dataSource.readyState) fn()
        else dataSource.onloadeddata=fn
    }

    static #initMediaStream(stream, loadCallback, errorCB) {
        const video = document.createElement("video")
        video.srcObject = stream
        video.autoplay = true
        video.setAttribute("permaLoad", "1")
        stream.oninactive=e=>{if (CDEUtils.isFunction(errorCB)) errorCB(ImageDisplay.ERROR_TYPES.SOURCE_DISCONNECTED, stream, e)}
        video.oncanplay=()=>this.#initData(video, loadCallback, video.videoWidth, video.videoHeight)
    }

    // Initializes a camera capture data source
    static #initCameraDataSource(settings=true, loadCallback, errorCB) {
        if (ImageDisplay.IS_CAMERA_SUPPORTED()) navigator.mediaDevices.getUserMedia({video:settings}).then(src=>ImageDisplay.#initMediaStream(src, loadCallback, errorCB)).catch(e=>{if (CDEUtils.isFunction(errorCB)) errorCB(e.toString().includes("NotReadableError")?ImageDisplay.ERROR_TYPES.DEVICE_IN_USE:ImageDisplay.ERROR_TYPES.NO_PERMISSION, settings, e)})
        else if (CDEUtils.isFunction(errorCB)) errorCB(ImageDisplay.ERROR_TYPES.NOT_AVAILABLE, settings)
    }

    // Initializes a screen capture data source
    static #initCaptureDataSource(settings=true, loadCallback, errorCB) {
        if (ImageDisplay.IS_SCREEN_RECORD_SUPPORTED()) navigator.mediaDevices.getDisplayMedia({video:settings}).then(src=>ImageDisplay.#initMediaStream(src, loadCallback, errorCB)).catch(e=>{if (CDEUtils.isFunction(errorCB)) errorCB(ImageDisplay.ERROR_TYPES.NO_PERMISSION, settings, e)})
        else if (CDEUtils.isFunction(errorCB)) errorCB(ImageDisplay.ERROR_TYPES.NOT_AVAILABLE, settings)
    }

    // Returns a usable image source
    static loadImage(src, errorCB=null, forceLoad=false) {
        const image = new Image()
        image.src = src
        if (CDEUtils.isFunction(errorCB)) image.onerror=e=>errorCB(ImageDisplay.ERROR_TYPES.FILE_NOT_FOUND, src, e)
        if (forceLoad) image.setAttribute("fakeload", "1")
        return image
    }

    // Returns a usable video source
    static loadVideo(src, looping=true, autoPlay=true) {
        const video = document.createElement("video")
        video.src = src instanceof File ? URL.createObjectURL(src) : src
        video.preload = "auto"
        video.loop = looping
        if (autoPlay) {
            video.mute = true
            video.autoplay = autoPlay
            ImageDisplay.playMedia(video)
        }
        return video
    }

    // Returns a usable camera capture source
    static loadCamera(resolution, facingMode, frameRate) {
        resolution??=ImageDisplay.DEFAULT_CAMERA_RESOLUTION
        return {
            type:ImageDisplay.SOURCE_TYPES.CAMERA,
            settings:{
                width:{ideal:resolution?.[0]},
                height:{ideal:resolution?.[1]},
                facingMode:facingMode??ImageDisplay.DEFAULT_FACING_MODE,
                frameRate:frameRate??ImageDisplay.DEFAULT_CAMERA_FRAME_RATE,
            }
        }
    }

    // Returns a usable screen capture source
    static loadCapture(resolution, cursor, frameRate, mediaSource) {
        resolution??=ImageDisplay.DEFAULT_CAPTURE_RESOLUTION
        return {
            type:ImageDisplay.SOURCE_TYPES.CAPTURE,
            settings:{
                mediaSource:mediaSource??ImageDisplay.DEFAULT_CAPTURE_MEDIA_SOURCE,
                frameRate:frameRate??ImageDisplay.DEFAULT_CAPTURE_FRAME_RATE,
                cursor:cursor??ImageDisplay.DEFAULT_CAPTURE_CURSOR,
                width:{ideal:resolution?.[0]},
                height:{ideal:resolution?.[1]}
            }
        }
    }

    /**
     * Returns the name of the errors
     * @param {ImageDisplay.ERROR_TYPES} errorCode: The error code contained in ERROR_TYPES
     * @returns the name of the error based on the error code
     */
    static getErrorFromCode(errorCode) {
        return Object.keys(ImageDisplay.ERROR_TYPES)[errorCode]
    }

    // Plays the source (use only if the source is a video)
    playVideo() {
        ImageDisplay.playMedia(this._source)
    }

    // Pauses the source (use only if the source is a video)
    pauseVideo() {
        const source = this._source
        if (source instanceof HTMLVideoElement) source.pause()
    }

    // Plays the source
    static playMedia(source, errorCB) {
        if (source instanceof HTMLVideoElement || source instanceof HTMLAudioElement) source.play().catch(()=>Canvas.addOnFirstInteractCallback(()=>source.play().catch(e=>{if (CDEUtils.isFunction(errorCB)) errorCB(ImageDisplay.ERROR_TYPES.NOT_AVAILABLE, source, e)})))
    }
    
    // returns the natural size of the source
    static getNaturalSize(source) {
        return [source?.displayWidth||source?.videoWidth||source?.width, source?.displayHeight||source?.videoHeight||source?.height]
    }

    // returns a separate copy of this ImageDisplay instance
    duplicate(source=this._source, pos=this.pos_, size=this.size_, setupCB=this._setupCB, loopCB=this._loopCB, anchorPos=this._anchorPos, activationMargin=this._activationMargin) {
        const imageDisplay = new ImageDisplay(
            source instanceof MediaStreamAudioSourceNode ? source.mediaStream.clone() : source.cloneNode(), 
            pos,
            size,
            setupCB,
            loopCB,
            anchorPos,
            activationMargin
        )
        imageDisplay._scale = CDEUtils.unlinkArr2(this._scale)
        imageDisplay._rotation = this._rotation
        imageDisplay._visualEffects = this.visualEffects_
        
        return this.initialized ? imageDisplay : null
    }

    // returns whether the provided pos is in the image
    isWithin(pos, padding, rotation, scale) {
        return super.isWithin(pos, this.getBounds(padding, rotation, scale), padding)
    }

    // returns whether the provided pos is in the image
    isWithinAccurate(pos, padding, rotation, scale) {
        return this.ctx.isPointInPath(this.getBoundsAccurate(padding, rotation, scale), pos[0], pos[1])
    }

    // returns the raw a minimal rectangular area containing all of the image (no scale/rotation)
    #getRectBounds() {
        const size = this._size, pos = this._pos
        return [pos, [pos[0]+size[0], pos[1]+size[1]]]
    }

    // returns the accurate area containing all of the image
    getBoundsAccurate(padding, rotation=this._rotation, scale=this._scale) {
        const path = new Path2D(), positions = this.#getRectBounds(), corners = super.getCorners(positions, padding, rotation, scale, super.getCenter(positions))

        path.moveTo(corners[0][0], corners[0][1])
        path.lineTo(corners[2][0], corners[2][1])
        path.lineTo(corners[1][0], corners[1][1])
        path.lineTo(corners[3][0], corners[3][1])
        path.lineTo(corners[0][0], corners[0][1])

        return path
    }

    // returns the center pos of the image
    getCenter() {
        return super.getCenter(this.#getRectBounds())
    }

    // returns the minimal rectangular area containing all of the image
    getBounds(padding, rotation=this._rotation, scale=this._scale) {
        const positions = this.#getRectBounds()
        return super.getBounds(positions, padding, rotation, scale, super.getCenter(positions))
    }

    // deletes the object from the canvas
    remove() {
        if (this._source instanceof HTMLVideoElement) {
            this._source.pause()
            this._source.remove()
        }
        this._parent.remove(this._id)
    }

    /**
     * Resizes the image's width keeping the original aspect ratio
     * @param {Number | String} width: The width in px, or the width in % based on the natural size 
     */
    aspectRatioWidthResize(width) {
        const heightFactor = this._size[1]/this._size[0], newWidth = (typeof width=="string" ? (+width.replace("%","").trim()/100)*this.#naturalSize[0] : width==null ? this.#naturalSize[0] : width)>>0
        this._size[0] = newWidth
        this._size[1] = newWidth*heightFactor
    }

    /**
     * Resizes the image's height keeping the original aspect ratio
     * @param {Number | String} height: The height in px, or the height in % based on the natural size 
     */
    aspectRatioHeightResize(height) {
        const widthFactor = this._size[0]/this._size[1], newHeight = (typeof height=="string" ? (+height.replace("%","").trim()/100)*this.#naturalSize[1] : height==null ? this.#naturalSize[1] : height)>>0
        this._size[1] = newHeight
        this._size[0] = newHeight*widthFactor
    }
    
    /**
     * Returns whether the provided file type is supported
     * @param {String | File} file: the file or filename 
     * @returns Whether the file is supported or not
     */
    static isFormatSupported(file) {
        return ImageDisplay.isImageFormatSupported(file)||ImageDisplay.isVideoFormatSupported(file)
    }

    /**
     * Returns whether the provided image file type is supported
     * @param {String | File} file: the file or filename 
     * @returns Whether the image file is supported or not
     */
    static isImageFormatSupported(file) {
        const name = (file?.name||file).toLowerCase()
        return ImageDisplay.SUPPORTED_IMAGE_FORMATS.some(ext=>name.endsWith("."+ext))
    }

    /**
     * Returns whether the provided video file type is supported
     * @param {String | File} file: the file or filename 
     * @returns Whether the video file is supported or not
     */
    static isVideoFormatSupported(file) {
        const name = (file?.name||file).toLowerCase()
        return ImageDisplay.SUPPORTED_VIDEO_FORMATS.some(ext=>name.endsWith("."+ext))
    }

    /**
     * @returns Returns all the supported file formats in a string usable in a HTML file input
     */
    static getSupportedHTMLAcceptValue() {
        const sep = ", ."
        return "."+ImageDisplay.SUPPORTED_IMAGE_FORMATS.join(sep)+sep+ImageDisplay.SUPPORTED_VIDEO_FORMATS.join(sep)
    }

	get ctx() {return this._parent._ctx}
	get size() {return this._size||[0,0]}
	get size_() {return this._size?CDEUtils.unlinkArr2(this._size):[0,0]}
    get width() {return this._size[0]}
    get height() {return this._size[1]}
    get trueSize() {
        const size = this.size
        return [Math.abs(size[0]*this._scale[0]), Math.abs(size[1]*this._scale[1])]
    }
    get naturalSize() {return this.#naturalSize||ImageDisplay.getNaturalSize(this._source)}
    get centerX() {return this._pos[0]+this._size[0]/2}
    get centerY() {return this._pos[1]+this._size[1]/2}
    get centerPos() {return [this.centerX, this.centerY]}
    get source() {return this._source}
	get sourceCroppingPositions() {return this._sourceCroppingPositions}
    get errorCB() {return this._errorCB}

    get paused() {return this._source?.paused}
    get playbackRate() {return this._source?.playbackRate}
    get speed() {return this.playbackRate}
    get currentTime() {return this._source?.currentTime}
    get isLooping() {return this.loop}
    get isDynamic() {return this._source instanceof ImageDisplay.DYNAMIC_SOURCE_TYPES.CANVAS || this._source instanceof ImageDisplay.DYNAMIC_SOURCE_TYPES.OFFSCREEN_CANVAS || this._source instanceof ImageDisplay.DYNAMIC_SOURCE_TYPES.VIDEO}

    set source(source) {
        const initSize = this._size
        ImageDisplay.initializeDataSource(source, (data, naturalSize)=>{
            this._source = data
            this.#naturalSize = naturalSize
            this.size = initSize
        }, this._errorCB)
    }
    set errorCB(errorCB) {this._errorCB = errorCB}
    set naturalSize(naturalSize) {this.#naturalSize = naturalSize}
	set size(size) {
        this.width = size[0]
        this.height = size[1]
        return this._size
    }
    set width(width) {this._size[0] = (typeof width=="string" ? (+width.replace("%","").trim()/100)*this.#naturalSize[0] : width==null ? this.#naturalSize[0] : width)>>0}
	set height(height) {this._size[1] = (typeof height=="string" ? (+height.replace("%","").trim()/100)*this.#naturalSize[1] : height==null ? this.#naturalSize[1] : height)>>0}
    set paused(paused) {
        try {
            if (paused) this._source.pause()
            else ImageDisplay.playMedia(this._source)
        }catch(e){}
    }
    set playbackRate(playbackRate) {this._source.playbackRate = playbackRate}
    set speed(speed) {this.playbackRate = speed}
    set currentTime(currentTime) {this._source.currentTime = currentTime}
    set isLooping(isLooping) {this.loop = isLooping}
	set sourceCroppingPositions(sourceCroppingPositions) {
        if (sourceCroppingPositions) {
            const pos1 = sourceCroppingPositions[0], pos2 = sourceCroppingPositions[1], naturalSize = this.#naturalSize
            
            this._sourceCroppingPositions = [[
                typeof pos1[0]=="string" ? (+pos1[0].replace("%","").trim()/100)*naturalSize[0] : pos1[0]==null ? 0 : pos1[0],
                typeof pos1[1]=="string" ? (+pos1[1].replace("%","").trim()/100)*naturalSize[1] : pos1[1]==null ? 0 : pos1[1]
            ], [
                typeof pos2[0]=="string" ? (+pos2[0].replace("%","").trim()/100)*naturalSize[0] : pos2[0]==null ? naturalSize[0] : pos2[0],
                typeof pos2[1]=="string" ? (+pos2[1].replace("%","").trim()/100)*naturalSize[1] : pos2[1]==null ? naturalSize[1] : pos2[1]
            ]]
        } else this._sourceCroppingPositions = null
    }
}
// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Displays text as an object
class TextDisplay extends _BaseObj {
    static MEASUREMENT_CTX = new OffscreenCanvas(1,1).getContext("2d")
    static DEFAULT_LINE_HEIGHT_PADDING = 10

    #lineCount = null
    constructor(text, pos, color, textStyles, drawMethod, maxWidth, setupCB, loopCB, anchorPos, activationMargin) {
        super(pos, color, setupCB, loopCB, anchorPos, activationMargin)
        this._text = text??""                // displayed text
        this._textStyles = textStyles        // current object's textStyles
        this._drawMethod = drawMethod?.toUpperCase()??Render.DRAW_METHODS.FILL // text draw method, either "fill" or "stroke"
        this._maxWidth = maxWidth??undefined // maximal width of the displayed text in px
        this._lineHeight = null              // lineHeight in px of the text for multi-line display
        this._size = null                    // the text's default size [width, height]
    }
    
    initialize() {
        this._textStyles = CDEUtils.isFunction(this._textStyles) ? this._textStyles(this.render, this) : this._textStyles??this.render.defaultTextProfile
        this.#resize()
        this.initialized = true
        super.initialize()
    }

    #resize(lineHeightPadding=TextDisplay.DEFAULT_LINE_HEIGHT_PADDING) {
        this._size = this.getSize()
        this.#lineCount = this.getTextValue().split("\n").length
        if (this.#lineCount-1) this._size[1] -= lineHeightPadding
        this._lineHeight = this.trueSize[1]/this.#lineCount
    }

    draw(render, time, deltaTime) {
        if (this.initialized) {
            if ((this.a??1) > Color.OPACITY_VISIBILITY_THRESHOLD) {
                const ctx = render.ctx, hasScaling = this._scale[0]!=1||this._scale[1]!=1, hasTransforms = this._rotation||hasScaling, textValue = this.getTextValue()

                let viewPos
                if (hasTransforms) {
                    const cx = this._pos[0], cy = this._pos[1]
                    viewPos = this.parent.viewPos
                    ctx.translate(cx, cy)
                    if (this._rotation) ctx.rotate(CDEUtils.toRad(this._rotation))
                    if (hasScaling) ctx.scale(this._scale[0], this._scale[1])
                    ctx.translate(-cx, -cy)
                }

                if (this._drawMethod=="FILL") render.fillText(textValue, this._pos, this._color, this._textStyles, this._maxWidth, this._lineHeight, this.visualEffects)
                else render.strokeText(textValue, this._pos, this._color, this._textStyles, this._maxWidth, this._lineHeight, this.visualEffects)
                
                if (hasTransforms) ctx.setTransform(1,0,0,1,viewPos[0],viewPos[1])
            }
        }

        super.draw(time, deltaTime)
    }

    // Returns the width and height of the text, according to the textStyles, excluding the scale or rotation
    getSize(textStyles=this._textStyles, text=this.getTextValue(), lineHeightPadding) {
        return TextDisplay.getSize(textStyles, text, lineHeightPadding, this._maxWidth)
    }

    // Returns the width and height of the given text, according to the textStyles, including potential scaling
    static getSize(textStyles, text, lineHeightPadding=TextDisplay.DEFAULT_LINE_HEIGHT_PADDING, maxWidth, scale=[1,1]) {
        TextStyles.apply(TextDisplay.MEASUREMENT_CTX, ...textStyles.getStyles())
        const lines = text.replace(/./g,1).split("\n"), l_ll = lines.length, longestText = l_ll>1?lines.reduce((a,b)=>a.length<b.length?b:a):text,
              {width, actualBoundingBoxAscent, actualBoundingBoxDescent} = TextDisplay.MEASUREMENT_CTX.measureText(longestText)
        return [CDEUtils.round(maxWidth||width, 4)*scale[0], (actualBoundingBoxAscent+actualBoundingBoxDescent)*l_ll*scale[1]+(l_ll*lineHeightPadding)]
    }

    // Returns the width and height of every line of the given text, according to the textStyles, excluding scaling/rotation
    #getAllSizes(lineHeightPadding=TextDisplay.DEFAULT_LINE_HEIGHT_PADDING) {
        const measureCtx = TextDisplay.MEASUREMENT_CTX, maxWidth = this._maxWidth, lines = this.getTextValue().split("\n"), l_ll = lines.length, resultasda = new Array(l_ll)
        TextStyles.apply(measureCtx, ...this._textStyles.getStyles())

        for (let i=0;i<l_ll;i++) {
            const lineRects = measureCtx.measureText("1".repeat(lines[i].length)), width = lineRects.width
            resultasda[i] = [maxWidth&&width>maxWidth?maxWidth:width, lineRects.actualBoundingBoxAscent+lineRects.actualBoundingBoxDescent+lineHeightPadding]
        }
        return resultasda
    }

    // Returns the current text value
    getTextValue() {
        return (CDEUtils.isFunction(this._text) ? this._text(this._parent, this) : this._text).trim()
    }

    // returns a separate copy of this textDisplay instance
    duplicate(text=this._text, pos=this.pos_, color=this._color, textStyles=this._textStyles, drawMethod=this._drawMethod, maxWidth=this._maxWidth, setupCB=this._setupCB, loopCB=this._loopCB, anchorPos=this._anchorPos, activationMargin=this._activationMargin) {
        const colorObject = color, colorRaw = colorObject.colorRaw, textDisplay = new TextDisplay(
            text,
            pos,
            (_,textDisplay)=>(colorRaw instanceof Gradient||colorRaw instanceof Pattern)?colorRaw.duplicate(Array.isArray(colorRaw.initPositions)?null:textDisplay):colorObject.duplicate(),
            textStyles,
            drawMethod,
            maxWidth,
            setupCB,
            loopCB,
            anchorPos,
            activationMargin
        )
        textDisplay._scale = CDEUtils.unlinkArr2(this._scale)
        textDisplay._rotation = this._rotation
        textDisplay._visualEffects = this.visualEffects_
        
        return this.initialized ? textDisplay : null
    }

    // returns whether the provided pos is in the text
    isWithin(pos, padding, rotation, scale) {
        return super.isWithin(pos, this.getBounds(padding, rotation, scale), padding)
    }

    // returns whether the provided pos is in the text
    isWithinAccurate(pos, paddingX, rotation, scale) {
        return this.ctx.isPointInPath(this.getBoundsAccurate(paddingX, rotation, scale), pos[0], pos[1])
    }
    
    // returns the raw a minimal rectangular area containing all of the text (no scale/rotation)
    #getRectBounds() {
        const size = this._size, pos = this._pos, halfLine = (TextDisplay.DEFAULT_LINE_HEIGHT_PADDING/2)+this._lineHeight/2
        return [[pos[0]-size[0]/2, pos[1]-halfLine/2-3], [pos[0]+size[0]/2, pos[1]+size[1]-halfLine]]
    }

    // returns the accurate area containing all of the text
    getBoundsAccurate(paddingX, rotation=this._rotation, scale=this._scale, lineHeightPadding=TextDisplay.DEFAULT_LINE_HEIGHT_PADDING, lineWidthOffset=this.render.currentCtxStyles[0]) {
        const path = new Path2D(), sizes = this.#getAllSizes(), s_ll = sizes.length, top = this._pos[1]-(lineHeightPadding/4+this._lineHeight/4)-lineWidthOffset, cx = this._pos[0]-lineWidthOffset/2
        
        if (paddingX) for (let i=0;i<s_ll;i++) sizes[i][0] += paddingX

        let height = (sizes[0][1]-((s_ll-1)?lineHeightPadding/s_ll:lineHeightPadding/4)), startHalfSize = sizes[0][0]/2, finalSize = sizes[s_ll-1][0], lastX = cx+startHalfSize, points = [[cx-startHalfSize, top], [lastX, top]]

        for (let i=1;i<s_ll;i++) {
            const newY = top+height*i
            points.push([lastX, newY], [lastX=cx+(sizes[i][0]/2), newY])
        }

        points.push([lastX, top+height*s_ll-lineHeightPadding/2])
        points.push([lastX-finalSize, top+height*s_ll-lineHeightPadding/2])
        points.push([lastX=lastX-finalSize, top+height*(s_ll-1)])

        for (let i=s_ll-1;i>0;i--) points.push([cx-sizes[i-1][0]/2, top+height*i], [cx-sizes[i-1][0]/2, top+height*(i-1)])

        for (let i=0;i<points.length;i++) {
            let pos = points[i]
            if (scale[0]!=1||scale[1]!=1) pos = CDEUtils.scalePos(pos, scale, this._pos)
            if (rotation) pos = CDEUtils.rotatePos(pos, rotation, this._pos)

            if (i) path.lineTo(pos[0], pos[1])
            else path.moveTo(pos[0], pos[1])
        }

        return path
    }

    // returns the center of the text
    getCenter() {
        return super.getCenter(this.#getRectBounds())
    }

    // returns the minimal rectangular area containing the text according to default text placements/parameters
    getBounds(padding, rotation=this._rotation, scale=this._scale) {
        return super.getBounds(this.#getRectBounds(), padding, rotation, scale, this._pos)
    }

    /**
     * Loads a custom font by file or url. Direct font files are loaded using the FontFace api, while non direct font source are loaded via an HTML <link> element.
     * @param {String | ArrayBuffer | TypedArray} src: The source of the font, either a file or a url
     * @param {String?} fontFaceName: The font family name of the custom font (Only applicable for FontFace load)
     * @param {Object?} fontFaceDescriptors: Object defining the font properties (Only applicable for FontFace load) 
     * @param {Function?} readyCB: Callback called upon custom font loading completed. (fontFace, fontFamily)=>{...} (Only applicable for FontFace load)
     * @param {Function?} errorCB: Callback called upon custom font loading errors. (error)=>{...} (Only applicable for FontFace load) 
     * @returns The loaded font via a FontFace instance or a <link> element
     */
    static loadCustomFont(src, fontFaceName=null, fontFaceDescriptors={}, readyCB=null, errorCB=(e)=>console.warn("Error loading font:", src, e)) {
        TextStyles.loadCustomFont(src, fontFaceName, fontFaceDescriptors, readyCB, errorCB)
    }

    get ctx() {return this._parent.ctx}
    get render() {return this._parent.render}
	get text() {return this._text+""}
	get textStyles() {return this._textStyles}
	get drawMethod() {return this._drawMethod}
	get maxWidth() {return this._maxWidth}
    get size() {return this._size}
    get lineHeight() {return this._lineHeight}
    get trueSize() {return [Math.abs(this._size[0]*this._scale[0]), Math.abs(this._size[1]*this._scale[1])]}
    get render() {return this._parent.render}
    get lineCount() {return this.#lineCount}
    get width() {return this.trueSize[0]}
    get height() {return this.trueSize[1]}

	set text(text) {
        const lastYScale = this._scale[1]
        this._text = ""+text||""
        this._scale[1] = 1
        this.#resize()
        this._scale[1] = lastYScale
    }
	set textStyles(_textStyles) {
        this._textStyles = _textStyles??this.render.defaultTextProfile
        this.#resize()
    }
	set drawMethod(_drawMethod) {this._drawMethod = _drawMethod.toUpperCase()}
	set maxWidth(_maxWidth) {
        this._maxWidth = _maxWidth??undefined
        this.#resize()
    }
    set lineHeight(lineHeight) {this._lineHeight = lineHeight}
}
// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Abstract dynamic color class
class _DynamicColor {
    static PLACEHOLDER = "PLACEHOLDER" // can be used to instantiate a dynamic color without positions, and apply that of the object, on assignement
    static PLACEHOLDER_COLOR = "transparent"

    constructor(positions, rotation) {
        this._initPositions = positions // initial positions declaration
        this._positions = positions     // current positions value
        this._rotation = rotation??0    // current rotation
        this._lastChangeValue = null    // used for optimization purposes
        this._value = null              // usable value as a fill/stroke style
    }

    get initPositions() {return this._initPositions}
    get positions() {return this._positions}
	get rotation() {return this._rotation}
	get isDynamic() {return this._initPositions?.pos != null}
    get value() {
        if (this.isDynamic) this.update()
        return this._value
    }

    set initPositions(initPositions) {this._initPositions = initPositions}
	set positions(_positions) {
        this._positions = _positions
        if (!this.isDynamic) this.update(true)
    }
	set rotation(deg) {
        this._rotation = CDEUtils.round(deg,2)%360
        if (!this.isDynamic) this.update(true)
    }
}
// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Allows the creation of custom gradients
class Pattern extends _DynamicColor {
    static #ID_GIVER = 0
    static #CROPPING_CTX = new OffscreenCanvas(1,1).getContext("2d")
    static #MATRIX = new DOMMatrixReadOnly()
    static LOADED_PATTERN_SOURCES = []
    static PLACEHOLDER_COLOR = "transparent"
    static REPETITION_MODES = {REPEAT:"repeat", REPEAT_X:"repeat-x", REPEAT_Y:"repeat-y", NO_REPEAT:"no-repeat"}
    static DEFAULT_REPETITION_MODE = Pattern.REPETITION_MODES.NO_REPEAT
    static DEFAULT_FRAME_RATE = 1/30
    static SERIALIZATION_SEPARATOR = "!"
    static FORCE_UPDATE_LEVELS = {
        DISABLED:null,
        RESPECT_FRAME_RATE:true,
        OVERRIDE:2
    }
    static DEFAULT_FORCE_UPDATE_LEVEL = Pattern.FORCE_UPDATE_LEVELS.DISABLED

    #lastUpdateTime = null
    #initialized = false
    constructor(render, source, positions, sourceCroppingPositions, keepAspectRatio, forcedUpdates, rotation, errorCB, readyCB, frameRate, repeatMode) {
        super(
            positions, // [ [x1, y1], [x2, y2] ] | instance of _Obj
            rotation   // rotation of the pattern
        )
        this._id = Pattern.#ID_GIVER++                                         // instance id
        this._render = render                                                  // canvas Render instance
        this._source = source                                                  // the data source
        this._sourceCroppingPositions = sourceCroppingPositions                // source cropping positions delimiting a rectangle, [ [startX, startY], [endX, endY] ] (Defaults to no cropping)
        this._keepAspectRatio = keepAspectRatio??false                         // whether the source keeps the same aspect ratio when resizing
        this._forcedUpdates = forcedUpdates??Pattern.DEFAULT_FORCE_UPDATE_LEVEL// whether/how the pattern forces updates
        const rawFrameRate = frameRate??Pattern.DEFAULT_FRAME_RATE
        this._frameRate = (rawFrameRate%1) ? rawFrameRate : 1/Math.max(rawFrameRate, 0) // update frequency of video/canvas sources
        this._errorCB = errorCB                                                // a callback called if there is an error with the source (errorType, e?)=>
        this._readyCB = readyCB                                                // custom callback ran upon source load
        this._repeatMode = repeatMode??Pattern.DEFAULT_REPETITION_MODE         // whether the pattern repeats horizontally/vertically

        Pattern.LOADED_PATTERN_SOURCES[this._id] = this
        ImageDisplay.initializeDataSource(source, (data)=>{
            this._source = data
            this.sourceCroppingPositions = this._sourceCroppingPositions||null
            this.#initialized = true
            if (CDEUtils.isFunction(this._readyCB)) this._readyCB(this)
            this.update(Pattern.FORCE_UPDATE_LEVELS.OVERRIDE)
        }, this._errorCB)
    }

    /**
     * Given an canvas object, returns automatic positions values for the minimal area containing all of the provided object
     * @param {Shape|Dot|TextDisplay} obj: Inheritor of _Obj
     * @returns the new calculated positions or the current value of this._positions if the parameter 'obj' isn't an instance of a canvas object
     */
    getAutomaticPositions(obj=this._initPositions) {
        if (obj instanceof Shape) return this.#hasShapeChanged(obj) ? obj.getBounds(0, 0, 0) : this._positions
        else if (obj instanceof Dot) return this.#hasDotChanged(obj) ? obj.getBounds(0, 0, 0) : this._positions
        else if (obj instanceof TextDisplay) return this.#hasTextDisplayChanged(obj) ? obj.getBounds(0, 0, 0) : this._positions
        else if (obj instanceof AudioDisplay) return obj.getBounds(0, 0, 0)
        else return this._positions
    }
    
    #hasShapeChanged(shape) {
        const currentDotsPos = shape.dotsPositions+shape.radius
        if (currentDotsPos !== this._lastChangeValue) {
            this._lastChangeValue = currentDotsPos
            return true
        } else return false
    }
    
    #hasDotChanged(dot) {
        const currentDotPos = dot.stringPos+dot.radius
        if (currentDotPos !== this._lastChangeValue) {
            this._lastChangeValue = currentDotPos
            return true
        } else return false
    }

    #hasTextDisplayChanged(textDisplay) {
        const pos = textDisplay.trueSize+textDisplay.pos
        if (pos !== this._lastChangeValue) {
            this._lastChangeValue = pos
            return true
        } else return false
    }

    // tries to update the curent pattern. Succeeds if forced, or if the last update's elapsed time corresponds to the frame rate 
    update(forceLevel=this._forcedUpdates) {
        if (this.#initialized) {
            const source = this._source, ctx = this._render.ctx, isCanvas = source instanceof HTMLCanvasElement, forceLevels = Pattern.FORCE_UPDATE_LEVELS, time = (isCanvas||forceLevel==forceLevels.RESPECT_FRAME_RATE)?performance.now()/1000:source.currentTime

            if (time != null && forceLevel != forceLevels.OVERRIDE) {
                if (this.#lastUpdateTime > time) this.#lastUpdateTime = time
                if (time-this.#lastUpdateTime >= this._frameRate) this.#lastUpdateTime = time
                else return;
            }

            const positions = this.getAutomaticPositions()
            if (forceLevel != forceLevels.OVERRIDE && (!source.currentTime || source.paused) && Array.isArray(this._positions) && CDEUtils.positionsEquals(positions, this._positions) && this._value) return;
            this._positions = positions
            
            if (isCanvas) this._render._bactchedStandalones.push(()=>this._value = this.#getPattern(ctx, source))
            else this._value = this.#getPattern(ctx, source)
        }
    }

    // returns a new pattern according to the current configurations 
    #getPattern(ctx, source) {
        let sizeX, sizeY
        const matrix = Pattern.#MATRIX, croppingPositions = this._sourceCroppingPositions
        if (croppingPositions) {
            const croppingCtx = Pattern.#CROPPING_CTX, canvas = croppingCtx.canvas, sx = croppingPositions[0][0], sy = croppingPositions[0][1]
            sizeX = canvas.width = Math.abs(croppingPositions[1][0]-sx)
            sizeY = canvas.height = Math.abs(croppingPositions[1][1]-sy)
            croppingCtx.clearRect(0, 0, sizeX, sizeY)
            croppingCtx.drawImage(source, sx, sy, sizeX, sizeY, 0, 0, sizeX, sizeY)
            source = canvas
        } else [sizeX, sizeY] = ImageDisplay.getNaturalSize(source)

        const pattern = ctx.createPattern(source, this._repeatMode), positions = this._positions

        if (positions) {
            const pos1 = positions[0], pos2 = positions[1], width = pos2[0]-pos1[0], height = pos2[1]-pos1[1], fdx = width/sizeX, fdy = height/sizeY, rotation = this._rotation
            if (this._keepAspectRatio) {
                const isXbigger = fdx > fdy, fd = isXbigger ? fdx : fdy, cx = (sizeX*fd)/2, cy = (sizeY*fd)/2
                if (rotation) pattern.setTransform(matrix.translate((pos1[0]-(isXbigger?0:cx-(width/2)))+cx, (pos1[1]-(isXbigger?(cy-(height/2)):0))+cy).rotate(rotation).translate(-cx, -cy).scale(fd, fd))
                else pattern.setTransform(matrix.translate((pos1[0]-(isXbigger?0:cx-(width/2))), (pos1[1]-(isXbigger?(cy-(height/2)):0))).scale(fd, fd))
            } else {
                const cx = (sizeX*fdx)/2, cy = (sizeY*fdy)/2
                if (rotation) pattern.setTransform(matrix.translate(pos1[0]+cx, pos1[1]+cy).rotate(rotation).translate(-cx, -cy).scale(fdx, fdy))
                else pattern.setTransform(matrix.translate(pos1[0], pos1[1]).scale(fdx, fdy))
            }
        }

        return pattern
    }

    toString() {
        return this._id+Pattern.SERIALIZATION_SEPARATOR
    }

    // Plays the source (use only if the source is a video)
    playVideo() {
        ImageDisplay.playMedia(this._source)
    }

    // Pauses the source (use only if the source is a video)
    pauseVideo() {
        try {this._source.pause()}catch(e){}
    }

    // returns a separate copy of this Pattern instance
    duplicate(positions=this._positions, render=this._render, source=this._source, sourceCroppingPositions=this._sourceCroppingPositions, keepAspectRatio=this._keepAspectRatio, forcedUpdates=this._forcedUpdates, rotation=this._rotation, errorCB=this._errorCB, frameRate=this._frameRate, repeatMode=this._repeatMode) {
        if (source instanceof HTMLElement && !source.getAttribute("permaLoad") && !(source instanceof HTMLCanvasElement)) {
            source = source.cloneNode()
            source.setAttribute("fakeload", "1")
        }
        return new Pattern(render, source, CDEUtils.unlinkPositions(positions), CDEUtils.unlinkPositions(sourceCroppingPositions), keepAspectRatio, forcedUpdates, rotation, errorCB, null, frameRate, repeatMode)
    }

    // Returns a usable image source
    static loadImage(path) {
        return ImageDisplay.loadImage(path)
    }

    // Returns a usable video source
    static loadVideo(path, looping=true, autoPlay=true) {
        return ImageDisplay.loadVideo(path, looping, autoPlay)
    }

    // Returns a usable camera capture source
    static loadCamera(resolution, facingMode, frameRate=this._frameRate) {
        return ImageDisplay.loadCamera(resolution, facingMode, frameRate)
    }

    // Returns a usable screen capture source
    static loadCapture(resolution, cursor, frameRate=this.frameRate, mediaSource) {
        return ImageDisplay.loadCapture(resolution, cursor, frameRate, mediaSource)
    }

    get id() {return this._id}
	get render() {return this._render}
	get source() {return this._source}
	get sourceCroppingPositions() {return this._sourceCroppingPositions}
    get keepAspectRatio() {return this._keepAspectRatio}
    get forcedUpdates() {return this._forcedUpdates}
	get repeatMode() {return this._repeatMode}
    get frameRate() {return 1/(this._frameRate)}
    get value() {
        const data = this._source
        if (data instanceof HTMLVideoElement && (!data.src && !data.srcObject?.active)) return Pattern.PLACEHOLDER_COLOR
        if (this._forcedUpdates || data instanceof HTMLVideoElement || data instanceof HTMLCanvasElement) this.update()
        return this._value??Pattern.PLACEHOLDER_COLOR
    }
    get naturalSize() {return ImageDisplay.getNaturalSize(this._source)}
    get video() {return this._source}
    get image() {return this._source}
    get paused() {return this._source?.paused}
    get isPaused() {return this.paused}
    get playbackRate() {return this._source?.playbackRate}
    get speed() {return this.playbackRate}
    get currentTime() {return this._source?.currentTime}
    get loop() {return this._source?.loop}
    get isLooping() {return this.loop}

    set paused(paused) {
        try {
            if (paused) this._source.pause()
            else ImageDisplay.playMedia(this._source)
        }catch(e){}
    }
    set isPaused(isPaused) {this.paused = isPaused}
    set playbackRate(playbackRate) {this._source.playbackRate = playbackRate}
    set speed(speed) {this.playbackRate = speed}
    set currentTime(currentTime) {this._source.currentTime = currentTime}
    set loop(loop) {this._source.loop = loop}
    set isLooping(isLooping) {this.loop = isLooping}
	set source(source) {
        ImageDisplay.initializeDataSource(source, (data)=>{
            this._source = data
            this.update(2)
        })
    }
    set sourceCroppingPositions(sourceCroppingPositions) {
        if (sourceCroppingPositions) {
            const pos1 = sourceCroppingPositions[0], pos2 = sourceCroppingPositions[1], naturalSize = this.naturalSize

            this._sourceCroppingPositions = [[
                typeof pos1[0]=="string" ? (+pos1[0].replace("%","").trim()/100)*naturalSize[0] : pos1[0]==null ? 0 : pos1[0],
                typeof pos1[1]=="string" ? (+pos1[1].replace("%","").trim()/100)*naturalSize[1] : pos1[1]==null ? 0 : pos1[1]
            ], [
                typeof pos2[0]=="string" ? (+pos2[0].replace("%","").trim()/100)*naturalSize[0] : pos2[0]==null ? naturalSize[0] : pos2[0],
                typeof pos2[1]=="string" ? (+pos2[1].replace("%","").trim()/100)*naturalSize[1] : pos2[1]==null ? naturalSize[1] : pos2[1]
            ]]
            this.update(2)
        } else this._sourceCroppingPositions = null
    }
	set keepAspectRatio(_keepAspectRatio) {
        this._keepAspectRatio = _keepAspectRatio
        this.update(2)
    }
	set forcedUpdates(_forcedUpdates) {
        this._forcedUpdates = _forcedUpdates
        this.update(2)
    }
	set repeatMode(_repeatMode) {
        this._repeatMode = _repeatMode
        this.update(2)
    }
    set frameRate(frameRate) {
        this._frameRate = 1/Math.max(frameRate, 0)
    }
    set rotation(deg) {
        this._rotation = CDEUtils.round(deg, 2)%360
        this.update(2)
    }
}
// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Abstract canvas obj class, with radius
class _Obj extends _BaseObj {
    static DEFAULT_RADIUS = 5
    static RADIUS_PRECISION = 4

    constructor(pos, radius, color, setupCB, loopCB, anchorPos, activationMargin) {
        super(pos, color, setupCB, loopCB, anchorPos, activationMargin)
        this._initRadius = radius       // initial object's radius delcaration
        this._radius = this._initRadius // current object's radius
    }

    // Runs when the object gets added to a canvas instance
    initialize() {
        this._radius = this.getInitRadius()??_Obj.DEFAULT_RADIUS
        super.initialize()
    }

    // returns the value of the inital radius declaration
    getInitRadius() {
        return CDEUtils.isFunction(this._initRadius) ? this._initRadius(this._parent instanceof Canvas?this:this._parent, this) : this._initRadius??null
    }

    // returns whether the provided pos is inside the obj
    isWithin(pos, positions) {
        return super.isWithin(pos, positions)
    }

    // returns the center pos of the provided positions
    getCenter(positions) {
        return super.getCenter(positions)
    }

    // returns the minimal rectangular area defined by the provided positions
    getBounds(positions, padding, rotation, scale, centerPos) {
        return super.getBounds(positions, padding, rotation, scale, centerPos)
    }

    get radius() {return this._radius}
    get initRadius() {return this._initRadius}

    set radius(radius) {this._radius = CDEUtils.round(radius<0?0:radius, _Obj.RADIUS_PRECISION)}
    set initRadius(initRadius) {this._initRadius = initRadius}
}
// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Contains and controls a group of dots
class Shape extends _Obj {
    static DEFAULT_LIMIT = 100

    constructor(pos, dots, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, loopCB, anchorPos, activationMargin, fragile) {
        super(pos, radius??_Obj.DEFAULT_RADIUS, color||Color.DEFAULT_COLOR, setupCB, loopCB, anchorPos, activationMargin)
        this._limit = limit||Shape.DEFAULT_LIMIT // the delimiter radius within which the drawEffect can take Effect
        this._initDots = dots                    // initial dots declaration
        this._dots = []                          // array containing current dots in the shape
        this._ratioPos = [Infinity,Infinity]     // position of ratio target object 
        this._drawEffectCB = drawEffectCB        // (render, Dot, ratio, setupResults, mouse, distance, parent, isActive, rawRatio)=>
        this._ratioPosCB = ratioPosCB            // custom ratio pos target (Shape, dots)=>
        this._fragile = fragile||false           // whether the shape resets on document visibility change
    }

    // initializes the shape, adds its dots and initializes them
    initialize() {
        this._pos = this.getInitPos()
        this.setAnchoredPos()

        if (Array.isArray(this._initDots) || this._initDots instanceof Dot) this.add(this._initDots)
        else if (CDEUtils.isFunction(this._initDots)) this.add(this._initDots(this, this._parent))
        else if (typeof this._initDots == "string") this.add(this.createFromString(this._initDots))

        this.setRadius(this.getInitRadius(), true)
        this.setColor(this.getInitColor(), true)
        if (this._visualEffects) this.setVisualEffects(this._visualEffects, true)

        this.initialized = true
        if (CDEUtils.isFunction(this._setupCB)) this._setupResults = this._setupCB(this, this?.parent)
    }

    // runs every frame, updates the ratioPos if ratioPosCB is defined
    draw(render, time, deltaTime) {
        super.draw(time, deltaTime)
        if (CDEUtils.isFunction(this._ratioPosCB)) this._ratioPos = this._ratioPosCB(this)
    }

    // adds one or many dots to the shape
    add(dot) {
        this._dots.push(...[dot].flat().filter(dot=>dot).map(dot=>{
            if (dot.initColor==null) dot.initColor = this.colorRaw
            if (dot.initRadius==null) dot.initRadius = this._radius
            if (dot.activationMargin==Canvas.DEFAULT_CANVAS_ACTIVE_AREA_PADDING) dot.activationMargin = this._activationMargin
            if (dot.visualEffect==null) dot.visualEffect = this.visualEffects_
            dot._parent = this
            dot.initialize()
            return dot
        }))
        this._parent.updateCachedAllEls()
    }

    // remove the shape and all its dots, or a single dot if id is specified
    remove(id=null) {
        if (id) this._dots = this._dots.filter(dot=>dot.id!=id)
        else this._parent.remove(this._id)
        this._parent.updateCachedAllEls()
    }

    /**
     * The generate() function allows the generation of custom formations of dot
     * @param {Function} yFn: a function providing a Y value depanding on a given X value. (x)=>{... return y}
     * @param {Number} startOffset: pos array representing the starting position offset
     * @param {Number} length: the width in pixels of the generation result
     * @param {Number} gapX: the gap in pixel skipped between each generation
     * @param {[Number, Number]} yModifier: a range allowing random Y offsets
     * @param {Function?} generationCallback: custom callback called on each generation (this, lastDot)=>
     * @returns The generated Dots
     */
    static generate(yFn, startOffset, length, gapX, yModifier, generationCallback) {
        yFn??=()=>0
        startOffset??=[0,0]
        length??=100
        gapX??=1
        yModifier??=[-50, 50]

        let dots = [], lastDot = null, isGenCB = CDEUtils.isFunction(generationCallback)
        for (let x=0;x<=length;x+=CDEUtils.getValueFromRange(gapX)) {
            const dot = new Dot([startOffset[0]+x, startOffset[1]+CDEUtils.getValueFromRange(yModifier)+yFn(x)])
            if (lastDot && isGenCB) generationCallback(dot, lastDot)
            dots.push(dot)
            lastDot = dot
        }
        return dots
    }

    /**
     * Can be used as a primitive/fast way to create a formation of dots, using text drawing 
     * @param {String} str: ex: "oo o o \n ooo \n ooo" 
     * @param {pos[x,y]} topLeftPos: starting pos of the formation
     * @param {[gapX, gapY]} gaps: the x and y distance between each dot
     * @param {Character} dotChar: the character used in the creation string other than the spaces
     * @returns the created dots formation
     */
    createFromString(str, topLeftPos=[0,0], gaps=[25, 25], dotChar="o") {
        const dots = []
        str.split("\n").filter(x=>x).forEach((x,i)=>{
            let [atX, atY] = topLeftPos
            atY+=i*gaps[1]
            ;[...x].forEach(c=>{
                if (c==dotChar) dots.push(new Dot([atX+gaps[0]/2, atY+gaps[1]/2]))
                atX+=gaps[0]
            })
        })
        return dots
    }
 
    // updates the radius of all the shape's dots. If "onlyReplaceDefaults" is true, it only sets the dot's radius if it was not initialy set
    setRadius(radius=this._radius, onlyReplaceDefaults) {
        this._radius = radius
        const d_ll = this._dots.length
        for (let i=0;i<d_ll;i++) {
            const dot = this._dots[i]
            if (onlyReplaceDefaults && dot.initRadius==null) {
                dot.radius = radius
                dot.initRadius = radius
            }
            else if (!onlyReplaceDefaults) {
                dot.radius = radius
                if (!dot.initRadius) dot.initRadius = radius
            }
        }
    }

    // updates the color of all the shape's dots. If "onlyReplaceDefaults" is true, it only sets the dot's color if it was not initialy set
    setColor(color=this._color, onlyReplaceDefaults) {
        this.color = color
        const d_ll = this._dots.length
        for (let i=0;i<d_ll;i++) {
            const dot = this._dots[i]
            if (onlyReplaceDefaults && !dot.initColor) {
                dot.color = color
                dot.initColor = color
            } else if (!onlyReplaceDefaults) {
                dot.color = color
                if (!dot.initColor) dot.initColor = color
            }
        }
    }

    // updates the visualEffects of all the shape's dots. If "onlyReplaceDefaults" is true, it only sets the dot's visualEffects if it was not initialy set
    setVisualEffects(visualEffects=this._visualEffects, onlyReplaceDefaults) {
        this._visualEffects = visualEffects
        const d_ll = this._dots.length
        for (let i=0;i<d_ll;i++) {
            const dot = this._dots[i]
            if (onlyReplaceDefaults && !dot.visualEffect) dot.visualEffects = visualEffects
            else if (!onlyReplaceDefaults) dot.visualEffects = visualEffects
        }
    }

    // moves the shape and all its dots in specified direction at specified distance(force)
    addForce(force, dir, time=1000, easing=Anim.easeInOutQuad, isUnique=true, animForce=true) {
        const rDir = CDEUtils.toRad(dir), ix = this.x, iy = this.y,
            dx = CDEUtils.getAcceptableDiff(force*Math.cos(rDir), CDEUtils.DEFAULT_ACCEPTABLE_DIFFERENCE),
            dy = CDEUtils.getAcceptableDiff(force*Math.sin(rDir), CDEUtils.DEFAULT_ACCEPTABLE_DIFFERENCE)
        
        return this.playAnim(new Anim((prog)=>{
            this.moveAt([ix+dx*prog, iy-dy*prog])
        }, time, easing), isUnique, animForce)
    }

    // Rotates the dots by a specified degree increment around a specified center point
    rotateBy(deg, centerPos=this.getCenter()) {// clock-wise, from the top
        const [cx, cy] = centerPos
        this._dots.forEach(dot=>{
            const x = dot.x-cx, y = dot.y-cy,
                cosV = Math.cos(CDEUtils.toRad(deg)), sinV = Math.sin(CDEUtils.toRad(deg))
                
            dot.x = (x*cosV-y*sinV)+cx
            dot.y = (x*sinV+y*cosV)+cy
        })

        this._rotation = (this._rotation+deg)%360
    }

    // Rotates the dots to a specified degree around a specified center point
    rotateAt(deg, centerPos=this.getCenter()) {
        this.rotateBy(360-(this._rotation-deg), centerPos)
    }

    // Smoothly rotates the dots to a specified degree around a specified center point
    rotateTo(deg, time=1000, easing=Anim.easeInOutQuad, centerPos=this.getCenter(), isUnique=true, force=true) {
        const ir = this._rotation, dr = deg-this._rotation

        return this.playAnim(new Anim((prog)=>{
            this.rotateAt(ir+dr*prog, centerPos)
        }, time, easing), isUnique, force)
    }

    // Scales the dots by a specified amount [scaleX, scaleY] from a specified center point
    scaleBy(scale, centerPos=this.getCenter()) {
        const [scaleX, scaleY] = scale, [cx, cy] = centerPos, dots = this._dots, dots_ll = dots.length
        for (let i=0;i<dots_ll;i++) {
            const dot = dots[i]
            dot.x = (dot.x-cx)*scaleX+cx
            dot.y = (dot.y-cy)*scaleY+cy
        }
        this._scale = [this._scale[0]*scaleX, this._scale[1]*scaleY]
    }

    // Scales the dots to a specified amount [scaleX, scaleY] from a specified center point
    scaleAt(scale, centerPos=this.getCenter()) {
        const dsX = scale[0]/this._scale[0], dsY = scale[1]/this._scale[1]
        this.scaleBy([dsX||1, dsY||1], centerPos)
    }

    // Smoothly scales the dots by a specified amount [scaleX, scaleY] from a specified center point
    scaleTo(scale, time=1000, easing=Anim.easeInOutQuad, centerPos=this.getCenter(), isUnique=true, force=true) {
        const is = this._scale, dsX = scale[0]-this._scale[0], dsY = scale[1]-this._scale[1]

        return this.playAnim(new Anim(prog=>{
            this.scaleAt([is[0]+dsX*prog, is[1]+dsY*prog], centerPos)
        }, time, easing), isUnique, force)
    }

    // returns whether the provided pos is inside the minimal rectangular area containing all of the shape's dots
    isWithin(pos, padding) {
        return super.isWithin(pos, this.getBounds(padding), padding)
    }

    // returns whether the provided pos is inside the area delimited by the dots perimeter
    isWithinAccurate(pos) {
        const dots = this._dots, d_ll = dots.length
        if (d_ll > 2) return this.ctx.isPointInPath(this.getBoundsAccurate(), pos[0], pos[1])
        return false
    }

    // returns the raw a minimal rectangular area containing all of the shape (no scale/rotation)
    #getRectBounds() {
        const rangeX = CDEUtils.getMinMax(this._dots, "x"), rangeY = CDEUtils.getMinMax(this._dots, "y")
        return [[rangeX[0],rangeY[0]], [rangeX[1],rangeY[1]]]
    }

    // returns the accurate area delimited by the dots perimeter
    getBoundsAccurate() {
        const dots = this._dots, d_ll = dots.length, perimeter = new Path2D(), firstDotPos = dots[0].pos
        perimeter.moveTo(firstDotPos[0], firstDotPos[1])
        for (let i=1;i<d_ll;i++) {
            const dotPos = dots[i].pos
            perimeter.lineTo(dotPos[0], dotPos[1])
        }
        perimeter.closePath()
        return perimeter
    }

    // returns the center pos of the shape
    getCenter() {
        return super.getCenter(this.#getRectBounds())
    }

    // returns the minimal rectangular area containing all of the shape
    getBounds(padding=this._radius, rotation, scale, centerPos) {
        const positions = this.#getRectBounds()
        return super.getBounds(positions, padding, rotation, scale, centerPos)
    }

    // Empties the shapes of all its dots
    clear() {
        this._dots = []
        this._parent.updateCachedAllEls()
    }

    // Rerenders the shape to its original form
    reset() {
        if (this._initDots) {
            this.clear()
            this.initialize()
        }
    }

    // enables path caching for all dots of this shape
    enableDotsPathCaching() {
        const dots = this._dots, d_ll = dots.length
        for (let i=0;i<d_ll;i++) dots[i].updateCachedPath()
    }

    // disables path caching for all dots of this shape
    disableDotsPathCaching() {
        const dots = this._dots, d_ll = dots.length
        for (let i=0;i<d_ll;i++) dots[i].disablePathCaching()
    }

    // returns a separate copy of this Shape (only initialized for objects)
    duplicate(pos=this.pos_, dots=this._dots.map(d=>d.duplicate()), radius=this._radius, color=this._color, limit=this._limit, drawEffectCB=this._drawEffectCB, ratioPosCB=this._ratioPosCB, setupCB=this._setupCB, loopCB=this._loopCB, anchorPos=this._anchorPos, activationMargin=this._activationMargin, fragile=this._fragile) {
        const colorObject = color, colorRaw = colorObject.colorRaw, shape = new Shape(
            pos,
            dots,
            radius,
            (_,shape)=>(colorRaw instanceof Gradient||colorRaw instanceof Pattern)?colorRaw.duplicate(Array.isArray(colorRaw.initPositions)?null:shape):colorObject.duplicate(),
            limit,
            drawEffectCB,
            ratioPosCB,
            setupCB,
            loopCB,
            anchorPos,
            activationMargin,
            fragile
        )
        shape._scale = CDEUtils.unlinkArr2(this._scale)
        shape._rotation = this._rotation
        shape._visualEffects = this.visualEffects_

        return this.initialized ? shape : null
    }

    get cvs() {return this._parent}
    get ctx() {return this.cvs.ctx}
    get render() {return this.cvs.render}
    get dots() {return this._dots}
    get limit() {return this._limit}
	get initDots() {return this._initDots}
    get drawEffectCB() {return this._drawEffectCB}
    get ratioPos() {return this._ratioPos}
    get ratioPosCB() {return this._ratioPosCB}
    get lastDotsPos() {return this._lastDotsPos}
    get dotsPositions() {// returns a string containing all the dot's position
        let currentDotPos="", d_ll = this.dots.length
        for (let i=0;i<d_ll;i++) currentDotPos += this.dots[i].stringPos
        return currentDotPos
    }
    get firstDot() {return this._dots[0]}
    get secondDot() {return this._dots[1]}
    get thirdDot() {return this._dots[2]}
    get lastDot() {return CDEUtils.getLast(this._dots, 0)}
    get asSource() {return this._dots}

    set ratioPos(ratioPos) {this._ratioPos = ratioPos}
    set drawEffectCB(cb) {this._drawEffectCB = cb}
    set ratioPosCB(cb) {this._ratioPosCB = cb}
    set lastDotsPos(ldp) {this._lastDotsPos = ldp}
    set limit(limit) {this._limit = limit}
}
// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Allows the creation of custom gradients
class Gradient extends _DynamicColor {
    static TYPES = {LINEAR:"Linear", RADIAL:"Radial", CONIC:"Conic"}
    static DEFAULT_TYPE = Gradient.TYPES.LINEAR
    static SERIALIZATION_SEPARATOR = "*"
    static SERIALIZATION_COLOR_STOPS_SEPARATOR = "$"

    #lastRotation = null
    #lastType = null
    constructor(ctx, positions, colorStops, type, rotation) {
        super(
            positions, // linear:[[x1,y1],[x2,y2]] | radial:[[x1, y1, r1],[x2,y2,r2]] | conic:[x,y] | instance of _Obj
            rotation   // rotation of the gradient, not applicable for radial type
        ) 
        this._ctx = ctx.ctx??ctx                 // canvas context
        this._type = type||Gradient.DEFAULT_TYPE // type of gradient
        this._colorStops = colorStops.map(([stop, color])=>[stop, Color.adjust(color)]) // ex: [[0..1, Color], [0.5, Color], [1, Color]]
        this.update()
    }

    /**
     * Given an canvas object, returns automatic positions values for linear, radial or conic gradients
     * @param {Shape|Dot|TextDisplay} obj: Inheritor of _Obj
     * @returns the new calculated positions or the current value of this._positions if the parameter 'obj' isn't an instance of a canvas object
     */
    getAutomaticPositions(obj=this._initPositions) {
        if (obj instanceof Shape) {
            if (this.#hasFoundamentalsChanged() || this.#hasShapeChanged(obj)) {
                const rangeX = CDEUtils.getMinMax(obj.dots, "x"), rangeY = CDEUtils.getMinMax(obj.dots, "y"),
                    smallestX = rangeX[0], smallestY = rangeY[0], biggestX = rangeX[1], biggestY = rangeY[1],
                    cx = smallestX+(biggestX-smallestX)/2, cy = smallestY+(biggestY-smallestY)/2
                if (this._type==Gradient.TYPES.LINEAR) return this.#getLinearPositions(smallestX-cx, smallestY-cy, biggestX-cx, biggestY-cy, cx, cy)
                else if (this._type==Gradient.TYPES.RADIAL) return this.#getRadialPositions(cx, cy, Math.max(biggestX-smallestX, biggestY-smallestY))
                else return obj.getCenter()
            } else return this._positions
        } else if (obj instanceof Dot) {
            if (this.#hasFoundamentalsChanged() || this.#hasDotChanged(obj)) {
                const x = obj.pos[0], y = obj.pos[1]
                if (this._type==Gradient.TYPES.LINEAR) return this.#getLinearPositions(obj.left-x, obj.top-y, obj.right-x, obj.bottom-y,x, y)
                else if (this._type==Gradient.TYPES.RADIAL) return this.#getRadialPositions(x, y, obj.radius)
                else return obj.pos_
            } return this._positions
        } else if (obj instanceof TextDisplay) {
            if (this.#hasFoundamentalsChanged() || this.#hasTextDisplayChanged(obj)) {
                const [width, height] = obj.trueSize, [cx, cy] = obj.pos, left = cx-width/2, right = cx+width/2, top = cy-height/2, bottom = cy+height/2
                if (this._type==Gradient.TYPES.LINEAR) return this.#getLinearPositions(left-cx, top-cy, right-cx, bottom-cy, cx, cy)
                else if (this._type==Gradient.TYPES.RADIAL) return this.#getRadialPositions(cx, cy, Math.max(right-left, bottom-top))
                else return obj.pos_
            } return this._positions
        } else if (obj instanceof AudioDisplay) return obj.getBounds()
        else if (this._type==Gradient.TYPES.LINEAR) {
            const [[x, y], [x2, y2]] = obj, cx = x+(x2-x)/2, cy = y+(y2-y)/2
            return this.#getLinearPositions(x-cx, y-cy, x2-cx, y2-cy, cx, cy)
        } else return this._positions
    }

    #getLinearPositions(x, y, x2, y2, cx, cy) {
        const cosV = Math.cos(CDEUtils.toRad(this._rotation)), sinV = Math.sin(CDEUtils.toRad(this._rotation)), round = CDEUtils.round
        return [[round((x*cosV-y*sinV)+cx), round((x*sinV+y*cosV)+cy)], [round((x2*cosV-y2*sinV)+cx), round((x2*sinV+y2*cosV)+cy)]]
    }

    #getRadialPositions(x, y, coverRadius) {
        return [[x, y, coverRadius], [x, y, coverRadius*0.25]]
    }

    #hasFoundamentalsChanged() {
        if (this.#lastRotation !== this._rotation || this.#lastType !== this._type) {
            this.#lastRotation = this._rotation
            this.#lastType = this._type
            return true
        } else return false
    }

    #hasShapeChanged(shape) {
        const currentDotsPos = shape.dotsPositions
        if (currentDotsPos !== this._lastChangeValue) {
            this._lastChangeValue = currentDotsPos
            return true
        } else return false
    }
    
    #hasDotChanged(dot) {
        const currentDotPos = dot.stringPos
        if (currentDotPos !== this._lastChangeValue) {
            this._lastChangeValue = currentDotPos
            return true
        } else return false
    }

    #hasTextDisplayChanged(textDisplay) {
        const pos = textDisplay.trueSize+textDisplay.pos
        if (pos !== this._lastChangeValue) {
            this._lastChangeValue = pos
            return true
        } else return false
    }

    // Creates and returns the gradient. Updates it if the initPositions is a Shape/Dot/TextDisplay instance
    update(force) {
        if (this._initPositions != _DynamicColor.PLACEHOLDER) {
            const positions = this.getAutomaticPositions()

            if (!force && Array.isArray(this._positions) && CDEUtils.positionsEquals(positions, this._positions)) return;
            return this._value = Gradient.getCanvasGradient(this._ctx, this._positions = positions, this._colorStops, this._type, this._rotation)
        }
    }

    // returns a separate copy of the Gradient
    duplicate(positions=this._positions, ctx=this._ctx, colorStops=this._colorStops, type=this._type, rotation=this._rotation) {
        return new Gradient(ctx, CDEUtils.unlinkPositions(positions), [...colorStops], type, rotation)
    }

    toString() {
        const sep = Gradient.SERIALIZATION_SEPARATOR
        return this._positions+sep+this._colorStops.flat().join(Gradient.SERIALIZATION_COLOR_STOPS_SEPARATOR)+sep+this._type+sep+this._rotation
    }

    // returns a CanvasGradient instance from the provided parameters
    static getCanvasGradient(ctx, positions, colorStops, type, rotation) {
        const canvasGradient = type==Gradient.TYPES.CONIC ? ctx.createConicGradient(CDEUtils.toRad(rotation), positions[0], positions[1]) : ctx[`create${type}Gradient`](...positions[0], ...positions[1]), cs_ll = colorStops.length
        for (let i=0;i<cs_ll;i++) canvasGradient.addColorStop(colorStops[i][0], Color.getColorValue(colorStops[i][1]))
        return canvasGradient
    }

    // returns a CanvasGradient instance from a serialized Gradient string
    static getCanvasGradientFromString(ctx, str) {
        let [positions, colorStops, type, rotation] = str.split(Gradient.SERIALIZATION_SEPARATOR), splitPositions = positions.split(","), splitColorStops = colorStops.split(Gradient.SERIALIZATION_COLOR_STOPS_SEPARATOR), scs_ll = splitColorStops.length

        positions = splitPositions.length==2 ? [+splitPositions[0], +splitPositions[1]] : [[+splitPositions[0], +splitPositions[1]], [+splitPositions[2], +splitPositions[3]]]
        colorStops = []
        for (let i=0;i<scs_ll;i+=2) colorStops.push([+splitColorStops[i], splitColorStops[i+1]])
        
        return Gradient.getCanvasGradient(ctx, positions, colorStops, type, +rotation)
    }

    get ctx() {return this._ctx}
    get type() {return this._type}
	get colorStops() {return this._colorStops}

	set colorStops(_colorStops) {
        this._colorStops = _colorStops.map(([stop, color])=>[stop, Color.adjust(color)])
        if (!this.isDynamic) this.update()
    }
    set type(type) {
        this._type = type
        if (!this.isDynamic) this.update()
    }
}
// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Regular shape with a filled area defined by its dots
class FilledShape extends Shape {
    #lastDotsPos = null
    constructor(fillColor, dynamicUpdates=false, pos, dots, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, loopCB, anchorPos, activationMargin, fragile) {
        super(pos, dots, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, loopCB, anchorPos, activationMargin, fragile)
        this._initFillColor = fillColor       // declaration color fill value
        this._fillColor = this._initFillColor // the current color or gradient of the filled shape
        this._path = null                     // path perimeter delimiting the surface to fill
        this._dynamicUpdates = dynamicUpdates // whether the shape's filling checks for updates every frame
    }

    // initializes the filled shape and creates its path
    initialize() {
        super.initialize()
        if (CDEUtils.isFunction(this._initFillColor)) this.fillColor = this._initFillColor(this.render, this)
        else this.fillColor = this._initFillColor
        this.updatePath()
    }

    // runs every frame, draws the shape if it is at least containing 3 dots
    draw(render, time, deltaTime) {
        super.draw(render, time, deltaTime)
        
        if (this.dots.length > 2) {
            if (this._dynamicUpdates) this.updatePath()
            render.fill(this._path, this._fillColor, this.visualEffects)
        }
    }

    // updates the path perimeter if the dots pos have changed
    updatePath() {
        const d_ll = this.dots.length
        if (d_ll) {
            const currentDotPos = this.dotsPositions
            if (currentDotPos !== this.#lastDotsPos) {
                this.#lastDotsPos = currentDotPos
                this._path = new Path2D()
                const firstDotPos = this.dots[0].pos
                this._path.moveTo(firstDotPos[0], firstDotPos[1])
                for (let i=1;i<d_ll;i++) {
                    const dotPos = this.dots[i].pos
                    this._path.lineTo(dotPos[0], dotPos[1])
                }
                this._path.closePath()
            } 
        }
    }

    // returns a separate copy of this FilledShape (only initialized for objects)
    duplicate() {
        const fillColorObject = this._fillColor, fillColorRaw = fillColorObject.colorRaw, colorObject = this._color, colorRaw = colorObject.colorRaw, filledShape = new FilledShape(
            (_,shape)=>(fillColorRaw instanceof Gradient||fillColorRaw instanceof Pattern)?fillColorRaw.duplicate(Array.isArray(fillColorRaw.initPositions)?null:shape):fillColorObject.duplicate(),
            this._dynamicUpdates,
            this.pos_,
            this._dots.map(d=>d.duplicate()),
            this._radius,
            (_,shape)=>(colorRaw instanceof Gradient||colorRaw instanceof Pattern)?colorRaw.duplicate(Array.isArray(colorRaw.initPositions)?null:shape):colorObject.duplicate(),
            this._limit,
            this._drawEffectCB,
            this._ratioPosCB,
            this._setupCB,
            this._loopCB,
            this._fragile
        )
        filledShape._scale = CDEUtils.unlinkArr2(this._scale)
        filledShape._rotation = this._rotation
        filledShape._visualEffects = this.visualEffects_
        
        return this.initialized ? filledShape : null
    }

    get fillColorObject() {return this._fillColor}
    get fillColorRaw() {return this._fillColor.colorRaw}
    get fillColor() {return this._fillColor.color}
    get initFillColor() {return this._initFillColor}
	get path() {return this._path}
	get dynamicUpdates() {return this._dynamicUpdates}

    set fillColor(fillColor) {
        const fc = this._fillColor
        if (!fc || fc?.colorRaw?.toString() !== fillColor?.toString()) {
            const specialColor = fillColor?.colorRaw||fillColor
            if (specialColor?.positions==_DynamicColor.PLACEHOLDER) {
                if (!fillColor.isChannel) fillColor = specialColor.duplicate()
                else fillColor = specialColor 
                fillColor.initPositions = this
            }

            
            if (fc instanceof Color) fc.color = fillColor
            else this._fillColor = Color.adjust(fillColor)
        }
    }
	set dynamicUpdates(_dynamicUpdates) {return this._dynamicUpdates = _dynamicUpdates}
}
// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Allows the creation of symbols/text based on specific source
class Grid extends Shape {
    static DEFAULT_KEYS = ""
    static DEFAULT_GAPS = [10, 10]
    static DEFAULT_SOURCE = GridAssets.DEFAULT_SOURCE
    static DEFAULT_SPACING = (grid)=>grid._source.width*grid._gaps[0]+grid._gaps[0]-grid._source.width+grid._radius
    static DELETION_VALUE = null
    static SAME_VALUE = undefined

    #symbolsReferences = []
    constructor(keys, gaps, spacing, source, pos, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, loopCB, anchorPos, activationMargin, fragile) {
        super(pos, null, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, loopCB, anchorPos, activationMargin, fragile)

        this._keys = keys+""||Grid.DEFAULT_KEYS             // keys to convert to source's values as a string
        this._gaps = gaps??Grid.DEFAULT_GAPS                // [x, y] gap length within the dots
        this._source = source?? Grid.DEFAULT_SOURCE         // symbols' source
        this._spacing = spacing??Grid.DEFAULT_SPACING(this) // gap length between symbols
    }

    initialize() {
        this._pos = this.getInitPos()
        this.setAnchoredPos()

        if (this._keys) {
            const symbols = this.createGrid()
            this.add(symbols.flat())
            this.#updatedCachedSymbolReferences(symbols)
        }

        this.setRadius(this.getInitRadius(), true)
        this.setColor(this.getInitColor(), true)

        this.initialized = true
        if (CDEUtils.isFunction(this._setupCB)) this._setupResults = this._setupCB(this, this?.parent)
    }

    // Creates a formation of symbols
    createGrid(keys=this._keys, pos=[0,0], gaps=this._gaps, spacing=this._spacing, source=this._source) {
        let [cx, cy] = pos, isNewLine=true, symbols=[], k_ll = keys.length
        for (let i=0;i<k_ll;i++) {
            const l = keys[i], symbol = this.createSymbol(l, [cx=(l=="\n")?pos[0]:(cx+spacing*(!isNewLine)), cy+=(l=="\n")&&source.width*gaps[1]+this.radius])
            isNewLine = (l=="\n")
            symbols.push(symbol)
        }

        return symbols
    }

    // Creates the dot based symbol at given pos, based on given source
    createSymbol(key, pos=super.relativePos, source=this._source) {
        let dotGroup = [], xi=[0,0], yi=0, s = source[key], sourceRadius = Math.sqrt(source.width*source.height), places = GridAssets.D.places

        if (key===Grid.DELETION_VALUE || key===Grid.SAME_VALUE) return key

        if (s) s.map((d,i)=>[new Dot([pos[0]+(xi[0]=d[0]??xi[0]+1,isNaN(Math.abs(d[0]))?xi[0]:Math.abs(d[0]))*this._gaps[0], pos[1]+(yi+=(xi[0]<=xi[1]||!i)||Math.sign(1/xi[0])==-1)*this._gaps[1]]), d[1], yi*sourceRadius+(xi[1]=Math.abs(xi[0]))]).forEach(([dot, c, p],_,a)=>{
            if (isFinite(p)) {
                places.forEach(dir=>c&dir[0]&&dot.addConnection(a.find(n=>n[2]==p+dir[1](sourceRadius))?.[0])) 
                dotGroup.push(dot)
            }
        })
        return dotGroup
    }

    #updatedCachedSymbolReferences(symbols) {
        const ll = symbols.length
        for (let i=0;i<ll;i++) {
            const dots = symbols[i]
            if (dots!=Grid.SAME_VALUE) {
                const d_ll = dots.length, ids = new Array(d_ll)
                for (let ii=0;ii<d_ll;ii++) ids[ii] = dots[ii].id
                this.#symbolsReferences[i] = ids
            } else if (dots===Grid.DELETION_VALUE) delete this.#symbolsReferences[i]
        }
    }

    // deletes the symbol at the provided index
    deleteKey(i) {
        if (typeof i=="number") i = this.getKey(i)
        
        if (i) {
            const k_ll = i.length 
            for (let ii=0;ii<k_ll;ii++) i[ii].remove()
        }
    }

    // returns the dots composing the symbol at the provided index
    getKey(i) {
        const ids = this.#symbolsReferences[i]??[], i_ll = ids.length, dots = new Array(i_ll), cvs = this.parent
        for (let i=0;i<i_ll;i++) dots[i] = cvs.get(ids[i])
        return dots
    }

    // returns a separate copy of this Grid (only initialized for objects)
    duplicate() {
        const colorObject = this._color, colorRaw = colorObject.colorRaw, grid = new Grid(
            this._keys,
            CDEUtils.unlinkArr2(this._gaps),
            this._spacing,
            this._source,
            this.pos_,
            this._radius,
            (_,shape)=>(colorRaw instanceof Gradient||colorRaw instanceof Pattern)?colorRaw.duplicate(Array.isArray(colorRaw.initPositions)?null:shape):colorObject.duplicate(),
            this._limit,
            this._drawEffectCB,
            this._ratioPosCB,
            this._setupCB,
            this._loopCB,
            this._fragile
        )
        grid._scale = CDEUtils.unlinkArr2(this._scale)
        grid._rotation = this._rotation
        grid._visualEffects = this.visualEffects_

        return this.initialized ? grid : null
    }

    get keys() {return this._keys}
	get gaps() {return this._gaps}
	get spacing() {return this._spacing}
	get source() {return this._source}

	set keys(keys) {
        const n_ll = keys.length>this._keys.length?keys.length:this._keys.length, newKeys = new Array(n_ll)
        for (let i=0;i<n_ll;i++) {
            const newKey = keys[i], oldKey = this._keys[i]
            if (oldKey!=newKey || oldKey=="\n") {
                newKeys[i] = newKey||Grid.DELETION_VALUE
                this.deleteKey(i)
            }
            else newKeys[i] = Grid.SAME_VALUE
        }
        this._keys = keys

        const symbols = this.createGrid(newKeys)
        this.#updatedCachedSymbolReferences(symbols)
        super.add(symbols.flat())
    }
	set gaps(gaps) {
        super.clear()
        this._gaps = gaps
        super.add(this.createGrid().flat())
    }
	set spacing(spacing) {
        spacing??=this._source.width*this._gaps[0]+this._gaps[0]-this._source.width+this._radius
        const oldSpacing = this._spacing, keys = this._keys, s_ll = keys.length, cvs = this.parent
        if (oldSpacing != spacing) {
            for (let i=0,vi=0;i<s_ll;i++,vi=keys[i]=="\n"?-1:vi+1) {
                const ids = this.#symbolsReferences[i], d_ll = ids.length
                for (let ii=0;ii<d_ll;ii++) {
                    cvs.get(ids[ii]).moveBy([(spacing-oldSpacing)*vi])
                }
            }
            this._spacing = spacing
        }
    }
	set source(source) {
        super.clear()
        this._source = source??Grid.DEFAULT_SOURCE
        super.add(this.createGrid())
    }
}
// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// The main component to create Effect, can be used on it's own, but designed to be contained by a Shape instance
class Dot extends _Obj {
    constructor(pos, radius, color, setupCB, anchorPos, activationMargin, disablePathCaching=false) {
        super(pos, radius, color, setupCB, null, anchorPos, activationMargin)
        this._connections = []  // array of Dot to eventually draw a connecting line to
        this._cachedPath = !disablePathCaching // the cached path2d object or null if path caching is disabled
    }

    // runs every frame, draws the dot and runs its parent drawEffect callback
    draw(render, time, deltaTime) {
        if (this.initialized) {
            const drawEffectCB = this.drawEffectCB
            if (drawEffectCB) {
                const dist = this.getDistance(), rawRatio = this.getRatio(dist), isActive = rawRatio<1, parent = this._parent
                drawEffectCB(render, this, isActive?rawRatio:1, parent.setupResults, parent.parent.mouse, dist, parent, isActive, rawRatio)
            }

            if (this._radius && (this.a??1) > Color.OPACITY_VISIBILITY_THRESHOLD) {
                const ctx = render.ctx, scaleX = this._scale[0], scaleY = this._scale[1], hasScaling = scaleX!==1||scaleY!==1, hasTransforms = hasScaling||(this._visualEffects?.[0]?.indexOf("#")!==-1)||this._rotation

                if (hasTransforms) {
                    let viewPos
                    if (hasScaling) {
                        const x = this._pos[0], y = this._pos[1]
                        viewPos = this.cvs.viewPos
                        ctx.translate(x, y)
                        if (this._rotation) ctx.rotate(CDEUtils.toRad(this._rotation))
                        ctx.scale(scaleX, scaleY)
                        ctx.translate(-x, -y)
                    }

                    render.fill(this._cachedPath||Render.getArc(this._pos, this._radius), this._color, this.visualEffects)
                    if (hasScaling) ctx.setTransform(1,0,0,1,viewPos[0],viewPos[1])
                } else render.batchFill(this._cachedPath||Render.getArc(this._pos, this._radius), this._color, this.visualEffects)
            }
        } else {
            this.initialized = true
            if (this._cachedPath) this.updateCachedPath()
        }
        super.draw(time, deltaTime)
    }

    // returns pythagorian distance between the ratio defining position and the dot
    getDistance(fx=this.ratioPos[0], fy=this.ratioPos[1]) {
        return CDEUtils.getDist(fx, fy, this.x, this.y)
    }

    // calculates the ratio based on distance and parent's limit
    getRatio(dist) {
        return dist / this.limit
    }

    // adds a dot to the connection array
    addConnection(dot) {
        if (dot instanceof Dot) this._connections.push(dot)
    }

    // removes a dot from the connection array
    removeConnection(dotOrId) {
        this._connections = this._connections.filter(d=>typeof dotOrId=="number"?d.id!==dotOrId:d.id!==dotOrId.id)
    }

    // deletes the dot
    remove() {
        this._parent.remove(this._id)
    }

    /**
     * Calculates the 4 intersection points between two dots and a direct line going through them.
     * @param {Dot | pos} target: a Dot or a pos [x,y] (Defaults to the first Dot in this object's connections list)
     * @param {Number} targetPadding: the padding radius of the target (Defaults to the target radius if it's a Dot, or 5)
     * @param {Dot | pos} source: a Dot or a pos [x,y] (Defaults to this object)
     * @param {Number} sourcePadding: the padding radius of the source (Defaults to the source radius if it's a Dot, or 5)
     * @returns {
     *      source: [ [x, y], [x, y] ]
     *      target: [ [x, y], [x, y] ]
     * } The 2 intersection points for the target and for the source
     */
    getLinearIntersectPoints(target=this._connections[0], targetPadding=target.radius??5, source=this, sourcePadding=this.radius??5) {
        const [tx, ty] = target.pos??target, [sx, sy] = source.pos??source,
            [a, b, lfn] = CDEUtils.getLinearFn([sx,sy], [tx,ty]), t_r = targetPadding**2, s_r = sourcePadding**2,
            qA = (1+a**2)*2,
            s_qB = -(2*a*(b-sy)-2*sx),
            s_qD = Math.sqrt(s_qB**2-(4*(qA/2)*((b-sy)**2+sx**2-s_r))),
            t_qB = -(2*a*(b-ty)-2*tx),
            t_qD = Math.sqrt(t_qB**2-(4*(qA/2)*((b-ty)**2+tx**2-t_r))),
            s_x1 = (s_qB+s_qD)/qA, s_x2 = (s_qB-s_qD)/qA, t_x1 = (t_qB+t_qD)/qA, t_x2 = (t_qB-t_qD)/qA,
            s_y1 = lfn(s_x1), s_y2 = lfn(s_x2), t_y1 = lfn(t_x1), t_y2 = lfn(t_x2)
        return [[[s_x1, s_y1], [s_x2, s_y2]], [[t_x2, t_y2], [t_x1, t_y1]]]
    }

    // activates path caching and updates the cached path
    updateCachedPath() {
        this._cachedPath = Render.getArc(this._pos, this._radius)
    }

    // disables path caching
    disablePathCaching() {
        this._cachedPath = null
    }

    // returns a separate copy of this Dot
    duplicate(pos=this.getInitPos(), radius=this._radius, color=this._color, setupCB=this._setupCB, anchorPos=this._anchorPos, activationMargin=this._activationMargin, disablePathCaching=!this._cachedPath) {
        const colorObject = color, colorRaw = colorObject.colorRaw, dot = new Dot(
            pos,
            radius,
            (colorRaw instanceof Gradient||colorRaw instanceof Pattern) && colorRaw._initPositions.id != null && this._parent.id != null && colorRaw._initPositions.id == this._parent.id ? null:(_,dot)=>(colorRaw instanceof Gradient||colorRaw instanceof Pattern)?colorRaw.duplicate(Array.isArray(colorRaw.initPositions)?null:dot):colorObject.duplicate(),
            setupCB,
            anchorPos,
            activationMargin,
            disablePathCaching
        )

        dot._scale = CDEUtils.unlinkArr2(this._scale)
        dot._rotation = this._rotation
        dot._visualEffects = this.visualEffects_
        return dot
    }

    // returns whether the provided pos is in the dot pos, positions, padding,
    isWithin(pos, padding, rotation, scale) {
        return super.isWithin(pos, this.getBounds(padding, rotation, scale))
    }

    // returns whether the provided pos is in the image
    isWithinAccurate(pos, axisPadding, rotation, scale) {
        return this.ctx.isPointInPath(this.getBoundsAccurate(axisPadding, rotation, scale), pos[0], pos[1])
    }

    // returns the raw a minimal rectangular area containing all of the dot (no scale/rotation)
    #getRectBounds() {
        const pos = this._pos, radius = this._radius
        return [[pos[0]-radius, pos[1]-radius], [pos[0]+radius, pos[1]+radius]]
    }

    // returns the accurate area containing all of the dot
    getBoundsAccurate(axisPadding, rotation=this._rotation, scale=this._scale) {
        const radius = this._radius
        axisPadding??=0
        axisPadding = typeof axisPadding=="number" ? [axisPadding, axisPadding] : [axisPadding[0], axisPadding[1]??axisPadding[0]]
        return Render.getEllispe(this._pos, radius*scale[0]+axisPadding[0], radius*scale[1]+axisPadding[1], CDEUtils.toRad(rotation))
    }

    // returns the center pos of the image
    getCenter() {
        return this._pos
    }

    // returns the minimal rectangular area containing all of the dot
    getBounds(padding, rotation=this._rotation, scale=this._scale) {
        const positions = this.#getRectBounds()
        return super.getBounds(positions, padding, (scale[0]!=scale[1]&&(scale[0]!=1||scale[1]!=1))?rotation:0, scale, super.getCenter(positions))
    }

    get ctx() {return this.cvs.ctx}
    get cvs() {return this._parent.parent||this._parent}
    get render() {return this.cvs.render}
    get limit() {return this._parent.limit}
    get drawEffectCB() {return this._parent?.drawEffectCB}
    get mouse() {return this.cvs.mouse}
    get ratioPos() {return this._parent.ratioPos}
    get connections() {return this._connections}
    get parentSetupResults() {return this._parent?.setupResults}
    get top() {return this.y-this._radius*this._scale[1]}
    get bottom() {return this.y+this._radius*this._scale[1]}
    get right() {return this.x+this._radius*this._scale[0]}
    get left() {return this.x-this._radius*this._scale[0]}
    get width() {return this._radius*2*this._scale[0]}
    get height() {return this._radius*2*this._scale[1]}
    get x() {return super.x}
    get y() {return super.y}
    get pos() {return this._pos}
    get relativeX() {return super.relativeX}
    get relativeY() {return super.relativeY}
    get relativePos() {return super.relativePos}
    get radius() {return this._radius}
    get cachedPath() {return this._cachedPath}


    set x(x) {
        x = CDEUtils.round(x, _BaseObj.POSITION_PRECISION)
        if (this._pos[0] != x) {
            this._pos[0] = x
            if (this._cachedPath) this.updateCachedPath()
        }
    }
    set y(y) {
        y = CDEUtils.round(y, _BaseObj.POSITION_PRECISION)
        if (this._pos[1] != y) {
            this._pos[1] = y
            if (this._cachedPath) this.updateCachedPath()
        }
    }
    set pos(pos) {
        if (!CDEUtils.posEquals(pos, this._pos)) {
            this.x = pos[0]
            this.y = pos[1]
            if (this._cachedPath) this.updateCachedPath()
        }
    }
    set relativeX(x) {this.x = this.anchorPos[0]+x}
    set relativeY(y) {this.y = this.anchorPos[1]+y}
    set relativePos(pos) {
        this.relativeX = CDEUtils.round(pos[0], _BaseObj.POSITION_PRECISION)
        this.relativeY = CDEUtils.round(pos[1], _BaseObj.POSITION_PRECISION)
    }
    set radius(radius) {
        radius = CDEUtils.round(radius<0?0:radius, _Obj.RADIUS_PRECISION)
        if (this._radius != radius) {
            this._radius = radius
            if (this._cachedPath) this.updateCachedPath()
        }
    }
    set limit(limit) {this._parent.limit = limit}
    set connections(c) {return this._connections = c}
    set cachedPath(path) {this._cachedPath = path}
}