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
        this._initColor = color                   // declaration color value
        this._color = this._initColor             // the current color or gradient of the filled shape
        this._setupCB = setupCB                   // called on object's initialization (this, this.parent)=>
        this._anims = {backlog:[], currents:[]}    // all "currents" animations playing are playing simultaneously, the backlog animations run in a queue, one at a time
    }

    // Runs when the object gets added to a canvas instance
    initialize() {
        if (typeof this._initColor=="function") this.color = this._initColor(this.ctx??this.parent.ctx, this.parent||this)
        else if (this._initColor) this.color = this._initColor
        this.moveAtInitPos()
        if (typeof this._setupCB == "function") this._setupCB(this, this?.parent)
    }

    // sets the current pos to the value of the inital pos
    moveAtInitPos() {
        if (typeof this._initPos=="function") this._pos = [...this._initPos(this._cvs, this?.parent??this)]
        else this._pos = [...this._initPos]
    }

    // Runs every frame
    draw(ctx, time) {
        let anims = this._anims.currents
        if (this._anims.backlog[0]) anims = [...anims, this._anims.backlog[0]]
        let a_ll = anims.length
        for (let i=0;i<a_ll;i++) anims[i].getFrame(time)
    }

    // returns whether the provided pos is inside the obj
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
    moveTo(pos, time=1000, easing=Anim.easeInOutQuad, initPos=[this.x, this.y], isUnique=true, force=true) {
        let [ix, iy] = initPos, 
            [fx, fy] = this.adjustInputPos(pos),
            dx = fx-ix,
            dy = fy-iy

        return this.playAnim(new Anim((prog)=>{
            this.x = ix+dx*prog
            this.y = iy+dy*prog
        }, time, easing), isUnique, force)
    }

    // moves the obj in specified direction at specified distance(force)
    addForce(force, dir, time=1000, easing=Anim.easeInOutQuad, isUnique=true, animForce=true) {
        let rDir = CDEUtils.toRad(dir), ix = this.x, iy = this.y,
            dx = CDEUtils.getAcceptableDif(force*Math.cos(rDir), CDEUtils.ACCEPTABLE_DIF),
            dy = CDEUtils.getAcceptableDif(force*Math.sin(rDir), CDEUtils.ACCEPTABLE_DIF)
        
        return this.playAnim(new Anim(prog=>{
            this.x = ix+dx*prog
            this.y = iy-dy*prog
        }, time, easing), isUnique, animForce)
    }

    // adds an animation to play. "isUnique" makes it so the animation gets queue in the backlog. "force" terminates the current backlog animation and replaces it with the specified "anim"
    playAnim(anim, isUnique, force) {
        if (isUnique && this.currentBacklogAnim && force) { // TOFIX
            this.currentBacklogAnim.end()
            this._anims.backlog.addAt(anim, 0)
        }
        let initEndCB = anim.endCallback
        anim.endCallback=()=>{
            if (isUnique) this._anims.backlog.shift()
            else this._anims.currents = this._anims.currents.filter(a=>a.id!==anim.id)
            
            if (typeof initEndCB=="function") initEndCB()
        }
        this._anims[isUnique?"backlog":"currents"].push(anim)
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
    get currentBacklogAnim() {return this._anims.backlog[0]}
    get anims() {return this._anims}
    get setupCB() {return this._setupCB}
    get colorObject() {return this._color}
    get colorRaw() {return this._color.colorRaw}
    get color() {return this._color.color}
    get initColor() {return this._initColor}
    get r() {return this.colorObject.r}
    get g() {return this.colorObject.g}
    get b() {return this.colorObject.b}
    get a() {return this.colorObject.a}

    set x(x) {this._pos[0] = x}
    set y(y) {this._pos[1] = y}
    set pos(pos) {this._pos = pos}
    set radius(radius) {this._radius = radius}
    set color(color) {if (this._color?.colorRaw?.toString() != color?.toString() || !this._color) this._color = Color.adjust(color)}
    set setupCB(cb) {this._setupCB = cb}
    set r(r) {this.colorObject.r = r}
    set g(g) {this.colorObject.g = g}
    set b(b) {this.colorObject.b = b}
    set a(a) {this.colorObject.a = a}
    
}