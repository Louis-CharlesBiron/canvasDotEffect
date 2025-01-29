// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Abstract canvas obj class
class Obj extends _HasColor {
    static DEFAULT_POS = [0,0]
    static DEFAULT_RADIUS = 5
    static ABSOLUTE_ANCHOR = "ABSOLUTE_ANCHOR"

    #lastAnchorPos = [0,0]
    constructor(pos, radius, color, setupCB, anchorPos, alwaysActive) {
        super(color)
        this._id = Canvas.ELEMENT_ID_GIVER++     // canvas obj id
        this._initPos = pos||[0,0]               // initial position : [x,y] || (Canvas)=>{return [x,y]}
        this._pos = [0,0]                        // current position from the center of the object : [x,y]
        this._initRadius = radius                // initial object's radius
        this._radius = this._initRadius          // current object's radius
        this._setupCB = setupCB                  // called on object's initialization (this, this.parent)=>
        this._setupResults = null                // return value of the setupCB call
        this._anchorPos = anchorPos              // current reference point from which the object's pos will be set
        
        this._alwaysActive = alwaysActive??null  // whether the object stays active when outside the canvas bounds
        this._anims = {backlog:[], currents:[]}  // all "currents" animations playing are playing simultaneously, the backlog animations run in a queue, one at a time
        this._initialized = false                // whether the object has been initialized yet
    }

    // Runs when the object gets added to a canvas instance
    initialize() {
        this._pos = this.getInitPos()||Obj.DEFAULT_POS
        this._radius = this.getInitRadius()??Obj.DEFAULT_RADIUS
        this.color = this.getInitColor()
        this.setAnchoredPos()
        if (CDEUtils.isFunction(this._setupCB)) this._setupResults = this._setupCB(this, this.parent)
    }

    // returns the value of the inital color declaration
    getInitColor() {
        return CDEUtils.isFunction(this._initColor) ? this._initColor(this.ctx??this.parent.ctx, this) : this._initColor||null
    }

    // returns the value of the inital radius declaration
    getInitRadius() {
        return CDEUtils.isFunction(this._initRadius) ? this._initRadius(this.parent||this, this) : this._initRadius??null
    }

    // returns the value of the inital pos declaration
    getInitPos() {
        return CDEUtils.isFunction(this._initPos) ? [...this._initPos(this._cvs??this.parent, this)] : [...this.adjustPos(this._initPos)]
    }

    setAnchoredPos() {
        if (this.hasAnchorPosChanged) {
            const anchorPos = this.anchorPos
            this.relativeX += anchorPos[0]-this.lastAnchorPos[0]
            this.relativeY += anchorPos[1]-this.lastAnchorPos[1]
            this.lastAnchorPos = anchorPos
        }
    }

    // Runs every frame
    draw(ctx, time, deltaTime) {
        // update pos according to anchor pos
        this.setAnchoredPos()

        // run anims
        let anims = this._anims.currents
        if (this._anims.backlog[0]) anims = [...anims, this._anims.backlog[0]]
        const a_ll = anims.length
        if (a_ll) for (let i=0;i<a_ll;i++) anims[i].getFrame(time, deltaTime)
    }

    // returns whether the provided pos is inside the obj (if "circularDetection" is a number, it acts as a multiplier of the dot's radius)
    isWithin(pos, circularDetection) {
        const [x,y]=pos
        return  (CDEUtils.isDefined(x)&&CDEUtils.isDefined(y)) && (circularDetection ? CDEUtils.getDist(x, y, this.x, this.y) <= this.radius*(+circularDetection===1?1.025:+circularDetection) : x >= this.left && x <= this.right && y >= this.top && y <= this.bottom)
    }

    // Returns the [top, right, bottom, left] distances between the canvas borders, according to the object's size
    posDistances(pos=this._pos) {
        const [x,y]=pos, cw=this._cvs.width, ch=this._cvs.height
        return [y-this.height/2, cw-(x+this.width/2), ch-(y+this.height/2), x-this.width/2]
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
    moveTo(pos, time=1000, easing=Anim.easeInOutQuad, initPos=[this.x, this.y], isUnique=true, force=true) {
        const [ix, iy] = initPos, 
            [fx, fy] = this.adjustPos(pos),
            dx = fx-ix,
            dy = fy-iy

        return this.playAnim(new Anim((prog)=>{
            this.x = ix+dx*prog
            this.y = iy+dy*prog
        }, time, easing), isUnique, force)
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
            this._anims.backlog.addAt(anim, 0)
        }
        const initEndCB = anim.endCallback
        anim.endCallback=()=>{
            if (isUnique) this._anims.backlog.shift()
            else this._anims.currents = this._anims.currents.filter(a=>a.id!==anim.id)
            
            if (CDEUtils.isFunction(initEndCB)) initEndCB()
        }
        this._anims[isUnique?"backlog":"currents"].push(anim)
        return anim
    }

    // allows flexible pos declarations
    adjustPos(pos) {
        let [x, y] = pos
        if (!CDEUtils.isDefined(x)) x = this.x??0
        if (!CDEUtils.isDefined(y)) y = this.y??0
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
    get initRadius() {return this._initRadius}
    get setupResults() {return this._setupResults}
    get initialized() {return this._initialized}
    get alwaysActive() {return this._alwaysActive}
    get anchorPosRaw() {return this._anchorPos}
    get anchorPos() {// returns the anchorPos value
        if (!this._anchorPos) return (this._cvs||this.parent instanceof Canvas) ? [0,0] : this.parent?.pos_
        else if (this._anchorPos instanceof Obj) return this._anchorPos.pos_
        else if (this._anchorPos===Obj.ABSOLUTE_ANCHOR) return [0,0]
        else if (CDEUtils.isFunction(this._anchorPos)) {
            const res = this._anchorPos(this, this._cvs??this.parent)
            return [...(res?.pos_||res||[0,0])]
        }
        else return this._anchorPos
    }
    get lastAnchorPos() {return this.#lastAnchorPos}
    get hasAnchorPosChanged() {return !CDEUtils.posEquals(this.#lastAnchorPos, this.anchorPos)}

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
    set initPos(initPos) {this._initPos = initPos}
    set initRadius(initRadius) {this._initRadius = initRadius}
    set setupCB(cb) {this._setupCB = cb}
    set setupResults(value) {this._setupResults = value}
    set initialized(init) {this._initialized = init}
    set alwaysActive(alwaysActive) {this._alwaysActive = alwaysActive}
    set anchorPos(anchorPos) {this.anchorPosRaw = anchorPos}
    set anchorPosRaw(anchorPos) {
        this._anchorPos = anchorPos
    }
    set lastAnchorPos(l) {this.#lastAnchorPos = l}
    
}