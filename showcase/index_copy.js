const fpsCounter = new FPSCounter(), CVS = new Canvas(canvas, ()=>{//looping
    let fps = fpsCounter.getFps()+"\n"+fpsCounter.fpsRaw
    if (fpsDisplay.textContent !== fps) fpsDisplay.textContent = fps
    mouseSpeed.textContent = CVS?.mouse?.speed?.toFixed(2)+" px/sec"
    mouseAngle.textContent = CVS?.mouse?.dir?.toFixed(2)+" deg"
}, 60)


// DECLARE OBJS
const normalColorTester = new Color("white")

let comp1 = Render.DEFAULT_COMPOSITE_OPERATION+"1"
let alpha1 = 1
let fitler1 = "none"
let comp2 = Render.DEFAULT_COMPOSITE_OPERATION+"2"
let alpha2 = 1
let fitler2 = "none2"

let logo = new Shape([0,0], [
    new Dot([250, 440], 15, (ctx, dot)=>new Gradient(ctx, dot, [[0, "#B9ACE3"], [1, "#9ADBE4"]], null, 270)),
    new Dot([350, 290], 16.5, (ctx, dot)=>new Gradient(ctx, dot, [[0, "#B9ACE3"], [1, "#9ADBE4"]], null, 90)),
    new Dot([470, 350], 18, (ctx, dot)=>new Gradient(ctx, dot, [[0, "#B9ACE3"], [1, "#9ADBE4"]], null, 180)),
], 18, (ctx, shape)=>new Gradient(ctx, shape, [[0, "#AFB0E3"], [1, "#9ADBE4"]], null, 270), null,  (render, dot, ratio, res, m, dist, shape)=>{
    CanvasUtils.drawOuterRing(dot, render.profile1.update(dot.colorObject, fitler1, comp1, alpha1, 2, [0]), 1.8)
    CanvasUtils.drawDotConnections(dot, render.profile2.update(shape.colorObject, fitler2, comp2, alpha2, 5, [0]), 2.5)
}, null, (shape)=>{
    shape.dots[0].addConnection(shape.dots[1])
    shape.dots[0].addConnection(shape.dots[2])
    shape.dots[1].addConnection(shape.dots[2])

    shape.dots[0].playAnim(new Anim((prog)=>shape.dots[0].colorRaw.rotation=360*prog, -3000))
    shape.dots[1].playAnim(new Anim((prog)=>shape.dots[1].colorRaw.rotation=-360*prog, -1250))
    shape.dots[2].playAnim(new Anim((prog)=>shape.dots[2].colorRaw.rotation=360*prog, -2000))
    shape.playAnim(new Anim((prog)=>shape.colorRaw.rotation=360*prog, -1000))

    let radiusMovements = 1
    shape.dots[0].playAnim(new Anim((prog, i, dt)=>shape.dots[0].radius += i%2?radiusMovements*prog*dt:-radiusMovements*prog*dt, -6000, Anim.easeOutQuad))
    shape.dots[1].playAnim(new Anim((prog, i, dt)=>shape.dots[1].radius += i%2?radiusMovements*prog*dt:-radiusMovements*prog*dt, -3000, Anim.easeOutQuad))
    shape.dots[2].playAnim(new Anim((prog, i, dt)=>shape.dots[2].radius += i%2?radiusMovements*prog*dt:-radiusMovements*prog*dt, -4000, Anim.easeOutQuad))
})

let logoBG = new FilledShape([65, 100, 100, 0.15], true,
[0,0], [
    new Dot([340, 205]),
    new Dot([560, 365]),
    new Dot([170, 510]),
], 3, [200, 200, 255, 0.15])

CVS.add(logo)
CVS.add(logoBG)

logoBG.scaleAt([1.15, 1.15], [350, 375])

let textGradient = new Color(new Gradient(CVS.ctx, [[410, 325],[310,400]], [[0, "#AFB0E3"], [1, "#9ADBE4"]], null, 90))
let logoLetters = new Grid("CDE", [5, 5], 38, null, [308,372], 0, null, 100, (render, dot, ratio)=>{
    CanvasUtils.drawDotConnections(dot, textGradient, 0, true)
})

logoLetters.rotateAt(-25)
//CVS.add(logoLetters)



let oktest = new Shape([110,250],[new Dot(), new Dot([10, 0],null,null,null,(dot, shape)=>shape.firstDot)], null, null, 100, (render, dot, ratio)=>{// SHAPE DRAW EFFECT CB
    
    dot.radius = CDEUtils.mod(_Obj.DEFAULT_RADIUS*2, ratio, _Obj.DEFAULT_RADIUS*2*0.8)
    CanvasUtils.drawDotConnections(dot, render.profile1.update([255,0,0,1], null, null, null, null, [5]))

}, null, (shape)=>{// SHAPE SETUP CB
    
    shape.firstDot.follow(5000, null, (prog, dot)=>{
        shape.add(new Dot(null, 4, null, null, dot.pos))
    }, CanvasUtils.FOLLOW_PATHS.CIRCLE(null, null, 0.5))

    
    shape.dots[1].follow(5000, Anim.LINEAR, (prog, dot)=>{
        shape.add(new Dot(null, 2, "red", null, dot.pos))
    }, CanvasUtils.FOLLOW_PATHS.RELATIVE(CanvasUtils.FOLLOW_PATHS.LINEAR(800, 0)))

    shape.firstDot.addConnection(shape.dots[1])
}, null, null, true)

CVS.add(oktest)

let filledShapeTester = new FilledShape(
    (ctx, shape)=>new Gradient(ctx, shape, [[0, "purple"], [0.267, new Color([250,0,0,1])], [1, "#ABC123"]], null, 90),
    true, [400,500], [new Dot([100, 100]), new Dot([100, 150]), new Dot([150, 150]),new Dot([150, 100]),new Dot([125,25])], null, null, null, (render, dot, ratio, setupResults, m, dist, shape)=>{
    dot.a = CDEUtils.mod(1, ratio, 0.6)
    if (shape.dots[0].id == dot.id) setupResults(shape.dots[0], m, dist, ratio, 200)
}, null, (shape)=>{
    const dragAnim2 = CanvasUtils.getDraggableDotCB()

    shape.playAnim(new Anim((prog)=>shape.fillColorRaw.rotation=360*prog, -750))

    return dragAnim2
}, null, null, true)

CVS.add(filledShapeTester)

let comp3 = Render.DEFAULT_COMPOSITE_OPERATION+"3"
let filter3 = "none"
let alpha3 = 1
let aasdasd = new Shape([600,100],[
    new Dot([-50, -50]),new Dot([-50, 0]),new Dot([-50, 50]),new Dot([0, -50]),new Dot([0, 0]),new Dot([0, 50]),new Dot([50, -50]),new Dot([50, 0]),
], 20, (ctx, shape)=>new Gradient(ctx, shape, [[0, "purple"], [0.267, new Color([250,0,0,1])], [1, "#ABC123"]], null, 90), 100, (render, dot, ratio)=>{
    dot.a = CDEUtils.mod(1, ratio, 0.8)
    dot.radius = CDEUtils.mod(20, ratio, 20*0.7)
    if (dot.id % 5 == 0) CanvasUtils.drawOuterRing(dot, render.profile1.update(Color.rgba(0,255,255,CDEUtils.mod(1, ratio, 0.8)), null, null, null, 4, [5, 15], CDEUtils.mod(50, ratio)), 5)
    else CanvasUtils.drawOuterRing(dot, render.profile3.update(Color.rgba(255,255,255,CDEUtils.mod(1, ratio, 0.8)), filter3, comp3, alpha3, CDEUtils.mod(4, ratio, 2), [CDEUtils.mod(100, ratio)], 0), 5)
})
CVS.add(aasdasd)

let text = new TextDisplay("yoman test", [200, 600], "lime")
CVS.add(text,true)

// USER ACTIONS
let mMove=m=>mouseInfo.textContent = "("+m.x+", "+m.y+")"
CVS.setmousemove(mMove)
CVS.setmouseleave(mMove)
CVS.setmousedown()
CVS.setmouseup()

// START
CVS.startLoop()
