// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

class _HasColor {

    /**
     * Abstract class, provides color attributes to other classes
     * @param {String | [r,g,b,a] | Color | Function} color: the color definition
     */
    constructor(color) {
        this._initColor = color       // declaration color value || (ctx, this)=>{return color value}
        this._color = this._initColor // the current color or gradient of the object
    }
    
    // returns the value of the inital color declaration
    getInitColor() {
        return CDEUtils.isFunction(this._initColor) ? this._initColor(this) : this._initColor||null
    }

    get [Symbol.toStringTag]() {return this.instanceOf}
    get instanceOf() {return "_HasColor"}
    get colorObject() {return this._color}
    get colorRaw() {return this._color.colorRaw}
    get color() {return this._color?.color}
    get initColor() {return this._initColor}
    get rgba() {return this._color.rgba}
    get r() {return this._color.r}
    get g() {return this._color.g}
    get b() {return this._color.b}
    get a() {return this._color.a}
    get hsv() {return this._color.hsv}
    get hue() {return this._color.hue}
    get saturation() {return this._color.saturation}
    get brightness() {return this._color.brightness}

    set color(color) {
        const c = this._color
        if (!c || c?.colorRaw?.toString() !== color?.toString()) {
            const specialColor = color?.colorRaw||color
            if (specialColor?.positions==_DynamicColor.PLACEHOLDER) {
                if (!color.isChannel) color = specialColor.duplicate()
                else color = specialColor 
                color.initPositions = this
            }

            if (c instanceof Color) c.color = color
            else this._color = Color.adjust(color)
        }
    }
    set r(r) {this._color.r = r}
    set g(g) {this._color.g = g}
    set b(b) {this._color.b = b}
    set a(a) {this._color.a = a}
    set hue(hue) {this._color.hue = hue}
    set saturation(saturation) {this._color.saturation = saturation}
    set brightness(brightness) {this._color.brightness = brightness}
    set initColor(initColor) {this._initColor = initColor}
}