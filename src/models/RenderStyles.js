// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

class RenderStyles extends _HasColor {
    static JOIN_TYPES = {MITER:"miter", BEVEL:"bevel", ROUND:"round"} // spiky, flat, round
    static CAP_TYPES = {BUTT:"butt", SQUARE:"square", ROUND:"round"}  // short, long, round
    static DEFAULT_WIDTH = 2
    static DEFAULT_CAP = RenderStyles.CAP_TYPES.ROUND
    static DEFAULT_JOIN = RenderStyles.JOIN_TYPES.MITER
    static DEFAULT_DASH = []
    static DEFAULT_DASH_OFFSET = 0
    static SERIALIZATION_SEPARATOR = "%"
    static DEFAULT_PROFILE = new RenderStyles(null, Color.DEFAULT_RGBA, Render.DEFAULT_FILTER, Render.DEFAULT_COMPOSITE_OPERATION, Render.DEFAULT_ALPHA, RenderStyles.DEFAULT_WIDTH, RenderStyles.DEFAULT_DASH, RenderStyles.DEFAULT_DASH_OFFSET, RenderStyles.DEFAULT_JOIN, RenderStyles.DEFAULT_CAP)

    #ctx = null

    /**
     * Represents a styling profile for paths
     * @param {Render} render: the render instance to link to
     * @param {Color | [r,g,b,a]?} color: the color to use
     * @param {String?} filter: the filter value, as a CSS filter
     * @param {Render.COMPOSITE_OPERATIONS?} compositeOperation: the composite operation used (/!\ Some composite operations are invasive)
     * @param {Number?} opacity: the opacity level, as a number from 0..1
     * @param {Number?} lineWidth: the width of stroked lines, in pixel
     * @param {Number | Array ?} lineDash: the line dash distance(s), in pixel
     * @param {Number?} lineDashOffset: the offset of line dashes, in pixel
     * @param {RenderStyles.JOIN_TYPES?} lineJoin: the line join style
     * @param {RenderStyles.CAP_TYPES?} lineCap: the line cap style
     */
    constructor(render, color, filter, compositeOperation, opacity, lineWidth, lineDash, lineDashOffset, lineJoin, lineCap) {
        super(color)
        if (render) this.color = this.getInitColor()
        this._id = Render.PROFILE_ID_GIVER++                                             // profile id
        this._render = render                                                            // Canvas render instance
        this.#ctx = render?.ctx                                                          // Canvas context
        this._filter = filter??Render.DEFAULT_FILTER                                     // filter value 
        this._compositeOperation = compositeOperation??Render.DEFAULT_COMPOSITE_OPERATION// composite operation used        
        this._opacity = opacity??Render.DEFAULT_ALPHA                                    // opacity value
        this._lineWidth = lineWidth??RenderStyles.DEFAULT_WIDTH                          // width of drawn line
        this._lineDash = lineDash??RenderStyles.DEFAULT_DASH                             // gaps length within the line
        this._lineDashOffset = lineDashOffset??RenderStyles.DEFAULT_DASH_OFFSET          // line gaps offset
        this._lineJoin = lineJoin??RenderStyles.DEFAULT_JOIN                             // determines the shape of line joins
        this._lineCap = lineCap??RenderStyles.DEFAULT_CAP                                // determines the shape of line ends
    }

    /**
     * @returns a separate copy of the profile
     */
    duplicate(render=this._render, color=this._color, filter=this._filter, compositeOperation=this._compositeOperation, opacity=this._opacity, lineWidth=this._lineWidth, lineDash=this._lineDash, lineDashOffset=this._lineDashOffset, lineJoin=this._lineJoin, lineCap=this._lineCap) {
        return new RenderStyles(render, color, filter, compositeOperation, opacity, lineWidth, lineDash, lineDashOffset, lineJoin, lineCap)
    }

    /**
     * @returns the profile's styles as an array
     */
    getStyles() {
        return [this._lineWidth, this._lineDash, this._lineDashOffset, this._lineJoin, this._lineCap]
    }

    /**
     * Serializes the styles profile
     * @returns the serialized profiled
     */
    toString(color=this._color, filter=this._filter, compositeOperation=this._compositeOperation, opacity=this._opacity, lineWidth=this._lineWidth, lineDash=this._lineDash, lineDashOffset=this._lineDashOffset, lineJoin=this._lineJoin, lineCap=this._lineCap) {
        let sep = RenderStyles.SERIALIZATION_SEPARATOR, colorValue = Color.getColorValue(color)
        if (colorValue instanceof CanvasGradient || colorValue instanceof CanvasPattern) colorValue = color.toString()
        return colorValue+sep+filter+sep+compositeOperation+sep+opacity+sep+lineWidth+sep+lineDash+sep+lineDashOffset+sep+lineJoin+sep+lineCap
    }

    /**
     * Serializes the styles profile, but only the color value and visual effects
     * @returns the serialized profiled
     */
    fillOptimizedToString(color=this._color, filter=this._filter, compositeOperation=this._compositeOperation, opacity=this._opacity) {
        let sep = RenderStyles.SERIALIZATION_SEPARATOR, colorValue = Color.getColorValue(color)
        if (colorValue instanceof CanvasGradient || colorValue instanceof CanvasPattern) colorValue = color.toString()
        return colorValue+sep+filter+sep+compositeOperation+sep+opacity
    }

    /**
     * Updates a profile's attributes and returns the updated version
     * @param {Color | [r,g,b,a]?} color: the color to use
     * @param {String?} filter: the filter value, as a CSS filter
     * @param {Render.COMPOSITE_OPERATIONS?} compositeOperation: the composite operation used (/!\ Some composite operations are invasive)
     * @param {Number?} opacity: the opacity level, as a number from 0..1
     * @param {Number?} lineWidth: the width of stroked lines, in pixel
     * @param {Number | Array ?} lineDash: the line dash distance(s), in pixel
     * @param {Number?} lineDashOffset: the offset of line dashes, in pixel
     * @param {RenderStyles.JOIN_TYPES?} lineJoin: the line join style
     * @param {RenderStyles.CAP_TYPES?} lineCap: the line cap style
     * @returns the updated RenderStyles instance
     */
    update(color, filter, compositeOperation, opacity, lineWidth, lineDash, lineDashOffset, lineJoin, lineCap) {
        if (color) this.color = color
        if (filter) this._filter = filter
        if (compositeOperation) this._compositeOperation = compositeOperation
        if (opacity!=null) this._opacity = opacity
        if (lineWidth) this._lineWidth = lineWidth
        if (lineDash) this._lineDash = lineDash
        if (lineDashOffset) this._lineDashOffset = lineDashOffset
        if (lineJoin) this._lineJoin = lineJoin
        if (lineCap) this._lineCap = lineCap
        return this
    }

    /**
     * Directly applies the styles of the profile
     * @param {Color | [r,g,b,a]?} color: the color to use
     * @param {String?} filter: the filter value, as a CSS filter
     * @param {Render.COMPOSITE_OPERATIONS?} compositeOperation: the composite operation used (/!\ Some composite operations are invasive)
     * @param {Number?} opacity: the opacity level, as a number from 0..1
     * @param {Number?} lineWidth: the width of stroked lines, in pixel
     * @param {Number | Array ?} lineDash: the line dash distance(s), in pixel
     * @param {Number?} lineDashOffset: the offset of line dashes, in pixel
     * @param {RenderStyles.JOIN_TYPES?} lineJoin: the line join style
     * @param {RenderStyles.CAP_TYPES?} lineCap: the line cap style
     */
    apply(color=this._color, filter=this._filter, compositeOperation=this._compositeOperation, opacity=this._opacity, lineWidth=this._lineWidth, lineDash=this._lineDash, lineDashOffset=this._lineDashOffset, lineJoin=this._lineJoin, lineCap=this._lineCap) {
        const ctx = this.#ctx, colorValue = Color.getColorValue(color), currentStyles = this._render.currentCtxStyles, currentCtxVisuals = this._render.currentCtxVisuals
        if (color && currentCtxVisuals[0] !== colorValue) currentCtxVisuals[0] = ctx.strokeStyle = ctx.fillStyle = colorValue
        if (filter && currentCtxVisuals[1] !== filter) currentCtxVisuals[1] = ctx.filter = filter
        if (compositeOperation && currentCtxVisuals[2] !== compositeOperation) currentCtxVisuals[2] = ctx.globalCompositeOperation = compositeOperation
        if (opacity!=null && currentCtxVisuals[3] !== opacity) currentCtxVisuals[3] = ctx.globalAlpha = opacity
        if (lineWidth!=null && currentStyles[0] !== lineWidth) currentStyles[0] = ctx.lineWidth = lineWidth
        if (lineDash) {
            const lineDashString = lineDash.toString()
            if (currentStyles[1] !== lineDashString) {
                currentStyles[1] = lineDashString
                ctx.setLineDash(lineDash)
            }
        }
        if (lineDashOffset!==null && currentStyles[2] !== lineDashOffset) currentStyles[2] = ctx.lineDashOffset = lineDashOffset
        if (lineJoin && currentStyles[3] !== lineJoin) currentStyles[3] = ctx.lineJoin = lineJoin
        if (lineCap && currentStyles[4] !== lineCap) currentStyles[4] = ctx.lineCap = lineCap
    }

    /**
     * Directly applies the provided styles
     * @param {Color | [r,g,b,a]?} color: the color to use
     * @param {String?} filter: the filter value, as a CSS filter
     * @param {Render.COMPOSITE_OPERATIONS?} compositeOperation: the composite operation used (/!\ Some composite operations are invasive)
     * @param {Number?} opacity: the opacity level, as a number from 0..1
     * @param {Number?} lineWidth: the width of stroked lines, in pixel
     * @param {Number | Array ?} lineDash: the line dash distance(s), in pixel
     * @param {Number?} lineDashOffset: the offset of line dashes, in pixel
     * @param {RenderStyles.JOIN_TYPES?} lineJoin: the line join style
     * @param {RenderStyles.CAP_TYPES?} lineCap: the line cap style
     */
    static apply(render, color, filter, compositeOperation, opacity, lineWidth, lineDash, lineDashOffset, lineJoin, lineCap) {
        const ctx = render.ctx, colorValue = color&&Color.getColorValue(color), currentStyles = render.currentCtxStyles, currentCtxVisuals = render.currentCtxVisuals
        if (color && currentCtxVisuals[0] !== colorValue) currentCtxVisuals[0] = ctx.strokeStyle = ctx.fillStyle = colorValue
        if (filter && currentCtxVisuals[1] !== filter) currentCtxVisuals[1] = ctx.filter = filter
        if (compositeOperation && currentCtxVisuals[2] !== compositeOperation) currentCtxVisuals[2] = ctx.globalCompositeOperation = compositeOperation
        if (opacity!=null && currentCtxVisuals[3] !== opacity) currentCtxVisuals[3] = ctx.globalAlpha = opacity
        if (lineWidth!=null && currentStyles[0] !== lineWidth) currentStyles[0] = ctx.lineWidth = lineWidth
        if (lineDash) {
            const lineDashString = lineDash.toString()
            if (currentStyles[1] !== lineDashString) {
                currentStyles[1] = lineDashString
                ctx.setLineDash(lineDash)
            }
        }
        if (lineDashOffset!==null && currentStyles[2] !== lineDashOffset) currentStyles[2] = ctx.lineDashOffset = lineDashOffset
        if (lineJoin && currentStyles[3] !== lineJoin) currentStyles[3] = ctx.lineJoin = lineJoin
        if (lineCap && currentStyles[4] !== lineCap) currentStyles[4] = ctx.lineCap = lineCap
    }


    get id() {return this.id}
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