const fpsCounter = new CDEUtils.FPSCounter(), CVS = new Canvas(canvas, ()=>{//looping
    let fps = fpsCounter.getFps()+"\n"+fpsCounter.fpsRaw
    if (fpsDisplay.textContent !== fps) fpsDisplay.textContent = fps
    mouseSpeed.textContent = CVS?.mouse?.speed?.toFixed(2)+" px/sec"
    mouseAngle.textContent = CVS?.mouse?.dir?.toFixed(2)+" deg"
}, null)

const fpsCounter2 = new CDEUtils.FPSCounter(), CVS2 = new Canvas(canvas2, ()=>{//looping
    let fps = fpsCounter2.getFps()+"\n"+fpsCounter2.fpsRaw
    if (fpsDisplay2.textContent !== fps) fpsDisplay2.textContent = fps
    mouseSpeed2.textContent = CVS2?.mouse?.speed?.toFixed(2)+" px/sec"
    mouseAngle2.textContent = CVS2?.mouse?.dir?.toFixed(2)+" deg"
}, null)

// DECLARE OBJS

let a = new Shape([300,100],[
    new Dot([-50, -50]),new Dot([-50, 0]),new Dot([-50, 50]),new Dot([0, -50]),new Dot([0, 0]),new Dot([0, 50]),new Dot([50, -50]),new Dot([50, 0]),
], 20, (ctx, shape)=>new Gradient(ctx, shape, [[0, "purple"], [0.267, new Color([250,0,0,1])], [1, "#ABC123"]], null, 90), 100, (ctx, dot, ratio, m, dist)=>{
    dot.a = CDEUtils.mod(1, ratio, 0.8)
    dot.radius = CDEUtils.mod(20, ratio, 20*0.7)
    if (dot.id == 5) CanvasUtils.drawOuterRing(dot, RenderStyles.PROFILE1.updateStyles(Color.rgba(0,255,255,CDEUtils.mod(1, ratio, 0.8)), 4, [5, 15], CDEUtils.mod(50, ratio)), 5)
    else CanvasUtils.drawOuterRing(dot, RenderStyles.PROFILE1.updateStyles(Color.rgba(255,255,255,CDEUtils.mod(1, ratio, 0.8)), 4, [CDEUtils.mod(100, ratio)], 0), 5)
})

CVS.add(a)
//console.log(a, a.dots, a.initialized, a.duplicate())
//CVS2.add(a.duplicate())

let dragAnim2 = CanvasUtils.getDraggableDotCB()
let filledShapeTester = new FilledShape(
    (ctx, shape)=>new Gradient(ctx, shape, [[0, "purple"], [0.267, new Color([250,0,0,1])], [1, "#ABC123"]], null, 90),
    true, [0,0], [new Dot([100, 100]), new Dot([100, 150]), new Dot([150, 150]),new Dot([150, 100]),new Dot([125,25])], null, null, null, (render, dot, ratio, m, dist, shape)=>{
    dot.a = CDEUtils.mod(1, ratio, 0.6)
    if (shape.dots[0].id == dot.id) dragAnim2(shape.dots[0], m, dist, ratio)
}, null, null, null, true)
filledShapeTester.playAnim(new Anim((prog)=>filledShapeTester.fillColorRaw.rotation=360*prog, -750))

//CVS2.add(filledShapeTester)


// USER ACTIONS
let mMove=m=>mouseInfo.textContent = "("+m.x+", "+m.y+")"
CVS.setmousemove(mMove)
CVS.setmouseleave(mMove)
CVS.setmousedown()
CVS.setmouseup()
CVS.setkeydown()
CVS.setkeyup()

let mMove2=m=>mouseInfo2.textContent = "("+m.x+", "+m.y+")"
CVS2.setmousemove(mMove2)
CVS2.setmouseleave(mMove2)
CVS2.setmousedown()
CVS2.setmouseup()
CVS2.setkeydown()
CVS2.setkeyup()

// START
CVS.startLoop()
CVS2.startLoop()

