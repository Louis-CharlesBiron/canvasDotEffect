// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Abstract canvas obj class, with radius
class _Obj extends _BaseObj {
    static DEFAULT_RADIUS = 5
    static RADIUS_PRECISION = 4

    constructor(pos, radius, color, setupCB, loopCB, anchorPos, alwaysActive) {
        super(pos, color, setupCB, loopCB, anchorPos, alwaysActive)
        this._initRadius = radius       // initial object's radius delcaration
        this._radius = this._initRadius // current object's radius
    }

    // Runs when the object gets added to a canvas instance
    initialize() {
        this._radius = this.getInitRadius()??_Obj.DEFAULT_RADIUS
        super.initialize()
    }

    // returns the value of the inital radius declaration
    getInitRadius() {
        return CDEUtils.isFunction(this._initRadius) ? this._initRadius(this._parent instanceof Canvas?this:this._parent, this) : this._initRadius??null
    }

    // returns whether the provided pos is inside the obj (if "circularDetection" is a number, it acts as a multiplier of the radius)
    isWithin(pos, circularDetection) {
        const [x,y]=pos
        return (CDEUtils.isDefined(x)&&CDEUtils.isDefined(y)) && (circularDetection ? CDEUtils.getDist(x, y, this.x, this.y) <= (this.radius||1)*(+circularDetection==1?1.025:+circularDetection) : x >= this.left && x <= this.right && y >= this.top && y <= this.bottom)
    }

    get radius() {return this._radius}
    get initRadius() {return this._initRadius}

    set radius(radius) {this._radius = CDEUtils.round(radius<0?0:radius, _Obj.RADIUS_PRECISION)}
    set initRadius(initRadius) {this._initRadius = initRadius}
}