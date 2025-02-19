// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Allows the creation of custom gradients
class Pattern {
    static #ID_GIVER = 0
    static PLACEHOLDER = "PLACEHOLDER"
    static PLACEHOLDER_COLOR = "transparent"
    static REPETITION_MODES = {REPEAT:"repeat", REPEAT_X:"repeat-x", REPEAT_Y:"repeat-y", NONE:"no-repeat"}
    static DEFAULT_REPETITION_MODE = Pattern.REPETITION_MODES.REPEAT//
    static DEFAULT_FRAME_RATE = 1/30
    static LOADED_PATTERN_SOURCES = []
    static SERIALIZATION_SEPARATOR = "!"

    /* 
        delete this._source (bad memory usage)?? prob no?

        - make positions work
        - make cropping work
        - getter / setter, with auto updatePattern
        - duplicate

        add an auto update for canvas source
    */

    // doc todo
    #lastUpdateTime = null
    constructor(render, source, positions, repeatMode, sourceCroppingPositions) {
        this._id = Pattern.#ID_GIVER++
        this._render = render                      // canvas context
        this._data = source
        this._initPositions = positions      // [ [x1, y1], [x2, y2] ] | Obj
        this._positions = positions
        this._repeatMode = repeatMode??Pattern.DEFAULT_REPETITION_MODE
        this._sourceCroppingPositions = sourceCroppingPositions // data source cropping positions delimiting a rectangle, [ [startX, startY], [endX, endY] ] (Defaults to no cropping)
        this._frameRate = Pattern.DEFAULT_FRAME_RATE
        
        this._pattern = null

        Pattern.LOADED_PATTERN_SOURCES[this._id] = this

        ImageDisplay.initializeDataSource(source, (data, size)=>{
            this._data = data
            this.updatePattern()
        })
    }

    // doc todo
    updatePattern(force) {
        const ctx = this._render.ctx, data = this._data, isCanvas = data instanceof HTMLCanvasElement, time = data.currentTime??isCanvas?performance.now()/1000:null
        if (time && !force) {
            if (this.#lastUpdateTime > time) this.#lastUpdateTime = time
            if (time-this.#lastUpdateTime >= this._frameRate) this.#lastUpdateTime = time
            else return;
        }
        
        if (isCanvas) this._render._bactchedStandalones.push(()=>this._pattern = data&&ctx.createPattern(data, this._repeatMode))
        else this._pattern = data&&ctx.createPattern(data, this._repeatMode)
    }

    toString() {
        return this._id+Pattern.SERIALIZATION_SEPARATOR
    }

    get pattern() {
        const data = this._data
        if (data instanceof HTMLVideoElement || data instanceof HTMLCanvasElement) this.updatePattern()
        return this._pattern??Pattern.PLACEHOLDER_COLOR
    }
    get frameRate() {return 1/(this._frameRate)}


    set frameRate(frameRate) {
        this._frameRate = 1/Math.max(frameRate, 0)
    }
}