// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Allows the creation of custom gradients
class Gradient {
    static PLACEHOLDER = "PLACERHOLDER" // can be used to instantiate a Gradient without positions, and apply that of the object on assignement
    static TYPES = {LINEAR:"Linear", RADIAL:"Radial", CONIC:"Conic"}
    static DEFAULT_TYPE = Gradient.TYPES.LINEAR
    static SERIALIZATION_SEPARATOR = "*"

    #lastDotsPos = null
    #lastRotation = null
    #lastDotPos = null
    constructor(ctx, positions, colorStops, type, rotation) {
        this._ctx = ctx                                                     // canvas context
        this._initPositions = positions                                     // linear:[[x1,y1],[x2,y2]] | radial:[[x1, y1, r1],[x2,y2,r2]] | conic:[x,y] | Shape | Dot
        this._type = type||Gradient.DEFAULT_TYPE                            // type of gradient
        this._positions = this.getAutomaticPositions()??this._initPositions // usable positions from initPositions
        this._colorStops = colorStops.map(([stop, color])=>[stop, Color.adjust(color)]) // ex: [[0..1, Color], [0.5, Color], [1, Color]]
        this._rotation = rotation??0

        this._gradient = null // useable as a fillStyle
        this.updateGradient()
    }

    // returns a separate copy of the Gradient
    duplicate(positions=this._positions) {
        return new Gradient(this._ctx, Array.isArray(positions) ? [...positions] : positions, [...this._colorStops], this._type, this._rotation)
    }

    /**
     * Given a shape, returns automatic positions values for linear or radial gradients
     * @param {Shape} obj: Instance of Shape or inheriting shape 
     * @param {boolean} disableOptimization: if false, recalculates positions only when a dot changes pos (set to true only for manual usage of this function) 
     * @returns the new calculated positions or the current value of this._positions if the parameter 'shape' isn't an instance of Shape
     */
    getAutomaticPositions(obj=this._initPositions, disableOptimization=false) {
        if (obj instanceof Shape) {
            if (this.#hasShapeChanged(obj) || disableOptimization) {
                const rangeX = CDEUtils.getMinMax(obj.dots, "x"), rangeY = CDEUtils.getMinMax(obj.dots, "y"),
                    smallestX = rangeX[0], smallestY = rangeY[0], biggestX = rangeX[1], biggestY = rangeY[1],
                    cx = smallestX+(biggestX-smallestX)/2, cy = smallestY+(biggestY-smallestY)/2
                if (this._type===Gradient.TYPES.LINEAR) return this.#getLinearPositions(smallestX-cx, smallestY-cy, biggestX-cx, biggestY-cy, cx, cy)
                else if (this._type===Gradient.TYPES.RADIAL) return this.#getRadialPositions(cx, cy, Math.max(biggestX-smallestX, biggestY-smallestY))
                else return obj.getCenter()
            } else return this._positions
        } else if (obj instanceof Dot) {
            if (this.#hasDotChanged(obj) || disableOptimization) {
                if (this._type===Gradient.TYPES.LINEAR) return this.#getLinearPositions(obj.left-obj.x, obj.top-obj.y, obj.right-obj.x, obj.bottom-obj.y, obj.x, obj.y)
                else if (this._type===Gradient.TYPES.RADIAL) return this.#getRadialPositions(obj.x, obj.y, obj.radius)
                else return obj.pos_
            } return this._positions
        } else return this._positions
    }

    #getLinearPositions(x, y, x2, y2, cx, cy) {
        const cosV = Math.cos(CDEUtils.toRad(this._rotation)), sinV = Math.sin(CDEUtils.toRad(this._rotation))
        return [[(x*cosV-y*sinV)+cx, (x*sinV+y*cosV)+cy], [(x2*cosV-y2*sinV)+cx, (x2*sinV+y2*cosV)+cy]]
    }

    #getRadialPositions(x, y, coverRadius) {
        return [[x, y, coverRadius],[x, y, coverRadius*0.25]]
    }

    #hasShapeChanged(shape) {
        const currentDotsPos = shape.dotsPositions
        if (this.#lastRotation !== this._rotation || currentDotsPos !== this.#lastDotsPos) {
            this.#lastDotsPos = currentDotsPos
            this.#lastRotation = this._rotation
            return true
        } else return false
    }
    
    #hasDotChanged(dot) {
        const currentDotPos = dot.stringPos
        if (this.#lastRotation !== this._rotation || currentDotPos !== this.#lastDotPos) {
            this.#lastDotPos = currentDotPos
            this.#lastRotation = this._rotation
            return true
        } else return false
    }

    // Creates and returns the gradient. Updates it if the initPositions is a Shape/Dot instance
    updateGradient() {
        if (this._initPositions !== Gradient.PLACEHOLDER) return this._gradient = Gradient.getCanvasGradient(this._ctx, this._positions = this.getAutomaticPositions(), this._colorStops, this._type, this._rotation)
    }

    // DOC TODO
    static getCanvasGradient(ctx, positions, colorStops, type, rotation) {
        const canvasGradient = type===Gradient.TYPES.CONIC ? ctx.createConicGradient(CDEUtils.toRad(rotation), ...positions) : ctx[`create${type}Gradient`](...positions[0], ...positions[1]), cs_ll = colorStops.length
        for (let i=0;i<cs_ll;i++) canvasGradient.addColorStop(colorStops[i][0], Color.getColorValue(colorStops[i][1]))
        return canvasGradient
    }

    toString() {
        const sep = Gradient.SERIALIZATION_SEPARATOR
        return this._positions+sep+this._colorStops+sep+this._type+sep+this._rotation
    }

    // DOC TODO
    static getCanvasGradientFromString(ctx, str) {
        let [positions, colorStops, type, rotation] = str.split(Gradient.SERIALIZATION_SEPARATOR), splitPositions = positions.split(","), splitColorStops = colorStops.split(","), scs_ll = splitColorStops.length

        positions = splitPositions.length===2 ? [+splitPositions[0], +splitPositions[1]] : [[+splitPositions[0], +splitPositions[1]], [+splitPositions[2], +splitPositions[3]]]
        colorStops = []
        for (let i=0;i<scs_ll;i+=2) colorStops.push([+splitColorStops[i], splitColorStops[i+1]])
        
        return Gradient.getCanvasGradient(ctx, positions, colorStops, type, +rotation)
    }

    get ctx() {return this._ctx}
    get initPositions() {return this._initPositions}
    get positions() {return this._positions}
    get type() {return this._type}
	get colorStops() {return this._colorStops}
	get rotation() {return this._rotation}
    get gradient() {
        // Automatic dynamic positions updates when using a shape instance
        if (this._initPositions instanceof Shape || this._initPositions instanceof Dot) this.updateGradient()
        return this._gradient
    }
	set ctx(_ctx) {this._ctx = _ctx}
    set initPositions(initPositions) {this._initPositions = initPositions}
	set positions(_positions) {this._positions = _positions}
	set colorStops(_colorStops) {this._colorStops = _colorStops.map(([stop, color])=>[stop, Color.adjust(color)])}
    set type(type) {this._type = type}
	set rotation(deg) {this._rotation = CDEUtils.round(deg, 2)}
}