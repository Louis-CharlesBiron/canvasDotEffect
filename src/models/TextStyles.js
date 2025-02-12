// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Represents a styling profile for text
class TextStyles {
    static CAPS_VARIANTS = {NORMAL:"normal", SMALL_CAPS:"small-caps", ALL_SMALL_CAPS:"all-small-caps", PETITE_CAPS:"petite-caps", ALL_PETITE_CAPS:"all-petite-caps", UNICASE:"unicase", TILTING_CAPS:"tilting-caps"}
    static DIRECTIONS = {LEFT_TO_RIGHT:"ltr", RIGHT_TO_LEFT:"rtl", INHERIT:"inherit"}
    static STRETCHES = {ULTRA_CONDENSED:"ultra-condensed", EXTRA_CONDENSED:"extra-condensed", CONDENSED:"condensed", SEMI_CONDENSED:"semi-condensed", NORMAL:"normal", SEMI_EXPANDED:"semi-expanded", EXPANDED:"expanded", EXTRA_EXPANDED:"extra-expanded", ULTRA_EXPANDED:"ultra-expanded"}
    static KERNINGS = {AUTO:"auto", NORMAL:"normal", NONE:"none"}
    static ALIGNMENTS = {LEFT:"left", RIGTH:"normal", CENTER:"center", START:"start", END:"end"}
    static BASELINES = {TOP:"top", BOTTOM:"bottom", HANGING:"hanging", MIDDLE:"middle", ALPHABETIC:"alphabetic", IDEOGRAPHIC:"ideographic"}
    static RENDERINGS = {AUTO:"auto", FAST:"optimizeSpeed", LEGIBLE:"optimizeLegibility", PRECISE:"geometricPrecision"}
    static DEFAULT_FONT = "32px Arial"
    static DEFAULT_LETTER_SPACING = "2px"
    static DEFAULT_WORD_SPACING = "4px"
    static DEFAULT_FONT_VARIANT_CAPS = TextStyles.CAPS_VARIANTS.NORMAL
    static DEFAULT_DIRECTION = TextStyles.DIRECTIONS.LEFT_TO_RIGHT
    static DEFAULT_FONT_STRETCH = TextStyles.STRETCHES.NORMAL
    static DEFAULT_FONT_KERNING = TextStyles.KERNINGS.NORMAL
    static DEFAULT_TEXT_ALIGN = TextStyles.ALIGNMENTS.CENTER
    static DEFAULT_TEXT_BASELINE = TextStyles.BASELINES.MIDDLE
    static DEFAULT_TEXT_RENDERING = TextStyles.RENDERINGS.FAST
    static DEFAULT_PROFILE = new TextStyles(null, TextStyles.DEFAULT_FONT, TextStyles.DEFAULT_LETTER_SPACING, TextStyles.DEFAULT_WORD_SPACING, TextStyles.DEFAULT_FONT_VARIANT_CAPS, TextStyles.DEFAULT_DIRECTION, TextStyles.DEFAULT_FONT_STRETCH, TextStyles.DEFAULT_FONT_KERNING, TextStyles.DEFAULT_TEXT_ALIGN, TextStyles.DEFAULT_TEXT_BASELINE, TextStyles.DEFAULT_TEXT_RENDERING)

    #ctx = null
    constructor(render, font, letterSpacing, wordSpacing, fontVariantCaps, direction, fontStretch, fontKerning, textAlign, textBaseline, textRendering) {
        this._render = render                                                        // Canvas render instance
        this.#ctx = render?.ctx                                                      // Canvas context
        this._font = font??TextStyles.DEFAULT_FONT                                   // text font-style, font-variant, font-weight, font-size, line-height, font-family
        this._letterSpacing = letterSpacing??TextStyles.DEFAULT_LETTER_SPACING       // gaps in px between letters
        this._wordSpacing = wordSpacing??TextStyles.DEFAULT_WORD_SPACING             // gaps in px between words
        this._fontVariantCaps = fontVariantCaps??TextStyles.DEFAULT_FONT_VARIANT_CAPS// specifies alternative capitalization
        this._direction = direction??TextStyles.DEFAULT_DIRECTION                    // text direction
        this._fontStretch = fontStretch??TextStyles.DEFAULT_FONT_STRETCH             // text streching
        this._fontKerning = fontKerning??TextStyles.DEFAULT_FONT_KERNING             // whether the default spacing of certain letters is uniform 
        this._textAlign = textAlign??TextStyles.DEFAULT_TEXT_ALIGN                   // text horizontal alignment
        this._textBaseline = textBaseline??TextStyles.DEFAULT_TEXT_BASELINE          // text vertical alignment
        this._textRendering = textRendering??TextStyles.DEFAULT_TEXT_RENDERING       // text rendering optimization method
    }

    // returns a separate copy of the profile
    duplicate(render=this._render, font=this._font, letterSpacing=this._letterSpacing, wordSpacing=this._wordSpacing, fontVariantCaps=this._fontVariantCaps, direction=this._direction, fontStretch=this._fontStretch, fontKerning=this._fontKerning, textAlign=this._textAlign, textBaseline=this._textBaseline, textRendering=this._textRendering) {
        return new TextStyles(render, font, letterSpacing, wordSpacing, fontVariantCaps, direction, fontStretch, fontKerning, textAlign, textBaseline, textRendering)
    }

    // returns the profile's styles as an array
    getStyles() {
        return [this._font, this._letterSpacing, this._wordSpacing, this._fontVariantCaps, this._direction, this._fontStretch, this._fontKerning, this._textAlign, this._textBaseline, this._textRendering]
    }

    // updates a profile's attributes and returns the updated version
    updateStyles(font, letterSpacing, wordSpacing, fontVariantCaps, direction, fontStretch, fontKerning, textAlign, textBaseline, textRendering) {
        if (font) this._font = font
        if (letterSpacing) this._letterSpacing = typeof letterSpacing==="number"?letterSpacing+"px":letterSpacing
        if (wordSpacing) this._wordSpacing = typeof wordSpacing==="number"?wordSpacing+"px":wordSpacing
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
    applyStyles(font=this._font, letterSpacing=this._letterSpacing, wordSpacing=this._wordSpacing, fontVariantCaps=this._fontVariantCaps, direction=this._direction, fontStretch=this._fontStretch, fontKerning=this._fontKerning, textAlign=this._textAlign, textBaseline=this._textBaseline, textRendering=this._textRendering) {
        const ctx = this.#ctx, currentTextStyles = this._render.currentCtxTextStyles
        if (font && currentTextStyles[0] !== font) currentTextStyles[0] = ctx.font = font
        if (letterSpacing && currentTextStyles[1] !== letterSpacing) currentTextStyles[1] = ctx.letterSpacing = letterSpacing
        if (wordSpacing && currentTextStyles[2] !== wordSpacing) currentTextStyles[2] = ctx.wordSpacing = wordSpacing
        if (fontVariantCaps && currentTextStyles[3] !== fontVariantCaps) currentTextStyles[3] = ctx.fontVariantCaps = fontVariantCaps
        if (direction && currentTextStyles[4] !== direction) currentTextStyles[4] = ctx.direction = direction
        if (fontStretch && currentTextStyles[5] !== fontStretch) currentTextStyles[5] = ctx.fontStretch = fontStretch
        if (fontKerning && currentTextStyles[6] !== fontKerning) currentTextStyles[6] = ctx.fontKerning = fontKerning
        if (textAlign && currentTextStyles[7] !== textAlign) currentTextStyles[7] = ctx.textAlign = textAlign
        if (textBaseline && currentTextStyles[8] !== textBaseline) currentTextStyles[8] = ctx.textBaseline = textBaseline
        if (textRendering && currentTextStyles[9] !== textRendering) currentTextStyles[9] = ctx.textRendering = textRendering
    }

    // directly applies the styles of the profile
    static applyStyles(ctx, font, letterSpacing, wordSpacing, fontVariantCaps, direction, fontStretch, fontKerning, textAlign, textBaseline, textRendering) {
        const currentTextStyles = [ctx.font, ctx.letterSpacing, ctx.wordSpacing, ctx.fontVariantCaps, ctx.direction, ctx.fontStretch, ctx.fontKerning, ctx.textAlign, ctx.textBaseline, ctx.textRendering]
        if (font && currentTextStyles[0] !== font) currentTextStyles[0] = ctx.font = font
        if (letterSpacing && currentTextStyles[1] !== letterSpacing) currentTextStyles[1] = ctx.letterSpacing = letterSpacing
        if (wordSpacing && currentTextStyles[2] !== wordSpacing) currentTextStyles[2] = ctx.wordSpacing = wordSpacing
        if (fontVariantCaps && currentTextStyles[3] !== fontVariantCaps) currentTextStyles[3] = ctx.fontVariantCaps = fontVariantCaps
        if (direction && currentTextStyles[4] !== direction) currentTextStyles[4] = ctx.direction = direction
        if (fontStretch && currentTextStyles[5] !== fontStretch) currentTextStyles[5] = ctx.fontStretch = fontStretch
        if (fontKerning && currentTextStyles[6] !== fontKerning) currentTextStyles[6] = ctx.fontKerning = fontKerning
        if (textAlign && currentTextStyles[7] !== textAlign) currentTextStyles[7] = ctx.textAlign = textAlign
        if (textBaseline && currentTextStyles[8] !== textBaseline) currentTextStyles[8] = ctx.textBaseline = textBaseline
        if (textRendering && currentTextStyles[9] !== textRendering) currentTextStyles[9] = ctx.textRendering = textRendering
    }

    get render() {return this._render}
	get font() {return this._font}
	get letterSpacing() {return +this._letterSpacing.replace("px","")}
	get wordSpacing() {return +this._wordSpacing.replace("px","")}
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
	set letterSpacing(_letterSpacing) {this._letterSpacing = typeof _letterSpacing==="number"?_letterSpacing+"px":_letterSpacing}
	set wordSpacing(_wordSpacing) {this._wordSpacing = typeof _wordSpacing==="number"?_wordSpacing+"px":_wordSpacing}
	set fontVariantCaps(_fontVariantCaps) {this._fontVariantCaps = _fontVariantCaps}
	set direction(_direction) {this._direction = _direction}
	set fontStretch(_fontStretch) {this._fontStretch = _fontStretch}
	set fontKerning(_fontKerning) {this._fontKerning = _fontKerning}
	set textAlign(_textAlign) {this._textAlign = _textAlign}
	set textBaseline(_textBaseline) {this._textBaseline = _textBaseline}
	set textRendering(_textRendering) {this._textRendering = _textRendering}

}