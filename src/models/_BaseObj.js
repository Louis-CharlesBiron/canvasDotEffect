// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

class _BaseObj extends _HasColor {
    static DEFAULT_POS = [0,0]
    static DEFAULT_ACTIVATION_MARGIN = Canvas.DEFAULT_CANVAS_ACTIVE_AREA_PADDING
    static ACTIVATION_MARGIN_DISABLED = Canvas.ACTIVATION_MARGIN_DISABLED
    static ABSOLUTE_ANCHOR = [0,0]
    static POSITION_PRECISION = 6

    #lastAnchorPos = [0,0]
    #lastActivationMargin = null

    /**
     * Abstract canvas obj class
     * @param {[x,y]?} pos: the [x,y] pos of the object
     * @param {Color | [r,g,b,a] ?} color: the color of the object
     * @param {Function?} setupCB: function called on object's initialization (this, parent)=>{...}
     * @param {Function?} loopCB: function called each frame for this object (this)=>{...}
     * @param {[x,y] | Function | _BaseObj ?} anchorPos: reference point from which the object's pos will be set. Either a pos array, a callback (this, parent)=>{return [x,y] | _baseObj} or a _BaseObj inheritor
     * @param {Number | Boolean ?} activationMargin: the pixel margin amount from where the object remains active when outside the canvas visual bounds. If "true", the object will always remain active.
     */
    constructor(pos, color, setupCB, loopCB, anchorPos, activationMargin) {
        super(color)
        this._id = Canvas.ELEMENT_ID_GIVER++     // canvas obj id
        this._initPos = pos||[0,0]               // initial position : [x,y] || (Canvas)=>{return [x,y]}
        this._pos = [0,0]                        // current position from the center of the object : [x,y]
        this._setupCB = setupCB??null            // called on object's initialization (this, this.parent)=>
        this._loopCB = loopCB                    // called each frame for this object (this)=>
        this._setupResults = null                // return value of the setupCB call
        this._anchorPos = anchorPos              // current reference point from which the object's pos will be set
        this._activationMargin = activationMargin??Canvas.DEFAULT_CANVAS_ACTIVE_AREA_PADDING // the px margin amount where the object remains active when outside the canvas visual bounds. If "true", the object will always remain active
        
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
        if (CDEUtils.isFunction(this._setupCB)) {
            const setupResults = this._setupCB(this, this.parent)
            if (setupResults !== undefined) this._setupResults = setupResults
        }
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

    /**
     * @returns the value of the inital color declaration
     */
    getInitColor() {
        return CDEUtils.isFunction(this._initColor) ? this._initColor(this.render??this.parent.render, this) : this._initColor||null
    }

    /**
     * @returns the value of the inital pos declaration
     */
    getInitPos() {
        return CDEUtils.isFunction(this._initPos) ? CDEUtils.unlinkArr2(this._initPos(this._parent instanceof Canvas?this:this._parent, this)) : CDEUtils.unlinkArr2(this.adjustPos(this._initPos))
    }

    // sets the pos of the object according to its anchorPos
    setAnchoredPos() {
        const anchorPos = this.hasAnchorPosChanged
        if (anchorPos) {
            this.relativeX += anchorPos[0]-this.#lastAnchorPos[0]
            this.relativeY += anchorPos[1]-this.#lastAnchorPos[1]
            this.#lastAnchorPos = anchorPos
        }
    }

    /**
     * Instantly moves the object to the given pos
     * @param {[x,y]} pos: the pos to move to 
     */
    moveAt(pos) {
        const [x, y] = pos
        if (CDEUtils.isDefined(x) && isFinite(x)) this.x = x
        if (CDEUtils.isDefined(y) && isFinite(y)) this.y = y
    }

    /**
     * Instantly moves the object by the increments provided
     * @param {[x,y]} pos: the x/y values to increment by
     */
    moveBy(pos) {
        const [x, y] = pos
        if (CDEUtils.isDefined(x) && isFinite(x)) this.x += x
        if (CDEUtils.isDefined(y) && isFinite(y)) this.y += y
    }

    /**
     * Smoothly moves to a pos in set time
     * @param {[x,y]} pos: the pos to move to 
     * @param {Number?} time: the move time in miliseconds
     * @param {Function?} easing: the easing function used. (x)=>{return y} 
     * @param {[x,y]?} initPos: the pos to start the movement. Defaults to object's current pos 
     * @param {Boolean?} isUnique: if true, the animation gets queue in the object's animation backlog. 
     * @param {Boolean?} force: if true, terminates the current backlog animation and replaces it with this animation
     * @returns the created Anim instance
     */
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

    /**
     * Rotates the object clock-wise by a specified degree increment around its pos
     * @param {Number} deg: the degrees to rotate by
     */
    rotateBy(deg) {
        this.rotation = (this._rotation+deg)%360
    }

    /**
     * Rotates the object to a specified degree around its pos
     * @param {Number} deg: the degrees to rotate to
     */
    rotateAt(deg) {
        this.rotation = deg%360
    }

    /**
     * Smoothly rotates the object to a specified degree around its pos
     * @param {Number} deg: the degrees to rotate to
     * @param {Number?} time: the rotate time in miliseconds
     * @param {Function?} easing: the easing function used. (x)=>{return y} 
     * @param {Boolean?} isUnique: if true, the animation gets queue in the object's animation backlog. 
     * @param {Boolean?} force: if true, terminates the current backlog animation and replaces it with this animation
     * @returns the created Anim instance
     */
    rotateTo(deg, time=1000, easing=Anim.easeInOutQuad, isUnique=false, force=false) {
        const ir = this._rotation, dr = deg-this._rotation
        return this.playAnim(new Anim((prog)=>this.rotateAt(ir+dr*prog), time, easing), isUnique, force)
    }

    /**
     * Scales the object by a specified amount [scaleX, scaleY] from its pos
     * @param {[scaleX, scaleY]} scale: the x/y values to scale the object by
     */
    scaleBy(scale) {
        let [scaleX, scaleY] = scale
        if (!CDEUtils.isDefined(scaleX)) scaleX = this._scale[0]
        if (!CDEUtils.isDefined(scaleY)) scaleY = this._scale[1]
        this.scale[0] *= scaleX
        this.scale[1] *= scaleY
    }

    /**
     * Scales the object to a specified amount [scaleX, scaleY] from its pos
     * @param {[scaleX, scaleY]} scale: the x/y values to scale the object to
     */
    scaleAt(scale) {
        this.scale = scale
    }

    /**
     * Smoothly scales the text to a specified amount [scaleX, scaleY] from its pos
     * @param {[scaleX, scaleY]} scale: the x/y values to scale the object to
     * @param {Number?} time: the scale time in miliseconds
     * @param {Function?} easing: the easing function used. (x)=>{return y} 
     * @param {[x,y]} centerPos: the center pos used for scaling
     * @param {Boolean?} isUnique: if true, the animation gets queue in the object's animation backlog. 
     * @param {Boolean?} force: if true, terminates the current backlog animation and replaces it with this animation
     * @returns the created Anim instance
     */
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

    /**
     * Moves the object in the specified direction, at the specified distance/force
     * @param {Number} distance: the distance in pixels
     * @param {Number} deg: the degree representing the direction of the movement
     * @param {Number?} time: the move time in miliseconds
     * @param {Function?} easing: the easing function used. (x)=>{return y} 
     * @param {Boolean?} isUnique: if true, the animation gets queue in the object's animation backlog. 
     * @param {Boolean?} animForce: if true, terminates the current backlog animation and replaces it with this animation
     * @returns the created Anim instance
     */
    addForce(distance, deg, time=1000, easing=Anim.easeInOutQuad, isUnique=true, animForce=true) {
        let rDir = CDEUtils.toRad(deg), ix = this.x, iy = this.y,
            dx = CDEUtils.getAcceptableDiff(distance*Math.cos(rDir), CDEUtils.DEFAULT_ACCEPTABLE_DIFFERENCE),
            dy = CDEUtils.getAcceptableDiff(distance*Math.sin(rDir), CDEUtils.DEFAULT_ACCEPTABLE_DIFFERENCE)
        
        return this.playAnim(new Anim(prog=>{
            this.x = ix+dx*prog
            this.y = iy-dy*prog
        }, time, easing), isUnique, animForce)
    }

    /**
     * Adds an animation to play on the object
     * @param {Anim} anim: the Anim instance containing the animation
     * @param {Boolean?} isUnique: if true, the animation gets queue in the object's animation backlog. 
     * @param {Boolean?} force: if true, terminates the current backlog animation and replaces it with this animation
     * @returns the provided Anim instance
     */
    playAnim(anim, isUnique, force) {
        if (isUnique && this.currentBacklogAnim && force) {
            this.currentBacklogAnim.end()
            this._anims.backlog = CDEUtils.addAt(this._anims.backlog, anim, 0)
        }
        const initEndCB = anim.endCB
        anim.endCB=()=>{
            if (isUnique) this._anims.backlog.shift()
            else this._anims.currents = this._anims.currents.filter(a=>a.id!==anim.id)
            
            if (CDEUtils.isFunction(initEndCB)) initEndCB()
        }
        this._anims[isUnique?"backlog":"currents"].push(anim)
        return anim
    }

    /**
     * Clears all blacklog and currents anim
     */
    clearAnims() {
        this._anims.backlog = []
        this._anims.currents = []
    }

    // 
    /**
     * Allows flexible pos declarations, if a x/y value is null, it gets adjusted to the current corresponding object's value
     * @param {[x,y]} pos: a pos array
     * @returns the adjusted pos array
     */
    adjustPos(pos) {
        let [x, y] = pos
        if (!CDEUtils.isDefined(x)) x = this.x??0
        if (!CDEUtils.isDefined(y)) y = this.y??0
        return [x, y]
    }

    /**
     * Deletes the object from the canvas
     */
    remove() {
        this._parent.remove(this._id)
    }

    /**
     * Returns whether the provided pos is in the provided area
     * @param {[x,y]} pos: the pos to check 
     * @param {[[x1,y1], [x2,y2]]} positions: the two pos representing the recangular area
     */
    isWithin(pos, positions) {
        return pos[0] >= positions[0][0] && pos[0] <= positions[1][0] && pos[1] >= positions[0][1] && pos[1] <= positions[1][1]
    }

    /**
     * Returns the center pos of the provided positions
     * @param {[[x1,y1], [x2,y2]]} positions: the two pos represencting the recangular area
     */
    getCenter(positions) {
        return CDEUtils.getPositionsCenter(positions)
    }

    /**
     * Returns the 4 corners of the provided positions accounting for rotation and scale
     * @param {[[x1,y1], [x2,y2]]} positions: the two pos represencting the recangular area
     * @param {Number | [paddingTop, paddingRight?, paddingBottom?, paddingLeft?] ?} padding: the padding applied to the results
     * @param {Number?} rotation: the rotation in degrees of the area
     * @param {[scaleX, scaleY]?} scale: the scale of the area
     * @param {[x,y]?} centerPos: the center pos used for rotation/scale
     * @returns corners -> [TO:-LEFT, BOTTOM-RIGHT, TOP-RIGHT, BOTTOM-LEFT]
     */
    getCorners(positions, padding=0, rotation=null, scale=null, centerPos=this.getCenter(positions)) {
        const rotatePos = CDEUtils.rotatePos, scalePos = CDEUtils.scalePos

        positions[2] = [positions[1][0], positions[0][1]]
        positions[3] = [positions[0][0], positions[1][1]]
        
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

        padding??=0
        if (padding) {
            padding = typeof padding=="number" ? [padding, padding, padding, padding] : [padding[0],padding[1]??padding[0], padding[2]??padding[0], padding[3]??padding[1]]
            positions[0][0] -= padding[3]
            positions[0][1] -= padding[0]
            positions[2][0] += padding[1]
            positions[2][1] -= padding[0]
            positions[1][0] += padding[1]
            positions[1][1] += padding[2]
            positions[3][0] -= padding[3]
            positions[3][1] += padding[2]
        }

        return positions
    }

    /**
     * Returns the minimal rectangular area defined by the provided positions
     * @param {[[x1,y1], [x2,y2]]} positions: the two pos represencting the recangular area
     * @param {Number | [paddingTop, paddingRight?, paddingBottom?, paddingLeft?] ?} padding: the padding applied to the results
     * @param {Number?} rotation: the rotation in degrees of the area
     * @param {[scaleX, scaleY]?} scale: the scale of the area
     * @param {[x,y]?} centerPos: the center pos used for rotation/scale
     * @returns the area positions [[x1,y1], [x2,y2]]
     */
    getBounds(positions, padding, rotation, scale, centerPos=this.getCenter(positions)) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity

        positions = this.getCorners(positions, 0, rotation, scale, centerPos)

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

    /**
     * Disables the object by setting its activation margin to 0
     */
    disable() {
        this.#lastActivationMargin = this._activationMargin
        this._activationMargin = Canvas.ACTIVATION_MARGIN_DISABLED
    }

    /**
     * Enables the object by setting its activation margin back to what it was before disabling
     */
    enable() {
        if (this.#lastActivationMargin) {
            this._activationMargin = this.#lastActivationMargin
            this.#lastActivationMargin = null
        }
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
    get activationMargin() {return this._activationMargin}
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
        return !CDEUtils.posEquals(this.#lastAnchorPos, anchorPos)&&anchorPos
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
    get lastActivationMargin() {return this.#lastActivationMargin}
    get enabled() {return !this.#lastActivationMargin}
    get disabled() {return Boolean(this.#lastActivationMargin)}


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
    set activationMargin(activationMargin) {this._activationMargin = activationMargin}
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