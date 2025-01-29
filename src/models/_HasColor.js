// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

class _HasColor {// DOC TODO
    constructor(color) {
        this._initColor = color                  // declaration color value || (ctx, this)=>{return color value}
        this._color = this._initColor            // the current color or gradient of the filled shape
    }

    get colorObject() {return this._color}
    get colorRaw() {return this._color.colorRaw}
    get color() {return this._color?.color}
    get initColor() {return this._initColor}
    get rgba() {return this.colorObject.rgba}
    get r() {return this.colorObject.r}
    get g() {return this.colorObject.g}
    get b() {return this.colorObject.b}
    get a() {return this.colorObject.a}
    get hsv() {return this.colorObject.hsv}
    get hue() {return this.colorObject.hue}
    get saturation() {return this.colorObject.saturation}
    get brightness() {return this.colorObject.brightness}

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
    set r(r) {this.colorObject.r = r}
    set g(g) {this.colorObject.g = g}
    set b(b) {this.colorObject.b = b}
    set a(a) {this.colorObject.a = a}
    set hue(hue) {this.colorObject.hue = hue}
    set saturation(saturation) {this.colorObject.saturation = saturation}
    set brightness(brightness) {this.colorObject.brightness = brightness}
    set initColor(initColor) {this._initColor = initColor}
}