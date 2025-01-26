// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Represents a drawn line
class RenderStyle extends _HasColor {// DOC TODO
    static TYPES = {LINEAR:"getLine", QUADRATIC:"getQuadCurve", CUBIC_BEIZER:"getBeizerCurve", ARC:"getArc"}
    static JOIN_TYPES = {MITER:"miter", BEVEL:"bevel", ROUND:"round"} // spike, flat, round
    static CAP_TYPES = {BUTT:"butt", SQUARE:"square", ROUND:"round"}  // short, long, round
    static PLACEHODLER = null
    static DEFAULT_WIDTH = 2
    static DEFAULT_CAP = RenderStyle.CAP_TYPES.ROUND
    static DEFAULT_JOIN = RenderStyle.JOIN_TYPES.MITER
    static DEFAULT_DASH = []
    static DEFAULT_DASH_OFFSET = 0
    static TEMPLATE_LINE = new RenderStyle(Color.DEFAULT_RGBA, RenderStyle.PLACEHODLER, RenderStyle.DEFAULT_WIDTH, RenderStyle.DEFAULT_JOIN, RenderStyle.DEFAULT_CAP, RenderStyle.DEFAULT_DASH, RenderStyle.DEFAULT_DASH, RenderStyle.DEFAULT_DASH_OFFSET)

    //
    constructor(color, lineType, lineWidth, lineJoin, lineCap, lineDash, lineDashOffset) {
        super(color)
        this._lineType = lineType??RenderStyle.PLACEHODLER                     // a line callback
        this._lineWidth = lineWidth??RenderStyle.DEFAULT_WIDTH                 // width of drawn line
        this._lineCap = lineCap??RenderStyle.DEFAULT_CAP                       // determines the shape of line ends
        this._lineJoin = lineJoin??RenderStyle.DEFAULT_JOIN                    // determines the shape of line joins
        this._lineDash = lineDash??RenderStyle.DEFAULT_DASH                    // gaps length within the line
        this._lineDashOffset = lineDashOffset??RenderStyle.DEFAULT_DASH_OFFSET // line gaps offset
    }

    // TODO
    /*
     - Convert to DrawManager / RenderStyle / DrawStyle / Render


     - use cache for lines ?? (see Path2D?)
     - batch calls?
     - make everyone use DrawManager (Dot, FilledShape?, CanvasUtils)
     - learn and check chrome profiling performance
    
    
    */



    // draws a custom line/curve based on the instance parameters, allows overwriting
    stroke(ctx, lineType, color, lineWidth, lineJoin, lineCap, lineDash, lineDashOffset) {
        RenderStyle.stroke(ctx, lineType??this._lineType, color??this._color, lineWidth??this._lineWidth, lineJoin??this._lineJoin, lineCap??this._lineCap, lineDash??this._lineDash, lineDashOffset??this._lineDashOffset)
    }

    fill(ctx, lineType, color, lineWidth, lineJoin, lineCap, lineDash, lineDashOffset) {
        RenderStyle.fill(ctx, lineType??this._lineType, color??this._color, lineWidth??this._lineWidth, lineJoin??this._lineJoin, lineCap??this._lineCap, lineDash??this._lineDash, lineDashOffset??this._lineDashOffset)
    }

    // updates a line's attributes and returns the updated version
    update(color, lineType, lineWidth, lineJoin, lineCap, lineDash, lineDashOffset) {
        if (color) this.color = color
        if (lineType) this._lineType = lineType
        if (lineWidth) this._lineWidth = lineWidth
        if (lineCap) this._lineCap = lineCap
        if (lineJoin) this._lineJoin = lineJoin
        if (lineDash) this._lineDash = lineDash
        if (lineDashOffset) this._lineDashOffset = lineDashOffset
        return this
    }

    static getLine(startPos, endPos) {
        return ctx=>{
            ctx.moveTo(...startPos)
            ctx.lineTo(...endPos)
        }
    }

    static getQuadCurve(startPos, endPos, controlPos) {
        return ctx=>{
            ctx.moveTo(...startPos)
            ctx.quadraticCurveTo(...controlPos, ...endPos)
        }
    }

    static getBeizerCurve(startPos, endPos, controlPos1, controlPos2) {
        controlPos1 ??= [startPos[1]+20, startPos[0]+20] // TODO
        controlPos2 ??= [endPos[1]+20, endPos[0]+20] // TODO

        return ctx=>{
            ctx.moveTo(...startPos)
            ctx.bezierCurveTo(...controlPos1, ...controlPos2, ...endPos)
        }
    }

    static getArc(pos, radius, startRadian, endRadian) {
        startRadian??=0
        endRadian??=CDEUtils.CIRC

        return ctx=>{
            ctx.arc(pos[0], pos[1], radius, startRadian, endRadian)
        }
    }

    // draws a custom line/curve according to the parameters
    static stroke(ctx, lineType, color, lineWidth, lineJoin, lineCap, lineDash, lineDashOffset) {
        const colorValue = Color.formatRgba(color)??color.color
        if (color && ctx.strokeStyle !== colorValue) ctx.strokeStyle = colorValue
        if (lineWidth && ctx.lineWidth !== lineWidth) ctx.lineWidth = lineWidth
        if (lineCap && ctx.lineCap !== lineCap) ctx.lineCap = lineCap
        if (lineJoin && ctx.lineJoin !== lineJoin) ctx.lineJoin = lineJoin
        if (lineDash && ctx.getLineDash() !== lineDash) ctx.setLineDash(lineDash)
        if (lineDashOffset && ctx.lineDashOffset !== lineDashOffset) ctx.lineDashOffset = lineDashOffset

        ctx.beginPath()
        lineType(ctx)
        ctx.stroke()
    }

    static fill(ctx, lineType, color, lineWidth, lineJoin, lineCap, lineDash, lineDashOffset) {
        const colorValue = Color.formatRgba(color)??color.color
        if (color && ctx.fillStyle !== colorValue) ctx.fillStyle = colorValue
        if (lineWidth && ctx.lineWidth !== lineWidth) ctx.lineWidth = lineWidth
        if (lineCap && ctx.lineCap !== lineCap) ctx.lineCap = lineCap
        if (lineJoin && ctx.lineJoin !== lineJoin) ctx.lineJoin = lineJoin
        if (lineDash && ctx.getLineDash() !== lineDash) ctx.setLineDash(lineDash)
        if (lineDashOffset && ctx.lineDashOffset !== lineDashOffset) ctx.lineDashOffset = lineDashOffset

        ctx.beginPath()
        lineType(ctx)
        ctx.fill()
    }

    get lineType() {return this._lineType}
	get lineWidth() {return this._lineWidth}
	get lineCap() {return this._lineCap}
	get lineJoin() {return this._lineJoin}
	get lineDash() {return this._lineDash}
	get lineDashOffset() {return this._lineDashOffset}

	set lineType(_lineType) {return this._lineType = _lineType}
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