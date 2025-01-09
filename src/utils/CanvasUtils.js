// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Provides generic canvas functions
class CanvasUtils {
    static SHOW_CENTERS_DOT_ID = {}

    // Can be used to display a dot at the specified shape pos (which is normally not visible) (More for debbuging purposes)
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

    // Generic function to draw connection between the specified dot and the dots in its connections property
    static drawDotConnections(dot, color, isSourceOver=false) { // CAN BE OPTIMISED VIA ALPHA
        let ctx = dot.ctx, dc_ll = dot.connections.length
        if (!isSourceOver) ctx.globalCompositeOperation = "destination-over"
        if (dc_ll) for (let i=0;i<dc_ll;i++) {
            let c = dot.connections[i]
            ctx.strokeStyle = Color.formatRgba(color)??color.color
            ctx.beginPath()
            ctx.moveTo(dot.x, dot.y)
            ctx.lineTo(c.x, c.y)
            ctx.stroke()
        }
        if (!isSourceOver) ctx.globalCompositeOperation = "source-over"
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
    static drawConnections(dot, color, sourcePos) {
        let ctx = dot.ctx
        ctx.strokeStyle = Color.formatRgba(color)??color.color
        ctx.beginPath()
        ctx.moveTo(sourcePos[0], sourcePos[1])
        ctx.lineTo(dot.x, dot.y)
        ctx.stroke()
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