// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Contains and controls a group of dots
class Shape extends _Obj {
    static DEFAULT_LIMIT = 100

    constructor(pos, dots, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, loopCB, anchorPos, alwaysActive, fragile) {
        super(pos, radius??_Obj.DEFAULT_RADIUS, color||Color.DEFAULT_COLOR, setupCB, loopCB, anchorPos, alwaysActive)
        this._limit = limit||Shape.DEFAULT_LIMIT // the delimiter radius within which the drawEffect can take Effect
        this._initDots = dots                    // initial dots declaration
        this._dots = []                          // array containing current dots in the shape
        this._ratioPos = [Infinity,Infinity]     // position of ratio target object 
        this._drawEffectCB = drawEffectCB        // (render, Dot, ratio, setupResults, mouse, distance, parent, isActive, rawRatio)=>
        this._ratioPosCB = ratioPosCB            // custom ratio pos target (Shape, dots)=>
        this._fragile = fragile||false           // whether the shape resets on document visibility change
    }

    // initializes the shape, adds its dots and initializes them
    initialize() {
        this._pos = this.getInitPos()
        this.setAnchoredPos()

        if (Array.isArray(this._initDots) || this._initDots instanceof Dot) this.add(this._initDots)
        else if (CDEUtils.isFunction(this._initDots)) this.add(this._initDots(this, this._parent))
        else if (typeof this._initDots == "string") this.add(this.createFromString(this._initDots))

        this.setRadius(this.getInitRadius(), true)
        this.setColor(this.getInitColor(), true)
        if (this._visualEffects) this.setVisualEffects(this._visualEffects, true)

        this.initialized = true
        if (CDEUtils.isFunction(this._setupCB)) this._setupResults = this._setupCB(this, this?.parent)
    }

    // runs every frame, updates the ratioPos if ratioPosCB is defined
    draw(render, time, deltaTime) {
        super.draw(time, deltaTime)
        if (CDEUtils.isFunction(this._ratioPosCB)) this._ratioPos = this._ratioPosCB(this)
    }

    // adds one or many dots to the shape
    add(dot) {
        this._dots.push(...[dot].flat().filter(dot=>dot).map(dot=>{
            if (dot.initColor==null) dot.initColor = this.colorRaw
            if (dot.initRadius==null) dot.initRadius = this._radius
            if (dot.alwaysActive==null) dot.alwaysActive = this._alwaysActive
            if (dot.visualEffect==null) dot.visualEffect = this.visualEffects_
            dot._parent = this
            dot.initialize()
            return dot
        }))
        this._parent.updateCachedAllEls()
    }

    // remove the shape and all its dots, or a single dot if id is specified
    remove(id=null) {
        if (id) this._dots = this._dots.filter(dot=>dot.id!=id)
        else this._parent.remove(this._id)
        this._parent.updateCachedAllEls()
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
                if (c==dotChar) dots.push(new Dot([atX+gaps[0]/2, atY+gaps[1]/2]))
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
            } else if (!onlyReplaceDefaults) {
                dot.color = color
                if (!dot.initColor) dot.initColor = color
            }
        }
    }

    // updates the visualEffects of all the shape's dots. If "onlyReplaceDefaults" is true, it only sets the dot's visualEffects if it was not initialy set
    setVisualEffects(visualEffects=this._visualEffects, onlyReplaceDefaults) {
        this._visualEffects = visualEffects
        const d_ll = this._dots.length
        for (let i=0;i<d_ll;i++) {
            const dot = this._dots[i]
            if (onlyReplaceDefaults && !dot.visualEffect) dot.visualEffects = visualEffects
            else if (!onlyReplaceDefaults) dot.visualEffects = visualEffects
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
    rotateBy(deg, centerPos=this.getCenter()) {// clock-wise, from the top
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
    rotateAt(deg, centerPos=this.getCenter()) {
        this.rotateBy(360-(this._rotation-deg), centerPos)
    }

    // Smoothly rotates the dots to a specified degree around a specified center point
    rotateTo(deg, time=1000, easing=Anim.easeInOutQuad, centerPos=this.getCenter(), isUnique=true, force=true) {
        const ir = this._rotation, dr = deg-this._rotation

        return this.playAnim(new Anim((prog)=>{
            this.rotateAt(ir+dr*prog, centerPos)
        }, time, easing), isUnique, force)
    }

    // Scales the dots by a specified amount [scaleX, scaleY] from a specified center point
    scaleBy(scale, centerPos=this.getCenter()) {
        const [scaleX, scaleY] = scale, [cx, cy] = centerPos
        this._dots.forEach(dot=>{
            dot.x = (dot.x-cx)*scaleX+cx
            dot.y = (dot.y-cy)*scaleY+cy
        })
        this._scale = [this._scale[0]*scaleX, this._scale[1]*scaleY]
    }

    // Scales the dots to a specified amount [scaleX, scaleY] from a specified center point
    scaleAt(scale, centerPos=this.getCenter()) {
        const dsX = scale[0]/this._scale[0], dsY = scale[1]/this._scale[1]
        this.scaleBy([dsX, dsY], centerPos)
    }

    // Smoothly scales the dots by a specified amount [scaleX, scaleY] from a specified center point
    scaleTo(scale, time=1000, easing=Anim.easeInOutQuad, centerPos=this.getCenter(), isUnique=true, force=true) {
        const is = this._scale, dsX = scale[0]-this._scale[0], dsY = scale[1]-this._scale[1]

        return this.playAnim(new Anim(prog=>{
            this.scaleAt([is[0]+dsX*prog, is[1]+dsY*prog], centerPos)
        }, time, easing), isUnique, force)
    }

    // returns whether the provided pos is inside the area delimited by the dots permimeter
    isWithin(pos) {
        const d_ll = this.dots.length
        if (d_ll > 2) {
            const permimeter = new Path2D(), firstDotPos = this._dots[0].pos
            permimeter.moveTo(firstDotPos[0], firstDotPos[1])
            for (let i=1;i<d_ll;i++) {
                const dotPos = this._dots[i].pos
                permimeter.lineTo(dotPos[0], dotPos[1])
            }
            permimeter.closePath()
            return this.ctx.isPointInPath(permimeter, pos[0], pos[1])
        }
        return false
    }

    // returns the approximated center of the shape, based on its dots pos
    getCenter() {
        const rangeX = CDEUtils.getMinMax(this.dots, "x"), rangeY = CDEUtils.getMinMax(this.dots, "y")
        return [rangeX[0]+(rangeX[1]-rangeX[0])/2, rangeY[0]+(rangeY[1]-rangeY[0])/2]
    }

    // Empties the shapes of all its dots
    clear() {
        this._dots = []
        this._parent.updateCachedAllEls()
    }

    // Rerenders the shape to its original form
    reset() {
        if (this._initDots) {
            this.clear()
            this.initialize()
        }
    }

    // enables path caching for all dots of this shape
    enableDotsPathCaching() {
        const dots = this._dots, d_ll = dots.length
        for (let i=0;i<d_ll;i++) dots[i].updateCachedPath()
    }

    // disables path caching for all dots of this shape
    disableDotsPathCaching() {
        const dots = this._dots, d_ll = dots.length
        for (let i=0;i<d_ll;i++) dots[i].disablePathCaching()
    }

    // returns a separate copy of this Shape (only initialized for objects)
    duplicate(pos=this.pos_, dots=this._dots.map(d=>d.duplicate()), radius=this._radius, color=this._color, limit=this._limit, drawEffectCB=this._drawEffectCB, ratioPosCB=this._ratioPosCB, setupCB=this._setupCB, loopCB=this._loopCB, anchorPos=this._anchorPos, alwaysActive=this._alwaysActive, fragile=this._fragile) {
        const colorObject = color, colorRaw = colorObject.colorRaw, shape = new Shape(
            pos,
            dots,
            radius,
            (_,shape)=>(colorRaw instanceof Gradient||colorRaw instanceof Pattern)?colorRaw.duplicate(Array.isArray(colorRaw.initPositions)?null:shape):colorObject.duplicate(),
            limit,
            drawEffectCB,
            ratioPosCB,
            setupCB,
            loopCB,
            anchorPos,
            alwaysActive,
            fragile
        )
        shape._scale = CDEUtils.unlinkArr2(this._scale)
        shape._rotation = this._rotation
        shape._visualEffects = this.visualEffects_

        return this.initialized ? shape : null
    }

    get cvs() {return this._parent}
    get ctx() {return this.cvs.ctx}
    get render() {return this.cvs.render}
    get dots() {return this._dots}
    get limit() {return this._limit}
	get initDots() {return this._initDots}
    get drawEffectCB() {return this._drawEffectCB}
    get ratioPos() {return this._ratioPos}
    get ratioPosCB() {return this._ratioPosCB}
    get lastDotsPos() {return this._lastDotsPos}
    get dotsPositions() {// returns a string containing all the dot's position
        let currentDotPos="", d_ll = this.dots.length
        for (let i=0;i<d_ll;i++) currentDotPos += this.dots[i].stringPos
        return currentDotPos
    }
    get firstDot() {return this._dots[0]}
    get secondDot() {return this._dots[1]}
    get thirdDot() {return this._dots[2]}
    get lastDot() {return CDEUtils.getLast(this._dots, 0)}
    get asSource() {return this._dots}

    set ratioPos(ratioPos) {this._ratioPos = ratioPos}
    set drawEffectCB(cb) {this._drawEffectCB = cb}
    set ratioPosCB(cb) {this._ratioPosCB = cb}
    set lastDotsPos(ldp) {this._lastDotsPos = ldp}
    set limit(limit) {this._limit = limit}
}