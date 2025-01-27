const fpsCounter = new CDEUtils.FPSCounter(), CVS = new Canvas(canvas, ()=>{//looping
    let fps = fpsCounter.getFps()+"\n"+fpsCounter.fpsRaw
    if (fpsDisplay.textContent !== fps) fpsDisplay.textContent = fps
    mouseSpeed.textContent = CVS?.mouse?.speed?.toFixed(2)+" px/sec"
    mouseAngle.textContent = CVS?.mouse?.dir?.toFixed(2)+" deg"
}, null)

// DECLARE OBJS

let movementsTester = new Shape([300,300],[
    new Dot([-50, -50]),new Dot([-50, 0]),new Dot([-50, 50]),new Dot([0, -50]),new Dot([0, 0]),new Dot([0, 50]),new Dot([50, -50]),new Dot([50, 0]),
], null, null, 100, (ctx, dot, ratio, m, dist)=>{
    dot.a = CDEUtils.mod(1, ratio, 0.8)
    CanvasUtils.drawOuterRing(dot, Color.rgba(255,255,255,CDEUtils.mod(1, ratio, 0.8)), 5)
})

CVS.add(movementsTester)

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

