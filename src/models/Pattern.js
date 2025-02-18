// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Allows the creation of custom gradients
class Pattern {
    static #ID_GIVER = 0
    static PLACEHOLDER = "PLACERHOLDER"
    static PLACEHOLDER_COLOR = "transparent"
    static REPETITION_MODES = {REPEAT:"repeat", REPEAT_X:"repeat-x", REPEAT_Y:"repeat-y", NONE:"no-repeat"}
    static DEFAULT_REPETITION_MODE = Pattern.REPETITION_MODES.REPEAT//
    static DEFAULT_FRAME_RATE = 30
    static LOADED_PATTERN_SOURCES = []
    static SERIALIZATION_SEPARATOR = "!"

    /* 
        delete this._source (bad memory usage)?? prob no?

        add an auto update to canvas source
    */

    // doc todo
    #lastUpdateTime = null
    constructor(ctx, source, positions, repeatMode, sourceCroppingPositions) {
        this._id = Pattern.#ID_GIVER++
        this._ctx = ctx                      // canvas context
        this._source = source??""
        this._initPositions = positions      // [ [x1, y1], [x2, y2] ] | Obj
        this._positions = positions
        this._repeatMode = repeatMode??Pattern.DEFAULT_REPETITION_MODE
        this._sourceCroppingPositions = sourceCroppingPositions // data source cropping positions delimiting a rectangle, [ [startX, startY], [endX, endY] ] (Defaults to no cropping)
        this._frameRate = Pattern.DEFAULT_FRAME_RATE
        
        this._data = null
        this._pattern = null

        Pattern.LOADED_PATTERN_SOURCES[this._id] = this

        ImageDisplay.initializeDataSource(this._source, (data, size)=>{
            this._data = data
            this.updatePattern()
        })
    }

    updatePattern() {
        const time = this._data.currentTime
        if (time) {
            if (this.#lastUpdateTime > time) this.#lastUpdateTime = time
            if (time-this.#lastUpdateTime >= 1/this._frameRate) this.#lastUpdateTime = time
            else return this._pattern??Pattern.PLACEHOLDER_COLOR
        }
        this._pattern = this._ctx.createPattern(this._data, this._repeatMode)
        return this._pattern
    }

    toString() {
        return this._id+Pattern.SERIALIZATION_SEPARATOR
    }

    get pattern() {
        const data = this._data
        if (data instanceof HTMLVideoElement) return this.updatePattern()
        return this._pattern??Pattern.PLACEHOLDER_COLOR
    }
}