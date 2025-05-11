const fpsCounter = new FPSCounter(), CVS = new Canvas(canvas, ()=>{//looping
    let fps = fpsCounter.getFps()+"\n"+fpsCounter.fpsRaw
    if (fpsDisplay.textContent !== fps) fpsDisplay.textContent = fps
    mouseSpeed.textContent = CVS?.mouse?.speed?.toFixed(2)+" px/sec"
    mouseAngle.textContent = CVS?.mouse?.dir?.toFixed(2)+" deg"
}, null)

// DECLARE OBJS

const _ = null

const helloWorldText = new TextDisplay(
    "Hello World!",
    CVS.getCenter(),
    (render, obj)=>new Pattern(render, "./img/helloWorldBackground.mp4", obj, _, true, true),
    (render)=>render.textProfile1.update("italic bold 64px monospace"),
    _, _,
    (obj)=>obj.playAnim(new Anim(prog=>obj.scale = [Math.sin(Math.PI*prog*2), 1],-5000))
)

CVS.add(helloWorldText)

// USER ACTIONS
const mMove=m=>mouseInfo.textContent = "("+m.x+", "+m.y+")"
CVS.setMouseMove(mMove)
CVS.setMouseLeave(mMove)
CVS.setMouseDown()
CVS.setMouseUp()
CVS.setKeyDown()
CVS.setKeyUp()

// START
CVS.startLoop()