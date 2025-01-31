// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Drawing manager, centralises most context operation
class Render {
    static TYPES = {LINEAR:"getLine", QUADRATIC:"getQuadCurve", CUBIC_BEIZER:"getBeizerCurve", ARC:"getArc"}

    /*
    TODO:
    - documentation for code and readme


    TESTS:
    - use gradient for color in renderStyles (should work :])


    OPTIMISATIONS:
    - use cache for lines ?? (see Path2D?)
    - batch calls?
    - learn and check chrome profiling performance

    */

    // DOC TODO
    static getLine(startPos, endPos) {
        return ctx=>{
            ctx.moveTo(...startPos)
            ctx.lineTo(...endPos)
        }
    }

    // DOC TODO
    static getQuadCurve(startPos, endPos, controlPos) {
        controlPos ??= [startPos[1]+20, startPos[0]+20] // TODO
        return ctx=>{
            ctx.moveTo(...startPos)
            ctx.quadraticCurveTo(...controlPos, ...endPos)
        }
    }

    // DOC TODO
    static getBeizerCurve(startPos, endPos, controlPos1, controlPos2) {
        controlPos1 ??= [startPos[1]+20, startPos[0]+20] // TODO
        controlPos2 ??= [endPos[1]+20, endPos[0]+20] // TODO

        return ctx=>{
            ctx.moveTo(...startPos)
            ctx.bezierCurveTo(...controlPos1, ...controlPos2, ...endPos)
        }
    }

    // DOC TODO
    static getArc(pos, radius, startRadian=0, endRadian=CDEUtils.CIRC) {
        return ctx=>{
            ctx.arc(pos[0], pos[1], radius, startRadian, endRadian)
        }
    }

    // DOC TODO
    static stroke(ctx, lineType, renderStyles) {
        if (renderStyles[3]??renderStyles.a??1 > Color.OPACITY_VISIBILITY_THRESHOLD) {
            if (renderStyles instanceof RenderStyles) renderStyles.applyStyles()
            else RenderStyles.DEFAULT_PROFILE.applyStyles(renderStyles)

            ctx.beginPath()
            lineType(ctx)
            ctx.stroke()
        }
    }

    // DOC TODO
    static fill(ctx, lineType, renderStyles) {
        if (renderStyles[3]??renderStyles.a??1 > Color.OPACITY_VISIBILITY_THRESHOLD) {
            if (renderStyles instanceof RenderStyles) renderStyles.applyStyles()
            else RenderStyles.DEFAULT_PROFILE.applyStyles(renderStyles)

            ctx.beginPath()
            lineType(ctx)
            ctx.fill()
        }
    }

    // DOC TODO
    static strokePath(ctx, path, renderStyles) {
        if (renderStyles[3]??renderStyles.a??1 > Color.OPACITY_VISIBILITY_THRESHOLD) {
            if (renderStyles instanceof RenderStyles) renderStyles.applyStyles()
            else RenderStyles.DEFAULT_PROFILE.applyStyles(renderStyles)

            ctx.stroke(path)
        }
    }

    // DOC TODO
    static fillPath(ctx, path, renderStyles) {
        if (renderStyles[3]??renderStyles.a??1 > Color.OPACITY_VISIBILITY_THRESHOLD) {
            if (renderStyles instanceof RenderStyles) renderStyles.applyStyles()
            else RenderStyles.DEFAULT_PROFILE.applyStyles(renderStyles)

            ctx.fill(path)
        }
    }
}