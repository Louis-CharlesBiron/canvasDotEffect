// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Regular shape with a filled area defined by its dots
class FilledShape extends Shape {
    #lastDotsPos = null
    constructor(rgbaFill, dynamicUpdates, pos, dots, radius, rgba, limit, drawEffectCB, ratioPosCB, setupCB, fragile) {
        super(pos, dots, radius, rgba, limit, drawEffectCB, ratioPosCB, setupCB, fragile)
        this._initRgbaFill = rgbaFill         // [r,g,b,a] rgba array or a Gradient instance
        this._rgbaFill = this._initRgbaFill   // the current color or gradient of the filled shape
        this._path = null                     // path perimeter delimiting the surface to fill
        this._dynamicUpdates = dynamicUpdates // whether the shape's filling checks for updates every frame
    }

    // initializes the filled shape and creates its path
    initialize() {
        super.initialize()
        if (typeof this._initRgbaFill=="function") this._rgbaFill = this._initRgbaFill(this.ctx, this)
        this.updatePath()
    }

    // runs every frame, draws the shape if it is at least containing 3 dots
    draw(ctx, time) {
        super.draw(ctx, time)
        
        if (this.dots.length > 2) {
            if (this._dynamicUpdates) this.updatePath()

            ctx.fillStyle = this._rgbaFill.gradient||formatColor(this._rgbaFill)
            ctx.fill(this._path)
        }
    }

    // updates the path perimeter if the dots pos have changed
    updatePath() {
        let d_ll = this.dots.length
        if (d_ll) {
            let currentDotPos = this.dotsPositions
            if (currentDotPos !== this.#lastDotsPos) {
                this.#lastDotsPos = currentDotPos
                console.log("TODO tofix, filledShape.moevBy([100]), then call this")

                this._path = new Path2D()
                this._path.moveTo(...this.dots[0].pos)
                for (let i=1;i<d_ll;i++) this._path.lineTo(...this.dots[i].pos)
                this._path.closePath()
            } 
        }
    }

    get rgbaFill() {return this._rgbaFill}
	get path() {return this._path}
	get dynamicUpdates() {return this._dynamicUpdates}

	set rgbaFill(_rgbaFill) {return this._rgbaFill = _rgbaFill}
	set dynamicUpdates(_dynamicUpdates) {return this._dynamicUpdates = _dynamicUpdates}
}