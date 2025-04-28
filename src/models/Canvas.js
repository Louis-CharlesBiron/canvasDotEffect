// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

const CDE_CANVAS_DEFAULT_TIMEOUT_FN = window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame

// Represents a html canvas element
class Canvas {
    static DOMParser = new DOMParser()
    static ELEMENT_ID_GIVER = 0
    static DEFAULT_MAX_DELTATIME_MS = 130
    static DEFAULT_MAX_DELTATIME = Canvas.DEFAULT_MAX_DELTATIME_MS/1000
    static DEFAULT_MAXDELAY_MULTIPLIER = 0.44
    static DEFAULT_CANVAS_ACTIVE_AREA_PADDING = 20
    static DEFAULT_CVSDE_ATTR = "_CVSDE"
    static DEFAULT_CVSFRAMEDE_ATTR = "_CVSDE_F"
    static DEFAULT_CUSTOM_SVG_FILTER_ID_PREFIX = "CDE_FE_"
    static DEFAULT_CUSTOM_SVG_FILTER_CONTAINER_ID = Canvas.DEFAULT_CUSTOM_SVG_FILTER_ID_PREFIX+"CONTAINER"
    static CURSOR_STYLES = {CUSTOM:(filepath, offsetPos=[0,0], fallbackCursorStyle=Canvas.CURSOR_STYLES.AUTO)=>`url("${filepath}") ${offsetPos.join(" ")}, ${fallbackCursorStyle}`, AUTO:"auto", POINTER:"pointer", DEFAULT:"default", CROSSHAIR:"crosshair", MOVE:"move", TEXT:"text", WAIT:"wait", HELP:"help", NONE:"none", GRAB:"grab", GRABBING:"grabbing", ALL_SCROLL:"all-scroll", COL_RESIZE:"col-resize", ROW_RESIZE:"row-resize", N_RESIZE:"n-resize", E_RESIZE:"e-resize", S_RESIZE:"s-resize", W_RESIZE:"w-resize", NE_RESIZE:"ne-resize", NW_RESIZE:"nw-resize", SE_RESIZE:"se-resize", SW_RESIZE:"sw-resize", ZOOM_IN:"zoom-in", ZOOM_OUT:"zoom-out", NO_DROP:"no-drop", COPY:"copy", NOT_ALLOWED:"not-allowed", VERTICAL_TEXT:"vertical-text", CELL:"cell", CONTEXT_MENU:"context-menu", EXT_RESIZE:"ext-resize", DEFAULT_ARROW:"default", UNSET:"unset"}
    static LOADED_SVG_FILTERS = {}
    static DEFAULT_CTX_SETTINGS = {"imageSmoothingEnabled":false, "willReadFrequently":false, "font":TextStyles.DEFAULT_FONT, "letterSpacing":TextStyles.DEFAULT_LETTER_SPACING, "wordSpacing":TextStyles.DEFAULT_WORD_SPACING, "fontVariantCaps":TextStyles.DEFAULT_FONT_VARIANT_CAPS, "direction":TextStyles.DEFAULT_DIRECTION, "fontSretch":TextStyles.DEFAULT_FONT_STRETCH, "fontKerning":TextStyles.DEFAULT_FONT_KERNING, "textAlign":TextStyles.DEFAULT_TEXT_ALIGN, "textBaseline":TextStyles.DEFAULT_TEXT_BASELINE, "textRendering":TextStyles.DEFAULT_TEXT_RENDERING, "lineDashOffset":RenderStyles.DEFAULT_DASH_OFFSET, "lineJoin":RenderStyles.DEFAULT_JOIN, "lineCap":RenderStyles.DEFAULT_CAP, "lineWidth":RenderStyles.DEFAULT_WIDTH, "fillStyle":Color.DEFAULT_COLOR, "stokeStyle":Color.DEFAULT_COLOR}
    static DEFAULT_CANVAS_WIDTH = 800
    static DEFAULT_CANVAS_HEIGHT = 800
    static DEFAULT_CANVAS_STYLES = {position:"absolute",width:"100%",height:"100%","background-color":"transparent",border:"none",outline:"none","pointer-events":"none !important","z-index":0,padding:"0 !important",margin:"0","-webkit-transform":"translate3d(0, 0, 0)","-moz-transform": "translate3d(0, 0, 0)","-ms-transform": "translate3d(0, 0, 0)","transform": "translate3d(0, 0, 0)"}

    static STATIC_MODE = 0
    static #ON_LOAD_CALLBACKS = []
    static #ON_FIRST_INTERACT_CALLBACKS = []

    #lastFrame = 0           // default last frame time
    #lastLimitedFrame = 0    // last frame time for limited fps
    #maxTime = null          // max time between frames
    #frameSkipsOffset = null // used to prevent significant frame gaps
    #timeStamp = null        // requestanimationframe timestamp in ms
    #cachedEls = []          // cached canvas elements to draw
    #cachedEls_ll = null     // cached canvas elements count/length
    #lastScrollValues = [window.scrollX, window.screenY]

    constructor(cvs, loopingCB, fpsLimit=null, visibilityChangeCB, cvsFrame, settings=Canvas.DEFAULT_CTX_SETTINGS, willReadFrequently=false) {
        this._cvs = cvs                                               // html canvas element
        this._frame = cvsFrame??cvs?.parentElement                    // html parent of canvas element
        this._cvs.setAttribute(Canvas.DEFAULT_CVSDE_ATTR, true)       // set styles selector for canvas
        this._frame.setAttribute(Canvas.DEFAULT_CVSFRAMEDE_ATTR, true)// set styles selector for parent
        this._ctx = this._cvs.getContext("2d", {willReadFrequently})  // canvas context
        this._settings = this.updateSettings(settings)                // set context settings
        this._els = {refs:[], defs:[]}                                // arrs of objects to .draw() | refs (source): [Object that contains drawable obj], defs: [regular drawable objects]
        this._looping = false                                         // loop state
        this._loopingCB = loopingCB                                   // custom callback called along with the loop() function
        this.fpsLimit = fpsLimit                                      // delay between each frame to limit fps
        this.visibilityChangeCB = visibilityChangeCB                  // callback with the actions to be taken on document visibility change (isVisible, CVS, e)=>
        this._speedModifier = 1                                       // animation/drawing speed multiplier
        this.#maxTime = this.#getMaxTime(fpsLimit)                    // max time between frames
        this._deltaTime = null                                        // useable delta time in seconds
        this._fixedTimeStamp = null                                   // fixed (offsets lag spikes) requestanimationframe timestamp in ms
        this._windowListeners = this.#initWindowListeners()           // [onresize, onvisibilitychange]
        this._viewPos = [0,0]                                         // context view offset
        const frameCBR = this._frame?.getBoundingClientRect()??{width:Canvas.DEFAULT_CANVAS_WIDTH, height:Canvas.DEFAULT_CANVAS_HEIGHT}
        this.setSize(frameCBR.width, frameCBR.height)                 // init size
        this.#initStyles()                                            // init styles
        this._typingDevice = new TypingDevice()                       // keyboard info
        this._mouse = new Mouse()                                     // mouse info
        this._offset = this.updateOffset()                            // cvs page offset
        this._render = new Render(this._ctx)                          // render instance
    }

    // sets css styles on the canvas and the parent
    #initStyles() {
        const style = document.createElement("style")
        style.appendChild(document.createTextNode(`[${Canvas.DEFAULT_CVSFRAMEDE_ATTR}]{position:relative !important;outline: none;}canvas[${Canvas.DEFAULT_CVSDE_ATTR}]{${Object.entries(Canvas.DEFAULT_CANVAS_STYLES).reduce((a,b)=>a+=`${b[0]}:${b[1]};`,"")}}`))
        this._cvs.appendChild(style)
        this._frame.setAttribute("tabindex", 0)
    }

    // sets resize and visibility change listeners on the window
    #initWindowListeners() {
        const onresize=()=>this.setSize(),
              onvisibilitychange=e=>this._visibilityChangeCB(!document.hidden, this, e),
              onscroll=()=>{
                const scrollX = window.scrollX, scrollY = window.scrollY
                this.updateOffset()
                this._mouse.updatePos({x:this._mouse.x+(scrollX-this.#lastScrollValues[0]), y:this._mouse.y+(scrollY-this.#lastScrollValues[1])}, {x:0, y:0})
                this.#mouseMovements()
                this.#lastScrollValues[0] = scrollX
                this.#lastScrollValues[1] = scrollY
              },
              onLoad=e=>{
                const callbacks = Canvas.#ON_LOAD_CALLBACKS, cb_ll = callbacks?.length
                if (cb_ll) for (let i=0;i<cb_ll;i++) callbacks[i](e)
                Canvas.#ON_LOAD_CALLBACKS = null
              }

        window.addEventListener("resize", onresize)
        window.addEventListener("visibilitychange", onvisibilitychange)
        window.addEventListener("scroll", onscroll)
        window.addEventListener("load", onLoad)
        return {
            onrezise:()=>window.removeEventListner("resize", onresize),
            onvisibilitychange:()=>window.removeEventListener("visibilitychange", onvisibilitychange),
            onscroll:()=>window.removeEventListener("scroll", onscroll),
            onDOMContentLoaded:()=>window.removeEventListener("load", onLoad)
        }
    }

    // sets the cursor style on the canvas
    setCursorStyle(cursorStyle=Canvas.CURSOR_STYLES.DEFAULT) {
        const frame = this._frame
        if (frame.style.cursor !== cursorStyle) frame.style.cursor = cursorStyle
    }

    // adds a callback to be called once the document is loaded
    static addOnLoadCallback(callback) {
        if (CDEUtils.isFunction(callback) && Canvas.#ON_LOAD_CALLBACKS) Canvas.#ON_LOAD_CALLBACKS.push(callback)
    }

    // adds a callback to be called once the document has been interacted with for the first time
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

    // returns the filter elements of a loaded svg filter
    static getSVGFilter(id) {
        return Canvas.LOADED_SVG_FILTERS[id]
    }

    // deletes a loaded svg filter
    static removeSVGFilter(id) {
        id = Canvas.DEFAULT_CUSTOM_SVG_FILTER_ID_PREFIX+id
        document.getElementById(id).remove()
        delete Canvas.LOADED_SVG_FILTERS[id]
    }

    // updates the calculated canvas offset in the page
    updateOffset() {
        const {width, height, x, y} = this._cvs.getBoundingClientRect()
        return this._offset = {x:Math.round((x+width)-this.width)+this._viewPos[0], y:Math.round((y+height)-this.height)+this._viewPos[1]}
    }

    // starts the drawing loop
    startLoop() {
        if (!this._looping) {
            this._looping = true
            this.#loop(0)
        }
    }

    // main loop, runs every frame
    #loop(time) {
        this.#timeStamp = time
        if (this._fpsLimit) {
            const timeDiff = time-this.#lastLimitedFrame
            if (timeDiff >= this._fpsLimit) {
                this.#loopCore(time)
                this.#lastFrame = time
                this.#lastLimitedFrame = time-(timeDiff%this._fpsLimit)
            }
        } else {
            this.#loopCore(time)
            this.#lastFrame = time
        }

        if (this._looping) CDE_CANVAS_DEFAULT_TIMEOUT_FN(this.#loop.bind(this))
    }

    // core actions of the main loop
    #loopCore(time) {
        this.#calcDeltaTime(time)

        const delay = Math.abs((time-this.#timeStamp)-this.deltaTime*1000)
        if (this._fixedTimeStamp==0) this._fixedTimeStamp = time-this.#frameSkipsOffset
        if (time && this._fixedTimeStamp && delay < this.#maxTime) {
            this._mouse.calcSpeed(this._deltaTime)

            this.clear()
            this.draw()
            this._render.drawBatched()
            
            if (CDEUtils.isFunction(this._loopingCB)) this._loopingCB(this)

            this._fixedTimeStamp = 0
        } else if (time) {
            this._fixedTimeStamp = time-(this.#frameSkipsOffset += this.#maxTime)
            this.#frameSkipsOffset += this.#maxTime
        }   
    }

    // stops the loop
    stopLoop() {
        this._looping = false
    }

    // calculates and sets the deltaTime
    #calcDeltaTime(time=0) {
        this._deltaTime = Math.min((time-this.#lastFrame)/1000, this.#maxTime)
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
        const els = this.#cachedEls, els_ll = this.#cachedEls_ll, render = this._render, deltaTime = this._deltaTime, timeStamp = this.timeStamp*this._speedModifier, activeAreaPadding = Canvas.DEFAULT_CANVAS_ACTIVE_AREA_PADDING
        for (let i=0;i<els_ll;i++) {
            const el = els[i]
            if ((!el.alwaysActive && el.initialized && !this.isWithin(el.pos, activeAreaPadding)) || !el.draw) continue
            el.draw(render, timeStamp, deltaTime)
        }
    }

    // clears the canvas
    clear(x=0, y=0, x2=this.width, y2=this.height) {
        const [oX, oY] = this._viewPos
        if (oX || oY) {
            this.save()
            this.resetTransformations()
            this._ctx.clearRect(x, y, x2, y2)
            this.restore()
        } else this._ctx.clearRect(x, y, x2, y2)
    }

    // initializes the canvas as static
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

    // draws a single frame (use with static canvas)
    drawStatic() {
        this.draw()
        this._render.drawBatched()
        if (CDEUtils.isFunction(this._loopingCB)) this._loopingCB()
    }

    // clears the canvas and draws a single frame (use with static canvas)
    cleanDrawStatic() {
        this.clear()
        this.drawStatic()
    }

    // resets every fragile references
    resetReferences() {
        this.refs.filter(ref=>ref.fragile).forEach(r=>r.reset())
    }

    // discards all current context transformations
    resetTransformations() {
        this.ctx.setTransform(1,0,0,1,0,0)
    }

    // moves the context by specified x/y values
    moveViewBy(pos) {
        let [x, y] = pos
        this._ctx.translate(x=(CDEUtils.isDefined(x)&&isFinite(x))?x:0,y=(CDEUtils.isDefined(y)&&isFinite(y))?y:0)
        this._viewPos = [this._viewPos[0]+x, this._viewPos[1]+y]

        this.updateOffset()
        this._mouse.updatePos({x:this._mouse.rawX, y:this._mouse.rawY}, this._offset)
        this.#mouseMovements()
    }

    // moves the context to a specific x/y value
    moveViewAt(pos) {
        let [x, y] = pos
        this.resetTransformations()
        this._ctx.translate(x=(CDEUtils.isDefined(x)&&isFinite(x))?x:0,y=(CDEUtils.isDefined(y)&&isFinite(y))?y:0)
        this._viewPos = [x, y]
        
        this.updateOffset()
        this._mouse.updatePos({x:this._mouse.rawX, y:this._mouse.rawY}, this._offset)
        this.#mouseMovements()
    }

    // sets the width and height in px of the canvas element. If "forceCSSupdate" is true, it also force the resizes on the frame with css
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
    }

    // updates current canvas settings
    updateSettings(settings) {
        const st = settings||this._settings
        Object.entries(st).forEach(s=>this._ctx[s[0]]=s[1])
        return this._settings=st
    }

    // add 1 or many objects, as a (def)inition or as a (ref)erence (source). if "inactive" is true, it only initializes the obj, without adding it to the canvas
    add(objs, inactive=false) {
        const l = objs&&(objs.length??1)
        for (let i=0;i<l;i++) {
            const obj = objs[i]??objs
            obj._parent = this
            
            if (CDEUtils.isFunction(obj.initialize)) obj.initialize()
            if (!inactive) this._els[obj.asSource?"refs":"defs"].push(obj)

        }
        this.updateCachedAllEls()
    }

    // removes any element from the canvas by id
    remove(id) {
        if (id=="*") {
            this._els = {refs:[], defs:[]}
        } else {
            this._els.defs = this._els.defs.filter(el=>el.id!==id)
            this._els.refs = this._els.refs.filter(source=>source.id!==id)
        }
        this.updateCachedAllEls()
    }

    // get any element from the canvas by id
    get(id) {
        const els = this.#cachedEls, e_ll = this.#cachedEls_ll
        for (let i=0;i<e_ll;i++) {
            const el = els[i]
            if (el.id==id) return el
        }
        return null
    }

    // removes any element from the canvas by instance type
    getObjs(instance) {
        return this._els.defs.filter(x=>x instanceof instance)
    }

    // saves the context parameters
    save() {
        this._ctx.save()
    }
    
    // restore the saved context parameters
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
    #mouseMovements(cb, e) {
        // update ratioPos to mouse pos if not overwritten
        const r_ll = this.refs.length
        for (let i=0;i<r_ll;i++) {
            const ref = this.refs[i]
            if (!ref.ratioPosCB && ref.ratioPosCB !== false) ref.ratioPos = this._mouse.pos
        }
        if (CDEUtils.isFunction(cb)) cb(this._mouse, e)

        this._mouse.checkValid()
    }

    // defines the onmousemove listener
    setMouseMove(cb, global) {
        const onmousemove=e=>{
            // update pos and direction angle
            this._mouse.updatePos(e, this._offset)
            this._mouse.calcAngle()            
            this.#mouseMovements(cb, e)
        }, ontouchmove=e=>{
            const touches = e.touches
            if (touches.length==1) {
                e.preventDefault()
                e.x = CDEUtils.round(touches[0].clientX, 1)
                e.y = CDEUtils.round(touches[0].clientY, 1)
                this._mouse.updatePos(e, this._offset)
                this._mouse.calcAngle()            
                this.#mouseMovements(cb, e)
            }
        }
        const element = global ? document : this._frame
        element.addEventListener("mousemove", onmousemove)
        element.addEventListener("touchmove", ontouchmove)
        return ()=>{
            element.removeEventListener("mousemove", onmousemove)
            element.removeEventListener("touchmove", ontouchmove)
        }
    }

    // defines the onmouseleave listener
    setMouseLeave(cb, global) {
        const onmouseleave=e=>{
            this._mouse.invalidate()
            this.#mouseMovements(cb, e)
        }
        const element = global ? document : this._frame
        element.addEventListener("mouseleave", onmouseleave)
        return ()=>element.removeEventListener("mouseleave", onmouseleave)
    }

    // called on any mouse clicks
    #mouseClicks(cb, e) {
        this._mouse.setMouseClicks(e)
        if (CDEUtils.isFunction(cb)) cb(this._mouse, e)
        if (Canvas.#ON_FIRST_INTERACT_CALLBACKS) Canvas.#onFirstInteraction(e)
    }

    // defines the onmousedown listener
    setMouseDown(cb, global) {
        let isTouch = false
        const ontouchstart=e=>{
            isTouch = true
            const touches = e.touches
            if (touches.length==1) {
                e.preventDefault()
                e.x = CDEUtils.round(touches[0].clientX, 1)
                e.y = CDEUtils.round(touches[0].clientY, 1)
                e.button = 0
                this.#mouseClicks(cb, e)
            }
        }, onmousedown=e=>{
            if (!isTouch) this.#mouseClicks(cb, e)
            isTouch = false
        }
        const element = global ? document : this._frame
        element.addEventListener("touchstart", ontouchstart)
        element.addEventListener("mousedown", onmousedown)
        return ()=>{
            element.removeEventListener("touchstart", ontouchstart)
            element.removeEventListener("mousedown", onmousedown)
        }
    }

    // defines the onmouseup listener
    setMouseUp(cb, global) {
        let isTouch = false
        const ontouchend=e=>{
            isTouch = true
            const changedTouches = e.changedTouches
            if (!e.touches.length) {
                e.preventDefault()
                e.x = CDEUtils.round(changedTouches[0].clientX, 1)
                e.y = CDEUtils.round(changedTouches[0].clientY, 1)
                e.button = 0
                this.#mouseClicks(cb, e)
            }
        }, onmouseup=e=>{
            if (!isTouch) this.#mouseClicks(cb, e)
            isTouch = false
        }
        const element = global ? document : this._frame
        element.addEventListener("touchend", ontouchend)
        element.addEventListener("mouseup", onmouseup)
        return ()=>{
            element.removeEventListener("touchend", ontouchend)
            element.removeEventListener("mouseup", onmouseup)
        }
    }

    // defines the onkeydown listener
    setKeyDown(cb, global) {
        const onkeydown=e=>{
            this._typingDevice.setDown(e)
            if (CDEUtils.isFunction(cb)) cb(this._typingDevice, e)
            }, globalFirstInteractOnKeyDown=e=>{if (Canvas.#ON_FIRST_INTERACT_CALLBACKS) Canvas.#onFirstInteraction(e)}
        
        const element = global ? document : this._frame
        element.addEventListener("keydown", onkeydown)
        document.addEventListener("keydown", globalFirstInteractOnKeyDown)
        return ()=>element.removeEventListener("keydown", onkeydown)
    }

    // defines the onkeyup listener
    setKeyUp(cb, global) {
        const onkeyup=e=>{
            this._typingDevice.setUp(e)
            if (CDEUtils.isFunction(cb)) cb(this._typingDevice, e)
        }

        const element = global ? document : this._frame
        element.addEventListener("keyup", onkeyup)
        return ()=>element.removeEventListener("keyup", onkeyup)
    }

    // returns the center [x,y] of the canvas
    getCenter() {
        return [this.width/2, this.height/2]
    }

    // returns whether the provided position is within the canvas bounds
    isWithin(pos, padding=0) {
        const [x,y] = pos, [ox, oy] = this._viewPos
        return x >= -padding-ox && x <= this.width+padding-ox && y >= -padding-oy && y <= this.height+padding-oy
    }

    // returns the px value of the provided pourcent value. PourcentileValue should be a number between 0 and 1. UseWidth determines whether the width or height should be used.
    pct(pourcentileValue, useWidth=true) {
        return useWidth ? this.width*pourcentileValue : this.height*pourcentileValue
    }

    // Returns the px values of the provided pourcent values. PourcentilePos should be an array(2) of numbers between 0 and 1. ReferenceDims is the reference dimensions used to calculate the values
    getResponsivePos(pourcentilePos, referenceDims=this.size) {
        return [pourcentilePos[0]*referenceDims[0], pourcentilePos[1]*referenceDims[1]]
    }
    
	get cvs() {return this._cvs}
	get frame() {return this._frame}
	get ctx() {return this._ctx}
	get width() {return this._cvs.width}
	get height() {return this._cvs.height}
	get size() {return [this.width, this.height]}
	get settings() {return this._settings}
	get loopingCB() {return this._loopingCB}
	get looping() {return this._looping}
	get deltaTime() {return this._deltaTime}
	get windowListeners() {return this._windowListeners}
	get timeStamp() {return this._fixedTimeStamp||this.#timeStamp}
	get timeStampRaw() {return this.#timeStamp}
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
    get visibilityChangeCB() {return this._visibilityChangeCB}
    get maxTime() {return this.#maxTime}
    get viewPos() {return this._viewPos}
    get render() {return this._render}
    get speedModifier() {return this._speedModifier}

	set loopingCB(loopingCB) {this._loopingCB = loopingCB}
	set width(w) {this.setSize(w, null)}
	set height(h) {this.setSize(null, h)}
	set offset(offset) {this._offset = offset}
	set fpsLimit(fpsLimit) {
        this._fpsLimit = CDEUtils.isDefined(fpsLimit)&&isFinite(fpsLimit) ? 1000/Math.max(fpsLimit, 0) : null
        this.#maxTime = this.#getMaxTime(fpsLimit)
    }
    set visibilityChangeCB(visibilityChangeCB) {
        this._visibilityChangeCB = (isVisible, CVS, e)=>{
            if (isVisible) this.resetReferences()
            if (CDEUtils.isFunction(visibilityChangeCB)) visibilityChangeCB(isVisible, CVS, e)
        }
    }
    set speedModifier(speedModifier) {this._speedModifier = speedModifier}
}