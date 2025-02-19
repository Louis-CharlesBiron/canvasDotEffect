// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Allows the creation of custom gradients
class Pattern {
    static #ID_GIVER = 0
    static #CROPPING_CTX = new OffscreenCanvas(1,1).getContext("2d")
    static PLACEHOLDER = "PLACEHOLDER"
    static PLACEHOLDER_COLOR = "transparent"
    static REPETITION_MODES = {REPEAT:"repeat", REPEAT_X:"repeat-x", REPEAT_Y:"repeat-y", NO_REPEAT:"no-repeat"}
    static DEFAULT_REPETITION_MODE = Pattern.REPETITION_MODES.NO_REPEAT//
    static DEFAULT_FRAME_RATE = 1/30
    static LOADED_PATTERN_SOURCES = []
    static SERIALIZATION_SEPARATOR = "!"

    /* 
        - make positions work
        - make cropping work
        - getter / setter, with auto updatePattern
        - duplicate

    */

    // doc todo
    #lastUpdateTime = null
    constructor(render, source, positions, repeatMode, sourceCroppingPositions) {
        this._id = Pattern.#ID_GIVER++
        this._render = render                      // canvas Render instance
        this._source = null
        this._initPositions = positions      // [ [x1, y1], [x2, y2] ] | Obj
        this._positions = positions
        this._repeatMode = repeatMode??Pattern.DEFAULT_REPETITION_MODE
        this._sourceCroppingPositions = sourceCroppingPositions??null // source cropping positions delimiting a rectangle, [ [startX, startY], [endX, endY] ] (Defaults to no cropping)
        this._frameRate = Pattern.DEFAULT_FRAME_RATE
        
        this._pattern = null

        Pattern.LOADED_PATTERN_SOURCES[this._id] = this

        ImageDisplay.initializeDataSource(source, (data, size)=>{
            this._source = data
            this.updatePattern()
        })
    }

    // doc todo
    updatePattern(force) {
        const ctx = this._render.ctx, source = this._source, isCanvas = source instanceof HTMLCanvasElement, time = source.currentTime??isCanvas?performance.now()/1000:null
        if (time && !force) {
            if (this.#lastUpdateTime > time) this.#lastUpdateTime = time
            if (time-this.#lastUpdateTime >= this._frameRate) this.#lastUpdateTime = time
            else return;
        }
        
        if (isCanvas) this._render._bactchedStandalones.push(()=>this._pattern = source&&ctx.createPattern(source, this._repeatMode))
        else this._pattern = source&&ctx.createPattern(source, this._repeatMode)
    }

    // doc todo
    #getpattern(ctx, source) {
        if (source) {
            const croppingPositions = this._sourceCroppingPositions
            if (croppingPositions) {
                const croppingCtx = Pattern.#CROPPING_CTX, canvas = croppingCtx.canvas,
                      width = canvas.width = Math.abs(croppingPositions[1][0]-croppingPositions[0][0]),
                      height = canvas.height = Math.abs(croppingPositions[1][1]-croppingPositions[0][1])
                croppingCtx.clearRect(0, 0, width, height)
                croppingCtx.drawImage(source, croppingPositions[0][0], croppingPositions[0][1], width, height, 0, 0, width, height)
                source = canvas
            }
            const pattern = ctx.createPattern(source, this._repeatMode)
            // todo matrix positionning
            return pattern
        }
    }

    toString() {
        return this._id+Pattern.SERIALIZATION_SEPARATOR
    }

    get pattern() {
        const data = this._source
        if (data instanceof HTMLVideoElement && (!data.src && !data.srcObject?.active)) return Pattern.PLACEHOLDER_COLOR
        if (data instanceof HTMLVideoElement || data instanceof HTMLCanvasElement) this.updatePattern()
        return this._pattern??Pattern.PLACEHOLDER_COLOR
    }
    get frameRate() {return 1/(this._frameRate)}
	get sourceCroppingPositions() {return this._sourceCroppingPositions}


    set frameRate(frameRate) {
        this._frameRate = 1/Math.max(frameRate, 0)
    }
    set sourceCroppingPositions(_sourceCroppingPositions) {this._sourceCroppingPositions = _sourceCroppingPositions}
	set sourceCroppingStartPos(startPos) {
        if (Array.isArray(this._sourceCroppingPositions)) this._sourceCroppingPositions[0] = startPos
        else this._sourceCroppingPositions = [startPos, [startPos[0]+ImageDisplay.DEFAULT_WIDTH, startPos[1]+ImageDisplay.DEFAULT_HEIGHT]]
    }
    set sourceCroppingEndPos(endPos) {
        if (Array.isArray(this._sourceCroppingPositions)) this._sourceCroppingPositions[1] = endPos
        else this._sourceCroppingPositions = [[0,0], endPos]
    }
}