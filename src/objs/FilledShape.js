// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Regular shape with a filled area defined by its dots
class FilledShape extends Shape {
    #lastDotsPos = null
    constructor(fillColor, dynamicUpdates, pos, dots, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, loopCB, anchorPos, alwaysActive, fragile) {
        super(pos, dots, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, loopCB, anchorPos, alwaysActive, fragile)
        this._initFillColor = fillColor       // declaration color fill value
        this._fillColor = this._initFillColor // the current color or gradient of the filled shape
        this._path = null                     // path perimeter delimiting the surface to fill
        this._dynamicUpdates = dynamicUpdates // whether the shape's filling checks for updates every frame
    }

    // initializes the filled shape and creates its path
    initialize() {
        super.initialize()
        if (CDEUtils.isFunction(this._initFillColor)) this.fillColor = this._initFillColor(this.render, this)
        else this.fillColor = this._initFillColor
        this.updatePath()
    }

    // runs every frame, draws the shape if it is at least containing 3 dots
    draw(render, time, deltaTime) {
        super.draw(render, time, deltaTime)
        
        if (this.dots.length > 2) {
            if (this._dynamicUpdates) this.updatePath()
            render.fill(this._path, this._fillColor, this.visualEffects)
        }
    }

    // returns a separate copy of this FilledShape (only initialized for objects)
    duplicate() {
        const fillColorObject = this._fillColor, fillColorRaw = fillColorObject.colorRaw, colorObject = this._color, colorRaw = colorObject.colorRaw, filledShape = new FilledShape(
            (_,shape)=>(fillColorRaw instanceof Gradient||fillColorRaw instanceof Pattern)?fillColorRaw.duplicate(Array.isArray(fillColorRaw.initPositions)?null:shape):fillColorObject.duplicate(),
            this._dynamicUpdates,
            this.pos_,
            this._dots.map(d=>d.duplicate()),
            this._radius,
            (_,shape)=>(colorRaw instanceof Gradient||colorRaw instanceof Pattern)?colorRaw.duplicate(Array.isArray(colorRaw.initPositions)?null:shape):colorObject.duplicate(),
            this._limit,
            this._drawEffectCB,
            this._ratioPosCB,
            this._setupCB,
            this._loopCB,
            this._fragile
        )
        filledShape._scale = CDEUtils.unlinkArr2(this._scale)
        filledShape._rotation = this._rotation
        filledShape._visualEffects = this.visualEffects_
        
        return this.initialized ? filledShape : null
    }

    // updates the path perimeter if the dots pos have changed
    updatePath() {
        const d_ll = this.dots.length
        if (d_ll) {
            const currentDotPos = this.dotsPositions
            if (currentDotPos !== this.#lastDotsPos) {
                this.#lastDotsPos = currentDotPos
                this._path = new Path2D()
                const firstDotPos = this.dots[0].pos
                this._path.moveTo(firstDotPos[0], firstDotPos[1])
                for (let i=1;i<d_ll;i++) {
                    const dotPos = this.dots[i].pos
                    this._path.lineTo(dotPos[0], dotPos[1])
                }
                this._path.closePath()
            } 
        }
    }

    get fillColorObject() {return this._fillColor}
    get fillColorRaw() {return this._fillColor.colorRaw}
    get fillColor() {return this._fillColor.color}
    get initFillColor() {return this._initFillColor}
	get path() {return this._path}
	get dynamicUpdates() {return this._dynamicUpdates}

    set fillColor(fillColor) {
        const fc = this._fillColor
        if (!fc || fc?.colorRaw?.toString() !== fillColor?.toString()) {
            const specialColor = fillColor?.colorRaw||fillColor
            if (specialColor?.positions==_DynamicColor.PLACEHOLDER) {
                if (!fillColor.isChannel) fillColor = specialColor.duplicate()
                else fillColor = specialColor 
                fillColor.initPositions = this
            }

            
            if (fc instanceof Color) fc.color = color
            else this._fillColor = Color.adjust(fillColor)
        }
    }
	set dynamicUpdates(_dynamicUpdates) {return this._dynamicUpdates = _dynamicUpdates}
}