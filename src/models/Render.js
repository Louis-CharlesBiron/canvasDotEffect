// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Drawing manager, centralises most context operation
class Render {
    static PROFILE_ID_GIVER = -1
    static TEXT_PROFILE_ID_GIVER = -1
    static COMPOSITE_OPERATIONS = {SOURCE_OVER: "source-over", SOURCE_IN: "source-in", SOURCE_OUT: "source-out", SOURCE_ATOP: "source-atop", DESTINATION_OVER: "destination-over", DESTINATION_IN: "destination-in", DESTINATION_OUT: "destination-out", DESTINATION_ATOP: "destination-atop", LIGHTER: "lighter", COPY: "copy", XOR: "xor", MULTIPLY: "multiply", SCREEN: "screen", OVERLAY: "overlay", DARKEN: "darken", LIGHTEN: "lighten", COLOR_DODGE: "color-dodge", COLOR_BURN: "color-burn", HARD_LIGHT: "hard-light", SOFT_LIGHT: "soft-light", DIFFERENCE: "difference", EXCLUSION: "exclusion", HUE: "hue", SATURATION: "saturation", COLOR: "color", LUMINOSITY: "luminosity",}
    static DEFAULT_COMPOSITE_OPERATION = Render.COMPOSITE_OPERATIONS.SOURCE_OVER
    static DEFAULT_FILTER = "none"
    static DEFAULT_ALPHA = 1
    static PATH_TYPES = {LINEAR:Render.getLine, QUADRATIC:Render.getQuadCurve, CUBIC_BEIZER:Render.getBeizerCurve, ARC:Render.getArc, ARC_TO:Render.getArcTo, ELLIPSE:Render.getEllispe, RECT:Render.getRect, ROUND_RECT:Render.getRoundRect}
    static LINE_TYPES = {LINEAR:Render.getLine, QUADRATIC:Render.getQuadCurve, CUBIC_BEIZER:Render.getBeizerCurve}
    static DRAW_METHODS = {FILL:"FILL", STROKE:"STROKE"}

    #currentCtxVisuals = [Color.DEFAULT_COLOR_VALUE, Render.DEFAULT_FILTER, Render.DEFAULT_COMPOSITE_OPERATION, Render.DEFAULT_ALPHA]
    #currentCtxStyles = RenderStyles.DEFAULT_PROFILE.getStyles()
    #currentCtxTextStyles = TextStyles.DEFAULT_PROFILE.getStyles()
    constructor(ctx) {
        this._ctx = ctx               // Canvas context
        this._batchedStrokes = {}     // current batch of strokes
        this._batchedFills = {}       // current batch of fills
        this._bactchedStandalones = []// current array of drawings callbacks to be called once everything else has been drawn

        this._defaultProfile = RenderStyles.DEFAULT_PROFILE.duplicate(this)// default style profile template
        this._profile1 = this._defaultProfile.duplicate()                  // default style profile 1
        this._profile2 = this._defaultProfile.duplicate()                  // default style profile 2
        this._profile3 = this._defaultProfile.duplicate()                  // default style profile 3
        this._profile4 = this._defaultProfile.duplicate()                  // default style profile 4
        this._profile5 = this._defaultProfile.duplicate()                  // default style profile 5
        this._profiles = []                                                // list of custom style profiles

        this._defaultTextProfile = TextStyles.DEFAULT_PROFILE.duplicate(this)// default style profile template
        this._textProfile1 = this._defaultTextProfile.duplicate()            // default style profile 1
        this._textProfile2 = this._defaultTextProfile.duplicate()            // default style profile 2
        this._textProfile3 = this._defaultTextProfile.duplicate()            // default style profile 3
        this._textProfile4 = this._defaultTextProfile.duplicate()            // default style profile 4
        this._textProfile5 = this._defaultTextProfile.duplicate()            // default style profile 5
        this._textProfiles = []                                              // list of custom style profiles
    }

    // instanciates and returns a path containing a line
    static getLine(startPos, endPos) {
        const path = new Path2D()
        path.moveTo(startPos[0],startPos[1])
        path.lineTo(endPos[0], endPos[1])
        return path
    }

    // instanciates and returns a path containing a quadratic curve
    static getQuadCurve(startPos, endPos, controlPos) {
        if (!Array.isArray(controlPos)) controlPos = Render.getDefaultQuadraticControlPos(startPos, endPos, controlPos||undefined)

        const path = new Path2D()
        path.moveTo(startPos[0],startPos[1])
        path.quadraticCurveTo(controlPos[0], controlPos[1], endPos[0], endPos[1])
        return path
    }

    // returns a control pos to create a decent default quadratic curve
    static getDefaultQuadraticControlPos(startPos, endPos, spread=1) {
        return [endPos[0]*spread, startPos[1]*spread]
    }

    // instanciates and returns a path containing a cubic beizer curve
    static getBeizerCurve(startPos, endPos, controlPos1, controlPos2) {
        if (!controlPos2 || !controlPos1) {
            const controlPoses = Render.getDefaultBeizerControlPos(startPos, endPos, controlPos1||undefined)
            controlPos1 = controlPoses[0]
            controlPos2 ??= controlPoses[1]
        }
    
        const path = new Path2D()
        path.moveTo(startPos[0], startPos[1])
        path.bezierCurveTo(controlPos1[0], controlPos1[1], controlPos2[0], controlPos2[1], endPos[0], endPos[1])
        return path
    }

    // returns 2 control positions to create a decent default beizer curve
    static getDefaultBeizerControlPos(startPos, endPos, spread=0.75) {
        const [startX, startY] = startPos, [endX, endY] = endPos
        return [[startX+(endX-startX)*(1-spread), startY+(endY-startY)*spread], [endX-(endX-startX)*(1-spread), endY-(endY-startY)*spread]]
    }

    // instanciates and returns a path containing an arc
    static getArc(pos, radius=5, startRadian=0, endRadian=CDEUtils.CIRC) {
        const path = new Path2D()
        path.arc(pos[0], pos[1], radius, startRadian, endRadian)
        return path
    }

    // instanciates and returns a path containing an arcTo
    static getArcTo(startPos, controlPos1, controlPos2, radius) {
        const path = new Path2D()
        path.moveTo(startPos[0], startPos[1])
        path.arcTo(controlPos1[0], controlPos1[1], controlPos2[0], controlPos2[1], radius)
        return path
    }

    // instanciates and returns a path containing an ellipse
    static getEllispe(centerPos, radiusX, radiusY, startRadian=0, endRadian=CDEUtils.CIRC, counterclockwise=false) {
        const path = new Path2D()
        path.ellipse(centerPos[0], centerPos[1], radiusX, radiusY, startRadian, endRadian, counterclockwise)
        return path
    }

    // instanciates and returns a path containing an rectangle
    static getRect(pos, width, height) {
        const path = new Path2D()
        path.rect(pos[0], pos[1], width, height)
        return path
    }

    // instanciates and returns a path containing an rounded rectangle
    static getRoundRect(pos, width, height, radius) {
        const path = new Path2D()
        path.roundRect(pos[0], pos[1], width, height, radius)
        return path
    }

    // creates and adds a new custom RenderStyles profile base on a given base profile
    addCustomStylesProfile(baseProfile=this._defaultProfile) {
        const profile = baseProfile.duplicate()
        this._profiles.push(profile)
        return profile
    }

    // creates and adds a new custom TextStyles profile base on a given base profile
    addCustomStylesProfile(baseTextProfile=this._defaultTextProfile) {
        const textProfile = baseTextProfile.duplicate()
        this._textProfiles.push(textProfile)
        return textProfile
    }

    // Queues a path to be stroked in batch at the end of the current frame. RenderStyles can either be a strict color or a RenderStyle profile
    batchStroke(path, renderStyles=Color.DEFAULT_RGBA, forceVisualEffects=[]) {
        if (renderStyles[3]??renderStyles.a??1 > Color.OPACITY_VISIBILITY_THRESHOLD) {
            const filter = forceVisualEffects[0], compositeOperation = forceVisualEffects[1], opacity = forceVisualEffects[2], profileKey = renderStyles instanceof RenderStyles ? renderStyles.toString(undefined, filter, compositeOperation, opacity) : this._defaultProfile.toString(renderStyles, filter, compositeOperation, opacity)
            if (!this._batchedStrokes[profileKey]) this._batchedStrokes[profileKey] = new Path2D()
            this._batchedStrokes[profileKey].addPath(path)
        }
    }

    // Queues a path to be filled in batch at the end of the current frame. RenderStyles can either be a strict color or a RenderStyle profile
    batchFill(path, renderStyles=Color.DEFAULT_RGBA, forceVisualEffects=[]) {
        if (renderStyles[3]??renderStyles.a??1 > Color.OPACITY_VISIBILITY_THRESHOLD) {
            const filter = forceVisualEffects[0], compositeOperation = forceVisualEffects[1], opacity = forceVisualEffects[2], profileKey = renderStyles instanceof RenderStyles ? renderStyles.fillOptimizedToString(undefined, filter, compositeOperation, opacity) : this._defaultProfile.fillOptimizedToString(renderStyles, filter, compositeOperation, opacity)
            if (!this._batchedFills[profileKey]) this._batchedFills[profileKey] = new Path2D()
            this._batchedFills[profileKey].addPath(path)
        } 
    }

    // Fills and strokes all batched path
    drawBatched() {
        const strokes = Object.entries(this._batchedStrokes), s_ll = strokes.length,
              fills = Object.entries(this._batchedFills), f_ll = fills.length,
              standalones = this._bactchedStandalones, o_ll = standalones.length,
              gradientSep = Gradient.SERIALIZATION_SEPARATOR, patternSep = Pattern.SERIALIZATION_SEPARATOR,
              DEF_FILTER = Render.DEFAULT_FILTER, DEF_COMP = Render.DEFAULT_COMPOSITE_OPERATION, DEF_ALPHA = Render.DEFAULT_ALPHA
              
        for (let i=0;i<s_ll;i++) {
            let [profileKey, path] = strokes[i], [colorValue, filter, compositeOperation, opacity, lineWidth, lineDash, lineDashOffset, lineJoin, lineCap] = profileKey.split(RenderStyles.SERIALIZATION_SEPARATOR)
            if (colorValue.includes(gradientSep)) colorValue = Gradient.getCanvasGradientFromString(this._ctx, colorValue)
            else if (colorValue.includes(patternSep)) colorValue = Pattern.LOADED_PATTERN_SOURCES[colorValue.split(patternSep)[0]].value
            RenderStyles.apply(this, colorValue, filter, compositeOperation, opacity, lineWidth, lineDash?lineDash.split(",").map(Number).filter(x=>x):[0], lineDashOffset, lineJoin, lineCap)
            this._ctx.stroke(path)
        }
        RenderStyles.apply(this, null, DEF_FILTER, DEF_COMP, DEF_ALPHA)

        for (let i=0;i<f_ll;i++) {
            let [profileKey, path] = fills[i], [colorValue, filter, compositeOperation, opacity] = profileKey.split(RenderStyles.SERIALIZATION_SEPARATOR)
            if (colorValue.includes(gradientSep)) colorValue = Gradient.getCanvasGradientFromString(this._ctx, colorValue)
            else if (colorValue.includes(patternSep)) colorValue = Pattern.LOADED_PATTERN_SOURCES[colorValue.split(patternSep)[0]].value
            RenderStyles.apply(this, colorValue, filter, compositeOperation, opacity)
            this._ctx.fill(path)
        }
        RenderStyles.apply(this, null, DEF_FILTER, DEF_COMP, DEF_ALPHA)

        if (o_ll) {
            for (let i=0;i<o_ll;i++) standalones[i]()
            this._bactchedStandalones = []
        }

        this._batchedStrokes = {}
        this._batchedFills = {}
    }

    // directly strokes a path on the canvas. RenderStyles can either be a strict color or a RenderStyle profile
    stroke(path, renderStyles=Color.DEFAULT_RGBA, forceVisualEffects=[]) {
        if (renderStyles[3]??renderStyles.a??1 > Color.OPACITY_VISIBILITY_THRESHOLD) {
            const filter = forceVisualEffects[0], compositeOperation = forceVisualEffects[1], opacity = forceVisualEffects[2]
            if (renderStyles instanceof RenderStyles) renderStyles.apply(undefined, filter, compositeOperation, opacity)
            else this._defaultProfile.apply(renderStyles, filter, compositeOperation, opacity)

            this._ctx.stroke(path)
            RenderStyles.apply(this, null, Render.DEFAULT_FILTER, Render.DEFAULT_COMPOSITE_OPERATION, Render.DEFAULT_ALPHA)
        }
    }

    // directly fills a path on the canvas. RenderStyles can either be a strict color or a RenderStyle profile
    fill(path, renderStyles=Color.DEFAULT_RGBA, forceVisualEffects=[]) {
        if (renderStyles[3]??renderStyles.a??1 > Color.OPACITY_VISIBILITY_THRESHOLD) {
            const filter = forceVisualEffects[0], compositeOperation = forceVisualEffects[1], opacity = forceVisualEffects[2]
            if (renderStyles instanceof RenderStyles) renderStyles.apply(undefined, filter, compositeOperation, opacity)
            else this._defaultProfile.apply(renderStyles, filter, compositeOperation, opacity)

            this._ctx.fill(path)
            RenderStyles.apply(this, null, Render.DEFAULT_FILTER, Render.DEFAULT_COMPOSITE_OPERATION, Render.DEFAULT_ALPHA)
        }
    }

    // directly strokes text on the canvas. TextStyles can either be a strict color or a TextStyles profile
    strokeText(text, pos, color, textStyles, maxWidth=undefined, lineHeight=12, visualEffects=[]) {
        if (text) {
            const colorValue = Color.getColorValue(color), currentCtxVisuals = this.#currentCtxVisuals, hasVisualEffects = visualEffects?.length
            if (textStyles instanceof TextStyles) textStyles.apply()
            else this._defaultTextProfile.apply(textStyles)
        
            if (color && currentCtxVisuals[0] !== colorValue) currentCtxVisuals[0] = this._ctx.strokeStyle = this._ctx.fillStyle = colorValue
            if (hasVisualEffects) RenderStyles.apply(this, null, visualEffects[0], visualEffects[1], visualEffects[2])
            
            if (text.includes("\n")) {
                const lines = text.split("\n"), lines_ll = lines.length
                for (let i=0;i<lines_ll;i++) this._ctx.strokeText(lines[i], pos[0], pos[1]+i*lineHeight, maxWidth)
            } else this._ctx.strokeText(text, pos[0], pos[1], maxWidth)

            RenderStyles.apply(this, null, Render.DEFAULT_FILTER, Render.DEFAULT_COMPOSITE_OPERATION, Render.DEFAULT_ALPHA)
        }
    }

    // directly fills text on the canvas. TextStyles can either be a strict color or a TextStyles profile
    fillText(text, pos, color, textStyles, maxWidth=undefined, lineHeight=12, visualEffects=[]) {
        if (text) {
            const colorValue = Color.getColorValue(color), currentCtxVisuals = this.#currentCtxVisuals, hasVisualEffects = visualEffects?.length
            if (textStyles instanceof TextStyles) textStyles.apply()
            else this._defaultTextProfile.apply(textStyles)

            if (color && currentCtxVisuals[0] !== colorValue) currentCtxVisuals[0] = this._ctx.strokeStyle = this._ctx.fillStyle = colorValue
            if (hasVisualEffects) RenderStyles.apply(this, null, visualEffects[0], visualEffects[1], visualEffects[2])

            if (text.includes("\n")) {
                const lines = text.split("\n"), lines_ll = lines.length
                for (let i=0;i<lines_ll;i++) this._ctx.fillText(lines[i], pos[0], pos[1]+i*lineHeight, maxWidth)
            } else this._ctx.fillText(text, pos[0], pos[1], maxWidth)

            RenderStyles.apply(this, null, Render.DEFAULT_FILTER, Render.DEFAULT_COMPOSITE_OPERATION, Render.DEFAULT_ALPHA)
        }
    }

    // directly draws an image on the canvas
    drawImage(img, pos, size, croppingPositions, visualEffects=[]) {
        const hasVisualEffects = visualEffects?.length
        if (hasVisualEffects) RenderStyles.apply(this, null, visualEffects[0], visualEffects[1], visualEffects[2])

        if (croppingPositions) {
            const [[cropStartX, cropStartY], [cropEndX, cropEndY]] = croppingPositions
            this._ctx.drawImage(img, cropStartX, cropStartY, cropEndX-cropStartX, cropEndY-cropStartX, pos[0], pos[1], size[0], size[1])
        } else this._ctx.drawImage(img, pos[0], pos[1], size[0], size[1])

        RenderStyles.apply(this, null, Render.DEFAULT_FILTER, Render.DEFAULT_COMPOSITE_OPERATION, Render.DEFAULT_ALPHA)
    }

    // directly draws an image on the canvas once everything else has been drawn
    drawLateImage(img, pos, size, croppingPositions, visualEffects=[]) {
        this._bactchedStandalones.push(()=>{
            const hasVisualEffects = visualEffects?.length
            if (hasVisualEffects) RenderStyles.apply(this, null, visualEffects[0], visualEffects[1], visualEffects[2])

            if (croppingPositions) {
                const [[cropStartX, cropStartY], [cropEndX, cropEndY]] = croppingPositions
                this._ctx.drawImage(img, cropStartX, cropStartY, cropEndX-cropStartX, cropEndY-cropStartX, pos[0], pos[1], size[0], size[1])
            } else this._ctx.drawImage(img, pos[0], pos[1], size[0], size[1])

            RenderStyles.apply(this, null, Render.DEFAULT_FILTER, Render.DEFAULT_COMPOSITE_OPERATION, Render.DEFAULT_ALPHA)
        })
    }

	get ctx() {return this._ctx}
	get batchedStrokes() {return this._batchedStrokes}
	get batchedFills() {return this._bactchedStandalones}
	get batchedStandalones() {return this._batchedImages}
	get defaultProfile() {return this._defaultProfile}
	get profile1() {return this._profile1}
	get profile2() {return this._profile2}
	get profile3() {return this._profile3}
	get profile4() {return this._profile4}
	get profile5() {return this._profile5}
	get profiles() {return this._profiles}
    get defaultTextProfile() {return this._defaultTextProfile}
	get textProfile1() {return this._textProfile1}
	get textProfile2() {return this._textProfile2}
	get textProfile3() {return this._textProfile3}
	get textProfile4() {return this._textProfile4}
	get textProfile5() {return this._textProfile5}
	get textProfiles() {return this._textProfiles}
	get currentCtxVisuals() {return this.#currentCtxVisuals}
	get currentCtxStyles() {return this.#currentCtxStyles}
	get currentCtxTextStyles() {return this.#currentCtxTextStyles}

	set ctx(_ctx) {this._ctx = _ctx}
	set defaultProfile(_defaultProfile) {this._defaultProfile = _defaultProfile}
	set profile1(_profile1) {this._profile1 = _profile1}
	set profile2(_profile2) {this._profile2 = _profile2}
	set profile3(_profile3) {this._profile3 = _profile3}
	set profile4(_profile4) {this._profile4 = _profile4}
	set profile5(_profile5) {this._profile5 = _profile5}
	set profiles(_profiles) {this._profiles = _profiles}
    set defaultTextProfile(_defaultTextProfile) {this._defaultTextProfile = _defaultTextProfile}
	set textProfile1(_textProfile1) {this._textProfile1 = _textProfile1}
	set textProfile2(_textProfile2) {this._textProfile2 = _textProfile2}
	set textProfile3(_textProfile3) {this._textProfile3 = _textProfile3}
	set textProfile4(_textProfile4) {this._textProfile4 = _textProfile4}
	set textProfile5(_textProfile5) {this._textProfile5 = _textProfile5}
	set textProfiles(_textProfiles) {this._textProfiles = _textProfiles}
	set currentCtxVisuals(currentCtxVisuals) {this.#currentCtxVisuals = currentCtxVisuals}
	set currentCtxStyles(currentCtxStyles) {this.#currentCtxStyles = currentCtxStyles}
	set currentCtxTextStyles(currentCtxTextStyles) {this.#currentCtxTextStyles = currentCtxTextStyles}
}