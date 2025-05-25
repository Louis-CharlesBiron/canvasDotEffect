// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Abstract canvas obj class
class _BaseObj extends _HasColor {
    static DEFAULT_POS = [0,0]
    static ABSOLUTE_ANCHOR = [0,0]
    static POSITION_PRECISION = 4

    #lastAnchorPos = [0,0]
    constructor(pos, color, setupCB, loopCB, anchorPos, alwaysActive) {
        super(color)
        this._id = Canvas.ELEMENT_ID_GIVER++     // canvas obj id
        this._initPos = pos||[0,0]               // initial position : [x,y] || (Canvas)=>{return [x,y]}
        this._pos = [0,0]                        // current position from the center of the object : [x,y]
        this._setupCB = setupCB??null            // called on object's initialization (this, this.parent)=>
        this._loopCB = loopCB                    // called each frame for this object (this)=>
        this._setupResults = null                // return value of the setupCB call
        this._anchorPos = anchorPos              // current reference point from which the object's pos will be set
        this._alwaysActive = alwaysActive??null  // whether the object stays active when outside the canvas bounds
        
        this._parent = null                      // the object's parent
        this._rotation = 0                       // the object's rotation in degrees 
        this._scale = [1,1]                      // the object's scale factors: [scaleX, scaleY]
        this._anims = {backlog:[], currents:[]}  // all "currents" animations playing are playing simultaneously, the backlog animations run in a queue, one at a time
        this._visualEffects = null               // the visual effects modifers of the objects: [filter, compositeOperation, opacity]
        this._initialized = false                // whether the object has been initialized yet
    }

    // Runs when the object gets added to a canvas instance
    initialize() {
        this._pos = this.getInitPos()||_BaseObj.DEFAULT_POS
        this.color = this.getInitColor()
        this.setAnchoredPos()
        if (CDEUtils.isFunction(this._setupCB)) this._setupResults = this._setupCB(this, this.parent)
    }

    // Runs every frame
    draw(time, deltaTime) {
        this.setAnchoredPos()
        const loopCB = this._loopCB
        if (loopCB && this.initialized) loopCB(this, deltaTime)

        let anims = this._anims.currents
        if (this._anims.backlog[0]) anims = [...anims, this._anims.backlog[0]]
        const a_ll = anims.length
        if (a_ll) for (let i=0;i<a_ll;i++) anims[i].getFrame(time, deltaTime)
    }

    // returns the value of the inital color declaration
    getInitColor() {
        return CDEUtils.isFunction(this._initColor) ? this._initColor(this.render??this.parent.render, this) : this._initColor||null
    }

    // returns the value of the inital pos declaration
    getInitPos() {
        return CDEUtils.isFunction(this._initPos) ? CDEUtils.unlinkArr2(this._initPos(this._parent instanceof Canvas?this:this._parent, this)) : CDEUtils.unlinkArr2(this.adjustPos(this._initPos))
    }

    // sets the pos of the object according to its anchorPos
    setAnchoredPos() {
        const anchorPos = this.hasAnchorPosChanged
        if (anchorPos) {
            const [anchorPosX, anchorPosY] = anchorPos
            this.relativeX += anchorPosX-this.#lastAnchorPos[0]
            this.relativeY += anchorPosY-this.#lastAnchorPos[1]
            this.#lastAnchorPos = anchorPos
        }
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
    moveTo(pos, time, easing, initPos, isUnique, force) {
        time??=1000
        easing??=Anim.easeInOutQuad
        initPos??=this.pos_
        isUnique??=true
        force??=true

        const [ix, iy] = initPos, [fx, fy] = this.adjustPos(pos), dx = fx-ix, dy = fy-iy
        return this.playAnim(new Anim((prog)=>{
            this.x = ix+dx*prog
            this.y = iy+dy*prog
        }, time, easing), isUnique, force)
    }

    // Rotates the object clock-wise by a specified degree increment around its pos
    rotateBy(deg) {
        this.rotation = (this._rotation+deg)%360
    }

    // Rotates the object to a specified degree around its pos
    rotateAt(deg) {
        this.rotation = deg%360
    }

    // Smoothly rotates the object to a specified degree around its pos
    rotateTo(deg, time=1000, easing=Anim.easeInOutQuad, isUnique=false, force=false) {
        const ir = this._rotation, dr = deg-this._rotation
        return this.playAnim(new Anim((prog)=>this.rotateAt(ir+dr*prog), time, easing), isUnique, force)
    }

    // Scales the object by a specified amount [scaleX, scaleY] from its pos
    scaleBy(scale) {
        let [scaleX, scaleY] = scale
        if (!CDEUtils.isDefined(scaleX)) scaleX = this._scale[0]
        if (!CDEUtils.isDefined(scaleY)) scaleY = this._scale[1]
        this.scale[0] *= scaleX
        this.scale[1] *= scaleY
    }

    // Scales the object to a specified amount [scaleX, scaleY] from its pos
    scaleAt(scale) {
        this.scale = scale
    }

    // Smoothly scales the text to a specified amount [scaleX, scaleY] from its pos
    scaleTo(scale, time=1000, easing=Anim.easeInOutQuad, centerPos=this.pos, isUnique=false, force=false) {
        const is = CDEUtils.unlinkArr2(this._scale), dsX = scale[0]-is[0], dsY = scale[1]-is[1]
        return this.playAnim(new Anim(prog=>this.scaleAt([is[0]+dsX*prog, is[1]+dsY*prog], centerPos), time, easing), isUnique, force)
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
            CDEUtils.addAt(this._anims.backlog, anim, 0)
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

    // clears all blacklog and currents anim
    clearAnims() {
        this._anims.backlog = []
        this._anims.currents = []
    }

    // allows flexible pos declarations
    adjustPos(pos) {
        let [x, y] = pos
        if (!CDEUtils.isDefined(x)) x = this.x??0
        if (!CDEUtils.isDefined(y)) y = this.y??0
        return [x, y]
    }

    // deletes the object from the canvas
    remove() {
        this._parent.remove(this._id)
    }

    // returns whether the provided pos is in the provided positions
    isWithin(pos, positions) {
        return pos[0] >= positions[0][0] && pos[0] <= positions[1][0] && pos[1] >= positions[0][1] && pos[1] <= positions[1][1]
    }

    // returns the center pos of the provided positions
    getCenter(positions) {
        return CDEUtils.getPositionsCenter(positions)
    }

    // returns the minimal rectangular area defined by the provided positions
    getBounds(positions, padding, rotation, scale, centerPos=this.getCenter(positions)) {
        const rotatePos = CDEUtils.rotatePos, scalePos = CDEUtils.scalePos
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity

        if (scale || rotation) {
            positions[2] = [positions[1][0], positions[0][1]]
            positions[3] = [positions[0][0], positions[1][1]]
        }
        
        if (scale) {
            positions[0] = scalePos(positions[0], scale, centerPos)
            positions[1] = scalePos(positions[1], scale, centerPos)
            positions[2] = scalePos(positions[2], scale, centerPos)
            positions[3] = scalePos(positions[3], scale, centerPos)
        }

        if (rotation) {
            positions[0] = rotatePos(positions[0], rotation, centerPos)
            positions[1] = rotatePos(positions[1], rotation, centerPos)
            positions[2] = rotatePos(positions[2], rotation, centerPos)
            positions[3] = rotatePos(positions[3], rotation, centerPos)
        }

        const p_ll = positions.length
        for (let i=0;i<p_ll; i++) {
            let [x, y] = positions[i]
            if (x < minX) minX = x
            if (x > maxX) maxX = x
            if (y < minY) minY = y
            if (y > maxY) maxY = y
        }   
        
        padding??=0
        padding = typeof padding=="number" ? [padding, padding, padding, padding] : [padding[0],padding[1]??padding[0], padding[2]??padding[0], padding[3]??padding[1]]

        return [[minX-padding[3], minY-padding[0]],[maxX+padding[1], maxY+padding[2]]]
    }

	get id() {return this._id}
    get x() {return this._pos[0]}
    get y() {return this._pos[1]}
    get pos() {return this._pos}
    get pos_() {return CDEUtils.unlinkArr2(this._pos)}
    get relativeX() {return this.x-this.anchorPos[0]}
    get relativeY() {return this.y-this.anchorPos[1]}
    get relativePos() {return [this.relativeX, this.relativeY]}
    get stringPos() {return this.x+","+this.y}
	get initPos() {return this._initPos}
    get currentBacklogAnim() {return this._anims.backlog[0]}
    get anims() {return this._anims}
    get setupCB() {return this._setupCB}
    get loopCB() {return this._loopCB}
    get loopingCB() {return this._loopCB}
    get setupResults() {return this._setupResults}
    get initialized() {return this._initialized}
    get alwaysActive() {return this._alwaysActive}
    get anchorPosRaw() {return this._anchorPos}
    get anchorPos() {// returns the anchorPos value
        if (Array.isArray(this._anchorPos)) return this._anchorPos
        else if (!this._anchorPos) return (this.parent instanceof Canvas) ? [0,0] : this.parent?.pos_
        else if (this._anchorPos instanceof _BaseObj) return this._anchorPos.pos_
        else if (CDEUtils.isFunction(this._anchorPos)) {
            const res = this._anchorPos(this, this.parent)
            return CDEUtils.unlinkArr2((res?.pos_||res||[0,0]))
        }
    }
    get lastAnchorPos() {return this.#lastAnchorPos}
    get hasAnchorPosChanged() {
        const anchorPos = this.anchorPos
        return !CDEUtils.arr2Equals(this.#lastAnchorPos, anchorPos)&&anchorPos
    }
    get parent() {return this._parent}
    get rotation() {return this._rotation}
    get scale() {return this._scale}
    get visualEffects() {return this._visualEffects??[]}
    get visualEffects_() {
        const visualEffects = this._visualEffects
        return visualEffects?CDEUtils.unlinkArr3(visualEffects):[]
    }
    get filter() {return this._visualEffects?.[0]??Render.DEFAULT_FILTER}
    get compositeOperation() {return this._visualEffects?.[1]??Render.DEFAULT_COMPOSITE_OPERATION}
    get opacity() {return this._visualEffects?.[2]??Render.DEFAULT_ALPHA}
    get safeColorObject() {return this.initialized&&this._color}


    set x(x) {this._pos[0] = CDEUtils.round(x, _BaseObj.POSITION_PRECISION)}
    set y(y) {this._pos[1] = CDEUtils.round(y, _BaseObj.POSITION_PRECISION)}
    set pos(pos) {
        this.x = pos[0]
        this.y = pos[1]
    }
    set relativeX(x) {this.x = this.anchorPos[0]+x}
    set relativeY(y) {this.y = this.anchorPos[1]+y}
    set relativePos(pos) {
        this.relativeX = CDEUtils.round(pos[0], _BaseObj.POSITION_PRECISION)
        this.relativeY = CDEUtils.round(pos[1], _BaseObj.POSITION_PRECISION)
    }
    set initPos(initPos) {this._initPos = initPos}
    set setupCB(cb) {this._setupCB = cb}
    set loopCB(cb) {this._loopCB = cb}
    set loopingCB(cb) {this._loopCB = cb}
    set setupResults(value) {this._setupResults = value}
    set initialized(init) {this._initialized = init}
    set alwaysActive(alwaysActive) {this._alwaysActive = alwaysActive}
    set anchorPos(anchorPos) {this.anchorPosRaw = anchorPos}
    set anchorPosRaw(anchorPos) {this._anchorPos = anchorPos}
    set lastAnchorPos(lastAnchorPos) {this.#lastAnchorPos = lastAnchorPos}
    set rotation(_rotation) {this._rotation = _rotation%360}
    set scale(scale) {
        let [scaleX, scaleY] = scale
        if (!CDEUtils.isDefined(scaleX)) scaleX = this._scale[0]
        if (!CDEUtils.isDefined(scaleY)) scaleY = this._scale[1]
        this._scale[0] = scaleX
        this._scale[1] = scaleY
    }
    set visualEffects(visualEffects) {this._visualEffects = !visualEffects?.length ? null : CDEUtils.unlinkArr3(visualEffects)}
    set filter(filter) {
        const visualEffects = this._visualEffects
        if (!visualEffects) this._visualEffects = [filter]
        else visualEffects[0] = filter
    }
    set compositeOperation(compositeOperation) {
        const visualEffects = this._visualEffects
        if (!visualEffects) this._visualEffects = [,compositeOperation]
        else visualEffects[1] = compositeOperation
    }
    set opacity(opacity) {
        const visualEffects = this._visualEffects
        if (!visualEffects) this._visualEffects = [,,opacity]
        else visualEffects[2] = opacity
    }
}