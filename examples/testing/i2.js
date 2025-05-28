const fpsCounter = new FPSCounter(), CVS = new Canvas(canvas, ()=>{//looping
    let fps = fpsCounter.getFps()+"\n"+fpsCounter.fpsRaw
    if (fpsDisplay.textContent !== fps) fpsDisplay.textContent = fps
    mouseSpeed.textContent = CVS?.mouse?.speed?.toFixed(2)+" px/sec"
    mouseAngle.textContent = CVS?.mouse?.dir?.toFixed(2)+" deg"
}, null)

// DECLARE OBJS

const _ = null


let a = new ImageDisplay("./img/logo.png", CVS.getCenter(), ["100%", "100%"], (e,a)=>console.log(e,a))

// new TextDisplay("test\n11231", CVS.getCenter())
// new Dot(CVS.getCenter(), 50)

a.loopCB = (obj)=>{
    CanvasUtils.drawOutline(CVS.render, obj)
    if (obj.isWithin(CVS.mouse.pos)) console.log(obj.isWithin(CVS.mouse.pos))
}

CVS.add(a)

let test = 200
const shape2 = new FilledShape((render, obj)=>{
    return new Pattern(render, "./img/img2.jpg", obj.getBounds())
    //return new Pattern(render, "./img/vid2.mp4", obj.getBounds())
}, true, [300,100], [new Dot([0,0]), new Dot([test,0]), new Dot([test, test]), new Dot([0, test])], 0)
CVS.add(shape2)
// Creating a pattern that will get duplicated for each dot of shape1 (set the "positions" (↓) parameter to the area containing all the dots)
const sharedPattern = new Pattern(CVS.render, "./img/img2.jpg", shape2.getBounds(), null, null, null, null, null,
    (pattern)=>{// readyCB
        // once the camera is loaded, set the shape2's color to the value of the pattern
        shape2.setColor(pattern)
    }
)



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