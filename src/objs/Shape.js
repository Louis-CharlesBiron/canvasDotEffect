// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

class Shape extends _Obj {
    static DEFAULT_LIMIT = 100
    static DEFAULT_RATIO_POS = [Infinity, Infinity]

    /**
     * Contains and controls a group of dots
     * @param {[x,y]?} pos: the pos of the object 
     * @param {Dot | Dot[] ?} dots: array containing current dots in the shape
     * @param {Number?} radius: the radius of the dots
     * @param {Color | String | [r,g,b,a]?} color: the color of the dots
     * @param {Number?} limit: the delimiter radius within which the drawEffectCB can take effect
     * @param {Function?} drawEffectCB: a function called every frame for each dot of the shape, used to create effects. (render, dot, ratio, setupResults, mouse, distance, parent, isActive, rawRatio)=>
     * @param {Function?} ratioPosCB: a function that returns a ratio pos target for calculating the dots ratio attribute. (this, dots)=>{return [x,y]}
     * @param {Function?} setupCB: function called on object's initialization (this, parent)=>{...}
     * @param {Function?} loopCB: function called each frame for this object (this)=>{...}
     * @param {[x,y] | Function | _BaseObj ?} anchorPos: reference point from which the object's pos will be set. Either a pos array, a callback (this, parent)=>{return [x,y] | _baseObj} or a _BaseObj inheritor
     * @param {Number | Boolean ?} activationMargin: the pixel margin amount from where the object remains active when outside the canvas visual bounds. If "true", the object will always remain active.
     * @param {Boolean?} fragile: (DEPRECATED) whether the shape resets on document visibility change 
     */
    constructor(pos, dots, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, loopCB, anchorPos, activationMargin, fragile) {
        super(pos, radius??_Obj.DEFAULT_RADIUS, color||Color.DEFAULT_COLOR, setupCB, loopCB, anchorPos, activationMargin)
        this._limit = limit||Shape.DEFAULT_LIMIT // the delimiter radius within which the drawEffectCB can take effect
        this._initDots = dots                    // initial dots declaration
        this._dots = []                          // array containing current dots in the shape
        this._ratioPos = [...Shape.DEFAULT_RATIO_POS]// position of ratio target object 
        this._drawEffectCB = drawEffectCB        // (render, Dot, ratio, setupResults, mouse, distance, parent, isActive, rawRatio)=>
        this._ratioPosCB = ratioPosCB            // custom ratio pos target (Shape, dots)=>{return [x,y]}
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

    /**
     * Adds one or many dots to the shape
     * @param {Dot | Dot[]} dots: one or many dots to add
     */
    add(dots) {
        this._dots.push(...[dots].flat().filter(dot=>dot).map(dot=>{
            if (dot.initColor==null) dot.initColor = this.colorRaw
            if (dot.initRadius==null) dot.initRadius = this._radius
            if (dot.activationMargin==Canvas.DEFAULT_CANVAS_ACTIVE_AREA_PADDING) dot.activationMargin = this._activationMargin
            if (dot.visualEffect==null) dot.visualEffect = this.visualEffects_
            dot._parent = this
            dot.initialize()
            return dot
        }))
        this._parent.updateCachedAllEls()
    }

    /**
     * Remove the shape and all its dots, or a single dot if id is specified
     * @param {Dot | Number?} dotId: the dot to delete 
     */
    remove(dotId=null) {
        if (dotId) this._dots = this._dots.filter(dot=>dot.id!=(dotId?.id??dotId))
        else this._parent.remove(this._id)
        this._parent.updateCachedAllEls()
    }

    /**
     * The generate() function allows the generation of custom formations of dot
     * @param {Function} yFn: a function providing a Y value depanding on a given X value. (x)=>{... return y}
     * @param {Number} startOffset: pos array representing the starting position offset
     * @param {Number} length: the width in pixels of the generation result
     * @param {Number} gapX: the gap in pixel skipped between each generation
     * @param {[Number, Number]} yModifier: a range allowing random Y offsets
     * @param {Function?} generationCallback: custom callback called on each generation (this, lastDot)=>
     * @returns The generated Dots
     */
    static generate(yFn, startOffset, length, gapX, yModifier, generationCallback) {
        yFn??=()=>0
        startOffset??=[0,0]
        length??=100
        gapX??=1
        yModifier??=[-50, 50]

        let dots = [], lastDot = null, isGenCB = CDEUtils.isFunction(generationCallback)
        for (let x=0;x<=length;x+=CDEUtils.getValueFromRange(gapX)) {
            const dot = new Dot([startOffset[0]+x, startOffset[1]+CDEUtils.getValueFromRange(yModifier)+yFn(x)])
            if (lastDot && isGenCB) generationCallback(dot, lastDot)
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
 
    /**
     * Updates the radius of all the shape's dots
     * @param {Number?} radius: the new radius
     * @param {Boolean?} onlyReplaceDefaults: if true, only sets the dots' radius if it was not initialy set
     */
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

    /**
     * Updates the color of all the shape's dots
     * @param {Color | String | [r,g,b,a] ?} color: the new color
     * @param {Boolean?} onlyReplaceDefaults: if true, only sets the dots' color if it was not initialy set
     */
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

    /**
     * Updates the visualEffects of all the shape's dots
     * @param {[filter, compositeOperation, opacity]?} visualEffects: the filter, composite operation and opacity effects to use
     * @param {Boolean?} onlyReplaceDefaults: is true, it only sets the dots' visualEffects if it was not initialy set
     */
    setVisualEffects(visualEffects=this._visualEffects, onlyReplaceDefaults) {
        this._visualEffects = visualEffects
        const d_ll = this._dots.length
        for (let i=0;i<d_ll;i++) {
            const dot = this._dots[i]
            if (onlyReplaceDefaults && !dot.visualEffect) dot.visualEffects = visualEffects
            else if (!onlyReplaceDefaults) dot.visualEffects = visualEffects
        }
    }

    /**
     * Moves the shape and all its dots in specified direction at specified distance(force)
     * @param {Number} distance: the distance in pixels
     * @param {Number} deg: the degree representing the direction of the movement
     * @param {Number?} time: the move time in miliseconds
     * @param {Function?} easing: the easing function used. (x)=>{return y} 
     * @param {Boolean?} isUnique: if true, the animation gets queue in the object's animation backlog. 
     * @param {Boolean?} animForce: if true, terminates the current backlog animation and replaces it with this animation
     * @returns the created Anim instance
     */
    addForce(distance, deg, time=1000, easing=Anim.easeInOutQuad, isUnique=true, animForce=true) {
        const rDir = CDEUtils.toRad(deg), ix = this.x, iy = this.y,
            dx = CDEUtils.getAcceptableDiff(distance*Math.cos(rDir), CDEUtils.DEFAULT_ACCEPTABLE_DIFFERENCE),
            dy = CDEUtils.getAcceptableDiff(distance*Math.sin(rDir), CDEUtils.DEFAULT_ACCEPTABLE_DIFFERENCE)
        
        return this.playAnim(new Anim((prog)=>{
            this.moveAt([ix+dx*prog, iy-dy*prog])
        }, time, easing), isUnique, animForce)
    }

    /**
     * Rotates the dots by a specified degree increment around a specified center point,clock-wise, from the top
     * @param {Number} deg: the degrees to rotate by
     * @param {[x,y]?} centerPos: the center pos of the rotation
     */
    rotateBy(deg, centerPos=this.getCenter()) {
        const [cx, cy] = centerPos
        this._dots.forEach(dot=>{
            const x = dot.x-cx, y = dot.y-cy,
                cosV = Math.cos(CDEUtils.toRad(deg)), sinV = Math.sin(CDEUtils.toRad(deg))
                
            dot.x = (x*cosV-y*sinV)+cx
            dot.y = (x*sinV+y*cosV)+cy
        })

        this._rotation = (this._rotation+deg)%360
    }

    /**
     * Rotates the dots to a specified degree around a specified center point
     * @param {Number} deg: the degrees to rotate to
     * @param {[x,y]?} centerPos: the center pos of the rotation
     */
    rotateAt(deg, centerPos=this.getCenter()) {
        this.rotateBy(360-(this._rotation-deg), centerPos)
    }

    /**
     * Smoothly rotates the dots to a specified degree around a specified center point
     * @param {Number} deg: the degrees to rotate to
     * @param {Number?} time: the rotate time in miliseconds
     * @param {Function?} easing: the easing function used. (x)=>{return y} 
     * @param {[x,y]?} centerPos: the center pos of the rotation
     * @param {Boolean?} isUnique: if true, the animation gets queue in the object's animation backlog. 
     * @param {Boolean?} force: if true, terminates the current backlog animation and replaces it with this animation
     * @returns the created Anim instance
     */
    rotateTo(deg, time=1000, easing=Anim.easeInOutQuad, centerPos=this.getCenter(), isUnique=true, force=true) {
        const ir = this._rotation, dr = deg-this._rotation

        return this.playAnim(new Anim((prog)=>{
            this.rotateAt(ir+dr*prog, centerPos)
        }, time, easing), isUnique, force)
    }

    /**
     * Scales the dots distances by a specified amount [scaleX, scaleY], from a specified center point
     * @param {[scaleX, scaleY]} scale: the x/y values to scale the distances by
     * @param {[x,y]?} centerPos: the center pos of the scaling
     */
    scaleBy(scale, centerPos=this.getCenter()) {
        const [scaleX, scaleY] = scale, [cx, cy] = centerPos, dots = this._dots, dots_ll = dots.length
        for (let i=0;i<dots_ll;i++) {
            const dot = dots[i]
            dot.x = (dot.x-cx)*scaleX+cx
            dot.y = (dot.y-cy)*scaleY+cy
        }
        this._scale = [this._scale[0]*scaleX, this._scale[1]*scaleY]
    }

    /**
     * Scales the dots distances to a specified amount [scaleX, scaleY] from a specified center point
     * @param {[scaleX, scaleY]} scale: the x/y values to scale the distances to
     * @param {[x,y]?} centerPos: the center pos of the scaling
     */
    scaleAt(scale, centerPos=this.getCenter()) {
        const dsX = scale[0]/this._scale[0], dsY = scale[1]/this._scale[1]
        this.scaleBy([dsX||1, dsY||1], centerPos)
    }

    /**
     * Smoothly scales the dots distances by a specified amount [scaleX, scaleY] from a specified center point
     * @param {[scaleX, scaleY]} scale: the x/y values to scale the object to
     * @param {Number?} time: the scale time in miliseconds
     * @param {Function?} easing: the easing function used. (x)=>{return y} 
     * @param {[x,y]} centerPos: the center pos used for scaling
     * @param {Boolean?} isUnique: if true, the animation gets queue in the object's animation backlog. 
     * @param {Boolean?} force: if true, terminates the current backlog animation and replaces it with this animation
     * @returns the created Anim instance
     */
    scaleTo(scale, time=1000, easing=Anim.easeInOutQuad, centerPos=this.getCenter(), isUnique=true, force=true) {
        const is = this._scale, dsX = scale[0]-this._scale[0], dsY = scale[1]-this._scale[1]

        return this.playAnim(new Anim(prog=>{
            this.scaleAt([is[0]+dsX*prog, is[1]+dsY*prog], centerPos)
        }, time, easing), isUnique, force)
    }

    /**
     * Returns whether the provided pos is inside the minimal rectangular area containing all of the shape's dots
     * @param {[x,y]} pos: the pos to check 
     * @param {Number | [paddingTop, paddingRight?, paddingBottom?, paddingLeft?] ?} padding: the padding added to the validity area
     * @returns whether the provided pos is inside the Shape
     */
    isWithin(pos, padding) {
        return super.isWithin(pos, this.getBounds(padding), padding)
    }

    /**
     * Returns whether the provided pos is inside the area delimited by the dots perimeter
     * @param {[x,y]} pos: the pos to check 
     * @returns whether the provided pos is inside the Shape
     */
    isWithinAccurate(pos) {
        const dots = this._dots, d_ll = dots.length
        if (d_ll > 2) return this.ctx.isPointInPath(this.getBoundsAccurate(), pos[0], pos[1])
        return false
    }

    // returns the raw a minimal rectangular area containing all of the shape (no scale/rotation)
    #getRectBounds() {
        const rangeX = CDEUtils.getMinMax(this._dots, "x"), rangeY = CDEUtils.getMinMax(this._dots, "y")
        return [[rangeX[0],rangeY[0]], [rangeX[1],rangeY[1]]]
    }

    /**
     * @returns the accurate area delimited by the dots perimeter
     */
    getBoundsAccurate() {
        const dots = this._dots, d_ll = dots.length, perimeter = new Path2D(), firstDotPos = dots[0].pos
        perimeter.moveTo(firstDotPos[0], firstDotPos[1])
        for (let i=1;i<d_ll;i++) {
            const dotPos = dots[i].pos
            perimeter.lineTo(dotPos[0], dotPos[1])
        }
        perimeter.closePath()
        return perimeter
    }

    /**
     * @returns the center pos of the shape
     */
    getCenter() {
        return super.getCenter(this.#getRectBounds())
    }

    /**
     * Returns the minimal rectangular area containing all of the shape
     * @param {Number | [paddingTop, paddingRight?, paddingBottom?, paddingLeft?] ?} padding: the padding added to the validity area
     * @param {Number?} rotation: the rotation in degrees of the area
     * @param {[scaleX, scaleY]?} scale: the scale of the area
     * @param {[x,y]} centerPos: the center pos of the scaling
     * @returns the area positions [[x1,y1], [x2,y2]]
     */
    getBounds(padding=this._radius, rotation, scale, centerPos) {
        const positions = this.#getRectBounds()
        return super.getBounds(positions, padding, rotation, scale, centerPos)
    }

    /**
     * Empties the shapes of all its dots
     */
    clear() {
        this._dots = []
        this._parent.updateCachedAllEls()
    }

    /**
     * (DEPRECATED) Rerenders the shape to its original form
     */
    reset() {
        if (this._initDots) {
            this.clear()
            this.initialize()
        }
    }

    /**
     * Enables path caching for all dots of this shape
     */
    enableDotsPathCaching() {
        const dots = this._dots, d_ll = dots.length
        for (let i=0;i<d_ll;i++) dots[i].updateCachedPath()
    }

    /**
     * Disables path caching for all dots of this shape
     */
    disableDotsPathCaching() {
        const dots = this._dots, d_ll = dots.length
        for (let i=0;i<d_ll;i++) dots[i].disablePathCaching()
    }

    /**
     * @returns a separate copy of this Shape (only if initialized)
     */
    duplicate(pos=this.pos_, dots=this._dots.map(d=>d.duplicate()), radius=this._radius, color=this._color, limit=this._limit, drawEffectCB=this._drawEffectCB, ratioPosCB=this._ratioPosCB, setupCB=this._setupCB, loopCB=this._loopCB, anchorPos=this._anchorPos, activationMargin=this._activationMargin, fragile=this._fragile) {
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
            activationMargin,
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

    set dots(ratioPos) {this._ratioPos = ratioPos}
    set ratioPos(ratioPos) {this._ratioPos = ratioPos}
    set drawEffectCB(cb) {this._drawEffectCB = cb}
    set ratioPosCB(cb) {this._ratioPosCB = cb}
    set lastDotsPos(ldp) {this._lastDotsPos = ldp}
    set limit(limit) {this._limit = limit}
}