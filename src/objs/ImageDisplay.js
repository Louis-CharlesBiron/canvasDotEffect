// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Displays an image or a video as an object
class ImageDisplay extends _BaseObj {
    static SUPPORTED_IMAGE_FORMATS = ["jpg","jpeg","png","gif","svg","webp","bmp","tiff","ico","heif","heic"]
    static SUPPORTED_VIDEO_FORMATS = ["mp4","webm","ogv","mov","avi","mkv","flv","wmv","3gp","m4v"]
    static SOURCE_TYPES = {
        FILE_PATH:"string",
        DYNAMIC:"[object Object]",
        CAMERA:"CAMERA",
        CAPTURE:"CAPTURE",
        IMAGE:HTMLImageElement,
        SVG:SVGImageElement,
        BITMAP_PROMISE:Promise,
        BITMAP:ImageBitmap,
        VIDEO:HTMLVideoElement,
        VIDEO_FRAME:VideoFrame,
        CANVAS:HTMLCanvasElement,
        OFFSCREEN_CANVAS:OffscreenCanvas
    }
    static RESOLUTIONS = {SD:[640, 480], HD:[1280, 720], FULL_HD:[1920, 1080], "4K":[3840,2160], FOURK:[3840,2160], MAX:[3840,2160]}
    static CAMERA_FACING_MODES = {USER:"user", ENVIRONMENT:"environment"}
    static DEFAULT_FACING_MODE = ImageDisplay.CAMERA_FACING_MODES.USER
    static DEFAULT_CAMERA_RESOLUTION = ImageDisplay.RESOLUTIONS.HD
    static DEFAULT_CAMERA_FRAME_RATE = 30
    static DEFAULT_CAMERA_SETTINGS = ImageDisplay.loadCamera()
    static DEFAULT_CAMERAS = {
        CAMERA_SD:ImageDisplay.loadCamera(ImageDisplay.RESOLUTIONS.SD),
        CAMERA_HD:ImageDisplay.loadCamera(ImageDisplay.RESOLUTIONS.HD),
        CAMERA_FULL_HD:ImageDisplay.loadCamera(ImageDisplay.RESOLUTIONS.FULL_HD),
        CAMERA_4K:ImageDisplay.loadCamera(ImageDisplay.RESOLUTIONS.FOURK),
        CAMERA:ImageDisplay.DEFAULT_CAMERA_SETTINGS,
    }
    static CAPTURE_MEDIA_SOURCES = {SCREEN:"screen", WINDOW:"window", TAB:"tab"}
    static CAPTURE_CURSOR = {ALWAYS:"always", MOTION:"motion", NONE:"none"}
    static DEFAULT_CAPTURE_RESOLUTION = ImageDisplay.RESOLUTIONS.HD
    static DEFAULT_CAPTURE_MEDIA_SOURCE = "screen"
    static DEFAULT_CAPTURE_FRAME_RATE = 30
    static DEFAULT_CAPTURE_CURSOR = "always"
    static DEFAULT_CAPTURE_SETTINGS = ImageDisplay.loadCapture()
    static DEFAULT_CAPTURES = {
        CAPTURE_SD:ImageDisplay.loadCapture(ImageDisplay.RESOLUTIONS.SD),
        CAPTURE_HD:ImageDisplay.loadCamera(ImageDisplay.RESOLUTIONS.HD),
        CAPTURE_FULL_HD:ImageDisplay.loadCamera(ImageDisplay.RESOLUTIONS.FULL_HD),
        CAPTURE_4k:ImageDisplay.loadCamera(ImageDisplay.RESOLUTIONS.FOURK),
        CAPTURE:ImageDisplay.DEFAULT_CAPTURE_SETTINGS
    }


    /**
        TODO:
        
        documentation

        color implementation?
        pattern
        source croping?
     */

    constructor(source, pos, size, setupCB, anchorPos, alwaysActive) {
        super(pos, null, setupCB, anchorPos, alwaysActive)
        this._source = source??"" // the initial source of the displayed image
        this._size = size         // the display size of the image (resizes)
        this._data = null         // the usable data source

        this._parent = null  // the parent object (Canvas)
        this._rotation = 0   // the displayed image's rotation in degrees 
        this._scale = [1,1]  // the displayed image's scale factors: [scaleX, scaleY]
    }

    initialize() {
        const types = ImageDisplay.SOURCE_TYPES, dataSrc = this._source
        if (typeof dataSrc===types.FILE_PATH) {
            const extension = dataSrc.split(".")[dataSrc.split(".").length-1]
            if (ImageDisplay.SUPPORTED_IMAGE_FORMATS.includes(extension)) ImageDisplay.loadImage(dataSrc).onload=e=>this.#initData(e.target)
            else if (ImageDisplay.SUPPORTED_VIDEO_FORMATS.includes(extension)) this.#initVideoDataSource(ImageDisplay.loadVideo(dataSrc))
        }
        else if (dataSrc instanceof types.IMAGE || dataSrc instanceof types.SVG) {
            if (dataSrc.complete && dataSrc.src) this.#initData(dataSrc)
            else dataSrc.onload=()=>this.#initData(dataSrc)
        }
        else if (dataSrc.toString()===types.DYNAMIC) {
            if (dataSrc.type===types.CAMERA) this.#initCameraDataSource(dataSrc.settings)
            else if (dataSrc.type===types.CAPTURE) this.#initCaptureDataSource(dataSrc.settings)
        }
        else if (dataSrc instanceof types.VIDEO) this.#initVideoDataSource(dataSrc)
        else if (dataSrc instanceof types.CANVAS || dataSrc instanceof types.BITMAP) this.#initData(dataSrc)
        else if (dataSrc instanceof types.OFFSCREEN_CANVAS) this.#initData(dataSrc.transferToImageBitmap(), dataSrc.width, dataSrc.height)
        else if (dataSrc instanceof types.BITMAP_PROMISE) dataSrc.then(bitmap=>this.#initData(bitmap))
        else if (dataSrc instanceof types.VIDEO_FRAME) {
            this.#initData(dataSrc, dataSrc.displayHeight, dataSrc.displayWidth)
            dataSrc.close()
        }

        this._pos = this.getInitPos()||_BaseObj.DEFAULT_POS
        this.setAnchoredPos()
    }

    draw(render, time, deltaTime) {
        if (this.initialized) {
            const ctx = render.ctx, x = this.centerX, y = this.centerY, hasScaling = this._scale[0]!==1||this._scale[1]!==1, hasTransforms = this._rotation || hasScaling

            if (hasTransforms) {
                ctx.translate(x, y)
                if (this._rotation) ctx.rotate(CDEUtils.toRad(this._rotation))
                if (hasScaling) ctx.scale(this._scale[0], this._scale[1])
                ctx.translate(-x, -y)
            }

            render.drawImage(this._data, this._pos, this._size)

            if (hasTransforms) ctx.setTransform(1,0,0,1,0,0)
        }
        super.draw(time, deltaTime)
    }

    // Returns a usable image source
    static loadImage(filepath) {
        const image = new Image()
        image.src = filepath
        return image
    }

    // Returns a usable video source
    static loadVideo(filepath, looping=false, autoPlay=false) {
        const video = document.createElement("video")
        video.src = filepath
        video.preload = "auto"
        video.loop = looping
        video.autoplay = autoPlay
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

    // initializes a data source
    #initData(dataSource, width=dataSource.width, height=dataSource.height) {
        this._data = dataSource
        if (!this._size) this._size = [width, height]
        if (!CDEUtils.isDefined(this._size[0])) this._size = [width, this._size[1]]
        if (!CDEUtils.isDefined(this._size[1])) this._size = [this._size[0], height]
        this._initialized = true
        if (CDEUtils.isFunction(this._setupCB)) this._setupResults = this._setupCB(this, this._parent, this._data)
    }

    // Initializes a video data source
    #initVideoDataSource(dataSource) {
        dataSource.onloadeddata=()=>this.#initData(dataSource, dataSource.videoWidth, dataSource.videoHeight)
    }

    // Initializes a camera capture data source
    #initCameraDataSource(settings=true) {
        navigator.mediaDevices.getUserMedia({video:settings}).then(src=>{
            const video = document.createElement("video")
            video.srcObject = src
            video.autoplay = true
            video.oncanplay=()=>this.#initData(video, video.videoWidth, video.videoHeight)
        })
    }

    // Initializes a screen capture data source
    #initCaptureDataSource(settings=true) {
        navigator.mediaDevices.getDisplayMedia({video:settings}).then(src=>{
            const video = document.createElement("video")
            video.srcObject = src
            video.autoplay = true
            video.oncanplay=()=>this.#initData(video, video.videoWidth, video.videoHeight)
        })
    }

    // Rotates the image by a specified degree increment around its center pos
    rotateBy(deg) {// clock-wise
        this._rotation = (this._rotation+deg)%360
    }

    // Rotates the image to a specified degree around its center pos
    rotateAt(deg) {
        this._rotation = deg%360
    }

    // Smoothly rotates the image to a specified degree around its center pos
    rotateTo(deg, time=1000, easing=Anim.easeInOutQuad, isUnique=false, force=false) {
        const ir = this._rotation, dr = deg-this._rotation
        return this.playAnim(new Anim((prog)=>this.rotateAt(ir+dr*prog), time, easing), isUnique, force)
    }

    // Scales the image by a specified amount [scaleX, scaleY] from its center pos
    scaleBy(scale) {
        let [scaleX, scaleY] = scale
        if (!CDEUtils.isDefined(scaleX)) scaleX = this._scale[0]
        if (!CDEUtils.isDefined(scaleY)) scaleY = this._scale[1]
        this._scale[0] *= scaleX
        this._scale[1] *= scaleY
    }

    // Scales the image to a specified amount [scaleX, scaleY] from its pos
    scaleAt(scale) {
        this.scale = scale
    }

    // Smoothly scales the image to a specified amount [scaleX, scaleY] from its center pos
    scaleTo(scale, time=1000, easing=Anim.easeInOutQuad, centerPos=this.pos, isUnique=false, force=false) {
        const is = CDEUtils.unlinkArr2(this._scale), dsX = scale[0]-is[0], dsY = scale[1]-is[1]

        return this.playAnim(new Anim(prog=>this.scaleAt([is[0]+dsX*prog, is[1]+dsY*prog], centerPos), time, easing), isUnique, force)
    }

    // returns a separate copy of this ImageDisplay instance
    duplicate(source=this._source, pos=this.pos_, size=this._size, setupCB=this._setupCB, anchorPos=this._anchorPos, alwaysActive=this._alwaysActive) {
        return this.initialized ? new ImageDisplay(source, pos, size, setupCB, anchorPos, alwaysActive) : null
    }

    // doc todo
    aspectRatioScale() {
        // TODO
    }

    // Plays the source (use only if the source is a video)
    playVideo() {
        this._data.play()
    }

    // Pauses the source (use only if the source is a video)
    pauseVideo() {
        this._data.pause()
    }


    get source() {return this._source}
	get size() {return this._size}
    get trueSize() {return [this._size[0]*this._scale[0], this._size[1]*this._scale[1]]}
	get data() {return this._data}
	get parent() {return this._parent}
	get rotation() {return this._rotation}
	get scale() {return this._scale}
    get centerX() {return this._pos[0]+this._size[0]/2}
    get centerY() {return this._pos[0]+this._size[0]/2}
    get centerPos() {return [this.centerX, this.centerY]}
    get video() {return this._data}
    get image() {return this._data}
    get paused() {return this._data?.paused}
    get isPaused() {return this.paused}
    get playbackRate() {return this._data?.playbackRate}
    get speed() {return this.playbackRate}
    get currentTime() {return this._data?.currentTime}
    get loop() {return this._data?.loop}
    get isLooping() {return this.loop}

	set size(_size) {this._size = _size}
	set data(_data) {this._data = _data}
    set rotation(_rotation) {this._rotation = _rotation%360}
    set scale(_scale) {
        let [scaleX, scaleY] = _scale
        if (!CDEUtils.isDefined(scaleX)) scaleX = this._scale[0]
        if (!CDEUtils.isDefined(scaleY)) scaleY = this._scale[1]
        this._scale[0] = scaleX
        this._scale[1] = scaleY
    }
    set paused(paused) {
        if (paused) this._data.pause()
        else this._data.play()
    }
    set isPaused(isPaused) {this.paused = isPaused}
    set playbackRate(playbackRate) {this._data.playbackRate = playbackRate}
    set speed(speed) {this.playbackRate = speed}
    set currentTime(currentTime) {this._data.currentTime = currentTime}
    set loop(loop) {this._data.loop = loop}
    set isLooping(isLooping) {this.loop = isLooping}

}