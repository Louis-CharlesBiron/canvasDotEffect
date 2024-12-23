// JS
// Canvas Dot Effects by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

class Shape extends Obj {
    constructor(pos, dots, radius, rgba, limit, drawEffectCB, ratioPosCB, setupCB, fragile) {
        super(pos, radius, rgba, setupCB)
        this._cvs = null                        // C
        this._limit = limit||100                // dots' limit
        this._initDots = dots                   // initial dots declaration
        this._dots = []                         // current dots
        this._ratioPos = [Infinity,Infinity]    // position of ratio target object 
        this._drawEffectCB = drawEffectCB       // (ctx, Dot, ratio, mouse, distance, rawRatio)=>
        this._ratioPosCB = ratioPosCB           // custom ratio pos target (Shape, dots)=>
        this._fragile = fragile||false          // whether the shape resets on document visibility change 
    }

    initialize() {
        if (typeof this._initDots == "string") this.createFromString(this._initDots)
        else if (typeof this._initDots == "function") this._initDots(this, this._cvs, this._pos)
        else if (this._initDots?.length) this.add(this._initDots)
        
        super.initialize()

        this._dots.forEach(d=>d.initialize())
    }

    draw(ctx, time) {
        super.draw(ctx, time)
        if (typeof this._ratioPosCB == "function") this._ratioPos = this._ratioPosCB(this)
    }

    add(dot) {
        this._dots.push(...[dot].flat().map(x=>{
            x.rgba = [...this._rgba]
            x.radius ??= this._radius
            x.parent = this
            return x
        }))
    }

    remove(id) {
        this._dots = this._dots.filter(x=>x!==id)
    }

    createFromString(str, topLeftPos=[0,0], gaps=[25, 25], dotChar="o") {//
        let dots = []
        str.split("\n").filter(x=>x).forEach((x,i)=>{
            let [atX, atY] = topLeftPos
            atY+=i*gaps[1]
            ;[...x].forEach(c=>{
                if (c==dotChar) dots.push(new Dot(atX+gaps[0]/2, atY+gaps[1]/2))
                atX+=gaps[0]
            })
        })
        return dots
    }

    setRadius(radius) {
        this._radius = radius
        this._dots.forEach(x=>x.radius=radius)
    }

    setRGBA(rgba) {
        this._rgba = rgba
        this._dots.forEach(x=>x.rgba=rgba)
    }

    setLimit(limit) {
        this._limit = limit
        this._dots.forEach(x=>x.limit=limit)
    }

    moveBy(pos) {
        super.moveBy(pos)
        this._dots.forEach(dot=>{
            if (pos[0] !== null) dot.x += pos[0]
            if (pos[1] !== null) dot.y += pos[1]
        })
    }

    moveAt(pos) {
        const dx = pos[0]-this.x, dy = pos[1]-this.y
        this._dots.forEach(d=>{
            if (dx) d.x += dx
            if (dy) d.y += dy
        })
        super.moveAt(pos)
    }

    addForce(force, dir, time=1000, easing=Anim.easeInOutQuad) {
        let rDir = toRad(dir), ix = this.x, iy = this.y,
            dx = getAcceptableDif(force*Math.cos(rDir), ACCEPTABLE_DIF),
            dy = getAcceptableDif(force*Math.sin(rDir), ACCEPTABLE_DIF)
        
        return this.queueAnim(new Anim((prog)=>{
            this.moveAt([ix+dx*prog, iy-dy*prog])
        }, time, easing, ()=>this._anims.shift()), true)
    }

    scale(scale, dotRelative) {// to fix
        //let distX = (this._pos[0]-this._dots[0].x)*(scale[0]??scale), distY = (this._pos[1]-this._dots[0].y)*(scale[1]??scale)
        //this._dots.forEach(d=>{
        //    if (dotRelative) {
        //        d.x = d.x * (scale[0]??scale)-(d.x-this._pos[0])
        //        d.y = d.y * (scale[1]??scale)-(d.y-this._pos[1])
        //    } else {
        //        d.x = d.initPos[0]*(scale[0]??scale)
        //        d.y = d.initPos[1]*(scale[1]??scale)
        //    }
        //})
    }

    clear() {
        this._dots = []
    }

    reset() {
        if (this._initDots) {
            this.clear()
            this.initialize()
        }
    }

    asSource() {
        return {[Shape.childrenPath]:this}
    }

    static asSource(shape) {
        return {[Shape.childrenPath]:shape}
    }

    get cvs() {return this._cvs}
    get ctx() {return this._cvs.ctx}
    get dots() {return this._dots}
    get limit() {return this._limit}
	get initDots() {return this._initDots}
    get drawEffectCB() {return this._drawEffectCB}
    get ratioPos() {return this._ratioPos}
    get ratioPosCB() {return this._ratioPosCB}
    static get childrenPath() {return "dots"}

    set cvs(cvs) {this._cvs = cvs}
    set ratioPos(ratioPos) {this._ratioPos = ratioPos}
    set drawEffectCB(cb) {this._drawEffectCB = cb}
    set ratioPosCB(cb) {this._ratioPosCB = cb}
}