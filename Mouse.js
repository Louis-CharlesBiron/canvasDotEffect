const DEFAULT_MOUSE_DECELERATION = 0.8, DEFAULT_MOUSE_MOVE_TRESHOLD = 0.1, DEFAULT_MOUSE_ANGULAR_DECELERATION = 0.2

class Mouse {

    constructor(cvs) {
        this._cvs = cvs                 // Canvas instance
        this._valid = false
        this._x = null
        this._y = null
        this._lastX = null
        this._lastY = null
        this._dir = null
        this._speed = null
        this._clicked = false
        this._scrollClicked = false
        this._rightClicked = false
        this._extraBackClicked = false
        this._extraForwardClicked = false
    }

    
    calcSpeed(deltaTime) {
        if (isFinite(this._lastX) && isFinite(this._lastY) && deltaTime) {
            this._speed = this._speed*DEFAULT_MOUSE_DECELERATION+(getDist(this._x, this._y, this._lastX, this._lastY)/deltaTime)*(1-DEFAULT_MOUSE_DECELERATION)
            if (this._speed < DEFAULT_MOUSE_MOVE_TRESHOLD) this._speed = 0
        } else this._speed = 0

        this._lastX = this._x
        this._lastY = this._y
    }

    calcAngle() {
        let dx = this._x-this._lastX, dy = this._y-this._lastY
        if (isFinite(dx) && isFinite(dy) && (dx||dy)) {
            let angle = (-toDeg(Math.atan2(dy, dx))+360)%360, diff = angle-this._dir
            diff += (360*(diff<-180))-(360*(diff>180))

            this._dir = (this._dir+diff*DEFAULT_MOUSE_ANGULAR_DECELERATION+360)%360
        } else this._dir = 0
    }

    setMouseClicks(e) {
        let v = e.type=="mousedown"
        if (e.button==0) this._clicked = v
        else if (e.button==1) this._scrollClicked = v
        else if (e.button==2) this._rightClicked = v
        else if (e.button==3) this._extraBackClicked = v
        else if (e.button==4) this._extraForwardClicked = v
    }

    invalidate() {
        this._x = Infinity
        this._y = Infinity
    }
    
    updatePos(e, offset) {
        this._valid = true
        this._x = e.x-offset.x
        this._y = e.y-offset.y
    }

    checkValid() {
        if (this._x == Infinity || this._x == null || this._y == Infinity || this._y == null) this._valid = false
        else if (!this._valid) this._valid = true
    }

	get cvs() {return this._cvs}
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

	set cvs(_cvs) {return this._cvs = _cvs}
	set valid(valid) {return this._valid = valid}
	set x(_x) {return this._x = _x}
	set y(_y) {return this._y = _y}
	set lastX(_lastX) {return this._lastX = _lastX}
	set lastY(_lastY) {return this._lastY = _lastY}
	set dir(_dir) {return this._dir = _dir}
	set speed(_speed) {return this._speed = _speed}
	set clicked(_clicked) {return this._clicked = _clicked}
	set scrollClicked(_scrollClicked) {return this._scrollClicked = _scrollClicked}
	set rightClicked(_rightClicked) {return this._rightClicked = _rightClicked}
	set extraBackClicked(_extraBackClicked) {return this._extraBackClicked = _extraBackClicked}
	set extraForwardClicked(_extraForwardClicked) {return this._extraForwardClicked = _extraForwardClicked}
	set pos(pos) {
        this._x = pos[0]
        this._y = pos[1]
    }



}