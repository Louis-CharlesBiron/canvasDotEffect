// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Abstract canvas obj class
class Obj {
    static DEFAULT_POS = [0,0]
    static DEFAULT_RADIUS = 5
    static ABSOLUTE_ANCHOR = "ABSOLUTE_ANCHOR"

    #lastAnchorPos = [0,0]
    constructor(pos, radius, color, setupCB, anchorPos, alwaysActive) {
        this._id = Canvas.ELEMENT_ID_GIVER++     // canvas obj id
        this._initPos = pos                      // initial position : [x,y] || (Canvas)=>{return [x,y]}
        this._pos = [0,0]                        // current position from the center of the object : [x,y]
        this._initRadius = radius                // initial object's radius
        this._radius = this._initRadius          // current object's radius
        this._initColor = color                  // declaration color value || (ctx, this)=>{return color value}
        this._color = this._initColor            // the current color or gradient of the filled shape
        this._setupCB = setupCB                  // called on object's initialization (this, this.parent)=>
        this._anchorPos = anchorPos              // current reference point from which the object's pos will be set
        
        this._alwaysActive = alwaysActive??null  // whether the object stays active when outside the canvas bounds
        this._anims = {backlog:[], currents:[]}  // all "currents" animations playing are playing simultaneously, the backlog animations run in a queue, one at a time
        this._initialized = false                // whether the shape has been initialized yet
    }

    // Runs when the object gets added to a canvas instance
    initialize() {
        this._pos = this.getInitPos()||Obj.DEFAULT_POS
        this._radius = this.getInitRadius()??Obj.DEFAULT_RADIUS
        this.color = this.getInitColor()
        if (typeof this._setupCB == "function") this._setupCB(this, this.parent)
        this._initialized = true
    }

    // returns the value of the inital color declaration
    getInitColor() {
        return typeof this._initColor=="function" ? this._initColor(this.ctx??this.parent.ctx, this) : this._initColor
    }

    // returns the value of the inital radius declaration
    getInitRadius() {
        return typeof this._initRadius=="function" ? this._initRadius(this) : this._initRadius
    }

    // returns the value of the inital pos declaration
    getInitPos() {
        return typeof this._initPos=="function" ? [...this._initPos(this._cvs??this.parent, this.parent??this)] : [...this._initPos]
    }

    // Runs every frame
    draw(ctx, time) {
        let anims = this._anims.currents
        if (this._anims.backlog[0]) anims = [...anims, this._anims.backlog[0]]
        let a_ll = anims.length
        for (let i=0;i<a_ll;i++) anims[i].getFrame(time)
    }

    // returns whether the provided pos is inside the obj (if "circularDetection" is a number, it acts as a multiplier of the dot's radius)
    isWithin(pos, circularDetection) {
        let [x,y]=pos
        return  (x!=null&&y!=null) && (circularDetection ? CDEUtils.getDist(x, y, this.x, this.y) <= this.radius*(+circularDetection==1?1.025:+circularDetection) : x >= this.left && x <= this.right && y >= this.top && y <= this.bottom)
    }

    // Returns the [top, right, bottom, left] distances between the canvas borders, according to the object's size
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
            [fx, fy] = this.adjustPos(pos),
            dx = fx-ix,
            dy = fy-iy

        return this.playAnim(new Anim((prog)=>{
            this.x = ix+dx*prog
            this.y = iy+dy*prog
        }, time, easing), isUnique, force)
    }

    /**
    * Used to make the dot follow a custom path
    * @param {Number} duration: duration of the animation in ms
    * @param {Function} easing: easing function 
    * @param {Function?} action: custom callback that can be called in addition to the movement                                                        //newProg is 'prog' - the progress delimeter of the range
    * @param {...Array[Number, Function]} progressSeparations: list of callback paired with a progress range, the callback must return a position (prog, newProg, initX, initY)=>return [x,y]
    * progressSeparations example: [0:(prog)=>[x1, y1]], [0.5:(prog, fprog)=>[x2, y2]] -> from 0% to 49% the pos from 1st callback is applied, from 50%-100% the pos from 2nd callback is applied  
    */
    follow(duration, easing, action, ...progressSeparations) {
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
            if (typeof action == "function") action(prog, this)
        }, duration, easing))
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
    adjustPos(pos) {
        let [x, y] = pos
        if (x === null || x === undefined) x = this.x
        if (y === null || y === undefined) y = this.y
        return [x, y]
    }

	get id() {return this._id}
    get x() {return this._pos[0]}
    get y() {return this._pos[1]}
    get pos() {return this._pos}
    get pos_() {return [...this._pos]} // static position
    get relativeX() {return this.x-this.anchorPos[0]}
    get relativeY() {return this.y-this.anchorPos[1]}
    get relativePos() {return [this.relativeX, this.relativeY]}
    get radius() {return this._radius}
    get top() {return this.y-this._radius}
    get bottom() {return this.y+this._radius}
    get right() {return this.x+this._radius}
    get left() {return this.x-this._radius}
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
    get initRadius() {return this._initRadius}
    get rgba() {return this.colorObject.rgba}
    get r() {return this.colorObject.r}
    get g() {return this.colorObject.g}
    get b() {return this.colorObject.b}
    get a() {return this.colorObject.a}
    get hsv() {return this.colorObject.hsv}
    get hue() {return this.colorObject.hue}
    get saturation() {return this.colorObject.saturation}
    get brightness() {return this.colorObject.brightness}
    get initialized() {return this._initialized}
    get alwaysActive() {return this._alwaysActive}
    get anchorPosRaw() {return this._anchorPos}
    get hasDynamicAnchorPos() {return Boolean(this._anchorPos instanceof Obj||typeof this._anchorPos=="function")}
    get anchorPos() {// returns the anchorPos value
        if (!this._anchorPos) return (this._cvs||this.parent instanceof Canvas) ? [0,0] : this.parent.pos_
        else if (this._anchorPos instanceof Obj) return this._anchorPos.pos_
        else if (this._anchorPos==Obj.ABSOLUTE_ANCHOR) return [0,0]
        else if (typeof this._anchorPos=="function") return [...this._anchorPos(this, this._cvs??this.parent)]
        else return this._anchorPos
    }
    get lastAnchorPos() {return this.#lastAnchorPos}

    set x(x) {this._pos[0] = x}
    set y(y) {this._pos[1] = y}
    set pos(pos) {this._pos = pos}
    set relativeX(x) {this._pos[0] = this.anchorPos[0]+x}
    set relativeY(y) {this._pos[1] = this.anchorPos[1]+y}
    set relativePos(pos) {
        this.relativeX = pos[0]
        this.relativeY = pos[1]
    }
    set radius(radius) {this._radius = radius<0?0:radius}
    set color(color) {
        if (this._color?.colorRaw?.toString() != color?.toString() || !this._color) {
            let potentialGradient = color?.colorRaw||color
            if (potentialGradient?.positions==Gradient.PLACEHOLDER) {
                color = potentialGradient.duplicate()
                color.initPositions = this
            }
            this._color = Color.adjust(color)
        }
    }
    set setupCB(cb) {this._setupCB = cb}
    set r(r) {this.colorObject.r = r}
    set g(g) {this.colorObject.g = g}
    set b(b) {this.colorObject.b = b}
    set a(a) {this.colorObject.a = a}
    set hue(hue) {this.colorObject.hue = hue}
    set saturation(saturation) {this.colorObject.saturation = saturation}
    set brightness(brightness) {this.colorObject.brightness = brightness}
    set initPos(initPos) {this._initPos = initPos}
    set initRadius(initRadius) {this._initRadius = initRadius}
    set initColor(initColor) {this._initColor = initColor}
    set initialized(init) {this._initialized = init}
    set alwaysActive(alwaysActive) {this._alwaysActive = alwaysActive}
    set anchorPos(anchorPos) {this.anchorPosRaw = anchorPos}
    set anchorPosRaw(anchorPos) {
        this._anchorPos = anchorPos
    }
    set lastAnchorPos(l) {this.#lastAnchorPos = l}
    
}