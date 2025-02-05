const fpsCounter = new CDEUtils.FPSCounter(), CVS = new Canvas(canvas, ()=>{//looping
    let fps = fpsCounter.getFps()+"\n"+fpsCounter.fpsRaw
    if (fpsDisplay.textContent !== fps) fpsDisplay.textContent = fps
    mouseSpeed.textContent = CVS?.mouse?.speed?.toFixed(2)+" px/sec"
    mouseAngle.textContent = CVS?.mouse?.dir?.toFixed(2)+" deg"
}, 60)


// DECLARE OBJS
const normalColorTester = new Color("white")

let logo = new Shape([0,0], [
    new Dot([250, 440], 15, (ctx, dot)=>new Gradient(ctx, dot, [[0, "#B9ACE3"], [1, "#9ADBE4"]], null, 270)),
    new Dot([350, 290], 16.5, (ctx, dot)=>new Gradient(ctx, dot, [[0, "#B9ACE3"], [1, "#9ADBE4"]], null, 90)),
    new Dot([470, 350], 18, (ctx, dot)=>new Gradient(ctx, dot, [[0, "#B9ACE3"], [1, "#9ADBE4"]], null, 180)),
], 18, (ctx, shape)=>new Gradient(ctx, shape, [[0, "#AFB0E3"], [1, "#9ADBE4"]], null, 270), null,  (ctx, dot, ratio, m, dist, shape)=>{
    CanvasUtils.drawOuterRing(dot, RenderStyles.PROFILE1.updateStyles(dot.colorObject, 2, [0]), 1.8)
    CanvasUtils.drawDotConnections(dot, RenderStyles.PROFILE2.updateStyles(shape.colorObject, 5, [0]), 2.5)
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
let logoLetters = new Grid("CDE", [5, 5], 38, null, [308,372], 0, null, 100, (ctx, dot, ratio, m, dist, shape)=>{
    CanvasUtils.drawDotConnections(dot, textGradient, 0, true)
})

logoLetters.rotateAt(-25)
//CVS.add(logoLetters)



let oktest = new Shape([110,250],[new Dot(), new Dot([10, 0],null,null,null,(dot, shape)=>shape.firstDot)], null, null, 100, (ctx, dot, ratio)=>{// SHAPE DRAW EFFECT CB
    
    dot.radius = CDEUtils.mod(Obj.DEFAULT_RADIUS*2, ratio, Obj.DEFAULT_RADIUS*2*0.8)
    CanvasUtils.drawDotConnections(dot, RenderStyles.PROFILE1.updateStyles([255,0,0,1], null, [5]))

}, null, (shape)=>{// SHAPE SETUP CB
    
    shape.firstDot.follow(5000, null, (prog, dot)=>{
        shape.add(new Dot(null, 4, null, null, dot.pos))
    }, CanvasUtils.FOLLOW_PATHS.CIRCLE(null, null, 0.5))

    
    shape.dots[1].follow(5000, Anim.LINEAR, (prog, dot)=>{
        shape.add(new Dot(null, 2, "red", null, dot.pos))
    }, CanvasUtils.FOLLOW_PATHS.RELATIVE(CanvasUtils.FOLLOW_PATHS.LINEAR(800, 0)))

    shape.firstDot.addConnection(shape.dots[1])
}, null, true)

CVS.add(oktest)


// USER ACTIONS
let mMove=m=>mouseInfo.textContent = "("+m.x+", "+m.y+")"
CVS.setmousemove(mMove)
CVS.setmouseleave(mMove)
CVS.setmousedown()
CVS.setmouseup()

// START
CVS.startLoop()
