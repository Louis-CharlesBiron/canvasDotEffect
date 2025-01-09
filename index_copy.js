const fpsCounter = new CDEUtils.FPSCounter(), CVS = new Canvas(canvas, ()=>{//looping
    let fps = fpsCounter.getFps()+"\n"+fpsCounter.fpsRaw
    if (fpsDisplay.textContent !== fps) fpsDisplay.textContent = fps
    mouseSpeed.textContent = CVS?.mouse?.speed?.toFixed(2)+" px/sec"
    mouseAngle.textContent = CVS?.mouse?.dir?.toFixed(2)+" deg"
})


// DECLARE OBJS
let logo = new Shape([350, 375], [
    new Dot([250, 440], 15, (ctx, dot)=>new Gradient(ctx, dot, 270, [[0, "#B9ACE3"], [1, "#9ADBE4"]])),
    new Dot([350, 290], 16.5, (ctx, dot)=>new Gradient(ctx, dot, 90, [[0, "#B9ACE3"], [1, "#9ADBE4"]])),
    new Dot([470, 350], 18, (ctx, dot)=>new Gradient(ctx, dot, 180, [[0, "#B9ACE3"], [1, "#9ADBE4"]])),
], 18, (ctx, shape)=>new Gradient(ctx, shape, 270, [[0, "#AFB0E3"], [1, "#9ADBE4"]]), null,  (ctx, dot, ratio, m, dist, shape)=>{
    CanvasUtils.drawOuterRing(dot, dot.colorObject, 1.8)
    CVS.updateSettings({"lineWidth":5})
    CanvasUtils.drawDotConnections(dot, shape.colorObject)
    CVS.updateSettings({"lineWidth":2})
}, null, (shape)=>{
    shape.dots[0].addConnection(shape.dots[1])
    shape.dots[0].addConnection(shape.dots[2])
    shape.dots[1].addConnection(shape.dots[2])
})

let logoBG = new FilledShape((ctx, dot)=>new Gradient(ctx, dot, 270, [[0, [100, 200, 200, 0.05]], [1, [100, 200, 200, 0.05]]]), true,
[350, 375], [
    new Dot([340, 205]),
    new Dot([560, 365]),
    new Dot([170, 510]),
], 3, [200, 200, 255, 0.15])

CVS.add(logo)
CVS.add(logoBG)

logoBG.scaleAt([1.15, 1.15])


// USER ACTIONS
let mMove=m=>mouseInfo.textContent = "("+m.x+", "+m.y+")"
CVS.setmousemove(mMove)
CVS.setmouseleave(mMove)
CVS.setmousedown()
CVS.setmouseup()

// START
CVS.startLoop()

