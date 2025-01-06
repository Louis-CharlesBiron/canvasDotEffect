// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Abstract canvas obj class
class Obj {
    static DEFAULT_POS = [0,0]
    static DEFAULT_RADIUS = 5

    constructor(pos, radius, color, setupCB) {
        this._id = Canvas.ELEMENT_ID_GIVER++      // canvas obj id
        this._initPos = pos||Obj.DEFAULT_POS      // initial position : [x,y] || (Canvas)=>{return [x,y]}
        this._pos = this._initPos                 // current position from the center of the object : [x,y]
        this._radius = radius??Obj.DEFAULT_RADIUS // object's radius
        this._color = new Color(color)            // object's color value
        this._setupCB = setupCB                   // called on object's initialization (this, this.parent)=>
        this._anims = []                          // backlogs of animations to play
    }

    // Runs when the object gets added to a canvas instance
    initialize() {
        this.moveAtInitPos()
        if (typeof this._setupCB == "function") this._setupCB(this, this?.parent)
    }

    // sets the current pos to the value of the inital pos
    moveAtInitPos() {
        if (typeof this._initPos=="function") this._pos = [...this._initPos(this._cvs, this?.parent??this?.dots)]
        else this._pos = [...this._initPos]
    }

    // Runs every frame
    draw(ctx, time) {
        if (this._anims[0]) this._anims[0].getFrame(time)
    }

    // (bool) returns whether the provided pos is inside the obj
    isWithin(pos, circularDetection) {
        let [x,y]=pos
        return circularDetection ? CDEUtils.getDist(x, y, this.x, this.y) <= this.radius*(+circularDetection==1?1.025:+circularDetection) : x >= this.left && x <= this.right && y >= this.top && y <= this.bottom
    }

    // Returns the [top, right, bottom, left] distances between the canvas limits, according to the object's size
    posDistances(pos=this._pos) {
        let [x,y]=pos, cw=this._cvs.width, ch=this._cvs.height
        return [y-this.height/2, cw-(x+this.width/2), ch-(y+this.height/2), x-this.width/2]
    }

    // Teleports to given coords
    moveAt(pos) {
        let [x, y] = pos
        if (x !== null && x !== undefined) this.x = x
        if (y !== null && y !== undefined) this.y = y
    }

    // Teleports to incremented coords
    moveBy(pos) {
        let [x, y] = pos
        if (x !== null && x !== undefined) this.x += x
        if (y !== null && y !== undefined) this.y += y
    }

    // Smoothly moves to coords in set time
    moveTo(pos, time=1000, easing=Anim.easeInOutQuad, force=true, initPos=[this.x, this.y]) {
        let [ix, iy] = initPos, 
            [fx, fy] = this.adjustInputPos(pos),
            dx = fx-ix,
            dy = fy-iy

        return this.queueAnim(new Anim((prog)=>{
            this.x = ix+dx*prog
            this.y = iy+dy*prog
        }, time, easing), force)
    }

    // moves the obj in specified direction at specified distance(force)
    addForce(force, dir, time=1000, easing=Anim.easeInOutQuad) {
        let rDir = CDEUtils.toRad(dir), ix = this.x, iy = this.y,
            dx = CDEUtils.getAcceptableDif(force*Math.cos(rDir), CDEUtils.ACCEPTABLE_DIF),
            dy = CDEUtils.getAcceptableDif(force*Math.sin(rDir), CDEUtils.ACCEPTABLE_DIF)
        
        return this.queueAnim(new Anim((prog)=>{
            this.x = ix+dx*prog
            this.y = iy-dy*prog
        }, time, easing), true)
    }

    // adds an animation to the end of the backlog
    queueAnim(anim, force) {
    if (this.currentAnim && force) {
            this.currentAnim.end()
            this._anims.addAt(anim, 1)
        }
        let initEndCB = anim.endCallback
        anim.endCallback=()=>{
            this._anims.shift()
            if (typeof initEndCB=="function") initEndCB()
        }
        this._anims.push(anim)
        return anim
    }

    // allows flexible pos declarations
    adjustInputPos(pos) {
        let [x, y] = pos
        if (x === null || x === undefined) x = this.x
        if (y === null || y === undefined) y = this.y
        return [x, y]
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
    get colorObject() {return this._color}
    get color() {return this._color.color}
    get color_() {return this._color.color} // COLOR TODO (prop put in filledShape?)
    get anims() {return this._anims}
    get currentAnim() {return this._anims[0]}
    get setupCB() {return this._setupCB}

    set x(x) {this._pos[0] = x}
    set y(y) {this._pos[1] = y}
    set pos(pos) {this._pos = pos}
    set radius(radius) {this._radius = radius}
    set color(color) {
        return new Color()// TODO COLOR
    }
    set setupCB(cb) {this._setupCB = cb}
}