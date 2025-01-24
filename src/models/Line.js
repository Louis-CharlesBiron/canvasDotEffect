// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Represents a drawn line
class Line {// DOC TODO
    static JOIN_TYPES = {MITER:"miter", BEVEL:"bevel", ROUND:"round"} // spike, flat, round
    static CAP_TYPES = {BUTT:"butt", SQUARE:"square", ROUND:"round"}  // short, long, round
    static DEFAULT_WIDTH = 2
    static DEFAULT_CAP = Line.CAP_TYPES.ROUND
    static DEFAULT_JOIN = Line.JOIN_TYPES.BEVEL
    static DEFAULT_DASH = []
    static DEFAULT_DASH_OFFSET = 0

    static getLine(startPos, endPos) {
        return (ctx)=>{
            ctx.moveTo(...startPos)
            ctx.lineTo(...endPos)
        }
    }

    static getQuadCurve(startPos, endPos, controlPos) {
        return (ctx)=>{
            ctx.moveTo(...startPos)
            ctx.quadraticCurveTo(...controlPos, ...endPos)
        }
    }

    static getBeizerCurve(startPos, endPos, controlPos1, controlPos2) {
        controlPos1 ??= [startPos[1]+20, startPos[0]+20]
        controlPos2 ??= [endPos[1]+20, endPos[0]+20]

        return (ctx)=>{
            ctx.moveTo(...startPos)
            ctx.bezierCurveTo(...controlPos1, ...controlPos2, ...endPos)
        }
    }

    // draws a custom line/curve according to the parameters  
    static draw(ctx, line, color, lineWidth, lineJoin, lineCap, lineDash, lineDashOffset) {
        if (color) ctx.strokeStyle = Color.formatRgba(color)??color.color // color of the line
        if (lineWidth) ctx.lineWidth = lineWidth                // width of drawn line
        if (lineCap) ctx.lineCap = lineCap                      // determines the shape of line ends
        if (lineJoin) ctx.lineJoin = lineJoin                   // determines the shape of line joins
        if (lineDash) ctx.lineDash = lineDash                   // gaps length within the line
        if (lineDashOffset) ctx.lineDashOffset = lineDashOffset // line gaps offset
        ctx.beginPath()
        line(ctx)
        ctx.stroke()
    }


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