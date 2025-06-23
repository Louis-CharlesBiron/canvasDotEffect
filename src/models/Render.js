// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Drawing manager, centralises most context operation
class Render {
    static PROFILE_ID_GIVER = -1
    static TEXT_PROFILE_ID_GIVER = -1
    static COMPOSITE_OPERATIONS = {SOURCE_OVER: "source-over", SOURCE_IN: "source-in", SOURCE_OUT: "source-out", SOURCE_ATOP: "source-atop", DESTINATION_OVER: "destination-over", DESTINATION_IN: "destination-in", DESTINATION_OUT: "destination-out", DESTINATION_ATOP: "destination-atop", LIGHTER: "lighter", COPY: "copy", XOR: "xor", MULTIPLY: "multiply", SCREEN: "screen", OVERLAY: "overlay", DARKEN: "darken", LIGHTEN: "lighten", COLOR_DODGE: "color-dodge", COLOR_BURN: "color-burn", HARD_LIGHT: "hard-light", SOFT_LIGHT: "soft-light", DIFFERENCE: "difference", EXCLUSION: "exclusion", HUE: "hue", SATURATION: "saturation", COLOR: "color", LUMINOSITY: "luminosity"}
    static FILTERS = {BLUR:v=>`blur(${v}px)`,BRIGHTNESS:v=>`brightness(${v})`,CONTRAST:v=>`contrast(${v})`,DROPSHADOW:(value)=>`drop-shadow(${value})`,GRAYSCALE:v=>`grayscale(${v})`,HUE_ROTATE:v=>`hue-rotate(${v}deg)`,INVERT:v=>`invert(${v})`,OPACITY:v=>`opacity(${v})`,SATURATE:v=>`saturate(${v})`,SEPIA:v=>`sepia(${v})`,URL:v=>`url(${v})`}
    static DEFAULT_COMPOSITE_OPERATION = Render.COMPOSITE_OPERATIONS.SOURCE_OVER
    static DEFAULT_FILTER = "none"
    static DEFAULT_ALPHA = 1
    static PATH_TYPES = {LINEAR:Render.getLine, QUADRATIC:Render.getQuadCurve, CUBIC_BEZIER:Render.getBezierCurve, ARC:Render.getArc, ARC_TO:Render.getArcTo, ELLIPSE:Render.getEllispe, RECT:Render.getRect, POSITIONS_RECT:Render.getPositionsRect, ROUND_RECT:Render.getRoundRect, POSITIONS_ROUND_RECT:Render.getPositionsRoundRect}
    static LINE_TYPES = {LINEAR:Render.getLine, QUADRATIC:Render.getQuadCurve, CUBIC_BEZIER:Render.getBezierCurve}
    static DRAW_METHODS = {FILL:"FILL", STROKE:"STROKE"}
    static COLOR_TRANSFORMS = {NONE:null, INVERT:1, GRAYSCALE:2, SEPIA:3, RANDOMIZE:4, STATIC:5, MULTIPLY:6, BGRA:7, TINT:8}

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

        this._defaultTextProfile = TextStyles.DEFAULT_PROFILE.duplicate(this)// default text style profile template
        this._textProfile1 = this._defaultTextProfile.duplicate()            // default text style profile 1
        this._textProfile2 = this._defaultTextProfile.duplicate()            // default text style profile 2
        this._textProfile3 = this._defaultTextProfile.duplicate()            // default text style profile 3
        this._textProfile4 = this._defaultTextProfile.duplicate()            // default text style profile 4
        this._textProfile5 = this._defaultTextProfile.duplicate()            // default text style profile 5
        this._textProfiles = []                                              // list of custom text style profiles
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

    // instanciates and returns a path containing a cubic bezier curve
    static getBezierCurve(startPos, endPos, controlPos1, controlPos2) {
        if (!controlPos2 || !controlPos1) {
            const controlPoses = Render.getDefaultBezierControlPos(startPos, endPos, controlPos1||undefined)
            controlPos1 = controlPoses[0]
            controlPos2 ??= controlPoses[1]
        }
    
        const path = new Path2D()
        path.moveTo(startPos[0], startPos[1])
        path.bezierCurveTo(controlPos1[0], controlPos1[1], controlPos2[0], controlPos2[1], endPos[0], endPos[1])
        return path
    }

    // returns 2 control positions to create a decent default bezier curve
    static getDefaultBezierControlPos(startPos, endPos, spread=0.75) {
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
    static getEllispe(centerPos, radiusX, radiusY, rotationRadian=0, startRadian=0, endRadian=CDEUtils.CIRC, counterclockwise=false) {
        const path = new Path2D()
        path.ellipse(centerPos[0], centerPos[1], radiusX, radiusY, rotationRadian, startRadian, endRadian, counterclockwise)
        return path
    }

    // instanciates and returns a path containing an rectangle
    static getRect(pos, width, height) {
        const path = new Path2D()
        path.rect(pos[0], pos[1], width, height)
        return path
    }

    // instanciates and returns a path containing an rectangle
    static getPositionsRect(pos, pos2) {
        const path = new Path2D(), x1 = pos[0], y1 = pos[1]
        path.rect(x1, y1, pos2[0]-x1, pos2[1]-y1)
        return path
    }

    // instanciates and returns a path containing an rounded rectangle
    static getRoundRect(pos, width, height, radius) {
        const path = new Path2D()
        path.roundRect(pos[0], pos[1], width, height, radius)
        return path
    }

    // instanciates and returns a path containing an rounded rectangle
    static getPositionsRoundRect(pos, pos2, radius=5) {
        const path = new Path2D(), x1 = pos[0], y1 = pos[1]
        path.roundRect(x1, y1, pos2[0]-x1, pos2[1]-y1, radius)
        return path
    }

    // creates and adds a new custom RenderStyles profile base on a given base profile
    createCustomStylesProfile(baseProfile=this._defaultProfile) {
        const profile = baseProfile.duplicate()
        this._profiles.push(profile)
        return profile
    }

    // creates and adds a new custom TextStyles profile base on a given base profile
    createCustomTextStylesProfile(baseTextProfile=this._defaultTextProfile) {
        const textProfile = baseTextProfile.duplicate()
        this._textProfiles.push(textProfile)
        return textProfile
    }

    // Queues a path to be stroked in batch at the end of the current frame. RenderStyles can either be a strict color or a RenderStyle profile
    batchStroke(path, renderStyles=Color.DEFAULT_RGBA, forceVisualEffects=[]) {
        if ((renderStyles[3]??renderStyles.a??1) > Color.OPACITY_VISIBILITY_THRESHOLD) {
            const batch = this._batchedStrokes, filter = forceVisualEffects[0], compositeOperation = forceVisualEffects[1], opacity = forceVisualEffects[2], profileKey = renderStyles instanceof RenderStyles ? renderStyles.toString(undefined, filter, compositeOperation, opacity) : this._defaultProfile.toString(renderStyles, filter, compositeOperation, opacity)
            if (!batch[profileKey]) batch[profileKey] = new Path2D()
            batch[profileKey].addPath(path)
        }
    }

    // Queues a path to be filled in batch at the end of the current frame. RenderStyles can either be a strict color or a RenderStyle profile
    batchFill(path, renderStyles=Color.DEFAULT_RGBA, forceVisualEffects=[]) {
        if ((renderStyles[3]??renderStyles.a??1) > Color.OPACITY_VISIBILITY_THRESHOLD) {
            const batch = this._batchedFills, filter = forceVisualEffects[0], compositeOperation = forceVisualEffects[1], opacity = forceVisualEffects[2], profileKey = renderStyles instanceof RenderStyles ? renderStyles.fillOptimizedToString(undefined, filter, compositeOperation, opacity) : this._defaultProfile.fillOptimizedToString(renderStyles, filter, compositeOperation, opacity)
            if (!batch[profileKey]) batch[profileKey] = new Path2D()
            batch[profileKey].addPath(path)
        } 
    }

    // Fills and strokes all batched paths
    drawBatched() {
        const strokes = Object.entries(this._batchedStrokes), s_ll = strokes.length,
              fills = Object.entries(this._batchedFills), f_ll = fills.length,
              ctx = this._ctx,
              standalones = this._bactchedStandalones, o_ll = standalones.length,
              gradientSep = Gradient.SERIALIZATION_SEPARATOR, patternSep = Pattern.SERIALIZATION_SEPARATOR,
              DEF_FILTER = Render.DEFAULT_FILTER, DEF_COMP = Render.DEFAULT_COMPOSITE_OPERATION, DEF_ALPHA = Render.DEFAULT_ALPHA

        for (let i=0;i<s_ll;i++) {
            let stroke = strokes[i], profileKey = stroke[0], path = stroke[1], profile = profileKey.split(RenderStyles.SERIALIZATION_SEPARATOR), colorValue = profile[0], lineDash = profile[5]
            if (colorValue.includes(gradientSep)) colorValue = Gradient.getCanvasGradientFromString(ctx, colorValue)
            else if (colorValue.includes(patternSep)) colorValue = Pattern.LOADED_PATTERN_SOURCES[colorValue.split(patternSep)[0]].value
        
            let lineDashValue = []
            if (lineDash) {
                let l_ll = lineDash.length, at = 0
                for (let i=0;i<=l_ll;i++) {
                    if (lineDash[i]=="," || i==l_ll) {
                        const v = +(lineDash.slice(at, i).trim())
                        if (v) lineDashValue.push(v)
                        at = i+1
                    }
                }
            } else lineDashValue[0] = 0

            RenderStyles.apply(this, colorValue, profile[1], profile[2], profile[3], profile[4], lineDashValue, profile[6], profile[7], profile[8])
            ctx.stroke(path)
        }
        RenderStyles.apply(this, null, DEF_FILTER, DEF_COMP, DEF_ALPHA)

        for (let i=0;i<f_ll;i++) {
            let fill = fills[i], profileKey = fill[0], path = fill[1], profile = profileKey.split(RenderStyles.SERIALIZATION_SEPARATOR), colorValue = profile[0]
            if (colorValue.includes(gradientSep)) colorValue = Gradient.getCanvasGradientFromString(ctx, colorValue)
            else if (colorValue.includes(patternSep)) colorValue = Pattern.LOADED_PATTERN_SOURCES[colorValue.split(patternSep)[0]].value
            RenderStyles.apply(this, colorValue, profile[1], profile[2], profile[3])
            ctx.fill(path)
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
        if ((renderStyles[3]??renderStyles.a??1) > Color.OPACITY_VISIBILITY_THRESHOLD) {
            const filter = forceVisualEffects[0], compositeOperation = forceVisualEffects[1], opacity = forceVisualEffects[2]
            if (renderStyles instanceof RenderStyles) renderStyles.apply(undefined, filter, compositeOperation, opacity)
            else this._defaultProfile.apply(renderStyles, filter, compositeOperation, opacity)

            this._ctx.stroke(path)
            RenderStyles.apply(this, null, Render.DEFAULT_FILTER, Render.DEFAULT_COMPOSITE_OPERATION, Render.DEFAULT_ALPHA)
        }
    }

    // directly fills a path on the canvas. RenderStyles can either be a strict color or a RenderStyle profile
    fill(path, renderStyles=Color.DEFAULT_RGBA, forceVisualEffects=[]) {
        if ((renderStyles[3]??renderStyles.a??1) > Color.OPACITY_VISIBILITY_THRESHOLD) {
            const filter = forceVisualEffects[0], compositeOperation = forceVisualEffects[1], opacity = forceVisualEffects[2]
            if (renderStyles instanceof RenderStyles) renderStyles.apply(undefined, filter, compositeOperation, opacity)
            else this._defaultProfile.apply(renderStyles, filter, compositeOperation, opacity)

            this._ctx.fill(path)
            RenderStyles.apply(this, null, Render.DEFAULT_FILTER, Render.DEFAULT_COMPOSITE_OPERATION, Render.DEFAULT_ALPHA)
        }
    }

    // directly strokes text on the canvas. TextStyles can either be a strict color or a TextStyles profile
    strokeText(text, pos, color, textStyles, maxWidth=undefined, lineHeight=TextDisplay.DEFAULT_LINE_HEIGHT, visualEffects=[]) {
        if (text) {
            const colorValue = Color.getColorValue(color), currentCtxVisuals = this.#currentCtxVisuals, ctx = this._ctx
            if (textStyles instanceof TextStyles) textStyles.apply()
            else this._defaultTextProfile.apply(textStyles)
        
            if (color && currentCtxVisuals[0] !== colorValue) currentCtxVisuals[0] = ctx.strokeStyle = ctx.fillStyle = colorValue
            if (visualEffects?.length) RenderStyles.apply(this, null, visualEffects[0], visualEffects[1], visualEffects[2])
            
            if (text.includes("\n")) {
                const lines = text.split("\n"), lines_ll = lines.length
                for (let i=0;i<lines_ll;i++) ctx.strokeText(lines[i], pos[0], pos[1]+i*lineHeight, maxWidth)
            } else ctx.strokeText(text, pos[0], pos[1], maxWidth)

            RenderStyles.apply(this, null, Render.DEFAULT_FILTER, Render.DEFAULT_COMPOSITE_OPERATION, Render.DEFAULT_ALPHA)
        }
    }

    // directly fills text on the canvas. TextStyles can either be a strict color or a TextStyles profile
    fillText(text, pos, color, textStyles, maxWidth=undefined, lineHeight=TextDisplay.DEFAULT_LINE_HEIGHT, visualEffects=[]) {
        if (text) {
            const colorValue = Color.getColorValue(color), currentCtxVisuals = this.#currentCtxVisuals, ctx = this._ctx
            if (textStyles instanceof TextStyles) textStyles.apply()
            else this._defaultTextProfile.apply(textStyles)

            if (color && currentCtxVisuals[0] !== colorValue) currentCtxVisuals[0] = ctx.strokeStyle = ctx.fillStyle = colorValue
            if (visualEffects?.length) RenderStyles.apply(this, null, visualEffects[0], visualEffects[1], visualEffects[2])

            if (text.includes("\n")) {
                const lines = text.split("\n"), lines_ll = lines.length
                for (let i=0;i<lines_ll;i++) ctx.fillText(lines[i], pos[0], pos[1]+i*lineHeight, maxWidth)
            } else ctx.fillText(text, pos[0], pos[1], maxWidth)

            RenderStyles.apply(this, null, Render.DEFAULT_FILTER, Render.DEFAULT_COMPOSITE_OPERATION, Render.DEFAULT_ALPHA)
        }
    }

    // directly draws an image on the canvas
    drawImage(img, pos, size, croppingPositions, visualEffects=[]) {
        if (visualEffects?.length) RenderStyles.apply(this, null, visualEffects[0], visualEffects[1], visualEffects[2])

        if (croppingPositions) {
            const [[cropStartX, cropStartY], [cropEndX, cropEndY]] = croppingPositions
            this._ctx.drawImage(img, cropStartX, cropStartY, cropEndX-cropStartX, cropEndY-cropStartX, pos[0], pos[1], size[0], size[1])
        } else this._ctx.drawImage(img, pos[0], pos[1], size[0], size[1])

        RenderStyles.apply(this, null, Render.DEFAULT_FILTER, Render.DEFAULT_COMPOSITE_OPERATION, Render.DEFAULT_ALPHA)
    }

    // directly draws an image on the canvas once everything else has been drawn
    drawLateImage(img, pos, size, croppingPositions, visualEffects=[]) {
        this._bactchedStandalones.push(()=>{
            if (visualEffects?.length) RenderStyles.apply(this, null, visualEffects[0], visualEffects[1], visualEffects[2])

            if (croppingPositions) {
                const [[cropStartX, cropStartY], [cropEndX, cropEndY]] = croppingPositions
                this._ctx.drawImage(img, cropStartX, cropStartY, cropEndX-cropStartX, cropEndY-cropStartX, pos[0], pos[1], size[0], size[1])
            } else this._ctx.drawImage(img, pos[0], pos[1], size[0], size[1])

            RenderStyles.apply(this, null, Render.DEFAULT_FILTER, Render.DEFAULT_COMPOSITE_OPERATION, Render.DEFAULT_ALPHA)
        })
    }

    /**
     * Replaces a color on the canvas by another one in a specified area
     * @param {Color | [r,g,b,a]} targetColor: The color to be replaced by newColor
     * @param {Color | [r,g,b,a]} newColor: The color replacing targetColor
     * @param {Number, [rT,gT,bT]} temperance: The validity margin for the r, g, b values of the targetColor
     * @param {[[x, y], [x, y]] | null} area: A positions array defining the area to replace the color in
     * @param {Number} densityDivider: The higher the divider, the more pixels will skip the processing. (Defaults to 1, meaning every pixel gets processed)
     * @param {Boolean} preventLate: If true, doesn't include colors from batched operations
     */
    replaceColor(targetColor, newColor=Color.DEFAULT_RGBA, temperance=Color.DEFAULT_TEMPERANCE, area=null, densityDivider=1, preventLate=false) {
        const core = ()=>{
            const ctx = this._ctx, cvs = ctx.canvas, startX = area?.[0]?.[0]??0, startY = area?.[0]?.[1]??0,
            img = ctx.getImageData(startX, startY, (area?.[1]?.[0]-startX)||cvs.width, (area?.[1]?.[1]-startY)||cvs.height), data = img.data, d_ll = data.length,
            r = targetColor.r??targetColor[0], g = targetColor.g??targetColor[1], b = targetColor.b??targetColor[2],
            nr = newColor.r??newColor[0], ng = newColor.g??newColor[1], nb = newColor.b??newColor[2], na = (newColor.a??newColor[3])*255,
            pxStep = 4*(densityDivider>0?densityDivider:1)

            if (temperance) {
                let currentR, currentG, currentB, rT = temperance[0]??temperance, gT = temperance[1]??temperance, bT = temperance[2]??temperance, br = r-rT, bg = g-gT, bb = b-bT, tr = r+rT, tg = g+gT, tb = b+bT
                for (let i=0;i<d_ll;i+=pxStep) {
                    currentR = data[i]
                    if (currentR >= br && currentR <= tr) {
                        currentG = data[i+1]
                        currentB = data[i+2]
                        if (currentG >= bg && currentG <= tg && currentB >= bb && currentB <= tb) {
                            data[i]   = nr
                            data[i+1] = ng
                            data[i+2] = nb
                            data[i+3] = na
                        }
                    }
                }
            }
            else for (let i=0;i<d_ll;i+=pxStep) {
                if (data[i] == r && data[i+1] == g && data[i+2] == b) {
                    data[i]   = nr
                    data[i+1] = ng
                    data[i+2] = nb
                    data[i+3] = na
                }
            }
            ctx.putImageData(img, startX, startY)
        }

        if (preventLate) core()
        else this._bactchedStandalones.push(core)
    }

    /**
     * Applies pixel manipulation to a specified area
     * @param {Render.COLOR_TRANSFORMS} transform 
     * @param {Number | Array} modifier: the modifier value 
     * @param {[[x, y], [x, y]] | null} area: A positions array defining the area to replace the color in
     * @param {Number} densityDivider: The higher the divider, the more pixels will skip the processing. (Defaults to 1, meaning every pixel gets processed)
     * @param {Boolean} preventLate: If true, doesn't include colors from batched operations
     */
    transformArea(transform=COLOR_TRANSFORMS.NONE, modifier, area=null, densityDivider=1, preventLate=false) {
        if (transform) {
            const core = ()=>{
                const ctx = this._ctx, cvs = ctx.canvas, startX = area?.[0]?.[0]??0, startY = area?.[0]?.[1]??0,
                img = ctx.getImageData(startX, startY, (area?.[1]?.[0]-startX)||cvs.width, (area?.[1]?.[1]-startY)||cvs.height),
                data = img.data, d_ll = data.length, transforms = Render.COLOR_TRANSFORMS, random = CDEUtils.random, pxStep = 4*(densityDivider>0?densityDivider:1)

                if (transform==transforms.INVERT) {
                    modifier??=1
                    for (let i=0;i<d_ll;i+=pxStep) {
                        const r=data[i], g=data[i+1], b=data[i+2]
                        data[i]   = (modifier*255)-r
                        data[i+1] = (modifier*255)-g
                        data[i+2] = (modifier*255)-b
                    }
                } else if (transform==transforms.GRAYSCALE) {
                    modifier??=1
                    for (let i=0;i<d_ll;i+=pxStep) {
                        const average = (data[i]+data[i+1]+data[i+2])/3
                        data[i]   = average*modifier
                        data[i+1] = average*modifier
                        data[i+2] = average*modifier
                    }
                } else if (transform==transforms.SEPIA) {
                    modifier??=1
                    for (let i=0;i<d_ll;i+=pxStep) {
                        const r=data[i], g=data[i+1], b=data[i+2]
                        data[i]   = (r*.393+g*.769+b*.189)*modifier
                        data[i+1] = (r*.349+g*.686+b*.168)*modifier
                        data[i+2] = (r*.272+g*.534+b*.131)*modifier
                    }
                } else if (transform==transforms.RANDOMIZE) {
                    modifier||=[0, 255]
                    for (let i=0;i<d_ll;i+=pxStep) {
                        data[i]   = random(modifier[0], modifier[1])
                        data[i+1] = random(modifier[0], modifier[1])
                        data[i+2] = random(modifier[0], modifier[1])
                    }
                } else if (transform==transforms.STATIC) {
                    modifier||=[0, 255]
                    for (let i=0;i<d_ll;i+=pxStep) data[i] = data[i+1] = data[i+2] = random(modifier[0], modifier[1])
                }
                else if (transform==transforms.MULTIPLY) {
                    modifier??=1
                    for (let i=0;i<d_ll;i+=pxStep) {
                        data[i]   *= modifier
                        data[i+1] *= modifier
                        data[i+2] *= modifier
                    }
                } else if (transform==transforms.BGRA) {
                    modifier??=1
                    for (let i=0;i<d_ll;i+=pxStep) {
                        const r=data[i], g=data[i+1], b=data[i+2]
                        data[i]   = b*modifier
                        data[i+1] = g*modifier
                        data[i+2] = r*modifier
                    }
                } else if (transform==transforms.TINT) {
                    modifier||=[255,255,255,1]
                    for (let i=0;i<d_ll;i+=pxStep) {
                        data[i]   = modifier[0]
                        data[i+1] = modifier[1]
                        data[i+2] = modifier[2]
                    }
                }
        
                ctx.putImageData(img, startX, startY)
            }

            if (preventLate) core()
            else this._bactchedStandalones.push(core)
        }
    }

    /**
     * The generate() function allows the generation of a custom graph
     * @param {[x, y]} startPos: pos array defining the starting pos
     * @param {Function} yFn: a function providing a Y value depanding on a given X value. (x)=>{... return y}
     * @param {Number} width: the width in pixels of the generation result. Negative values will generate reversed left-side graphs
     * @param {Number} segmentCount: precision in segments of the generated result
     * @param {Function} baseGeneration: callback returning a path2d which will receive this generation result
     * @returns {Path2D | null} The generated path or null if the width or segmentCount is lower than 1
     */
    static generate(startPos, yFn, width, segmentCount=100, baseGeneration=null) {
        startPos??=[0,0]
        yFn??=()=>0
        width??=100
        segmentCount??=100

        const dir = Math.sign(width), w = Math.abs(width)+.1
        if (w > 1 && segmentCount > 1) {
            const segmentWidth = (w-.1)/segmentCount, ix = startPos[0], iy = startPos[1], path = baseGeneration?baseGeneration(startPos, yFn, width, segmentCount):new Path2D()
            path.moveTo(ix, iy+yFn(0))
            for (let x=0;x<=w;x+=segmentWidth) path.lineTo(ix+(x*dir), iy+yFn(x*dir))
            return path
        }
        return null
    }

    /**
     * Given the following parameters, returns the endPos of a path generated with Render.generate()
     * @param {[x, y]} startPos: pos array defining the starting pos
     * @param {Function} yFn: a function providing a Y value depanding on a given X value. (x)=>{... return y}
     * @param {Number} width: the width in pixels of the generation result
     * @returns {[x, y]} the end pos
     */
    static getGenerationEndPos(startPos, yFn, width) {
        return CDEUtils.addPos(startPos, [width, CDEUtils.round(yFn(width), _BaseObj.POSITION_PRECISION)])
    }

    /**
     * Create a path connecting all the pos/obj provided in parameter
     * @param {Array} posArrays: An array of pos or obj to draw a connection to. The connections are drawn in order of their index.
     * @param {Render.LINE_TYPES | null} lineType: The line type used to create the path. Leave null/undefined for slightly more optimized linear lines. 
     * @returns The created path.
     */
      static composePath(posArrays, lineType) {
        const path = new Path2D(), a_ll = posArrays.length, firstPos = posArrays[0]
        path.moveTo(firstPos[0], firstPos[1])
        for (let i=1;i<a_ll;i++) {
            const pos = posArrays[i].pos||posArrays[i]
            if (lineType) path.addPath(lineType(posArrays[i-1].pos||posArrays[i-1], pos))
            else path.lineTo(pos[0], pos[1])
        }
        return path
    }

    /**
     * Combines all provided paths together
     * @param {Array} paths: an array containing path2ds 
     * @returns A single path2d containing all of the provided paths
     */
    static mergePaths(paths) {
        const p_ll = paths.length, initPath = paths[0]
        for (let i=1;i<p_ll;i++) initPath.addPath(paths[i])
        return initPath
    }

    static Y_FUNCTIONS = {
        SINUS: (height=100, periodWidth=100)=>{
            height??=100
            periodWidth??=100
            periodWidth = (2*Math.PI/Math.abs(periodWidth))

            const sin = Math.sin, a = (Math.abs(height)/2)*Math.sign(height)
            return x=>a*sin(periodWidth*x)
        },
        COSINUS: (height=100, periodWidth=100)=>{
            height??=100
            periodWidth??=100
            periodWidth = (2*Math.PI/Math.abs(periodWidth))

            const cos = Math.cos, a = (Math.abs(height)/2)*Math.sign(height)
            return x=>a*cos(periodWidth*x)
        },
        LINEAR: (a=1)=>{
            a??=1
            return x=>a*x
        }
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