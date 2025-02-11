// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// TODO UPDATE TO TEXT OBJECT
// TODO DOC
class TextDisplay extends _BaseObj {
    static MEASUREMENT_CTX = new OffscreenCanvas(1, 1).getContext("2d") 
    /*
        - setup obj functions overrides: draw, initialize, etc
        - setup l'utilisation de render
        - setup scaling / rotation, dynamic gradients

        - documentation
    */
    constructor(textValue, pos, color, textStyles, drawMethod, maxWidth, setupCB, anchorPos, alwaysActive) {
        super(pos, color, setupCB, anchorPos, alwaysActive)
        this._textValue = textValue??""      // displayed text value
        this._textStyles = textStyles        // current object's textStyles
        this._drawMethod = drawMethod?.toUpperCase()??Render.DRAW_METHODS.FILL // text draw method, either "fill" or "stroke"
        this._maxWidth = maxWidth??undefined // maximal width of the displayed text in px

        this._parent = null  // the parent object of the text (Canvas)
        this._rotation = 0   // the text's rotation in degrees 
        this._scale = [1,1]  // the text's scale factors: [scaleX, scaleY]
        this._size = null    // the text's default size [width, height]
    }

    getSize(textStyles=this._textStyles, textValue=this._textValue) {
        TextStyles.applyStyles(TextDisplay.MEASUREMENT_CTX, ...textStyles.getStyles())
        const {width, actualBoundingBoxAscent, actualBoundingBoxDescent} = TextDisplay.MEASUREMENT_CTX.measureText(textValue)
        return [this._maxWidth||width, actualBoundingBoxAscent+actualBoundingBoxDescent]
    }
    
    initialize() {
        const render = this._parent.render
        this._textStyles = CDEUtils.isFunction(this._textStyles) ? this._textStyles(render, this) : this._textStyles??render.defaultTextProfile
        this._size = this.getSize()
        super.initialize()
    }

    draw(render, time, deltaTime) {
        if (this.a > Color.OPACITY_VISIBILITY_THRESHOLD) {
            const ctx = render.ctx, x = this.x, y = this.y


            ctx.save()
            if (this._rotation) {
                ctx.translate(x, y)
                ctx.rotate(CDEUtils.toRad(this._rotation))
                ctx.translate(-x, -y)
            }

            // TODO SCALE

            if (this._drawMethod==="FILL") render.fillText(this._textValue, this._pos, this._textStyles, this._maxWidth)
            else render.strokeText(this._textValue, this._pos, this._textStyles, this._maxWidth)
            ctx.restore()
        }

        super.draw(time, deltaTime)
    }

    // TODO
    // returns a separate copy of the profile
    //duplicate(render=this._render, color=this._color, font=this._font, letterSpacing=this._letterSpacing, wordSpacing=this._wordSpacing, fontVariantCaps=this._fontVariantCaps, direction=this._direction, fontStretch=this._fontStretch, fontKerning=this._fontKerning, textAlign=this._textAlign, textBaseline=this._textBaseline, textRendering=this._textRendering) {
    //    return new TextDisplay(render, color, font, letterSpacing, wordSpacing, fontVariantCaps, direction, fontStretch, fontKerning, textAlign, textBaseline, textRendering)
    //}

	get textValue() {return this._textValue}
	get textStyles() {return this._textStyles}
	get drawMethod() {return this._drawMethod}
	get maxWidth() {return this._maxWidth}
	get parent() {return this._parent}
    get rotation() {return this._rotation}
    get scale() {return this._scale}
    get size() {return this._size}
    get render() {return this._parent.render}
    get ctx() {return this._parent.render.ctx}

	set textValue(_textValue) {
        this._textValue = _textValue
        this._size = this.getSize()
    }
	set textStyles(_textStyles) {
        this._textStyles = _textStyles??this.render.defaultTextProfile
        this._size = this.getSize()
    }
	set drawMethod(_drawMethod) {this._drawMethod = _drawMethod.toUpperCase()}
	set maxWidth(_maxWidth) {
        this._maxWidth = _maxWidth??undefined
        this._size = this.getSize()
    }
    set rotation(_rotation) {return this._rotation = _rotation%360}
    set scale(_scale) {this._scale = _scale}
}