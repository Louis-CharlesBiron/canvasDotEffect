// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

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

    /**
     * Allows the creation of custom gradients
     * @param {Render} render: a render instance
     * @param {CanvasImageSource} source: a media source, such as an image or a video
     * @param {[[x1,y1], [x2,y2]]} positions: the rectangular area defined by two corners containing the pattern
     * @param {[[startX, startY], [endX, endY]]?} sourceCroppingPositions: source cropping positions delimiting a rectangle, cropping everything outside of it. (Defaults to no cropping)
     * @param {Boolean?} keepAspectRatio: Whether the media should resize by keeping the original aspect ratio
     * @param {Pattern.FORCE_UPDATE_LEVELS?} forcedUpdates: whether/how the pattern forces updates
     * @param {Number?} rotation: the rotation in degrees 
     * @param {Function?} errorCB: function called upon any error loading the media
     * @param {Function?} readyCB: function called when the media is loaded
     * @param {Number?} frameRate: how many times per seconds should the media update (mostly used for videos)
     * @param {Pattern.REPETITION_MODES} repeatMode: the repetition mode used for displaying the media at a larger size than what it's covering
     */
    constructor(render, source, positions, sourceCroppingPositions, keepAspectRatio, forcedUpdates, rotation, errorCB, readyCB, frameRate, repeatMode) {
        super(
            positions, // [ [x1, y1], [x2, y2] ] | instance of _BaseObj
            rotation   // rotation of the pattern
        )
        this._id = Pattern.#ID_GIVER++                                         // instance id
        this._render = render                                                  // canvas Render instance
        this._source = source                                                  // the data source
        this._sourceCroppingPositions = sourceCroppingPositions                // source cropping positions delimiting a rectangle, [ [startX, startY], [endX, endY] ] (Defaults to no cropping)
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
            this.sourceCroppingPositions = this._sourceCroppingPositions||null
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
        if (obj instanceof Shape) return this.#hasShapeChanged(obj) ? obj.getBounds(0, 0, 0) : this._positions
        else if (obj instanceof Dot) return this.#hasDotChanged(obj) ? obj.getBounds(0, 0, 0) : this._positions
        else if (obj instanceof TextDisplay) return this.#hasTextDisplayChanged(obj) ? obj.getBounds(0, 0, 0) : this._positions
        else if (obj instanceof AudioDisplay) return obj.getBounds(0, 0, 0)
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

    /**
     * Tries to update the curent pattern. Succeeds if forced, or if the last update's elapsed time corresponds to the frame rate
     * @param {Pattern.FORCE_UPDATE_LEVELS} forceLevel: the force level used
     */
    update(forceLevel=this._forcedUpdates) {
        if (this.#initialized) {
            const source = this._source, ctx = this._render.ctx, isCanvas = source instanceof HTMLCanvasElement, forceLevels = Pattern.FORCE_UPDATE_LEVELS, time = (isCanvas||forceLevel==forceLevels.RESPECT_FRAME_RATE)?performance.now()/1000:source.currentTime

            if (time != null && forceLevel != forceLevels.OVERRIDE) {
                if (this.#lastUpdateTime > time) this.#lastUpdateTime = time
                if (time-this.#lastUpdateTime >= this._frameRate) this.#lastUpdateTime = time
                else return;
            }

            const positions = this.getAutomaticPositions()
            if (forceLevel != forceLevels.OVERRIDE && (!source.currentTime || source.paused) && Array.isArray(this._positions) && CDEUtils.positionsEquals(positions, this._positions) && this._value) return;
            this._positions = positions
            
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

    /**
     * Plays the source, if it's a video
     */
    playVideo() {
        ImageDisplay.playMedia(this._source)
    }

    /**
     * Pauses the source, if it's a video
     */
    pauseVideo() {
        try {this._source.pause()}catch(e){}
    }

    /**
     * Returns a separate copy of this Pattern instance
     */
    duplicate(positions=this._positions, render=this._render, source=this._source, sourceCroppingPositions=this._sourceCroppingPositions, keepAspectRatio=this._keepAspectRatio, forcedUpdates=this._forcedUpdates, rotation=this._rotation, errorCB=this._errorCB, frameRate=this._frameRate, repeatMode=this._repeatMode) {
        if (source instanceof HTMLElement && !source.getAttribute("permaLoad") && !(source instanceof HTMLCanvasElement)) {
            source = source.cloneNode()
            source.setAttribute("fakeload", "1")
        }
        return new Pattern(render, source, CDEUtils.unlinkPositions(positions), CDEUtils.unlinkPositions(sourceCroppingPositions), keepAspectRatio, forcedUpdates, rotation, errorCB, null, frameRate, repeatMode)
    }

    /**
     * Create a usable image source
     * @param {String} path: the source path
     * @param {Function?} errorCB: function called upon any error loading the media
     * @param {Boolean?} forceLoad: whether to force the reloading of the image if the image is being reused
     * @returns an HTML image element
     */
    static loadImage(path, errorCB=null, forceLoad=false) {
        return ImageDisplay.loadImage(path, errorCB, forceLoad)
    }

    /**
     * Returns a usable video source
     * @param {String | File} src: the source of the video, either a path or a File
     * @param {Boolean?} looping: whether the video loops
     * @param {Boolean?} autoPlay: whether the video autoplays
     * @returns a HTML video element
     */
    static loadVideo(src, looping=true, autoPlay=true) {
        return ImageDisplay.loadVideo(src, looping, autoPlay)
    }

    /**
     * Returns a usable camera capture source
     * @param {[resolutionX, resolutionY]?} resolution: the camera resolution
     * @param {ImageDisplay.CAMERA_FACING_MODES?} facingMode: which camera to use
     * @param {Number?} frameRate: how many times the camera feed updates per seconds
     * @returns an object containing camera settings, usable as a source
     */
    static loadCamera(resolution=null, facingMode=null, frameRate=this._frameRate) {
        return ImageDisplay.loadCamera(resolution, facingMode, frameRate)
    }

    /**
     * Returns a usable screen capture source
     * @param {[resolutionX, resolutionY]?} resolution: the screen capture resolution
     * @param {ImageDisplay.CAPTURE_CURSOR?} cursor: how the cursor is captured
     * @param {Number?} frameRate: how many times the screen capture feed updates per seconds
     * @param {ImageDisplay.CAPTURE_MEDIA_SOURCES?} mediaSource: the default screen source to capture
     * @returns an object containing screen capture settings, usable as a source
     */
    static loadCapture(resolution=null, cursor=null, frameRate=this.frameRate, mediaSource=null) {
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
        if (this._forcedUpdates || data instanceof HTMLVideoElement || data instanceof HTMLCanvasElement) this.update()
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

    set paused(paused) {
        try {
            if (paused) this._source.pause()
            else ImageDisplay.playMedia(this._source)
        }catch(e){}
    }
    set isPaused(isPaused) {this.paused = isPaused}
    set playbackRate(playbackRate) {this._source.playbackRate = playbackRate}
    set speed(speed) {this.playbackRate = speed}
    set currentTime(currentTime) {this._source.currentTime = currentTime}
    set loop(loop) {this._source.loop = loop}
    set isLooping(isLooping) {this.loop = isLooping}
	set source(source) {
        ImageDisplay.initializeDataSource(source, (data)=>{
            this._source = data
            this.update(2)
        })
    }
    set sourceCroppingPositions(sourceCroppingPositions) {
        if (sourceCroppingPositions) {
            const pos1 = sourceCroppingPositions[0], pos2 = sourceCroppingPositions[1], naturalSize = this.naturalSize

            this._sourceCroppingPositions = [[
                typeof pos1[0]=="string" ? (+pos1[0].replace("%","").trim()/100)*naturalSize[0] : pos1[0]==null ? 0 : pos1[0],
                typeof pos1[1]=="string" ? (+pos1[1].replace("%","").trim()/100)*naturalSize[1] : pos1[1]==null ? 0 : pos1[1]
            ], [
                typeof pos2[0]=="string" ? (+pos2[0].replace("%","").trim()/100)*naturalSize[0] : pos2[0]==null ? naturalSize[0] : pos2[0],
                typeof pos2[1]=="string" ? (+pos2[1].replace("%","").trim()/100)*naturalSize[1] : pos2[1]==null ? naturalSize[1] : pos2[1]
            ]]
            this.update(2)
        } else this._sourceCroppingPositions = null
    }
	set keepAspectRatio(_keepAspectRatio) {
        this._keepAspectRatio = _keepAspectRatio
        this.update(2)
    }
	set forcedUpdates(_forcedUpdates) {
        this._forcedUpdates = _forcedUpdates
        this.update(2)
    }
	set repeatMode(_repeatMode) {
        this._repeatMode = _repeatMode
        this.update(2)
    }
    set frameRate(frameRate) {
        this._frameRate = 1/Math.max(frameRate, 0)
    }
    set rotation(deg) {
        this._rotation = CDEUtils.round(deg, 2)%360
        this.update(2)
    }
}