// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

class ImageDisplay extends _BaseObj {
    static SUPPORTED_IMAGE_FORMATS = ["jpg","jpeg","png","gif","svg","webp","bmp","tiff","ico","heif","heic"]
    static SUPPORTED_VIDEO_FORMATS = ["mp4","webm","ogv","mov","avi","mkv","flv","wmv","3gp","m4v"]
    static DEFAULT_WIDTH = 128
    static DEFAULT_HEIGHT = 128
    static SOURCE_TYPES = {FILE_PATH:"string", DYNAMIC:"[object Object]", CAMERA:"CAMERA", CAPTURE:"CAPTURE", IMAGE:HTMLImageElement, SVG:SVGImageElement, BITMAP_PROMISE:Promise, BITMAP:ImageBitmap, VIDEO:HTMLVideoElement, CANVAS:HTMLCanvasElement, OFFSCREEN_CANVAS:OffscreenCanvas}
    static DYNAMIC_SOURCE_TYPES = {VIDEO:HTMLVideoElement, CANVAS:HTMLCanvasElement, OFFSCREEN_CANVAS:OffscreenCanvas}
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
    static ERROR_TYPES = {NO_PERMISSION:0, DEVICE_IN_USE:1, SOURCE_DISCONNECTED:2, FILE_NOT_FOUND:3, NOT_AVAILABLE:4, NOT_SUPPORTED:5}
    static IS_CAMERA_SUPPORTED = ()=>!!navigator?.mediaDevices?.getUserMedia
    static IS_SCREEN_RECORD_SUPPORTED = ()=>!!navigator?.mediaDevices?.getDisplayMedia
    static DEFAULT_MEDIA_ERROR_CALLBACK = (errorCode, media)=>console.warn("Error while loading media:", ImageDisplay.getErrorFromCode(errorCode), "("+media+")")

    #naturalSize = null
    
    /**
     * Displays an image or a video as an object
     * @param {CanvasImageSource} source: a media source, such as an image or a video
     * @param {[x,y]?} pos: the [x,y] pos of the top left of the object
     * @param {[width, height]?} size: the width and height of the display. Either as pixels or as pourcentiles (ex: ["50%", 200])
     * @param {Function?} errorCB: function called upon any error loading the media (errorType, source, e?)=>
     * @param {Function?} setupCB: function called on object's initialization (this, parent)=>{...}
     * @param {Function?} loopCB: function called each frame for this object (this)=>{...}
     * @param {[x,y] | Function | _BaseObj ?} anchorPos: reference point from which the object's pos will be set. Either a pos array, a callback (this, parent)=>{return [x,y] | _baseObj} or a _BaseObj inheritor
     * @param {Number | Boolean ?} activationMargin: the pixel margin amount from where the object remains active when outside the canvas visual bounds. If "true", the object will always remain active.
     */
    constructor(source, pos, size, errorCB, setupCB, loopCB, anchorPos, activationMargin) {
        super(pos, null, setupCB, loopCB, anchorPos, activationMargin)
        this._source = source               // the data source
        this._size = size||[]               // the display size of the image (resizes)
        this._errorCB = errorCB||ImageDisplay.DEFAULT_MEDIA_ERROR_CALLBACK// a callback called if there is an error with the source (errorType, source, e?)=>
        this._sourceCroppingPositions = null// data source cropping positions delimiting a rectangle, [ [startX, startY], [endX, endY] ] (Defaults to no cropping)
    }

    initialize() {
        ImageDisplay.initializeDataSource(this._source, (data, naturalSize)=>{
            this._source = data
            this.#naturalSize = naturalSize
            this.size = this._size
            this._initialized = true
            if (CDEUtils.isFunction(this._setupCB)) this._setupResults = this._setupCB(this, this._parent, this._source)
        }, this._errorCB)

        this._pos = this.getInitPos()||_BaseObj.DEFAULT_POS
        this.setAnchoredPos()
    }

    draw(render, time, deltaTime) {
        if (this.initialized) {
            const source = this._source
            if (source instanceof HTMLVideoElement && (!source.src && !source.srcObject?.active)) return;

            const ctx = render.ctx, hasScaling = this._scale[0]!==1||this._scale[1]!==1, hasTransforms = this._rotation||hasScaling

            let viewPos
            if (hasTransforms) {
                const cx = this.centerX, cy = this.centerY
                viewPos = this.parent.viewPos
                ctx.translate(cx, cy)
                if (this._rotation) ctx.rotate(CDEUtils.toRad(this._rotation))
                if (hasScaling) ctx.scale(this._scale[0], this._scale[1])
                ctx.translate(-cx, -cy)
            }

            if (source instanceof HTMLCanvasElement) render.drawLateImage(source, this._pos, this._size, this._sourceCroppingPositions, this.visualEffects)
            else render.drawImage(source, this._pos, this._size, this._sourceCroppingPositions, this.visualEffects)

            if (hasTransforms) ctx.setTransform(1,0,0,1,viewPos[0],viewPos[1])
        }
        super.draw(time, deltaTime)
    }

    /**
     * Initializes a ImageDisplay data source
     * @param {ImageDisplay.SOURCE_TYPES} dataSrc: the source of the media 
     * @param {Function?} loadCallback: a function called upon source load (mediaElement, size)=>
     * @param {Function?} errorCB: a function called if there is an error with the source (errorType, dataSrc, e?)=>
     */
    static initializeDataSource(dataSrc, loadCallback, errorCB) {
        const types = ImageDisplay.SOURCE_TYPES
        if (typeof dataSrc==types.FILE_PATH) {
            if (ImageDisplay.isImageFormatSupported(dataSrc)) ImageDisplay.loadImage(dataSrc, errorCB).onload=e=>ImageDisplay.#initData(e.target, loadCallback)
            else if (ImageDisplay.isVideoFormatSupported(dataSrc)) ImageDisplay.#initVideoDataSource(ImageDisplay.loadVideo(dataSrc), loadCallback, errorCB)
            else if (CDEUtils.isFunction(errorCB)) errorCB(ImageDisplay.ERROR_TYPES.NOT_SUPPORTED, dataSrc) 
        } else if (dataSrc instanceof types.IMAGE || dataSrc instanceof types.SVG) {
            const fakeLoaded = dataSrc.getAttribute("fakeload")
            if (dataSrc.complete && dataSrc.src && !fakeLoaded) ImageDisplay.#initData(dataSrc, loadCallback)
            else dataSrc.onload=()=>{
                if (fakeLoaded) dataSrc.removeAttribute("fakeload")
                ImageDisplay.#initData(dataSrc, loadCallback)
            }
        } else if (dataSrc.toString()==types.DYNAMIC) {
            if (dataSrc.type==types.CAMERA) ImageDisplay.#initCameraDataSource(dataSrc.settings, loadCallback, errorCB)
            else if (dataSrc.type==types.CAPTURE) ImageDisplay.#initCaptureDataSource(dataSrc.settings, loadCallback, errorCB)
        } else if (dataSrc instanceof types.VIDEO) ImageDisplay.#initVideoDataSource(dataSrc, loadCallback, errorCB)
        else if (dataSrc instanceof types.CANVAS || dataSrc instanceof types.BITMAP || dataSrc instanceof types.OFFSCREEN_CANVAS) ImageDisplay.#initData(dataSrc, loadCallback)
        else if (dataSrc instanceof MediaStream) ImageDisplay.#initMediaStream(dataSrc, loadCallback, errorCB)
        else if (dataSrc instanceof types.BITMAP_PROMISE) dataSrc.then(bitmap=>ImageDisplay.#initData(bitmap, loadCallback))
    }

    // initializes a data source
    static #initData(dataSource, loadCallback, width=dataSource.width||ImageDisplay.DEFAULT_WIDTH, height=dataSource.height||ImageDisplay.DEFAULT_HEIGHT) {
        if (CDEUtils.isFunction(loadCallback)) loadCallback(dataSource, [width, height])
    }

    // Initializes a video data source
    static #initVideoDataSource(dataSource, loadCallback, errorCB) {
        const fn=()=>this.#initData(dataSource, loadCallback, dataSource.videoWidth, dataSource.videoHeight)
        dataSource.onerror=e=>{if (CDEUtils.isFunction(errorCB)) errorCB(ImageDisplay.ERROR_TYPES.FILE_NOT_FOUND, dataSource, e)}
        if (dataSource.readyState) fn()
        else dataSource.onloadeddata=fn
    }

    static #initMediaStream(stream, loadCallback, errorCB) {
        const video = document.createElement("video")
        video.srcObject = stream
        video.autoplay = true
        video.setAttribute("permaLoad", "1")
        stream.oninactive=e=>{if (CDEUtils.isFunction(errorCB)) errorCB(ImageDisplay.ERROR_TYPES.SOURCE_DISCONNECTED, stream, e)}
        video.oncanplay=()=>this.#initData(video, loadCallback, video.videoWidth, video.videoHeight)
    }

    // Initializes a camera capture data source
    static #initCameraDataSource(settings=true, loadCallback, errorCB) {
        if (ImageDisplay.IS_CAMERA_SUPPORTED()) navigator.mediaDevices.getUserMedia({video:settings}).then(src=>ImageDisplay.#initMediaStream(src, loadCallback, errorCB)).catch(e=>{if (CDEUtils.isFunction(errorCB)) errorCB(e.toString().includes("NotReadableError")?ImageDisplay.ERROR_TYPES.DEVICE_IN_USE:ImageDisplay.ERROR_TYPES.NO_PERMISSION, settings, e)})
        else if (CDEUtils.isFunction(errorCB)) errorCB(ImageDisplay.ERROR_TYPES.NOT_AVAILABLE, settings)
    }

    // Initializes a screen capture data source
    static #initCaptureDataSource(settings=true, loadCallback, errorCB) {
        if (ImageDisplay.IS_SCREEN_RECORD_SUPPORTED()) navigator.mediaDevices.getDisplayMedia({video:settings}).then(src=>ImageDisplay.#initMediaStream(src, loadCallback, errorCB)).catch(e=>{if (CDEUtils.isFunction(errorCB)) errorCB(ImageDisplay.ERROR_TYPES.NO_PERMISSION, settings, e)})
        else if (CDEUtils.isFunction(errorCB)) errorCB(ImageDisplay.ERROR_TYPES.NOT_AVAILABLE, settings)
    }

    /**
     * Create a usable image source
     * @param {String} path: the source path
     * @param {Function?} errorCB: function called upon any error loading the media
     * @param {Boolean?} forceLoad: whether to force the reloading of the image if the image is being reused
     * @returns an HTML image element
     */
    static loadImage(src, errorCB=null, forceLoad=false) {
        const image = new Image()
        image.src = src
        if (CDEUtils.isFunction(errorCB)) image.onerror=e=>errorCB(ImageDisplay.ERROR_TYPES.FILE_NOT_FOUND, src, e)
        if (forceLoad) image.setAttribute("fakeload", "1")
        return image
    }

    /**
     * Returns a usable video source
     * @param {String | File} src: the source of the video, either a path or a File
     * @param {Boolean?} looping: whether the video loops
     * @param {Boolean?} autoPlay: whether the video autoplays
     * @returns a HTML video element
     */
    static loadVideo(src, looping=true, autoPlay=true) {
        const video = document.createElement("video")
        video.src = src instanceof File ? URL.createObjectURL(src) : src
        video.preload = "auto"
        video.loop = looping
        if (autoPlay) {
            video.mute = true
            video.autoplay = autoPlay
            ImageDisplay.playMedia(video)
        }
        return video
    }

    /**
     * Returns a usable camera capture source
     * @param {[resolutionX, resolutionY]?} resolution: the camera resolution
     * @param {ImageDisplay.CAMERA_FACING_MODES?} facingMode: which camera to use
     * @param {Number?} frameRate: how many times the camera feed updates per seconds
     * @returns an object containing camera settings, usable as a source
     */
    static loadCamera(resolution=null, facingMode=null, frameRate=null) {
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

    /**
     * Returns a usable screen capture source
     * @param {[resolutionX, resolutionY]?} resolution: the screen capture resolution
     * @param {ImageDisplay.CAPTURE_CURSOR?} cursor: how the cursor is captured
     * @param {Number?} frameRate: how many times the screen capture feed updates per seconds
     * @param {ImageDisplay.CAPTURE_MEDIA_SOURCES?} mediaSource: the default screen source to capture
     * @returns an object containing screen capture settings, usable as a source
     */
    static loadCapture(resolution=null, cursor=null, frameRate=null, mediaSource=null) {
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

    /**
     * Returns the name of the errors
     * @param {ImageDisplay.ERROR_TYPES} errorCode: The error code contained in ERROR_TYPES
     * @returns the name of the error based on the error code
     */
    static getErrorFromCode(errorCode) {
        return Object.keys(ImageDisplay.ERROR_TYPES)[errorCode]
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
        const source = this._source
        if (source instanceof HTMLVideoElement) source.pause()
    }

    /**
     * Plays the provided video source
     * @param {HTMLAudioElement | HTMLVideoElement} source: a video source
     * @param {Function?} errorCB: a function called if there is an error with the source (errorType, dataSrc, e?)=>
     */
    static playMedia(source, errorCB) {
        if (source instanceof HTMLVideoElement || source instanceof HTMLAudioElement) source.play().catch(()=>Canvas.addOnFirstInteractCallback(()=>source.play().catch(e=>{if (CDEUtils.isFunction(errorCB)) errorCB(ImageDisplay.ERROR_TYPES.NOT_AVAILABLE, source, e)})))
    }
    
    /**
     * Returns the natural size of the source
     * @param {HTMLElement} source: a usable source 
     * @returns the size
     */
    static getNaturalSize(source) {
        return [source?.displayWidth||source?.videoWidth||source?.width, source?.displayHeight||source?.videoHeight||source?.height]
    }

    /**
     * @returns a separate copy of this ImageDisplay instance (only if initialized)
     */
    duplicate(source=this._source, pos=this.pos_, size=this.size_, setupCB=this._setupCB, loopCB=this._loopCB, anchorPos=this._anchorPos, activationMargin=this._activationMargin) {
        const imageDisplay = new ImageDisplay(
            source instanceof MediaStreamAudioSourceNode ? source.mediaStream.clone() : source.cloneNode(), 
            pos,
            size,
            setupCB,
            loopCB,
            anchorPos,
            activationMargin
        )
        imageDisplay._scale = CDEUtils.unlinkArr2(this._scale)
        imageDisplay._rotation = this._rotation
        imageDisplay._visualEffects = this.visualEffects_
        
        return this.initialized ? imageDisplay : null
    }

    /**
     * Returns whether the provided pos is inside the display
     * @param {[x,y]} pos: the pos to check 
     * @param {Number | [paddingTop, paddingRight?, paddingBottom?, paddingLeft?] ?} padding: the padding added to the validity area
     * @param {Number?} rotation: the rotation in degrees of the area
     * @param {[scaleX, scaleY]?} scale: the scale of the area
     * @returns whether the provided pos is inside the display
     */
    isWithin(pos, padding, rotation, scale) {
        return super.isWithin(pos, this.getBounds(padding, rotation, scale), padding)
    }

    /**
     * Returns whether the provided pos is inside the display very accurately
     * @param {[x,y]} pos: the pos to check 
     * @param {Number | [paddingTop, paddingRight?, paddingBottom?, paddingLeft?] ?} padding: the padding added to the validity area
     * @param {Number?} rotation: the rotation in degrees of the area
     * @param {[scaleX, scaleY]?} scale: the scale of the area
     * @returns whether the provided pos is inside the display
     */
    isWithinAccurate(pos, padding, rotation, scale) {
        const viewPos = this.cvs.viewPos
        return this.ctx.isPointInPath(this.getBoundsAccurate(padding, rotation, scale), pos[0]+viewPos[0], pos[1]+viewPos[1])
    }

    // returns the raw a minimal rectangular area containing all of the image (no scale/rotation)
    #getRectBounds() {
        const size = this._size, pos = this._pos
        return [pos, [pos[0]+size[0], pos[1]+size[1]]]
    }

    /**
     * Returns the accurate area containing all of the display
     * @param {Number | [paddingTop, paddingRight?, paddingBottom?, paddingLeft?] ?} padding: the padding added to the validity area
     * @param {Number?} rotation: the rotation in degrees of the area
     * @param {[scaleX, scaleY]?} scale: the scale of the area
     * @returns a Path2D
     */
    getBoundsAccurate(padding, rotation=this._rotation, scale=this._scale) {
        const path = new Path2D(), positions = this.#getRectBounds(), corners = super.getCorners(positions, padding, rotation, scale, super.getCenter(positions))

        path.moveTo(corners[0][0], corners[0][1])
        path.lineTo(corners[2][0], corners[2][1])
        path.lineTo(corners[1][0], corners[1][1])
        path.lineTo(corners[3][0], corners[3][1])
        path.lineTo(corners[0][0], corners[0][1])

        return path
    }

    /**
     * @returns the center pos of the image
     */
    getCenter() {
        return super.getCenter(this.#getRectBounds())
    }

    /**
     * Returns the minimal rectangular area containing all of the display
     * @param {Number | [paddingTop, paddingRight?, paddingBottom?, paddingLeft?] ?} padding: the padding added to the validity area
     * @param {Number?} rotation: the rotation in degrees of the area
     * @param {[scaleX, scaleY]?} scale: the scale of the area
     * @returns the area positions [[x1,y1], [x2,y2]]
     */
    getBounds(padding, rotation=this._rotation, scale=this._scale) {
        const positions = this.#getRectBounds()
        return super.getBounds(positions, padding, rotation, scale, super.getCenter(positions))
    }

    /**
     * Removes the display from the canvas
     */
    remove() {
        if (this._source instanceof HTMLVideoElement) {
            this._source.pause()
            this._source.remove()
        }
        this._parent.remove(this._id)
    }

    /**
     * Resizes the image's width keeping the original aspect ratio
     * @param {Number | String} width: The width in px, or the width in % based on the natural size 
     */
    aspectRatioWidthResize(width) {
        const heightFactor = this._size[1]/this._size[0], newWidth = (typeof width=="string" ? (+width.replace("%","").trim()/100)*this.#naturalSize[0] : width==null ? this.#naturalSize[0] : width)>>0
        this._size[0] = newWidth
        this._size[1] = newWidth*heightFactor
    }

    /**
     * Resizes the image's height keeping the original aspect ratio
     * @param {Number | String} height: The height in px, or the height in % based on the natural size 
     */
    aspectRatioHeightResize(height) {
        const widthFactor = this._size[0]/this._size[1], newHeight = (typeof height=="string" ? (+height.replace("%","").trim()/100)*this.#naturalSize[1] : height==null ? this.#naturalSize[1] : height)>>0
        this._size[1] = newHeight
        this._size[0] = newHeight*widthFactor
    }
    
    /**
     * Returns whether the provided file type is supported
     * @param {String | File} file: the file or filename 
     * @returns Whether the file is supported or not
     */
    static isFormatSupported(file) {
        return ImageDisplay.isImageFormatSupported(file)||ImageDisplay.isVideoFormatSupported(file)
    }

    /**
     * Returns whether the provided image file type is supported
     * @param {String | File} file: the file or filename 
     * @returns Whether the image file is supported or not
     */
    static isImageFormatSupported(file) {
        const name = (file?.name||file).toLowerCase()
        return ImageDisplay.SUPPORTED_IMAGE_FORMATS.some(ext=>name.endsWith("."+ext))
    }

    /**
     * Returns whether the provided video file type is supported
     * @param {String | File} file: the file or filename 
     * @returns Whether the video file is supported or not
     */
    static isVideoFormatSupported(file) {
        const name = (file?.name||file).toLowerCase()
        return ImageDisplay.SUPPORTED_VIDEO_FORMATS.some(ext=>name.endsWith("."+ext))
    }

    /**
     * @returns Returns all the supported file formats in a string usable in a HTML file input
     */
    static getSupportedHTMLAcceptValue() {
        const sep = ", ."
        return "."+ImageDisplay.SUPPORTED_IMAGE_FORMATS.join(sep)+sep+ImageDisplay.SUPPORTED_VIDEO_FORMATS.join(sep)
    }

    [Symbol.toPrimitive]() {
        return this.id
    }

    get [Symbol.toStringTag]() {return this.instanceOf}
    get instanceOf() {return "ImageDisplay"}
	get ctx() {return this._parent._ctx}
	get size() {return this._size||[0,0]}
	get size_() {return this._size?CDEUtils.unlinkArr2(this._size):[0,0]}
    get width() {return this._size[0]}
    get height() {return this._size[1]}
    get trueSize() {
        const size = this.size
        return [Math.abs(size[0]*this._scale[0]), Math.abs(size[1]*this._scale[1])]
    }
    get naturalSize() {return this.#naturalSize||ImageDisplay.getNaturalSize(this._source)}
    get centerX() {return this._pos[0]+this._size[0]/2}
    get centerY() {return this._pos[1]+this._size[1]/2}
    get centerPos() {return [this.centerX, this.centerY]}
    get source() {return this._source}
	get sourceCroppingPositions() {return this._sourceCroppingPositions}
    get errorCB() {return this._errorCB}

    get paused() {return this._source?.paused}
    get playbackRate() {return this._source?.playbackRate}
    get speed() {return this.playbackRate}
    get currentTime() {return this._source?.currentTime}
    get isLooping() {return this.loop}
    get isDynamic() {return this._source instanceof ImageDisplay.DYNAMIC_SOURCE_TYPES.CANVAS || this._source instanceof ImageDisplay.DYNAMIC_SOURCE_TYPES.OFFSCREEN_CANVAS || this._source instanceof ImageDisplay.DYNAMIC_SOURCE_TYPES.VIDEO}

    set source(source) {
        const initSize = this._size
        ImageDisplay.initializeDataSource(source, (data, naturalSize)=>{
            this._source = data
            this.#naturalSize = naturalSize
            this.size = initSize
        }, this._errorCB)
    }
    set errorCB(errorCB) {this._errorCB = errorCB}
    set naturalSize(naturalSize) {this.#naturalSize = naturalSize}
	set size(size) {
        this.width = size[0]
        this.height = size[1]
        return this._size
    }
    set width(width) {this._size[0] = (typeof width=="string" ? (+width.replace("%","").trim()/100)*this.#naturalSize[0] : width==null ? this.#naturalSize[0] : width)>>0}
	set height(height) {this._size[1] = (typeof height=="string" ? (+height.replace("%","").trim()/100)*this.#naturalSize[1] : height==null ? this.#naturalSize[1] : height)>>0}
    set paused(paused) {
        try {
            if (paused) this._source.pause()
            else ImageDisplay.playMedia(this._source)
        }catch(e){}
    }
    set playbackRate(playbackRate) {this._source.playbackRate = playbackRate}
    set speed(speed) {this.playbackRate = speed}
    set currentTime(currentTime) {this._source.currentTime = currentTime}
    set isLooping(isLooping) {this.loop = isLooping}
	set sourceCroppingPositions(sourceCroppingPositions) {
        if (sourceCroppingPositions) {
            const pos1 = sourceCroppingPositions[0], pos2 = sourceCroppingPositions[1], naturalSize = this.#naturalSize
            
            this._sourceCroppingPositions = [[
                typeof pos1[0]=="string" ? (+pos1[0].replace("%","").trim()/100)*naturalSize[0] : pos1[0]==null ? 0 : pos1[0],
                typeof pos1[1]=="string" ? (+pos1[1].replace("%","").trim()/100)*naturalSize[1] : pos1[1]==null ? 0 : pos1[1]
            ], [
                typeof pos2[0]=="string" ? (+pos2[0].replace("%","").trim()/100)*naturalSize[0] : pos2[0]==null ? naturalSize[0] : pos2[0],
                typeof pos2[1]=="string" ? (+pos2[1].replace("%","").trim()/100)*naturalSize[1] : pos2[1]==null ? naturalSize[1] : pos2[1]
            ]]
        } else this._sourceCroppingPositions = null
    }
}