const fpsCounter = new CDEUtils.FPSCounter(), CVS = new Canvas(canvas, ()=>{//looping
    let fps = fpsCounter.getFps()+"\n"+fpsCounter.fpsRaw
    if (fpsDisplay.textContent !== fps) fpsDisplay.textContent = fps
    mouseSpeed.textContent = CVS?.mouse?.speed?.toFixed(2)+" px/sec"
    mouseAngle.textContent = CVS?.mouse?.dir?.toFixed(2)+" deg"
})


// DECLARE OBJS
let logo = new Shape([0,0], [
    new Dot([250, 440], 15, (ctx, dot)=>new Gradient(ctx, dot, 270, [[0, "#B9ACE3"], [1, "#9ADBE4"]])),
    new Dot([350, 290], 16.5, (ctx, dot)=>new Gradient(ctx, dot, 90, [[0, "#B9ACE3"], [1, "#9ADBE4"]])),
    new Dot([470, 350], 18, (ctx, dot)=>new Gradient(ctx, dot, 180, [[0, "#B9ACE3"], [1, "#9ADBE4"]])),
], 18, (ctx, shape)=>new Gradient(ctx, shape, 270, [[0, "#AFB0E3"], [1, "#9ADBE4"]]), null,  (ctx, dot, ratio, m, dist, shape)=>{
    CanvasUtils.drawOuterRing(dot, dot.colorObject, 1.8)
    CVS.updateSettings({"lineWidth":5})
    CanvasUtils.drawDotConnections(dot, shape.colorObject, 2.5)
    CVS.updateSettings({"lineWidth":2})
}, null, (shape)=>{
    shape.dots[0].addConnection(shape.dots[1])
    shape.dots[0].addConnection(shape.dots[2])
    shape.dots[1].addConnection(shape.dots[2])

    shape.dots[0].playAnim(new Anim((prog)=>shape.dots[0].colorRaw.rotation=360*prog, -3000))
    shape.dots[1].playAnim(new Anim((prog)=>shape.dots[1].colorRaw.rotation=-360*prog, -1250))
    shape.dots[2].playAnim(new Anim((prog)=>shape.dots[2].colorRaw.rotation=360*prog, -2000))
    shape.playAnim(new Anim((prog)=>shape.colorRaw.rotation=360*prog, -1000))

    let radiusMovements = 1
    shape.dots[0].playAnim(new Anim((prog, i)=>shape.dots[0].radius += i%2?radiusMovements*prog*CVS.deltaTime:-radiusMovements*prog*CVS.deltaTime, -6000, Anim.easeOutQuad))
    shape.dots[1].playAnim(new Anim((prog, i)=>shape.dots[1].radius += i%2?radiusMovements*prog*CVS.deltaTime:-radiusMovements*prog*CVS.deltaTime, -3000, Anim.easeOutQuad))
    shape.dots[2].playAnim(new Anim((prog, i)=>shape.dots[2].radius += i%2?radiusMovements*prog*CVS.deltaTime:-radiusMovements*prog*CVS.deltaTime, -4000, Anim.easeOutQuad))
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

let textGrad = new Color(new Gradient(CVS.ctx, [[410, 325],[310,400]], 90, [[0, "#AFB0E3"], [1, "#9ADBE4"]]))
let logoLetters = new Grid("CDE", [5, 5], 38, null, [308,372], 0, null, 100, (ctx, dot, ratio, m, dist, shape)=>{
    CanvasUtils.drawDotConnections(dot, textGrad, 0, true)
})

logoLetters.rotateAt(-25)
CVS.add(logoLetters)



// USER ACTIONS
let mMove=m=>mouseInfo.textContent = "("+m.x+", "+m.y+")"
CVS.setmousemove(mMove)
CVS.setmouseleave(mMove)
CVS.setmousedown()
CVS.setmouseup()

// START
CVS.startLoop()



const simpleShape = new Shape([100,100],[
    new Dot([-50, -50]),
    new Dot([-50, 0]),
    new Dot([-50, 50]),
    new Dot([0, -50]),
    new Dot([0, 50]),
    new Dot([50, -50]),
    new Dot([50, 0]),
    new Dot([50, 50]),
], null, normalColorTester, 100, (ctx, dot, ratio, mouse, dist)=>{

    // Changes the opacity and color according to mouse distance
    dot.a = CDEUtils.mod(1, ratio, 0.8)
    dot.r = CDEUtils.mod(255, ratio, -255)
    dot.g = CDEUtils.mod(255, ratio, -255)
    
    
    // Changes the dot's radius, from 2 times the default radius with a range of 80% (10px..2px), according to mouse distance
    dot.radius = CDEUtils.mod(Obj.DEFAULT_RADIUS*2, ratio, Obj.DEFAULT_RADIUS*2*0.8)
    
    // Draws a ring around the dot, at 5 times the radius
    CanvasUtils.drawOuterRing(dot, [255,255,255,0.2], 5)
    }, null, null, )