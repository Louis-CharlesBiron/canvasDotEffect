// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Represents a color value
class Color {
    static DEFAULT_COLOR = "aliceblue"
    static DEFAULT_RGBA = [240, 248, 255, 1]
    static DEFAULT_COLOR_VALUE = "rgba(240, 248, 255, 1)"
    static CSS_COLOR_TO_RGBA_CONVERTIONS = {transparent:[0,0,0,0],aliceblue:[240,248,255,1],antiquewhite:[250,235,215,1],aqua:[0,255,255,1],aquamarine:[127,255,212,1],azure:[240,255,255,1],beige:[245,245,220,1],bisque:[255,228,196,1],black:[0,0,0,1],blanchedalmond:[255,235,205,1],blue:[0,0,255,1],blueviolet:[138,43,226,1],brown:[165,42,42,1],burlywood:[222,184,135,1],cadetblue:[95,158,160,1],chartreuse:[127,255,0,1],chocolate:[210,105,30,1],coral:[255,127,80,1],cornflowerblue:[100,149,237,1],cornsilk:[255,248,220,1],crimson:[220,20,60,1],cyan:[0,255,255,1],darkblue:[0,0,139,1],darkcyan:[0,139,139,1],darkgoldenrod:[184,134,11,1],darkgray:[169,169,169,1],darkgreen:[0,100,0,1],darkkhaki:[189,183,107,1],darkmagenta:[139,0,139,1],darkolivegreen:[85,107,47,1],darkorange:[255,140,0,1],darkorchid:[153,50,204,1],darkred:[139,0,0,1],darksalmon:[233,150,122,1],darkseagreen:[143,188,143,1],darkslateblue:[72,61,139,1],darkslategray:[47,79,79,1],darkturquoise:[0,206,209,1],darkviolet:[148,0,211,1],deeppink:[255,20,147,1],deepskyblue:[0,191,255,1],dimgray:[105,105,105,1],dodgerblue:[30,144,255,1],firebrick:[178,34,34,1],floralwhite:[255,250,240,1],forestgreen:[34,139,34,1],fuchsia:[255,0,255,1],gainsboro:[220,220,220,1],ghostwhite:[248,248,255,1],gold:[255,215,0,1],goldenrod:[218,165,32,1],gray:[128,128,128,1],grey:[128,128,128,1],green:[0,128,0,1],greenyellow:[173,255,47,1],honeydew:[240,255,240,1],hotpink:[255,105,180,1],indianred:[205,92,92,1],indigo:[75,0,130,1],ivory:[255,255,240,1],khaki:[240,230,140,1],lavender:[230,230,250,1],lavenderblush:[255,240,245,1],lawngreen:[124,252,0,1],lemonchiffon:[255,250,205,1],lightblue:[173,216,230,1],lightcoral:[240,128,128,1],lightcyan:[224,255,255,1],lightgoldenrodyellow:[250,250,210,1],lightgray:[211,211,211,1],lightgreen:[144,238,144,1],lightpink:[255,182,193,1],lightsalmon:[255,160,122,1],lightseagreen:[32,178,170,1],lightskyblue:[135,206,250,1],lightslategray:[119,136,153,1],lightsteelblue:[176,224,230,1],lightyellow:[255,255,224,1],lime:[0,255,0,1],limegreen:[50,205,50,1],linen:[250,240,230,1],magenta:[255,0,255,1],maroon:[128,0,0,1],mediumaquamarine:[102,205,170,1],mediumblue:[0,0,205,1],mediumorchid:[186,85,211,1],mediumpurple:[147,112,219,1],mediumseagreen:[60,179,113,1],mediumslateblue:[123,104,238,1],mediumspringgreen:[0,250,154,1],mediumturquoise:[72,209,204,1],mediumvioletred:[199,21,133,1],midnightblue:[25,25,112,1],mintcream:[245,255,250,1],mistyrose:[255,228,225,1],moccasin:[255,228,181,1],navajowhite:[255,222,173,1],navy:[0,0,128,1],oldlace:[253,245,230,1],olive:[128,128,0,1],olivedrab:[107,142,35,1],orange:[255,165,0,1],orangered:[255,69,0,1],orchid:[218,112,214,1],palegoldenrod:[238,232,170,1],palegreen:[152,251,152,1],paleturquoise:[175,238,238,1],palevioletred:[219,112,147,1],papayawhip:[255,239,213,1],peachpuff:[255,218,185,1],peru:[205,133,63,1],pink:[255,192,203,1],plum:[221,160,221,1],powderblue:[176,224,230,1],purple:[128,0,128,1],rebeccapurple:[102,51,153,1],red:[255,0,0,1],rosybrown:[188,143,143,1],royalblue:[65,105,225,1],saddlebrown:[139,69,19,1],salmon:[250,128,114,1],sandybrown:[244,164,96,1],seagreen:[46,139,87,1],seashell:[255,245,238,1],sienna:[160,82,45,1],silver:[192,192,192,1],skyblue:[135,206,235,1],slateblue:[106,90,205,1],slategray:[112,128,144,1],snow:[255,250,250,1],springgreen:[0,255,127,1],steelblue:[70,130,180,1],tan:[210,180,140,1],teal:[0,128,128,1],thistle:[216,191,216,1],tomato:[255,99,71,1],turquoise:[64,224,208,1],violet:[238,130,238,1],wheat:[245,222,179,1],white:[255,255,255,1],whitesmoke:[245,245,245,1],yellow:[255,255,0,1],yellowgreen:[154,205,50,1]}
    static RGBA_TO_CSS_COLOR_CONVERTIONS = {"0,0,0,0":"transparent","240,248,255,1":"aliceblue","250,235,215,1":"antiquewhite","0,255,255,1":"aqua","127,255,212,1":"aquamarine","240,255,255,1":"azure","245,245,220,1":"beige","255,228,196,1":"bisque","0,0,0,1":"black","255,235,205,1":"blanchedalmond","0,0,255,1":"blue","138,43,226,1":"blueviolet","165,42,42,1":"brown","222,184,135,1":"burlywood","95,158,160,1":"cadetblue","127,255,0,1":"chartreuse","210,105,30,1":"chocolate","255,127,80,1":"coral","100,149,237,1":"cornflowerblue","255,248,220,1":"cornsilk","220,20,60,1":"crimson","0,0,139,1":"darkblue","0,139,139,1":"darkcyan","184,134,11,1":"darkgoldenrod","169,169,169,1":"darkgray","0,100,0,1":"darkgreen","189,183,107,1":"darkkhaki","139,0,139,1":"darkmagenta","85,107,47,1":"darkolivegreen","255,140,0,1":"darkorange","153,50,204,1":"darkorchid","139,0,0,1":"darkred","233,150,122,1":"darksalmon","143,188,143,1":"darkseagreen","72,61,139,1":"darkslateblue","47,79,79,1":"darkslategray","0,206,209,1":"darkturquoise","148,0,211,1":"darkviolet","255,20,147,1":"deeppink","0,191,255,1":"deepskyblue","105,105,105,1":"dimgray","30,144,255,1":"dodgerblue","178,34,34,1":"firebrick","255,250,240,1":"floralwhite","34,139,34,1":"forestgreen","220,220,220,1":"gainsboro","248,248,255,1":"ghostwhite","255,215,0,1":"gold","218,165,32,1":"goldenrod","128,128,128,1":"gray","0,128,0,1":"green","173,255,47,1":"greenyellow","240,255,240,1":"honeydew","255,105,180,1":"hotpink","205,92,92,1":"indianred","75,0,130,1":"indigo","255,255,240,1":"ivory","240,230,140,1":"khaki","230,230,250,1":"lavender","255,240,245,1":"lavenderblush","124,252,0,1":"lawngreen","255,250,205,1":"lemonchiffon","173,216,230,1":"lightblue","240,128,128,1":"lightcoral","224,255,255,1":"lightcyan","250,250,210,1":"lightgoldenrodyellow","211,211,211,1":"lightgray","144,238,144,1":"lightgreen","255,182,193,1":"lightpink","255,160,122,1":"lightsalmon","32,178,170,1":"lightseagreen","135,206,250,1":"lightskyblue","119,136,153,1":"lightslategray","176,224,230,1":"lightsteelblue","255,255,224,1":"lightyellow","0,255,0,1":"lime","50,205,50,1":"limegreen","250,240,230,1":"linen","255,0,255,1":"magenta","128,0,0,1":"maroon","102,205,170,1":"mediumaquamarine","0,0,205,1":"mediumblue","186,85,211,1":"mediumorchid","147,112,219,1":"mediumpurple","60,179,113,1":"mediumseagreen","123,104,238,1":"mediumslateblue","0,250,154,1":"mediumspringgreen","72,209,204,1":"mediumturquoise","199,21,133,1":"mediumvioletred","25,25,112,1":"midnightblue","245,255,250,1":"mintcream","255,228,225,1":"mistyrose","255,228,181,1":"moccasin","255,222,173,1":"navajowhite","0,0,128,1":"navy","253,245,230,1":"oldlace","128,128,0,1":"olive","107,142,35,1":"olivedrab","255,165,0,1":"orange","255,69,0,1":"orangered","218,112,214,1":"orchid","238,232,170,1":"palegoldenrod","152,251,152,1":"palegreen","175,238,238,1":"paleturquoise","219,112,147,1":"palevioletred","255,239,213,1":"papayawhip","255,218,185,1":"peachpuff","205,133,63,1":"peru","255,192,203,1":"pink","221,160,221,1":"plum","128,0,128,1":"purple","102,51,153,1":"rebeccapurple","255,0,0,1":"red","188,143,143,1":"rosybrown","65,105,225,1":"royalblue","139,69,19,1":"saddlebrown","250,128,114,1":"salmon","244,164,96,1":"sandybrown","46,139,87,1":"seagreen","255,245,238,1":"seashell","160,82,45,1":"sienna","192,192,192,1":"silver","135,206,235,1":"skyblue","106,90,205,1":"slateblue","112,128,144,1":"slategray","255,250,250,1":"snow","0,255,127,1":"springgreen","70,130,180,1":"steelblue","210,180,140,1":"tan","0,128,128,1":"teal","216,191,216,1":"thistle","255,99,71,1":"tomato","64,224,208,1":"turquoise","238,130,238,1":"violet","245,222,179,1":"wheat","255,255,255,1":"white","245,245,245,1":"whitesmoke","255,255,0,1":"yellow","154,205,50,1":"yellowgreen"}
    static FORMATS = {RGBA:"RGBA", TEXT:"TEXT", HEX:"HEX", GRADIENT:"GRADIENT", PATTERN:"PATTERN", COLOR:"COLOR", HSV:"HSVA"}
    static CONVERTABLE_FORMATS = {RGBA:"RGBA", TEXT:"TEXT", HEX:"HEX", HSV:"HSVA"}
    static STRICT_FORMATS = {RGBA:"RGBA", COLOR:"COLOR"}
    static DEFAULT_TEMPERANCE = 0
    static SEARCH_STARTS = {TOP_LEFT:"TOP_LEFT", BOTTOM_RIGHT:"BOTTOM_RIGHT"}
    static DEFAULT_SEARCH_START = Color.SEARCH_STARTS.TOP_LEFT
    static DEFAULT_DECIMAL_ROUNDING_POINT = 3
    static OPACITY_VISIBILITY_THRESHOLD = 0.05
    
    #rgba = null // cached rgba value
    #hsv = null  // cached hsv value

    /**
     * @param {String | [r,g,b,a] | Color} color: the color definition
     * @param {Boolean?} isChannel: if true, this Color will be used as a channel and will not duplicate
     */
    constructor(color, isChannel=false) {
        this._color = color instanceof Color ? color._color : color||Color.DEFAULT_COLOR // the color value declaration, in any supported format
        this._format = Color.getFormat(this._color) // the format of the color
        this.#updateCache()
        this._isChannel = isChannel||false // if true, this instance will be used as a color channel and will not duplicate
    }

    // updates the cached rgba value
    #updateCache() {
        if (this._format == Color.FORMATS.GRADIENT || this._format == Color.FORMATS.PATTERN) this.#rgba = this.#hsv = []
        else {
            this.#rgba = this._format !== Color.FORMATS.RGBA ? this.convertTo() : Color.#unlinkRGBA(this._color)
            const rgba = this.#rgba, DDRP = Color.DEFAULT_DECIMAL_ROUNDING_POINT, round = CDEUtils.round
            rgba[0] = round(rgba[0], DDRP)
            rgba[1] = round(rgba[1], DDRP)
            rgba[2] = round(rgba[2], DDRP)
            rgba[3] = round(rgba[3], DDRP)
            this.#hsv = Color.convertTo(this.#rgba, Color.FORMATS.HSV)
        }
    }

    /**
     * Converts a color to another color format
     * @param {String | [r,g,b,a] | Color} color: the color to convert
     * @param {Color.CONVERTABLE_FORMATS} format 
     * @returns the color in the provided format
     */
    static convertTo(color, format=Color.CONVERTABLE_FORMATS.RGBA) {
        let inputFormat = Color.getFormat(color), convertedColor = color, formats = Color.CONVERTABLE_FORMATS, RGBA=formats.RGBA, HEX=formats.HEX, TEXT=formats.TEXT, HSV=formats.HSV

        if (format==RGBA) {
            if (inputFormat==HEX) convertedColor = Color.#hexToRgba(color)
            else if (inputFormat==TEXT) convertedColor = Color.#unlinkRGBA(Color.CSS_COLOR_TO_RGBA_CONVERTIONS[color])
            else if (inputFormat==HSV) convertedColor = Color.#hsvToRgba(color)
        } else if (format==HEX) {
            if (inputFormat==RGBA) convertedColor = Color.#rgbaToHex(color)
            else Color.#rgbaToHex(Color.convertTo(color, RGBA))
        } else if (format==TEXT) {
            if (inputFormat==RGBA) convertedColor = Color.RGBA_TO_CSS_COLOR_CONVERTIONS[color.toString()] ?? color
            else convertedColor = Color.RGBA_TO_CSS_COLOR_CONVERTIONS[Color.convertTo(color, RGBA).toString()] ?? color
        } else if (format==HSV) {
            if (inputFormat==RGBA) convertedColor = Color.#rgbaToHsv(color)
            else convertedColor = Color.#rgbaToHsv(Color.convertTo(color, RGBA))
        }

        return convertedColor
    }
    /**
     * Converts a color to another color format
     * @param {String | [r,g,b,a] | Color} color: the color to convert
     * @param {Color.CONVERTABLE_FORMATS} format 
     * @returns the color in the provided format
     */
    convertTo(color=this._color, format=Color.CONVERTABLE_FORMATS.RGBA) {
        return Color.convertTo(color, format)
    }

    /**
     * Returns a random color value
     * @param {Color.CONVERTABLE_FORMATS} outputFormat: the result's ouput format, one of CONVERTABLE_FORMATS
     * @param {Boolean} randomizeAlpha: whether the alpha is also randomized, if false, alpha defaults to 1
     * @param {Array} rRange: if defined, defines the min/max range to chose the r value from
     * @param {Array} gRange: if defined, defines the min/max range to chose the g value from
     * @param {Array} bRange: if defined, defines the min/max range to chose the b value from
     * @param {Array} aRange: if defined, defines the min/max range to chose the a value from
     */
    static random(outputFormat=Color.CONVERTABLE_FORMATS.RGBA, randomizeAlpha=false, rRange=[0,255], gRange=[0,255], bRange=[0,255], aRange=[0,1]) {
        const formats = Color.CONVERTABLE_FORMATS, random = CDEUtils.random, randomRGBA = [random(...rRange), random(...gRange), random(...bRange), randomizeAlpha?random(...aRange, 2):1]
        if (outputFormat==formats.HEX) return Color.convertTo(randomRGBA, formats.HEX)
        else if (outputFormat==formats.TEXT) return Color.convertTo(randomRGBA, formats.TEXT)
        else if (outputFormat==formats.HSV) return Color.convertTo(randomRGBA, formats.HSV)
        else return randomRGBA
    }

    // converts rbga to hsv (without alpha)
    static #rgbaToHsv(rgba) {
        let r = rgba[0]/255, g = rgba[1]/255, b = rgba[2]/255,
            min = Math.min(r, g, b), max = Math.max(r, g, b),
            hue, diff = max-min
    
        if (max==min) hue = 0
        else {
            if (max==r) hue = (g-b)/diff
            else if (max==g) hue = (b-r)/diff+2
            else hue = (r-g)/diff+4
            hue = (360+hue*60)%360
        }

        return [hue, max&&(diff/max)*100, max*100]
    }

    // create a separate copy of an RGBA array
    static #unlinkRGBA(rgba) {
        return [rgba[0], rgba[1], rgba[2], rgba[3]]
    }

    // converts hsv to rbga (without default alpha)
    static #hsvToRgba(hsva) {
        let hue = hsva[0], sat = hsva[1]/100, bright = hsva[2]/100,
        chro = bright*sat, x = chro*(1-Math.abs(((hue/60)%2)-1)), dc = bright-chro,
        r, g, b
    
        if (0<=hue&&hue<60) {r=chro;g=x;b=0}
        else if (60<=hue&&hue<120) {r=x;g=chro;b=0}
        else if (120<=hue&&hue<180) {r=0;g=chro;b=x}
        else if (180<=hue&&hue<240) {r=0;g=x;b=chro}
        else if (240<=hue&&hue<300) {r=x;g=0;b=chro}
        else {r=chro;g=0;b=x}

        return [Math.round((r+dc)*255), Math.round((g+dc)*255), Math.round((b+dc)*255), 1]
    }
    
    // converts rbga to hex
    static #rgbaToHex(rgba) {
        return "#"+rgba.reduce((a,b,i)=>a+=(i&&!(i%3)?Math.round(b*255):b).toString(16).padStart(2,"0"),"")
    }

    // converts hex to rgba
    static #hexToRgba(hex) {
        return hex.padEnd(9, "F").match(/[a-z0-9]{2}/gi).reduce((a,b,i)=>a.concat(parseInt(b, 16)/(i&&!(i%3)?255:1)),[])
    }

    /**
     * Returns the format of the provided color
     * @param {String | [r,g,b,a] | Color} color: the color definition
     */
    static getFormat(color) {
        return Array.isArray(color) ? (color.length == 4 ? Color.FORMATS.RGBA : Color.FORMATS.HSV) :
        color instanceof Color ? Color.FORMATS.COLOR :
        color instanceof Gradient ? Color.FORMATS.GRADIENT :
        color instanceof Pattern ? Color.FORMATS.PATTERN :
        color.includes("#") ? Color.FORMATS.HEX : Color.FORMATS.TEXT
    }

    // ajust color values to Color instances
    static adjust(color) {
        return color instanceof Color ? color.isChannel?color:color.duplicate() : new Color(color)
    }
    
    /**
     * Formats a rgba array to a usable rgba value
     * @param {[r,g,b,a]} arrayRgba: the rgba array to format
     * @returns a string containing the color as rgba format
     */
    static formatRgba(arrayRgba) {
        return Array.isArray(arrayRgba) ? `rgba(${arrayRgba[0]}, ${arrayRgba[1]}, ${arrayRgba[2]}, ${arrayRgba[3]})` : null
    }

    /**
     * Creates an rgba array
     * @param {Number?} r: a number between 0 and 255 that represents the red value
     * @param {Number?} g: a number between 0 and 255 that represents the green value
     * @param {Number?} b: a number between 0 and 255 that represents the blue value
     * @param {Number?} a: a number between 0 and 1 that represents the opacity
     * @returns the created rgba array
     */
    static rgba(r=255, g=255, b=255, a=1) {
        const round = CDEUtils.round, roundingPoint = Color.DEFAULT_DECIMAL_ROUNDING_POINT
        return [round(r, roundingPoint), round(g, roundingPoint), round(b, roundingPoint), round(a, roundingPoint)]
    }

    /**
     * Returns the usable value of a color from any supported format
     * @param {String | [r,g,b,a] | Color} color: the color definition
     */
    static getColorValue(color) {
        if (typeof color=="string" || color instanceof CanvasGradient || color instanceof CanvasPattern) return color
        else if (color instanceof _DynamicColor) return color.value
        else return Color.formatRgba(color) ?? color.color
    }

    /**
     * Returns the first pos where the provided color is found in the canvas
     * @param {Canvas} canvas: Canvas instance
     * @param {Color} color: Color instance
     * @param {Boolean} useAlpha: Whether the search considers opacity
     * @param {Number} temperance: The validity margin for the r,g,b,a values
     * @param {SEARCH_STARTS} searchStart: Direction from which the search starts
     * @param {[width, height]} areaSize: The search area. (Defaults to the canvas size)
     * @returns The found pos [x,y] or null if nothing was found
     */
    static findFirstPos(canvas, color, useAlpha=false, temperance=Color.DEFAULT_TEMPERANCE, searchStart=Color.DEFAULT_SEARCH_START, areaSize=[]) {
        let width = areaSize[0]??canvas.width, height = areaSize[1]??canvas.height,
            data = canvas.ctx.getImageData(0, 0, width, height).data,
            x, y, yi, xi, currentR, currentG, currentB, currentA, ow = 4*width,
            r = color.r??color[0], g = color.g??color[1], b = color.b??color[2], a = (color.a??color[3])*255,
            br = r-temperance, bg = g-temperance, bb = b-temperance, ba = a-temperance,
            tr = r+temperance, tg = g+temperance, tb = b+temperance, ta = a+temperance,
            isSearchTL = searchStart==Color.SEARCH_STARTS.TOP_LEFT,
            startX = isSearchTL?0:width-1, endX = isSearchTL?width:-1, stepX = isSearchTL?1:-1,
            startY = isSearchTL?0:height-1, endY = isSearchTL?height:-1, stepY = isSearchTL?1:-1

            for (y=startY;y!=endY;y+=stepY) {
                yi = y*ow
                for (x=startX;x!=endX;x+=stepX) {
                    xi = yi+x*4
                    currentR = data[xi] 
                    if (temperance) {
                        if (currentR >= br && currentR <= tr) {
                            currentG = data[xi+1]
                            currentB = data[xi+2]
                            if (currentG >= bg && currentG <= tg && currentB >= bb && currentB <= tb && (!useAlpha || (currentA >= ba && currentA <= ta))) return [x, y]
                        }
                    } else if (currentR == r) if (data[xi+1] == g && data[xi+2] == b && (!useAlpha || data[xi+3] == a)) return [x, y]
                }
            }

        return null
    }

    /**
     * Returns a new instance of the same color
     * @param {[pos1, pos2]} dynamicColorPositions: the positions if the color is a _DynamicColor instance
     */
    duplicate(dynamicColorPositions) {
        const formats = Color.FORMATS, format = this._format
        if (format == formats.GRADIENT || format == formats.PATTERN) return new Color(this._color.duplicate(dynamicColorPositions))
        else return new Color(Color.#unlinkRGBA(this.#rgba))
    }

    toString() {
        let colorValue = Color.getColorValue(this._color)
        if (colorValue instanceof CanvasGradient || colorValue instanceof CanvasPattern) colorValue = this._color.toString()
        return colorValue
    }

    // returns the usable value of the color
    get color() {
        const formats = Color.FORMATS, format = this._format
        if (format == formats.GRADIENT || format == formats.PATTERN) return this._color.value
        else return Color.formatRgba(this.#rgba)
    }
    get colorRaw() {return this._color} // returns the declaration of the color
    get isChannel() {return this._isChannel}
    get rgba() {return this.#rgba}
    get hsv() {return this.#hsv}
    get r() {return this.#rgba[0]}
    get g() {return this.#rgba[1]}
    get b() {return this.#rgba[2]}
    get a() {return this.#rgba[3]}
    get hue() {return this.#hsv[0]}
    get saturation() {return this.#hsv[1]}
    get brightness() {return this.#hsv[2]}

    set color(color) {
        this._color = color?._color||color
        this._format = Color.getFormat(this._color)
        this.#updateCache()
    }
    set r(r) {this.#rgba[0] = CDEUtils.round(r, Color.DEFAULT_DECIMAL_ROUNDING_POINT)}
    set g(g) {this.#rgba[1] = CDEUtils.round(g, Color.DEFAULT_DECIMAL_ROUNDING_POINT)}
    set b(b) {this.#rgba[2] = CDEUtils.round(b, Color.DEFAULT_DECIMAL_ROUNDING_POINT)}
    set a(a) {this.#rgba[3] = CDEUtils.round(a, Color.DEFAULT_DECIMAL_ROUNDING_POINT)}
    set rgba(rgba) {
        this.#rgba[0] = CDEUtils.round(rgba[0], Color.DEFAULT_DECIMAL_ROUNDING_POINT)
        this.#rgba[1] = CDEUtils.round(rgba[1], Color.DEFAULT_DECIMAL_ROUNDING_POINT)
        this.#rgba[2] = CDEUtils.round(rgba[2], Color.DEFAULT_DECIMAL_ROUNDING_POINT)
        this.#rgba[3] = CDEUtils.round(rgba[3], Color.DEFAULT_DECIMAL_ROUNDING_POINT)
    }
    set hue(hue) {
        hue = hue%360
        if (this.#hsv[0] != hue) {
            this.#hsv[0] = hue
            this.#rgba = Color.#hsvToRgba(this.#hsv)
        }
    }
    set saturation(saturation) {
        saturation = saturation>100?100:saturation
        if (this.#hsv[1] != saturation) {
        this.#hsv[1] = saturation
        this.#rgba = Color.#hsvToRgba(this.#hsv)
        }
    }
    set brightness(brightness) {
        brightness = brightness>100?100:brightness
        if (this.#hsv[2] != brightness) {
            this.#hsv[2] = brightness
            this.#rgba = Color.#hsvToRgba(this.#hsv)
        }
    }
}

const colors = Object.entries(Color.CSS_COLOR_TO_RGBA_CONVERTIONS), c_ll = colors.length
for (let i=0;i<c_ll;i++) {
    const color = colors[i]
    Object.defineProperty(Color, color[0], {get() {return color[1]}})
}