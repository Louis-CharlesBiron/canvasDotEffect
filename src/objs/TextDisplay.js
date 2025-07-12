// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Displays text as an object
class TextDisplay extends _BaseObj {
    static MEASUREMENT_CTX = new OffscreenCanvas(1,1).getContext("2d")
    static DEFAULT_LINE_HEIGHT_PADDING = 10

    #lineCount = null
    constructor(text, pos, color, textStyles, drawMethod, maxWidth, setupCB, loopCB, anchorPos, activationMargin) {
        super(pos, color, setupCB, loopCB, anchorPos, activationMargin)
        this._text = text??""                // displayed text
        this._textStyles = textStyles        // current object's textStyles
        this._drawMethod = drawMethod?.toUpperCase()??Render.DRAW_METHODS.FILL // text draw method, either "fill" or "stroke"
        this._maxWidth = maxWidth??undefined // maximal width of the displayed text in px
        this._lineHeight = null              // lineHeight in px of the text for multi-line display
        this._size = null                    // the text's default size [width, height]
    }
    
    initialize() {
        this._textStyles = CDEUtils.isFunction(this._textStyles) ? this._textStyles(this.render, this) : this._textStyles??this.render.defaultTextProfile
        this.#resize()
        this.initialized = true
        super.initialize()
    }

    #resize(lineHeightPadding=TextDisplay.DEFAULT_LINE_HEIGHT_PADDING) {
        this._size = this.getSize()
        this.#lineCount = this.getTextValue().split("\n").length
        if (this.#lineCount-1) this._size[1] -= lineHeightPadding
        this._lineHeight = this.trueSize[1]/this.#lineCount
    }

    draw(render, time, deltaTime) {
        if (this.initialized) {
            if ((this.a??1) > Color.OPACITY_VISIBILITY_THRESHOLD) {
                const ctx = render.ctx, hasScaling = this._scale[0]!=1||this._scale[1]!=1, hasTransforms = this._rotation||hasScaling, textValue = this.getTextValue()

                let viewPos
                if (hasTransforms) {
                    const cx = this._pos[0], cy = this._pos[1]
                    viewPos = this.parent.viewPos
                    ctx.translate(cx, cy)
                    if (this._rotation) ctx.rotate(CDEUtils.toRad(this._rotation))
                    if (hasScaling) ctx.scale(this._scale[0], this._scale[1])
                    ctx.translate(-cx, -cy)
                }

                if (this._drawMethod=="FILL") render.fillText(textValue, this._pos, this._color, this._textStyles, this._maxWidth, this._lineHeight, this.visualEffects)
                else render.strokeText(textValue, this._pos, this._color, this._textStyles, this._maxWidth, this._lineHeight, this.visualEffects)
                
                if (hasTransforms) ctx.setTransform(1,0,0,1,viewPos[0],viewPos[1])
            }
        }

        super.draw(time, deltaTime)
    }

    // Returns the width and height of the text, according to the textStyles, excluding the scale or rotation
    getSize(textStyles=this._textStyles, text=this.getTextValue(), lineHeightPadding) {
        return TextDisplay.getSize(textStyles, text, lineHeightPadding, this._maxWidth)
    }

    // Returns the width and height of the given text, according to the textStyles, including potential scaling
    static getSize(textStyles, text, lineHeightPadding=TextDisplay.DEFAULT_LINE_HEIGHT_PADDING, maxWidth, scale=[1,1]) {
        TextStyles.apply(TextDisplay.MEASUREMENT_CTX, ...textStyles.getStyles())
        const lines = text.replace(/./g,1).split("\n"), l_ll = lines.length, longestText = l_ll>1?lines.reduce((a,b)=>a.length<b.length?b:a):text,
              {width, actualBoundingBoxAscent, actualBoundingBoxDescent} = TextDisplay.MEASUREMENT_CTX.measureText(longestText)
        return [CDEUtils.round(maxWidth||width, 4)*scale[0], (actualBoundingBoxAscent+actualBoundingBoxDescent)*l_ll*scale[1]+(l_ll*lineHeightPadding)]
    }

    // Returns the width and height of every line of the given text, according to the textStyles, excluding scaling/rotation
    #getAllSizes(lineHeightPadding=TextDisplay.DEFAULT_LINE_HEIGHT_PADDING) {
        const measureCtx = TextDisplay.MEASUREMENT_CTX, maxWidth = this._maxWidth, lines = this.getTextValue().split("\n"), l_ll = lines.length, resultasda = new Array(l_ll)
        TextStyles.apply(measureCtx, ...this._textStyles.getStyles())

        for (let i=0;i<l_ll;i++) {
            const lineRects = measureCtx.measureText("1".repeat(lines[i].length)), width = lineRects.width
            resultasda[i] = [maxWidth&&width>maxWidth?maxWidth:width, lineRects.actualBoundingBoxAscent+lineRects.actualBoundingBoxDescent+lineHeightPadding]
        }
        return resultasda
    }

    // Returns the current text value
    getTextValue() {
        return (CDEUtils.isFunction(this._text) ? this._text(this._parent, this) : this._text).trim()
    }

    // returns a separate copy of this textDisplay instance
    duplicate(text=this._text, pos=this.pos_, color=this._color, textStyles=this._textStyles, drawMethod=this._drawMethod, maxWidth=this._maxWidth, setupCB=this._setupCB, loopCB=this._loopCB, anchorPos=this._anchorPos, activationMargin=this._activationMargin) {
        const colorObject = color, colorRaw = colorObject.colorRaw, textDisplay = new TextDisplay(
            text,
            pos,
            (_,textDisplay)=>(colorRaw instanceof Gradient||colorRaw instanceof Pattern)?colorRaw.duplicate(Array.isArray(colorRaw.initPositions)?null:textDisplay):colorObject.duplicate(),
            textStyles,
            drawMethod,
            maxWidth,
            setupCB,
            loopCB,
            anchorPos,
            activationMargin
        )
        textDisplay._scale = CDEUtils.unlinkArr2(this._scale)
        textDisplay._rotation = this._rotation
        textDisplay._visualEffects = this.visualEffects_
        
        return this.initialized ? textDisplay : null
    }

    // returns whether the provided pos is in the text
    isWithin(pos, padding, rotation, scale) {
        return super.isWithin(pos, this.getBounds(padding, rotation, scale), padding)
    }

    // returns whether the provided pos is in the text
    isWithinAccurate(pos, paddingX, rotation, scale) {
        return this.ctx.isPointInPath(this.getBoundsAccurate(paddingX, rotation, scale), pos[0], pos[1])
    }
    
    // returns the raw a minimal rectangular area containing all of the text (no scale/rotation)
    #getRectBounds() {
        const size = this._size, pos = this._pos, halfLine = (TextDisplay.DEFAULT_LINE_HEIGHT_PADDING/2)+this._lineHeight/2
        return [[pos[0]-size[0]/2, pos[1]-halfLine/2-3], [pos[0]+size[0]/2, pos[1]+size[1]-halfLine]]
    }

    // returns the accurate area containing all of the text
    getBoundsAccurate(paddingX, rotation=this._rotation, scale=this._scale, lineHeightPadding=TextDisplay.DEFAULT_LINE_HEIGHT_PADDING, lineWidthOffset=this.render.currentCtxStyles[0]) {
        const path = new Path2D(), sizes = this.#getAllSizes(), s_ll = sizes.length, top = this._pos[1]-(lineHeightPadding/4+this._lineHeight/4)-lineWidthOffset, cx = this._pos[0]-lineWidthOffset/2
        
        if (paddingX) for (let i=0;i<s_ll;i++) sizes[i][0] += paddingX

        let height = (sizes[0][1]-((s_ll-1)?lineHeightPadding/s_ll:lineHeightPadding/4)), startHalfSize = sizes[0][0]/2, finalSize = sizes[s_ll-1][0], lastX = cx+startHalfSize, points = [[cx-startHalfSize, top], [lastX, top]]

        for (let i=1;i<s_ll;i++) {
            const newY = top+height*i
            points.push([lastX, newY], [lastX=cx+(sizes[i][0]/2), newY])
        }

        points.push([lastX, top+height*s_ll-lineHeightPadding/2])
        points.push([lastX-finalSize, top+height*s_ll-lineHeightPadding/2])
        points.push([lastX=lastX-finalSize, top+height*(s_ll-1)])

        for (let i=s_ll-1;i>0;i--) points.push([cx-sizes[i-1][0]/2, top+height*i], [cx-sizes[i-1][0]/2, top+height*(i-1)])

        for (let i=0;i<points.length;i++) {
            let pos = points[i]
            if (scale[0]!=1||scale[1]!=1) pos = CDEUtils.scalePos(pos, scale, this._pos)
            if (rotation) pos = CDEUtils.rotatePos(pos, rotation, this._pos)

            if (i) path.lineTo(pos[0], pos[1])
            else path.moveTo(pos[0], pos[1])
        }

        return path
    }

    // returns the center of the text
    getCenter() {
        return super.getCenter(this.#getRectBounds())
    }

    // returns the minimal rectangular area containing the text according to default text placements/parameters
    getBounds(padding, rotation=this._rotation, scale=this._scale) {
        return super.getBounds(this.#getRectBounds(), padding, rotation, scale, this._pos)
    }

    get ctx() {return this._parent.ctx}
    get render() {return this._parent.render}
	get text() {return this._text+""}
	get textStyles() {return this._textStyles}
	get drawMethod() {return this._drawMethod}
	get maxWidth() {return this._maxWidth}
    get size() {return this._size}
    get lineHeight() {return this._lineHeight}
    get trueSize() {return [Math.abs(this._size[0]*this._scale[0]), Math.abs(this._size[1]*this._scale[1])]}
    get render() {return this._parent.render}
    get lineCount() {return this.#lineCount}
    get width() {return this.trueSize[0]}
    get height() {return this.trueSize[1]}

	set text(text) {
        const lastYScale = this._scale[1]
        this._text = ""+text||""
        this._scale[1] = 1
        this.#resize()
        this._scale[1] = lastYScale
    }
	set textStyles(_textStyles) {
        this._textStyles = _textStyles??this.render.defaultTextProfile
        this.#resize()
    }
	set drawMethod(_drawMethod) {this._drawMethod = _drawMethod.toUpperCase()}
	set maxWidth(_maxWidth) {
        this._maxWidth = _maxWidth??undefined
        this.#resize()
    }
    set lineHeight(lineHeight) {this._lineHeight = lineHeight}
}