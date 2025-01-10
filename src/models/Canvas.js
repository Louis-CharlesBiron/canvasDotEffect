// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

const CDE_CANVAS_DEFAULT_TIMEOUT_FN = window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame

// Represents a html canvas element
class Canvas {
    static ELEMENT_ID_GIVER = 0
    static DEFAULT_MAX_DELTATIME= 0.13
    static DEFAULT_CANVAS_ACTIVE_AREA_PADDING = 20
    static DEFAULT_CVSDE_ATTR = "_CVSDE"
    static DEFAULT_CVSFRAMEDE_ATTR = "_CVSDE_F"
    static DEFAULT_CTX_SETTINGS = {"lineCap":"round", "imageSmoothingEnabled":false, "lineWidth":2, "fillStyle":"aliceblue", "stokeStyle":"aliceblue"}
    static DEFAULT_CANVAS_WIDTH = 800
    static DEFAULT_CANVAS_HEIGHT = 800
    static DEFAULT_CANVAS_STYLES = {position:"absolute",width:"100%",height:"100%","background-color":"transparent",border:"none",outline:"none","pointer-events":"none !important","z-index":0,padding:"0 !important",margin:"0"}

    #lastFrame = 0  // used for delta time calcultions
    #deltaTimeCap = Canvas.DEFAULT_MAX_DELTATIME // used to prevent significant delta time gaps
    #frameSkipsOffset = null // used to prevent significant frame gaps
    #timeStamp = null  // requestanimationframe timestamp in ms

    constructor(cvs, loopingCallback, frame, settings=Canvas.DEFAULT_CTX_SETTINGS) {
        this._cvs = cvs                                         //html canvas element
        this._frame = frame??cvs?.parentElement                 //html parent of canvas element
        this._cvs.setAttribute(Canvas.DEFAULT_CVSDE_ATTR, true)        //set styles selector
        this._frame.setAttribute(Canvas.DEFAULT_CVSFRAMEDE_ATTR, true) //set styles selector
        this._ctx = this._cvs.getContext("2d")                  //canvas context
        this._settings = this.updateSettings(settings)          //set context settings

        this._els={refs:[], defs:[]}                            //arrs of objects to .draw() | refs (source): [Object that contains drawable obj], defs: [regular drawable objects]

        this._looping = false                                   //loop state
        this._cb = loopingCallback                              //custom callback called along with the loop() function

        this._deltaTime = null                                  //useable delta time in seconds
        this._fixedTimeStamp = null                             //fixed (offsets lag spikes) requestanimationframe timestamp in ms

        this._windowListeners = this.#initWindowListeners()      //[onresize, onvisibilitychange]
        
        let frameCBR = this._frame?.getBoundingClientRect()??{width:Canvas.DEFAULT_CANVAS_WIDTH, height:Canvas.DEFAULT_CANVAS_HEIGHT}
        this.setSize(frameCBR.width, frameCBR.height)           //init size
        this.#initStyles()                                       //init styles

        this._mouse = new Mouse()                               //mouse info
        this._offset = this.updateOffset()                      //cvs page offset
    }

    // sets css styles on the canvas and the parent
    #initStyles() {
        let style = document.createElement("style")
        style.appendChild(document.createTextNode(`[${Canvas.DEFAULT_CVSFRAMEDE_ATTR}]{position:relative !important;}canvas[${Canvas.DEFAULT_CVSDE_ATTR}]{${Object.entries(Canvas.DEFAULT_CANVAS_STYLES).reduce((a,b)=>a+=`${b[0]}:${b[1]};`,"")}}`))
        this._cvs.appendChild(style)
    }

    // sets resize and visibility change listeners on the window
    #initWindowListeners() {
        const onresize=()=>{this.setSize()},
        onvisibilitychange=()=>{if (!document.hidden) this.reset()}

        window.addEventListener("resize", onresize)
        window.addEventListener("visibilitychange", onvisibilitychange)
        return [()=>window.removeEventListener("resize", onresize), ()=>window.removeEventListener("visibilitychange", onvisibilitychange)]
    }

    // updates the calculated canvas offset in the page
    updateOffset() {
        let {width, height, x, y} = this._cvs.getBoundingClientRect()
        return this._offset = {x:Math.round((x+width)-this.width+window.scrollX), y:Math.round((y+height)-this.height+window.scrollY)}
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
        let delay = Math.abs((time-this.#timeStamp)-this.deltaTime*1000)
        if (this._fixedTimeStamp==0) this._fixedTimeStamp = time-this.#frameSkipsOffset
        if (time && this._fixedTimeStamp && delay < Canvas.DEFAULT_MAX_DELTATIME*1000) {

            this._mouse.calcSpeed(this._deltaTime)

            this.clear()
            this.draw()
            
            if (typeof this._cb == "function") this._cb()

            this._fixedTimeStamp = 0

        } else if (time) {
            this._fixedTimeStamp = time-(this.#frameSkipsOffset += Canvas.DEFAULT_MAX_DELTATIME*1000)
            this.#frameSkipsOffset += Canvas.DEFAULT_MAX_DELTATIME*1000
        }

        this.#timeStamp = time
        this.#calcDeltaTime(time)
        if (this._looping) CDE_CANVAS_DEFAULT_TIMEOUT_FN(this.#loop.bind(this))
    }

    // stops the loop
    stopLoop() {
        this._looping = false
    }

    // calculates and sets the deltaTime
    #calcDeltaTime(time=0) {
        this._deltaTime = Math.min((time-this.#lastFrame)/1000, this.#deltaTimeCap)
        this.#lastFrame = time
    }

    // calls the draw function on all canvas objects
    draw() {
        let els = this.refs.concat(this._els.refs.flatMap(source=>source.asSource)).concat(this._els.defs), els_ll = els.length

        for (let i=0;i<els_ll;i++) {
            const el = els[i]
            if (!el.draw || !this.isWithin(el.pos, Canvas.DEFAULT_CANVAS_ACTIVE_AREA_PADDING)) continue
            el.draw(this._ctx, this.timeStamp, this._deltaTime)
        }
    }

    // clears the canvas
    clear(x=0, y=0, width, height) {
        this._ctx.clearRect(x??0, y??0, width??this._cvs.width, height??this._cvs.height)
    }

    // resets every fragile source
    reset() {
        this.refs.filter(source=>source.fragile).forEach(r=>r.reset())
    }

    // sets the width and height in px of the canvas element
    setSize(w, h) {
        let {width, height} = this._frame.getBoundingClientRect()
        if (w!==null) this._cvs.width = w??width
        if (h!==null) this._cvs.height = h??height
        this.updateSettings()
        this.updateOffset()
    }

    // updates current canvas settings
    updateSettings(settings) {
        let st = settings||this._settings
        Object.entries(st).forEach(s=>this._ctx[s[0]]=s[1])
        return this._settings=st
    }

    // add 1 or many objects, as a (def)inition or as a (ref)erence (source)
    add(objs, isDef) {
        let l = objs.length??1
        for (let i=0;i<l;i++) {
            let obj = objs[i]??objs
            if (!isDef) {
                obj.cvs = this
                if (typeof obj.initialize=="function") obj.initialize()
            } else {
                obj.parent = this
                if (typeof obj.initialize=="function") obj.initialize()
            }
            this._els[isDef?"defs":"refs"].push(obj)
        }
    }

    // removes any element from the canvas by id
    remove(id) {
        this._els.defs = this._els.defs.filter(el=>el.id!==id)
        this._els.refs = this._els.refs.filter(source=>source.id!==id)
    }

    // get any element from the canvas by id
    get(id) {
        return this.allEls.find(el=>el.id == id)
    }

    // removes any element from the canvas by instance type
    getObjs(instance) {
        return this._els.defs.filter(x=>x instanceof instance)
    }

    // called on mouse move
    #mouseMovements(cb, e) {
        // update ratioPos to mouse pos if not overwritten
        let r_ll = this.refs.length
        for (let i=0;i<r_ll;i++) {
            let ref = this.refs[i]
            if (!ref.ratioPosCB && ref.ratioPosCB !== false) ref.ratioPos=this._mouse.pos
        }
        // custom move callback
        if (typeof cb == "function") cb(this._mouse, e)

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
        if (typeof cb == "function") cb(this._mouse, e)
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

    // returns the center [x,y] of the canvas
    getCenter() {
        return [this.width/2, this.height/2]
    }

    isWithin(pos, padding=0) {
        let [x,y]=pos
        return x >= -padding && x <= this.width+padding && y >= -padding && y <= this.height+padding
    }
    
	get cvs() {return this._cvs}
	get frame() {return this._frame}
	get ctx() {return this._ctx}
	get width() {return this._cvs.width}
	get height() {return this._cvs.height}
	get settings() {return this._settings}
	get cb() {return this._cb}
	get looping() {return this._looping}
	get deltaTime() {return this._deltaTime}
	get deltaTimeCap() {return this.#deltaTimeCap}
	get windowListeners() {return this._windowListeners}
	get timeStamp() {return this._fixedTimeStamp||this.#timeStamp}
	get timeStampRaw() {return this.#timeStamp}
	get els() {return this._els}
	get mouse() {return this._mouse}
	get offset() {return this._offset}
    get defs() {return this._els.defs}
    get refs() {return this._els.refs}
    get allDefsAndRefs() {return this.defs.concat(this.refs)}
    get allEls() {return this.allDefsAndRefs.flatMap(x=>x.dots||x)}

	set cb(_cb) {return this._cb = _cb}
	set width(w) {this.setSize(w, null)}
	set height(h) {this.setSize(null, h)}
}