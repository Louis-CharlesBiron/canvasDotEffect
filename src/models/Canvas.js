// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

const CDE_CANVAS_DEFAULT_TIMEOUT_FN = window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame

// Represents a html canvas element
class Canvas {
    static ELEMENT_ID_GIVER = 0
    static DEFAULT_MAX_DELTATIME_MS = 130
    static DEFAULT_MAX_DELTATIME = Canvas.DEFAULT_MAX_DELTATIME_MS/1000
    static DEFAULT_MAXDELAY_MULTIPLIER = 0.44
    static DEFAULT_CANVAS_ACTIVE_AREA_PADDING = 20
    static DEFAULT_CVSDE_ATTR = "_CVSDE"
    static DEFAULT_CVSFRAMEDE_ATTR = "_CVSDE_F"
    static DEFAULT_CTX_SETTINGS = {"lineCap":"round", "imageSmoothingEnabled":true, "lineWidth":2, "fillStyle":"aliceblue", "stokeStyle":"aliceblue", "willReadFrequently":false}
    static DEFAULT_CANVAS_WIDTH = 800
    static DEFAULT_CANVAS_HEIGHT = 800
    static DEFAULT_CANVAS_STYLES = {position:"absolute",width:"100%",height:"100%","background-color":"transparent",border:"none",outline:"none","pointer-events":"none !important","z-index":0,padding:"0 !important",margin:"0"}

    #lastFrame = 0 
    #lastLimitedFrame = 0 
    #maxTime = null
    #frameSkipsOffset = null // used to prevent significant frame gaps
    #timeStamp = null        // requestanimationframe timestamp in ms
    #cachedEls = []          // cached canvas elements to draw

    constructor(cvs, loopingCallback, fpsLimit=null, cvsFrame, settings=Canvas.DEFAULT_CTX_SETTINGS, willReadFrequently=false) {
        this._cvs = cvs                                         // html canvas element
        this._frame = cvsFrame??cvs?.parentElement              // html parent of canvas element
        this._cvs.setAttribute(Canvas.DEFAULT_CVSDE_ATTR, true)        // set styles selector for canvas
        this._frame.setAttribute(Canvas.DEFAULT_CVSFRAMEDE_ATTR, true) // set styles selector for parent
        this._ctx = this._cvs.getContext("2d", {willReadFrequently})   // canvas context
        this._settings = this.updateSettings(settings)          // set context settings
        this._els={refs:[], defs:[]}                            // arrs of objects to .draw() | refs (source): [Object that contains drawable obj], defs: [regular drawable objects]
        this._looping = false                                   // loop state
        this._loopingCallback = loopingCallback                 // custom callback called along with the loop() function
        this.fpsLimit = fpsLimit                                // delay between each frame to limit fps
        this.#maxTime = this.#getMaxTime(fpsLimit)              // max time between frames
        this._deltaTime = null                                  // useable delta time in seconds
        this._fixedTimeStamp = null                             // fixed (offsets lag spikes) requestanimationframe timestamp in ms
        this._windowListeners = this.#initWindowListeners()     // [onresize, onvisibilitychange]
        this._viewPos = [0,0]                                   // context view offset
        const frameCBR = this._frame?.getBoundingClientRect()??{width:Canvas.DEFAULT_CANVAS_WIDTH, height:Canvas.DEFAULT_CANVAS_HEIGHT}
        this.setSize(frameCBR.width, frameCBR.height)           // init size
        this.#initStyles()                                      // init styles
        this._typingDevice = new TypingDevice()                 // keyboard info
        this._mouse = new Mouse()                               // mouse info
        this._offset = this.updateOffset()                      // cvs page offset
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
              onvisibilitychange=()=>{if (!document.hidden) this.resetReferences()}

        window.addEventListener("resize", onresize)
        window.addEventListener("visibilitychange", onvisibilitychange)
        return [()=>window.removeEventListener("resize", onresize), ()=>window.removeEventListener("visibilitychange", onvisibilitychange)]
    }

    // updates the calculated canvas offset in the page
    updateOffset() {
        const {width, height, x, y} = this._cvs.getBoundingClientRect()
        return this._offset = {x:Math.round((x+width)-this.width+window.scrollX)+this._viewPos[0], y:Math.round((y+height)-this.height+window.scrollY)+this._viewPos[1]}
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

    #loopCore(time) {
        this.#calcDeltaTime(time)

        const delay = Math.abs((time-this.#timeStamp)-this.deltaTime*1000)
        if (this._fixedTimeStamp===0) this._fixedTimeStamp = time-this.#frameSkipsOffset
        if (time && this._fixedTimeStamp && delay < this.#maxTime) {
            this._mouse.calcSpeed(this._deltaTime)

            this.clear()
            this.draw()
            
            if (CDEUtils.isFunction(this._loopingCallback)) this._loopingCallback()

            this._fixedTimeStamp = 0
        } else if (time) {// maybe see if frame skipping is really necessary
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

    updateCachedAllEls() {
        this.#cachedEls = this.refs.concat(this._els.refs.flatMap(source=>source.asSource)).concat(this._els.defs)
    }

    // calls the draw function on all canvas objects
    draw() {
        const els = this.#cachedEls, els_ll = els.length
        for (let i=0;i<els_ll;i++) {
            const el = els[i]
            if (!el.draw || (!el.alwaysActive && el.initialized && !this.isWithin(el.pos, Canvas.DEFAULT_CANVAS_ACTIVE_AREA_PADDING))) continue
            el.draw(this._ctx, this.timeStamp, this._deltaTime)
        }
    }

    // clears the canvas
    clear(pos1=[0,0], pos2=[this.width, this.height]) {
        this._ctx.clearRect(...pos1, ...pos2)
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
    }

    // moves the context to a specific x/y value
    moveViewAt(pos) {
        let [x, y] = pos
        this.resetTransformations()
        this._ctx.translate(x=(CDEUtils.isDefined(x)&&isFinite(x))?x:0,y=(CDEUtils.isDefined(y)&&isFinite(y))?y:0)
        this._viewPos = [x, y]
        this.updateOffset()
    }

    // sets the width and height in px of the canvas element. If "forceCSSupdate" is true, it also resizes the frame with css
    setSize(w, h, forceCSSupdate) {
        const {width, height} = this._frame.getBoundingClientRect()
        this._cvs.width = w??width
        this._cvs.height = h??height
        if (forceCSSupdate) {
            this._frame.style.width = this.width+"px"
            this._frame.style.height = this.height+"px"
        }
        this.updateSettings()
        this.updateOffset()
    }

    // updates current canvas settings
    updateSettings(settings) {
        const st = settings||this._settings
        Object.entries(st).forEach(s=>this._ctx[s[0]]=s[1])
        return this._settings=st
    }

    // add 1 or many objects, as a (def)inition or as a (ref)erence (source). if "active" is false, it only initializes the obj, without adding it to the canvas
    add(objs, isDef, active=true) {
        const l = objs.length??1
        for (let i=0;i<l;i++) {
            const obj = objs[i]??objs
            if (!isDef) obj.cvs = this
            else obj.parent = this
            
            if (CDEUtils.isFunction(obj.initialize)) obj.initialize()

            if (active) this._els[isDef?"defs":"refs"].push(obj)
        }
        this.updateCachedAllEls()
    }

    // removes any element from the canvas by id
    remove(id) {
        this._els.defs = this._els.defs.filter(el=>el.id!==id)
        this._els.refs = this._els.refs.filter(source=>source.id!==id)
        this.updateCachedAllEls()
    }

    // get any element from the canvas by id
    get(id) {
        return this.allEls.find(el=>el.id===id)
    }

    // removes any element from the canvas by instance type
    getObjs(instance) {
        return this._els.defs.filter(x=>x instanceof instance)
    }

    // called on mouse move
    #mouseMovements(cb, e) {
        // update ratioPos to mouse pos if not overwritten
        const r_ll = this.refs.length
        for (let i=0;i<r_ll;i++) {
            const ref = this.refs[i]
            if (!ref.ratioPosCB && ref.ratioPosCB !== false) ref.ratioPos=this._mouse.pos
        }
        // custom move callback
        if (CDEUtils.isFunction(cb)) cb(e, this._mouse)

        // check mouse pos validity
        this._mouse.checkValid()
    }

    // defines the onmousemove listener
    setmousemove(cb) {
        const onmousemove=e=>{
            // update pos and direction angle
            this._mouse.updatePos(e, this._offset)
            this._mouse.calcAngle()            

            this.#mouseMovements(cb, e)
        }
        this._frame.addEventListener("mousemove", onmousemove)
        return ()=>this._frame.removeEventListener("mousemove", onmousemove)
    }

    // defines the onmouseleave listener
    setmouseleave(cb) {
        const onmouseleave=e=>{
            // invalidate mouse
            this._mouse.invalidate()
            this.#mouseMovements(cb, e)
        }
        this._frame.addEventListener("mouseleave", onmouseleave)
        return ()=>this._frame.removeEventListener("mouseleave", onmouseleave)
    }

    // called on any mouse clicks
    #mouseClicks(cb, e) {
        this._mouse.setMouseClicks(e)
        if (CDEUtils.isFunction(cb)) cb(e, this._mouse)
    }

    // defines the onmousedown listener
    setmousedown(cb) {
        const onmousedown=e=>this.#mouseClicks(cb, e)
        this._frame.addEventListener("mousedown", onmousedown)
        return ()=>this._frame.removeEventListener("mousedown", onmousedown)
    }

    // defines the onmouseup listener
    setmouseup(cb) {
        const onmouseup=e=>this.#mouseClicks(cb, e)
        this._frame.addEventListener("mouseup", onmouseup)
        return ()=>this._frame.removeEventListener("mouseup", onmouseup)
    }

    // defines the onkeydown listener
    setkeydown(cb, global) {
        const onkeydown=e=>{
            this._typingDevice.setDown(e)
            if (CDEUtils.isFunction(cb)) cb(e, this._typingDevice)
        }
        
        const element = global ? document : this._frame
        element.addEventListener("keydown", onkeydown)
        return ()=>element.removeEventListener("keydown", onkeydown)
    }

    // defines the onkeyup listener
    setkeyup(cb, global) {
        const onkeyup=e=>{
            this._typingDevice.setUp(e)
            if (CDEUtils.isFunction(cb)) cb(e, this._typingDevice)
        }

        const element = global ? document : this._frame
        element.addEventListener("keyup", onkeyup)
        return ()=>element.removeEventListener("keyup", onkeyup)
    }

    // returns the center [x,y] of the canvas
    getCenter() {
        return [this.width/2, this.height/2]
    }

    isWithin(pos, padding=0) {
        const [x,y] = pos
        return x >= -padding && x <= this.width+padding && y >= -padding && y <= this.height+padding
    }
    
	get cvs() {return this._cvs}
	get frame() {return this._frame}
	get ctx() {return this._ctx}
	get width() {return this._cvs.width}
	get height() {return this._cvs.height}
	get settings() {return this._settings}
	get loopingCallback() {return this._loopingCallback}
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
    get fpsLimit() {return this._fpsLimit==null||!isFinite(this._fpsLimit) ? null : 1/(this._fpsLimit/1000)}
    get maxTime() {return this.#maxTime}
    get viewPos() {return this._viewPos}

	set loopingCallback(_cb) {this._loopingCallback = _cb}
	set width(w) {this.setSize(w, null)}
	set height(h) {this.setSize(null, h)}
	set offset(offset) {this._offset = offset}
	set fpsLimit(fpsLimit) {
        this._fpsLimit = CDEUtils.isDefined(fpsLimit)&&isFinite(fpsLimit) ? 1000/Math.max(fpsLimit, 0) : null
        this.#maxTime = this.#getMaxTime(fpsLimit)
    }
}