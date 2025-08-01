const _ = null, fpsCounter = new FPSCounter(), CVS = new Canvas(1?canvas:new OffscreenCanvas(1000, 1000), ()=>{//looping
    let fps = fpsCounter.getFps()+"\n"+fpsCounter.fpsRaw
    if (fpsDisplay.textContent !== fps) fpsDisplay.textContent = fps
    mouseSpeed.textContent = CVS?.mouse?.speed?.toFixed(2)+" px/sec"
    mouseAngle.textContent = CVS?.mouse?.dir?.toFixed(2)+" deg"
}, null)

// DECLARE OBJS

const someObj = new TextDisplay("TEST\n123\n1\n13\n120934781293791823", CVS.getResponsivePos([0.5, 0.35]), _, render=>render.textProfile1.update("16px Monospace"))

/*someObj.setupCB = (obj)=>{
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
CVS.mouse.addListener(someObj, Mouse.LISTENER_TYPES.DOWN , ()=>console.log("ACCURATE - click"), true)*/








const random = CDEUtils.random, render = CVS.render
function getBorderPaths() {
    const periodCount = random(5, 15), height = random(40, 65), startY = random(5, 25)
    return {
        path1:Render.generate([0,startY], Render.Y_FUNCTIONS.SINUS(height, CVS.width/periodCount), CVS.width, 20),
        path2:Render.generate([random(-3, 3),startY+random(-2, 2)], Render.Y_FUNCTIONS.SINUS(height, CVS.width/periodCount), CVS.width, 20),
        path3:Render.generate([0,CVS.height-startY], Render.Y_FUNCTIONS.SINUS(height, CVS.width/periodCount), CVS.width, 20),
        path4:Render.generate([random(-3, 3),CVS.height-(startY+random(-2, 2))], Render.Y_FUNCTIONS.SINUS(height, CVS.width/periodCount), CVS.width, 20),
    }
}

// TODO FIX WHEN UPDATING CDE
/*const loop1Obj = CVS.get(CanvasUtils.createEmptyObj(CVS, (obj)=>{
    setInterval(()=>obj.setupResults = getBorderPaths(), 1050)

    return getBorderPaths()
}, (obj)=>{
    const r = obj.setupResults

    render.batchStroke(r.path2, render.profile2.update([255,0,0,1], _, _, _, 5))
    render.batchStroke(r.path1, render.profile1.update([255,255,255,1], _, _, _,   5))
    render.batchStroke(r.path4, render.profile2.update([255,0,0,1], _, _, _, 5))
    render.batchStroke(r.path3, render.profile1.update([255,255,255,1], _, _, _,   5))
}))*/




let animTester = new Shape([400,200],[
    new Dot([0,50], null, null, (dot, obj)=>{

        // overriding
        //let distance = 150, ix = dot.x
        //dot.playAnim(new Anim((progress, playCount)=>{
        //    dot.x = ix + ((playCount%2)||-1) * distance * progress
        //    if (progress==1) ix = dot.x
        //}, -1000, Anim.easeOutBack))

        // additive
        let distance = 150, ix = dot.x, ax = 0
        //dot.playAnim(new Anim((prog, i) => {
        //    const dx = ((i%2)||-1)*distance*prog-ax
        //    dot.x += dx
        //    ax += dx
        //
        //    if (prog == 1) {
        //        ix = dot.x
        //        ax = 0
        //    }
        //}, -10000, Anim.linear))

        const effectCenterPos = [500, 300]
        obj.playAnim(new Anim((prog, i)=>{
            //console.log(prog)

            obj.rotateAt(prog*360, effectCenterPos)
            //obj.scaleAt([CDEUtils.fade(prog, i, 1, 2), CDEUtils.fade(prog, i, 1, 2)], effectCenterPos)
        }, -5000))
        

    })
], null, null, 25, (render, dot, ratio)=>{
    CanvasUtils.drawOuterRing(dot, [dot.a*255,dot.a*255,dot.a*255,CDEUtils.mod(0.5, ratio)], 3)
}, null, null, null, null, true)

CVS.add(animTester)










// Adding the object to the canvas
//CVS.add(someObj)

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