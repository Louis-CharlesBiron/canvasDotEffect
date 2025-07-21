// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

class FilledShape extends Shape {
    #lastDotsPos = null

    /**
     * Regular shape with a filled area defined by its dots
     * @param {Color | String | [r,g,b,a]?} fillColor: the color of the area's filling
     * @param {Boolean?} dynamicUpdates: whether the shape's filling checks for updates every frame
     * @param {[x,y]?} pos: the pos of the object 
     * @param {Dot | Dot[] ?} dots: array containing current dots in the shape
     * @param {Number?} radius: the radius of the dots
     * @param {Color | String | [r,g,b,a]?} color: the color of the dots
     * @param {Number?} limit: the delimiter radius within which the drawEffectCB can take effect
     * @param {Function?} drawEffectCB: a function called every frame for each dot of the shape, used to create effects. (render, dot, ratio, setupResults, mouse, distance, parent, isActive, rawRatio)=>
     * @param {Function?} ratioPosCB: a function that returns a ratio pos target for calculating the dots ratio attribute. (this, dots)=>{return [x,y]}
     * @param {Function?} setupCB: function called on object's initialization (this, parent)=>{...}
     * @param {Function?} loopCB: function called each frame for this object (this)=>{...}
     * @param {[x,y] | Function | _BaseObj ?} anchorPos: reference point from which the object's pos will be set. Either a pos array, a callback (this, parent)=>{return [x,y] | _baseObj} or a _BaseObj inheritor
     * @param {Number | Boolean ?} activationMargin: the pixel margin amount from where the object remains active when outside the canvas visual bounds. If "true", the object will always remain active.
     * @param {Boolean?} fragile: (DEPRECATED) whether the shape resets on document visibility change 
     */
    constructor(fillColor, dynamicUpdates=false, pos, dots, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, loopCB, anchorPos, activationMargin, fragile) {
        super(pos, dots, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, loopCB, anchorPos, activationMargin, fragile)
        this._initFillColor = fillColor       // declaration color fill value
        this._fillColor = this._initFillColor // the current color or gradient of the filled shape
        this._dynamicUpdates = dynamicUpdates // whether the shape's filling checks for updates every frame
        this._path = null                     // path perimeter delimiting the surface to fill
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

    /**
     * Updates the path perimeter if the dots pos have changed
     */
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

    /**
     * @returns a separate copy of this FilledShape (only if initialized)
     */
    duplicate(fillColor=this._fillColor, dynamicUpdates=this._dynamicUpdates, pos=this.pos_, dots=this._dots.map(d=>d.duplicate()), radius=this._radius, color=this._color, limit=this._limit, drawEffectCB=this._drawEffectCB, ratioPosCB=this._ratioPosCB, setupCB=this._setupCB, loopCB=this._loopCB, anchorPos=this._anchorPos, activationMargin=this._activationMargin, fragile=this._fragile) {
        const fillColorObject = fillColor, fillColorRaw = fillColorObject.colorRaw, colorObject = color, colorRaw = colorObject.colorRaw, filledShape = new FilledShape(
            (_,shape)=>(fillColorRaw instanceof Gradient||fillColorRaw instanceof Pattern)?fillColorRaw.duplicate(Array.isArray(fillColorRaw.initPositions)?null:shape):fillColorObject.duplicate(),
            dynamicUpdates,
            pos,
            dots,
            radius,
            (_,shape)=>(colorRaw instanceof Gradient||colorRaw instanceof Pattern)?colorRaw.duplicate(Array.isArray(colorRaw.initPositions)?null:shape):colorObject.duplicate(),
            limit,
            drawEffectCB,
            ratioPosCB,
            setupCB,
            loopCB,
            anchorPos,
            activationMargin,
            fragile
        )
        filledShape._scale = CDEUtils.unlinkArr2(this._scale)
        filledShape._rotation = this._rotation
        filledShape._visualEffects = this.visualEffects_
        
        return this.initialized ? filledShape : null
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

            
            if (fc instanceof Color) fc.color = fillColor
            else this._fillColor = Color.adjust(fillColor)
        }
    }
	set dynamicUpdates(_dynamicUpdates) {return this._dynamicUpdates = _dynamicUpdates}
}