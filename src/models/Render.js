// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Drawing manager, centralises most context operation
class Render {// DOC TODO
    static TYPES = {LINEAR:"getLine", QUADRATIC:"getQuadCurve", CUBIC_BEIZER:"getBeizerCurve", ARC:"getArc"}
    static PLACEHODLER = null

        // TODO
    /*
    - use cache for lines ?? (see Path2D?)
    - batch calls?
    - make everyone use DrawManager (Dot, FilledShape?, CanvasUtils)
    - learn and check chrome profiling performance

    */

    // Render (draw manager)
    // Render.fill(path2d, renderStyles)

    static getLine(startPos, endPos) {
        return ctx=>{
            ctx.moveTo(...startPos)
            ctx.lineTo(...endPos)
        }
    }

    static getQuadCurve(startPos, endPos, controlPos) {
        controlPos ??= [startPos[1]+20, startPos[0]+20] // TODO
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

    static getArc(pos, radius, startRadian=0, endRadian=CDEUtils.CIRC) {
        return ctx=>{
            ctx.arc(pos[0], pos[1], radius, startRadian, endRadian)
        }
    }

    // draws 
    static stroke(ctx, lineType, renderStyles) {
        if (renderStyles instanceof RenderStyles) renderStyles.applyStyles()
            else RenderStyles.DEFAULT_PROFILE.applyStyles(renderStyles)

        ctx.beginPath()
        lineType(ctx)
        ctx.stroke()
    }

    static fill(ctx, lineType, renderStyles) {
        if (renderStyles instanceof RenderStyles) renderStyles.applyStyles()
        else RenderStyles.DEFAULT_PROFILE.applyStyles(renderStyles)

        ctx.beginPath()
        lineType(ctx)
        ctx.fill()
    }
}