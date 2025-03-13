// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Displays an image or a video as an object
class ImageDisplay extends _BaseObj {
    static SUPPORTED_IMAGE_FORMATS = ["jpg","jpeg","png","gif","svg","webp","bmp","tiff","ico","heif","heic"]
    static SUPPORTED_VIDEO_FORMATS = ["mp4","webm","ogv","mov","avi","mkv","flv","wmv","3gp","m4v"]
    static DEFAULT_WIDTH = 128
    static DEFAULT_HEIGHT = 128
    static SOURCE_TYPES = {FILE_PATH:"string", DYNAMIC:"[object Object]", CAMERA:"CAMERA", CAPTURE:"CAPTURE", IMAGE:HTMLImageElement, SVG:SVGImageElement, BITMAP_PROMISE:Promise, BITMAP:ImageBitmap, VIDEO:HTMLVideoElement, VIDEO_FRAME:VideoFrame, CANVAS:HTMLCanvasElement, OFFSCREEN_CANVAS:OffscreenCanvas}
    static DYNAMIC_SOURCE_TYPES = {VIDEO:HTMLVideoElement, CANVAS:HTMLCanvasElement}
    static RESOLUTIONS = {SD:[640, 480], HD:[1280, 720], FULL_HD:[1920, 1080], "4K":[3840,2160], FOURK:[3840,2160], MAX:[3840,2160]}
    static CAMERA_FACING_MODES = {USER:"user", ENVIRONMENT:"environment"}
    static DEFAULT_FACING_MODE = ImageDisplay.CAMERA_FACING_MODES.USER
    static DEFAULT_CAMERA_RESOLUTION = ImageDisplay.RESOLUTIONS.HD
    static DEFAULT_CAMERA_FRAME_RATE = 30
    static DEFAULT_CAMERA_SETTINGS = ImageDisplay.loadCamera()
    static DEFAULT_CAMERAS = {CAMERA_SD:ImageDisplay.loadCamera(ImageDisplay.RESOLUTIONS.SD), CAMERA_HD:ImageDisplay.loadCamera(ImageDisplay.RESOLUTIONS.HD), CAMERA_FULL_HD:ImageDisplay.loadCamera(ImageDisplay.RESOLUTIONS.FULL_HD), CAMERA_4K:ImageDisplay.loadCamera(ImageDisplay.RESOLUTIONS.FOURK), CAMERA:ImageDisplay.DEFAULT_CAMERA_SETTINGS,}
    static CAPTURE_MEDIA_SOURCES = {SCREEN:"screen", WINDOW:"window", TAB:"tab"}
    static CAPTURE_CURSOR = {ALWAYS:"always", MOTION:"motion", NONE:"none"}
    static DEFAULT_CAPTURE_RESOLUTION = ImageDisplay.RESOLUTIONS.HD
    static DEFAULT_CAPTURE_MEDIA_SOURCE = "screen"
    static DEFAULT_CAPTURE_FRAME_RATE = 30
    static DEFAULT_CAPTURE_CURSOR = "always"
    static DEFAULT_CAPTURE_SETTINGS = ImageDisplay.loadCapture()
    static DEFAULT_CAPTURES = {CAPTURE_SD:ImageDisplay.loadCapture(ImageDisplay.RESOLUTIONS.SD), CAPTURE_HD:ImageDisplay.loadCamera(ImageDisplay.RESOLUTIONS.HD), CAPTURE_FULL_HD:ImageDisplay.loadCamera(ImageDisplay.RESOLUTIONS.FULL_HD), CAPTURE_4k:ImageDisplay.loadCamera(ImageDisplay.RESOLUTIONS.FOURK), CAPTURE:ImageDisplay.DEFAULT_CAPTURE_SETTINGS}

    constructor(source, pos, size, setupCB, loopCB, anchorPos, alwaysActive) {
        super(pos, null, setupCB, loopCB, anchorPos, alwaysActive)
        this._source = source                // the data source
        this._size = size                    // the display size of the image (resizes)
        this._sourceCroppingPositions = null // data source cropping positions delimiting a rectangle, [ [startX, startY], [endX, endY] ] (Defaults to no cropping)
    }

    // TODO, check if camera autoplays (like when put in index.js)
    // TODO proper video disposal (delete this._source when the imageDisplay is deleted)
    // TODO - errorCB
    // see MediaStream.clone() for duplicate

    initialize() {
        ImageDisplay.initializeDataSource(this._source, (data, size)=>{
            this._source = data
            if (!this._size) this._size = size
            if (!CDEUtils.isDefined(this._size[0])) this._size = [size[0], this._size[1]]
            if (!CDEUtils.isDefined(this._size[1])) this._size = [this._size[0], size[1]]
            this._initialized = true
            if (CDEUtils.isFunction(this._setupCB)) this._setupResults = this._setupCB(this, this._parent, this._source)

        })

        this._pos = this.getInitPos()||_BaseObj.DEFAULT_POS
        this.setAnchoredPos()
    }

    draw(render, time, deltaTime) {
        if (this.initialized) {
            if (this._source instanceof HTMLVideoElement && (!this._source.src && !this._source.srcObject?.active)) return;

            const ctx = render.ctx, x = this.centerX, y = this.centerY, hasScaling = this._scale[0]!==1||this._scale[1]!==1, hasTransforms = this._rotation||hasScaling

            if (hasTransforms) {
                ctx.translate(x, y)
                if (this._rotation) ctx.rotate(CDEUtils.toRad(this._rotation))
                if (hasScaling) ctx.scale(this._scale[0], this._scale[1])
                ctx.translate(-x, -y)
            }

            if (this._source instanceof HTMLCanvasElement) render.drawLateImage(this._source, this._pos, this._size, this._sourceCroppingPositions, this.visualEffects)
            else render.drawImage(this._source, this._pos, this._size, this._sourceCroppingPositions, this.visualEffects)

            if (hasTransforms) ctx.setTransform(1,0,0,1,0,0)
        }
        super.draw(time, deltaTime)
    }

    static initializeDataSource(dataSrc, loadCallback) {
        const types = ImageDisplay.SOURCE_TYPES
        if (typeof dataSrc==types.FILE_PATH) {
            const extension = dataSrc.split(".")[dataSrc.split(".").length-1]
            if (ImageDisplay.SUPPORTED_IMAGE_FORMATS.includes(extension)) ImageDisplay.loadImage(dataSrc).onload=e=>ImageDisplay.#initData(e.target, loadCallback)
            else if (ImageDisplay.SUPPORTED_VIDEO_FORMATS.includes(extension)) ImageDisplay.#initVideoDataSource(ImageDisplay.loadVideo(dataSrc), loadCallback)
        } else if (dataSrc instanceof types.IMAGE || dataSrc instanceof types.SVG) {
            const fakeLoaded = dataSrc.getAttribute("fakeload")
            if (dataSrc.complete && dataSrc.src && !fakeLoaded) ImageDisplay.#initData(dataSrc, loadCallback)
            else dataSrc.onload=()=>{
                if (fakeLoaded) dataSrc.removeAttribute("fakeload")
                ImageDisplay.#initData(dataSrc, loadCallback)
            }
        } else if (dataSrc.toString()==types.DYNAMIC) {
            if (dataSrc.type==types.CAMERA) ImageDisplay.#initCameraDataSource(dataSrc.settings, loadCallback)
            else if (dataSrc.type==types.CAPTURE) ImageDisplay.#initCaptureDataSource(dataSrc.settings, loadCallback)
        } else if (dataSrc instanceof types.VIDEO) ImageDisplay.#initVideoDataSource(dataSrc, loadCallback)
        else if (dataSrc instanceof types.CANVAS || dataSrc instanceof types.BITMAP || dataSrc instanceof types.OFFSCREEN_CANVAS) ImageDisplay.#initData(dataSrc, loadCallback)
        else if (dataSrc instanceof types.BITMAP_PROMISE) dataSrc.then(bitmap=>ImageDisplay.#initData(bitmap, loadCallback))
        else if (dataSrc instanceof types.VIDEO_FRAME) {
            ImageDisplay.#initData(dataSrc, loadCallback, dataSrc.displayHeight, dataSrc.displayWidth)
            dataSrc.close()
        }
    }

    // initializes a data source
    static #initData(dataSource, loadCallback, width=dataSource.width||ImageDisplay.DEFAULT_WIDTH, height=dataSource.height||ImageDisplay.DEFAULT_HEIGHT) {
        if (CDEUtils.isFunction(loadCallback)) loadCallback(dataSource, [width, height])
    }

    // Initializes a video data source
    static #initVideoDataSource(dataSource, loadCallback) {
        const fn = ()=>this.#initData(dataSource, loadCallback, dataSource.videoWidth, dataSource.videoHeight)
        if (dataSource.readyState) fn()
        else dataSource.onloadeddata=fn
    }

    // Initializes a camera capture data source
    static #initCameraDataSource(settings=true, loadCallback) {
        navigator.mediaDevices.getUserMedia({video:settings}).then(src=>{
            const video = document.createElement("video")
            video.srcObject = src
            video.autoplay = true
            video.setAttribute("permaLoad", "1")
            video.oncanplay=()=>this.#initData(video, loadCallback, video.videoWidth, video.videoHeight)
        })
    }

    // Initializes a screen capture data source
    static #initCaptureDataSource(settings=true, loadCallback) {
        navigator.mediaDevices.getDisplayMedia({video:settings}).then(src=>{
            const video = document.createElement("video")
            video.srcObject = src
            video.autoplay = true
            video.setAttribute("permaLoad", "1")
            video.oncanplay=()=>this.#initData(video, loadCallback, video.videoWidth, video.videoHeight)
        })
    }

    // Returns a usable image source
    static loadImage(path) {
        const image = new Image()
        image.src = path
        return image
    }

    // Returns a usable video source
    static loadVideo(path, looping=true, autoPlay=true) {
        const video = document.createElement("video")
        video.src = path
        video.preload = "auto"
        video.loop = looping
        if (autoPlay) {
            video.mute = true
            video.autoplay = autoPlay
            video.play().catch(()=>Canvas.addOnFirstInteractCallback(()=>video.play()))
        }
        return video
    }

    // Returns a usable camera capture source
    static loadCamera(resolution, facingMode, frameRate) {
        resolution??=ImageDisplay.DEFAULT_CAMERA_RESOLUTION
        return {
            type:ImageDisplay.SOURCE_TYPES.CAMERA,
            settings:{
                width:{ideal:resolution?.[0]},
                height:{ideal:resolution?.[1]},
                facingMode:facingMode??ImageDisplay.DEFAULT_FACING_MODE,
                frameRate:frameRate??ImageDisplay.DEFAULT_CAMERA_FRAME_RATE,
            }
        }
    }

    // Returns a usable screen capture source
    static loadCapture(resolution, cursor, frameRate, mediaSource) {
        resolution??=ImageDisplay.DEFAULT_CAPTURE_RESOLUTION
        return {
            type:ImageDisplay.SOURCE_TYPES.CAPTURE,
            settings:{
                mediaSource:mediaSource??ImageDisplay.DEFAULT_CAPTURE_MEDIA_SOURCE,
                frameRate:frameRate??ImageDisplay.DEFAULT_CAPTURE_FRAME_RATE,
                cursor:cursor??ImageDisplay.DEFAULT_CAPTURE_CURSOR,
                width:{ideal:resolution?.[0]},
                height:{ideal:resolution?.[1]}
            }
        }
    }

    // returns a separate copy of this ImageDisplay instance
    duplicate(source=this._source, pos=this.pos_, size=this._size, setupCB=this._setupCB, anchorPos=this._anchorPos, alwaysActive=this._alwaysActive) {
        const imageDisplay = new ImageDisplay(
            source, 
            pos,
            size,
            setupCB,
            anchorPos,
            alwaysActive
        )
        imageDisplay._scale = CDEUtils.unlinkArr2(this._scale)
        imageDisplay._rotation = this._rotation
        imageDisplay._visualEffects = this.visualEffects_
        
        return this.initialized ? imageDisplay : null
    }

    // Plays the source (use only if the source is a video)
    playVideo() {
        const source = this._source
        if (source instanceof HTMLVideoElement) source.play().catch(()=>Canvas.addOnFirstInteractCallback(()=>video.play()))
    }

    // Pauses the source (use only if the source is a video)
    pauseVideo() {
        const source = this._source
        if (source instanceof HTMLVideoElement) source.pause()
    }

    static getNaturalSize(source) {
        return [source?.displayWidth||source?.videoWidth||source?.width, source?.displayHeight||source?.videoHeight||source?.height]
    }

	get size() {return this._size}
    get width() {return this._size[0]}
    get height() {return this._size[1]}
    get trueSize() {return [this._size[0]*this._scale[0], this._size[1]*this._scale[1]]}
    get naturalSize() {return ImageDisplay.getNaturalSize(this._source)}
    get centerX() {return this._pos[0]+this._size[0]/2}
    get centerY() {return this._pos[1]+this._size[1]/2}
    get centerPos() {return [this.centerX, this.centerY]}
    get source() {return this._source}
	get sourceCroppingPositions() {return this._sourceCroppingPositions}

    get video() {return this._source}
    get image() {return this._source}
    get paused() {return this._source?.paused}
    get isPaused() {return this.paused}
    get playbackRate() {return this._source?.playbackRate}
    get speed() {return this.playbackRate}
    get currentTime() {return this._source?.currentTime}
    get loop() {return this._source?.loop}
    get isLooping() {return this.loop}

	set size(_size) {this._size = _size}
	set width(width) {this._size[0] = width}
	set height(height) {this._size[1] = height}
    set paused(paused) {
        try {
            if (paused) this._source.pause()
            else this._source.play()
        }catch(e){}
    }
    set isPaused(isPaused) {this.paused = isPaused}
    set playbackRate(playbackRate) {this._source.playbackRate = playbackRate}
    set speed(speed) {this.playbackRate = speed}
    set currentTime(currentTime) {this._source.currentTime = currentTime}
    set loop(loop) {this._source.loop = loop}
    set isLooping(isLooping) {this.loop = isLooping}
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