// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Represents a styling profile for paths
class RenderStyles extends _HasColor {
    static JOIN_TYPES = {MITER:"miter", BEVEL:"bevel", ROUND:"round"} // spiky, flat, round
    static CAP_TYPES = {BUTT:"butt", SQUARE:"square", ROUND:"round"}  // short, long, round
    static DEFAULT_WIDTH = 2
    static DEFAULT_CAP = RenderStyles.CAP_TYPES.ROUND
    static DEFAULT_JOIN = RenderStyles.JOIN_TYPES.MITER
    static DEFAULT_DASH = []
    static DEFAULT_DASH_OFFSET = 0
    static SERIALIZATION_SEPARATOR = "%"
    static DEFAULT_PROFILE = new RenderStyles(null, Color.DEFAULT_RGBA, RenderStyles.DEFAULT_WIDTH, RenderStyles.DEFAULT_DASH, RenderStyles.DEFAULT_DASH_OFFSET, RenderStyles.DEFAULT_JOIN, RenderStyles.DEFAULT_CAP)

    #ctx = null
    constructor(render, color, lineWidth, lineDash, lineDashOffset, lineJoin, lineCap) {
        super(color)
        if (render) this.color = this.getInitColor()
        this._render = render                                                   // Canvas render instance
        this.#ctx = render?.ctx                                                 // Canvas context
        this._lineWidth = lineWidth??RenderStyles.DEFAULT_WIDTH                 // width of drawn line
        this._lineDash = lineDash??RenderStyles.DEFAULT_DASH                    // gaps length within the line
        this._lineDashOffset = lineDashOffset??RenderStyles.DEFAULT_DASH_OFFSET // line gaps offset
        this._lineJoin = lineJoin??RenderStyles.DEFAULT_JOIN                    // determines the shape of line joins
        this._lineCap = lineCap??RenderStyles.DEFAULT_CAP                       // determines the shape of line ends
    }

    // returns a separate copy of the profile
    duplicate(render=this._render, color=this._color, lineWidth=this._lineWidth, lineDash=this._lineDash, lineDashOffset=this._lineDashOffset, lineJoin=this._lineJoin, lineCap=this._lineCap) {
        return new RenderStyles(render, color, lineWidth, lineDash, lineDashOffset, lineJoin, lineCap)
    }

    // returns the profile's styles as an array
    getStyles() {
        return [this._lineWidth, this._lineDash, this._lineDashOffset, this._lineJoin, this._lineCap]
    }

    // serializes the styles profile
    toString(color=this._color, lineWidth=this._lineWidth, lineDash=this._lineDash, lineDashOffset=this._lineDashOffset, lineJoin=this._lineJoin, lineCap=this._lineCap) {
        let sep = RenderStyles.SERIALIZATION_SEPARATOR, colorValue = Color.getColorValue(color)
        if (colorValue instanceof CanvasGradient) colorValue = color.toString()
        return colorValue+sep+lineWidth+sep+lineDash+sep+lineDashOffset+sep+lineJoin+sep+lineCap
    }

    // serializes the styles profile, but only the color value
    colorOnlyToString(color=this._color) {
        let colorValue = Color.getColorValue(color)
        if (colorValue instanceof CanvasGradient) colorValue = color.toString()
        return colorValue
    }

    // updates a profile's attributes and returns the updated version
    updateStyles(color, lineWidth, lineDash, lineDashOffset, lineJoin, lineCap) {
        if (color) this.color = color
        if (lineWidth) this._lineWidth = lineWidth
        if (lineDash) this._lineDash = lineDash
        if (lineDashOffset) this._lineDashOffset = lineDashOffset
        if (lineJoin) this._lineJoin = lineJoin
        if (lineCap) this._lineCap = lineCap
        return this
    }

    // directly applies the styles of the profile
    applyStyles(color=this._color, lineWidth=this._lineWidth, lineDash=this._lineDash, lineDashOffset=this._lineDashOffset, lineJoin=this._lineJoin, lineCap=this._lineCap) {
        const ctx = this.#ctx, colorValue = Color.getColorValue(color), currentStyles = this._render.currentCtxStyles
        if (color && this._render.currentCtxColor !== colorValue) this._render.currentCtxColor = ctx.strokeStyle = ctx.fillStyle = colorValue
        if (lineWidth && currentStyles[0] !== lineWidth) currentStyles[0] = ctx.lineWidth = lineWidth
        if (lineDash) {
            const lineDashString = lineDash.toString()
            if (currentStyles[1] !== lineDashString) {
                currentStyles[1] = lineDashString
                ctx.setLineDash(lineDash)
            }
        }
        if (lineDashOffset && currentStyles[2] !== lineDashOffset) currentStyles[2] = ctx.lineDashOffset = lineDashOffset
        if (lineJoin && currentStyles[3] !== lineJoin) currentStyles[3] = ctx.lineJoin = lineJoin
        if (lineCap && currentStyles[4] !== lineCap) currentStyles[4] = ctx.lineCap = lineCap
    }

    // directly applies the provided styles
    static applyStyles(render, color, lineWidth, lineDash, lineDashOffset, lineJoin, lineCap) {
        const ctx = render.ctx, colorValue = Color.getColorValue(color), currentStyles = render.currentCtxStyles
        if (color && render.currentCtxColor !== colorValue) render.currentCtxColor = ctx.strokeStyle = ctx.fillStyle = colorValue
        if (lineWidth && currentStyles[0] !== lineWidth) currentStyles[0] = ctx.lineWidth = lineWidth
        if (lineDash) {
            const lineDashString = lineDash.toString()
            if (currentStyles[1] !== lineDashString) {
                currentStyles[1] = lineDashString
                ctx.setLineDash(lineDash)
            }
        }
        if (lineDashOffset && currentStyles[2] !== lineDashOffset) currentStyles[2] = ctx.lineDashOffset = lineDashOffset
        if (lineJoin && currentStyles[3] !== lineJoin) currentStyles[3] = ctx.lineJoin = lineJoin
        if (lineCap && currentStyles[4] !== lineCap) currentStyles[4] = ctx.lineCap = lineCap
    }


	get render() {return this._render}
	get lineWidth() {return this._lineWidth}
	get lineCap() {return this._lineCap}
	get lineJoin() {return this._lineJoin}
	get lineDash() {return this._lineDash}
	get lineDashOffset() {return this._lineDashOffset}

	set render(render) {
        this._render = render
        this.#ctx = render.ctx
    }
	set lineWidth(_lineWidth) {return this._lineWidth = _lineWidth}
	set lineCap(_lineCap) {return this._lineCap = _lineCap}
	set lineJoin(_lineJoin) {return this._lineJoin = _lineJoin}
	set lineDash(_lineDash) {return this._lineDash = _lineDash}
	set lineDashOffset(_lineDashOffset) {return this._lineDashOffset = _lineDashOffset}
}