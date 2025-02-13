// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// DOC TODO
class ImageDisplay extends _BaseObj {
    static SOURCE_TYPES = {IMAGE:HTMLImageElement, SVG:SVGImageElement, BITMAP_PROMISE:Promise, BITMAP:ImageBitmap, VIDEO:HTMLVideoElement, VIDEO_FRAME:VideoFrame, CANVAS:HTMLCanvasElement, OFFSCREEN_CANVAS:OffscreenCanvas}

    /**
        TODO:
        
        documentation

        initialize / draw, overrides etc
        scale / rotate
        duplicated
        color implementation

     */

    constructor(source, pos, size, setupCB, anchorPos, alwaysActive, color) {
        super(pos, color, setupCB, anchorPos, alwaysActive)
        this._source = source??""
        this._size = size
        this._data = null
    }

    static getImage(path) {
        const image = new Image()
        image.src = path
        return image
    }

    #adjustSize(width, height) {
        if (!this._size) this._size = [width, height]
        if (!CDEUtils.isDefined(this._size[0])) this._size = [width, this._size[1]]
        if (!CDEUtils.isDefined(this._size[1])) this._size = [this._size[0], height]
    }
    
    initialize() {
        const types = ImageDisplay.SOURCE_TYPES, dataSrc = this._source
        if (typeof dataSrc==="string") {// todo optimize/refractor
            const image = ImageDisplay.getImage(dataSrc)
            image.onload=()=>{
                this._data = image
                this.#adjustSize(image.width, image.height)
                this._initialized = true
            }
        } else if (dataSrc instanceof types.IMAGE || dataSrc instanceof types.SVG) {
            if (dataSrc.complete && dataSrc.src) {
                this._data = dataSrc
                this.#adjustSize(dataSrc.width, dataSrc.height)
                this._initialized = true
            } else dataSrc.onload=()=>{
                this._data = dataSrc
                this.#adjustSize(dataSrc.width, dataSrc.height)
                this._initialized = true
            }
        } else if (dataSrc instanceof types.CANVAS) {
            this._data = dataSrc
            this.#adjustSize(dataSrc.width, dataSrc.height)
            this._initialized = true
        } else if (dataSrc instanceof types.OFFSCREEN_CANVAS) {
            this._data = dataSrc.transferToImageBitmap()
            this.#adjustSize(dataSrc.width, dataSrc.height)
            this._initialized = true
        } else if (dataSrc instanceof types.BITMAP) {
            this._data = dataSrc
            this.#adjustSize(dataSrc.width, dataSrc.height)
            this._initialized = true
        } else if (dataSrc instanceof types.BITMAP_PROMISE) {
            dataSrc.then(bitmap=>{
                this._data = bitmap
                this.#adjustSize(bitmap.width, bitmap.height)
                this._initialized = true
            })
        } else if (dataSrc instanceof types.VIDEO) {
            // todo tocheck
            this._data = dataSrc
            this.#adjustSize(dataSrc.videoWidth, dataSrc.videoHeight)
            this._initialized = true
        } else if (dataSrc instanceof types.VIDEO_FRAME) {
            //todo tocheck
            this._data = dataSrc
            this.#adjustSize(dataSrc.videoWidth, dataSrc.videoHeight)
            this._initialized = true
        }

        super.initialize()
    }

    draw(render, time, deltaTime) {
        if (this.initialized) {
            render.drawImage(this._data, this._pos, this._size)
        }

        super.draw(time, deltaTime)
    }

    // returns a separate copy of this textDisplay instance
    duplicate(text=this._text, pos=this.pos_, color=this._color.duplicate(), textStyles=this._textStyles, drawMethod=this._drawMethod, maxWidth=this._maxWidth, setupCB=this._setupCB, anchorPos=this._anchorPos, alwaysActive=this._alwaysActive) {
        //return this.initialized ? new TextDisplay(text, pos, color, textStyles, drawMethod, maxWidth, setupCB, anchorPos, alwaysActive) : null
    }

}