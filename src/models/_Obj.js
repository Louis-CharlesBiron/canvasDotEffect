// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

class _Obj extends _BaseObj {
    static DEFAULT_RADIUS = 5
    static RADIUS_PRECISION = 4

    /**
     * Abstract canvas obj class, with radius
     * @param {[x,y]?} pos: the [x,y] pos of the object
     * @param {Number?} radius: the radius of the object 
     * @param {Color | [r,g,b,a] ?} color: the color of the object
     * @param {Function?} setupCB: function called on object's initialization (this, parent)=>{...}
     * @param {Function?} loopCB: function called each frame for this object (this)=>{...}
     * @param {[x,y] | Function | _BaseObj ?} anchorPos: reference point from which the object's pos will be set. Either a pos array, a callback (this, parent)=>{return [x,y] | _baseObj} or a _BaseObj inheritor
     * @param {Number | Boolean ?} activationMargin: The pixel margin amount from where the object remains active when outside the canvas visual bounds. If "true", the object will always remain active.
     */
    constructor(pos, radius, color, setupCB, loopCB, anchorPos, activationMargin) {
        super(pos, color, setupCB, loopCB, anchorPos, activationMargin)
        this._initRadius = radius       // initial object's radius delcaration
        this._radius = this._initRadius // current object's radius
    }

    // Runs when the object gets added to a canvas instance
    initialize() {
        this._radius = this.getInitRadius()??_Obj.DEFAULT_RADIUS
        super.initialize()
    }

    /**
     * @returns the value of the inital radius declaration
     */
    getInitRadius() {
        return CDEUtils.isFunction(this._initRadius) ? this._initRadius(this._parent instanceof Canvas?this:this._parent, this) : this._initRadius??null
    }

    /**
     * Returns whether the provided pos is inside the obj
     * @param {[x,y]} pos: the pos to check 
     * @param {[[x1,y1], [x2,y2]]} positions: the two pos representing the recangular area
     */
    isWithin(pos, positions) {
        return super.isWithin(pos, positions)
    }

    /**
     * Returns the center pos of the provided positions
     * @param {[[x1,y1], [x2,y2]]} positions: the two pos representing the recangular area
     * @returns the center pos
     */
    getCenter(positions) {
        return super.getCenter(positions)
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
    getBounds(positions, padding, rotation, scale, centerPos) {
        return super.getBounds(positions, padding, rotation, scale, centerPos)
    }

    get radius() {return this._radius}
    get initRadius() {return this._initRadius}

    set radius(radius) {this._radius = CDEUtils.round(radius<0?0:radius, _Obj.RADIUS_PRECISION)}
    set initRadius(initRadius) {this._initRadius = initRadius}
}