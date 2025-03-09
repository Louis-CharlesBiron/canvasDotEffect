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

    // returns the minimal rectangular area containing all of the provided shape. can be adjusted with the padding parameter
    static getAutomaticPositions(obj, padding=[0,0,0,0]) {
        let positions = null, [pT, pR, pB, pL] = padding
        if (pR == null) pR = pT
        if (pB == null) pB = pT
        if (pL == null) pL = pR

        if (obj instanceof Shape) {
            const rangeX = CDEUtils.getMinMax(obj.dots, "x"), rangeY = CDEUtils.getMinMax(obj.dots, "y"), radius = obj.radius
            positions = [[rangeX[0]-radius, rangeY[0]-radius], [rangeX[1]+radius, rangeY[1]+radius]]
        } else if (obj instanceof Dot) positions = [[obj.left, obj.top], [obj.right, obj.bottom]]
        else if (obj instanceof TextDisplay) {
            const [width, height] = obj.trueSize, [cx, cy] = obj.pos, w2 = width/2, h2 = height/2
            positions = [[cx-w2, cy-h2], [cx+w2, cy+h2]]
        }

        positions[0][0] -= pL
        positions[0][1] -= pT
        positions[1][0] += pR
        positions[1][1] += pB
        return positions
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
        this._rotation = CDEUtils.round(deg,2)%360
        if (!this.isDynamic) this.update(true)
    }
}