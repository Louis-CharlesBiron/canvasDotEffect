// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

class Color {
    constructor() {

    }



}

// Formats an rgba array [r, g, b, a] to a valid color string
function formatColor(rgba) {
    return typeof rgba=="object" ? `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3]})` : rgba
}