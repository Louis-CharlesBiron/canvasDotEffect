// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Allows the creation of symbols/text based on specific source
class Grid extends Shape {
    static DEFAULT_GAPS = [25, 25]

    constructor(keys, gaps, spacing, source, pos, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, anchorPos, alwaysActive, fragile) {
        super(pos, null, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, anchorPos, alwaysActive, fragile)

        this._keys = keys                                 // keys to convert to source's values as a string
        this._gaps = gaps ?? Grid.DEFAULT_GAPS            // [x, y] gap length within the dots
        this._spacing = spacing ?? this._source.width*this._gaps[0]+this._gaps[0]-this._source.width+this._radius // gap length between symbols
        this._source = source ?? GridAssets.fontSource5x5 // symbols' source
    }

    initialize() {
        super.initialize()
        if (this._keys) this.add(this.createGrid())
    }

    // returns a separate copy of this Grid (only initialized for objects)
    duplicate() {
        return this.initialized ? new Grid(this._keys, [...this._gaps], this._spacing, this._source, this.pos_, this.radius, this.colorObject.duplicate(), this.limit, this._drawEffectCB, this._ratioPosCB, this.setupCB, this._fragile) : null
    }

    // Creates a formation of symbols
    createGrid(keys=this._keys, pos=[0,0], gaps=this._gaps, spacing=this._spacing, source=this._source) {
        let [cx, cy] = pos, isNewLine=true, symbols=[]
        ;[...keys].forEach(l=>{
            const symbol = this.createSymbol(l, [cx=(l==="\n")?pos[0]:(cx+spacing*(!isNewLine)), cy+=(l==="\n")&&source.width*gaps[1]+this.radius])
            isNewLine = (l==="\n")
            symbols.push(symbol)
        })
        return symbols.flat()
    }

    // Creates the dot based symbol at given pos, based on given source
    createSymbol(key, pos=super.relativePos, source=this._source) {
        let dotGroup = [], [gx, gy] = this._gaps, xi=[0,0], yi=0, s = source[key.toUpperCase()],
        sourceRadius = Math.sqrt(source.width*source.height)

        if (s) s.map((d,i)=>[new Dot([pos[0]+(xi[0]=d[0]??xi[0]+1,isNaN(Math.abs(d[0]))?xi[0]:Math.abs(d[0]))*gx, pos[1]+(yi+=(xi[0]<=xi[1]||!i)||Math.sign(1/xi[0])===-1)*gy]), d[1], yi*sourceRadius+(xi[1]=Math.abs(xi[0]))]).forEach(([dot, c, p],_,a)=>{
            GridAssets.D.places.forEach(dir=>{c&dir[0]&&dot.addConnection(a.find(n=>n[2]===p+dir[1](sourceRadius))?.[0])}) 
            dotGroup.push(dot)
        })
        return dotGroup
    }

    // updates the current keys
    setKeys(keys) {
        super.clear()
        this._keys = keys
        super.add(this.createGrid())
    }

    // updates the current gaps
    setGaps(gaps) {
        super.clear()
        this._gaps = gaps
        super.add(this.createGrid())
    }

    // updates the current spacing
    setSpacing(spacing) {
        super.clear()
        this._spacing = spacing
        super.add(this.createGrid())
    }

    // updates the current source
    setSource(source) {
        super.clear()
        this._source = source
        super.add(this.createGrid())
    }

    get keys() {return this._keys}
	get gaps() {return this._gaps}
	get spacing() {return this._spacing}
	get source() {return this._source}

	set keys(keys) {return this._keys = keys}
	set gaps(gaps) {return this._gaps = gaps}
	set spacing(spacing) {return this._spacing = spacing}
	set source(source) {return this._source = source}
}