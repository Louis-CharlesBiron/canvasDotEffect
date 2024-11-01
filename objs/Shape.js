// JS
// Canvas Dot Effects by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

class Shape {
    constructor(pos, dots, radius, rgba, limit, drawEffectCB, ratioPosCB, setupCB, fragile) {
        this._cvs
        this._id = idGiver++
        this._initPos = pos || [0,0]            // initial shape center pos declaration / setup
        this._pos = this._initPos               // current shape center pos
        this._radius = radius??DEFAULT_RADIUS   // dots' radius
        this._rgba = rgba||DEFAULT_RGBA         // dots' rgba
        this._limit = limit||100                // dots' limit
        this._initDots = dots                   // initial dots declaration
        this._dots = []                         // current dots
        this._ratioPos = [Infinity,Infinity]    // position of ratio target object 
        this._drawEffectCB = drawEffectCB       // (ctx, Dot, ratio, mouse, distance, rawRatio)=>
        this._ratioPosCB = ratioPosCB           // custom ratio pos target (Shape, dots)=>
        this._setupCB = setupCB                 // custom ratio pos target (Shape, dots)=>
        this._fragile = fragile||false          // whether the shape resets on document visibility change 
    }

    initialize() {
        if (typeof this._initDots == "string") this.createFromString(this._initDots)
        else if (typeof this._initDots == "function") this._initDots(this, this._cvs, this._pos)
        else if (this._initDots?.length) this.add(this._initDots)
        
        if (typeof this._initPos == "function") this._pos = this._initPos(this, this._dots)

        if (typeof this._setupCB == "function") this._setupCB(this)
        
        this._dots.forEach(d=>d.initialize())
    }

    draw() {
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
            atY+=i*gaps[1];
            [...x].forEach(c=>{
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

    moveBy(x, y) {// to fix
        this._dots.forEach(d=>{
            if (x) d.x += x
            if (y) d.y += y
        })
    }

    move(x, y) {
        this._dots.forEach(d=>{
            if (x && x!==this._pos[0]) d.x += x-this._pos[0]
            if (y && y!==this._pos[1]) d.y += y-this._pos[1]
        })
        this._pos = [x??this._pos[0], y??this._pos[1]]
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
    get id() {return this._id}
	get pos() {return this._pos}
    get x() {return this._pos[0]}
    get y() {return this._pos[1]}
    get dots() {return this._dots}
    get rgba() {return this._rgba}
    get radius() {return this._radius}
    get limit() {return this._limit}
	get initDots() {return this._initDots}
    get r() {return this._rgba[0]}
    get g() {return this._rgba[1]}
    get b() {return this._rgba[2]}
    get a() {return this._rgba[3]}
    get drawEffectCB() {return this._drawEffectCB}
    get ratioPos() {return this._ratioPos}
    static get childrenPath() {return "dots"}
    get ratioPosCB() {return this._ratioPosCB}
    get setupCB() {return this._setupCB}

    set cvs(cvs) {this._cvs = cvs}
	set pos(_pos) {return this._pos = _pos}
    set ratioPos(ratioPos) {this._ratioPos = ratioPos}
    set drawEffectCB(cb) {this._drawEffectCB = cb}
    set ratioPosCB(cb) {this._ratioPosCB = cb}
    set setupCB(cb) {this._setupCB = cb}
}