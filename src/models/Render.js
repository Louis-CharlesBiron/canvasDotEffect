// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Drawing manager, centralises most context operation
class Render {
    static TYPES = {LINEAR:"getLine", QUADRATIC:"getQuadCurve", CUBIC_BEIZER:"getBeizerCurve", ARC:"getArc"}

    // DOC TODO
    constructor(ctx) {
        this._ctx = ctx
        this._batchStrokes = {}
        this._batchFills = {}
    }

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
        const path = new Path2D()
        path.moveTo(...startPos)
        path.lineTo(...endPos)
        return path
    }

    // DOC TODO
    static getQuadCurve(startPos, endPos, controlPos) {
        controlPos ??= [startPos[1]+20, startPos[0]+20] // TODOà

        const path = new Path2D()
        path.moveTo(...startPos)
        path.quadraticCurveTo(...controlPos, ...endPos)
        return path
    }

    // DOC TODO
    static getBeizerCurve(startPos, endPos, controlPos1, controlPos2) {
        controlPos1 ??= [startPos[1]+20, startPos[0]+20] // TODO
        controlPos2 ??= [endPos[1]+20, endPos[0]+20] // TODO

        const path = new Path2D()
        path.moveTo(...startPos)
        path.bezierCurveTo(...controlPos1, ...controlPos2, ...endPos)
        return path
    }

    // DOC TODO
    static getArc(pos, radius, startRadian=0, endRadian=CDEUtils.CIRC) {
        const path = new Path2D()
        path.arc(pos[0], pos[1], radius, startRadian, endRadian)
        return path
    }

    // DOC TODO
    stroke(path, renderStyles) {
        if (renderStyles[3]??renderStyles.a??1 > Color.OPACITY_VISIBILITY_THRESHOLD) {
            const profileKey = renderStyles instanceof RenderStyles ? renderStyles.toString() : RenderStyles.DEFAULT_PROFILE.toString(renderStyles)
            if (!this._batchStrokes[profileKey]) this._batchStrokes[profileKey] = new Path2D()
            this._batchStrokes[profileKey].addPath(path)
        } 
    }

    // DOC TODO
    fill(path, renderStyles) {
        if (renderStyles[3]??renderStyles.a??1 > Color.OPACITY_VISIBILITY_THRESHOLD) {
            const profileKey = renderStyles instanceof RenderStyles ? renderStyles.toString() : RenderStyles.DEFAULT_PROFILE.toString(renderStyles)
            if (!this._batchFills[profileKey]) this._batchFills[profileKey] = new Path2D()// fill may not need storing of the entire profile since only color is affected
            this._batchFills[profileKey].addPath(path)
        } 
        // else if (renderStyles.colorRaw instanceof Gradient) {// skip batching and draw if color is gradient
        //     if (renderStyles instanceof RenderStyles) renderStyles.applyStyles()
        //     else RenderStyles.DEFAULT_PROFILE.applyStyles(renderStyles)
        // }
    }

    // DOC TODO
    drawBatched() {
        const strokes = Object.entries(this._batchStrokes), s_ll = strokes.length,
              fills = Object.entries(this._batchFills), f_ll = fills.length
              
        for (let i=0;i<s_ll;i++) {
            let [profileKey, path] = strokes[i], [colorValue, lineWidth, lineJoin, lineCap, lineDash, lineDashOffset] = profileKey.split(RenderStyles.SERIALIZATION_SEPARATOR)
            if (colorValue.includes(Gradient.SERIALIZATION_SEPARATOR)) colorValue = Gradient.getCanvasGradientFromString(this._ctx, colorValue)
            RenderStyles.applyStyles(this._ctx, colorValue, lineWidth, lineJoin, lineCap, lineDash.split(",").map(Number).filter(x=>x), lineDashOffset)
            this._ctx.stroke(path)
        }

        for (let i=0;i<f_ll;i++) {
            let [profileKey, path] = fills[i], [colorValue, lineWidth, lineJoin, lineCap, lineDash, lineDashOffset] = profileKey.split(RenderStyles.SERIALIZATION_SEPARATOR)
            if (colorValue.includes(Gradient.SERIALIZATION_SEPARATOR)) colorValue = Gradient.getCanvasGradientFromString(this._ctx, colorValue)
            RenderStyles.applyStyles(this._ctx, colorValue, lineWidth, lineJoin, lineCap, lineDash.split(",").map(Number).filter(x=>x), lineDashOffset)
            this._ctx.fill(path)
        }

        this._batchStrokes = this._batchFills = {}
    }

    // DOC TODO
    strokePath(path, renderStyles) {
        if (renderStyles[3]??renderStyles.a??1 > Color.OPACITY_VISIBILITY_THRESHOLD) {
            if (renderStyles instanceof RenderStyles) renderStyles.applyStyles()
            else RenderStyles.DEFAULT_PROFILE.applyStyles(renderStyles)

            this._ctx.stroke(path)
        }
    }

    // DOC TODO
    fillPath(path, renderStyles) {
        if (renderStyles[3]??renderStyles.a??1 > Color.OPACITY_VISIBILITY_THRESHOLD) {
            if (renderStyles instanceof RenderStyles) renderStyles.applyStyles()
            else RenderStyles.DEFAULT_PROFILE.applyStyles(renderStyles)

            this._ctx.fill(path)
        }
    }

    get ctx() {return this._ctx}
    get batch() {return this._batch}
}