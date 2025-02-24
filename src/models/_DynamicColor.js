// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Abstract dynamic color class
class _DynamicColor {
    static PLACEHOLDER = "PLACEHOLDER" // can be used to instantiate a dynamic color without positions, and apply that of the object, on assignement
    static PLACEHOLDER_COLOR = "transparent"

    // returns the minimal rectangular area containing all of the provided shape
    static getAutomaticPositions(obj) {
        if (obj instanceof Shape) {
            const rangeX = CDEUtils.getMinMax(obj.dots, "x"), rangeY = CDEUtils.getMinMax(obj.dots, "y"), radius = obj.radius
            return [[rangeX[0]-radius, rangeY[0]-radius], [rangeX[1]+radius, rangeY[1]+radius]]
        } else if (obj instanceof Dot) return [[obj.left, obj.top], [obj.right, obj.bottom]]
        else if (obj instanceof TextDisplay) {
            const [width, height] = obj.trueSize, [cx, cy] = obj.pos, w2 = width/2, h2 = height/2
            return [[cx-w2, cy-h2], [cx+w2, cy+h2]]
        }
    }

    constructor(positions, rotation) {
        this._initPositions = positions 
        this._positions = positions
        this._rotation = rotation??0
        this._lastChangeValue = null
        this._value = null
    }
    get initPositions() {return this._initPositions}
    get positions() {return this._positions}
	get rotation() {return this._rotation}
	get isDynamic() {return this._initPositions?.pos != null}
    get value() {
        if (this.isDynamic) this.update(true)
        return this._value
    }

    set initPositions(initPositions) {this._initPositions = initPositions}
	set positions(_positions) {
        this._positions = _positions
        if (!this.isDynamic) this.update(true)
    }
	set rotation(deg) {
        this._rotation = CDEUtils.round(deg, 2)%360
        if (!this.isDynamic) this.update(true)
    }
}