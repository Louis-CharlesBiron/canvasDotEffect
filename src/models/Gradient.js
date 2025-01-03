// Allows the creation of custom gradients
class Gradient {
    #lastDotsPos = null
    #lastRotation = null
    constructor(ctx, positions, isLinear=0, ...colorStops) {
        this._ctx = ctx                                      // canvas context
        this._isLinear = this.#getFormatedIsLinear(isLinear) // whether the gradient is linear or radial (if a number, acts as the rotation in degrees of linear gradient)
        this._initPositions = positions                      // linear:[[x1,y1],[x2,y2]] | radial:[[x1, y1, r1],[x2,y2,r2]] | Shape
        this._positions = this.getAutomaticPositions()       // usable positions from initPositions

        this._colorStops = colorStops.flat()                 // ex: [[0..1, color], [0.5, "red"], [1, "blue"]]

        this._gradient = null                                // useable as a fillStyle
        this.updateGradient()
    }

    // returns a the gradient rotation in degrees or false if radial gradient
    #getFormatedIsLinear(isLinear=this._isLinear) {
        return typeof isLinear=="number" ? isLinear : isLinear==true ? 0 : false
    }

    /**
     * Given a shape, returns automatic positions values for linear or radial gradients
     * @param {Shape} shape: Instance of Shape or inheriting shape 
     * @param {boolean} optimize: if enabled recalculates positions only when a dot changes pos (disable only for manual usage of this function) 
     * @returns the new calculated positions or the current value of this._positions if the parameter 'shape' isn't an instance of Shape
     */
    getAutomaticPositions(shape=this._initPositions, optimize=true) {
        if (shape instanceof Shape) {
            let currentDotPos = optimize ? shape.dotsPositions : null
            if (!optimize || this.#lastRotation !== this._isLinear || currentDotPos !== this.#lastDotsPos) {
                this.#lastDotsPos = currentDotPos
                this.#lastRotation = this._isLinear

                const rangeX = getMinMax(shape.dots, "x"), rangeY = getMinMax(shape.dots, "y"),
                    smallestX = rangeX[0], smallestY = rangeY[0],
                    biggestX = rangeX[1], biggestY = rangeY[1],
                    cx = smallestX+(biggestX-smallestX)/2, cy = smallestY+(biggestY-smallestY)/2

                if (this.#getFormatedIsLinear() !== false) {
                    let x = smallestX-cx, y = smallestY-cy, x2 = biggestX-cx, y2 = biggestY-cy,
                        cosV = Math.cos(toRad(this.#getFormatedIsLinear())), sinV = Math.sin(toRad(this.#getFormatedIsLinear()))
                    return [[(x*cosV-y*sinV)+cx, (x*sinV+y*cosV)+cy], [(x2*cosV-y2*sinV)+cx, (x2*sinV+y2*cosV)+cy]]
                } else {
                    let coverRadius = Math.max(biggestX-smallestX, biggestY-smallestY)
                    return [[cx, cy, coverRadius],[cx, cy, coverRadius*0.25]]
                }
            } else return this._positions
        } else return this._positions
    }

    // Creates and returns the gradient. Updates it if the initPositions is a Shape instance
    updateGradient() {
        this._positions = this.getAutomaticPositions()
        this._gradient = this._ctx[`create${typeof this.#getFormatedIsLinear()=="number"?"Linear":"Radial"}Gradient`](...this._positions[0], ...this._positions[1])
        let cs_ll = this._colorStops.length
        for (let i=0;i<cs_ll;i++) this._gradient.addColorStop(this._colorStops[i][0], formatColor(this._colorStops[i][1]))
        return this._gradient
    }


    get ctx() {return this._ctx}
    get initPositions() {return this._initPositions}
    get positions() {return this._positions}
    get isLinear() {return this._isLinear}
	get colorStops() {return this._colorStops}
	get rotation() {return typeof this.#getFormatedIsLinear()=="number" ? this._isLinear : null}
    get gradient() {
        // Automatic dynamic positions updates when using a shape instance
        if (this._initPositions instanceof Shape) this.updateGradient()
        return this._gradient
    }
	set ctx(_ctx) {return this._ctx = _ctx}
	set positions(_positions) {return this._positions = _positions}
	set colorStops(_colorStops) {return this._colorStops = _colorStops}
    set isLinear(isLinear) {return this._isLinear = isLinear}
	set rotation(deg) {return this._isLinear = typeof deg=="number" ? deg%360 : this._isLinear}
}