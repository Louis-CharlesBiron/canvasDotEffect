// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Allows the creation of custom gradients
class Pattern extends _DynamicColor {
    static #ID_GIVER = 0
    static #CROPPING_CTX = new OffscreenCanvas(1,1).getContext("2d")
    static #MATRIX = new DOMMatrixReadOnly()
    static PLACEHOLDER_COLOR = "transparent"
    static REPETITION_MODES = {REPEAT:"repeat", REPEAT_X:"repeat-x", REPEAT_Y:"repeat-y", NO_REPEAT:"no-repeat"}
    static DEFAULT_REPETITION_MODE = Pattern.REPETITION_MODES.NO_REPEAT// todo check
    static DEFAULT_FRAME_RATE = 1/30
    static LOADED_PATTERN_SOURCES = []
    static SERIALIZATION_SEPARATOR = "!"

    /* 
        - test auto positions
        - getter / setter, with auto update
        - see for auto dplicate on assignment

        test with other sources

        readme, documentation
    */

    // doc todo
    #lastUpdateTime = null
    constructor(render, source, positions, sourceCroppingPositions, rotation, keepAspectRatio, repeatMode) {
        super(
            positions, // [ [x1, y1], [x2, y2] ] | Obj
            rotation   // rotation of the pattern
        )
        this._id = Pattern.#ID_GIVER++
        this._render = render                      // canvas Render instance
        this._source = null
        this._sourceCroppingPositions = sourceCroppingPositions??null // source cropping positions delimiting a rectangle, [ [startX, startY], [endX, endY] ] (Defaults to no cropping)
        this._keepAspectRatio = keepAspectRatio??false
        this._repeatMode = repeatMode??Pattern.DEFAULT_REPETITION_MODE
        this._frameRate = Pattern.DEFAULT_FRAME_RATE

        Pattern.LOADED_PATTERN_SOURCES[this._id] = this

        ImageDisplay.initializeDataSource(source, (data)=>{
            this._source = data
            this.update(true)
        })
    }

    /**
     * Given a shape, returns automatic positions values for linear or radial gradients
     * @param {Shape} obj: Instance of Shape or inheriting shape TODO DOC
     * @param {boolean} disableOptimization: if false, recalculates positions only when a dot changes pos (set to true only for manual usage of this function) 
     * @returns the new calculated positions or the current value of this._positions if the parameter 'shape' isn't an instance of Shape
     */
    getAutomaticPositions(obj=this._initPositions, disableOptimization=false) {
        if (obj instanceof Shape) {
            if (this.#hasShapeChanged(obj) || disableOptimization) {
                const rangeX = CDEUtils.getMinMax(obj.dots, "x"), rangeY = CDEUtils.getMinMax(obj.dots, "y"), radius = obj.radius
                return [[rangeX[0]-radius, rangeY[0]-radius], [rangeX[1]+radius, rangeY[1]+radius]]
            } else return this._positions
        } else if (obj instanceof Dot) {
            if (this.#hasDotChanged(obj) || disableOptimization) {
                const x = obj.x, y = obj.y
                return [[obj.left-x, obj.top-y], [obj.right-x, obj.bottom-y]]
            } return this._positions
        } else if (obj instanceof TextDisplay) {
            if (this.#hasTextDisplayChanged(obj) || disableOptimization) {
                const [width, height] = obj.trueSize, [cx, cy] = obj.pos, w2 = width/2, h2 = height/2
                return [[cx-w2, cy-h2], [cx+w2, cy+h2]]
            } return this._positions
        } else return this._positions
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

    // doc todo
    update(force) {
        const source = this._source
        if (source) {
            const ctx = this._render.ctx, isCanvas = source instanceof HTMLCanvasElement, time = source.currentTime??(isCanvas?performance.now()/1000:null)
        
            if (time != null && !force) {
                if (this.#lastUpdateTime > time) this.#lastUpdateTime = time
                if (time-this.#lastUpdateTime >= this._frameRate) this.#lastUpdateTime = time
                else return;
            }
            
            this._positions = this.getAutomaticPositions()
            if (isCanvas) this._render._bactchedStandalones.push(()=>this._value = this.#getpattern(ctx, source))
            else this._value = this.#getpattern(ctx, source)
        }
    }

    // doc todo
    #getpattern(ctx, source) {
        if (source) {
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
                const pos1 = positions[0], pos2 = positions[1], width = pos2[0]-pos1[0], height = pos2[1]-pos1[1], fdx = width/sizeX, fdy = height/sizeY
                if (this._keepAspectRatio) {
                    // TODO possible optimization (if this._rotation) ...
                    const isXbigger = fdx > fdy, fd = isXbigger ? fdx : fdy, cx = (sizeX*fd)/2, cy = (sizeY*fd)/2
                    pattern.setTransform(matrix.translate((pos1[0]-(isXbigger?0:cx-(width/2)))+cx, (pos1[1]-(isXbigger?(cy-(height/2)):0))+cy).rotate(this._rotation).translate(-cx, -cy).scale(fd, fd))
                } else {
                    const cx = (sizeX*fdx)/2, cy = (sizeY*fdy)/2
                    pattern.setTransform(matrix.translate(pos1[0]+cx, pos1[1]+cy).rotate(this._rotation).translate(-cx, -cy).scale(fdx, fdy))
                }
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
    duplicate(render=this._render, source=this._source, positions=this._positions, sourceCroppingPositions=this._sourceCroppingPositions, rotation=this._rotation, keepAspectRatio=this._keepAspectRatio, repeatMode=this._repeatMode) {
        return new Pattern(render, source, CDEUtils.unlinkArr22(positions), CDEUtils.unlinkArr22(sourceCroppingPositions), rotation, keepAspectRatio, repeatMode)
    }

    // todo order that in a good way, and add missings
    get id() {return this._id}
	get render() {return this._render}
	get source() {return this._source}
	get initPositions() {return this._initPositions}
	get positions() {return this._positions}
	get repeatMode() {return this._repeatMode}
    get naturalSize() {return ImageDisplay.getNaturalSize(this._source)}
    get frameRate() {return 1/(this._frameRate)}
	get sourceCroppingPositions() {return this._sourceCroppingPositions}
    get value() {
        const data = this._source
        if (data instanceof HTMLVideoElement && (!data.src && !data.srcObject?.active)) return Pattern.PLACEHOLDER_COLOR
        if (data instanceof HTMLVideoElement || data instanceof HTMLCanvasElement) this.update()
        return this._value??Pattern.PLACEHOLDER_COLOR
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
            this.update(true)
        })
    }
	set repeatMode(_repeatMode) {
        this._repeatMode = _repeatMode
        this.update(true)
    }
    set frameRate(frameRate) {
        this._frameRate = 1/Math.max(frameRate, 0)
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
}