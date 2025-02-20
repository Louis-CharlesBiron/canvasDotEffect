// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Allows the creation of custom gradients
class Pattern {
    static #ID_GIVER = 0
    static #CROPPING_CTX = new OffscreenCanvas(1,1).getContext("2d")
    static #MATRIX = new DOMMatrixReadOnly()
    static PLACEHOLDER = "PLACEHOLDER"
    static PLACEHOLDER_COLOR = "transparent"
    static REPETITION_MODES = {REPEAT:"repeat", REPEAT_X:"repeat-x", REPEAT_Y:"repeat-y", NO_REPEAT:"no-repeat"}
    static DEFAULT_REPETITION_MODE = Pattern.REPETITION_MODES.NO_REPEAT// todo check
    static DEFAULT_FRAME_RATE = 1/30
    static LOADED_PATTERN_SOURCES = []
    static SERIALIZATION_SEPARATOR = "!"

    /* 
        - make auto positions work
        - getter / setter, with auto updatePattern
        - duplicate

    */

    // doc todo
    #lastUpdateTime = null
    constructor(render, source, positions, sourceCroppingPositions, keepAspectRatio, repeatMode) {
        this._id = Pattern.#ID_GIVER++
        this._render = render                      // canvas Render instance
        this._source = null
        this._initPositions = positions      // [ [x1, y1], [x2, y2] ] | Obj
        this._positions = positions
        this._sourceCroppingPositions = sourceCroppingPositions??null // source cropping positions delimiting a rectangle, [ [startX, startY], [endX, endY] ] (Defaults to no cropping)
        this._keepAspectRatio = keepAspectRatio??false
        this._repeatMode = repeatMode??Pattern.DEFAULT_REPETITION_MODE
        this._frameRate = Pattern.DEFAULT_FRAME_RATE
        
        this._pattern = null

        Pattern.LOADED_PATTERN_SOURCES[this._id] = this

        ImageDisplay.initializeDataSource(source, (data)=>{
            this._source = data
            this.updatePattern(true)
        })
    }

    // doc todo
    updatePattern(force) {
        const ctx = this._render.ctx, source = this._source, isCanvas = source instanceof HTMLCanvasElement, time = source.currentTime??(isCanvas?performance.now()/1000:null)
        
        if (time != null && !force) {
            if (this.#lastUpdateTime > time) this.#lastUpdateTime = time
            if (time-this.#lastUpdateTime >= this._frameRate) this.#lastUpdateTime = time
            else return;
        }
        
        if (isCanvas) this._render._bactchedStandalones.push(()=>this._pattern = this.#getpattern(ctx, source))
        else this._pattern = this.#getpattern(ctx, source)
    }

    // doc todo
    #getpattern(ctx, source) {
        if (source) {
            let sizeX, sizeY
            const matrix = Pattern.#MATRIX, croppingPositions = this._sourceCroppingPositions
            if (croppingPositions) {
                const croppingCtx = Pattern.#CROPPING_CTX, canvas = croppingCtx.canvas
                sizeX = canvas.width = Math.abs(croppingPositions[1][0]-croppingPositions[0][0])
                sizeY = canvas.height = Math.abs(croppingPositions[1][1]-croppingPositions[0][1])
                croppingCtx.clearRect(0, 0, sizeX, sizeY)
                croppingCtx.drawImage(source, croppingPositions[0][0], croppingPositions[0][1], sizeX, sizeY, 0, 0, sizeX, sizeY)
                source = canvas
            } else [sizeX, sizeY] = ImageDisplay.getNaturalSize(source)
            
            const pattern = ctx.createPattern(source, this._repeatMode), positions = this._positions

            if (positions) {
                const pos1 = positions[0], pos2 = positions[1], width = pos2[0]-pos1[0], height = pos2[1]-pos1[1], fdx = width/sizeX, fdy = height/sizeY
                if (this._keepAspectRatio) {
                    const isXbigger = fdx > fdy, d = isXbigger ? fdx : fdy
                    pattern.setTransform(matrix.translate(pos1[0]-(isXbigger?0:((sizeX*d)/2)-(width/2)), pos1[1]-(isXbigger?(((sizeY*d)/2)-(height/2)):0)).scale(d, d))
                } else pattern.setTransform(matrix.translate(pos1[0], pos1[1]).scale(fdx, fdy))
            }

            return pattern
        }
    }

    toString() {
        return this._id+Pattern.SERIALIZATION_SEPARATOR
    }

    // Plays the source (use only if the source is a video)
    playVideo() {
        this._source.play()
    }

    // Pauses the source (use only if the source is a video)
    pauseVideo() {
        this._source.pause()
    }

    // returns a separate copy of this Pattern instance
    duplicate(render=this._render, source=this._source, positions=this._positions, sourceCroppingPositions=this._sourceCroppingPositions, keepAspectRatio=this._keepAspectRatio, repeatMode=this._repeatMode) {
        // todo, also uniquify positions
        //return this.initialized ? new ImageDisplay(source, pos, size, setupCB, anchorPos, alwaysActive) : null
    }

    // todo order that in a good way
    get id() {return this._id}
	get render() {return this._render}
	get source() {return this._source}
	get initPositions() {return this._initPositions}
	get positions() {return this._positions}
	get repeatMode() {return this._repeatMode}
    get naturalSize() {return ImageDisplay.getNaturalSize(this._source)}
    get frameRate() {return 1/(this._frameRate)}
	get sourceCroppingPositions() {return this._sourceCroppingPositions}
    get pattern() {
        const data = this._source
        if (data instanceof HTMLVideoElement && (!data.src && !data.srcObject?.active)) return Pattern.PLACEHOLDER_COLOR
        if (data instanceof HTMLVideoElement || data instanceof HTMLCanvasElement) this.updatePattern()
        return this._pattern??Pattern.PLACEHOLDER_COLOR
    }
    get video() {return this._source}
    get image() {return this._source}
    get paused() {return this._source?.paused}
    get isPaused() {return this.paused}
    get playbackRate() {return this._source?.playbackRate}
    get speed() {return this.playbackRate}
    get currentTime() {return this._source?.currentTime}
    get loop() {return this._source?.loop}
    get isLooping() {return this.loop}


    set id(_id) {this._id = _id}
	set source(source) {
        ImageDisplay.initializeDataSource(source, (data)=>{
            this._source = data
            this.updatePattern(true)
        })
    }
	set positions(_positions) {
        this._positions = _positions
        this.updatePattern(true)
    }
	set repeatMode(_repeatMode) {
        this._repeatMode = _repeatMode
        this.updatePattern(true)
    }
    set frameRate(frameRate) {
        this._frameRate = 1/Math.max(frameRate, 0)
    }
    set sourceCroppingPositions(_sourceCroppingPositions) {
        this._sourceCroppingPositions = _sourceCroppingPositions
        this.updatePattern(true)
    }
	set sourceCroppingStartPos(startPos) {
        if (Array.isArray(this._sourceCroppingPositions)) this._sourceCroppingPositions[0] = startPos
        else this._sourceCroppingPositions = [startPos, [startPos[0]+ImageDisplay.DEFAULT_WIDTH, startPos[1]+ImageDisplay.DEFAULT_HEIGHT]]
        this.updatePattern(true)
    }
    set sourceCroppingEndPos(endPos) {
        if (Array.isArray(this._sourceCroppingPositions)) this._sourceCroppingPositions[1] = endPos
        else this._sourceCroppingPositions = [[0,0], endPos]
        this.updatePattern(true)
    }
}