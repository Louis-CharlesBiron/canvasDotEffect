const fpsCounter = new FPSCounter(), CVS = new Canvas(canvas, ()=>{//looping
    let fps = fpsCounter.getFps()+"\n"+fpsCounter.fpsRaw
    if (fpsDisplay.textContent !== fps) fpsDisplay.textContent = fps
    mouseSpeed.textContent = CVS?.mouse?.speed?.toFixed(2)+" px/sec"
    mouseAngle.textContent = CVS?.mouse?.dir?.toFixed(2)+" deg"
}, null)

// DECLARE OBJS

const _ = null


let a = new ImageDisplay("./img/logo.png", CVS.getCenter(), [250], (e,a)=>console.log(e,a))

// new TextDisplay("test\n11231", CVS.getCenter())
// new Dot(CVS.getCenter(), 50)

a.loopCB = (obj)=>{
    CanvasUtils.drawOutline(CVS.render, obj)
    if (obj.isWithin(CVS.mouse.pos)) console.log(obj.isWithin(CVS.mouse.pos))
}

CVS.add(a)



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