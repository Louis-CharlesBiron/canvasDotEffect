// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

class Grid extends Shape {
    static DEFAULT_KEYS = ""
    static DEFAULT_GAPS = [10, 10]
    static DEFAULT_SOURCE = GridAssets.DEFAULT_SOURCE
    static DEFAULT_SPACING = (grid)=>grid._source.width*grid._gaps[0]+grid._gaps[0]-grid._source.width+grid._radius
    static DELETION_VALUE = null
    static SAME_VALUE = undefined

    #symbolsReferences = []

    /**
     * Allows the creation of symbols/text using dots
     * @param {String} keys: keys to convert to source's values as a string
     * @param {[gapX, gapY]?} gaps: horizontal and vertical gaps within the dots, in pixels
     * @param {Number?} spacing: gap size between symbols, in pixels
     * @param {Object?} source: the source of the symbols
     * @param {[x,y]?} pos: the pos of the object 
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
    constructor(keys, gaps, spacing, source, pos, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, loopCB, anchorPos, activationMargin, fragile) {
        super(pos, null, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, loopCB, anchorPos, activationMargin, fragile)

        this._keys = keys+""||Grid.DEFAULT_KEYS             // keys to convert to source's values as a string
        this._gaps = gaps??Grid.DEFAULT_GAPS                // [x, y] gap length within the dots
        this._source = source?? Grid.DEFAULT_SOURCE         // symbols' source
        this._spacing = spacing??Grid.DEFAULT_SPACING(this) // gap length between symbols
    }

    initialize() {
        this._pos = this.getInitPos()
        this.setAnchoredPos()

        if (this._keys) {
            const symbols = this.createGrid()
            this.add(symbols.flat())
            this.#updatedCachedSymbolReferences(symbols)
        }

        this.setRadius(this.getInitRadius(), true)
        this.setColor(this.getInitColor(), true)

        this.initialized = true
        if (CDEUtils.isFunction(this._setupCB)) this._setupResults = this._setupCB(this, this?.parent)
    }

    /**
     * Creates a formation of symbols
     * @param {String?} keys: keys to convert to source's values as a string
     * @param {[x,y]?} pos: the pos of the object
     * @param {[gapX, gapY]?} gaps: horizontal and vertical gaps within the dots, in pixels
     * @param {Number?} spacing: gap size between symbols, in pixels
     * @param {Object?} source: the source of the symbols
     * @returns an array with all the symbols
     */
    createGrid(keys=this._keys, pos=[0,0], gaps=this._gaps, spacing=this._spacing, source=this._source) {
        let [cx, cy] = pos, isNewLine=true, symbols=[], k_ll = keys.length
        for (let i=0;i<k_ll;i++) {
            const l = keys[i], symbol = this.createSymbol(l, [cx=(l=="\n")?pos[0]:(cx+spacing*(!isNewLine)), cy+=(l=="\n")&&source.width*gaps[1]+this.radius])
            isNewLine = (l=="\n")
            symbols.push(symbol)
        }

        return symbols
    }

    /**
     * Creates the dot based symbol at given pos, based on given source
     * @param {String} key: a single character to convert 
     * @param {[x,y]?} pos: the pos of the symbol
     * @param {Object?} source: the source of the symbol
     * @returns an array of dots
     */
    createSymbol(key, pos=super.relativePos, source=this._source) {
        let dotGroup = [], xi=[0,0], yi=0, s = source[key], sourceRadius = Math.sqrt(source.width*source.height), places = GridAssets.D.places

        if (key===Grid.DELETION_VALUE || key===Grid.SAME_VALUE) return key

        if (s) s.map((d,i)=>[new Dot([pos[0]+(xi[0]=d[0]??xi[0]+1,isNaN(Math.abs(d[0]))?xi[0]:Math.abs(d[0]))*this._gaps[0], pos[1]+(yi+=(xi[0]<=xi[1]||!i)||Math.sign(1/xi[0])==-1)*this._gaps[1]]), d[1], yi*sourceRadius+(xi[1]=Math.abs(xi[0]))]).forEach(([dot, c, p],_,a)=>{
            if (isFinite(p)) {
                places.forEach(dir=>c&dir[0]&&dot.addConnection(a.find(n=>n[2]==p+dir[1](sourceRadius))?.[0])) 
                dotGroup.push(dot)
            }
        })
        return dotGroup
    }

    #updatedCachedSymbolReferences(symbols) {
        const ll = symbols.length
        for (let i=0;i<ll;i++) {
            const dots = symbols[i]
            if (dots!=Grid.SAME_VALUE) {
                const d_ll = dots.length, ids = new Array(d_ll)
                for (let ii=0;ii<d_ll;ii++) ids[ii] = dots[ii].id
                this.#symbolsReferences[i] = ids
            } else if (dots===Grid.DELETION_VALUE) delete this.#symbolsReferences[i]
        }
    }

    /**
     * Deletes the symbol at the provided index
     * @param {Number} i: the index of the key
     */
    deleteKey(i) {
        if (typeof i=="number") i = this.getKey(i)
        
        if (i) {
            const k_ll = i.length 
            for (let ii=0;ii<k_ll;ii++) i[ii].remove()
        }
    }

    /**
     * Returns the dots composing the symbol at the provided index
     * @param {Number} i: the index of the key
     * @returns the dots group 
     */
    getKey(i) {
        const ids = this.#symbolsReferences[i]??[], i_ll = ids.length, dots = new Array(i_ll), cvs = this.parent
        for (let i=0;i<i_ll;i++) dots[i] = cvs.get(ids[i])
        return dots
    }

    /** 
     *  @returns a separate copy of this Grid (only if initialized)
     */
    duplicate(keys=this._keys, gaps=CDEUtils.unlinkArr2(this._gaps), spacing=this._spacing, source=this._source, pos=this.pos_, radius=this._radius, color=this._color, limit=this._limit, drawEffectCB=this._drawEffectCB, ratioPosCB=this._ratioPosCB, setupCB=this._setupCB, loopCB=this._loopCB, anchorPos=this._anchorPos, activationMargin=this._activationMargin, fragile=this._fragile) {
        const colorObject = color, colorRaw = colorObject.colorRaw, grid = new Grid(
            keys,
            gaps,
            spacing,
            source,
            pos,
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
        grid._dots = this._dots.map(d=>d.duplicate())
        grid._scale = CDEUtils.unlinkArr2(this._scale)
        grid._rotation = this._rotation
        grid._visualEffects = this.visualEffects_

        return this.initialized ? grid : null
    }

    [Symbol.toPrimitive]() {
        return this.id
    }

    get [Symbol.toStringTag]() {return this.instanceOf}
    get instanceOf() {return "Grid"}
    get keys() {return this._keys}
	get gaps() {return this._gaps}
	get spacing() {return this._spacing}
	get source() {return this._source}

	set keys(keys) {
        const n_ll = keys.length>this._keys.length?keys.length:this._keys.length, newKeys = new Array(n_ll)
        for (let i=0;i<n_ll;i++) {
            const newKey = keys[i], oldKey = this._keys[i]
            if (oldKey!=newKey || oldKey=="\n") {
                newKeys[i] = newKey||Grid.DELETION_VALUE
                this.deleteKey(i)
            }
            else newKeys[i] = Grid.SAME_VALUE
        }
        this._keys = keys

        const symbols = this.createGrid(newKeys)
        this.#updatedCachedSymbolReferences(symbols)
        super.add(symbols.flat())
    }
	set gaps(gaps) {
        super.clear()
        this._gaps = gaps
        super.add(this.createGrid().flat())
    }
	set spacing(spacing) {
        spacing??=this._source.width*this._gaps[0]+this._gaps[0]-this._source.width+this._radius
        const oldSpacing = this._spacing, keys = this._keys, s_ll = keys.length, cvs = this.parent
        if (oldSpacing != spacing) {
            for (let i=0,vi=0;i<s_ll;i++,vi=keys[i]=="\n"?-1:vi+1) {
                const ids = this.#symbolsReferences[i], d_ll = ids.length
                for (let ii=0;ii<d_ll;ii++) {
                    cvs.get(ids[ii]).moveBy([(spacing-oldSpacing)*vi])
                }
            }
            this._spacing = spacing
        }
    }
	set source(source) {
        super.clear()
        this._source = source??Grid.DEFAULT_SOURCE
        super.add(this.createGrid())
    }
}