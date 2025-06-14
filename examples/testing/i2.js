const fpsCounter = new FPSCounter(), CVS = new Canvas(canvas, ()=>{//looping
    let fps = fpsCounter.getFps()+"\n"+fpsCounter.fpsRaw
    if (fpsDisplay.textContent !== fps) fpsDisplay.textContent = fps
    mouseSpeed.textContent = CVS?.mouse?.speed?.toFixed(2)+" px/sec"
    mouseAngle.textContent = CVS?.mouse?.dir?.toFixed(2)+" deg"
}, null)

// DECLARE OBJS

const _ = null

// new TextDisplay("test\n11231", CVS.getCenter())
// new Dot(CVS.getCenter(), 50)

// qy
const someObj = new TextDisplay("TEST\n123\n1\n13\n120934781293791823", CVS.getResponsivePos([0.5, 0.35]), _, render=>render.textProfile1.update("16px Monospace"))


//someObj = new ImageDisplay("./img/img2.jpg", [200, 200], ["25%", "25%"], (e,a)=>console.log(e,a))
//someObj = new Dot(CVS.getCenter(), 50)
//const someObj = new FilledShape([75,75,75,1], true, CVS.getCenter(), [new Dot([0,0]),new Dot([100,-50]),new Dot([300,50]),new Dot([100,80]),new Dot([270,-90]),new Dot([-70,-90]),new Dot([-150,190])], 3, [100, 100, 100, 1])

someObj.setupCB = (obj)=>{
    setTimeout(()=>obj.playAnim(new Anim(prog=>obj.rotateAt(prog*360), -50000, Anim.easeInOutBounce)), 500)
    obj.playAnim(new Anim((prog, i)=>{
        obj.scaleAt([0.15+(i%2?prog:(1-prog)), 0.5+(i%2?prog:(1-prog))*4])
    }, -5000))


    CDEUtils.repeatedTimeout(1000, (i)=>{
        someObj.text = 
`TEST${"S".repeat(CDEUtils.random(0, 3))}
123${"4".repeat(CDEUtils.random(0, 1))}
${"1".repeat(CDEUtils.random(0, 10))}
${"YOO".repeat(CDEUtils.random(0, 1))}
Y${"O".repeat(i)}`
    }, 750)
}

someObj.loopCB = (obj)=>{
    CanvasUtils.drawOutline(CVS.render, obj)
    //CanvasUtils.drawOutlineAccurate(CVS.render, obj)
    CVS.render.batchStroke(obj.getBoundsAccurate(), [0,0,255,1])
    CVS.render.batchFill(obj.getBoundsAccurate(), [0,0,255,0.5])
}

CVS.enableAccurateMouseMoveListenersMode()
//CVS.mouse.addListener(someObj, Mouse.LISTENER_TYPES.ENTER, ()=>console.log("FAST - enter"))
//CVS.mouse.addListener(someObj, Mouse.LISTENER_TYPES.EXIT , ()=>console.log("FAST - exit"))
//CVS.mouse.addListener(someObj, Mouse.LISTENER_TYPES.DOWN , ()=>console.log("FAST - click"))
CVS.mouse.addListener(someObj, Mouse.LISTENER_TYPES.ENTER, ()=>console.log("ACCURATE - enter"), true)
CVS.mouse.addListener(someObj, Mouse.LISTENER_TYPES.EXIT , ()=>console.log("ACCURATE - exit") , true)
CVS.mouse.addListener(someObj, Mouse.LISTENER_TYPES.DOWN , ()=>console.log("ACCURATE - click"), true)

// Adding the object to the canvas
CVS.add(someObj)

// USER ACTIONS
const mMove=m=>mouseInfo.textContent = "("+m.x+", "+m.y+")"
CVS.setMouseMove(mMove)
CVS.setMouseLeave(mMove)
CVS.setMouseDown()
CVS.setMouseUp()
CVS.setKeyDown()
CVS.setKeyUp()

// START
CVS.start()