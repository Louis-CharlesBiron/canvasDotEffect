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
    static SERIALIZATION_COLOR_STOPS_SEPARATOR = "$"

    #lastRotation = null
    #lastType = null
    #lastDotsPos = null
    #lastDotPos = null
    #lastTextPos = null
    constructor(ctx, positions, colorStops, type, rotation) {
        this._ctx = ctx                          // canvas context
        this._initPositions = positions          // linear:[[x1,y1],[x2,y2]] | radial:[[x1, y1, r1],[x2,y2,r2]] | conic:[x,y] | Shape | Dot
        this._type = type||Gradient.DEFAULT_TYPE // type of gradient
        this._positions = this._initPositions    // usable positions from initPositions
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
            if (this.#hasFoundamentalsChanged() || this.#hasShapeChanged(obj) || disableOptimization) {
                const rangeX = CDEUtils.getMinMax(obj.dots, "x"), rangeY = CDEUtils.getMinMax(obj.dots, "y"),
                    smallestX = rangeX[0], smallestY = rangeY[0], biggestX = rangeX[1], biggestY = rangeY[1],
                    cx = smallestX+(biggestX-smallestX)/2, cy = smallestY+(biggestY-smallestY)/2
                if (this._type===Gradient.TYPES.LINEAR) return this.#getLinearPositions(smallestX-cx, smallestY-cy, biggestX-cx, biggestY-cy, cx, cy)
                else if (this._type===Gradient.TYPES.RADIAL) return this.#getRadialPositions(cx, cy, Math.max(biggestX-smallestX, biggestY-smallestY))
                else return obj.getCenter()
            } else return this._positions
        } else if (obj instanceof Dot) {
            if (this.#hasFoundamentalsChanged() || this.#hasDotChanged(obj) || disableOptimization) {
                if (this._type===Gradient.TYPES.LINEAR) return this.#getLinearPositions(obj.left-obj.x, obj.top-obj.y, obj.right-obj.x, obj.bottom-obj.y, obj.x, obj.y)
                else if (this._type===Gradient.TYPES.RADIAL) return this.#getRadialPositions(obj.x, obj.y, obj.radius)
                else return obj.pos_
            } return this._positions
        } else if (obj instanceof TextDisplay) {
            if (this.#hasFoundamentalsChanged() || this.#hasTextDisplayChanged(obj) || disableOptimization) {
                const [width, height] = obj.trueSize, [cx, cy] = obj.pos, left = cx-width/2, right = cx+width/2, top = cy-height/2, bottom = cy+height/2
                if (this._type===Gradient.TYPES.LINEAR) return this.#getLinearPositions(left-cx, top-cy, right-cx, bottom-cy, cx, cy)
                else if (this._type===Gradient.TYPES.RADIAL) return this.#getRadialPositions(cx, cy, Math.max(right-left, bottom-top))
                else return obj.pos_
            } return this._positions
        } else if (this._type===Gradient.TYPES.LINEAR) {
            const [[x, y], [x2, y2]] = obj, cx = x+(x2-x)/2, cy = y+(y2-y)/2
            return this.#getLinearPositions(x-cx, y-cy, x2-cx, y2-cy, cx, cy)
        } else return this._positions
    }

    #getLinearPositions(x, y, x2, y2, cx, cy) {
        const cosV = Math.cos(CDEUtils.toRad(this._rotation)), sinV = Math.sin(CDEUtils.toRad(this._rotation))
        return [[CDEUtils.round((x*cosV-y*sinV)+cx), CDEUtils.round((x*sinV+y*cosV)+cy)], [CDEUtils.round((x2*cosV-y2*sinV)+cx), CDEUtils.round((x2*sinV+y2*cosV)+cy)]]
    }

    #getRadialPositions(x, y, coverRadius) {
        return [[x, y, coverRadius], [x, y, coverRadius*0.25]]
    }

    #hasFoundamentalsChanged() {
        if (this.#lastRotation !== this._rotation || this.#lastType !== this._type) {
            this.#lastRotation = this._rotation
            this.#lastType = this._type
            return true
        } else return false
    }

    #hasShapeChanged(shape) {
        const currentDotsPos = shape.dotsPositions
        if (currentDotsPos !== this.#lastDotsPos) {
            this.#lastDotsPos = currentDotsPos
            return true
        } else return false
    }
    
    #hasDotChanged(dot) {
        const currentDotPos = dot.stringPos
        if (currentDotPos !== this.#lastDotPos) {
            this.#lastDotPos = currentDotPos
            return true
        } else return false
    }

    #hasTextDisplayChanged(textDisplay) {
        const pos = textDisplay.trueSize+textDisplay.pos
        if (pos !== this.#lastTextPos) {
            this.#lastTextPos = pos
            return true
        } else return false
    }

    // Creates and returns the gradient. Updates it if the initPositions is a Shape/Dot/TextDisplay instance
    updateGradient() {
        if (this._initPositions !== Gradient.PLACEHOLDER) return this._gradient = Gradient.getCanvasGradient(this._ctx, this._positions = this.getAutomaticPositions(), this._colorStops, this._type, this._rotation)
    }

    // returns a CanvasGradient instance from the provided parameters
    static getCanvasGradient(ctx, positions, colorStops, type, rotation) {
        const canvasGradient = type===Gradient.TYPES.CONIC ? ctx.createConicGradient(CDEUtils.toRad(rotation), positions[0], positions[1]) : ctx[`create${type}Gradient`](...positions[0], ...positions[1]), cs_ll = colorStops.length
        for (let i=0;i<cs_ll;i++) canvasGradient.addColorStop(colorStops[i][0], Color.getColorValue(colorStops[i][1]))
        return canvasGradient
    }

    toString() {
        const sep = Gradient.SERIALIZATION_SEPARATOR
        return this._positions+sep+this._colorStops.flat().join(Gradient.SERIALIZATION_COLOR_STOPS_SEPARATOR)+sep+this._type+sep+this._rotation
    }

    // returns a CanvasGradient instance from a serialized Gradient string
    static getCanvasGradientFromString(ctx, str) {
        let [positions, colorStops, type, rotation] = str.split(Gradient.SERIALIZATION_SEPARATOR), splitPositions = positions.split(","), splitColorStops = colorStops.split(Gradient.SERIALIZATION_COLOR_STOPS_SEPARATOR), scs_ll = splitColorStops.length

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
	get isDynamic() {return this._initPositions instanceof Shape || this._initPositions instanceof Dot || this._initPositions instanceof TextDisplay}
    get gradient() {
        // Automatic dynamic positions updates when using a shape instance
        if (this.isDynamic) this.updateGradient()
        return this._gradient
    }

    set initPositions(initPositions) {this._initPositions = initPositions}
	set positions(_positions) {
        this._positions = _positions
        if (!this.isDynamic) this.updateGradient()
    }
	set colorStops(_colorStops) {
        this._colorStops = _colorStops.map(([stop, color])=>[stop, Color.adjust(color)])
        if (!this.isDynamic) this.updateGradient()
    }
    set type(type) {this._type = type}
	set rotation(deg) {
        this._rotation = CDEUtils.round(deg, 2)%350
        if (!this.isDynamic) this.updateGradient()
    }
}