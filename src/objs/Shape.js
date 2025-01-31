// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Contains and controls a group of dots
class Shape extends Obj {
    static DEFAULT_LIMIT = 100

    constructor(pos, dots, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, anchorPos, alwaysActive, fragile) {
        super(pos, radius??Obj.DEFAULT_RADIUS, color||Color.DEFAULT_COLOR, setupCB, anchorPos, alwaysActive)
        this._cvs = null                         // CVS instance
        this._limit = limit||Shape.DEFAULT_LIMIT // the delimiter radius within which the drawEffect can take Effect
        this._initDots = dots                    // initial dots declaration
        this._dots = []                          // array containing current dots in the shape
        this._ratioPos = [Infinity,Infinity]     // position of ratio target object 
        this._drawEffectCB = drawEffectCB        // (ctx, Dot, ratio, mouse, distance, parent, rawRatio)=>
        this._ratioPosCB = ratioPosCB            // custom ratio pos target (Shape, dots)=>
        this._fragile = fragile||false           // whether the shape resets on document visibility change

        this._rotation = 0                       // the shape's rotation in degrees 
        this._scale = [1,1]                      // the shape's scale factor: [scaleX, scaleY] 
    }

    // initializes the shape, adds its dots and initializes them
    initialize() {
        this._pos = this.getInitPos()
        this.setAnchoredPos()

        if (Array.isArray(this._initDots) || this._initDots instanceof Dot) this.add(this._initDots)
        else if (CDEUtils.isFunction(this._initDots)) this.add(this._initDots(this, this._cvs))
        else if (typeof this._initDots === "string") this.add(this.createFromString(this._initDots))

        this.setRadius(this.getInitRadius(), true)
        this.setColor(this.getInitColor(), true)

        if (CDEUtils.isFunction(this._setupCB)) this._setupResults = this._setupCB(this, this?.parent)
        this.initialized = true
    }

    // runs every frame, updates the ratioPos if ratioPosCB is defined
    draw(ctx, time, deltaTime) {
        super.draw(ctx, time, deltaTime)
        if (CDEUtils.isFunction(this._ratioPosCB)) this._ratioPos = this._ratioPosCB(this)
    }

    // returns a separate copy of this Shape (only initialized for objects)
    duplicate() {
        return this.initialized ? new Shape(this.pos_, this._dots.map(d=>d.duplicate()), this.radius, this.colorObject.duplicate(), this.limit, this._drawEffectCB, this._ratioPosCB, this.setupCB, this._fragile) : null
    }

    // adds one or many dots to the shape
    add(dot) {
        this._dots.push(...[dot].flat().map(dot=>{
            if (dot.initColor==null) dot.initColor = this.colorRaw
            if (dot.initRadius==null) dot.initRadius = this._radius
            if (dot.alwaysActive==null) dot.alwaysActive = this._alwaysActive
            dot.parent = this
            dot.initialize()
            return dot
        }))
        this._cvs.updateCachedAllEls()
    }

    // remove a dot from the shape by its id or by its instance
    removeDot(idOrDot) {
        this._dots = this._dots.filter(dot=>dot.id!==(idOrDot?.id??idOrDot))
        this._cvs.updateCachedAllEls()
    }

    // remove the shape and all its dots
    remove() {
        this._cvs.remove(this._id)
        this._cvs.updateCachedAllEls()
    }

    /**
     * The generate() function allows the generation of custom formations of dot
     * @param {Function} yTrajectory: a function providing a Y value depanding on a given X value
     * @param {Number} startOffset: pos array representing the starting position offset
     * @param {Number} length: the width in pixels of the generation result
     * @param {Number} gapX: the gap in pixel skipped between each generation
     * @param {[Number, Number]} yModifier: a range allowing random Y offsets
     * @param {Function?} generationCallback: custom callback called on each generation (this, lastDot)=>
     * @returns The generated Dots
     */
    static generate(yTrajectory, startOffset, length, gapX, yModifier, generationCallback) {
        yTrajectory??=x=>0
        startOffset??=[0,0]
        length??=100
        gapX??=1
        yModifier??=[-50, 50]

        let dots = [], lastDot = null
        for (let x=0;x<=length;x+=CDEUtils.getValueFromRange(gapX)) {
            const dot = new Dot([startOffset[0]+x, startOffset[1]+CDEUtils.getValueFromRange(yModifier)+yTrajectory(x)])
            if (lastDot && CDEUtils.isFunction(generationCallback)) generationCallback(dot, lastDot)
            dots.push(dot)
            lastDot = dot
        }
        return dots
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
        const dots = []
        str.split("\n").filter(x=>x).forEach((x,i)=>{
            let [atX, atY] = topLeftPos
            atY+=i*gaps[1]
            ;[...x].forEach(c=>{
                if (c===dotChar) dots.push(new Dot([atX+gaps[0]/2, atY+gaps[1]/2]))
                atX+=gaps[0]
            })
        })
        return dots
    }
 
    // updates the radius of all the shape's dots. If "onlyReplaceDefaults" is true, it only sets the dot's radius if it was not initialy set
    setRadius(radius=this._radius, onlyReplaceDefaults) {
        this._radius = radius
        const d_ll = this._dots.length
        for (let i=0;i<d_ll;i++) {
            const dot = this._dots[i]
            if (onlyReplaceDefaults && dot.initRadius==null) {
                dot.radius = radius
                dot.initRadius = radius
            }
            else if (!onlyReplaceDefaults) {
                dot.radius = radius
                if (!dot.initRadius) dot.initRadius = radius
            }
        }
    }

    // updates the color of all the shape's dots. If "onlyReplaceDefaults" is true, it only sets the dot's color if it was not initialy set
    setColor(color=this._color, onlyReplaceDefaults) {
        this.color = color
        const d_ll = this._dots.length
        for (let i=0;i<d_ll;i++) {
            const dot = this._dots[i]
            if (onlyReplaceDefaults && !dot.initColor) {
                dot.color = color
                dot.initColor = color
            }
            else if (!onlyReplaceDefaults) {
                dot.color = color
                if (!dot.initColor) dot.initColor = color
            }
        }
    }

    // moves the shape and all its dots in specified direction at specified distance(force)
    addForce(force, dir, time=1000, easing=Anim.easeInOutQuad, isUnique=true, animForce=true) {
        const rDir = CDEUtils.toRad(dir), ix = this.x, iy = this.y,
            dx = CDEUtils.getAcceptableDiff(force*Math.cos(rDir), CDEUtils.DEFAULT_ACCEPTABLE_DIFFERENCE),
            dy = CDEUtils.getAcceptableDiff(force*Math.sin(rDir), CDEUtils.DEFAULT_ACCEPTABLE_DIFFERENCE)
        
        return this.playAnim(new Anim((prog)=>{
            this.moveAt([ix+dx*prog, iy-dy*prog])
        }, time, easing), isUnique, animForce)
    }

    // Rotates the dots by a specified degree increment around a specified center point
    rotateBy(deg, centerPos=this.pos) {// clock-wise, from the top
        const [cx, cy] = centerPos
        this._dots.forEach(dot=>{
            const x = dot.x-cx, y = dot.y-cy,
                cosV = Math.cos(CDEUtils.toRad(deg)), sinV = Math.sin(CDEUtils.toRad(deg))
                
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
    rotateTo(deg, time=1000, easing=Anim.easeInOutQuad, centerPos=this.pos, isUnique=true, force=true) {
        const ir = this._rotation, dr = deg-this._rotation

        return this.playAnim(new Anim((prog)=>{
            this.rotateAt(ir+dr*prog, centerPos)
        }, time, easing), isUnique, force)
    }

    // Scales the dots by a specified amount [scaleX, scaleY] from a specified center point
    scaleBy(scale, centerPos=this.pos) {
        const [scaleX, scaleY] = scale, [cx, cy] = centerPos
        this._dots.forEach(dot=>{
            dot.x = (dot.x-cx)*scaleX+cx
            dot.y = (dot.y-cy)*scaleY+cy
        })
        this._scale = [this._scale[0]*scaleX, this._scale[1]*scaleY]
    }

    // Scales the dots to a specified amount [scaleX, scaleY] from a specified center point
    scaleAt(scale, centerPos=this.pos) {
        const dsX = scale[0]/this._scale[0], dsY = scale[1]/this._scale[1]
        this.scaleBy([dsX, dsY], centerPos)
    }

    // Smoothly scales the dots by a specified amount [scaleX, scaleY] from a specified center point
    scaleTo(scale, time=1000, easing=Anim.easeInOutQuad, centerPos=this.pos, isUnique=true, force=true) {
        const is = this._scale, dsX = scale[0]-this._scale[0], dsY = scale[1]-this._scale[1]

        return this.playAnim(new Anim(prog=>{
            this.scaleAt([is[0]+dsX*prog, is[1]+dsY*prog], centerPos)
        }, time, easing), isUnique, force)
    }

    // returns whether the provided pos is inside the area delimited by the dots permimeter
    isWithin(pos) {
        const d_ll = this.dots.length
        if (d_ll > 2) {
            const permimeter = new Path2D()
            permimeter.moveTo(...this.dots[0].pos)
            for (let i=1;i<d_ll;i++) permimeter.lineTo(...this.dots[i].pos)
            permimeter.closePath()

            return this.ctx.isPointInPath(permimeter, ...pos)
        }
        return false
    }

    getCenter() {
        const rangeX = CDEUtils.getMinMax(this.dots, "x"), rangeY = CDEUtils.getMinMax(this.dots, "y")
        return [rangeX[0]+(rangeX[1]-rangeX[0])/2, rangeY[0]+(rangeY[1]-rangeY[0])/2]
    }

    // Empties the shapes of all its dots
    clear() {
        this._dots = []
        this._cvs.updateCachedAllEls()
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
    get dotsPos() {return this._dots.map(dot=>dot.pos)}
    get limit() {return this._limit}
	get initDots() {return this._initDots}
    get drawEffectCB() {return this._drawEffectCB}
    get ratioPos() {return this._ratioPos}
    get ratioPosCB() {return this._ratioPosCB}
    get rotation() {return this._rotation}
    get rotation() {return this._scale}
    get lastDotsPos() {return this._lastDotsPos}
    get dotsPositions() {// returns a string containing all the dot's position
        let currentDotPos="", d_ll = this.dots.length
        for (let i=0;i<d_ll;i++) currentDotPos += this.dots[i].stringPos
        return currentDotPos
    }
    get firstDot() {return this._dots[0]}
    get secondDot() {return this._dots[1]}
    get thirdDot() {return this._dots[2]}
    get asSource() {return this._dots}

    set cvs(cvs) {this._cvs = cvs}
    set ratioPos(ratioPos) {this._ratioPos = ratioPos}
    set drawEffectCB(cb) {this._drawEffectCB = cb}
    set ratioPosCB(cb) {this._ratioPosCB = cb}
    set lastDotsPos(ldp) {this._lastDotsPos = ldp}
    set limit(limit) {this._limit = limit}
}