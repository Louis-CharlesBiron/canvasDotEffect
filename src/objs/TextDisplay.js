// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Displays text as an object
class TextDisplay extends _BaseObj {
    static MEASUREMENT_CTX = new OffscreenCanvas(1,1).getContext("2d") 

    #lineCount = 1
    constructor(text, pos, color, textStyles, drawMethod, maxWidth, setupCB, anchorPos, alwaysActive) {
        super(pos, color, setupCB, anchorPos, alwaysActive)
        this._text = text??""                // displayed text
        this._textStyles = textStyles        // current object's textStyles
        this._drawMethod = drawMethod?.toUpperCase()??Render.DRAW_METHODS.FILL // text draw method, either "fill" or "stroke"
        this._maxWidth = maxWidth??undefined // maximal width of the displayed text in px
        this._lineHeigth = null              // lineHeight in px of the text for multi-line display

        this._parent = null  // the parent object of the text (Canvas)
        this._rotation = 0   // the text's rotation in degrees 
        this._scale = [1,1]  // the text's scale factors: [scaleX, scaleY]
        this._size = null    // the text's default size [width, height]
    }
    
    initialize() {
        this._textStyles = CDEUtils.isFunction(this._textStyles) ? this._textStyles(this.render, this) : this._textStyles??this.render.defaultTextProfile
        this._size = this.getSize()
        this._lineHeigth ??= this.trueSize[1]/this.#lineCount
        super.initialize()
    }

    draw(render, time, deltaTime) {
        if (this.initialized) {
            if (this.a??1 > Color.OPACITY_VISIBILITY_THRESHOLD) {
                const ctx = render.ctx, x = this._pos[0], y = this._pos[1], hasScaling = this._scale[0]!==1||this._scale[1]!==1, hasTransforms = this._rotation || hasScaling, textValue = this.getTextValue()

                if (hasTransforms) {
                    ctx.translate(x, y)
                    if (this._rotation) ctx.rotate(CDEUtils.toRad(this._rotation))
                    if (hasScaling) ctx.scale(this._scale[0], this._scale[1])
                    ctx.translate(-x, -y)
                }

                if (this._drawMethod==="FILL") render.fillText(textValue, this._pos, this._color, this._textStyles, this._maxWidth, this._lineHeigth)
                else render.strokeText(textValue, this._pos, this._color, this._textStyles, this._maxWidth, this._lineHeigth)
                
                if (hasTransforms) ctx.setTransform(1,0,0,1,0,0)
            }
        } else this.initialized = true

        super.draw(time, deltaTime)
    }

    // Returns the width and height of the text, according to the textStyles, excluding the scale or rotation
    getSize(textStyles=this._textStyles, text=this.getTextValue()) {
        TextStyles.applyStyles(TextDisplay.MEASUREMENT_CTX, ...textStyles.getStyles())
        const lines = text.split("\n"), l_ll = this.#lineCount = lines.length, longestText = l_ll>1?lines.reduce((a,b)=>a.length<b.length?b:a):text,
              {width, actualBoundingBoxAscent, actualBoundingBoxDescent} = TextDisplay.MEASUREMENT_CTX.measureText(longestText)
        return [CDEUtils.round(this._maxWidth||width, 2), (actualBoundingBoxAscent+actualBoundingBoxDescent)*l_ll]
    }

    // Returns the current text value
    getTextValue() {
        return CDEUtils.isFunction(this._text) ? this._text(this._parent, this) : this._text
    }

    // Rotates the text by a specified degree increment around its pos
    rotateBy(deg) {// clock-wise
        this._rotation = (this._rotation+deg)%360
    }

    // Rotates the text to a specified degree around its pos
    rotateAt(deg) {
        this._rotation = deg%360
    }

    // Smoothly rotates the text to a specified degree around its pos
    rotateTo(deg, time=1000, easing=Anim.easeInOutQuad, isUnique=false, force=false) {
        const ir = this._rotation, dr = deg-this._rotation
        return this.playAnim(new Anim((prog)=>this.rotateAt(ir+dr*prog), time, easing), isUnique, force)
    }

    // Scales the text by a specified amount [scaleX, scaleY] from its pos
    scaleBy(scale) {
        let [scaleX, scaleY] = scale
        if (!CDEUtils.isDefined(scaleX)) scaleX = this._scale[0]
        if (!CDEUtils.isDefined(scaleY)) scaleY = this._scale[1]
        this._scale[0] *= scaleX
        this._scale[1] *= scaleY
    }

    // Scales the text to a specified amount [scaleX, scaleY] from its pos
    scaleAt(scale) {
        this.scale = scale
    }

    // Smoothly scales the text to a specified amount [scaleX, scaleY] from its pos
    scaleTo(scale, time=1000, easing=Anim.easeInOutQuad, centerPos=this.pos, isUnique=false, force=false) {
        const is = CDEUtils.unlinkArr2(this._scale), dsX = scale[0]-is[0], dsY = scale[1]-is[1]

        return this.playAnim(new Anim(prog=>this.scaleAt([is[0]+dsX*prog, is[1]+dsY*prog], centerPos), time, easing), isUnique, force)
    }

    // returns a separate copy of this textDisplay instance
    duplicate(text=this._text, pos=this.pos_, color=this._color.duplicate(), textStyles=this._textStyles, drawMethod=this._drawMethod, maxWidth=this._maxWidth, setupCB=this._setupCB, anchorPos=this._anchorPos, alwaysActive=this._alwaysActive) {
        return this.initialized ? new TextDisplay(text, pos, color, textStyles, drawMethod, maxWidth, setupCB, anchorPos, alwaysActive) : null
    }

	get text() {return this._text}
	get textStyles() {return this._textStyles}
	get drawMethod() {return this._drawMethod}
	get maxWidth() {return this._maxWidth}
	get parent() {return this._parent}
    get rotation() {return this._rotation}
    get scale() {return this._scale}
    get size() {return this._size}
    get lineHeigth() {return this._lineHeigth}
    get trueSize() {return [this._size[0]*this._scale[0], this._size[1]*this._scale[1]]}
    get render() {return this._parent.render}
    get lineCount() {return this.#lineCount}

	set text(_text) {
        this._text = _text
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
    set rotation(_rotation) {this._rotation = _rotation%360}
    set scale(_scale) {
        let [scaleX, scaleY] = _scale
        if (!CDEUtils.isDefined(scaleX)) scaleX = this._scale[0]
        if (!CDEUtils.isDefined(scaleY)) scaleY = this._scale[1]
        this._scale[0] = scaleX
        this._scale[1] = scaleY
    }
    set lineHeigth(lineHeigth) {this._lineHeigth = lineHeigth}
}