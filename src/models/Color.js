// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Represents a color value
class Color {
    static DEFAULT_COLOR=[255,255,255,1]

    constructor(color) {
        this._color = color||Color.DEFAULT_COLOR
        // rgba
        // hex
        // plain text

        // gradient
    }

    getConvertions(color=this._color) {

    }

    get color() {
        let color = this._color
        if (this._color instanceof Gradient) color = this._color.gradient
        else if (typeof this._color == "object") color = formatColor(this._color)
        return color
    }

    set color(color) {

    }
    // TODO
    get r() {return this._color[0]}
    get g() {return this._color[1]}
    get b() {return this._color[2]}
    get a() {return this._color[3]}

    set r(r) {this._color[0] = r}
    set g(g) {this._color[1] = g}
    set b(b) {this._color[2] = b}
    set a(a) {this._color[3] = a}
}

// Formats an rgba array [r, g, b, a] to a valid color string
function formatColor(rgba) {
    return typeof rgba=="object" ? `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3]})` : rgba
}

