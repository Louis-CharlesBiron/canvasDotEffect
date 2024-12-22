// JS
// Canvas Dot Effects by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

class Dot extends Obj {
    constructor(pos, radius, rgba, setupCB) {
        super(pos, radius, rgba, setupCB)
        this._parent = null
        this._connections = []    
    }

    draw(ctx, time) {
        ctx.fillStyle = formatColor(this._rgba||DEFAULT_RGBA)
        ctx.beginPath()
        ctx.arc(this.x, this.y, this._radius??DEFAULT_RADIUS, 0, CIRC)
        ctx.fill()

        if (typeof this.drawEffectCB == "function") {
            let dist = this.getDistance(), rawRatio = this.getRatio(dist)
            this.drawEffectCB(ctx, this, Math.min(1, rawRatio), this.cvs.mouse, dist, rawRatio)
        }

        super.draw(ctx, time)
    }

    getDistance(fx,fy) {
        return getDist(fx??this.ratioPos[0], fy??this.ratioPos[1], this.x, this.y)
    }

    getRatio(dist) {
        return dist / this.limit
    }

    addConnection(dot) {
        if (typeof dot == "object") this._connections.push(dot)
    }

    removeConnection(dotId) {
        this._connections = this._connections.filter(d=>typeof dotId=="number"?d.id!==dotId:d.id!==dotId.id)
    }

    addForce(force, dir, time=1000, easing=Anim.easeInOutQuad) {
        let rDir = toRad(dir), ix = this.x, iy = this.y,
            dx = getAcceptableDif(force*Math.cos(rDir), ACCEPTABLE_DIF),
            dy = getAcceptableDif(force*Math.sin(rDir), ACCEPTABLE_DIF)
        
        return this.queueAnim(new Anim((prog)=>{
            this.x = ix+dx*prog
            this.y = iy-dy*prog
        }, time, easing, ()=>this._anims.shift()), true)
    }

    follow(duration, easing, action, ...progressSeparations) {
        let [ix, iy] = this._pos
        this.queueAnim(new Anim((prog)=>{
            let fn = Object.entries(progressSeparations.reduce((a,b)=>Object.keys(b)[0]>prog?a:b))[0], [nx, ny] = fn[1](prog, prog-fn[0], this, ix, iy)
            this.x = ix+nx
            this.y = iy+ny
            if (typeof action == "function") action(prog, this)
        }, duration, easing))

    }

    remove() {
        this._parent.remove(this._id)
    }

    get cvs() {return this._parent?.cvs}
    get ctx() {return this._parent?.cvs.ctx}
    get limit() {return this._parent?.limit}
    get drawEffectCB() {return this._parent?.drawEffectCB}
    get parent() {return this._parent}
    get ratioPos() {return this._parent?.ratioPos}

    get connections() {return this._connections}

    set limit(limit) {this._limit = limit}
    set parent(p) {this._parent = p}
    set connections(c) {return this._connections = c}
}