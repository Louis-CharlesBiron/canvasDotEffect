// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Provides color attributes to other classes
class _HasColor {
    constructor(color) {
        this._initColor = color       // declaration color value || (ctx, this)=>{return color value}
        this._color = this._initColor // the current color or gradient of the filled shape
    }

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
        if (this._color?.colorRaw?.toString() !== color?.toString() || !this._color) {
            const potentialGradient = color?.colorRaw||color
            if (potentialGradient?.positions===Gradient.PLACEHOLDER) {
                color = potentialGradient.duplicate()
                color.initPositions = this
            }
            this._color = Color.adjust(color)
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