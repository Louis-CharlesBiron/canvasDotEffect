// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Abstract canvas obj class, with radius
class Obj extends _BaseObj {
    static DEFAULT_RADIUS = 5

    constructor(pos, radius, color, setupCB, anchorPos, alwaysActive) {
        super(pos, color, setupCB, anchorPos, alwaysActive)
        this._initRadius = radius       // initial object's radius delcaration
        this._radius = this._initRadius // current object's radius
    }

    // Runs when the object gets added to a canvas instance
    initialize() {
        this._radius = this.getInitRadius()??Obj.DEFAULT_RADIUS
        super.initialize()
    }

    // returns the value of the inital radius declaration
    getInitRadius() {
        return CDEUtils.isFunction(this._initRadius) ? this._initRadius(this.parent||this, this) : this._initRadius??null
    }

    // returns whether the provided pos is inside the obj (if "circularDetection" is a number, it acts as a multiplier of the radius)
    isWithin(pos, circularDetection) {
        const [x,y]=pos
        return  (CDEUtils.isDefined(x)&&CDEUtils.isDefined(y)) && (circularDetection ? CDEUtils.getDist(x, y, this.x, this.y) <= this.radius*(+circularDetection===1?1.025:+circularDetection) : x >= this.left && x <= this.right && y >= this.top && y <= this.bottom)
    }

    // Returns the [top, right, bottom, left] distances between the canvas borders, according to the object's size
    posDistances(pos=this._pos) {
        const [x,y]=pos, cw=this._cvs.width, ch=this._cvs.height
        return [y-this.height/2, cw-(x+this.width/2), ch-(y+this.height/2), x-this.width/2]
    }

    get radius() {return this._radius}
    get top() {return this.y-this._radius}
    get bottom() {return this.y+this._radius}
    get right() {return this.x+this._radius}
    get left() {return this.x-this._radius}
    get width() {return this._radius*2}
    get height() {return this._radius*2}
    get initRadius() {return this._initRadius}
    set radius(radius) {this._radius = radius<0?0:radius}
    set initRadius(initRadius) {this._initRadius = initRadius}
}