// JS
// Canvas Dot Effects by Louis-Charles Biron
// Please don't use or credit this code as your own.
//
const ACCEPTABLE_DIF = 0.0000001

function random(min, max, decimals=0) {
    return +(Math.random()*(max-min)+min).toFixed(decimals)
}

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

Array.prototype.last=function(index=0){return this[this.length-1-index]}
Array.prototype.addAt=function(el, index=0){return this.slice(0,index).concat(...[el, this.slice(index, this.length)])}

function getDist(x1, y1, x2, y2) {
    return Math.sqrt((x1-x2)**2 + (y1-y2)**2)
}

/**
 * Returns the interpolated number between (max) and (max-range) 
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

function formatColor(rgba) {
    return `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3]})`
}

function toRad(deg) {
    return deg*(Math.PI/180)
}

function toDeg(rad) {
    return rad/(Math.PI/180)
}

function getAcceptableDif(n, okDif) {
    return Math.round(n)-n <= okDif ? Math.round(n) : n
}

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

    static drawDotConnections(dot, rgba=[255,255,255,1], isSourceOver=false) {
        let ctx = dot.ctx
        if (!isSourceOver) ctx.globalCompositeOperation = "destination-over"
        if (dot.connections.length) dot.connections.forEach(c=>{
             ctx.strokeStyle = formatColor(rgba)
             ctx.beginPath()
             ctx.moveTo(dot.x, dot.y)
             ctx.lineTo(c.x, c.y)
             ctx.stroke()
         })
         if (!isSourceOver) ctx.globalCompositeOperation = "source-over"
    }
    
    static drawOuterRing(dot, rgba=[255,255,255,1], multiplier) {
        let ctx = dot.ctx
        ctx.strokeStyle = formatColor(rgba)
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.radius*multiplier, 0, CIRC)
        ctx.stroke()
    }
    
    static drawConnections(dot, rgba=[255,255,255,1], sourcePos) {
        let ctx = dot.ctx
        ctx.strokeStyle = formatColor(rgba)
        ctx.beginPath()
        ctx.moveTo(sourcePos[0], sourcePos[1])
        ctx.lineTo(dot.x, dot.y)
        ctx.stroke()
    }
}