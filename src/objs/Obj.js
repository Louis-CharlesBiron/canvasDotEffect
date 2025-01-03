// Abstract canvas obj class
class Obj {

    constructor(pos, radius, rgba, setupCB) {
        this._id = idGiver++                  // canvas obj id
        this._initPos = pos||DEFAULT_POS      // initial position : [x,y] || (Canvas)=>{return [x,y]}
        this._pos = this._initPos             // current position from the center of the object : [x,y]
        this._radius = radius??DEFAULT_RADIUS // object's radius
        this._rgba = rgba||DEFAULT_RGBA       // object's rgba
        this._setupCB = setupCB               // called on object's initialization (this, this.parent)=>
        this._anims = []                      // backlogs of animations to play
    }

    // Runs when the object gets added to a canvas instance
    initialize() {
        if (typeof this._initPos=="function") this._pos = this._initPos(this._cvs, this?.parent??this?.dots)
        if (typeof this._setupCB == "function") this._setupCB(this, this?.parent)
    }

    // Runs every frame
    draw(ctx, time) {
        if (this._anims[0]) this._anims[0].getFrame(time)
    }

    // (bool) returns whether the provided pos is inside the obj
    isWithin(pos, circularDetection) {
        let [x,y]=pos
        return circularDetection ? getDist(x, y, this.x, this.y) <= this.radius*(+circularDetection==1?1.025:+circularDetection) : x >= this.left && x <= this.right && y >= this.top && y <= this.bottom
    }

    // Returns the [top, right, bottom, left] distances between the canvas limits, according to the object's size
    posDistances(pos=this._pos) {
        let [x,y]=pos, cw=this._cvs.width, ch=this._cvs.height
        return [y-this.height/2, cw-(x+this.width/2), ch-(y+this.height/2), x-this.width/2]
    }

    // Teleports to given coords
    moveAt(pos) {
        if (pos[0] !== null) this.x = pos[0]
        if (pos[1] !== null) this.y = pos[1]
    }

    // Teleports to incremented coords
    moveBy(pos) {
        if (pos[0] !== null) this.x += pos[0]
        if (pos[1] !== null) this.y += pos[1]
    }

    // Smoothly moves to coords in set time
    moveTo(pos, time=1000, easing=Anim.easeInOutQuad, force=true, initPos=[this.x, this.y]) {
        let [ix, iy] = initPos,
        dx = pos[0]-ix,
        dy = pos[1]-iy

        return this.queueAnim(new Anim((prog)=>{
            this.x = ix+dx*prog
            this.y = iy+dy*prog
        }, time, easing, ()=>this._anims.shift()), force)
    }

    // moves the obj in specified direction at specified distance(force)
    addForce(force, dir, time=1000, easing=Anim.easeInOutQuad) {
        let rDir = toRad(dir), ix = this.x, iy = this.y,
            dx = getAcceptableDif(force*Math.cos(rDir), ACCEPTABLE_DIF),
            dy = getAcceptableDif(force*Math.sin(rDir), ACCEPTABLE_DIF)
        
        return this.queueAnim(new Anim((prog)=>{
            this.x = ix+dx*prog
            this.y = iy-dy*prog
        }, time, easing, ()=>this._anims.shift()), true)
    }

    // adds an animation to the end of the backlog
    queueAnim(anim, force) {
    if (this.currentAnim && force) {
            this.currentAnim.end()
            this._anims.addAt(anim, 1)
        }
        if (!anim.endCallback) anim.endCallback=()=>this._anims.shift()
        this._anims.push(anim)
        return anim
    }

	get id() {return this._id}
    get x() {return this._pos[0]}
    get y() {return this._pos[1]}
    get radius() {return this._radius}
    get top() {return this.y-this._radius}
    get bottom() {return this.y+this._radius}
    get right() {return this.x+this._radius}
    get left() {return this.x-this._radius}
    get pos() {return this._pos}
    get pos_() {return [...this._pos]} // static position
    get stringPos() {return this.x+","+this.y}
	get initPos() {return this._initPos}
    get width() {return this._radius*2}
    get height() {return this._radius*2}
    get currentAnim() {return this._anims[0]}
    get rgba() {return this._rgba}
    get r() {return this._rgba[0]}
    get g() {return this._rgba[1]}
    get b() {return this._rgba[2]}
    get a() {return this._rgba[3]}
    get anims() {return this._anims}
    get currentAnim() {return this._anims[0]}
    get setupCB() {return this._setupCB}

    set x(x) {this._pos[0] = x}
    set y(y) {this._pos[1] = y}
    set pos(pos) {this._pos = pos}
    set radius(radius) {this._radius = radius}
    set r(r) {this._rgba[0] = r}
    set g(g) {this._rgba[1] = g}
    set b(b) {this._rgba[2] = b}
    set a(a) {this._rgba[3] = a}
    set rgba(rgba) {this._rgba = rgba}
    set setupCB(cb) {this._setupCB = cb}
}