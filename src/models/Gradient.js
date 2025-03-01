// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Allows the creation of custom gradients
class Gradient extends _DynamicColor {
    static TYPES = {LINEAR:"Linear", RADIAL:"Radial", CONIC:"Conic"}
    static DEFAULT_TYPE = Gradient.TYPES.LINEAR
    static SERIALIZATION_SEPARATOR = "*"
    static SERIALIZATION_COLOR_STOPS_SEPARATOR = "$"

    #lastRotation = null
    #lastType = null
    constructor(ctx, positions, colorStops, type, rotation) {
        super(
            positions, // linear:[[x1,y1],[x2,y2]] | radial:[[x1, y1, r1],[x2,y2,r2]] | conic:[x,y] | Shape | Dot
            rotation   // rotation of the gradient, not applicable for radial type
        ) 
        this._ctx = ctx.ctx??ctx                 // canvas context
        this._type = type||Gradient.DEFAULT_TYPE // type of gradient
        this._colorStops = colorStops.map(([stop, color])=>[stop, Color.adjust(color)]) // ex: [[0..1, Color], [0.5, Color], [1, Color]]
        this.update()
    }

    /**
     * Given an canvas object, returns automatic positions values for linear, radial or conic gradients
     * @param {Shape|Dot|TextDisplay} obj: Inheritor of _Obj
     * @returns the new calculated positions or the current value of this._positions if the parameter 'obj' isn't an instance of a canvas object
     */
    getAutomaticPositions(obj=this._initPositions) {
        if (obj instanceof Shape) {
            if (this.#hasFoundamentalsChanged() || this.#hasShapeChanged(obj)) {
                const rangeX = CDEUtils.getMinMax(obj.dots, "x"), rangeY = CDEUtils.getMinMax(obj.dots, "y"),
                    smallestX = rangeX[0], smallestY = rangeY[0], biggestX = rangeX[1], biggestY = rangeY[1],
                    cx = smallestX+(biggestX-smallestX)/2, cy = smallestY+(biggestY-smallestY)/2
                if (this._type===Gradient.TYPES.LINEAR) return this.#getLinearPositions(smallestX-cx, smallestY-cy, biggestX-cx, biggestY-cy, cx, cy)
                else if (this._type===Gradient.TYPES.RADIAL) return this.#getRadialPositions(cx, cy, Math.max(biggestX-smallestX, biggestY-smallestY))
                else return obj.getCenter()
            } else return this._positions
        } else if (obj instanceof Dot) {
            if (this.#hasFoundamentalsChanged() || this.#hasDotChanged(obj)) {
                if (this._type===Gradient.TYPES.LINEAR) return this.#getLinearPositions(obj.left-obj.x, obj.top-obj.y, obj.right-obj.x, obj.bottom-obj.y, obj.x, obj.y)
                else if (this._type===Gradient.TYPES.RADIAL) return this.#getRadialPositions(obj.x, obj.y, obj.radius)
                else return obj.pos_
            } return this._positions
        } else if (obj instanceof TextDisplay) {
            if (this.#hasFoundamentalsChanged() || this.#hasTextDisplayChanged(obj)) {
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
        if (currentDotsPos !== this._lastChangeValue) {
            this._lastChangeValue = currentDotsPos
            return true
        } else return false
    }
    
    #hasDotChanged(dot) {
        const currentDotPos = dot.stringPos
        if (currentDotPos !== this._lastChangeValue) {
            this._lastChangeValue = currentDotPos
            return true
        } else return false
    }

    #hasTextDisplayChanged(textDisplay) {
        const pos = textDisplay.trueSize+textDisplay.pos
        if (pos !== this._lastChangeValue) {
            this._lastChangeValue = pos
            return true
        } else return false
    }

    // Creates and returns the gradient. Updates it if the initPositions is a Shape/Dot/TextDisplay instance
    update() {
        if (this._initPositions !== _DynamicColor.PLACEHOLDER) return this._value = Gradient.getCanvasGradient(this._ctx, this._positions = this.getAutomaticPositions(), this._colorStops, this._type, this._rotation)
    }

    // returns a CanvasGradient instance from the provided parameters
    static getCanvasGradient(ctx, positions, colorStops, type, rotation) {
        const canvasGradient = type===Gradient.TYPES.CONIC ? ctx.createConicGradient(CDEUtils.toRad(rotation), positions[0], positions[1]) : ctx[`create${type}Gradient`](...positions[0], ...positions[1]), cs_ll = colorStops.length
        for (let i=0;i<cs_ll;i++) canvasGradient.addColorStop(colorStops[i][0], Color.getColorValue(colorStops[i][1]))
        return canvasGradient
    }

    // returns a separate copy of the Gradient
    duplicate(positions=this._positions, ctx=this._ctx, colorStops=this._colorStops, type=this._type, rotation=this._rotation) {
        return new Gradient(ctx, CDEUtils.unlinkArr22(positions), [...colorStops], type, rotation)
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
    get type() {return this._type}
	get colorStops() {return this._colorStops}

	set colorStops(_colorStops) {
        this._colorStops = _colorStops.map(([stop, color])=>[stop, Color.adjust(color)])
        if (!this.isDynamic) this.update()
    }
    set type(type) {
        this._type = type
        if (!this.isDynamic) this.update()
    }

}