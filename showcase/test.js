const _ = null

const fpsCounter = new FPSCounter(), CVS = new Canvas(canvas, ()=>{//looping
    let fps = fpsCounter.getFps()+"\n"+fpsCounter.fpsRaw
    if (fpsDisplay.textContent !== fps) fpsDisplay.textContent = fps
    mouseSpeed.textContent = CVS?.mouse?.speed?.toFixed(2)+" px/sec"
    mouseAngle.textContent = CVS?.mouse?.dir?.toFixed(2)+" deg"
}, _)

const fpsCounter2 = new FPSCounter(), CVS2 = new Canvas(canvas2, ()=>{//looping
    let fps = fpsCounter2.getFps()+"\n"+fpsCounter2.fpsRaw
    if (fpsDisplay2.textContent !== fps) fpsDisplay2.textContent = fps
    mouseSpeed2.textContent = CVS2?.mouse?.speed?.toFixed(2)+" px/sec"
    mouseAngle2.textContent = CVS2?.mouse?.dir?.toFixed(2)+" deg"
}, _)

// DECLARE OBJS

let comp3 = Render.DEFAULT_COMPOSITE_OPERATION
let alpha3 = 1
let aasdasd = new Shape([300,100],[
    new Dot([-50, -50]),new Dot([-50, 0]),new Dot([-50, 50]),new Dot([0, -50]),new Dot([0, 0]),new Dot([0, 50]),new Dot([50, -50]),new Dot([50, 0]),
], 20, (ctx, shape)=>new Gradient(ctx, shape, [[0, "purple"], [0.267, new Color([250,0,0,1])], [1, "#ABC123"]], _, 90), 100, (render, dot, ratio)=>{
    dot.a = CDEUtils.mod(1, ratio, 0.8)
    dot.radius = CDEUtils.mod(20, ratio, 20*0.7)
    if (dot.id % 5 == 0) CanvasUtils.drawOuterRing(dot, render.profile1.update(Color.rgba(0,255,255,CDEUtils.mod(1, ratio, 0.8)), _, _, _, 4, [5, 15], CDEUtils.mod(50, ratio)), 5)
    else CanvasUtils.drawOuterRing(dot, render.profile2.update(Color.rgba(255,255,255,CDEUtils.mod(1, ratio, 0.8)), _, comp3, alpha3, 4, [CDEUtils.mod(100, ratio)], 0), 5)
})
CVS.add(aasdasd)

let asd = aasdasd.duplicate()
CVS2.add(asd)

let textInputTest = new Grid("a", [5, 5], 50, _, [10,200], 0, _, _, (render, dot, ratio)=>{
    CanvasUtils.drawDotConnections(dot, render.profile1.update([255,0,0,1],  _, _, _, 2, [0], _, RenderStyles.JOIN_TYPES.BEVEL, RenderStyles.CAP_TYPES.SQUARE))
})

let curret = new Shape([20,-20], [new Dot(), new Dot([0, 30])], 3, "lime", _, (render, dot)=>{
    CanvasUtils.drawDotConnections(dot, render.profile5.update(dot._color))
}, _, (shape)=>{
shape.playAnim(new Anim((prog, i)=>shape.setColor(Color.rgba(0,255,0,1*(i%2))), -500))
shape.firstDot.addConnection(shape.secondDot)
}, _, ()=>textInputTest.lastDot?.pos, true)

CVS.add(curret)


function updateInput(e) {
    let k = e.key, v = textInputTest.keys, kl = k.toLowerCase()
    if (kl=="backspace") textInputTest.keys = v.slice(0, v.length-1)
    else if (kl=="enter") textInputTest.keys = v+"\n"
    else if (k.length==1) {
        e.preventDefault()
        textInputTest.keys = v+k
    }
}

CVS.add(textInputTest)









let filledShapeTester = new FilledShape(
    (ctx, shape)=>new Gradient(ctx, shape, [[0, "purple"], [0.267, new Color([250,0,0,1])], [1, "#ABC123"]], _, 90),
    true, [50,200], [new Dot([100, 100]), new Dot([100, 150]), new Dot([150, 150]),new Dot([150, 100]),new Dot([125,25])], _, _, _, (render, dot, ratio, setupResults, m, dist, shape)=>{
    dot.a = CDEUtils.mod(1, ratio, 0.6)
    if (shape.dots[0].id == dot.id) setupResults(shape.dots[0], m, dist, ratio, 200)
}, _, (shape)=>{
    const dragAnim2 = CanvasUtils.getDraggableDotCB()

    shape.playAnim(new Anim((prog)=>shape.fillColorRaw.rotation=360*prog, -750))

    return dragAnim2
}, _, _, true)

CVS2.add(filledShapeTester)

let asd1 = filledShapeTester.duplicate()
CVS.add(asd1)


// USER ACTIONS
let mMove=m=>mouseInfo.textContent = "("+m.x+", "+m.y+")"
CVS.setMouseMove(mMove, true)
CVS.setMouseLeave(mMove, true)
CVS.setMouseDown(_, true)
CVS.setMouseUp(_, true)
CVS.setKeyDown(updateInput)
CVS.setKeyUp()

let mMove2=m=>mouseInfo2.textContent = "("+m.x+", "+m.y+")"
CVS2.setMouseMove(mMove2)
CVS2.setMouseLeave(mMove2)
CVS2.setMouseDown()
CVS2.setMouseUp()
CVS2.setKeyDown()
CVS2.setKeyUp()

// START
CVS.startLoop()
CVS2.startLoop()

