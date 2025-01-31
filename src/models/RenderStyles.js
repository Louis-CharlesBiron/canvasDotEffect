// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Represents styling profile for lines
class RenderStyles extends _HasColor {
    static JOIN_TYPES = {MITER:"miter", BEVEL:"bevel", ROUND:"round"} // spike, flat, round
    static CAP_TYPES = {BUTT:"butt", SQUARE:"square", ROUND:"round"}  // short, long, round
    static DEFAULT_WIDTH = 2
    static DEFAULT_CAP = RenderStyles.CAP_TYPES.ROUND
    static DEFAULT_JOIN = RenderStyles.JOIN_TYPES.MITER
    static DEFAULT_DASH = []
    static DEFAULT_DASH_OFFSET = 0
    static DEFAULT_PROFILE = new RenderStyles(null, Color.DEFAULT_RGBA, RenderStyles.DEFAULT_WIDTH, RenderStyles.DEFAULT_JOIN, RenderStyles.DEFAULT_CAP, RenderStyles.DEFAULT_DASH, RenderStyles.DEFAULT_DASH, RenderStyles.DEFAULT_DASH_OFFSET)
    static PROFILE1 = RenderStyles.getNewProfile()
    static PROFILE2 = RenderStyles.getNewProfile()
    static PROFILE3 = RenderStyles.getNewProfile()
    static PROFILES = []
    static #currentCtxStyles = RenderStyles.DEFAULT_PROFILE.#getStyles()

    constructor(ctx, color, lineWidth, lineJoin, lineCap, lineDash, lineDashOffset) {
        super(color)
        this._ctx = ctx                                                         // Canvas context
        this._lineWidth = lineWidth??RenderStyles.DEFAULT_WIDTH                 // width of drawn line
        this._lineJoin = lineJoin??RenderStyles.DEFAULT_JOIN                    // determines the shape of line joins
        this._lineCap = lineCap??RenderStyles.DEFAULT_CAP                       // determines the shape of line ends
        this._lineDash = lineDash??RenderStyles.DEFAULT_DASH                    // gaps length within the line
        this._lineDashOffset = lineDashOffset??RenderStyles.DEFAULT_DASH_OFFSET // line gaps offset
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
        return new RenderStyles(this._ctx, this._color, this._lineWidth, this._lineJoin, this._lineCap, this._lineDash, this._lineDashOffset)
    }

    // returns the profile's styles as an array
    #getStyles() {
        return [this.color, this._lineWidth, this._lineJoin, this._lineCap, this._lineDash, this._lineDashOffset]
    }

    toString() {
        return this._line
    }

    // updates a profile's attributes and returns the updated version
    updateStyles(color, lineWidth, lineJoin, lineCap, lineDash, lineDashOffset) {
        if (color) this.color = color
        if (lineWidth) this._lineWidth = lineWidth
        if (lineJoin) this._lineJoin = lineJoin
        if (lineCap) this._lineCap = lineCap
        if (lineDash) this._lineDash = lineDash
        if (lineDashOffset) this._lineDashOffset = lineDashOffset
        return this
    }

    // directly applies the styles of the profile
    applyStyles(color=this._color, lineWidth=this._lineWidth, lineJoin=this._lineJoin, lineCap=this._lineCap, lineDash=this._lineDash, lineDashOffset=this._lineDashOffset) {
        const ctx = this._ctx, colorValue = Color.formatRgba(color)??color.color
        if (color && RenderStyles.#currentCtxStyles[0] !== colorValue) RenderStyles.#currentCtxStyles[0] = ctx.strokeStyle = ctx.fillStyle = colorValue
        if (lineWidth && RenderStyles.#currentCtxStyles[1] !== lineWidth) RenderStyles.#currentCtxStyles[1] = ctx.lineWidth = lineWidth
        if (lineJoin && RenderStyles.#currentCtxStyles[2] !== lineJoin) RenderStyles.#currentCtxStyles[2] = ctx.lineJoin = lineJoin
        if (lineCap && RenderStyles.#currentCtxStyles[3] !== lineCap) RenderStyles.#currentCtxStyles[3] = ctx.lineCap = lineCap
        if (lineDash && RenderStyles.#currentCtxStyles[4] != lineDash) RenderStyles.#currentCtxStyles[4] = ctx.setLineDash(lineDash)
        if (lineDashOffset && RenderStyles.#currentCtxStyles[5] !== lineDashOffset) RenderStyles.#currentCtxStyles[5] = ctx.lineDashOffset = lineDashOffset
    }

    // directly applies the provided styles
    static applyStyles(ctx, color, lineWidth, lineJoin, lineCap, lineDash, lineDashOffset) {
        const colorValue = Color.formatRgba(color)??color.color
        if (color && RenderStyles.#currentCtxStyles[0] !== colorValue) RenderStyles.#currentCtxStyles[0] = ctx.strokeStyle = ctx.fillStyle = colorValue
        if (lineWidth && RenderStyles.#currentCtxStyles[1] !== lineWidth) RenderStyles.#currentCtxStyles[1] = ctx.lineWidth = lineWidth
        if (lineJoin && RenderStyles.#currentCtxStyles[2] !== lineJoin) RenderStyles.#currentCtxStyles[2] = ctx.lineJoin = lineJoin
        if (lineCap && RenderStyles.#currentCtxStyles[3] !== lineCap) RenderStyles.#currentCtxStyles[3] = ctx.lineCap = lineCap
        if (lineDash && RenderStyles.#currentCtxStyles[4] != lineDash) RenderStyles.#currentCtxStyles[4] = ctx.setLineDash(lineDash)
        if (lineDashOffset && RenderStyles.#currentCtxStyles[5] !== lineDashOffset) RenderStyles.#currentCtxStyles[5] = ctx.lineDashOffset = lineDashOffset
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



/*
let a = CanvasUtils.SHAPES.DEBUG_SHAPE([500, 500])
a.drawEffectCB = (ctx, dot, r, m, d, p, res)=>{
    if (dot.id==p.firstDot.id) {
        let p1 = p.firstDot.pos, p2 = p.dots[3].pos


        let perp = CDEUtils.getPerpendicularLinearFn(CDEUtils.getLinearFn(p1, p2)), rad = CDEUtils.getDist(...p1, ...p2)/4
        console.log(rad)
        let c1 = [perp[3][0]+rad*2, perp[2](perp[3][0]+rad)+rad/2],
            c2 = [perp[3][0], perp[2](perp[3][0]-rad)+rad/2]

        Line.draw(ctx, Line.getBeizerCurve(p1, p2, c1, c2), [0,0,255,1])
        
        CanvasUtils.DRAW.POINT(ctx, c1, 3, new Color("red"))
        CanvasUtils.DRAW.POINT(ctx, c2, 3, new Color("green"))
        
    }
}

CVS.add(a)
*/