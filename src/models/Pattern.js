// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Allows the creation of custom gradients
class Pattern extends _DynamicColor {
    static #ID_GIVER = 0
    static #CROPPING_CTX = new OffscreenCanvas(1,1).getContext("2d")
    static #MATRIX = new DOMMatrixReadOnly()
    static LOADED_PATTERN_SOURCES = []
    static PLACEHOLDER_COLOR = "transparent"
    static REPETITION_MODES = {REPEAT:"repeat", REPEAT_X:"repeat-x", REPEAT_Y:"repeat-y", NO_REPEAT:"no-repeat"}
    static DEFAULT_REPETITION_MODE = Pattern.REPETITION_MODES.NO_REPEAT
    static DEFAULT_FRAME_RATE = 1/30
    static SERIALIZATION_SEPARATOR = "!"
    static FORCE_UPDATE_LEVELS = {
        DISABLED:null,
        RESPECT_FRAME_RATE:true,
        OVERRIDE:2
    }
    static DEFAULT_FORCE_UPDATE_LEVEL = Pattern.FORCE_UPDATE_LEVELS.DISABLED

    #lastUpdateTime = null
    #initialized = false
    constructor(render, source, positions, sourceCroppingPositions, keepAspectRatio, forcedUpdates, rotation, errorCB, readyCB, frameRate, repeatMode) {
        super(
            positions, // [ [x1, y1], [x2, y2] ] | _Obj~
            rotation   // rotation of the pattern
        )
        this._id = Pattern.#ID_GIVER++                                         // instance id
        this._render = render                                                  // canvas Render instance
        this._source = source                                                  // the data source
        this._sourceCroppingPositions = sourceCroppingPositions??null          // source cropping positions delimiting a rectangle, [ [startX, startY], [endX, endY] ] (Defaults to no cropping)
        this._keepAspectRatio = keepAspectRatio??false                         // whether the source keeps the same aspect ratio when resizing
        this._forcedUpdates = forcedUpdates??Pattern.DEFAULT_FORCE_UPDATE_LEVEL// whether/how the pattern forces updates
        const rawFrameRate = frameRate??Pattern.DEFAULT_FRAME_RATE
        this._frameRate = (rawFrameRate%1) ? rawFrameRate : 1/Math.max(rawFrameRate, 0) // update frequency of video/canvas sources
        this._errorCB = errorCB                                                // a callback called if there is an error with the source (errorType, e?)=>
        this._readyCB = readyCB                                                // custom callback ran upon source load
        this._repeatMode = repeatMode??Pattern.DEFAULT_REPETITION_MODE         // whether the pattern repeats horizontally/vertically

        Pattern.LOADED_PATTERN_SOURCES[this._id] = this
        ImageDisplay.initializeDataSource(source, (data)=>{
            this._source = data
            this.#initialized = true
            if (CDEUtils.isFunction(this._readyCB)) this._readyCB(this)
            this.update(Pattern.FORCE_UPDATE_LEVELS.OVERRIDE)
        }, this._errorCB)
    }

    /**
     * Given an canvas object, returns automatic positions values for the minimal area containing all of the provided object
     * @param {Shape|Dot|TextDisplay} obj: Inheritor of _Obj
     * @returns the new calculated positions or the current value of this._positions if the parameter 'obj' isn't an instance of a canvas object
     */
    getAutomaticPositions(obj=this._initPositions) {
        if (obj instanceof Shape) {
            if (this.#hasShapeChanged(obj)) {
                const rangeX = CDEUtils.getMinMax(obj.dots, "x"), rangeY = CDEUtils.getMinMax(obj.dots, "y"), radius = obj.radius
                return [[rangeX[0]-radius, rangeY[0]-radius], [rangeX[1]+radius, rangeY[1]+radius]]
            } else return this._positions
        } else if (obj instanceof Dot) {
            if (this.#hasDotChanged(obj)) return [[obj.left, obj.top], [obj.right, obj.bottom]]
            return this._positions
        } else if (obj instanceof TextDisplay) {
            if (this.#hasTextDisplayChanged(obj)) {
                const [width, height] = obj.trueSize, lh = obj.lineHeigth, w2 = width/2, h2 = height/2, cx = obj.x, topY = obj.y-lh/1.8
                return [[cx-w2, topY], [cx+w2, topY+lh*obj.lineCount]]
            } return this._positions
        } else if (obj instanceof AudioDisplay) return _DynamicColor.getAutomaticPositions(obj)
        else return this._positions
    }
    
    #hasShapeChanged(shape) {
        const currentDotsPos = shape.dotsPositions+shape.radius
        if (currentDotsPos !== this._lastChangeValue) {
            this._lastChangeValue = currentDotsPos
            return true
        } else return false
    }
    
    #hasDotChanged(dot) {
        const currentDotPos = dot.stringPos+dot.radius
        if (currentDotPos !== this._lastChangeValue) {
            this._lastChangeValue = currentDotPos
            return true
        } else return false
    }

    #hasTextDisplayChanged(textDisplay) {
        const pos = textDisplay.trueSize+textDisplay.pos
        if (pos !== this._lastChangeValue) {
            this._lastChangeValue = pos
            return true
        } else return false
    }

    // tries to update the curent pattern. Succeeds if forced, or if the last update's elapsed time corresponds to the frame rate 
    update(forceLevel=this._forcedUpdates) {
        if (this.#initialized) {
            const source = this._source, ctx = this._render.ctx, isCanvas = source instanceof HTMLCanvasElement, forceLevels = Pattern.FORCE_UPDATE_LEVELS, time = (isCanvas||forceLevel==forceLevels.RESPECT_FRAME_RATE)?performance.now()/1000:source.currentTime
        
            if (time != null && forceLevel !== forceLevels.OVERRIDE) {
                if (this.#lastUpdateTime > time) this.#lastUpdateTime = time
                if (time-this.#lastUpdateTime >= this._frameRate) this.#lastUpdateTime = time
                else return;
            }
            
            this._positions = this.getAutomaticPositions()
            if (isCanvas) this._render._bactchedStandalones.push(()=>this._value = this.#getPattern(ctx, source))
            else this._value = this.#getPattern(ctx, source)
        }
    }

    // returns a new pattern according to the current configurations 
    #getPattern(ctx, source) {
        let sizeX, sizeY
        const matrix = Pattern.#MATRIX, croppingPositions = this._sourceCroppingPositions
        if (croppingPositions) {
            const croppingCtx = Pattern.#CROPPING_CTX, canvas = croppingCtx.canvas, sx = croppingPositions[0][0], sy = croppingPositions[0][1]
            sizeX = canvas.width = Math.abs(croppingPositions[1][0]-sx)
            sizeY = canvas.height = Math.abs(croppingPositions[1][1]-sy)
            croppingCtx.clearRect(0, 0, sizeX, sizeY)
            croppingCtx.drawImage(source, sx, sy, sizeX, sizeY, 0, 0, sizeX, sizeY)
            source = canvas
        } else [sizeX, sizeY] = ImageDisplay.getNaturalSize(source)

        const pattern = ctx.createPattern(source, this._repeatMode), positions = this._positions

        if (positions) {
            const pos1 = positions[0], pos2 = positions[1], width = pos2[0]-pos1[0], height = pos2[1]-pos1[1], fdx = width/sizeX, fdy = height/sizeY, rotation = this._rotation
            if (this._keepAspectRatio) {
                const isXbigger = fdx > fdy, fd = isXbigger ? fdx : fdy, cx = (sizeX*fd)/2, cy = (sizeY*fd)/2
                if (rotation) pattern.setTransform(matrix.translate((pos1[0]-(isXbigger?0:cx-(width/2)))+cx, (pos1[1]-(isXbigger?(cy-(height/2)):0))+cy).rotate(rotation).translate(-cx, -cy).scale(fd, fd))
                else pattern.setTransform(matrix.translate((pos1[0]-(isXbigger?0:cx-(width/2))), (pos1[1]-(isXbigger?(cy-(height/2)):0))).scale(fd, fd))
            } else {
                const cx = (sizeX*fdx)/2, cy = (sizeY*fdy)/2
                if (rotation) pattern.setTransform(matrix.translate(pos1[0]+cx, pos1[1]+cy).rotate(rotation).translate(-cx, -cy).scale(fdx, fdy))
                else pattern.setTransform(matrix.translate(pos1[0], pos1[1]).scale(fdx, fdy))
            }
        }

        return pattern
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
    duplicate(positions=this._positions, render=this._render, source=this._source, sourceCroppingPositions=this._sourceCroppingPositions, keepAspectRatio=this._keepAspectRatio, forcedUpdates=this._forcedUpdates, rotation=this._rotation, errorCB=this._errorCB, frameRate=this._frameRate, repeatMode=this._repeatMode) {
        if (source instanceof HTMLElement && !source.getAttribute("permaLoad") && !(source instanceof HTMLCanvasElement)) {
            source = source.cloneNode()
            source.setAttribute("fakeload", "1")
        }
        return new Pattern(render, source, CDEUtils.unlinkArr22(positions), CDEUtils.unlinkArr22(sourceCroppingPositions), keepAspectRatio, forcedUpdates, rotation, errorCB, null, frameRate, repeatMode)
    }

    // Returns a usable camera capture source
    static loadCamera(resolution, facingMode, frameRate=this._frameRate) {
        return ImageDisplay.loadCamera(resolution, facingMode, frameRate)
    }

    // Returns a usable screen capture source
    static loadCapture(resolution, cursor, frameRate=this.frameRate, mediaSource) {
        return ImageDisplay.loadCapture(resolution, cursor, frameRate, mediaSource)
    }

    get id() {return this._id}
	get render() {return this._render}
	get source() {return this._source}
	get sourceCroppingPositions() {return this._sourceCroppingPositions}
    get keepAspectRatio() {return this._keepAspectRatio}
    get forcedUpdates() {return this._forcedUpdates}
	get repeatMode() {return this._repeatMode}
    get frameRate() {return 1/(this._frameRate)}
    get value() {
        const data = this._source
        if (data instanceof HTMLVideoElement && (!data.src && !data.srcObject?.active)) return Pattern.PLACEHOLDER_COLOR
        if (this._forcedUpdates || data instanceof HTMLVideoElement || data instanceof HTMLCanvasElement) this.update() // TODO, for images/paused vids/static idk with forcedUpdates, only update when the positions have changed
        return this._value??Pattern.PLACEHOLDER_COLOR
    }
    get naturalSize() {return ImageDisplay.getNaturalSize(this._source)}
    get video() {return this._source}
    get image() {return this._source}
    get paused() {return this._source?.paused}
    get isPaused() {return this.paused}
    get playbackRate() {return this._source?.playbackRate}
    get speed() {return this.playbackRate}
    get currentTime() {return this._source?.currentTime}
    get loop() {return this._source?.loop}
    get isLooping() {return this.loop}

	set source(source) {
        ImageDisplay.initializeDataSource(source, (data)=>{
            this._source = data
            this.update(true)
        })
    }
    set sourceCroppingPositions(_sourceCroppingPositions) {
        this._sourceCroppingPositions = _sourceCroppingPositions
        this.update(true)
    }
	set sourceCroppingStartPos(startPos) {
        if (Array.isArray(this._sourceCroppingPositions)) this._sourceCroppingPositions[0] = startPos
        else this._sourceCroppingPositions = [startPos, [startPos[0]+ImageDisplay.DEFAULT_WIDTH, startPos[1]+ImageDisplay.DEFAULT_HEIGHT]]
        this.update(true)
    }
    set sourceCroppingEndPos(endPos) {
        if (Array.isArray(this._sourceCroppingPositions)) this._sourceCroppingPositions[1] = endPos
        else this._sourceCroppingPositions = [[0,0], endPos]
        this.update(true)
    }
	set keepAspectRatio(_keepAspectRatio) {
        this._keepAspectRatio = _keepAspectRatio
        this.update(true)
    }
	set forcedUpdates(_forcedUpdates) {
        this._forcedUpdates = _forcedUpdates
        this.update(true)
    }
	set repeatMode(_repeatMode) {
        this._repeatMode = _repeatMode
        this.update(true)
    }
    set frameRate(frameRate) {
        this._frameRate = 1/Math.max(frameRate, 0)
    }
    set rotation(deg) {
        this._rotation = CDEUtils.round(deg, 2)%360
        this.update(true)
    }
}