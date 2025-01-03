// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Contains and controls a group of dots
class Shape extends Obj {    
    constructor(pos, dots, radius, rgba, limit, drawEffectCB, ratioPosCB, setupCB, fragile) {
        super(pos, radius, rgba, setupCB)
        this._cvs = null                        // CVS instance
        this._limit = limit||DEFAULT_LIMIT      // the delimiter radius within which the drawEffect can take Effect
        this._initDots = dots                   // initial dots declaration
        this._dots = []                         // array containing current dots in the shape
        this._ratioPos = [Infinity,Infinity]    // position of ratio target object 
        this._drawEffectCB = drawEffectCB       // (ctx, Dot, ratio, mouse, distance, parent, rawRatio)=>
        this._ratioPosCB = ratioPosCB           // custom ratio pos target (Shape, dots)=>
        this._fragile = fragile||false          // whether the shape resets on document visibility change 

        this._rotation = 0                      // the shape's rotation in degrees 
        this._scale = [1,1]                     // the shape's scale factor: [scaleX, scaleY] 
    }

    // initializes the shape, adds its dots and initializes them
    initialize() {
        if (typeof this._initDots == "string") this.createFromString(this._initDots)
        else if (typeof this._initDots == "function") this.add(this._initDots(this, this._cvs))
        else if (this._initDots?.length) this.add(this._initDots)
        
        super.initialize()

        this._dots.forEach(d=>d.initialize())
    }

    // runs every frame, updates the ratioPos if ratioPosCB is defined
    draw(ctx, time) {
        super.draw(ctx, time)
        if (typeof this._ratioPosCB == "function") this._ratioPos = this._ratioPosCB(this)
    }

    // adds a or many dots to the shape
    add(dot) {
        this._dots.push(...[dot].flat().map(dot=>{
            dot.rgba = [...this._rgba]
            dot.radius ??= this._radius
            dot.parent = this
            return dot
        }))
    }

    // remove a dot from the shape by its id or by its instance
    removeDot(idOrDot) {
        this._dots = this._dots.filter(dot=>dot.id!==(idOrDot?.id??idOrDot))
    }

    // remove the shape and all its dots
    remove() {
        this._cvs.remove(this._id)
    }

    /**
     * Can be used as a primitive/fast way to create a formation of dots, using text drawing 
     * @param {String} str: ex: "oo o o \n ooo \n ooo" 
     * @param {pos[x,y]} topLeftPos: starting pos of the formation
     * @param {[gapX, gapY]} gaps: the x and y distance between each dot
     * @param {Character} dotChar: the character used in the creation string other than the spaces
     * @returns the created dots formation
     */
    createFromString(str, topLeftPos=[0,0], gaps=[25, 25], dotChar="o") {
        let dots = []
        str.split("\n").filter(x=>x).forEach((x,i)=>{
            let [atX, atY] = topLeftPos
            atY+=i*gaps[1]
            ;[...x].forEach(c=>{
                if (c==dotChar) dots.push(new Dot([atX+gaps[0]/2, atY+gaps[1]/2]))
                atX+=gaps[0]
            })
        })
        return dots
    }
 
    // updates the radius of all the shape's dots
    setRadius(radius) {
        this._radius = radius
        this._dots.forEach(x=>x.radius=radius)
    }

    // updates the rgba of all the shape's dots
    setRGBA(rgba) {
        this._rgba = rgba
        this._dots.forEach(x=>x.rgba=rgba)
    }

    // updates the limit of all the shape's dots
    setLimit(limit) {
        this._limit = limit
        this._dots.forEach(x=>x.limit=limit)
    }

    // moves the shape and all its dots in specified direction at specified distance(force)
    addForce(force, dir, time=1000, easing=Anim.easeInOutQuad) {
        let rDir = toRad(dir), ix = this.x, iy = this.y,
            dx = getAcceptableDif(force*Math.cos(rDir), ACCEPTABLE_DIF),
            dy = getAcceptableDif(force*Math.sin(rDir), ACCEPTABLE_DIF)
        
        return this.queueAnim(new Anim((prog)=>{
            this.moveAt([ix+dx*prog, iy-dy*prog])
        }, time, easing, ()=>this._anims.shift()), true)
    }

    // Teleports the shape and all its dots to incremented coords
    moveBy(pos) {
        super.moveBy(pos)
        this._dots.forEach(dot=>{
            if (pos[0] !== null && pos[0] !== undefined) dot.x += pos[0]
            if (pos[1] !== null && pos[1] !== undefined) dot.y += pos[1]
        })
    }

    // Teleports the shape and all its dots to given coords
    moveAt(pos) {
        const dx = pos[0]-this.x, dy = pos[1]-this.y
        this._dots.forEach(d=>{
            if (dx) d.x += dx
            if (dy) d.y += dy
        })
        super.moveAt(pos)
    }

    // Smoothly moves the shape and all its dots to given coords in set time
    moveTo(pos, time=1000, easing=Anim.easeInOutQuad, force=true, initPos=this.pos) {
        let [ix, iy] = initPos,
        dx = pos[0]-ix,
        dy = pos[1]-iy

        return this.queueAnim(new Anim((prog)=>{
            this.moveAt([ix+dx*prog, iy+dy*prog])
        }, time, easing, ()=>this._anims.shift()), force)
    }

    // Rotates the dots by a specified degree increment around a specified center point
    rotateBy(deg, centerPos=this.pos) {// clock-wise, from the top
        let [cx, cy] = centerPos
        this._dots.forEach(dot=>{
            let x = dot.x-cx, y = dot.y-cy,
                cosV = Math.cos(toRad(deg)), sinV = Math.sin(toRad(deg))
                
            dot.x = (x*cosV-y*sinV)+cx
            dot.y = (x*sinV+y*cosV)+cy
        })

        this._rotation = (this._rotation+deg)%360
    }

    // Rotates the dots to a specified degree around a specified center point
    rotateAt(deg, centerPos=this.pos) {
        this.rotateBy(360-(this._rotation-deg), centerPos)
    }

    // Smoothly rotates the dots to a specified degree around a specified center point
    rotateTo(deg, time=1000, easing=Anim.easeInOutQuad, force=true, centerPos=this.pos) {
        let ir = this._rotation, dr = deg-this._rotation

        return this.queueAnim(new Anim((prog)=>{
            this.rotateAt(ir+dr*prog, centerPos)
        }, time, easing, ()=>this._anims.shift()), force)
    }

    // Scales the dots by a specified amount [scaleX, scaleY] from a specified center point
    scaleBy(scale, centerPos=this.pos) {
        let [scaleX, scaleY] = scale, [cx, cy] = centerPos
        this._dots.forEach(dot=>{
            dot.x = (dot.x-cx)*scaleX+cx
            dot.y = (dot.y-cy)*scaleY+cy
        })
        this._scale = [this._scale[0]*scaleX, this._scale[1]*scaleY]
    }

    // Scales the dots to a specified amount [scaleX, scaleY] from a specified center point
    scaleAt(scale, centerPos=this.pos) {
        let dsX = scale[0]/this._scale[0], dsY = scale[1]/this._scale[1]
        this.scaleBy([dsX, dsY], centerPos)
    }

    // Smoothly scales the dots by a specified amount [scaleX, scaleY] from a specified center point
    scaleTo(scale, time=1000, easing=Anim.easeInOutQuad, force=true, centerPos=this.pos) {
        let is = this._scale, dsX = scale[0]-this._scale[0], dsY = scale[1]-this._scale[1]

        return this.queueAnim(new Anim(prog=>{
            this.scaleAt([is[0]+dsX*prog, is[1]+dsY*prog], centerPos)
        }, time, easing, ()=>this._anims.shift()), force)
    }

    // Empties the shapes of all its dots
    clear() {
        this._dots = []
    }

    // Rerenders the shape to its original form
    reset() {
        if (this._initDots) {
            this.clear()
            this.initialize()
        }
    }

    get cvs() {return this._cvs}
    get ctx() {return this._cvs.ctx}
    get dots() {return this._dots}
    get limit() {return this._limit}
	get initDots() {return this._initDots}
    get drawEffectCB() {return this._drawEffectCB}
    get ratioPos() {return this._ratioPos}
    get ratioPosCB() {return this._ratioPosCB}
    get rotation() {return this._rotation}
    get lastDotsPos() {return this._lastDotsPos}
    get dotsPositions() {// returns a string containing all the dot's position
        let currentDotPos="", d_ll = this.dots.length
        for (let i=0;i<d_ll;i++) currentDotPos += this.dots[i].stringPos
        return currentDotPos
    }
    get asSource() {return this._dots}
    static get childrenPath() {return "dots"}

    set cvs(cvs) {this._cvs = cvs}
    set ratioPos(ratioPos) {this._ratioPos = ratioPos}
    set drawEffectCB(cb) {this._drawEffectCB = cb}
    set ratioPosCB(cb) {this._ratioPosCB = cb}
    set lastDotsPos(ldp) {this._lastDotsPos = ldp}
}