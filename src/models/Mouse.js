// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Represents the user's mouse
class Mouse {
    static DEFAULT_MOUSE_DECELERATION = 0.8
    static DEFAULT_MOUSE_MOVE_TRESHOLD = 0.1
    static DEFAULT_MOUSE_ANGULAR_DECELERATION = 0.2

    constructor() {
        this._valid = false               // whether the mouse pos is valid (is inside the canvas and initialized)
        this._x = null                    // current x value of the mouse on the canvas
        this._y = null                    // current y value of the mouse on the canvas
        this._lastX = null                // previous x value of the mouse on the canvas
        this._lastY = null                // previous y value of the mouse on the canvas
        this._dir = null                  // direction in degrees of the mouse
        this._speed = null                // speed in px/s of the mouse
        this._clicked = false             // whether the main button of the mouse is active
        this._rightClicked = false        // whether the secondary button of the mouse is active
        this._scrollClicked = false       // whether the scroll button of the mouse is active (pressed)
        this._extraForwardClicked = false // whether the extra foward button of the mouse is active (not present on every mouse)
        this._extraBackClicked = false    // whether the extra back button of the mouse is active (not present on every mouse)
    }

    // calculates and sets the current mouse speed (loop every frame)
    calcSpeed(deltaTime) {
        if (isFinite(this._lastX) && isFinite(this._lastY) && deltaTime) {
            this._speed = this._speed*Mouse.DEFAULT_MOUSE_DECELERATION+(CDEUtils.getDist(this._x, this._y, this._lastX, this._lastY)/deltaTime)*(1-Mouse.DEFAULT_MOUSE_DECELERATION)
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
    setMouseClicks(e) {
        const v = e.type==="mousedown"
        if (e.button===0) this._clicked = v
        else if (e.button===1) this._scrollClicked = v
        else if (e.button===2) this._rightClicked = v
        else if (e.button===3) this._extraBackClicked = v
        else if (e.button===4) this._extraForwardClicked = v
    }

    // invalidates mouse position
    invalidate() {
        this._x = Infinity
        this._y = Infinity
    }
    
    // updates current mouse position considering page offsets
    updatePos(e, offset) {
        this._valid = true
        this._x = e.x-offset.x
        this._y = e.y-offset.y
    }

    // sets and returns whether the current mouse position is valid
    checkValid() {
        if (this._x === Infinity || this._x == null || this._y === Infinity || this._y == null) return this._valid = false
        else if (!this._valid) return this._valid = true
    }

	get valid() {return this._valid}
	get x() {return this._x}
	get y() {return this._y}
	get lastX() {return this._lastX}
	get lastY() {return this._lastY}
	get dir() {return this._dir}
	get speed() {return this._speed}
	get clicked() {return this._clicked}
	get scrollClicked() {return this._scrollClicked}
	get rightClicked() {return this._rightClicked}
	get extraBackClicked() {return this._extraBackClicked}
	get extraForwardClicked() {return this._extraForwardClicked}
	get pos() {return [this._x, this._y]}

	set valid(valid) {return this._valid = valid}
	set lastX(_lastX) {return this._lastX = _lastX}
	set lastY(_lastY) {return this._lastY = _lastY}
	set dir(_dir) {return this._dir = _dir}
	set speed(_speed) {return this._speed = _speed}
	set clicked(_clicked) {return this._clicked = _clicked}
	set scrollClicked(_scrollClicked) {return this._scrollClicked = _scrollClicked}
	set rightClicked(_rightClicked) {return this._rightClicked = _rightClicked}
	set extraBackClicked(_extraBackClicked) {return this._extraBackClicked = _extraBackClicked}
	set extraForwardClicked(_extraForwardClicked) {return this._extraForwardClicked = _extraForwardClicked}



}