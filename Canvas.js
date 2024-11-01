// JS
// Canvas Dot Effects by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

const DEFAULT_FRAME_SKIPPING_DELAY = 13; DEFAULT_CVSDE_ATTR = "_CVSDE", DEFAULT_CVSFRAMEDE_ATTR = "_CVSDE_F", DEFAULT_CTX_SETTINGS = {"lineCap":"round", "imageSmoothingEnabled":false, "lineWidth":2, "fillStyle":"aliceblue", "stokeStyle":"aliceblue"}, TIMEOUT_FN = window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame, CIRC = 2*Math.PI, DEFAULT_COLOR = "aliceblue", DEFAULT_RGBA=[255,255,255,1], DEFAULT_RADIUS = 5, DEFAULT_CANVAS_WIDTH = 800, DEFAULT_CANVAS_HEIGHT = 800, DEFAULT_CANVAS_STYLES = {position:"absolute",width:"100%",height:"100%","background-color":"transparent",border:"none",outline:"none","pointer-events":"none !important","z-index":0,padding:"0 !important",margin:"0"}, DEFAULT_MOUSE_DECELERATION = 0.8, DEFAULT_MOUSE_MOVE_TRESHOLD = 0.1, DEFAULT_MOUSE_ANGULAR_DECELERATION = 0.2
let idGiver = 0

class Canvas {
    //privates
    #lastFrame = 0  // for delta time
    #frameSkipsOffset = null // for

    constructor(cvs, loopingCallback, frame, settings=DEFAULT_CTX_SETTINGS) {
        this._cvs = cvs                                         //html canvas el
        this._frame = frame??cvs?.parentElement                 //html parent el
        this._cvs.setAttribute(DEFAULT_CVSDE_ATTR, true)        //styles selector
        this._frame.setAttribute(DEFAULT_CVSFRAMEDE_ATTR, true) //styles selector
        this._ctx = this._cvs.getContext("2d", {})              //ctx
        this._settings = this.updateSettings(settings)          //ctx settings

        this._els={refs:[], defs:[]}                            //arrs of objects to .draw() | refs: [{Object._arrName:Object}], defs: [regular drawable objects]

        this._looping = false                                   //loop state
        this._cb=loopingCallback                                //callback called along with the loop() fn

        this._maxDeltaTime = 0.1                                //max delta time in seconds
        this._deltaTime = null                                  //useable delta time in seconds
        this._timeStamp = null                                  //requestanimationframe timestamp in ms
        this._fixedTimeStamp = null                             //fixed (offsets lag spikes) requestanimationframe timestamp in ms

        this._windowListeners = this.initWindowListeners()      //[onresize, onvisibilitychange]
        
        let frameCBR = this._frame?.getBoundingClientRect()??{width:DEFAULT_CANVAS_WIDTH, height:DEFAULT_CANVAS_HEIGHT}
        this.setSize(frameCBR.width, frameCBR.height)           //init size
        this.initStyles()                                       //init styles

        this._mouse = {}                                        //mouse info
        this._offset = this.updateOffset()                      //cvs page offset
    }

    initStyles() {
        let style = document.createElement("style")
        style.appendChild(document.createTextNode(`[${DEFAULT_CVSFRAMEDE_ATTR}]{position:relative !important;}canvas[${DEFAULT_CVSDE_ATTR}]{${Object.entries(DEFAULT_CANVAS_STYLES).reduce((a,b)=>a+=`${b[0]}:${b[1]};`,"")}}`))
        this._cvs.appendChild(style)
    }

    initWindowListeners() {
        const onresize=()=>{this.setSize()},
        onvisibilitychange=()=>{if (!document.hidden) this.reset()}

        window.addEventListener("resize", onresize)
        window.addEventListener("visibilitychange", onvisibilitychange)
        return [()=>window.removeEventListener("resize", onresize), ()=>window.removeEventListener("visibilitychange", onvisibilitychange)]
    }

    updateOffset() {
        let {width, height, x, y} = this._cvs.getBoundingClientRect()
        return this._offset = {x:Math.round((x+width)-this.width+window.scrollX), y:Math.round((y+height)-this.height+window.scrollY)}
    }

    startLoop() {
        if (!this._looping) {
            this._looping = true
            this.loop(0)
        }
    }

    loop(time) {
        let delay = Math.abs((time-this._timeStamp)-this.deltaTime*1000)
        if (this._fixedTimeStamp==0) this._fixedTimeStamp = time-this.#frameSkipsOffset
        if (time && this._fixedTimeStamp && delay < DEFAULT_FRAME_SKIPPING_DELAY) {
            this.calcMouseSpeed()

            this.clear()
            this.draw()
            
            if (this._cb) this._cb() //custom callback

            this._fixedTimeStamp = 0
        } else if (time) {
            this._fixedTimeStamp = time-(this.#frameSkipsOffset += DEFAULT_FRAME_SKIPPING_DELAY)
            this.#frameSkipsOffset += DEFAULT_FRAME_SKIPPING_DELAY
        }

        this._timeStamp = time
        this.calcDeltaTime(time)
        if (this._looping) TIMEOUT_FN(this.loop.bind(this))
    }

    stopLoop() {
        this._looping = false
    }

    calcDeltaTime(time=0) {
        this._deltaTime = Math.min((time-this.#lastFrame)/1000, this._maxDeltaTime)
        this.#lastFrame = time
    }

    draw() {
        [...this._els.defs, ...this.refs, ...this._els.refs.flatMap(x=>{
            let o=Object.entries(x)
            return o[0][1][o[0][0]]
        })].forEach(el=>{
            if (el.draw) el.draw(this._ctx, this._fixedTimeStamp||this._timeStamp)
        })
    }

    clear(x=0, y=0, width, height) {
        this._ctx.clearRect(x??0, y??0, width??this._cvs.width, height??this._cvs.height)
    }

    reset() {
        this.refs.filter(x=>x.fragile).forEach(r=>r.reset())
    }

    setSize(w, h) {
        let {width, height} = this._frame.getBoundingClientRect()
        if (w!==null) this._cvs.width = w??width
        if (h!==null) this._cvs.height = h??height
        this.updateSettings()
        this.updateOffset()
    }

    updateSettings(settings) {
        let st = settings||this._settings
        Object.entries(st).forEach(s=>this._ctx[s[0]]=s[1])
        return this._settings=st
    }

    add(objs, isDef) {
        let l = objs.length??1
        for (let i=0;i<l;i++) {
            let o = objs[i]??objs
            if (!isDef) {
                let ref = Object.values(o)[0]
                ref.cvs = this
                ref.initialize()
            } else {
                o.parent = this
                o.initialize()
            }
            this._els[isDef?"defs":"refs"].push(o)
        }
    }

    remove(id) {
        this._els.defs = this._els.defs.filter(x=>x.id!==id)
        this._els.refs = this._els.refs.filter(x=>Object.values(x)[0].id!==id)
    }

    get(id) {
        return this.allEls.find(el=>el.id == id)
    }

    getObjs(instance) {
        return this._els.defs.filter(x=>x instanceof instance)
    }

    calcMouseSpeed() {
        // MOUSE SPEED
        if (isFinite(this._mouse.lastX) && isFinite(this._mouse.lastY) && this._deltaTime) {
            this._mouse.speed = this._mouse.speed*DEFAULT_MOUSE_DECELERATION+(getDist(this._mouse.x, this._mouse.y, this._mouse.lastX, this._mouse.lastY)/this._deltaTime)*(1-DEFAULT_MOUSE_DECELERATION)
            if (this._mouse.speed < DEFAULT_MOUSE_MOVE_TRESHOLD) this._mouse.speed = 0
        } else this._mouse.speed = 0

        this._mouse.lastX = this._mouse.x
        this._mouse.lastY = this._mouse.y
    }

    #mouseMovements(cb, e) {
        this.refs.forEach(r=>{
            if (r.ratioPosCB===undefined) r.ratioPos=[this._mouse.x,this._mouse.y]
        })
        if (typeof cb == "function") cb(this._mouse, e)
    }

    setmousemove(cb) {
        const onmousemove=e=>{
            // MOUSE POS
            this._mouse.x = e.x-this._offset.x,
            this._mouse.y = e.y-this._offset.y

            // MOUSE ANGLE
            let dx = this._mouse.x-this._mouse.lastX, dy = this._mouse.y-this._mouse.lastY
            if (isFinite(dx) && isFinite(dy) && (dx||dy)) {
                    let angle = (-toDeg(Math.atan2(dy, dx))+360)%360
                    let diff = angle-this._mouse.dir
                    diff += (360*(diff<-180))-(360*(diff>180))

                    this._mouse.dir = (this._mouse.dir+diff*DEFAULT_MOUSE_ANGULAR_DECELERATION+360)%360
            } else this._mouse.dir = 0

            this.#mouseMovements(cb, e)
        }
        this._frame.addEventListener("mousemove", onmousemove)
        return ()=>this._frame.removeEventListener("mousemove", onmousemove)
    }

    setmouseleave(cb) {
        const onmouseleave=e=>{
            this._mouse = {x:Infinity, y:Infinity}
            this.#mouseMovements(cb, e)
        }
        this._frame.addEventListener("mouseleave", onmouseleave)
        return ()=>this._frame.removeEventListener("mouseleave", onmouseleave)
    }

    #mouseClicks(cb, e) {
        let v = e.type=="mousedown"
        if (e.button==0) this._mouse.clicked = v
        else if (e.button==1) this._mouse.scrollClicked = v
        else if (e.button==2) this._mouse.rightClicked = v
        else if (e.button==3) this._mouse.extraBackClicked = v
        else if (e.button==4) this._mouse.extraForwardClicked = v

        if (typeof cb == "function") cb(this._mouse, e)
    }

    setmousedown(cb) {
        const onmousedown=e=>this.#mouseClicks(cb, e)
        
        this._frame.addEventListener("mousedown", onmousedown)
        return ()=>this._frame.removeEventListener("mousedown", onmousedown)
    }

    setmouseup(cb) {
        const onmouseup=e=>this.#mouseClicks(cb, e)
        
        this._frame.addEventListener("mouseup", onmouseup)
        return ()=>this._frame.removeEventListener("mouseup", onmouseup)
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
	get maxDeltaTime() {return this._maxDeltaTime}
	get windowListeners() {return this._windowListeners}
	get timestamp() {return this._timeStamp}
	get els() {return this._els}
	get mouse() {return this._mouse}
	get offset() {return this._offset}
    get defs() {return this._els.defs}
    get refs() {return this._els.refs.flatMap(x=>Object.values(x))}
    get allEls() {return this.defs.concat(this.refs)}

	set cb(_cb) {return this._cb = _cb}
	set width(w) {this.setSize(w, null)}
	set height(h) {this.setSize(null, h)}
	set mouse(m) {this._mouse = m}
}