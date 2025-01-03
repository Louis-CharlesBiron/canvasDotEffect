// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//
const ACCEPTABLE_DIF = 0.0000001

// returns a random number within the min and max range. Can generate decimals
function random(min, max, decimals=0) {
    return +(Math.random()*(max-min)+min).toFixed(decimals)
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

// Returns the element at the specified index, starting from the end of the array
Array.prototype.last=function(index=0){return this[this.length-1-index]}
// Adds an element to the specified index of the array
Array.prototype.addAt=function(el, index=0){return this.slice(0,index).concat(...[el, this.slice(index, this.length)])}

// Returns the pythagorian distance between 2 points
function getDist(x1, y1, x2, y2) {
    return Math.sqrt((x1-x2)**2 + (y1-y2)**2)
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
function mod(max, ratio, range) {
    range??=max
    return max-ratio*range+max*((range>=0)-1)
}

// Formats an rgba array [r, g, b, a] to a valid color string
function formatColor(rgba) {
    return typeof rgba=="object" ? `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3]})` : rgba
}

// returns converted given degrees into radians 
function toRad(deg) {
    return deg*(Math.PI/180)
}

// returns converted given radians into degrees 
function toDeg(rad) {
    return rad/(Math.PI/180)
}

/**
 * Rounds the specied decimal number if it's close enough to its rounded value 
 * @param {Number} n: a decimal number 
 * @param {Number} okDif: the minimal difference between the given decimal number and it's rounded conterpart, for them be considered the same 
 * @returns The potentially adjusted number
 */
function getAcceptableDif(n, okDif) {
    return Math.round(n)-n <= okDif ? Math.round(n) : n
}

/**
 * @param {[Number|Object]} arr: array containing numbers or objects a numberic property 
 * @param {String?} propPath: the path of the compared value if the array is containing objects 
 * @returns the [min, max] values of the array
 */
function getMinMax(arr, propPath=null) {
    let min = Infinity, max = -Infinity, ll = arr.length
    for (let i=0;i<ll;i++) {
        let v = propPath ? +arr[i][propPath] : arr[i]
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
function repeatedTimeout(iterationCount, callback, delay=5) {
    let at = 0
    for (let i=0;i<iterationCount;i++) {
        setTimeout(()=>callback(i),at+=delay)
    }
}

// Can be used to display a dot at the specified shape pos (which is normally not visible)
const SHOW_CENTERS_DOT_ID = {}
function toggleCenter(shape, radius=5, color=[255,0,0,1]) {
    if (!SHOW_CENTERS_DOT_ID[shape.id]) {
        let dot = new Dot(()=>[shape.x, shape.y], radius, color)
        SHOW_CENTERS_DOT_ID[shape.id] = dot.id
        CVS.add(dot, true)
    } else {
        CVS.remove(SHOW_CENTERS_DOT_ID[shape.id])
        SHOW_CENTERS_DOT_ID[shape.id] = undefined
    }
}

// GENERICS //
class CvsUtils {
    // Generic function to draw connection between the specified dot and the dots in its connections property
    static drawDotConnections(dot, rgba=[255,255,255,1], isSourceOver=false) {
        let ctx = dot.ctx, dc_ll = dot.connections.length
        if (!isSourceOver) ctx.globalCompositeOperation = "destination-over"
        if (dc_ll) for (let i=0;i<dc_ll;i++) {
            let c = dot.connections[i]
            ctx.strokeStyle = formatColor(rgba)
            ctx.beginPath()
            ctx.moveTo(dot.x, dot.y)
            ctx.lineTo(c.x, c.y)
            ctx.stroke()
        }
        if (!isSourceOver) ctx.globalCompositeOperation = "source-over"
    }
    
    // Generic function to draw an outer ring around a dot
    static drawOuterRing(dot, rgba=[255,255,255,1], radiusMultiplier) {
        let ctx = dot.ctx
        ctx.strokeStyle = formatColor(rgba)
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.radius*radiusMultiplier, 0, CIRC)
        ctx.stroke()
    }
    
    // Generic function to draw connection between the specified dot and a sourcePos
    static drawConnections(dot, rgba=[255,255,255,1], sourcePos) {
        let ctx = dot.ctx
        ctx.strokeStyle = formatColor(rgba)
        ctx.beginPath()
        ctx.moveTo(sourcePos[0], sourcePos[1])
        ctx.lineTo(dot.x, dot.y)
        ctx.stroke()
    }

    // Generic function to get a callback that can make a dot draggable and throwable
    static getDraggableDotCB(pickableRadius=50) {
        let mouseup = false, adotShapeAnim = null
        return (dot, mouse, dist, ratio)=>{
            if (mouse.clicked && dist < pickableRadius) {
                mouseup = true
                if (dot?.currentAnim?.id == adotShapeAnim?.id && adotShapeAnim) adotShapeAnim.end()
                dot.x = mouse.x
                dot.y = mouse.y
            } else if (mouseup) {
                mouseup = false
                adotShapeAnim = dot.addForce(Math.min(mod(Math.min(mouse.speed,3000), ratio)/4, 300), mouse.dir, 750+ratio*1200, Anim.easeOutQuad)
            }
        }
    }


}