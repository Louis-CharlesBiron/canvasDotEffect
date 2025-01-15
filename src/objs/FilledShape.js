// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Regular shape with a filled area defined by its dots
class FilledShape extends Shape {
    #lastDotsPos = null
    constructor(fillColor, dynamicUpdates, pos, dots, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, alwaysActive, fragile) {
        super(pos, dots, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, alwaysActive, fragile)
        this._initFillColor = fillColor                           // declaration color fill value
        this._fillColor = this._initFillColor                     // the current color or gradient of the filled shape
        this._path = null                                         // path perimeter delimiting the surface to fill
        this._dynamicUpdates = dynamicUpdates                     // whether the shape's filling checks for updates every frame
    }

    // initializes the filled shape and creates its path
    initialize() {
        super.initialize()
        if (typeof this._initFillColor=="function") this.fillColor = this._initFillColor(this.ctx, this)
        else this.fillColor = this._initFillColor
        this.updatePath()
    }

    // runs every frame, draws the shape if it is at least containing 3 dots
    draw(ctx, time) {
        super.draw(ctx, time)
        
        if (this.dots.length > 2) {
            if (this._dynamicUpdates) this.updatePath()
            ctx.fillStyle = this.fillColor
            ctx.fill(this._path)
        }
    }

    // returns a separate copy of this FilledShape (only initialized for objects)
    duplicate() {
        return this.initialized ? new FilledShape((_,shape)=>this.fillColorRaw instanceof Gradient?this.fillColorRaw.duplicate(Array.isArray(this.fillColorRaw.initPositions)?null:shape):this.fillColorObject.duplicate(), this._dynamicUpdates, this.pos_, this._dots.map(d=>d.duplicate()), this.radius, (_,shape)=>this.colorRaw instanceof Gradient?this.colorRaw.duplicate(Array.isArray(this.colorRaw.initPositions)?null:shape):this.colorObject.duplicate(), this.limit, this._drawEffectCB, this._ratioPosCB, this.setupCB, this._fragile) : null
    }

    // updates the path perimeter if the dots pos have changed
    updatePath() {
        let d_ll = this.dots.length
        if (d_ll) {
            let currentDotPos = this.dotsPositions
            if (currentDotPos !== this.#lastDotsPos) {
                this.#lastDotsPos = currentDotPos

                this._path = new Path2D()
                this._path.moveTo(...this.dots[0].pos)
                for (let i=1;i<d_ll;i++) this._path.lineTo(...this.dots[i].pos)
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
        if (this.fillColorObject?.colorRaw?.toString() != fillColor.toString() || !this._fillColor) this._fillColor = Color.adjust(fillColor)
    }
	set dynamicUpdates(_dynamicUpdates) {return this._dynamicUpdates = _dynamicUpdates}
}