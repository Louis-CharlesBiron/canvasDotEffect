// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// DOC TODO
class TextStyles extends _HasColor {
    static SERIALIZATION_SEPARATOR = "!"
    static DEFAULT_PROFILE = new TextStyles(null, Color.DEFAULT_RGBA)// TODO
    //TODO DEFAULTS
    

    // TODO readme doc
    #ctx = null
    constructor(render, color, font, letterSpacing, wordSpacing, fontVariantCaps, direction, fontStretch, fontKerning, textAlign, textBaseline, textRendering) {// DOC TODO
        super(color)
        this._render = render                  // Canvas render instance
        this.#ctx = render?.ctx                // Canvas context
        this._font = font    
        this._letterSpacing = letterSpacing
        this._wordSpacing = wordSpacing    
        this._fontVariantCaps = fontVariantCaps
        this._direction = direction
        this._fontStretch = fontStretch
        this._fontKerning = fontKerning
        this._textAlign = textAlign
        this._textBaseline = textBaseline
        this._textRendering = textRendering
    }

    // provides information about the measured text
    measureText(text) {
        return this._render.ctx.measureText(text)
    }

    // returns a separate copy of the profile
    duplicate(render=this._render, color=this._color, font=this._font, letterSpacing=this._letterSpacing, wordSpacing=this._wordSpacing, fontVariantCaps=this._fontVariantCaps, direction=this._direction, fontStretch=this._fontStretch, fontKerning=this._fontKerning, textAlign=this._textAlign, textBaseline=this._textBaseline, textRendering=this._textRendering) {
        return new TextStyles(render, color, font, letterSpacing, wordSpacing, fontVariantCaps, direction, fontStretch, fontKerning, textAlign, textBaseline, textRendering)
    }

    // returns the profile's styles as an array
    getStyles() {
        return [this.color, this._font, this._letterSpacing, this._wordSpacing, this._fontVariantCaps, this._direction, this._fontStretch, this._fontKerning, this._textAlign, this._textBaseline, this._textRendering]
    }

    // serializes the styles profile
    toString(color=this._color, font=this._font, letterSpacing=this._letterSpacing, wordSpacing=this._wordSpacing, fontVariantCaps=this._fontVariantCaps, direction=this._direction, fontStretch=this._fontStretch, fontKerning=this._fontKerning, textAlign=this._textAlign, textBaseline=this._textBaseline, textRendering=this._textRendering) {
        let sep = TextStyles.SERIALIZATION_SEPARATOR, colorValue = Color.getColorValue(color)
        if (colorValue instanceof CanvasGradient) colorValue = color.toString()
        return colorValue+sep+font+sep+letterSpacing+sep+wordSpacing+sep+fontVariantCaps+sep+direction+sep+fontStretch+sep+fontKerning+sep+textAlign+sep+textBaseline+sep+textRendering
    }

    // updates a profile's attributes and returns the updated version
    updateStyles(color, font, letterSpacing, wordSpacing, fontVariantCaps, direction, fontStretch, fontKerning, textAlign, textBaseline, textRendering) {
        if (color) this.color = color
        if (font) this._font = font
        if (letterSpacing) this._letterSpacing = letterSpacing
        if (wordSpacing) this._wordSpacing = wordSpacing
        if (fontVariantCaps) this._fontVariantCaps = fontVariantCaps
        if (direction) this._direction = direction
        if (fontStretch) this._fontStretch = fontStretch
        if (fontKerning) this._fontKerning = fontKerning 
        if (textAlign) this._textAlign = textAlign 
        if (textBaseline) this._textBaseline = textBaseline 
        if (textRendering) this._textRendering = textRendering 
        return this
    }

    // directly applies the styles of the profile
    applyStyles(color=this._color, font=this._font, letterSpacing=this._letterSpacing, wordSpacing=this._wordSpacing, fontVariantCaps=this._fontVariantCaps, direction=this._direction, fontStretch=this._fontStretch, fontKerning=this._fontKerning, textAlign=this._textAlign, textBaseline=this._textBaseline, textRendering=this._textRendering) {
        const ctx = this.#ctx, colorValue = Color.getColorValue(color), currentTextStyles = this._render.currentCtxTextStyles
        if (color && currentTextStyles[0] !== colorValue) currentTextStyles[0] = ctx.strokeStyle = ctx.fillStyle = colorValue
        if (font && currentTextStyles[1] !== font) currentTextStyles[1] = ctx.font = font
        if (letterSpacing && currentTextStyles[2] !== letterSpacing) currentTextStyles[3] = ctx.letterSpacing = letterSpacing
        if (wordSpacing && currentTextStyles[3] !== wordSpacing) currentTextStyles[3] = ctx.wordSpacing = wordSpacing
        if (fontVariantCaps && currentTextStyles[4] !== fontVariantCaps) currentTextStyles[4] = ctx.fontVariantCaps = fontVariantCaps
        if (direction && currentTextStyles[5] !== direction) currentTextStyles[5] = ctx.direction = direction
        if (fontStretch && currentTextStyles[6] !== fontStretch) currentTextStyles[6] = ctx.fontStretch = fontStretch
        if (fontKerning && currentTextStyles[7] !== fontKerning) currentTextStyles[7] = ctx.fontKerning = fontKerning
        if (textAlign && currentTextStyles[8] !== textAlign) currentTextStyles[8] = ctx.textAlign = textAlign
        if (textBaseline && currentTextStyles[9] !== textBaseline) currentTextStyles[9] = ctx.textBaseline = textBaseline
        if (textRendering && currentTextStyles[10] !== textRendering) currentTextStyles[10] = ctx.textRendering = textRendering
    }

    // directly applies the provided styles
    static applyStyles(render, color, font, letterSpacing, wordSpacing, fontVariantCaps, direction, fontStretch, fontKerning, textAlign, textBaseline, textRendering) {
        const ctx = render.ctx, colorValue = Color.getColorValue(color), currentTextStyles = render.currentCtxTextStyles
        if (color && currentTextStyles[0] !== colorValue) currentTextStyles[0] = ctx.strokeStyle = ctx.fillStyle = colorValue
        if (font && currentTextStyles[1] !== font) currentTextStyles[1] = ctx.font = font
        if (letterSpacing && currentTextStyles[2] !== letterSpacing) currentTextStyles[3] = ctx.letterSpacing = letterSpacing
        if (wordSpacing && currentTextStyles[3] !== wordSpacing) currentTextStyles[3] = ctx.wordSpacing = wordSpacing
        if (fontVariantCaps && currentTextStyles[4] !== fontVariantCaps) currentTextStyles[4] = ctx.fontVariantCaps = fontVariantCaps
        if (direction && currentTextStyles[5] !== direction) currentTextStyles[5] = ctx.direction = direction
        if (fontStretch && currentTextStyles[6] !== fontStretch) currentTextStyles[6] = ctx.fontStretch = fontStretch
        if (fontKerning && currentTextStyles[7] !== fontKerning) currentTextStyles[7] = ctx.fontKerning = fontKerning
        if (textAlign && currentTextStyles[8] !== textAlign) currentTextStyles[8] = ctx.textAlign = textAlign
        if (textBaseline && currentTextStyles[9] !== textBaseline) currentTextStyles[9] = ctx.textBaseline = textBaseline
        if (textRendering && currentTextStyles[10] !== textRendering) currentTextStyles[10] = ctx.textRendering = textRendering
    }


    get render() {return this._render}
	get font() {return this._font}
	get letterSpacing() {return this._letterSpacing}
	get wordSpacing() {return this._wordSpacing}
	get fontVariantCaps() {return this._fontVariantCaps}
	get direction() {return this._direction}
	get fontStretch() {return this._fontStretch}
	get fontKerning() {return this._fontKerning}
	get textAlign() {return this._textAlign}
	get textBaseline() {return this._textBaseline}
	get textRendering() {return this._textRendering}

	set render(render) {
        this._render = render
        this.#ctx = render.ctx
    }
	set font(_font) {this._font = _font}
	set letterSpacing(_letterSpacing) {this._letterSpacing = _letterSpacing}
	set wordSpacing(_wordSpacing) {this._wordSpacing = _wordSpacing}
	set fontVariantCaps(_fontVariantCaps) {this._fontVariantCaps = _fontVariantCaps}
	set direction(_direction) {this._direction = _direction}
	set fontStretch(_fontStretch) {this._fontStretch = _fontStretch}
	set fontKerning(_fontKerning) {this._fontKerning = _fontKerning}
	set textAlign(_textAlign) {this._textAlign = _textAlign}
	set textBaseline(_textBaseline) {this._textBaseline = _textBaseline}
	set textRendering(_textRendering) {this._textRendering = _textRendering}

}