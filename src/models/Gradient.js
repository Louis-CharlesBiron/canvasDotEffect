// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Allows the creation of custom gradients
class Gradient {
    static PLACEHOLDER = "PLACERHOLDER" // can be used to instantiate a Gradient without positions, and apply that of the object on assignement

    #lastDotsPos = null
    #lastRotation = null
    #lastDotPos = null
    constructor(ctx, positions, isLinear=0, ...colorStops) {
        this._ctx = ctx                                                     // canvas context
        this._isLinear = this.#getFormatedIsLinear(isLinear)                // whether the gradient is linear or radial (if a number, acts as the rotation in degrees of linear gradient)
        this._initPositions = positions                                     // linear:[[x1,y1],[x2,y2]] | radial:[[x1, y1, r1],[x2,y2,r2]] | Shape
        this._positions = this.getAutomaticPositions()??this._initPositions // usable positions from initPositions

        this._colorStops = colorStops.flat().map(([stop, color])=>[stop, Color.adjust(color)]) // ex: [[0..1, Color], [0.5, Color], [1, Color]]

        this._gradient = null // useable as a fillStyle
        this.updateGradient()
    }

    // returns a the gradient rotation in degrees or false if radial gradient
    #getFormatedIsLinear(isLinear=this._isLinear) {
        return typeof isLinear==="number" ? isLinear : isLinear===true ? 0 : false
    }

    // returns a separate copy of the Gradient
    duplicate(positions=this._positions) {
        return new Gradient(this._ctx, Array.isArray(positions) ? [...positions] : positions, this._isLinear, [...this._colorStops])
    }

    /**
     * Given a shape, returns automatic positions values for linear or radial gradients
     * @param {Shape} obj: Instance of Shape or inheriting shape 
     * @param {boolean} optimize: if enabled recalculates positions only when a dot changes pos (disable only for manual usage of this function) 
     * @returns the new calculated positions or the current value of this._positions if the parameter 'shape' isn't an instance of Shape
     */
    getAutomaticPositions(obj=this._initPositions, optimize=true) {
        if (obj instanceof Shape) {
            if (this.#hasShapeChanged(obj) || !optimize) {
                const rangeX = CDEUtils.getMinMax(obj.dots, "x"), rangeY = CDEUtils.getMinMax(obj.dots, "y"),
                    smallestX = rangeX[0], smallestY = rangeY[0],
                    biggestX = rangeX[1], biggestY = rangeY[1],
                    cx = smallestX+(biggestX-smallestX)/2, cy = smallestY+(biggestY-smallestY)/2

                if (this.#getFormatedIsLinear() !== false) {
                    const x = smallestX-cx, y = smallestY-cy, x2 = biggestX-cx, y2 = biggestY-cy,
                        cosV = Math.cos(CDEUtils.toRad(this.#getFormatedIsLinear())), sinV = Math.sin(CDEUtils.toRad(this.#getFormatedIsLinear()))
                    return [[(x*cosV-y*sinV)+cx, (x*sinV+y*cosV)+cy], [(x2*cosV-y2*sinV)+cx, (x2*sinV+y2*cosV)+cy]]
                } else {
                    const coverRadius = Math.max(biggestX-smallestX, biggestY-smallestY)
                    return [[cx, cy, coverRadius],[cx, cy, coverRadius*0.25]]
                }
            } else return this._positions
        } else if (obj instanceof Dot) {
            if (this.#hasDotChanged(obj) || !optimize ) {
                if (this.#getFormatedIsLinear() !== false) {
                    const x = obj.left-obj.x, y = obj.top-obj.y, x2 = obj.right-obj.x, y2 = obj.bottom-obj.y,
                        cosV = Math.cos(CDEUtils.toRad(this.#getFormatedIsLinear())), sinV = Math.sin(CDEUtils.toRad(this.#getFormatedIsLinear()))
                    return [[(x*cosV-y*sinV)+obj.x, (x*sinV+y*cosV)+obj.y], [(x2*cosV-y2*sinV)+obj.x, (x2*sinV+y2*cosV)+obj.y]]
                } else {
                    const coverRadius = obj.radius*1
                    return [[obj.x, obj.y, coverRadius],[obj.x, obj.y, coverRadius*0.25]]
                }
            } return this._positions
        } 
        else return this._positions
    }

    #hasShapeChanged(shape) {
        const currentDotsPos = shape.dotsPositions
        if (this.#lastRotation !== this._isLinear || currentDotsPos !== this.#lastDotsPos) {
            this.#lastDotsPos = currentDotsPos
            this.#lastRotation = this._isLinear
            return true
        } else return false
    }
    
    #hasDotChanged(dot) {
        const currentDotPos = dot.stringPos
        if (this.#lastRotation !== this._isLinear || currentDotPos !== this.#lastDotPos) {
            this.#lastDotPos = currentDotPos
            this.#lastRotation = this._isLinear
            return true
        } else return false
    }

    // Creates and returns the gradient. Updates it if the initPositions is a Shape/Dot instance
    updateGradient() {
        if (this._initPositions !== Gradient.PLACEHOLDER) {
            this._positions = this.getAutomaticPositions()
            this._gradient = this._ctx[`create${typeof this.#getFormatedIsLinear()=="number"?"Linear":"Radial"}Gradient`](...this._positions[0], ...this._positions[1])
            const cs_ll = this._colorStops.length
            for (let i=0;i<cs_ll;i++) this._gradient.addColorStop(this._colorStops[i][0], this._colorStops[i][1].color)
            return this._gradient
        }
    }

    toString() {
        return "G"+this._positions+this._colorStops+this.isLinear
    }

    get ctx() {return this._ctx}
    get initPositions() {return this._initPositions}
    get positions() {return this._positions}
    get isLinear() {return this._isLinear}
	get colorStops() {return this._colorStops}
	get rotation() {return typeof this.#getFormatedIsLinear()==="number" ? this._isLinear : null}
    get gradient() {
        // Automatic dynamic positions updates when using a shape instance
        if (this._initPositions instanceof Shape || this._initPositions instanceof Dot) this.updateGradient()
        return this._gradient
    }
	set ctx(_ctx) {this._ctx = _ctx}
    set initPositions(initPositions) {this._initPositions = initPositions}
	set positions(_positions) {this._positions = _positions}
	set colorStops(_colorStops) {this._colorStops = _colorStops.map(([stop, color])=>[stop, Color.adjust(color)])}
    set isLinear(isLinear) {this._isLinear = isLinear}
	set rotation(deg) {this._isLinear = typeof deg==="number" ? deg%360 : this._isLinear}
}