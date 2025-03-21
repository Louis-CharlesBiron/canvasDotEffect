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

let comp3 = Render.DEFAULT_COMPOSITE_OPERATION
let alpha3 = 1
let aasdasd = new Shape([300,100],[
    new Dot([-50, -50]),new Dot([-50, 0]),new Dot([-50, 50]),new Dot([0, -50]),new Dot([0, 0]),new Dot([0, 50]),new Dot([50, -50]),new Dot([50, 0]),
], 20, (ctx, shape)=>new Gradient(ctx, shape, [[0, "purple"], [0.267, new Color([250,0,0,1])], [1, "#ABC123"]], null, 90), 100, (render, dot, ratio)=>{
    dot.a = CDEUtils.mod(1, ratio, 0.8)
    dot.radius = CDEUtils.mod(20, ratio, 20*0.7)
    if (dot.id % 5 == 0) CanvasUtils.drawOuterRing(dot, render.profile1.update(Color.rgba(0,255,255,CDEUtils.mod(1, ratio, 0.8)), null, null, null, 4, [5, 15], CDEUtils.mod(50, ratio)), 5)
    else CanvasUtils.drawOuterRing(dot, render.profile2.update(Color.rgba(255,255,255,CDEUtils.mod(1, ratio, 0.8)), null, comp3, alpha3, 4, [CDEUtils.mod(100, ratio)], 0), 5)
})
CVS.add(aasdasd)



let textInputTest = new Grid("a", [5, 5], 50, null, [10,200], 0, null, null, (render, dot, ratio)=>{
    CanvasUtils.drawDotConnections(dot, render.profile1.update([255,0,0,1],  null, null, null, 2, [0], null, RenderStyles.JOIN_TYPES.BEVEL, RenderStyles.CAP_TYPES.SQUARE))
})

let curret = new Shape([20,-20], [new Dot(), new Dot([0, 30])], 3, "lime", null, (render, dot)=>{
    CanvasUtils.drawDotConnections(dot, render.profile1.update(dot._color))
}, null, (shape)=>{
shape.playAnim(new Anim((prog, i)=>shape.setColor(Color.rgba(0,255,0,1*(i%2))), -300))
shape.firstDot.addConnection(shape.secondDot)
}, null, ()=>textInputTest.lastDot?.pos)

CVS.add(curret)


function updateInput(e) {
    let k = e.key, v = textInputTest.keys
    if (k.toLowerCase()=="backspace") textInputTest.setKeys(v.slice(0, v.length-1))
    else if (k.toLowerCase()=="enter") textInputTest.setKeys(v+"\n")
    else if (k.length==1) {
        e.preventDefault()
        textInputTest.setKeys(v+k)
    }
}

CVS.add(textInputTest)




let asd = aasdasd.duplicate()
CVS2.add(asd)




let filledShapeTester = new FilledShape(
    (ctx, shape)=>new Gradient(ctx, shape, [[0, "purple"], [0.267, new Color([250,0,0,1])], [1, "#ABC123"]], null, 90),
    true, [0,0], [new Dot([100, 100]), new Dot([100, 150]), new Dot([150, 150]),new Dot([150, 100]),new Dot([125,25])], null, null, null, (render, dot, ratio, setupResults, m, dist, shape)=>{
    dot.a = CDEUtils.mod(1, ratio, 0.6)
    if (shape.dots[0].id == dot.id) setupResults(shape.dots[0], m, dist, ratio, 200)
}, null, (shape)=>{
    const dragAnim2 = CanvasUtils.getDraggableDotCB()

    shape.playAnim(new Anim((prog)=>shape.fillColorRaw.rotation=360*prog, -750))

    return dragAnim2
}, null, null, true)

CVS2.add(filledShapeTester)

//let asd1 = filledShapeTester.duplicate()
//CVS.add(asd1)


// USER ACTIONS
let mMove=m=>mouseInfo.textContent = "("+m.x+", "+m.y+")"
CVS.setmousemove(mMove)
CVS.setmouseleave(mMove)
CVS.setmousedown()
CVS.setmouseup()
CVS.setkeydown(updateInput)
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

