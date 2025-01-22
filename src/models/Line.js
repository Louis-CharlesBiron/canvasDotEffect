// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Represents a drawn line
class Line {
    constructor(lineWidth, lineCap, lineDash, lineDashOffset) {
        this._lineWidth = lineWidth??Canvas.DEFAULT_CTX_SETTINGS.lineWidth
        this._lineCap = lineCap??Canvas.DEFAULT_CTX_SETTINGS.lineCap
        this._lineDash = lineDash
        this._lineDashOffset = lineDashOffset
    }

    line(pos1, pos2) {

    }

    quadCurve(pos1, pos2, controlPos) {

    }

    beizerCurve(pos1, pos2, controlPos1, controlPos2) {

    }




    // ctx.lineTo()
    // ctx.quadraticCurveTo()
    // ctx.bezierCurveTo()

    //ctx.setLineDash
    //ctx.lineCap
    //ctx.lineWidth
    //ctx.lineDashOffset

}
























/*

    curve(pos1, pos2, radius=50) {
        const ctx = CVS.ctx

        let otherPos = [pos2[0]-100, pos2[1]+1]
        ctx.beginPath()
        ctx.moveTo(...pos1)
        //CDEUtils.getLinearFn(pos2, [pos2[0], pos2[1]+50])
        
        ctx.arcTo(...pos2, ...otherPos, radius)
        ctx.stroke()

        ctx.fillStyle = "green"
        ctx.beginPath()
        ctx.arc(...otherPos, 5, 0, CDEUtils.CIRC)
        ctx.fill()
    }

let startPos = [0, 0]
let stopLine = [[0, 200],[300, 50]]
let radius = 500

let shape = new Shape([500, 400], [new Dot(startPos, 5, "blue"), new Dot(stopLine[0]), new Dot(stopLine[1])], 5, "red", null, (ctx, dot, ratio, m, dist, shape)=>{
    let mainDot = shape.firstDot
    let cDot1 = shape.secondDot
    let cDot2 = shape.thirdDot
    
    ctx.beginPath()
    ctx.lineWidth = 2
    ctx.moveTo(...mainDot.pos)
    ctx.arcTo(...cDot1.pos, ...cDot2.pos, CDEUtils.mod(radius, ratio))
    ctx.stroke()
})

CVS.add(shape)


*/