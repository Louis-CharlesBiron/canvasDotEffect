const fpsCounter = new CDEUtils.FPSCounter(), CVS = new Canvas(canvas, ()=>{//looping
    let fps = fpsCounter.getFps()+"\n"+fpsCounter.fpsRaw
    if (fpsDisplay.textContent !== fps) fpsDisplay.textContent = fps
    mouseSpeed.textContent = CVS?.mouse?.speed?.toFixed(2)+" px/sec"
    mouseAngle.textContent = CVS?.mouse?.dir?.toFixed(2)+" deg"
}, null)

// DECLARE OBJS

let a = new Shape([300,300],[
    new Dot([-50, -50]),new Dot([-50, 0]),new Dot([-50, 50]),new Dot([0, -50]),new Dot([0, 0]),new Dot([0, 50]),new Dot([50, -50]),new Dot([50, 0]),
], 20, (ctx, shape)=>new Gradient(ctx, shape, [[0, "purple"], [0.267, new Color([250,0,0,1])], [1, "#ABC123"]], null, 90), 100, (ctx, dot, ratio, m, dist)=>{
    dot.a = CDEUtils.mod(1, ratio, 0.8)
    if (dot.id == 5) CanvasUtils.drawOuterRing(dot, RenderStyles.PROFILE1.updateStyles(Color.rgba(0,255,255,CDEUtils.mod(1, ratio, 0.8)), 4, null, null, [5, 15], CDEUtils.mod(50, ratio)), 5)
    else CanvasUtils.drawOuterRing(dot, RenderStyles.PROFILE1.updateStyles(Color.rgba(255,255,255,CDEUtils.mod(1, ratio, 0.8)), 4, null, null, [CDEUtils.mod(100, ratio)], 0), 5)
})

CVS.add(a)

// USER ACTIONS
let mMove=m=>mouseInfo.textContent = "("+m.x+", "+m.y+")"
CVS.setmousemove(mMove)
CVS.setmouseleave(mMove)
CVS.setmousedown()
CVS.setmouseup()
CVS.setkeydown()
CVS.setkeyup()

// START
CVS.startLoop()

