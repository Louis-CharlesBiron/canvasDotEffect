// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Represents styling profile for lines
class RenderStyles extends _HasColor {
    static JOIN_TYPES = {MITER:"miter", BEVEL:"bevel", ROUND:"round"} // spiky, flat, round
    static CAP_TYPES = {BUTT:"butt", SQUARE:"square", ROUND:"round"}  // short, long, round
    static DEFAULT_WIDTH = 2
    static DEFAULT_CAP = RenderStyles.CAP_TYPES.ROUND
    static DEFAULT_JOIN = RenderStyles.JOIN_TYPES.MITER
    static DEFAULT_DASH = []
    static DEFAULT_DASH_OFFSET = 0
    static DEFAULT_PROFILE = new RenderStyles(null, Color.DEFAULT_RGBA, RenderStyles.DEFAULT_WIDTH, RenderStyles.DEFAULT_DASH, RenderStyles.DEFAULT_DASH_OFFSET, RenderStyles.DEFAULT_JOIN, RenderStyles.DEFAULT_CAP)
    static PROFILE1 = RenderStyles.getNewProfile()
    static PROFILE2 = RenderStyles.getNewProfile()
    static PROFILE3 = RenderStyles.getNewProfile()
    static PROFILES = []
    static SERIALIZATION_SEPARATOR = "%"
    static #currentCtxStyles = RenderStyles.DEFAULT_PROFILE.#getStyles()

    constructor(ctx, color, lineWidth, lineDash, lineDashOffset, lineJoin, lineCap) {
        super(color)
        this._ctx = ctx                                                         // Canvas context
        this._lineWidth = lineWidth??RenderStyles.DEFAULT_WIDTH                 // width of drawn line
        this._lineDash = lineDash??RenderStyles.DEFAULT_DASH                    // gaps length within the line
        this._lineDashOffset = lineDashOffset??RenderStyles.DEFAULT_DASH_OFFSET // line gaps offset
        this._lineJoin = lineJoin??RenderStyles.DEFAULT_JOIN                    // determines the shape of line joins
        this._lineCap = lineCap??RenderStyles.DEFAULT_CAP                       // determines the shape of line ends
    }

    // Ran on any Canvas instance creation, sets the ctx property off default
    static initializeDefaultProfiles(ctx) {
        RenderStyles.PROFILE1.ctx = RenderStyles.PROFILE2.ctx = RenderStyles.PROFILE3.ctx = RenderStyles.DEFAULT_PROFILE.ctx = ctx
    }

    // returns a new profile based on the DEFAULT_PROFILE
    static getNewProfile() {
        return RenderStyles.DEFAULT_PROFILE.duplicate()
    }

    // returns a separate copy of the profile
    duplicate() {
        return new RenderStyles(this._ctx, this._color, this._lineWidth, this._lineDash, this._lineDashOffset, this._lineJoin, this._lineCap)
    }

    // returns the profile's styles as an array
    #getStyles() {
        return [this.color, this._lineWidth, this._lineDash, this._lineDashOffset, this._lineJoin, this._lineCap]
    }

    toString(color=this._color, lineWidth=this._lineWidth, lineDash=this._lineDash, lineDashOffset=this._lineDashOffset, lineJoin=this._lineJoin, lineCap=this._lineCap) {
        let sep = RenderStyles.SERIALIZATION_SEPARATOR, colorValue = Color.getColorValue(color)
        if (colorValue instanceof CanvasGradient) colorValue = color.toString()
        return colorValue+sep+lineWidth+sep+lineDash+sep+lineDashOffset+sep+lineJoin+sep+lineCap
    }

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
        const ctx = this._ctx, colorValue = Color.getColorValue(color), currentStyles = RenderStyles.#currentCtxStyles
        if (color && currentStyles[0] !== colorValue) currentStyles[0] = ctx.strokeStyle = ctx.fillStyle = colorValue
        if (lineWidth && currentStyles[1] !== lineWidth) currentStyles[1] = ctx.lineWidth = lineWidth
        if (lineDash) {
            const lineDashString = lineDash.toString()
            if (currentStyles[2] !== lineDashString) {
                currentStyles[2] = lineDashString
                ctx.setLineDash(lineDash)
            }
        }
        if (lineDashOffset && currentStyles[3] !== lineDashOffset) currentStyles[3] = ctx.lineDashOffset = lineDashOffset
        if (lineJoin && currentStyles[4] !== lineJoin) currentStyles[4] = ctx.lineJoin = lineJoin
        if (lineCap && currentStyles[5] !== lineCap) currentStyles[5] = ctx.lineCap = lineCap
    }

    // directly applies the provided styles
    static applyStyles(ctx, color, lineWidth, lineDash, lineDashOffset, lineJoin, lineCap) {
        const colorValue = Color.getColorValue(color), currentStyles = RenderStyles.#currentCtxStyles
        if (color && currentStyles[0] !== colorValue) currentStyles[0] = ctx.strokeStyle = ctx.fillStyle = colorValue
        if (lineWidth && currentStyles[1] !== lineWidth) currentStyles[1] = ctx.lineWidth = lineWidth
        if (lineDash) {
            const lineDashString = lineDash.toString()
            if (currentStyles[2] !== lineDashString) {
                currentStyles[2] = lineDashString
                ctx.setLineDash(lineDash)
            }
        }
        if (lineDashOffset && currentStyles[3] !== lineDashOffset) currentStyles[3] = ctx.lineDashOffset = lineDashOffset
        if (lineJoin && currentStyles[4] !== lineJoin) currentStyles[4] = ctx.lineJoin = lineJoin
        if (lineCap && currentStyles[5] !== lineCap) currentStyles[5] = ctx.lineCap = lineCap
    }

	get ctx() {return this._ctx}
	get lineWidth() {return this._lineWidth}
	get lineCap() {return this._lineCap}
	get lineJoin() {return this._lineJoin}
	get lineDash() {return this._lineDash}
	get lineDashOffset() {return this._lineDashOffset}

	set ctx(ctx) {this._ctx = ctx}
	set lineWidth(_lineWidth) {return this._lineWidth = _lineWidth}
	set lineCap(_lineCap) {return this._lineCap = _lineCap}
	set lineJoin(_lineJoin) {return this._lineJoin = _lineJoin}
	set lineDash(_lineDash) {return this._lineDash = _lineDash}
	set lineDashOffset(_lineDashOffset) {return this._lineDashOffset = _lineDashOffset}
}