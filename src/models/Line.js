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
        controlPos1 ??= [startPos[1], startPos[0]]
        controlPos2 ??= [endPos[1], endPos[0]]

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
        //console.log(line, color, lineWidth, lineJoin, lineCap, lineDash, lineDashOffset)
    }

}