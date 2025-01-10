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