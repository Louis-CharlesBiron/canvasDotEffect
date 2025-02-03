// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Drawing manager, centralises most context operation
class Render {
    static TYPES = {LINEAR:"getLine", QUADRATIC:"getQuadCurve", CUBIC_BEIZER:"getBeizerCurve", ARC:"getArc"}

    constructor(ctx) {
        this._ctx = ctx           // canvas context
        this._batchedStrokes = {} // current batched strokes
        this._batchedFills = {}   // current batched fills
    }

    /*
    TODO:
    - documentation for code and readme

    OPTIMISATIONS:
    - use cache for lines ?? (see Path2D?)
    */

    // instanciates and returns a path containing a line
    static getLine(startPos, endPos) {
        const path = new Path2D()
        path.moveTo(...startPos)
        path.lineTo(...endPos)
        return path
    }

    // instanciates and returns a path containing a quadratic curve
    static getQuadCurve(startPos, endPos, controlPos) {
        controlPos ??= [startPos[1]+20, startPos[0]+20] // TODOà

        const path = new Path2D()
        path.moveTo(...startPos)
        path.quadraticCurveTo(...controlPos, ...endPos)
        return path
        
    }

    // instanciates and returns a path containing a cubic beizer curve
    static getBeizerCurve(startPos, endPos, controlPos1, controlPos2) {
        controlPos1 ??= [startPos[1]+20, startPos[0]+20] // TODO
        controlPos2 ??= [endPos[1]+20, endPos[0]+20] // TODO

        const path = new Path2D()
        path.moveTo(...startPos)
        path.bezierCurveTo(...controlPos1, ...controlPos2, ...endPos)
        return path
    }

    // instanciates and returns a path containing an arc
    static getArc(pos, radius, startRadian=0, endRadian=CDEUtils.CIRC) {
        const path = new Path2D()
        path.arc(pos[0], pos[1], radius, startRadian, endRadian)
        return path
    }

    // directly strokes a path on the canvas. RenderStyles can either be a strict color or a RenderStyle profile
    stroke(path, renderStyles) {
        if (renderStyles[3]??renderStyles.a??1 > Color.OPACITY_VISIBILITY_THRESHOLD) {
            if (renderStyles instanceof RenderStyles) renderStyles.applyStyles()
            else RenderStyles.DEFAULT_PROFILE.applyStyles(renderStyles)

            this._ctx.stroke(path)
        }
    }

    // directly fills a path on the canvas. RenderStyles can either be a strict color or a RenderStyle profile
    fill(path, renderStyles) {
        if (renderStyles[3]??renderStyles.a??1 > Color.OPACITY_VISIBILITY_THRESHOLD) {
            if (renderStyles instanceof RenderStyles) renderStyles.applyStyles()
            else RenderStyles.DEFAULT_PROFILE.applyStyles(renderStyles)

            this._ctx.fill(path)
        }
    }

    // Queues a path to be stroked in batch at the end of the current frame. RenderStyles can either be a strict color or a RenderStyle profile
    batchStroke(path, renderStyles) {
        if (renderStyles[3]??renderStyles.a??1 > Color.OPACITY_VISIBILITY_THRESHOLD) {
            const profileKey = renderStyles instanceof RenderStyles ? renderStyles.toString() : RenderStyles.DEFAULT_PROFILE.toString(renderStyles)
            if (!this._batchedStrokes[profileKey]) this._batchedStrokes[profileKey] = new Path2D()
            this._batchedStrokes[profileKey].addPath(path)
        } 
    }

    // Queues a path to be filled in batch at the end of the current frame. RenderStyles can either be a strict color or a RenderStyle profile
    batchFill(path, renderStyles) {
        if (renderStyles[3]??renderStyles.a??1 > Color.OPACITY_VISIBILITY_THRESHOLD) {
            const profileKey = renderStyles instanceof RenderStyles ? renderStyles.colorOnlyToString() : RenderStyles.DEFAULT_PROFILE.colorOnlyToString(renderStyles)
            if (!this._batchedFills[profileKey]) this._batchedFills[profileKey] = new Path2D()
            this._batchedFills[profileKey].addPath(path)
        } 
    }

    // Fills and strokes all batched path
    drawBatched() {
        const strokes = Object.entries(this._batchedStrokes), s_ll = strokes.length,
              fills = Object.entries(this._batchedFills), f_ll = fills.length
              
        for (let i=0;i<s_ll;i++) {
            let [profileKey, path] = strokes[i], [colorValue, lineWidth, lineJoin, lineCap, lineDash, lineDashOffset] = profileKey.split(RenderStyles.SERIALIZATION_SEPARATOR)
            if (colorValue.includes(Gradient.SERIALIZATION_SEPARATOR)) colorValue = Gradient.getCanvasGradientFromString(this._ctx, colorValue)
            RenderStyles.applyStyles(this._ctx, colorValue, lineWidth, lineJoin, lineCap, lineDash?lineDash.split(",").map(Number).filter(x=>x):null, lineDashOffset)
            this._ctx.stroke(path)
        }

        for (let i=0;i<f_ll;i++) {
            let [colorValue, path] = fills[i]
            if (colorValue.includes(Gradient.SERIALIZATION_SEPARATOR)) colorValue = Gradient.getCanvasGradientFromString(this._ctx, colorValue)
            RenderStyles.applyStyles(this._ctx, colorValue)
            this._ctx.fill(path)
        }

        this._batchedStrokes = {}
        this._batchedFills = {}
    }

    
    get ctx() {return this._ctx}
    get batchedFills() {return this._batchedFills}
    get batchedStrokes() {return this._batchedStrokes}

    set ctx(ctx) {this._ctx = ctx}
}