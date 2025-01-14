// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Sketchy array utils :)
// Returns the element at the specified index, starting from the end of the array
Array.prototype.last=function(index=0){return this[this.length-1-index]}
// Adds an element to the specified index of the array
Array.prototype.addAt=function(el, index=0){return this.slice(0,index).concat(...[el, this.slice(index, this.length)])}

class CDEUtils {
    static ACCEPTABLE_DIF = 0.0000001
    static CIRC = 2*Math.PI

    // returns a random number within the min and max range. Can generate decimals
    static random(min, max, decimals=0) {
        return +(Math.random()*(max-min)+min).toFixed(decimals)
    }

    static clamp(value, min=Infinity, max=Infinity) {
        return value < min ? min : value > max ? max : value
    }

     // Create an instance of the FPSCounter and run every frame: either getFpsRaw for raw fps AND/OR getFps for averaged fps
    static FPSCounter = class {
        constructor(avgSampleSize) {
            this._t = []
            this._maxFps=0
            this._avgSampleSize = avgSampleSize||10
            this._avg = []
        }
    
        getFpsRaw() {//run in the loop
            let n=performance.now(), fps
            while (this._t.length>0 && this._t[0]<=n-1000) this._t.shift()
            fps = this._t.push(n)
            if (this._maxFps < fps) this._maxFps = fps
            return fps
        }
    
        getFps() {//or run in the loop
            this._avg.push(this.getFpsRaw())
            if (this._avg.length > this._avgSampleSize) this._avg.shift()
            return Math.floor(Math.min(this._avg.reduce((a, b)=>a+b,0)/this._avgSampleSize, this._maxFps))
        }
    
        get maxFps() {return this._maxFps-1}
        get avgSample() {return this._avgSampleSize}
        get fpsRaw() {return this._t.length}
        
        set avgSample(s) {this._avgSampleSize = s}
    }

    // Returns the pythagorian distance between 2 points
    static getDist(x1, y1, x2, y2) {
        return Math.sqrt((x1-x2)**2 + (y1-y2)**2)
    }

    // Returns the "a", "b" and "function" values formed by a line between 2 positions
    static getLinearFn(pos1, pos2) {
        let a = (pos2[1]-pos1[1])/(pos2[0]-pos1[0]), b = -(a*pos1[0]-pos1[1])
        return [a, b, (x)=>a*x+b]
    }
    
    /**
    * Returns the interpolated number between (max) and (max - range) 
    * @param {Number} max: the max value to return
    * @param {Number} ratio: the linear interpolation progress (0 to 1)
    * @param {Number} range: defines the range of the max value to be used, inverts direction when negated
                            [if range=max, then (0 to max) will be used] or
                            [if range=max/2, only (max/2 to max) will be used] or
                            [if range=0, only (max to max) will be used]
    */
    static mod(max, ratio, range) {
        range??=max
        return max-ratio*range+max*((range>=0)-1)
    }

    // returns converted given degrees into radians 
    static toRad(deg) {
        return deg*(Math.PI/180)
    }

    // returns converted given radians into degrees 
    static toDeg(rad) {
        return rad/(Math.PI/180)
    }

    /**
    * Rounds the specied decimal number if it's close enough to its rounded value 
    * @param {Number} n: a decimal number 
    * @param {Number} okDif: the minimal difference between the given decimal number and it's rounded conterpart, for them be considered the same 
    * @returns The potentially adjusted number
    */
    static getAcceptableDif(n, okDif=CDEUtils.ACCEPTABLE_DIF) {
        return Math.round(n)-n <= okDif ? Math.round(n) : n
    }

    /**
    * @param {[Number|Object]} arr: array containing numbers or objects a numberic property 
    * @param {String?} propPath: the path of the compared value if the array is containing objects 
    * @returns the [min, max] values of the array
    */
    static getMinMax(arr, propPath=null) {
       let min = Infinity, max = -Infinity, ll = arr.length
       for (let i=0;i<ll;i++) {
           let v = propPath ? +arr[i][propPath] : arr[i]
         if (v < min) min = v
         if (v > max) max = v
       }
       return [min, max]
   }

    /**
    * Calls a function repeatedly with a delay between calls
    * @param {Number} iterationCount: the number of time the callback is called
    * @param {Function} callback: the function to call (i)=>
    * @param {Number} delay: delay between each calls
    */
    static repeatedTimeout(iterationCount, callback, delay=5) {
        let at = 0
        for (let i=0;i<iterationCount;i++) {
            setTimeout(()=>callback(i),at+=delay)
        }
    }

}





// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Provides generic canvas functions
class CanvasUtils {
    static SHOW_CENTERS_DOT_ID = {}

    // DEBUG // Can be used to display a dot at the specified shape pos (which is normally not visible)
    static toggleCenter(shape, radius=5, color=[255,0,0,1]) {
        if (!CanvasUtils.SHOW_CENTERS_DOT_ID[shape.id]) {
            let dot = new Dot(()=>[shape.x, shape.y], radius, color)
            CanvasUtils.SHOW_CENTERS_DOT_ID[shape.id] = dot.id
            CVS.add(dot, true)
        } else {
            CVS.remove(CanvasUtils.SHOW_CENTERS_DOT_ID[shape.id])
            delete CanvasUtils.SHOW_CENTERS_DOT_ID[shape.id]
        }
    }

    // DEBUG // Create dots at provided intersection points
    static showIntersectionPoints(res) {
        let s_d1 = new Dot(res.source.inner, 3, [255,0,0,1]),
            s_d2 = new Dot(res.source.outer, 3, [255,0,0,0.45]),
            t_d1 = new Dot(res.target.outer, 3, [255,0,0,0.45]),
            t_d2 = new Dot(res.target.inner, 3, [255,0,0,1])
        
        CVS.add(s_d1, true)
        CVS.add(s_d2, true)
        CVS.add(t_d1, true)
        CVS.add(t_d2, true)
    }
    
    // Generic function to draw an outer ring around a dot
    static drawOuterRing(dot, color, radiusMultiplier) {
        let ctx = dot.ctx
        ctx.strokeStyle = Color.formatRgba(color)??color.color
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.radius*radiusMultiplier, 0, CDEUtils.CIRC)
        ctx.stroke()
    }
    
    // Generic function to draw connection between the specified dot and a sourcePos
    static drawConnection(dot, color, source, radiusPaddingMultiplier=0) {
        let ctx = dot.ctx, [sx, sy] = source.pos||source

        if (color[3]==0 || color.a==0) return;

        ctx.strokeStyle = Color.formatRgba(color)??color.color
        ctx.beginPath()
        if (radiusPaddingMultiplier) {// also, only if sourcePos is Dot
            let res = dot.getLinearIntersectPoints(source, source.radius*radiusPaddingMultiplier, dot, dot.radius*radiusPaddingMultiplier)
            ctx.moveTo(res.source.inner[0], res.source.inner[1])
            ctx.lineTo(res.target.inner[0], res.target.inner[1])
        } else {
            ctx.moveTo(sx, sy)
            ctx.lineTo(dot.x, dot.y)
        }
        ctx.stroke()
    }

    // Generic function to draw connections between the specified dot and all the dots in its connections property
    static drawDotConnections(dot, color, radiusPaddingMultiplier=0, isSourceOver=false) {// CAN BE OPTIMIZED VIA ALPHA
        let ctx = dot.ctx, dc_ll = dot.connections.length, colorValue = Color.formatRgba(color)??color.color

        if (color[3]==0 || color.a==0) return;

        if (!isSourceOver) ctx.globalCompositeOperation = "destination-over"

        if (dc_ll) for (let i=0;i<dc_ll;i++) {
            let c = dot.connections[i]
            ctx.strokeStyle = colorValue
            ctx.beginPath()
            if (radiusPaddingMultiplier) {
                let res = dot.getLinearIntersectPoints(c, c.radius*radiusPaddingMultiplier, dot, dot.radius*radiusPaddingMultiplier)
                ctx.moveTo(res.source.inner[0], res.source.inner[1])
                ctx.lineTo(res.target.inner[0], res.target.inner[1])
            } else {
                ctx.moveTo(dot.x, dot.y)
                ctx.lineTo(c.x, c.y)
            }
            ctx.stroke()
        }
        if (!isSourceOver) ctx.globalCompositeOperation = "source-over"
    }

    // Generic function to get a callback that can make a dot draggable and throwable
    static getDraggableDotCB(pickableRadius=50) {
        let mouseup = false, dragAnim = null
        return (dot, mouse, dist, ratio)=>{
            if (mouse.clicked && dist < pickableRadius) {
                mouseup = true
                if (dot?.currentBacklogAnim?.id == dragAnim?.id && dragAnim) dragAnim.end()
                dot.x = mouse.x
                dot.y = mouse.y
            } else if (mouseup) {
                mouseup = false
                dragAnim = dot.addForce(Math.min(CDEUtils.mod(Math.min(mouse.speed,3000), ratio)/4, 300), mouse.dir, 750+ratio*1200, Anim.easeOutQuad)
            }
        }
    }


}
// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Represents a color value
class Color {
    static DEFAULT_TEMPERANCE = 0
    static DEFAULT_COLOR = "aliceblue"
    static CSS_COLOR_TO_RGBA_CONVERTIONS = {aliceblue:[240,248,255,1],antiquewhite:[250,235,215,1],aqua:[0,255,255,1],aquamarine:[127,255,212,1],azure:[240,255,255,1],beige:[245,245,220,1],bisque:[255,228,196,1],black:[0,0,0,1],blanchedalmond:[255,235,205,1],blue:[0,0,255,1],blueviolet:[138,43,226,1],brown:[165,42,42,1],burlywood:[222,184,135,1],cadetblue:[95,158,160,1],chartreuse:[127,255,0,1],chocolate:[210,105,30,1],coral:[255,127,80,1],cornflowerblue:[100,149,237,1],cornsilk:[255,248,220,1],crimson:[220,20,60,1],cyan:[0,255,255,1],darkblue:[0,0,139,1],darkcyan:[0,139,139,1],darkgoldenrod:[184,134,11,1],darkgray:[169,169,169,1],darkgreen:[0,100,0,1],darkkhaki:[189,183,107,1],darkmagenta:[139,0,139,1],darkolivegreen:[85,107,47,1],darkorange:[255,140,0,1],darkorchid:[153,50,204,1],darkred:[139,0,0,1],darksalmon:[233,150,122,1],darkseagreen:[143,188,143,1],darkslateblue:[72,61,139,1],darkslategray:[47,79,79,1],darkturquoise:[0,206,209,1],darkviolet:[148,0,211,1],deeppink:[255,20,147,1],deepskyblue:[0,191,255,1],dimgray:[105,105,105,1],dodgerblue:[30,144,255,1],firebrick:[178,34,34,1],floralwhite:[255,250,240,1],forestgreen:[34,139,34,1],fuchsia:[255,0,255,1],gainsboro:[220,220,220,1],ghostwhite:[248,248,255,1],gold:[255,215,0,1],goldenrod:[218,165,32,1],gray:[128,128,128,1],green:[0,128,0,1],greenyellow:[173,255,47,1],honeydew:[240,255,240,1],hotpink:[255,105,180,1],indianred:[205,92,92,1],indigo:[75,0,130,1],ivory:[255,255,240,1],khaki:[240,230,140,1],lavender:[230,230,250,1],lavenderblush:[255,240,245,1],lawngreen:[124,252,0,1],lemonchiffon:[255,250,205,1],lightblue:[173,216,230,1],lightcoral:[240,128,128,1],lightcyan:[224,255,255,1],lightgoldenrodyellow:[250,250,210,1],lightgray:[211,211,211,1],lightgreen:[144,238,144,1],lightpink:[255,182,193,1],lightsalmon:[255,160,122,1],lightseagreen:[32,178,170,1],lightskyblue:[135,206,250,1],lightslategray:[119,136,153,1],lightsteelblue:[176,224,230,1],lightyellow:[255,255,224,1],lime:[0,255,0,1],limegreen:[50,205,50,1],linen:[250,240,230,1],magenta:[255,0,255,1],maroon:[128,0,0,1],mediumaquamarine:[102,205,170,1],mediumblue:[0,0,205,1],mediumorchid:[186,85,211,1],mediumpurple:[147,112,219,1],mediumseagreen:[60,179,113,1],mediumslateblue:[123,104,238,1],mediumspringgreen:[0,250,154,1],mediumturquoise:[72,209,204,1],mediumvioletred:[199,21,133,1],midnightblue:[25,25,112,1],mintcream:[245,255,250,1],mistyrose:[255,228,225,1],moccasin:[255,228,181,1],navajowhite:[255,222,173,1],navy:[0,0,128,1],oldlace:[253,245,230,1],olive:[128,128,0,1],olivedrab:[107,142,35,1],orange:[255,165,0,1],orangered:[255,69,0,1],orchid:[218,112,214,1],palegoldenrod:[238,232,170,1],palegreen:[152,251,152,1],paleturquoise:[175,238,238,1],palevioletred:[219,112,147,1],papayawhip:[255,239,213,1],peachpuff:[255,218,185,1],peru:[205,133,63,1],pink:[255,192,203,1],plum:[221,160,221,1],powderblue:[176,224,230,1],purple:[128,0,128,1],rebeccapurple:[102,51,153,1],red:[255,0,0,1],rosybrown:[188,143,143,1],royalblue:[65,105,225,1],saddlebrown:[139,69,19,1],salmon:[250,128,114,1],sandybrown:[244,164,96,1],seagreen:[46,139,87,1],seashell:[255,245,238,1],sienna:[160,82,45,1],silver:[192,192,192,1],skyblue:[135,206,235,1],slateblue:[106,90,205,1],slategray:[112,128,144,1],snow:[255,250,250,1],springgreen:[0,255,127,1],steelblue:[70,130,180,1],tan:[210,180,140,1],teal:[0,128,128,1],thistle:[216,191,216,1],tomato:[255,99,71,1],turquoise:[64,224,208,1],violet:[238,130,238,1],wheat:[245,222,179,1],white:[255,255,255,1],whitesmoke:[245,245,245,1],yellow:[255,255,0,1],yellowgreen:[154,205,50,1]}
    static RGBA_TO_CSS_COLOR_CONVERTIONS = {"240,248,255,1":"aliceblue","250,235,215,1":"antiquewhite","0,255,255,1":"aqua","127,255,212,1":"aquamarine","240,255,255,1":"azure","245,245,220,1":"beige","255,228,196,1":"bisque","0,0,0,1":"black","255,235,205,1":"blanchedalmond","0,0,255,1":"blue","138,43,226,1":"blueviolet","165,42,42,1":"brown","222,184,135,1":"burlywood","95,158,160,1":"cadetblue","127,255,0,1":"chartreuse","210,105,30,1":"chocolate","255,127,80,1":"coral","100,149,237,1":"cornflowerblue","255,248,220,1":"cornsilk","220,20,60,1":"crimson","0,0,139,1":"darkblue","0,139,139,1":"darkcyan","184,134,11,1":"darkgoldenrod","169,169,169,1":"darkgray","0,100,0,1":"darkgreen","189,183,107,1":"darkkhaki","139,0,139,1":"darkmagenta","85,107,47,1":"darkolivegreen","255,140,0,1":"darkorange","153,50,204,1":"darkorchid","139,0,0,1":"darkred","233,150,122,1":"darksalmon","143,188,143,1":"darkseagreen","72,61,139,1":"darkslateblue","47,79,79,1":"darkslategray","0,206,209,1":"darkturquoise","148,0,211,1":"darkviolet","255,20,147,1":"deeppink","0,191,255,1":"deepskyblue","105,105,105,1":"dimgray","30,144,255,1":"dodgerblue","178,34,34,1":"firebrick","255,250,240,1":"floralwhite","34,139,34,1":"forestgreen","220,220,220,1":"gainsboro","248,248,255,1":"ghostwhite","255,215,0,1":"gold","218,165,32,1":"goldenrod","128,128,128,1":"gray","0,128,0,1":"green","173,255,47,1":"greenyellow","240,255,240,1":"honeydew","255,105,180,1":"hotpink","205,92,92,1":"indianred","75,0,130,1":"indigo","255,255,240,1":"ivory","240,230,140,1":"khaki","230,230,250,1":"lavender","255,240,245,1":"lavenderblush","124,252,0,1":"lawngreen","255,250,205,1":"lemonchiffon","173,216,230,1":"lightblue","240,128,128,1":"lightcoral","224,255,255,1":"lightcyan","250,250,210,1":"lightgoldenrodyellow","211,211,211,1":"lightgray","144,238,144,1":"lightgreen","255,182,193,1":"lightpink","255,160,122,1":"lightsalmon","32,178,170,1":"lightseagreen","135,206,250,1":"lightskyblue","119,136,153,1":"lightslategray","176,224,230,1":"lightsteelblue","255,255,224,1":"lightyellow","0,255,0,1":"lime","50,205,50,1":"limegreen","250,240,230,1":"linen","255,0,255,1":"magenta","128,0,0,1":"maroon","102,205,170,1":"mediumaquamarine","0,0,205,1":"mediumblue","186,85,211,1":"mediumorchid","147,112,219,1":"mediumpurple","60,179,113,1":"mediumseagreen","123,104,238,1":"mediumslateblue","0,250,154,1":"mediumspringgreen","72,209,204,1":"mediumturquoise","199,21,133,1":"mediumvioletred","25,25,112,1":"midnightblue","245,255,250,1":"mintcream","255,228,225,1":"mistyrose","255,228,181,1":"moccasin","255,222,173,1":"navajowhite","0,0,128,1":"navy","253,245,230,1":"oldlace","128,128,0,1":"olive","107,142,35,1":"olivedrab","255,165,0,1":"orange","255,69,0,1":"orangered","218,112,214,1":"orchid","238,232,170,1":"palegoldenrod","152,251,152,1":"palegreen","175,238,238,1":"paleturquoise","219,112,147,1":"palevioletred","255,239,213,1":"papayawhip","255,218,185,1":"peachpuff","205,133,63,1":"peru","255,192,203,1":"pink","221,160,221,1":"plum","128,0,128,1":"purple","102,51,153,1":"rebeccapurple","255,0,0,1":"red","188,143,143,1":"rosybrown","65,105,225,1":"royalblue","139,69,19,1":"saddlebrown","250,128,114,1":"salmon","244,164,96,1":"sandybrown","46,139,87,1":"seagreen","255,245,238,1":"seashell","160,82,45,1":"sienna","192,192,192,1":"silver","135,206,235,1":"skyblue","106,90,205,1":"slateblue","112,128,144,1":"slategray","255,250,250,1":"snow","0,255,127,1":"springgreen","70,130,180,1":"steelblue","210,180,140,1":"tan","0,128,128,1":"teal","216,191,216,1":"thistle","255,99,71,1":"tomato","64,224,208,1":"turquoise","238,130,238,1":"violet","245,222,179,1":"wheat","255,255,255,1":"white","245,245,245,1":"whitesmoke","255,255,0,1":"yellow","154,205,50,1":"yellowgreen"}
    static FORMATS = {RGBA:"RGBA", TEXT:"TEXT", HEX:"HEX", GRADIENT:"GRADIENT", COLOR:"COLOR"}

    #rgba = null // cached rgba value
    constructor(color, isChannel=false,) {
        this._color = color instanceof Color ? color.colorRaw : color||Color.DEFAULT_COLOR // the color value declaration, in any format
        this._format = this.getFormat()
        this.#updateRGBA()

        this._isChannel = isChannel // if true, this instance will be used as a color channel and will not duplicate
    }

    // returns a new instance of the same color
    duplicate() {
        return new Color([...this.#rgba])
    }

    // updates the cached rgba value
    #updateRGBA() {
        this.#rgba = (this._format !== Color.FORMATS.RGBA ? this.convertTo(Color.FORMATS.RGBA) : [...this._color])
    }

    // converts a color to another color format
    static convertTo(format=Color.FORMATS.RGBA, color) {
        let inputFormat =  this.getFormat(color), convertedColor = color

        if (format==Color.FORMATS.RGBA) {
            if (inputFormat==Color.FORMATS.HEX) convertedColor = Color.#hexToRgba(color)
            else if (inputFormat==Color.FORMATS.TEXT) convertedColor = [...Color.CSS_COLOR_TO_RGBA_CONVERTIONS[color]]
        } else if (format==Color.FORMATS.HEX) {
            if (inputFormat==Color.FORMATS.RGBA) convertedColor = Color.#rgbaToHex(color)
            else if (inputFormat==Color.FORMATS.TEXT) convertedColor = Color.#rgbaToHex(Color.CSS_COLOR_TO_RGBA_CONVERTIONS[color])
        } else if (format==Color.FORMATS.TEXT) {
            if (inputFormat==Color.FORMATS.RGBA) convertedColor = Color.RGBA_TO_CSS_COLOR_CONVERTIONS[color.toString()] ?? color
            else if (inputFormat==Color.FORMATS.HEX) convertedColor = Color.RGBA_TO_CSS_COLOR_CONVERTIONS[Color.#hexToRgba(color).toString()] ?? color
        }

        return convertedColor
    }
    // instance version
    convertTo(format=Color.FORMATS.RGBA, color=this._color) {
        return Color.convertTo(format, color)
    }

    // returns the format of the provided color
    static getFormat(color) {
        return Array.isArray(color) ? Color.FORMATS.RGBA : color instanceof Color ? Color.FORMATS.COLOR : color instanceof Gradient ? Color.FORMATS.GRADIENT : color.includes("#") ? Color.FORMATS.HEX : Color.FORMATS.TEXT
    }
    // instance version
    getFormat(color=this._color) {
        return Color.getFormat(color)
    }

    // converts rbga to hex
    static #rgbaToHex(rgba) {
        return "#"+rgba.reduce((a,b,i)=>a+=(i&&!(i%3)?Math.round(b*255):b).toString(16).padStart(2,"0"),"")
    }

    // converts hex to rgba
    static #hexToRgba(hex) {
        return hex.padEnd(9, "F").match(/[a-z0-9]{2}/gi).reduce((a,b,i)=>a.concat(parseInt(b, 16)/(i&&!(i%3)?255:1)),[])
    }

    // ajust color values to Color instances
    static adjust(color) {
        return color instanceof Color ? color.isChannel?color:color.duplicate() : new Color(color)
    }
    
    // formats a rgba array to a usable rgba value
    static formatRgba(arrayRgba) {
        return Array.isArray(arrayRgba) ? `rgba(${arrayRgba[0]}, ${arrayRgba[1]}, ${arrayRgba[2]}, ${arrayRgba[3]})` : null
    }

    static SEARCH_START = {TOP_LEFT:"TOP_LEFT", BOTTOM_RIGHT:"BOTTOM_RIGHT"}
    static DEFAULT_SEARCH_START = Color.SEARCH_START.TOP_LEFT
    static findFirstPos(canvas, color, useAlpha=false, temperance=Color.DEFAULT_TEMPERANCE, searchStart=Color.DEFAULT_SEARCH_START, areaSize=[]) {
        let width = areaSize[0]??canvas.width, height = areaSize[1]??canvas.height,
            data = canvas.ctx.getImageData(0, 0, width, height).data,
            x, y, yi, xi, currentR, currentG, currentB, currentA, ow = 4*width,
            r = color.r, g = color.g, b = color.b, a = color.a*255,
            br = r-temperance, bg = g-temperance, bb = b-temperance, ba = a,
            tr = r+temperance, tg = g+temperance, tb = b+temperance, ta = a,
            isSearchTL = searchStart==Color.SEARCH_START.TOP_LEFT,
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

    // returns the usable value of the color
    get color() {
        let color = Color.formatRgba(this.#rgba)
        if (this._format == Color.FORMATS.GRADIENT) color = this._color.gradient
        return color 
    }
    get colorRaw() {return this._color} // returns the declaration of the color
    get isChannel() {return this._isChannel}

    get r() {return this.#rgba[0]}
    get g() {return this.#rgba[1]}
    get b() {return this.#rgba[2]}
    get a() {return this.#rgba[3]}


    set color(color) {
        this._color = color
        this._format = this.getFormat()
        this.#updateRGBA()
    }

    set r(r) {this.#rgba[0] = r}
    set g(g) {this.#rgba[1] = g}
    set b(b) {this.#rgba[2] = b}
    set a(a) {this.#rgba[3] = a}
}


// all sources should be built with "D", this object provides all the cardinal and intercardinal directions that should link the dots to create symbols
// Any source should contain: the width and height of all its symbols, and the symbols definitions (key in uppercase)
/* To create a symbol: [...[index, directions]]
 * A symbol is composed of a main array, containing the sub-arrays
 * - The main array defines the vertical layers, a new layer is created each time an horizontal index of is lower than the last
 * - The sub-arrays each define a dot, its horizontal index and the directions of its connections
 *
 * Example for creating the letter "A" in a 5x5 source, which looks like this
 *
 *     0   1   2   3   4
 *  0          o
 *  1      o       o
 *  2  o   o   o   o   o
 *  3  o               o
 *  4  o               o
 *
 * STEPS:
 * 1. Creating the main array -> [] 
 * 2. The 1st vertical layer (vertical index 0) -> 
 *   since the "A" symbol doesn't have any dot at (0,0) and (1,0), the first dot is at the coords (2, 0)
 *   because we're at the first vertical layer, the vertical index is automatically taken care of,  
 *   for the horizontal index, we need to specify it in the sub-array. -> [2,] -> [ [2,] ]
 * 3. A dot is now placed at (2,0), but it still has no connection to any other dot, to add connections,
 *   we use the "D" constant. ---Note: always define connections from upper dots to lower dots, and from left to right, to avoid redundancy---
 *   in this example, the needed connections are with the dots at (1, 1) and (3, 1). To achieve these, 
 *   we add a bottom-left (bl) and a bottom-right (br) connections as the second parameter of the sub-array -> [2, D.bl + D.br] -> [ [2,D.bl+D.br] ]
 * 4. Since the first layer had only a single dot, it now has the correct placement and connections, let's continue the example with the second layer:
 *   This layer has dots only at (1, 1) and (3, 1), so we can create the following sub-arrays -> [1,] and [3,].
 *   ---Note: A new vertical layer is created since the first's sub-array horizontal index (1) is smaller than the previous sub-array's one (2)---
 *   Looking at the "A" graph above, the entire 3rd layer (vertical index 2) is filled with dots. 
 *   Though, to make the letter "A", we only need to connect to the dots at (0, 2) and (4, 2).
 *   We achieve these two connections by updating our previous sub-arrays like this -> [1, D.bl] and [3, D.br]
 * 5. Continue the process until the symbol if fully formed
 *
 *  Particuliarities: 
 *   - Leaving a sub-array's horizontal index empty (ex: [,D.br]), will take in value the increment of the previous sub-array horizontal index
 *   - Leaving a sub-array's connections parameter empty (ex: [2]), will make it so the dot does not initiate any connection
 *   - Leaving a sub-array completely empty (ex: []) logically implies that a dot will be created at the next horizontal index and that it won't initiate connections
 */ 

class GridAssets {
    static D = [["t","-ar"],["r",1],["b","ar"],["l",-1],["tr","1-ar"],["br","ar+1"],["bl","ar-1"],["tl","-ar-1"]].reduce((a,[b,d],i)=>(a.places.push([a[b]=1<<i,(ar)=>new Function("ar",`return ${d}`)(ar)]),a),{places:[]})

    static get fontSource5x5() {
        const D = GridAssets.D
        return {
            width:5,
            height:5,
            A: [
                [2,D.bl+D.br],
                [1,D.bl],[3,D.br],
                [0,D.r+D.b],[1,D.r],[2,D.r],[3,D.r],[4,D.b],
                [0,D.b],[4,D.b],
                [0],[4]
            ],
            B: [
                [0,D.r+D.b],[,D.r],[,D.r],[,D.br],
                [0,D.b],[4,D.bl],
                [0,D.r+D.b],[,D.r],[,D.r],[,D.br],
                [0,D.b],[4,D.bl],
                [0,D.r],[,D.r],[,D.r],[]
            ],
            C: [
                [1,D.r+D.bl],[,D.r],[,D.r],[],
                [0,D.b],
                [0,D.b],
                [0,D.br],
                [-1,D.r],[2,D.r],[,D.r],[]
              ],
            D: [
                [0,D.r+D.b],[,D.r],[,D.r],[,D.br],
                [0,D.b],[4,D.b],
                [0,D.b],[4,D.b],
                [0,D.b],[4,D.bl],
                [0,D.r],[,D.r],[,D.r],[]
            ],E: [
                [0,D.r+D.b],[,D.r],[,D.r],[,D.r],[],
                [0,D.b],
                [0,D.b+D.r],[,D.r],[,D.r],[,D.r],
                [0,D.b],
                [0,D.r],[,D.r],[,D.r],[,D.r],[]
            ],F: [
                [0,D.r+D.b],[,D.r],[,D.r],[,D.r],[],
                [0,D.b],
                [0,D.b+D.r],[,D.r],[,D.r],[],
                [0,D.b],
                [0]
            ],G: [
                [1,D.r+D.bl],[,D.r],[,D.r],[],
                [0,D.b],
                [0,D.b],[3,D.r],[4,D.b],
                [0,D.br],[4,D.b],
                [1,D.r],[,D.r],[,D.r],[]
            ],H: [
                [0,D.r+D.b],[4,D.b],
                [0,D.b],[4,D.b],
                [0,D.b+D.r],[,D.r],[,D.r],[,D.r],[,D.b],
                [0,D.b],[4,D.b],
                [0],[4]
            ],I: [
                [1,D.r],[,D.b+D.r],[],
                [2,D.b],
                [2,D.b],
                [2,D.b],
                [1,D.r],[,D.r],[]
            ],J: [
                [1,D.r],[,D.r],[,D.b+D.r],[],
                [3,D.b],
                [3,D.b],
                [0,D.br],[3,D.bl],
                [1,D.r],[,D.r]
            ],K: [
                [0,D.b],[3,D.bl],
                [0,D.b],[2,D.bl],
                [0,D.b+D.r],[,D.r+D.br],
                [0,D.b],[2,D.br],
                [0],[3,D.r]
            ],L: [
                [0,D.b],
                [0,D.b],
                [0,D.b],
                [0,D.b],
                [0,D.r],[,D.r],[,D.r],[,D.r]
            ],M: [
                [0,D.b+D.br],[4,D.b+D.bl],
                [0,D.b],[,D.br],[3,D.bl],[4,D.b],
                [0,D.b],[2],[4,D.b],
                [0,D.b],[4,D.b],
                [0],[4]
            ],N: [
                [0,D.b+D.br],[4,D.b],
                [0,D.b],[,D.br],[4,D.b],
                [0,D.b],[2,D.br],[4,D.b],
                [0,D.b],[3,D.br],[4,D.b],
                [0],[4]
            ],O: [
                [1,D.bl+D.r],[,D.r],[,D.br],
                [0,D.b],[4,D.b],
                [0,D.b],[4,D.b],
                [0,D.b+D.br],[4,D.b+D.bl],
                [1,D.r],[,D.r],[,D.r]
            ],P: [
                [0,D.r+D.b],[,D.r],[,D.br],
                [0,D.b],[3,D.bl],
                [0,D.b+D.r],[,D.r],[],
                [0,D.b],
                [0]
            ],Q: [
                [1,D.bl+D.r],[,D.r],[,D.br],
                [0,D.b],[4,D.b],
                [0,D.b],[4,D.b],
                [0,D.b+D.br],[3,D.br],[,D.bl],
                [1,D.r],[,D.r],[],[]
            ],R: [
                [0,D.r+D.b],[,D.r],[,D.br],
                [0,D.b],[3,D.bl],
                [0,D.b+D.r],[,D.r+D.br],[],
                [0,D.b],[2,D.br],
                [0],[3]
            ],S: [
                [1,D.r+D.bl],[,D.r],[,D.r],[],
                [0,D.br],
                [-1,D.r],[2,D.r],[,D.br],
                [-4,D.bl],
                [0,D.r+D.bl],[,D.r],[,D.r],[]
            ],T: [
                [0,D.r],[,D.r],[,D.b+D.r],[,D.r],[],
                [2,D.b],
                [2,D.b],
                [2,D.b],
                [2]
            ],U: [
                [0,D.r+D.b],[4,D.b],
                [0,D.b],[4,D.b],
                [0,D.b+D.r],[4,D.b],
                [0,D.br],[4,D.bl],
                [1,D.r],[,D.r],[,D.r]
            ],V: [
                [0,D.r+D.b],[4,D.b],
                [0,D.b],[4,D.b],
                [0,D.br],[4,D.bl],
                [1,D.br],[3,D.bl],
                [2,D.r],
            ],W: [
                [0,D.b+D.br],[4,D.b+D.bl],
                [0,D.b],[4,D.b],
                [0,D.b],[2,D.bl+D.br],[4,D.b],
                [0,D.b],[,D.bl],[3,D.br],[4,D.b],
                [0],[4]
            ],X: [
                [0,D.br],[4,D.bl],
                [1,D.br],[3,D.bl],
                [2,D.br+D.bl],
                [1,D.bl],[3,D.br],
                [0],[4]
            ],Y: [
                [0,D.br],[4,D.bl],
                [1,D.br],[3,D.bl],
                [2,D.b],
                [2,D.b],
                [2]
            ],Z: [
                [0,D.r],[,D.r],[,D.r],[,D.r],[,D.bl],
                [3,D.bl],
                [2,D.bl],
                [1,D.bl],
                [0,D.r],[,D.r],[,D.r],[,D.r],[]
            ]
        }
    }


    
}
// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Represents the user's mouse
class Mouse {
    static DEFAULT_MOUSE_DECELERATION = 0.8
    static DEFAULT_MOUSE_MOVE_TRESHOLD = 0.1
    static DEFAULT_MOUSE_ANGULAR_DECELERATION = 0.2

    constructor() {
        this._valid = false               // whether the mouse pos is valid (is inside the canvas and initialized)
        this._x = null                    // current x value of the mouse on the canvas
        this._y = null                    // current y value of the mouse on the canvas
        this._lastX = null                // previous x value of the mouse on the canvas
        this._lastY = null                // previous y value of the mouse on the canvas
        this._dir = null                  // direction in degrees of the mouse
        this._speed = null                // speed in px/s of the mouse
        this._clicked = false             // whether the main button of the mouse is active
        this._rightClicked = false        // whether the secondary button of the mouse is active
        this._scrollClicked = false       // whether the scroll button of the mouse is active (pressed)
        this._extraForwardClicked = false // whether the extra foward button of the mouse is active (not present on every mouse)
        this._extraBackClicked = false    // whether the extra back button of the mouse is active (not present on every mouse)
    }

    // calculates and sets the current mouse speed (loop every frame)
    calcSpeed(deltaTime) {
        if (isFinite(this._lastX) && isFinite(this._lastY) && deltaTime) {
            this._speed = this._speed*Mouse.DEFAULT_MOUSE_DECELERATION+(CDEUtils.getDist(this._x, this._y, this._lastX, this._lastY)/deltaTime)*(1-Mouse.DEFAULT_MOUSE_DECELERATION)
            if (this._speed < Mouse.DEFAULT_MOUSE_MOVE_TRESHOLD) this._speed = 0
        } else this._speed = 0

        this._lastX = this._x
        this._lastY = this._y
    }

    // calculates and set the current mouse direction (run on mouse move)
    calcAngle() {
        let dx = this._x-this._lastX, dy = this._y-this._lastY
        if (isFinite(dx) && isFinite(dy) && (dx||dy)) {
            let angle = (-CDEUtils.toDeg(Math.atan2(dy, dx))+360)%360, diff = angle-this._dir
            diff += (360*(diff<-180))-(360*(diff>180))

            this._dir = (this._dir+diff*Mouse.DEFAULT_MOUSE_ANGULAR_DECELERATION+360)%360
        } else this._dir = 0
    }

    // given an mouse event, sets the current mouse active buttons
    setMouseClicks(e) {
        let v = e.type=="mousedown"
        if (e.button==0) this._clicked = v
        else if (e.button==1) this._scrollClicked = v
        else if (e.button==2) this._rightClicked = v
        else if (e.button==3) this._extraBackClicked = v
        else if (e.button==4) this._extraForwardClicked = v
    }

    // invalidates mouse position
    invalidate() {
        this._x = Infinity
        this._y = Infinity
    }
    
    // updates current mouse position considering page offsets
    updatePos(e, offset) {
        this._valid = true
        this._x = e.x-offset.x
        this._y = e.y-offset.y
    }

    // sets and returns whether the current mouse position is valid
    checkValid() {
        if (this._x == Infinity || this._x == null || this._y == Infinity || this._y == null) return this._valid = false
        else if (!this._valid) return this._valid = true
    }

	get valid() {return this._valid}
	get x() {return this._x}
	get y() {return this._y}
	get lastX() {return this._lastX}
	get lastY() {return this._lastY}
	get dir() {return this._dir}
	get speed() {return this._speed}
	get clicked() {return this._clicked}
	get scrollClicked() {return this._scrollClicked}
	get rightClicked() {return this._rightClicked}
	get extraBackClicked() {return this._extraBackClicked}
	get extraForwardClicked() {return this._extraForwardClicked}
	get pos() {return [this._x, this._y]}

	set valid(valid) {return this._valid = valid}
	set lastX(_lastX) {return this._lastX = _lastX}
	set lastY(_lastY) {return this._lastY = _lastY}
	set dir(_dir) {return this._dir = _dir}
	set speed(_speed) {return this._speed = _speed}
	set clicked(_clicked) {return this._clicked = _clicked}
	set scrollClicked(_scrollClicked) {return this._scrollClicked = _scrollClicked}
	set rightClicked(_rightClicked) {return this._rightClicked = _rightClicked}
	set extraBackClicked(_extraBackClicked) {return this._extraBackClicked = _extraBackClicked}
	set extraForwardClicked(_extraForwardClicked) {return this._extraForwardClicked = _extraForwardClicked}



}
// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

const CDE_CANVAS_DEFAULT_TIMEOUT_FN = window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame

// Represents a html canvas element
class Canvas {
    static ELEMENT_ID_GIVER = 0
    static DEFAULT_MAX_DELTATIME= 0.13
    static DEFAULT_CANVAS_ACTIVE_AREA_PADDING = 20
    static DEFAULT_CVSDE_ATTR = "_CVSDE"
    static DEFAULT_CVSFRAMEDE_ATTR = "_CVSDE_F"
    static DEFAULT_CTX_SETTINGS = {"lineCap":"round", "imageSmoothingEnabled":false, "lineWidth":2, "fillStyle":"aliceblue", "stokeStyle":"aliceblue", "willReadFrequently":false}
    static DEFAULT_CANVAS_WIDTH = 800
    static DEFAULT_CANVAS_HEIGHT = 800
    static DEFAULT_CANVAS_STYLES = {position:"absolute",width:"100%",height:"100%","background-color":"transparent",border:"none",outline:"none","pointer-events":"none !important","z-index":0,padding:"0 !important",margin:"0"}

    #lastFrame = 0  // used for delta time calcultions
    #deltaTimeCap = Canvas.DEFAULT_MAX_DELTATIME // used to prevent significant delta time gaps
    #frameSkipsOffset = null // used to prevent significant frame gaps
    #timeStamp = null  // requestanimationframe timestamp in ms

    constructor(cvs, loopingCallback, frame, settings=Canvas.DEFAULT_CTX_SETTINGS, willReadFrequently=false) {
        this._cvs = cvs                                         //html canvas element
        this._frame = frame??cvs?.parentElement                 //html parent of canvas element
        this._cvs.setAttribute(Canvas.DEFAULT_CVSDE_ATTR, true)        //set styles selector
        this._frame.setAttribute(Canvas.DEFAULT_CVSFRAMEDE_ATTR, true) //set styles selector
        this._ctx = this._cvs.getContext("2d", {willReadFrequently})   //canvas context
        this._settings = this.updateSettings(settings)          //set context settings

        this._els={refs:[], defs:[]}                            //arrs of objects to .draw() | refs (source): [Object that contains drawable obj], defs: [regular drawable objects]

        this._looping = false                                   //loop state
        this._cb = loopingCallback                              //custom callback called along with the loop() function

        this._deltaTime = null                                  //useable delta time in seconds
        this._fixedTimeStamp = null                             //fixed (offsets lag spikes) requestanimationframe timestamp in ms

        this._windowListeners = this.#initWindowListeners()     //[onresize, onvisibilitychange]
        
        let frameCBR = this._frame?.getBoundingClientRect()??{width:Canvas.DEFAULT_CANVAS_WIDTH, height:Canvas.DEFAULT_CANVAS_HEIGHT}
        this.setSize(frameCBR.width, frameCBR.height)           //init size
        this.#initStyles()                                      //init styles

        this._mouse = new Mouse()                               //mouse info
        this._offset = this.updateOffset()                      //cvs page offset
    }

    // sets css styles on the canvas and the parent
    #initStyles() {
        let style = document.createElement("style")
        style.appendChild(document.createTextNode(`[${Canvas.DEFAULT_CVSFRAMEDE_ATTR}]{position:relative !important;}canvas[${Canvas.DEFAULT_CVSDE_ATTR}]{${Object.entries(Canvas.DEFAULT_CANVAS_STYLES).reduce((a,b)=>a+=`${b[0]}:${b[1]};`,"")}}`))
        this._cvs.appendChild(style)
    }

    // sets resize and visibility change listeners on the window
    #initWindowListeners() {
        const onresize=()=>{this.setSize()},
        onvisibilitychange=()=>{if (!document.hidden) this.reset()}

        window.addEventListener("resize", onresize)
        window.addEventListener("visibilitychange", onvisibilitychange)
        return [()=>window.removeEventListener("resize", onresize), ()=>window.removeEventListener("visibilitychange", onvisibilitychange)]
    }

    // updates the calculated canvas offset in the page
    updateOffset() {
        let {width, height, x, y} = this._cvs.getBoundingClientRect()
        return this._offset = {x:Math.round((x+width)-this.width+window.scrollX), y:Math.round((y+height)-this.height+window.scrollY)}
    }

    // starts the drawing loop
    startLoop() {
        if (!this._looping) {
            this._looping = true
            this.#loop(0)
        }
    }

    // main loop, runs every frame
    #loop(time) {
        let delay = Math.abs((time-this.#timeStamp)-this.deltaTime*1000)
        if (this._fixedTimeStamp==0) this._fixedTimeStamp = time-this.#frameSkipsOffset
        if (time && this._fixedTimeStamp && delay < Canvas.DEFAULT_MAX_DELTATIME*1000) {

            this._mouse.calcSpeed(this._deltaTime)

            this.clear()
            this.draw()
            
            if (typeof this._cb == "function") this._cb()

            this._fixedTimeStamp = 0

        } else if (time) {
            this._fixedTimeStamp = time-(this.#frameSkipsOffset += Canvas.DEFAULT_MAX_DELTATIME*1000)
            this.#frameSkipsOffset += Canvas.DEFAULT_MAX_DELTATIME*1000
        }

        this.#timeStamp = time
        this.#calcDeltaTime(time)
        if (this._looping) CDE_CANVAS_DEFAULT_TIMEOUT_FN(this.#loop.bind(this))
    }

    // stops the loop
    stopLoop() {
        this._looping = false
    }

    // calculates and sets the deltaTime
    #calcDeltaTime(time=0) {
        this._deltaTime = Math.min((time-this.#lastFrame)/1000, this.#deltaTimeCap)
        this.#lastFrame = time
    }

    // calls the draw function on all canvas objects
    draw() {
        let els = this.refs.concat(this._els.refs.flatMap(source=>source.asSource)).concat(this._els.defs), els_ll = els.length

        for (let i=0;i<els_ll;i++) {
            const el = els[i]
            if (!el.draw || !this.isWithin(el.pos, Canvas.DEFAULT_CANVAS_ACTIVE_AREA_PADDING)) continue
            el.draw(this._ctx, this.timeStamp, this._deltaTime)
        }
    }

    // clears the canvas
    clear(x=0, y=0, width, height) {
        this._ctx.clearRect(x??0, y??0, width??this._cvs.width, height??this._cvs.height)
    }

    // resets every fragile source
    reset() {
        this.refs.filter(source=>source.fragile).forEach(r=>r.reset())
    }

    // sets the width and height in px of the canvas element
    setSize(w, h) {
        let {width, height} = this._frame.getBoundingClientRect()
        if (w!==null) this._cvs.width = w??width
        if (h!==null) this._cvs.height = h??height
        this.updateSettings()
        this.updateOffset()
    }

    // updates current canvas settings
    updateSettings(settings) {
        let st = settings||this._settings
        Object.entries(st).forEach(s=>this._ctx[s[0]]=s[1])
        return this._settings=st
    }

    // add 1 or many objects, as a (def)inition or as a (ref)erence (source)
    add(objs, isDef) {
        let l = objs.length??1
        for (let i=0;i<l;i++) {
            let obj = objs[i]??objs
            if (!isDef) {
                obj.cvs = this
                if (typeof obj.initialize=="function") obj.initialize()
            } else {
                obj.parent = this
                if (typeof obj.initialize=="function") obj.initialize()
            }
            this._els[isDef?"defs":"refs"].push(obj)
        }
    }

    // removes any element from the canvas by id
    remove(id) {
        this._els.defs = this._els.defs.filter(el=>el.id!==id)
        this._els.refs = this._els.refs.filter(source=>source.id!==id)
    }

    // get any element from the canvas by id
    get(id) {
        return this.allEls.find(el=>el.id == id)
    }

    // removes any element from the canvas by instance type
    getObjs(instance) {
        return this._els.defs.filter(x=>x instanceof instance)
    }

    // called on mouse move
    #mouseMovements(cb, e) {
        // update ratioPos to mouse pos if not overwritten
        let r_ll = this.refs.length
        for (let i=0;i<r_ll;i++) {
            let ref = this.refs[i]
            if (!ref.ratioPosCB && ref.ratioPosCB !== false) ref.ratioPos=this._mouse.pos
        }
        // custom move callback
        if (typeof cb == "function") cb(this._mouse, e)

        // check mouse pos validity
        this._mouse.checkValid()
    }

    // defines the onmousemove listener
    setmousemove(cb) {
        const onmousemove=e=>{
            // update pos and direction angle
            this._mouse.updatePos(e, this._offset)
            this._mouse.calcAngle()            

            this.#mouseMovements(cb, e)
        }
        this._frame.addEventListener("mousemove", onmousemove)
        return ()=>this._frame.removeEventListener("mousemove", onmousemove)
    }

    // defines the onmouseleave listener
    setmouseleave(cb) {
        const onmouseleave=e=>{
            // invalidate mouse
            this._mouse.invalidate()
            this.#mouseMovements(cb, e)
        }
        this._frame.addEventListener("mouseleave", onmouseleave)
        return ()=>this._frame.removeEventListener("mouseleave", onmouseleave)
    }


    // called on any mouse clicks
    #mouseClicks(cb, e) {
        this._mouse.setMouseClicks(e)
        if (typeof cb == "function") cb(this._mouse, e)
    }

    // defines the onmousedown listener
    setmousedown(cb) {
        const onmousedown=e=>this.#mouseClicks(cb, e)
        this._frame.addEventListener("mousedown", onmousedown)
        return ()=>this._frame.removeEventListener("mousedown", onmousedown)
    }

    // defines the onmouseup listener
    setmouseup(cb) {
        const onmouseup=e=>this.#mouseClicks(cb, e)
        this._frame.addEventListener("mouseup", onmouseup)
        return ()=>this._frame.removeEventListener("mouseup", onmouseup)
    }

    // returns the center [x,y] of the canvas
    getCenter() {
        return [this.width/2, this.height/2]
    }

    isWithin(pos, padding=0) {
        let [x,y]=pos
        return x >= -padding && x <= this.width+padding && y >= -padding && y <= this.height+padding
    }
    
	get cvs() {return this._cvs}
	get frame() {return this._frame}
	get ctx() {return this._ctx}
	get width() {return this._cvs.width}
	get height() {return this._cvs.height}
	get settings() {return this._settings}
	get cb() {return this._cb}
	get looping() {return this._looping}
	get deltaTime() {return this._deltaTime}
	get deltaTimeCap() {return this.#deltaTimeCap}
	get windowListeners() {return this._windowListeners}
	get timeStamp() {return this._fixedTimeStamp||this.#timeStamp}
	get timeStampRaw() {return this.#timeStamp}
	get els() {return this._els}
	get mouse() {return this._mouse}
	get offset() {return this._offset}
    get defs() {return this._els.defs}
    get refs() {return this._els.refs}
    get allDefsAndRefs() {return this.defs.concat(this.refs)}
    get allEls() {return this.allDefsAndRefs.flatMap(x=>x.dots||x)}

	set cb(_cb) {return this._cb = _cb}
	set width(w) {this.setSize(w, null)}
	set height(h) {this.setSize(null, h)}
}
// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Allows the creation of smooth progress based animations 
class Anim {
    static ANIM_ID_GIVER = 0
    static DEFAULT_DURATION = 1000

    constructor(animation, duration, easing, endCallback) {
        this._id = Anim.ANIM_ID_GIVER++                         // animation id
        this._animation = animation                      // the main animation (clampedProgress, playCount, progress)=>
        this._duration = duration??Anim.DEFAULT_DURATION // duration in ms, negative values make the animation repeat infinitly
        this._easing = easing||(x=>x)                    // easing static (x)=>
        this._endCallback = endCallback                  // static called when animation is over

        this._startTime = null // start time
        this._progress = 0     // animation progress
        this._playCount = 0    // how many time the animation has played
    }
    
    // progresses the animation 1 frame fowards (loop each frame) 
    getFrame(time) {
        let isInfinite = Math.sign(this._duration)==-1
        if (!this._playCount || isInfinite) {
            // SET START TIME
            if (!this._startTime) this._startTime = time
            // PLAY ANIMATION
            else if (time<this._startTime+Math.abs(this._duration)) {
                this._progress = this._easing((time-this._startTime)/Math.abs(this._duration))
                this._animation(this.progress, this._playCount, this._progress)
            }
            // REPEAT IF NEGATIVE DURATION
            else if (isInfinite) this.reset(true)
            // END
            else this.end()
        }
    }

    // ends the animation
    end() {
        this._animation(1, this._playCount++, 1)
        if (typeof this._endCallback == "static") this._endCallback()
    }

    // resets the animation
    reset(isInfiniteReset) {
        if (isInfiniteReset) this._animation(1, this._playCount++, 1)
        else this._playCount = 0
        this._progress = 0
        this._startTime = null
    }

    get id() {return this._id}
    get animation() {return this._animation}
	get duration() {return this._duration}
	get easing() {return this._easing}
	get endCallback() {return this._endCallback}
	get startTime() {return this._startTime}
	get progress() {return CDEUtils.clamp(this._progress, 0, 1)}
	get progressRaw() {return this._progress}
	get playCount() {return this._playCount}

	set animation(_animation) {return this._animation = _animation}
	set duration(_duration) {return this._duration = _duration}
	set easing(_easing) {return this._easing = _easing}
	set endCallback(_endCallback) {return this._endCallback = _endCallback}

    // Easings from: https://easings.net/
    static easeInSine = (x) => 1 - Math.cos((x * Math.PI) / 2)
    static easeOutSine = (x) => Math.sin((x * Math.PI) / 2)
    static easeInOutSine = (x) => -(Math.cos(Math.PI * x) - 1) / 2

    static easeInCubic = (x) => x * x * x
    static easeOutCubic = (x) => 1 - Math.pow(1 - x, 3)
    static easeInOutCubic = (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
    
    static easeInQuint = (x) => x*x*x*x*x
    static easeOutQuint = (x) => 1 - Math.pow(1 - x, 5)
    static easeInOutQuint = (x) => x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2

    static easeInCirc = (x) => 1 - Math.sqrt(1 - Math.pow(x, 2))
    static easeOutCirc = (x) => Math.sqrt(1 - Math.pow(x - 1, 2))
    static easeInOutCirc = (x) => x < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2

    static easeInElastic = (x) => x === 0 ? 0 : x === 1 ? 1 : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * ((2 * Math.PI) / 3))
    static easeOutElastic = (x) => x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1
    static easeInOutElastic = (x) => x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * (2 * Math.PI) / 4.5)) / 2 : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * (2 * Math.PI) / 4.5)) / 2 + 1
    
    static easeInQuad = (x) => x * x
    static easeOutQuad = (x) => 1 - (1 - x) * (1 - x)
    static easeInOutQuad = (x) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2

    static easeInQuart = (x) => x * x * x * x
    static easeOutQuart = (x) => 1 - Math.pow(1 - x, 4)
    static easeInOutQuart = (x) => x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2

    static easeInExpo = (x) => x === 0 ? 0 : Math.pow(2, 10 * x - 10)
    static easeOutExpo = (x) => x === 1 ? 1 : 1 - Math.pow(2, -10 * x)
    static easeInOutExpo = (x) => x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2
    
    static easeInBack = (x) => (1.70158 + 1) * x * x * x - 1.70158 * x * x
    static easeOutBack = (x) => 1 + (1.70158 + 1) * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2)
    static easeInOutBack = (x) => x < 0.5? (Math.pow(2 * x, 2) * ((1.70158 * 1.525 + 1) * 2 * x - 1.70158 * 1.525)) / 2 : (Math.pow(2 * x - 2, 2) * ((1.70158 * 1.525 + 1) * (x * 2 - 2) + 1.70158 * 1.525) + 2) / 2

    static easeInBounce = (x) => 1 - easeOutBounce(1 - x)
    static easeOutBounce = (x) => {
            if (x < 1 / 2.75) return 7.5625 * x * x
            else if (x < 2 / 2.75) return 7.5625 * (x -= 1.5 / 2.75) * x + 0.75
            else if (x < 2.5 / 2.75) return 7.5625 * (x -= 2.25 / 2.75) * x + 0.9375
            else return 7.5625 * (x -= 2.625 / 2.75) * x + 0.984375
    }
    static easeInOutBounce = (x) => x < 0.5 ? (1 - this.easeOutBounce(1 - 2 * x)) / 2: (1 + this.easeOutBounce(2 * x - 1)) / 2
    
    static linear = (x) => x
}
// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Abstract canvas obj class
class Obj {
    static DEFAULT_POS = [0,0]
    static DEFAULT_RADIUS = 5

    constructor(pos, radius, color, setupCB) {
        this._id = Canvas.ELEMENT_ID_GIVER++      // canvas obj id
        this._initPos = pos||Obj.DEFAULT_POS      // initial position : [x,y] || (Canvas)=>{return [x,y]}
        this._pos = this._initPos                 // current position from the center of the object : [x,y]
        this._radius = radius??Obj.DEFAULT_RADIUS // object's radius
        this._initColor = color                   // declaration color value || (ctx, this)=>{return color value}
        this._color = this._initColor             // the current color or gradient of the filled shape
        this._setupCB = setupCB                   // called on object's initialization (this, this.parent)=>
        this._anims = {backlog:[], currents:[]}    // all "currents" animations playing are playing simultaneously, the backlog animations run in a queue, one at a time
    }

    // Runs when the object gets added to a canvas instance
    initialize() {
        if (typeof this._initColor=="function") this.color = this._initColor(this.ctx??this.parent.ctx, this)
        else if (this._initColor) this.color = this._initColor
        this.moveAtInitPos()
        if (typeof this._setupCB == "function") this._setupCB(this, this?.parent)
    }

    // sets the current pos to the value of the inital pos
    moveAtInitPos() {
        if (typeof this._initPos=="function") this._pos = [...this._initPos(this._cvs, this?.parent??this)]
        else this._pos = [...this._initPos]
    }

    // Runs every frame
    draw(ctx, time) {
        let anims = this._anims.currents
        if (this._anims.backlog[0]) anims = [...anims, this._anims.backlog[0]]
        let a_ll = anims.length
        for (let i=0;i<a_ll;i++) anims[i].getFrame(time)
    }

    // returns whether the provided pos is inside the obj
    isWithin(pos, circularDetection) {
        let [x,y]=pos
        return circularDetection ? CDEUtils.getDist(x, y, this.x, this.y) <= this.radius*(+circularDetection==1?1.025:+circularDetection) : x >= this.left && x <= this.right && y >= this.top && y <= this.bottom
    }

    // Returns the [top, right, bottom, left] distances between the canvas limits, according to the object's size
    posDistances(pos=this._pos) {
        let [x,y]=pos, cw=this._cvs.width, ch=this._cvs.height
        return [y-this.height/2, cw-(x+this.width/2), ch-(y+this.height/2), x-this.width/2]
    }

    // Teleports to given coords
    moveAt(pos) {
        let [x, y] = pos
        if (x !== null && x !== undefined) this.x = x
        if (y !== null && y !== undefined) this.y = y
    }

    // Teleports to incremented coords
    moveBy(pos) {
        let [x, y] = pos
        if (x !== null && x !== undefined) this.x += x
        if (y !== null && y !== undefined) this.y += y
    }

    // Smoothly moves to coords in set time
    moveTo(pos, time=1000, easing=Anim.easeInOutQuad, initPos=[this.x, this.y], isUnique=true, force=true) {
        let [ix, iy] = initPos, 
            [fx, fy] = this.adjustInputPos(pos),
            dx = fx-ix,
            dy = fy-iy

        return this.playAnim(new Anim((prog)=>{
            this.x = ix+dx*prog
            this.y = iy+dy*prog
        }, time, easing), isUnique, force)
    }

    // moves the obj in specified direction at specified distance(force)
    addForce(force, dir, time=1000, easing=Anim.easeInOutQuad, isUnique=true, animForce=true) {
        let rDir = CDEUtils.toRad(dir), ix = this.x, iy = this.y,
            dx = CDEUtils.getAcceptableDif(force*Math.cos(rDir), CDEUtils.ACCEPTABLE_DIF),
            dy = CDEUtils.getAcceptableDif(force*Math.sin(rDir), CDEUtils.ACCEPTABLE_DIF)
        
        return this.playAnim(new Anim(prog=>{
            this.x = ix+dx*prog
            this.y = iy-dy*prog
        }, time, easing), isUnique, animForce)
    }

    // adds an animation to play. "isUnique" makes it so the animation gets queue in the backlog. "force" terminates the current backlog animation and replaces it with the specified "anim"
    playAnim(anim, isUnique, force) {
        if (isUnique && this.currentBacklogAnim && force) { // TOFIX
            this.currentBacklogAnim.end()
            this._anims.backlog.addAt(anim, 0)
        }
        let initEndCB = anim.endCallback
        anim.endCallback=()=>{
            if (isUnique) this._anims.backlog.shift()
            else this._anims.currents = this._anims.currents.filter(a=>a.id!==anim.id)
            
            if (typeof initEndCB=="function") initEndCB()
        }
        this._anims[isUnique?"backlog":"currents"].push(anim)
        return anim
    }

    // allows flexible pos declarations
    adjustInputPos(pos) {
        let [x, y] = pos
        if (x === null || x === undefined) x = this.x
        if (y === null || y === undefined) y = this.y
        return [x, y]
    }

	get id() {return this._id}
    get x() {return this._pos[0]}
    get y() {return this._pos[1]}
    get radius() {return this._radius}
    get top() {return this.y-this._radius}
    get bottom() {return this.y+this._radius}
    get right() {return this.x+this._radius}
    get left() {return this.x-this._radius}
    get pos() {return this._pos}
    get pos_() {return [...this._pos]} // static position
    get stringPos() {return this.x+","+this.y}
	get initPos() {return this._initPos}
    get width() {return this._radius*2}
    get height() {return this._radius*2}
    get currentBacklogAnim() {return this._anims.backlog[0]}
    get anims() {return this._anims}
    get setupCB() {return this._setupCB}
    get colorObject() {return this._color}
    get colorRaw() {return this._color.colorRaw}
    get color() {return this._color.color}
    get initColor() {return this._initColor}
    get r() {return this.colorObject.r}
    get g() {return this.colorObject.g}
    get b() {return this.colorObject.b}
    get a() {return this.colorObject.a}

    set x(x) {this._pos[0] = x}
    set y(y) {this._pos[1] = y}
    set pos(pos) {this._pos = pos}
    set radius(radius) {this._radius = radius<0?0:radius}
    set color(color) {if (this._color?.colorRaw?.toString() != color?.toString() || !this._color) this._color = Color.adjust(color)}
    set setupCB(cb) {this._setupCB = cb}
    set r(r) {this.colorObject.r = r}
    set g(g) {this.colorObject.g = g}
    set b(b) {this.colorObject.b = b}
    set a(a) {this.colorObject.a = a}
    
}
// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Contains and controls a group of dots
class Shape extends Obj {
    static DEFAULT_LIMIT = 100

    constructor(pos, dots, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, fragile) {
        super(pos, radius, color, setupCB)
        this._cvs = null                         // CVS instance
        this._limit = limit||Shape.DEFAULT_LIMIT // the delimiter radius within which the drawEffect can take Effect
        this._initDots = dots                    // initial dots declaration
        this._dots = []                          // array containing current dots in the shape
        this._ratioPos = [Infinity,Infinity]     // position of ratio target object 
        this._drawEffectCB = drawEffectCB        // (ctx, Dot, ratio, mouse, distance, parent, rawRatio)=>
        this._ratioPosCB = ratioPosCB            // custom ratio pos target (Shape, dots)=>
        this._fragile = fragile||false           // whether the shape resets on document visibility change 

        this._rotation = 0                       // the shape's rotation in degrees 
        this._scale = [1,1]                      // the shape's scale factor: [scaleX, scaleY] 
    }

    // initializes the shape, adds its dots and initializes them
    initialize() {
        super.moveAtInitPos()

        if (typeof this._initDots == "string") this.createFromString(this._initDots)
        else if (typeof this._initDots == "function") this.add(this._initDots(this, this._cvs)) // initDOt maybe redo callback (todo)
        else if (Array.isArray(this._initDots) || this._initDots instanceof Dot) this.add(this._initDots)

        if (typeof this._setupCB == "function") this._setupCB(this, this?.parent)

        if (typeof this._initColor=="function") this.setColor(this._initColor(this.ctx, this))
        else this._initColor
    }

    // runs every frame, updates the ratioPos if ratioPosCB is defined
    draw(ctx, time) {
        super.draw(ctx, time)
        if (typeof this._ratioPosCB == "function") this._ratioPos = this._ratioPosCB(this)
    }

    // adds a or many dots to the shape
    add(dot) {
        this._dots.push(...[dot].flat().map(dot=>{
            if (typeof this._initColor!=="function") dot.color = this.colorObject
            dot.radius = !dot.radius||dot.radius==Obj.DEFAULT_RADIUS ? this._radius : dot.radius // TODO probably do an init radius too
            dot.parent = this
            dot.initialize()
            return dot
        }))
    }

    // remove a dot from the shape by its id or by its instance
    removeDot(idOrDot) {
        this._dots = this._dots.filter(dot=>dot.id!==(idOrDot?.id??idOrDot))
    }

    // remove the shape and all its dots
    remove() {
        this._cvs.remove(this._id)
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
        let dots = []
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
 
    // updates the radius of all the shape's dots
    setRadius(radius=this._radius) {
        this._radius = radius
        this._dots.forEach(dot=>dot.radius=radius)
    }

    // updates the color of all the shape's dots
    setColor(color=this._color) {
        this.color = color
        this._dots.forEach(dot=>dot.color=color)
    }

    // moves the shape and all its dots in specified direction at specified distance(force)
    addForce(force, dir, time=1000, easing=Anim.easeInOutQuad, isUnique=true, animForce=true) {
        let rDir = CDEUtils.toRad(dir), ix = this.x, iy = this.y,
            dx = CDEUtils.getAcceptableDif(force*Math.cos(rDir), CDEUtils.ACCEPTABLE_DIF),
            dy = CDEUtils.getAcceptableDif(force*Math.sin(rDir), CDEUtils.ACCEPTABLE_DIF)
        
        return this.playAnim(new Anim((prog)=>{
            this.moveAt([ix+dx*prog, iy-dy*prog])
        }, time, easing), isUnique, animForce)
    }

    // Teleports the shape and all its dots to incremented coords
    moveBy(pos) {
        super.moveBy(pos)
        let d_ll = this._dots.length
        for (let i=0;i<d_ll;i++) this._dots[i].moveBy(pos)
    }

    // Teleports the shape and all its dots to given coords
    moveAt(pos) {
        let [fx, fy] = this.adjustInputPos(pos), dx = fx-this.x, dy = fy-this.y
        this._dots.forEach(d=>{
            if (dx) d.x += dx
            if (dy) d.y += dy
        })
        super.moveAt(pos)
    }

    // Smoothly moves the shape and all its dots to given coords in set time
    moveTo(pos, time=1000, easing=Anim.easeInOutQuad, initPos=this.pos, isUnique=true, force=true) {
        let [ix, iy] = initPos,
        dx = pos[0]-ix,
        dy = pos[1]-iy

        return this.playAnim(new Anim((prog)=>{
            this.moveAt([ix+dx*prog, iy+dy*prog])
        }, time, easing), isUnique, force)
    }

    // Rotates the dots by a specified degree increment around a specified center point
    rotateBy(deg, centerPos=this.pos) {// clock-wise, from the top
        let [cx, cy] = centerPos
        this._dots.forEach(dot=>{
            let x = dot.x-cx, y = dot.y-cy,
                cosV = Math.cos(CDEUtils.toRad(deg)), sinV = Math.sin(CDEUtils.toRad(deg))
                
            dot.x = (x*cosV-y*sinV)+cx
            dot.y = (x*sinV+y*cosV)+cy
        })

        this._rotation = (this._rotation+deg)%360
    }

    // Rotates the dots to a specified degree around a specified center point
    rotateAt(deg, centerPos=this.pos) {
        this.rotateBy(360-(this._rotation-deg), centerPos)
    }

    // Smoothly rotates the dots to a specified degree around a specified center point
    rotateTo(deg, time=1000, easing=Anim.easeInOutQuad, centerPos=this.pos, isUnique=true, force=true) {
        let ir = this._rotation, dr = deg-this._rotation

        return this.playAnim(new Anim((prog)=>{
            this.rotateAt(ir+dr*prog, centerPos)
        }, time, easing), isUnique, force)
    }

    // Scales the dots by a specified amount [scaleX, scaleY] from a specified center point
    scaleBy(scale, centerPos=this.pos) {
        let [scaleX, scaleY] = scale, [cx, cy] = centerPos
        this._dots.forEach(dot=>{
            dot.x = (dot.x-cx)*scaleX+cx
            dot.y = (dot.y-cy)*scaleY+cy
        })
        this._scale = [this._scale[0]*scaleX, this._scale[1]*scaleY]
    }

    // Scales the dots to a specified amount [scaleX, scaleY] from a specified center point
    scaleAt(scale, centerPos=this.pos) {
        let dsX = scale[0]/this._scale[0], dsY = scale[1]/this._scale[1]
        this.scaleBy([dsX, dsY], centerPos)
    }

    // Smoothly scales the dots by a specified amount [scaleX, scaleY] from a specified center point
    scaleTo(scale, time=1000, easing=Anim.easeInOutQuad, centerPos=this.pos, isUnique=true, force=true) {
        let is = this._scale, dsX = scale[0]-this._scale[0], dsY = scale[1]-this._scale[1]

        return this.playAnim(new Anim(prog=>{
            this.scaleAt([is[0]+dsX*prog, is[1]+dsY*prog], centerPos)
        }, time, easing), isUnique, force)
    }

    // returns whether the provided pos is inside the area delimited by the dots permimeter
    isWithin(pos) {
        let d_ll = this.dots.length
        if (d_ll > 2) {
            let permimeter = new Path2D()
            permimeter.moveTo(...this.dots[0].pos)
            for (let i=1;i<d_ll;i++) permimeter.lineTo(...this.dots[i].pos)
            permimeter.closePath()

            return this.ctx.isPointInPath(permimeter, ...pos)
        }
        return false
    }

    // Empties the shapes of all its dots
    clear() {
        this._dots = []
    }

    // Rerenders the shape to its original form
    reset() {
        if (this._initDots) {
            this.clear()
            this.initialize()
        }
    }

    get cvs() {return this._cvs}
    get ctx() {return this._cvs.ctx}
    get dots() {return this._dots}
    get limit() {return this._limit}
	get initDots() {return this._initDots}
    get drawEffectCB() {return this._drawEffectCB}
    get ratioPos() {return this._ratioPos}
    get ratioPosCB() {return this._ratioPosCB}
    get rotation() {return this._rotation}
    get rotation() {return this._scale}
    get lastDotsPos() {return this._lastDotsPos}
    get dotsPositions() {// returns a string containing all the dot's position
        let currentDotPos="", d_ll = this.dots.length
        for (let i=0;i<d_ll;i++) currentDotPos += this.dots[i].stringPos
        return currentDotPos
    }
    get firstDot() {return this._dots[0]}
    get asSource() {return this._dots}

    set cvs(cvs) {this._cvs = cvs}
    set ratioPos(ratioPos) {this._ratioPos = ratioPos}
    set drawEffectCB(cb) {this._drawEffectCB = cb}
    set ratioPosCB(cb) {this._ratioPosCB = cb}
    set lastDotsPos(ldp) {this._lastDotsPos = ldp}
    set limit(limit) {this._limit = limit}
}
// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Allows the creation of custom gradients
class Gradient {
    #lastDotsPos = null
    #lastRotation = null
    #lastDotPos = null
    constructor(ctx, positions, isLinear=0, ...colorStops) {
        this._ctx = ctx                                                     // canvas context
        this._isLinear = this.#getFormatedIsLinear(isLinear)                // whether the gradient is linear or radial (if a number, acts as the rotation in degrees of linear gradient)
        this._initPositions = positions                                     // linear:[[x1,y1],[x2,y2]] | radial:[[x1, y1, r1],[x2,y2,r2]] | Shape
        this._positions = this.getAutomaticPositions()??this._initPositions // usable positions from initPositions

        this._colorStops = colorStops.flat().map(([stop, color])=>[stop, Color.adjust(color)]) // ex: [[0..1, Color], [0.5, Color], [1, Color]]

        this._gradient = null // useable as a fillStyle
        this.updateGradient()
    }

    // returns a the gradient rotation in degrees or false if radial gradient
    #getFormatedIsLinear(isLinear=this._isLinear) {
        return typeof isLinear=="number" ? isLinear : isLinear==true ? 0 : false
    }

    /**
     * Given a shape, returns automatic positions values for linear or radial gradients
     * @param {Shape} obj: Instance of Shape or inheriting shape 
     * @param {boolean} optimize: if enabled recalculates positions only when a dot changes pos (disable only for manual usage of this function) 
     * @returns the new calculated positions or the current value of this._positions if the parameter 'shape' isn't an instance of Shape
     */
    getAutomaticPositions(obj=this._initPositions, optimize=true) {
        if (obj instanceof Shape) {
            if (!optimize || this.#hasShapeChanged(obj)) {
                const rangeX = CDEUtils.getMinMax(obj.dots, "x"), rangeY = CDEUtils.getMinMax(obj.dots, "y"),
                    smallestX = rangeX[0], smallestY = rangeY[0],
                    biggestX = rangeX[1], biggestY = rangeY[1],
                    cx = smallestX+(biggestX-smallestX)/2, cy = smallestY+(biggestY-smallestY)/2

                if (this.#getFormatedIsLinear() !== false) {
                    let x = smallestX-cx, y = smallestY-cy, x2 = biggestX-cx, y2 = biggestY-cy,
                        cosV = Math.cos(CDEUtils.toRad(this.#getFormatedIsLinear())), sinV = Math.sin(CDEUtils.toRad(this.#getFormatedIsLinear()))
                    return [[(x*cosV-y*sinV)+cx, (x*sinV+y*cosV)+cy], [(x2*cosV-y2*sinV)+cx, (x2*sinV+y2*cosV)+cy]]
                } else {
                    let coverRadius = Math.max(biggestX-smallestX, biggestY-smallestY)
                    return [[cx, cy, coverRadius],[cx, cy, coverRadius*0.25]]
                }
            } else return this._positions
        } else if (obj instanceof Dot) {
            if (!optimize || this.#hasDotChanged(obj)) {
                if (this.#getFormatedIsLinear() !== false) {
                    let x = obj.left-obj.x, y = obj.top-obj.y, x2 = obj.right-obj.x, y2 = obj.bottom-obj.y,
                        cosV = Math.cos(CDEUtils.toRad(this.#getFormatedIsLinear())), sinV = Math.sin(CDEUtils.toRad(this.#getFormatedIsLinear()))
                    return [[(x*cosV-y*sinV)+obj.x, (x*sinV+y*cosV)+obj.y], [(x2*cosV-y2*sinV)+obj.x, (x2*sinV+y2*cosV)+obj.y]]
                } else {
                    let coverRadius = obj.radius*1
                    return [[obj.x, obj.y, coverRadius],[obj.x, obj.y, coverRadius*0.25]]
                }
            } return this._positions
        } 
        else return this._positions
    }

    #hasShapeChanged(shape) {
        let currentDotsPos = shape.dotsPositions
        if (this.#lastRotation !== this._isLinear || currentDotsPos !== this.#lastDotsPos) {
            this.#lastDotsPos = currentDotsPos
            this.#lastRotation = this._isLinear
            return true
        } else return false
    }
    
    #hasDotChanged(dot) {
        let currentDotPos = dot.stringPos
        if (this.#lastRotation !== this._isLinear || currentDotPos !== this.#lastDotPos) {
            this.#lastDotPos = currentDotPos
            this.#lastRotation = this._isLinear
            return true
        } else return false
    }

    // Creates and returns the gradient. Updates it if the initPositions is a Shape instance
    updateGradient() {
        this._positions = this.getAutomaticPositions()
        this._gradient = this._ctx[`create${typeof this.#getFormatedIsLinear()=="number"?"Linear":"Radial"}Gradient`](...this._positions[0], ...this._positions[1])
        let cs_ll = this._colorStops.length
        for (let i=0;i<cs_ll;i++) this._gradient.addColorStop(this._colorStops[i][0], this._colorStops[i][1].color)
        return this._gradient
    }


    get ctx() {return this._ctx}
    get initPositions() {return this._initPositions}
    get positions() {return this._positions}
    get isLinear() {return this._isLinear}
	get colorStops() {return this._colorStops}
	get rotation() {return typeof this.#getFormatedIsLinear()=="number" ? this._isLinear : null}
    get gradient() {
        // Automatic dynamic positions updates when using a shape instance
        if (this._initPositions instanceof Shape || this._initPositions instanceof Dot) this.updateGradient()
        return this._gradient
    }
	set ctx(_ctx) {this._ctx = _ctx}
	set positions(_positions) {this._positions = _positions}
	set colorStops(_colorStops) {this._colorStops = _colorStops.map(([stop, color])=>[stop, Color.adjust(color)])}
    set isLinear(isLinear) {this._isLinear = isLinear}
	set rotation(deg) {this._isLinear = typeof deg=="number" ? deg%360 : this._isLinear}
}
// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Regular shape with a filled area defined by its dots
class FilledShape extends Shape {
    #lastDotsPos = null
    constructor(fillColor, dynamicUpdates, pos, dots, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, fragile) {
        super(pos, dots, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, fragile)
        this._initFillColor = fillColor                           // declaration color fill value
        this._fillColor = this._initFillColor                     // the current color or gradient of the filled shape
        this._path = null                                         // path perimeter delimiting the surface to fill
        this._dynamicUpdates = dynamicUpdates                     // whether the shape's filling checks for updates every frame
    }

    // initializes the filled shape and creates its path
    initialize() {
        super.initialize()
        if (typeof this._initFillColor=="function") this.fillColor = this._initFillColor(this.ctx, this)
        else this.fillColor = this._initFillColor
        this.updatePath()
    }

    // runs every frame, draws the shape if it is at least containing 3 dots
    draw(ctx, time) {
        super.draw(ctx, time)
        
        if (this.dots.length > 2) {
            if (this._dynamicUpdates) this.updatePath()
            ctx.fillStyle = this.fillColor
            ctx.fill(this._path)
        }
    }

    // updates the path perimeter if the dots pos have changed
    updatePath() {
        let d_ll = this.dots.length
        if (d_ll) {
            let currentDotPos = this.dotsPositions
            if (currentDotPos !== this.#lastDotsPos) {
                this.#lastDotsPos = currentDotPos

                this._path = new Path2D()
                this._path.moveTo(...this.dots[0].pos)
                for (let i=1;i<d_ll;i++) this._path.lineTo(...this.dots[i].pos)
                this._path.closePath()
            } 
        }
    }

    get fillColorObject() {return this._fillColor}
    get fillColorRaw() {return this._fillColor.colorRaw}
    get fillColor() {return this._fillColor.color}
    get initFillColor() {return this._initFillColor}
	get path() {return this._path}
	get dynamicUpdates() {return this._dynamicUpdates}

    set fillColor(fillColor) {
        if (this.fillColorObject?.colorRaw?.toString() != fillColor.toString() || !this._fillColor) this._fillColor = Color.adjust(fillColor)
        }
	set dynamicUpdates(_dynamicUpdates) {return this._dynamicUpdates = _dynamicUpdates}
}
// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Allows the creation of symbols/text based on specific source
class Grid extends Shape {
    static DEFAULT_GAPS = [25, 25]

    constructor(keys, gaps, spacing, source, pos, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, fragile) {
        super(pos, null, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, fragile)

        this._keys = keys                                 // keys to convert to source's values 
        this._gaps = gaps ?? Grid.DEFAULT_GAPS            // [x, y] gap length within the dots
        this._source = source ?? GridAssets.fontSource5x5 // symbols' source
        this._spacing = spacing ?? this._source.width*this._gaps[0]+this._gaps[0]-this._source.width+this._radius // gap length between symbols

        if (this._keys) super.add(this.createGrid())
    }

    // Creates a formation of symbols
    createGrid(keys=this._keys, pos=super.pos, gaps=this._gaps, spacing=this._spacing, source=this._source) {
        let [cx, cy] = pos, isNewLine=true, symbols=[]
        ;[...keys].forEach(l=>{
            let symbol = this.createSymbol(l, [cx=(l=="\n")?pos[0]:(cx+spacing*(!isNewLine)), cy+=(l=="\n")&&source.width*gaps[1]+this.radius])
            isNewLine = (l=="\n")
            symbols.push(symbol)
        })
        return symbols.flat()
    }

    // Creates the dot based symbol at given pos, based on given source
    createSymbol(key, pos=super.pos, source=this._source) {
        let dotGroup = [], [gx, gy] = this._gaps, xi=[0,0], yi=0, s = source[key.toUpperCase()],
        sourceRadius = Math.sqrt(source.width*source.height)
        
        if (s) s.map((d,i)=>[new Dot([pos[0]+(xi[0]=d[0]??xi[0]+1,isNaN(Math.abs(d[0]))?xi[0]:Math.abs(d[0]))*gx, pos[1]+(yi+=(xi[0]<=xi[1]||!i)||Math.sign(1/xi[0])==-1)*gy], this.radius, this.colorObject), d[1], yi*sourceRadius+(xi[1]=Math.abs(xi[0]))]).forEach(([dot, c, p],_,a)=>{
            GridAssets.D.places.forEach(dir=>{c&dir[0]&&dot.addConnection(a.find(n=>n[2]==p+dir[1](sourceRadius))?.[0])}) 
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
// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// The main component to create Effect, can be used on it's on, but designed to be contained by a Shape instance
class Dot extends Obj {
    constructor(pos, radius, color, setupCB) {
        super(pos, radius, color, setupCB)
        this._parent = null               // the instance containing the dot's parent (Shape)
        this._connections = []            // array of Dot to draw a connecting line to
    }

    // runs every frame, draws the dot and runs its parent drawEffect callback
    draw(ctx, time) {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this._radius, 0, CDEUtils.CIRC)
        ctx.fill()

        // runs parent drawEffect callback if defined
        if (typeof this.drawEffectCB == "function") {
            let dist = this.getDistance(), rawRatio = this.getRatio(dist)
            this.drawEffectCB(ctx, this, Math.min(1, rawRatio), this.cvs.mouse, dist, this._parent, rawRatio)
        }

        super.draw(ctx, time)
    }

    // returns pythagorian distance between the ratio defining position and the dot
    getDistance(fx,fy) {
        return CDEUtils.getDist(fx??this.ratioPos[0], fy??this.ratioPos[1], this.x, this.y)
    }

    // calculates the ratio based on distance and parent's limit
    getRatio(dist) {
        return dist / this.limit
    }

    // adds a Dot to the connection array
    addConnection(dot) {
        if (dot instanceof Dot) this._connections.push(dot)
    }

    // removes a Dot from the connection array
    removeConnection(dotOrId) {
        this._connections = this._connections.filter(d=>typeof dotOrId=="number"?d.id!==dotOrId:d.id!==dotOrId.id)
    }

    /**
     * Calculates the 4 intersection points between two dots and a direct line between them.
     * @param {Dot | pos} target: a Dot or a pos [x,y] (Defaults to the first Dot in this object's connections list)
     * @param {Number} targetPadding: the padding radius of the target (Defaults to the target radius if it's a Dot, or 5)
     * @param {Dot | pos} source: a Dot or a pos [x,y] (Defaults to this object)
     * @param {Number} sourcePadding: the padding radius of the source (Defaults to the source radius if it's a Dot, or 5)
     * @returns {
     *      source: [ [x, y], [x, y] ]
     *      target: [ [x, y], [x, y] ]
     * } The 2 intersection points for the target and for the source
     */
    getLinearIntersectPoints(target=this._connections[0], targetPadding=target.radius??5, source=this, sourcePadding=this.radius??5) {
        let [tx, ty] = target.pos||target, [sx, sy] = source.pos||source,
            [a, b, lfn] = CDEUtils.getLinearFn([sx,sy], [tx,ty]), t_r = targetPadding**2, s_r = sourcePadding**2,
            qA = (1+a**2)*2,
            s_qB = -(2*a*(b-sy)-2*sx),
            s_qD = Math.sqrt(s_qB**2-(4*(qA/2)*((b-sy)**2+sx**2-s_r))),
            t_qB = -(2*a*(b-ty)-2*tx),
            t_qD = Math.sqrt(t_qB**2-(4*(qA/2)*((b-ty)**2+tx**2-t_r))),
            s_x1 = (s_qB+s_qD)/qA, s_x2 = (s_qB-s_qD)/qA, t_x1 = (t_qB+t_qD)/qA, t_x2 = (t_qB-t_qD)/qA,
            s_y1 = lfn(s_x1), s_y2 = lfn(s_x2), t_y1 = lfn(t_x1), t_y2 = lfn(t_x2)
    
        return {source:{inner:[s_x1, s_y1], outer:[s_x2, s_y2]}, target:{outer:[t_x1, t_y1], inner:[t_x2, t_y2]}}
    }

    /**
     * Used to make the dot follow a custom path
     * @param {Number} duration: duration of the animation in ms
     * @param {Function} easing: easing function 
     * @param {Function?} action: custom callback that can be called in addition to the movement                                                        //newProg is 'prog' - the progress delimeter of the range
     * @param {...Array[Number, Function]} progressSeparations: list of callback paired with a progress range, the callback must return a position (prog, newProg, initX, initY)=>return [x,y]
     * progressSeparations example: [0:(prog)=>[x1, y1]], [0.5:(prog, fprog)=>[x2, y2]] -> from 0% to 49% the pos from 1st callback is applied, from 50%-100% the pos from 2nd callback is applied  
     */
    follow(duration, easing, action, ...progressSeparations) {
        let [ix, iy] = this._pos, ps_ll = progressSeparations.length-1
        this.playAnim(new Anim((prog)=>{
            let progSep = null
            if (prog<0) prog=0
            for (let i=ps_ll;i>=0;i--) {
                let progressSepIndex = progressSeparations[i]
                if (progressSepIndex[0] <= prog) {
                    progSep = progressSepIndex
                    break
                }
            }
            const [nx, ny] = progSep[1](prog, prog-progSep[0], this, ix, iy)

            this.x = ix+nx
            this.y = iy+ny
            if (typeof action == "function") action(prog, this)
        }, duration, easing))

    }

    // deletes the dot
    remove() {
        this._parent.removeDot(this._id)
    }

    get cvs() {return this._parent?.cvs}
    get ctx() {return this._parent?.cvs.ctx}
    get limit() {return this._parent?.limit}
    get drawEffectCB() {return this._parent?.drawEffectCB}
    get parent() {return this._parent}
    get ratioPos() {return this._parent?.ratioPos}
    get connections() {return this._connections}

    set limit(limit) {this._parent.limit = limit}
    set parent(p) {this._parent = p}
    set connections(c) {return this._connections = c}
}
