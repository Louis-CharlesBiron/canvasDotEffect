// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Represents a drawn line
class RenderStyles extends _HasColor {// DOC TODO
    static JOIN_TYPES = {MITER:"miter", BEVEL:"bevel", ROUND:"round"} // spike, flat, round
    static CAP_TYPES = {BUTT:"butt", SQUARE:"square", ROUND:"round"}  // short, long, round
    static PLACEHODLER = null
    static DEFAULT_WIDTH = 2
    static DEFAULT_CAP = RenderStyles.CAP_TYPES.ROUND
    static DEFAULT_JOIN = RenderStyles.JOIN_TYPES.MITER
    static DEFAULT_DASH = []
    static DEFAULT_DASH_OFFSET = 0
    static DEFAULT_PROFILE = new RenderStyles(null, Color.DEFAULT_RGBA, RenderStyles.DEFAULT_WIDTH, RenderStyles.DEFAULT_JOIN, RenderStyles.DEFAULT_CAP, RenderStyles.DEFAULT_DASH, RenderStyles.DEFAULT_DASH, RenderStyles.DEFAULT_DASH_OFFSET)
    static PROFILES = [RenderStyles.getNewProfile(), RenderStyles.getNewProfile(), RenderStyles.getNewProfile()]
    static #currentCtxStyles = RenderStyles.DEFAULT_PROFILE.getStyles()

    constructor(ctx, color, lineWidth, lineJoin, lineCap, lineDash, lineDashOffset) {
        super(color)
        this._ctx = ctx
        this._lineWidth = lineWidth??RenderStyles.DEFAULT_WIDTH                 // width of drawn line
        this._lineCap = lineCap??RenderStyles.DEFAULT_CAP                       // determines the shape of line ends
        this._lineJoin = lineJoin??RenderStyles.DEFAULT_JOIN                    // determines the shape of line joins
        this._lineDash = lineDash??RenderStyles.DEFAULT_DASH                    // gaps length within the line
        this._lineDashOffset = lineDashOffset??RenderStyles.DEFAULT_DASH_OFFSET // line gaps offset
    }

    static initializeProfiles(ctx) {
        RenderStyles.DEFAULT_PROFILE.ctx = ctx
        //this.color = this._color
        RenderStyles.PROFILES.forEach(profile=>profile.ctx = ctx)
    }

    static getNewProfile() {
        return RenderStyles.DEFAULT_PROFILE.duplicate()
    }

    duplicate() {
        return new RenderStyles(this._ctx, this._color, this._lineWidth, this._lineJoin, this._lineCap, this._lineDash, this._lineDashOffset)
    }

    getStyles() {
        return [this.color, this._lineWidth, this._lineJoin, this._lineCap, this._lineDash, this._lineDashOffset]
    }

    // updates a line's attributes and returns the updated version
    updateStyles(color, lineWidth, lineJoin, lineCap, lineDash, lineDashOffset) {
        if (color) this.color = color
        if (lineWidth) this._lineWidth = lineWidth
        if (lineCap) this._lineCap = lineCap
        if (lineJoin) this._lineJoin = lineJoin
        if (lineDash) this._lineDash = lineDash
        if (lineDashOffset) this._lineDashOffset = lineDashOffset
        return this
    }

    applyStyles(color, lineWidth, lineJoin, lineCap, lineDash, lineDashOffset) {
        const ctx = this._ctx, colorValue = Color.formatRgba(color)??color.color
        if (color && RenderStyles.#currentCtxStyles[0] !== colorValue) RenderStyles.#currentCtxStyles[0] = ctx.strokeStyle = ctx.fillStyle = colorValue
        if (lineWidth && RenderStyles.#currentCtxStyles[1] !== lineWidth) RenderStyles.#currentCtxStyles[1] = ctx.lineWidth = lineWidth
        if (lineJoin && RenderStyles.#currentCtxStyles[2] !== lineJoin) RenderStyles.#currentCtxStyles[2] = ctx.lineJoin = lineJoin
        if (lineCap && RenderStyles.#currentCtxStyles[3] !== lineCap) RenderStyles.#currentCtxStyles[3] = ctx.lineCap = lineCap
        if (lineDash && RenderStyles.#currentCtxStyles[4] !== lineDash) RenderStyles.#currentCtxStyles[4] = ctx.setLineDash(lineDash)
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