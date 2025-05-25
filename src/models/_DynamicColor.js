// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Abstract dynamic color class
class _DynamicColor {
    static PLACEHOLDER = "PLACEHOLDER" // can be used to instantiate a dynamic color without positions, and apply that of the object, on assignement
    static PLACEHOLDER_COLOR = "transparent"

    constructor(positions, rotation) {
        this._initPositions = positions // initial positions declaration
        this._positions = positions     // current positions value
        this._rotation = rotation??0    // current rotation
        this._lastChangeValue = null    // used for optimization purposes
        this._value = null              // usable value as a fill/stroke style
    }

    get initPositions() {return this._initPositions}
    get positions() {return this._positions}
	get rotation() {return this._rotation}
	get isDynamic() {return this._initPositions?.pos != null}
    get value() {
        if (this.isDynamic) this.update()
        return this._value
    }

    set initPositions(initPositions) {this._initPositions = initPositions}
	set positions(_positions) {
        this._positions = _positions
        if (!this.isDynamic) this.update(true)
    }
	set rotation(deg) {
        this._rotation = CDEUtils.round(deg,2)%360
        if (!this.isDynamic) this.update(true)
    }
}