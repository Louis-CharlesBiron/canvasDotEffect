// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

const CDE_CANVAS_TIMEOUT_FUNCTION = window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame||function(fn){window.setTimeout(()=>fn(performance.now()),1000/60)}

class Canvas {
    static DOMParser = new DOMParser()
    static CANVAS_ID_GIVER = 0
    static ELEMENT_ID_GIVER = 0
    static DEFAULT_MAX_DELTATIME_MS = 130
    static DEFAULT_MAX_DELTATIME = Canvas.DEFAULT_MAX_DELTATIME_MS/1000
    static DEFAULT_MAXDELAY_MULTIPLIER = 0.44
    static DEFAULT_CANVAS_ACTIVE_AREA_PADDING = 25
    static DEFAULT_CVSDE_ATTR = "_CVSDE"
    static DEFAULT_CVSFRAMEDE_ATTR = "_CVSDE_F"
    static DEFAULT_CUSTOM_SVG_FILTER_ID_PREFIX = "CDE_FE_"
    static DEFAULT_CUSTOM_SVG_FILTER_CONTAINER_ID = Canvas.DEFAULT_CUSTOM_SVG_FILTER_ID_PREFIX+"CONTAINER"
    static CURSOR_STYLES = {CUSTOM:(filepath, offsetPos=[0,0], fallbackCursorStyle=Canvas.CURSOR_STYLES.AUTO)=>`url("${filepath}") ${offsetPos.join(" ")}, ${fallbackCursorStyle}`, AUTO:"auto", POINTER:"pointer", DEFAULT:"default", CROSSHAIR:"crosshair", MOVE:"move", TEXT:"text", WAIT:"wait", HELP:"help", NONE:"none", GRAB:"grab", GRABBING:"grabbing", ALL_SCROLL:"all-scroll", COL_RESIZE:"col-resize", ROW_RESIZE:"row-resize", N_RESIZE:"n-resize", E_RESIZE:"e-resize", S_RESIZE:"s-resize", W_RESIZE:"w-resize", NE_RESIZE:"ne-resize", NW_RESIZE:"nw-resize", SE_RESIZE:"se-resize", SW_RESIZE:"sw-resize", ZOOM_IN:"zoom-in", ZOOM_OUT:"zoom-out", NO_DROP:"no-drop", COPY:"copy", NOT_ALLOWED:"not-allowed", VERTICAL_TEXT:"vertical-text", CELL:"cell", CONTEXT_MENU:"context-menu", EXT_RESIZE:"ext-resize", DEFAULT_ARROW:"default", UNSET:"unset"}
    static LOADED_SVG_FILTERS = {}
    static DEFAULT_CTX_SETTINGS = {"imageSmoothingEnabled":false, "font":TextStyles.DEFAULT_FONT, "letterSpacing":TextStyles.DEFAULT_LETTER_SPACING, "wordSpacing":TextStyles.DEFAULT_WORD_SPACING, "fontVariantCaps":TextStyles.DEFAULT_FONT_VARIANT_CAPS, "direction":TextStyles.DEFAULT_DIRECTION, "fontSretch":TextStyles.DEFAULT_FONT_STRETCH, "fontKerning":TextStyles.DEFAULT_FONT_KERNING, "textAlign":TextStyles.DEFAULT_TEXT_ALIGN, "textBaseline":TextStyles.DEFAULT_TEXT_BASELINE, "textRendering":TextStyles.DEFAULT_TEXT_RENDERING, "lineDashOffset":RenderStyles.DEFAULT_DASH_OFFSET, "lineJoin":RenderStyles.DEFAULT_JOIN, "lineCap":RenderStyles.DEFAULT_CAP, "lineWidth":RenderStyles.DEFAULT_WIDTH, "fillStyle":Color.DEFAULT_COLOR, "stokeStyle":Color.DEFAULT_COLOR}
    static DEFAULT_CANVAS_WIDTH = 800
    static DEFAULT_CANVAS_HEIGHT = 800
    static DEFAULT_CANVAS_STYLES = {position:"absolute",top:"0",left:"0",width:"100%",height:"100%","background-color":"transparent",border:"none",outline:"none","pointer-events":"none !important","z-index":0,padding:"0 !important",margin:"0","-webkit-transform":"translate3d(0, 0, 0)","-moz-transform": "translate3d(0, 0, 0)","-ms-transform": "translate3d(0, 0, 0)","transform": "translate3d(0, 0, 0)","touch-action":"none","-webkit-user-select":"none","user-select":"none"}
    static STATIC_MODE = 0
    static STATIC = "static"
    static STATES = {STOPPED:0, LOOPING:1, REQUESTED_STOP:2}
    static #ON_LOAD_CALLBACKS = []
    static #ON_FIRST_INTERACT_CALLBACKS = []
    static DEFAULT_MOUSE_MOVE_THROTTLE_DELAY = 10
    static ACTIVATION_MARGIN_DISABLED = 0
    static MOBILE_SCROLLING_STATES = {DISABLED:0, IF_CANVAS_STOPPED:1, ALWAYS:2}
    static #DOM_CANVAS_LINKS = new Map()
    static #DOM_CANVAS_INTERSECTION_OBSERVER = new IntersectionObserver((entries)=>{
        const e_ll = entries.length
        for (let i=0;i<e_ll;i++) {
            const entry = entries[i], CVS = Canvas.getFromHTMLCanvas(entry.target)
            if (CDEUtils.isFunction(CVS._onIntersectionChangeCB)) CVS._onIntersectionChangeCB(entry.intersectionRatio > 0, CVS, entry)
        }
    })

    #lastFrame = 0           // default last frame time
    #lastLimitedFrame = 0    // last frame time for limited fps
    #fixedTimeStampOffset = 0// fixed requestanimationframe timestamp in ms
    #rawTimeStamp = null     // the raw requestanimationframe timestamp in ms
    #maxTime = null          // max time between frames
    #timeStamp = null        // requestanimationframe timestamp in ms
    #cachedEls = []          // cached canvas elements to draw
    #cachedEls_ll = null     // cached canvas elements count/length
    #cachedSize = null       // cached canvas size
    #lastScrollValues = [window.scrollX, window.screenY] // last window scroll x/y values
    #mouseMoveCB = null      // the custom mouseMoveCB. Used for mobile adjustments
    #visibilityChangeLastState = [] // stores the cvs state before document visibility change and canvas viewport visibility change
    #mobileScrollingState = Canvas.MOBILE_SCROLLING_STATES.IF_CANVAS_STOPPED // Whether to prevent the default action taken by ontouchstart

    /**
     * Represents a html canvas element
     * @param {HTMLCanvasElement | OffscreenCanvas} cvs: the html canvas element or an OffscreenCanvas instance to link to
     * @param {Function?} loopingCB: a function called along with the loop() function. (deltatime)=>{...}
     * @param {Number?} fpsLimit: the maximal frames per second cap. Defaults to V-Sync
     * @param {HTMLElement?} cvsFrame: if defined and if "cvs" is an HTML canvas, sets this element as the parent of the canvas element
     * @param {Object?} settings: an object containing the canvas settings
     * @param {Boolean} willReadFrequently: whether the getImageData optimizations are enabled
     */
    constructor(cvs, loopingCB, fpsLimit=null, cvsFrame, settings=Canvas.DEFAULT_CTX_SETTINGS, willReadFrequently=false) {
        this._id = Canvas.CANVAS_ID_GIVER++                               // Canvas instance id
        if (!cvs) throw new Error("The cvs (canvas) parameter is undefined")
        this._cvs = cvs                                                   // html canvas element or an OffscreenCanvas instance
        if (!this.isOffscreenCanvas) {
            this._frame = cvsFrame??cvs?.parentElement                    // html parent of canvas element
            this._cvs.setAttribute(Canvas.DEFAULT_CVSDE_ATTR, true)       // set styles selector for canvas
            this._frame.setAttribute(Canvas.DEFAULT_CVSFRAMEDE_ATTR, true)// set styles selector for parent
            this.onVisibilityChangeCB = null                              // callback with the actions to be taken on document visibility change (isVisible, CVS, e)=>
            this._onResizeCB = null                                       // callback with the actions to be taken on document resize (newCanvasSize, CVS, e)=>
            this._onScrollCB = null                                       // callback with the actions to be taken on document scroll ([pageScrollX, pageScrollY], CVS, e)=>
            this.onIntersectionChangeCB = null                            // callback with the actions to be taken on intersection change / canvas visibility change. (isVisible, CVS, e)=>
            Canvas.#DOM_CANVAS_INTERSECTION_OBSERVER.observe(this._cvs)
            Canvas.#DOM_CANVAS_LINKS.set(this._cvs, this)
        }
        this._ctx = this._cvs.getContext("2d", {willReadFrequently})  // canvas context
        this._settings = this.updateSettings(settings||Canvas.DEFAULT_CTX_SETTINGS)// set context settings
        this._els = {refs:[], defs:[]}                                // arrs of objects to .draw() | refs (source): [Object that contains drawable obj], defs: [regular drawable objects]
        this._state = 0                                               // canvas drawing loop state. 0:off, 1:on, 2:awaiting stop
        this._loopingCB = loopingCB                                   // custom callback called along with the loop() function
        this.fpsLimit = fpsLimit                                      // the max frames per second
        this._speedModifier = 1                                       // animation/drawing speed multiplier
        this.#maxTime = this.#getMaxTime(fpsLimit)                    // max time between frames
        this._deltaTime = null                                        // useable delta time in seconds
        this._fixedTimeStamp = null                                   // fixed timestamp in ms
        this._windowListeners = this.#initWindowListeners()           // [onresize, onvisibilitychange, onscroll, onload]
        this._viewPos = [0,0]                                         // context view offset
        if (!this.isOffscreenCanvas) {
            const frameCBR = this._frame?.getBoundingClientRect()??{width:Canvas.DEFAULT_CANVAS_WIDTH, height:Canvas.DEFAULT_CANVAS_HEIGHT}
            this.setSize(frameCBR.width, frameCBR.height)              // init size
            this.#initStyles()                                         // init styles
            this._offset = this.updateOffset()                         // cvs page offset
        } else this.#cachedSize = [this._cvs.width, this._cvs.height]
        this._typingDevice = new TypingDevice()                        // keyboard info
        this._mouse = new Mouse(this._ctx)                             // mouse info
        this._render = new Render(this._ctx)                           // render instance
        this._anims = []                                               // current animations
        this._mouseMoveThrottlingDelay = Canvas.DEFAULT_MOUSE_MOVE_THROTTLE_DELAY// mouse move throttling delay
    }

    // sets css styles on the canvas and the parent
    #initStyles() {
        const style = document.createElement("style")
        style.appendChild(document.createTextNode(`[${Canvas.DEFAULT_CVSFRAMEDE_ATTR}]{position:relative !important;outline: none;}canvas[${Canvas.DEFAULT_CVSDE_ATTR}]{${Object.entries(Canvas.DEFAULT_CANVAS_STYLES).reduce((a,b)=>a+=`${b[0]}:${b[1]};`,"")}}`))
        this._cvs.appendChild(style)
        this._frame.setAttribute("tabindex", 0)
        this._cvs.setAttribute("draggable", "false")
    }

    // sets resize and visibility change listeners on the window
    #initWindowListeners() {
        const onresize=e=>{
            const render = this._render, ctx = this._ctx, [lineWidth, lineDash, lineDashOffset, lineJoin, lineCap] = render.currentCtxStyles, [font, letterSpacing, wordSpacing, fontVariantCaps, direction, fontStretch, fontKerning, textAlign, textBaseline, textRendering] = render.currentCtxTextStyles, [color, filter, compositeOperation, alpha] = render.currentCtxVisuals
            this.setSize()
            ctx.strokeStyle = ctx.fillStyle = Color.getColorValue(color)
            render.currentCtxStyles[0] = ctx.lineWidth
            if (typeof lineDash=="string") render.currentCtxStyles[1] = lineDash.split(",")
            render.currentCtxStyles[2] = ctx.lineDashOffset
            render.currentCtxStyles[3] = ctx.lineJoin
            render.currentCtxStyles[4] = ctx.lineCap
            RenderStyles.apply(render, null, filter, compositeOperation, alpha, lineWidth, typeof lineDash=="string"?lineDash.split(","):lineDash, lineDashOffset, lineJoin, lineCap)
            TextStyles.apply(ctx, font, letterSpacing, wordSpacing, fontVariantCaps, direction, fontStretch, fontKerning, textAlign, textBaseline, textRendering)
            this.moveViewAt(this._viewPos)
            if (this.hasBeenStarted && (this._fpsLimit >= 25 || this._state==Canvas.STATES.STOPPED)) this.drawSingleFrame()
            if (CDEUtils.isFunction(this._onResizeCB)) this._onResizeCB(this.size, this, e)
        },
        onvisibilitychange=e=>this._onVisibilityChangeCB(!document.hidden, this, e),
        onscroll=e=>{
          const scrollX = window.scrollX, scrollY = window.scrollY, mouseX =  this._mouse.x, mouseY = this._mouse.y
          this.updateOffset()
          if (mouseX != null && mouseY != null) {
            this._mouse.updatePos(this._mouse.x+(scrollX-this.#lastScrollValues[0]), this._mouse.y+(scrollY-this.#lastScrollValues[1]), [0,0])
            this.#mouseMovements()
          }
          this.#lastScrollValues[0] = scrollX
          this.#lastScrollValues[1] = scrollY
          if (CDEUtils.isFunction(this._onScrollCB)) this._onScrollCB([scrollX, scrollY], this, e)
        },
        onLoad=e=>{
          const callbacks = Canvas.#ON_LOAD_CALLBACKS, cb_ll = callbacks?.length
          if (cb_ll) for (let i=0;i<cb_ll;i++) callbacks[i](e, this)
          Canvas.#ON_LOAD_CALLBACKS = null
        }

        if (!this.isOffscreenCanvas) {
            window.addEventListener("resize", onresize)
            window.addEventListener("visibilitychange", onvisibilitychange)
            window.addEventListener("scroll", onscroll)
        }
        window.addEventListener("load", onLoad)
        return this.isOffscreenCanvas ? {removeOnloadListener:()=>window.removeEventListener("load", onLoad)} : {
            removeOnreziseListener:()=>window.removeEventListener("resize", onresize),
            removeOnvisibilitychangeListener:()=>window.removeEventListener("visibilitychange", onvisibilitychange),
            removeOnscrollListener:()=>window.removeEventListener("scroll", onscroll),
            removeOnloadListener:()=>window.removeEventListener("load", onLoad)
        }
    }

    /**
     * Returns the Canvas instance linked to the provided HTML canvas element
     * @param {HTMLCanvasElement} cvs: an HTML canvas element
     * @returns the Canvas instance linked, if any
     */
    static getFromHTMLCanvas(cvs) {
        return Canvas.#DOM_CANVAS_LINKS.get(cvs)
    }

    /**
     * Modifies the canvas cursor appearance
     * @param {Canvas.CURSOR_STYLES} cursorStyle: the cursor style to use
     */
    setCursorStyle(cursorStyle=Canvas.CURSOR_STYLES.DEFAULT) {
        const frame = this._frame
        if (frame.style.cursor !== cursorStyle) frame.style.cursor = cursorStyle
    }

    /**
     * Adds a callback to be called once the document is loaded
     * @param {Function} callback: the callback to call 
     */
    static addOnLoadCallback(callback) {
        if (CDEUtils.isFunction(callback) && Canvas.#ON_LOAD_CALLBACKS) Canvas.#ON_LOAD_CALLBACKS.push(callback)
    }

    /**
     * Adds a callback to be called once the document has been interacted with for the first time
     * @param {Function} callback: the callback to call 
     */
    static addOnFirstInteractCallback(callback) {
        if (CDEUtils.isFunction(callback) && Canvas.#ON_FIRST_INTERACT_CALLBACKS) Canvas.#ON_FIRST_INTERACT_CALLBACKS.push(callback)
    }

    /**
     * Loads a custom svg filter to use
     * @param {String} svgContent: string containing the svg filter, e.g: `<svg><filter id="someId"> ... the filter contents </svg>`
     * @param {String?} id: the id of the svg filter. (Takes the one of the svgContent <filter> element if not defined) 
     * @returns the usable id
     */
    static loadSVGFilter(svgContent, id) {
        let container = document.getElementById(Canvas.DEFAULT_CUSTOM_SVG_FILTER_CONTAINER_ID), svg = new DOMParser().parseFromString(svgContent, "text/html").body.firstChild, filter = svg.querySelector("filter"), parent = document.createElement("div")
        if (!id) id = filter.id
        else filter.id = id
        parent.id = Canvas.DEFAULT_CUSTOM_SVG_FILTER_ID_PREFIX+id
        parent.appendChild(svg)

        if (!container) {
            container = document.createElement("div")
            container.id = Canvas.DEFAULT_CUSTOM_SVG_FILTER_CONTAINER_ID
            document.head.appendChild(container)
        }
        container.appendChild(parent)
        Canvas.LOADED_SVG_FILTERS[id] = [...filter.children]
        return id
    }

    /**
     * Returns the filter elements of a loaded svg filter
     * @param {String} id: the identifier of the svg filter
     */
    static getSVGFilter(id) {
        return Canvas.LOADED_SVG_FILTERS[id]
    }

    /**
     * Deletes a loaded svg filter
     * @param {String} id: the identifier of the svg filter
     */
    static removeSVGFilter(id) {
        id = Canvas.DEFAULT_CUSTOM_SVG_FILTER_ID_PREFIX+id
        document.getElementById(id).remove()
        delete Canvas.LOADED_SVG_FILTERS[id]
    }

    // updates the calculated canvas offset in the page
    updateOffset() {
        const {width, height, x, y} = this._cvs.getBoundingClientRect()
        return this._offset = [Math.round((x+width)-this.width)+this._viewPos[0], Math.round((y+height)-this.height)+this._viewPos[1]]
    }

    // main loop, runs every frame
    #loop(time, wasRestarted) {
        this.#rawTimeStamp = time
        const frameTime = (time-this.#lastFrame)*this._speedModifier, fpsLimit = this._fpsLimit, state = this._state

        if (state != 2) {
            if (fpsLimit) {
                const timeDiff = time-this.#lastLimitedFrame
                if (timeDiff >= fpsLimit) {
                    this._fixedTimeStamp = ((this.#timeStamp += frameTime)-this.#fixedTimeStampOffset)
                    if (!wasRestarted) this.#loopCore(time)
                    this.#lastFrame = time
                    this.#lastLimitedFrame = time-(timeDiff%fpsLimit)
                }
            } else {
                this._fixedTimeStamp = ((this.#timeStamp += frameTime)-this.#fixedTimeStampOffset)
                if (!wasRestarted) this.#loopCore(time)
                this.#lastFrame = time
            }
        }

        if (this._state==1) CDE_CANVAS_TIMEOUT_FUNCTION(this.#loop.bind(this))
        else this._state = 0
    }

    /**
     * Plays a single frame of the drawing loop.
     * @param {Number?} customTime: if provided, forces a time jump. Else doesn't affect time
     */
    drawSingleFrame(customTime=null) {
        let mouse = this._mouse, loopingCB = this._loopingCB, hasCustomTime = customTime!=null, deltaTime = hasCustomTime ? this.#calcDeltaTime(customTime) : this._deltaTime
        if (!mouse._moveListenersOptimizationEnabled) {
            mouse.checkListeners(Mouse.LISTENER_TYPES.ENTER)
            mouse.checkListeners(Mouse.LISTENER_TYPES.LEAVE)
        }

        this.clear()
        this.draw()
        this._render.drawBatched()
        if (loopingCB) this._loopingCB(deltaTime)

        if (hasCustomTime) {
            const anims = this._anims, a_ll = anims.length
            this.#timeStamp = this._fixedTimeStamp = customTime
            if (a_ll) for (let i=0;i<a_ll;i++) anims[i].getFrame(this.#timeStamp, deltaTime)
        }
    }

    // core actions of the main loop
    #loopCore(time) {
        const deltaTime = this.#calcDeltaTime(time), mouse = this._mouse, loopingCB = this._loopingCB

        mouse.calcSpeed(deltaTime)
        if (!mouse._moveListenersOptimizationEnabled) {
            mouse.checkListeners(Mouse.LISTENER_TYPES.ENTER)
            mouse.checkListeners(Mouse.LISTENER_TYPES.LEAVE)
        }

        this.clear()
        this.draw()
        this._render.drawBatched()
        if (loopingCB) this._loopingCB(deltaTime)

        const anims = this._anims, a_ll = anims.length
        if (a_ll) for (let i=0;i<a_ll;i++) anims[i].getFrame(this.timeStamp, deltaTime)
    }

    /**
     * Starts the canvas drawing loop
     */
    startLoop() {
        if (this._state!=1) {
            if (this._state==2) return this._state = 1
            this._state = 1
            if (this.#lastFrame) this.#fixedTimeStampOffset += (performance.now()-this.#lastFrame)*this._speedModifier
            this.#loop(this.#timeStamp||0, true)
        }
    }
    /**
     * Starts the canvas drawing loop
     */
    start() {
        this.startLoop()
    }

    /**
     * Stops the canvas drawing loop
     */
    stopLoop() {
        if (this._state) this._state = 2
    }
    /**
     * Stops the canvas drawing loop
     */
    stop() {
        this.stopLoop()
    }

    // calculates and sets the deltaTime
    #calcDeltaTime(time=0) {
        const deltaTime = (time-this.#lastFrame)/1000, maxTime = this.#maxTime/1000
        return this._deltaTime = deltaTime>maxTime ? maxTime : deltaTime
    }

    // calculates the max time between frames according to the fpsLimit
    #getMaxTime(fpsLimit) {
        return fpsLimit ? fpsLimit < 7 ? (((14-fpsLimit)*1.05)**3)*Canvas.DEFAULT_MAXDELAY_MULTIPLIER : Math.max((360-fpsLimit)*Canvas.DEFAULT_MAXDELAY_MULTIPLIER, 50) : Canvas.DEFAULT_MAX_DELTATIME_MS
    }

    // updates cached canvas elements
    updateCachedAllEls() {
        const cachedEls = []
        cachedEls.push(...this.refs)
        this._els.refs.forEach(source=>cachedEls.push(...source.asSource))
        cachedEls.push(...this._els.defs)
        this.#cachedEls = cachedEls
        this.#cachedEls_ll = cachedEls.length
    }

    // calls the draw function on all canvas objects
    draw() {
        const els = this.#cachedEls, els_ll = this.#cachedEls_ll, render = this._render, deltaTime = this._deltaTime*this._speedModifier, timeStamp = this.timeStamp
        for (let i=0;i<els_ll;i++) {
            const el = els[i], margin = el.activationMargin
            if (!margin || (!(margin===true) && el.initialized && !this.isWithin(el.pos, margin)) || !el.draw) continue
            el.draw(render, timeStamp, deltaTime)
        }
    }

    /**
     * Clears the provided area of the canvas
     * @param {Number?} x: the x value of the top-left corner
     * @param {Number?} y: the y value of the top-left corner
     * @param {Number?} x2: the x value of the bottom-right corner
     * @param {Number?} y2: the y value of the bottom-right corner
     */
    clear(x=0, y=0, x2=this.width, y2=this.height) {
        if (this._viewPos[0] || this._viewPos[1]) {
            this.save()
            this.resetTransformations()
            this._ctx.clearRect(x, y, x2, y2)
            this.restore()
        } else this._ctx.clearRect(x, y, x2, y2)
    }

    /**
     * Initializes the canvas as static
     */
    initializeStatic() {
        this.fpsLimit = 0
        this.draw()
        this.drawStatic()
        
        const imageDisplays = this.getObjs(ImageDisplay), id_ll = imageDisplays.length
        for (let i=0;i<id_ll;i++) {
            const imageDisplay = imageDisplays[i]
            if (imageDisplay.setupCB === null) imageDisplay.setupCB = el=>el.draw(this.render, this.timeStamp*this._speedModifier, this._deltaTime)
            else if (CDEUtils.isFunction(imageDisplay.setupCB)) {
                const oldCB = imageDisplay.setupCB
                imageDisplay.setupCB = (el, parent)=>{
                    el.draw(this.render, this.timeStamp*this._speedModifier, this._deltaTime)
                    oldCB(el, parent)
                }
            }
        }
    }

    /**
     * Draws a single frame (use with static canvas)
     */
    drawStatic() {
        this.draw()
        this._render.drawBatched()
        if (CDEUtils.isFunction(this._loopingCB)) this._loopingCB()
    }

    /**
     * Clears the canvas and draws a single frame (use with static canvas)
     */
    cleanDrawStatic() {
        this.clear()
        this.drawStatic()
    }

    /**
     * Resets every fragile references
     */
    resetReferences() {
        this.refs.filter(ref=>ref.fragile).forEach(r=>r.reset())
    }

    /**
     * Discards all current context transformations
     */
    resetTransformations() {
        this.ctx.setTransform(1,0,0,1,0,0)
    }

    /**
     * Moves the camera view to a specific x/y value
     * @param {[x,y]} pos: the pos to move the camera view to
     */
    moveViewAt(pos) {
        let [x, y] = pos
        this.resetTransformations()
        this._ctx.translate(x=(CDEUtils.isDefined(x)&&isFinite(x))?x:0,y=(CDEUtils.isDefined(y)&&isFinite(y))?y:0)
        this._viewPos[0] = x
        this._viewPos[1] = y
        
        this.updateOffset()
        if (this._mouse.x != null && this._mouse.y != null) {
            this._mouse.updatePos(this._mouse.rawX, this._mouse.rawY, this._offset)
            this.#mouseMovements()
        }
    }

    /**
     * Moves the camera view by specified x/y values
     * @param {[x,y]} pos: the x/y values to move the camera view by
     */
    moveViewBy(pos) {
        let [x, y] = pos
        this._ctx.translate(x=(CDEUtils.isDefined(x)&&isFinite(x))?x:0,y=(CDEUtils.isDefined(y)&&isFinite(y))?y:0)
        this._viewPos[0] += x
        this._viewPos[1] += y

        this.updateOffset()
        if (this._mouse.x != null && this._mouse.y != null) {
            this._mouse.updatePos(this._mouse.rawX, this._mouse.rawY, this._offset)
            this.#mouseMovements()
        }
    }

    /**
     * Smoothly moves the camera view to the provided pos, in set time
     * @param {[x,y]} pos: the pos to move the camera view to
     * @param {Number?} time: the move time in miliseconds
     * @param {Function?} easing: the easing function used. (x)=>{return y} 
     * @param {[x,y]} initPos: the pos to start the movement. Defaults to the current camera view pos 
     * @returns the created Anim instance
     */
    moveViewTo(pos, time=null, easing=null, initPos=null) {
        time??=1000
        easing??=Anim.easeInOutQuad
        initPos??=this._viewPos

        let [fx, fy] = pos, [ix, iy] = initPos, lx = ix, ly = iy
        if (!CDEUtils.isDefined(fx)) fx = ix??0
        if (!CDEUtils.isDefined(fy)) fy = iy??0

        const fdx = fx-ix, fdy = fy-iy
        if (fdx || fdy) {
            return this.playAnim(new Anim((prog)=>{
                const nx = ix+fdx*prog, ny = iy+fdy*prog, dx = nx-lx, dy = ny-ly
                this._ctx.translate(dx,dy)

                this._viewPos[0] += dx
                this._viewPos[1] += dy
                lx = nx
                ly = ny

                this.updateOffset()
                this._mouse.updatePos(this._mouse.rawX, this._mouse.rawY, this._offset)
                this.#mouseMovements()
            }, time, easing))
        }
    }

    /**
     * Adds an animation to play
     * @param {Anim} anim: the Anim instance containing the animation
     * @returns the provided Anim instance
     */
    playAnim(anim) {
        const initEndCB = anim.endCB
        anim.endCB=()=>{
            this._anims = this._anims.filter(a=>a.id!==anim.id)
            if (CDEUtils.isFunction(initEndCB)) initEndCB()
        }
        this._anims.push(anim)
        return anim
    }

    /**
     * Sets the width and height in pixels of the canvas element
     * @param {Number?} forceWidth: if defined, forces the canvas to resize to this width in pixels
     * @param {Number?} forceHeight: if defined, forces the canvas to resize to this height in pixels
     * @param {Boolean?} forceCSSupdate if true, also force the resizes on the frame using CSS
     */
    setSize(forceWidth, forceHeight, forceCSSupdate) {
        const {width, height} = this._frame.getBoundingClientRect(), w = forceWidth??width, h = forceHeight??height

        if (this._cvs.width !== w || this._cvs.width !== h) {
            this._cvs.width = w??width
            this._cvs.height = h??height
            if (forceCSSupdate) {
                this._frame.style.width = this.width+"px"
                this._frame.style.height = this.height+"px"
            }
            this.updateSettings()
            this.updateOffset()
        }

        this.#cachedSize = [this._cvs.width, this._cvs.height]
    }

    /**
     * Updates current canvas settings
     * @param {Object?} settings: an object containing the canvas settings
     */
    updateSettings(settings) {
        const st = settings||this._settings
        if (st) {
            Object.entries(st).forEach(s=>this._ctx[s[0]]=s[1])
            return this._settings=st
        } else return null
    }

    /**
     * Adds one or many objects to the canvas, either as a definition or as a reference/source
     * @param {_BaseObj | Array[_BaseObj]} objs: the object(s) to add
     * @param {Boolean?} inactive: if true, only initializes the object without adding it to the canvas
     * @returns 
     */
    add(objs, inactive=false) {
        const l = objs&&(objs.length??1)
        for (let i=0;i<l;i++) {
            const obj = objs[i]??objs
            obj._parent = this
            
            if (CDEUtils.isFunction(obj.initialize)) obj.initialize()
            if (!inactive) this._els[obj.asSource?"refs":"defs"].push(obj)

        }
        this.updateCachedAllEls()
        return objs
    }

    /**
     * Removes an object from the canvas
     * @param {Number} id: the id of the object to delete
     */
    remove(id) {
        if (id=="*") this._els = {refs:[], defs:[]}
        else {
            this._els.defs = this._els.defs.filter(el=>el.id!==id)
            this._els.refs = this._els.refs.filter(source=>source.id!==id)
        }
        this.updateCachedAllEls()
    }

    /**
     * Removes all objects added to the canvas
     */
    removeAllObjects() {
        this.remove("*")
    }

    /**
     * Get an object from the canvas
     * @param {Number} id: the id of the object to get
     * @returns the desired object
     */
    get(id) {
        const els = this.#cachedEls, e_ll = this.#cachedEls_ll
        for (let i=0;i<e_ll;i++) {
            const el = els[i]
            if (el.id==id) return el
        }
        return null
    }

    /**
     * Removes any element from the canvas by instance type
     * @param {Class} instanceType: the class definition
     * @returns any object matching the class definition
     */
    getObjs(instanceType) {
        return this.allEls.filter(x=>x instanceof instanceType)
    }

    /**
     * Saves the context parameters
     */
    save() {
        this._ctx.save()
    }
    
    /**
     * Restore the saved context parameters
     */
    restore() {
        this._ctx.restore()
    }

    // ran on first user interaction
    static #onFirstInteraction(e) {
        if (e.type!=="keydown" || (e.type=="keydown"&&e.key.length==1)) {
            const callbacks = Canvas.#ON_FIRST_INTERACT_CALLBACKS, cb_ll = callbacks?.length
            if (cb_ll) for (let i=0;i<cb_ll;i++) callbacks[i](e)
            Canvas.#ON_FIRST_INTERACT_CALLBACKS = null
        }
    }

    // called on mouse move
    #mouseMovements(callback, e) {
        // update ratioPos to mouse pos if not overwritten
        const refs = this.refs, r_ll = refs.length
        for (let i=0;i<r_ll;i++) {
            const ref = refs[i]
            if (!ref.ratioPosCB && ref.ratioPosCB !== false) ref.ratioPos = this._mouse.pos
        }
        this._mouse.checkValid()
        if (CDEUtils.isFunction(callback)) callback(this._mouse, e)
    }
    

    /**
     * Defines the onmousemove listener
     * @param {Function} callback: a function called on event. (mouse, event)=>{...}
     * @param {Boolean?} global: whether the events are dispatched only on the canvas or the whole window
     * @returns a callback which removes the listeners
     */
    setMouseMove(callback, global) {
        if (!this.isOffscreenCanvas) {
            let lastEventTime=0
            this.#mouseMoveCB = callback
            const onmousemove=e=>{
                const time = this.#rawTimeStamp
                if (time-lastEventTime > Math.abs(this._mouseMoveThrottlingDelay*this._speedModifier)) {
                    lastEventTime = time
                    this._mouse.updatePos(e.x, e.y, this._offset)
                    this._mouse.calcAngle()         
                    this.#mouseMovements(callback, e)
                }
            }, ontouchmove=e=>{
                const touches = e.touches, time = Math.abs(this.#rawTimeStamp)
                if (time-lastEventTime > Math.abs(this._mouseMoveThrottlingDelay*this._speedModifier) && touches.length==1) {
                    lastEventTime = time
                    e.x = CDEUtils.round(touches[0].clientX, 1)
                    e.y = CDEUtils.round(touches[0].clientY, 1)
                    this._mouse.updatePos(e.x, e.y, this._offset)
                    this._mouse.calcAngle()            
                    this.#mouseMovements(callback, e)
                }
            }, element = global ? document : this._frame
            element.addEventListener("mousemove", onmousemove)
            element.addEventListener("touchmove", ontouchmove)
            return ()=>{
                element.removeEventListener("mousemove", onmousemove)
                element.removeEventListener("touchmove", ontouchmove)
            }            
        } else return false
    }

    /**
     * Defines the onmouseleave listener
     * @param {Function} callback: a function called on event. (mouse, event)=>{...}
     * @param {Boolean?} global: whether the events are dispatched only on the canvas or the whole window
     * @returns a callback which removes the listeners
     */
    setMouseLeave(callback, global) {
        if (!this.isOffscreenCanvas) {
            const onmouseleave=e=>{
                this._mouse.invalidate()
                this.#mouseMovements(callback, e)
            }, element = global ? document : this._frame
            element.addEventListener("mouseleave", onmouseleave)
            return ()=>element.removeEventListener("mouseleave", onmouseleave)            
        } else return false
    }

    // called on any mouse clicks
    #mouseClicks(callback, e, preventOnFirstInteractionTrigger) {
        this._mouse.updateMouseClicks(e)
        if (CDEUtils.isFunction(callback)) callback(this._mouse, e)
        if (!preventOnFirstInteractionTrigger && Canvas.#ON_FIRST_INTERACT_CALLBACKS) Canvas.#onFirstInteraction(e)
    }

    /**
     * Defines the onmousedown listener
     * @param {Function} callback: a function called on event. (mouse, event)=>{...}
     * @param {Boolean?} global: whether the events are dispatched only on the canvas or the whole window
     * @returns a callback which removes the listeners
     */
    setMouseDown(callback, global) {
        if (!this.isOffscreenCanvas) {
            let isTouch = false
            const ontouchstart=e=>{
                isTouch = true
                const touches = e.touches
                if (touches.length==1) {
                    const scrollState = this.#mobileScrollingState
                    if (e.cancelable && (!scrollState || (scrollState==1 && this.looping))) e.preventDefault()
                    e.x = CDEUtils.round(touches[0].clientX, 1)
                    e.y = CDEUtils.round(touches[0].clientY, 1)
                    e.button = 0
                    this._mouse.updatePos(e.x, e.y, this._offset)
                    this._mouse.calcAngle()            
                    this.#mouseMovements(this.#mouseMoveCB, e)
                    this.#mouseClicks(callback, e, true)
                }
            }, onmousedown=e=>{
                if (!isTouch) this.#mouseClicks(callback, e)
                isTouch = false
            }, element = global ? document : this._frame
            element.addEventListener("touchstart", ontouchstart)
            element.addEventListener("mousedown", onmousedown)
            return ()=>{
                element.removeEventListener("touchstart", ontouchstart)
                element.removeEventListener("mousedown", onmousedown)
            }
        } else return false
    }

    /**
     * Defines the onmouseup listener
     * @param {Function} callback: a function called on event. (mouse, event)=>{...}
     * @param {Boolean?} global: whether the events are dispatched only on the canvas or the whole window
     * @returns a callback which removes the listeners
     */
    setMouseUp(callback, global) {
        if (!this.isOffscreenCanvas) {
            let isTouch = false
            const ontouchend=e=>{
                isTouch = true
                const changedTouches = e.changedTouches
                if (!e.touches.length) {
                    e.x = CDEUtils.round(changedTouches[0].clientX, 1)
                    e.y = CDEUtils.round(changedTouches[0].clientY, 1)
                    e.button = 0
                    this.#mouseClicks(callback, e)
                    this.#mouseMovements(callback, e)
                    setTimeout(()=>this._mouse.invalidate(), 50)
                }     
            }, onmouseup=e=>{
                if (!isTouch) this.#mouseClicks(callback, e)
                isTouch = false
            }, element = global ? document : this._frame
            element.addEventListener("touchend", ontouchend)
            element.addEventListener("mouseup", onmouseup)
            return ()=>{
                element.removeEventListener("touchend", ontouchend)
                element.removeEventListener("mouseup", onmouseup)
            }
        } else return false
    }

    /**
     * Defines the onkeydown listener
     * @param {Function} callback: a function called on event. (typingDevice, event)=>{...}
     * @param {Boolean?} global: whether the events are dispatched only on the canvas or the whole window
     * @returns a callback which removes the listeners
     */
    setKeyDown(callback, global) {
        if (!this.isOffscreenCanvas) {
            const onkeydown=e=>{
                this._typingDevice.setDown(e)
                if (CDEUtils.isFunction(callback)) callback(this._typingDevice, e)
            }, globalFirstInteractOnKeyDown=e=>{if (Canvas.#ON_FIRST_INTERACT_CALLBACKS) Canvas.#onFirstInteraction(e)}, element = global ? document : this._frame
            element.addEventListener("keydown", onkeydown)
            document.addEventListener("keydown", globalFirstInteractOnKeyDown)
            return ()=>element.removeEventListener("keydown", onkeydown)            
        } else return false
    }

    /**
     * Defines the onkeyup listener
     * @param {Function} callback: a function called on event. (typingDevice, event)=>{...}
     * @param {Boolean?} global: whether the events are dispatched only on the canvas or the whole window
     * @returns a callback which removes the listeners
     */
    setKeyUp(callback, global) {
        if (!this.isOffscreenCanvas) {
            const onkeyup=e=>{
                this._typingDevice.setUp(e)
                if (CDEUtils.isFunction(callback)) callback(this._typingDevice, e)
            }, element = global ? document : this._frame
            element.addEventListener("keyup", onkeyup)
            return ()=>element.removeEventListener("keyup", onkeyup)            
        } else return false
    }

    /**
     * @returns the center [x,y] of the canvas
     */
    getCenter() {
        return [this.width/2, this.height/2]
    }

    /**
     * Returns whether the provided position is within the canvas bounds
     * @param {[x,y]} pos: the pos to check 
     * @param {Number?} padding: the padding applied to the results
     */
    isWithin(pos, padding=0) {
        const viewPos = this._viewPos
        return pos[0] >= -padding-viewPos[0] && pos[0] <= this.#cachedSize[0]+padding-viewPos[0] && pos[1] >= -padding-viewPos[1] && pos[1] <= this.#cachedSize[1]+padding-viewPos[1]
    }

    /**
     * Returns the pixel value of the provided pourcent value
     * @param {Number} pourcentileValue: a number between 0 and 1 representing a pourcentile
     * @param {Boolean?} useWidth: whether the width or height should be used
     */
    pct(pourcentileValue, useWidth=true) {
        return useWidth ? this.width*pourcentileValue : this.height*pourcentileValue
    }

    /**
     * Returns the px values of the provided pourcent values.
     * @param {[x%, y%]} pourcentilePos: the x/y pourcentiles as numbers between 0 and 1
     * @param {[width,height]?} referenceDims: the reference dimensions used to calculate the values
     */
    getResponsivePos(pourcentilePos, referenceDims=this.size) {
        return [pourcentilePos[0]*referenceDims[0], pourcentilePos[1]*referenceDims[1]]
    }

    /**
     * Enables checks for mouse enter/leave listeners every frame
     */
    enableAccurateMouseMoveListenersMode() {
        this.mouseMoveListenersOptimizationEnabled = false
    }

    /**
     * Disables checks for mouse enter/leave listeners every frame (only checks on mouse movements)
     */
    disableAccurateMouseMoveListenersMode() {
        this.mouseMoveListenersOptimizationEnabled = true
    }

    /**
     * Disables all mouse move throttling cause by the mouseMoveThrottlingDelay property.
     */
    disableMouseMoveThrottling() {
        this._mouseMoveThrottlingDelay = 0
    }

    /**
     * Disables all on intersection change actions
     */
    disableViewportIntersectionOptimizations() {
        this.onIntersectionChangeCB = undefined
    }

    /**
     * Sets the on interaction change actions to be the default optimizations
     */
    enableDefaultViewportIntersectionOptimizations() {
        this.onIntersectionChangeCB = null
    }

    [Symbol.toPrimitive](type) {
        if (type=="number") return this.id
        else if (type=="string") return this.id
        return this.id
    }

    get [Symbol.toStringTag]() {return this.instanceOf}
    get instanceOf() {return "Canvas"}
	get id() {return this._id}
	get cvs() {return this._cvs}
	get frame() {return this._frame}
	get ctx() {return this._ctx}
	get width() {return this.#cachedSize?.[0]}
	get height() {return this.#cachedSize?.[1]}
	get size() {return this.#cachedSize}
	get settings() {return this._settings}
	get loopingCB() {return this._loopingCB}
	get looping() {return this._state==Canvas.STATES.LOOPING}
	get stopped() {return this._state==Canvas.STATES.STOPPED}
    get state() {return this._state}
	get deltaTime() {return this._deltaTime}
	get windowListeners() {return this._windowListeners}
	get timeStamp() {return this._fixedTimeStamp||this.#timeStamp}
	get timeStampNotFixed() {return this.#timeStamp}
	get timeStampRaw() {return this.#rawTimeStamp}
	get els() {return this._els}
	get mouse() {return this._mouse}
	get typingDevice() {return this._typingDevice}
	get keyboard() {return this._typingDevice}
	get offset() {return this._offset}
    get defs() {return this._els.defs}
    get refs() {return this._els.refs}
    get allDefsAndRefs() {return this.defs.concat(this.refs)}
    get allEls() {return this.allDefsAndRefs.flatMap(x=>x.dots||x)}
    get fpsLimitRaw() {return this._fpsLimit}
    get fpsLimit() {
        const isStatic = !isFinite(this._fpsLimit)
        return this._fpsLimit==null||isStatic ? isStatic ? "static" : null : 1/(this._fpsLimit/1000)
    }
    get onVisibilityChangeCB() {return this._onVisibilityChangeCB}
    get onIntersectionChangeCB() {return this._onIntersectionChangeCB}
    get onResizeCB() {return this._onResizeCB}
    get onScrollCB() {return this._onScrollCB}
    get maxTime() {return this.#maxTime}
    get viewPos() {return this._viewPos}
    get render() {return this._render}
    get speedModifier() {return this._speedModifier}
    get anims() {return this._anims}
    get mouseMoveListenersOptimizationEnabled() {return this._mouse._moveListenersOptimizationEnabled}
    get isOffscreenCanvas() {return this._cvs instanceof OffscreenCanvas} 
    get mouseMoveThrottlingDelay() {return this._mouseMoveThrottlingDelay}
    get dimensions() {return [[0,0],this.size]}
    get hasBeenStarted() {return Boolean(this.timeStamp)}
    get mobileScrollingState() {return this.#mobileScrollingState}

	set id(id) {this._id = id}
	set loopingCB(loopingCB) {this._loopingCB = loopingCB}
	set width(w) {this.setSize(w, null)}
	set height(h) {this.setSize(null, h)}
	set offset(offset) {this._offset = offset}
	set fpsLimit(fpsLimit) {
        this._fpsLimit = CDEUtils.isDefined(fpsLimit)&&isFinite(fpsLimit) ? 1000/Math.max(fpsLimit, 0) : null
        this.#maxTime = this.#getMaxTime(fpsLimit)
    }
    set onVisibilityChangeCB(onVisibilityChangeCB) {
        this.#visibilityChangeLastState[0] = this._state
        this._onVisibilityChangeCB = (isVisible, CVS, e)=>{
            if (!isVisible) this.#visibilityChangeLastState[0] = this._state
            if (this.#visibilityChangeLastState[0]==1) {
                if (isVisible) {
                    this.startLoop()
                    this.resetReferences()
                } else this.stopLoop()
            }
            if (CDEUtils.isFunction(onVisibilityChangeCB)) onVisibilityChangeCB(isVisible, CVS, e)
        }
    }
    set onIntersectionChangeCB(onIntersectionChangeCB) {
        if (onIntersectionChangeCB===undefined) this._onIntersectionChangeCB = null
        else {
            this.#visibilityChangeLastState[1] = this._state
            this._onIntersectionChangeCB = (isVisible, CVS, e)=>{
                if (!isVisible) this.#visibilityChangeLastState[1] = this._state
                if (this.#visibilityChangeLastState[1]==Canvas.STATES.LOOPING) {
                    if (isVisible) {
                        this.startLoop()
                        this.resetReferences()
                    } else this.stopLoop()
                }
                if (CDEUtils.isFunction(onIntersectionChangeCB)) onIntersectionChangeCB(isVisible, CVS, e)
            }
        }
    }
    set onResizeCB(onResize) {this._onResizeCB = onResize}
    set onScrollCB(onScrollCB) {this._onScrollCB = onScrollCB}
    set speedModifier(speedModifier) {this._speedModifier = speedModifier}
    set mouseMoveListenersOptimizationEnabled(enabled) {this._mouse._moveListenersOptimizationEnabled = enabled}
    set mouseMoveThrottlingDelay(mouseMoveThrottlingDelay) {this._mouseMoveThrottlingDelay = mouseMoveThrottlingDelay}
    set mobileScrollingState(state) {this.#mobileScrollingState = state}
}