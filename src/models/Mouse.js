// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Represents the user's mouse
class Mouse {
    static DEFAULT_MOUSE_DECELERATION = 0.8
    static DEFAULT_MOUSE_MOVE_TRESHOLD = 0.1
    static DEFAULT_MOUSE_ANGULAR_DECELERATION = 0.2
    static #LISTENER_ID_GIVER = 0
    static LISTENER_TYPES = {CLICK:0, DOWN:0, UP:1, MAIN_DOWN:0, MAIN_UP:1, MIDDLE_DOWN:2, MIDDLE_UP:3, RIGHT_DOWN:4, RIGHT_UP:5, EXTRA_FOWARD_DOWN:6, EXTRA_FOWARD_UP:7, EXTRA_BACK_DOWN:8, EXTRA_BACK_UP:9, ENTER:10, LEAVE:11, EXIT:11}
    
    #fixedLastPos = [0,0]
    #wasWithin = false
    constructor() {
        this._valid = false               // whether the mouse pos is valid (is inside the canvas and initialized)
        this._x = null                    // current x value of the mouse on the canvas
        this._y = null                    // current y value of the mouse on the canvas
        this._rawX = null                 // current x value of the mouse on the canvas without any offsets
        this._rawY = null                 // current y value of the mouse on the canvas without any offsets
        this._lastX = null                // previous x value of the mouse on the canvas
        this._lastY = null                // previous y value of the mouse on the canvas
        this._dir = null                  // direction in degrees of the mouse
        this._speed = null                // speed in px/s of the mouse
        this._clicked = false             // whether the main button of the mouse is active
        this._rightClicked = false        // whether the secondary button of the mouse is active
        this._scrollClicked = false       // whether the scroll button of the mouse is active (pressed)
        this._extraForwardClicked = false // whether the extra foward button of the mouse is active (not present on every mouse)
        this._extraBackClicked = false    // whether the extra back button of the mouse is active (not present on every mouse)
        this._holdValue = null            // a custom manual value. Ex: can be used to easily reference an object the mouse is holding
        this._listeners = []              // list of all current listeners

        this._moveListenersOptimizationEnabled = true // when true, only checks move listeners on mouse move, else checks every frame
    }

    // calculates and sets the current mouse speed (run every frame)
    calcSpeed(deltaTime) {
        const DECELERATION = Mouse.DEFAULT_MOUSE_DECELERATION
        if (isFinite(this._lastX) && isFinite(this._lastY) && deltaTime) {
            this._speed = this._speed*DECELERATION+(CDEUtils.getDist(this._x, this._y, this._lastX, this._lastY)/deltaTime)*(1-DECELERATION)
            if (this._speed < Mouse.DEFAULT_MOUSE_MOVE_TRESHOLD) this._speed = 0
        } else this._speed = 0

        this._lastX = this._x
        this._lastY = this._y
    }

    // calculates and set the current mouse direction (run on mouse move)
    calcAngle() {
        const dx = this._x-this._lastX, dy = this._y-this._lastY
        if (isFinite(dx) && isFinite(dy) && (dx||dy)) {
            let angle = (-CDEUtils.toDeg(Math.atan2(dy, dx))+360)%360, diff = angle-this._dir
            diff += (360*(diff<-180))-(360*(diff>180))

            this._dir = (this._dir+diff*Mouse.DEFAULT_MOUSE_ANGULAR_DECELERATION+360)%360
        } else this._dir = 0
    }

    // given an mouse event, sets the current mouse active buttons
    updateMouseClicks(e) {
        const isMouseDownEvent = e.type=="mousedown"||e.type=="touchstart", TYPES = Mouse.LISTENER_TYPES
        if (e.button==0) {
            this._clicked = isMouseDownEvent
            this.checkListeners(isMouseDownEvent?TYPES.MAIN_DOWN:TYPES.MAIN_UP)
        }
        else if (e.button==1) {
            this._scrollClicked = isMouseDownEvent
            this.checkListeners(isMouseDownEvent?TYPES.MIDDLE_DOWN:TYPES.MIDDLE_UP)
        }
        else if (e.button==2) {
            this._rightClicked = isMouseDownEvent
            this.checkListeners(isMouseDownEvent?TYPES.RIGHT_DOWN:TYPES.RIGHT_UP)
        }
        else if (e.button==3) {
            this._extraBackClicked = isMouseDownEvent
            this.checkListeners(isMouseDownEvent?TYPES.EXTRA_BACK_DOWN:TYPES.EXTRA_BACK_UP)
        }
        else if (e.button==4) {
            this._extraForwardClicked = isMouseDownEvent
            this.checkListeners(isMouseDownEvent?TYPES.EXTRA_FOWARD_DOWN:TYPES.EXTRA_FOWARD_UP)
        }

    }

    // invalidates mouse position
    invalidate() {
        this._x = Infinity
        this._y = Infinity
        this._rawX = Infinity
        this._rawY = Infinity
    }
    
    // updates current mouse position considering page offsets
    updatePos(e, offset) {
        this._valid = true
        this._rawX = e.x
        this._rawY = e.y
        this._x = e.x-offset.x
        this._y = e.y-offset.y

        if (this._moveListenersOptimizationEnabled) {
            this.checkListeners(10) // enter
            this.checkListeners(11) // leave
            this.#fixedLastPos[0] = this._x
            this.#fixedLastPos[1] = this._y
        }
    }

    // sets and returns whether the current mouse position is valid
    checkValid() {
        if (this._x == Infinity || this._x == null || this._y == Infinity || this._y == null) return this._valid = false
        else if (!this._valid) return this._valid = true
    }

    /**
     * Adds a custom mouse event listener binded to an object/area
     * @param {canvas object - [[x1,y1],[x2,y2]]} obj: Either a canvas object or a positions array 
     * @param {LISTENER_TYPES} type: One of Mouse.LISTENER_TYPES
     * @param {Function} callback: a custom function called upon event trigger. (obj, mousePos)=> 
     * @param {Boolean} forceStaticPositions: If true, stores the obj positions statically, rather than the entire object 
     * @returns The listener id
     */
    addListener(obj, type, callback, forceStaticPositions) {
        const listener = [forceStaticPositions?_DynamicColor.getAutomaticPositions(obj):obj, callback, Mouse.#LISTENER_ID_GIVER++]
        if (!this._listeners[type]) this._listeners[type] = []
        this._listeners[type].push(listener)
        return listener[2]
    }

    // checks conditions for every listeners of a certain type, if valid, calls the listeners callback as such: (obj, mousePos)=>
    checkListeners(type) {
        const typedListeners = this._listeners[type], typedListeners_ll = typedListeners?.length

        if (typedListeners_ll) {
            let TYPES = Mouse.LISTENER_TYPES, mousePos = this.pos, validation = true

            if (type >= TYPES.ENTER) {
                validation = 2
                if (type==TYPES.LEAVE) validation = 1

                for (let i=0;i<typedListeners_ll;i++) {
                    const [obj, callback] = typedListeners[i], isPositionsArray = Array.isArray(obj), nowWithin = ((!isPositionsArray && obj.isWithin(mousePos)) || (isPositionsArray && this.isWithin(mousePos, obj)))
                    
                    if (this._moveListenersOptimizationEnabled) {
                        if ((nowWithin*2)+((!isPositionsArray && obj.isWithin(this.#fixedLastPos)) || (isPositionsArray && this.isWithin(this.#fixedLastPos, obj)))==validation) callback(obj, mousePos)
                    } else {
                        if (!this.#wasWithin && nowWithin && validation==2) {
                            this.#wasWithin = true
                            callback(obj, mousePos)
                        }
                        else if (!nowWithin && this.#wasWithin && validation==1) {
                            this.#wasWithin = false
                            callback(obj, mousePos)
                        }
                    }
                }
            } else {
                if (type==TYPES.MAIN_DOWN||type==TYPES.RIGHT_DOWN||type==TYPES.MIDDLE_DOWN||type==TYPES.EXTRA_BACK_DOWN||type==TYPES.EXTRA_FOWARD_DOWN) validation = this._clicked
                else if (type==TYPES.MAIN_UP||type==TYPES.RIGHT_UP||type==TYPES.MIDDLE_UP||type==TYPES.EXTRA_BACK_UP||type==TYPES.EXTRA_FOWARD_UP) validation = !this._clicked

                for (let i=0;i<typedListeners_ll;i++) {
                    const [obj, callback] = typedListeners[i], isPositionsArray = Array.isArray(obj)
                    if (validation && ((!isPositionsArray && obj.isWithin(mousePos)) || (isPositionsArray && this.isWithin(mousePos, obj)))) callback(obj, mousePos)
                }
            }
        }
    }

    /**
     * Updates an existing listener
     * @param {LISTENER_TYPES} type: One of Mouse.LISTENER_TYPES
     * @param {Number} id: listener's id 
     * @param {canvas object | [[x1,y1],[x2,y2]]?} newObj: if provided, updates the listeners's obj to this value
     * @param {Function?} newCallback: if provided, updates the listeners's callback to this value
     * @param {Boolean} forceStaticPositions: If true, stores the obj positions statically, rather than the entire object 
     */
    updateListener(type, id, newObj, newCallback, forceStaticPositions) {
        const listener = this._listeners[type][this._listeners[type].findIndex(l=>l[2]==(id?.[2]??id))]
        if (newObj) listener[0] = forceStaticPositions?_DynamicColor.getAutomaticPositions(newObj):newObj
        if (newCallback) listener[1] = newCallback
    }

    /**
     * Removes one or all exisiting listeners of a certain type 
     * @param {LISTENER_TYPES} type: One of Mouse.LISTENER_TYPES
     * @param {Number | String} id: Either the listener's id or * to remove all listeners of this type 
     */
    removeListener(type, id) {
        this._listeners[type] = id=="*"?[]:this._listeners[type].filter(l=>l[2]!==(id?.[2]??id))
    }

    // returns whether the provided pos is inside the provided positions
    isWithin(pos, positions) {
        const [x,y]=pos
        return x >= positions[0][0] && x <= positions[1][0] && y >= positions[0][1] && y <= positions[1][1]
    }

	get valid() {return this._valid}
	get x() {return this._x}
	get y() {return this._y}
	get pos() {return [this._x, this._y]}
    get rawX() {return this._rawX}
	get rawY() {return this._rawY}
	get rawPos() {return [this._rawX, this._rawY]}
	get lastX() {return this._lastX}
	get lastY() {return this._lastY}
	get lastPos() {return [this._lastX, this._lastY]}
	get dir() {return this._dir}
	get speed() {return this._speed}
	get clicked() {return this._clicked}
	get scrollClicked() {return this._scrollClicked}
	get rightClicked() {return this._rightClicked}
	get extraBackClicked() {return this._extraBackClicked}
	get extraForwardClicked() {return this._extraForwardClicked}
	get holdValue() {return this._holdValue}
	get listeners() {return this._listeners}
    get moveListenersOptimizationEnabled() {return this._moveListenersOptimizationEnabled}

	set valid(valid) {this._valid = valid}
	set lastX(_lastX) {this._lastX = _lastX}
	set lastY(_lastY) {this._lastY = _lastY}
	set dir(_dir) {this._dir = _dir}
	set speed(_speed) {this._speed = _speed}
	set clicked(_clicked) {this._clicked = _clicked}
	set scrollClicked(_scrollClicked) {this._scrollClicked = _scrollClicked}
	set rightClicked(_rightClicked) {this._rightClicked = _rightClicked}
	set extraBackClicked(_extraBackClicked) {this._extraBackClicked = _extraBackClicked}
	set extraForwardClicked(_extraForwardClicked) {this._extraForwardClicked = _extraForwardClicked}
	set holdValue(holdValue) {this._holdValue = holdValue}
}