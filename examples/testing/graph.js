const fpsCounter = new FPSCounter(), CVS = new Canvas(1?canvas:new OffscreenCanvas(1000, 1000), ()=>{//looping
    let fps = fpsCounter.getFps()+"\n"+fpsCounter.fpsRaw
    if (fpsDisplay.textContent !== fps) fpsDisplay.textContent = fps
    mouseSpeed.textContent = CVS?.mouse?.speed?.toFixed(2)+" px/sec"
    mouseAngle.textContent = CVS?.mouse?.dir?.toFixed(2)+" deg"
}, 60)


// DECLARE OBJS
const _=null, normalColorTester = new Color("white")

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

let text = new TextDisplay("yoman test\nyoman\ntest", [200, 600], "lime")
CVS.add(text)


CanvasUtils.createEmptyObj(CVS, obj=>{// setupCB

    // Defining some graph properties
    const startPos = [100, 100],
    amplitude = 100,
    finalWidth = 400,
    animDuration = 5000,
    yFn = Render.Y_FUNCTIONS.SINUS(amplitude, finalWidth)

  // Creating an anim to smoothly generate it over 5 seconds
  obj.playAnim(new Anim((prog)=>{

      // Generating and updating the drawn path
      obj.setupResults = Render.generate(
          startPos,        // The start pos of the generation
          yFn,             // The function providing a Y value depanding on a given X value. (x)=>{... return y}
          finalWidth*prog, // The width of the generation. Will be 400px at the end
          animDuration/4   // The precision in segments of the generated result
      )
  }, animDuration, _, ()=>{// endCB

        // Defining some graph properties for the 2nd sine wave
        const startPos2 = Render.getGenerationEndPos(startPos, yFn, finalWidth),
              yFn2 = Render.Y_FUNCTIONS.SINUS(-amplitude, finalWidth)

        obj.playAnim(new Anim((prog)=>{

            // Generating and updating the drawn path
            obj.setupResults = Render.generate(
                startPos2,        // The start pos of the 2nd generation (here it's the end pos of the 1st generation)      
                yFn2,             // Same Y function as the 1st generation, but with inverted amplitude
                -finalWidth*prog, // Same width as the 1st generation, but inverted (negative)
                animDuration/4,   // The precision in segments of the generated result
                ()=>Render.generate(startPos, yFn, finalWidth, animDuration/4) // The callback defining the base path. (Exact same as 1st generation)
            )

        }, animDuration))

    })
)
}, obj=>{// loopCB

    // Receiving the path through the obj's setupResults, and drawing it in red
    const path = obj.setupResults
    if (path) CVS.render.batchStroke(path, [255,0,0,1])

})







CanvasUtils.createEmptyObj(CVS, ()=>{
    return Render.composePath([[25,25], [500, 200], [30, 265], [500, 600], [800, 20], [303, 355], filledShapeTester], Render.LINE_TYPES.LINEAR)
}, (obj)=>{
    const path = obj.setupResults
    if (path) CVS.render.batchStroke(path, [255,0,253,.25])
})

CanvasUtils.createEmptyObj(CVS, ()=>{
    return Render.mergePaths([Render.getLine([200, 300], [300, 200]), Render.getLine([20, 250], [250, 20]), Render.getRect([400, 400], 100, 40)], [200, 20])
}, (obj)=>{
    const path = obj.setupResults
    if (path) CVS.render.batchStroke(path, [0,0,255,.25])
})


CanvasUtils.createEmptyObj(CVS, _, ()=>{
    CVS.render.replaceColor([255,0,0,1], [0,255,0,1], 10, [[207, 53], [377, 132]], CDEUtils.random(1, 10))

    
    CVS.render.transformArea(Render.COLOR_TRANSFORMS.TINT, [33, 255, 100, 1], [[350, 100], [530, 540]])
    
    
    CVS.render.transformArea(Render.COLOR_TRANSFORMS.RANDOMIZE, [33, 255, 100, 1], [[115, 115], [400, 350]], 2)

    CVS.render.transformArea(Render.COLOR_TRANSFORMS.STATIC, [33, 255, 100, 1], [[500, 20], [650, 150]], 10)


})



// USER ACTIONS
let mMove=m=>mouseInfo.textContent = "("+m.x+", "+m.y+")"
CVS.setMouseMove(mMove)
CVS.setMouseLeave(mMove)
CVS.setMouseDown()
CVS.setMouseUp()

// START
CVS.start()





CanvasUtils.createEmptyObj(CVS, obj=>{// setupCB

    // Defining some graph properties
    const startPos = [50, 700],
    amplitude = 20,
    finalWidth = CVS.width,
    animDuration = 10000,
    yFn = Render.Y_FUNCTIONS.SINUS(amplitude, 40)

  // Creating an anim to smoothly generate it over 5 seconds
  obj.playAnim(new Anim((prog)=>{

      // Generating and updating the drawn path
      obj.setupResults = Render.generate(
          startPos,        // The start pos of the generation
          yFn,             // The function providing a Y value depanding on a given X value. (x)=>{... return y}
          finalWidth*prog, // The width of the generation. Will be 400px at the end
          animDuration/4   // The precision in segments of the generated result
      )
  }, animDuration, _, ()=>{// endCB

        // Defining some graph properties for the 2nd sine wave
        const startPos2 = Render.getGenerationEndPos(startPos, yFn, finalWidth),
              yFn2 = Render.Y_FUNCTIONS.SINUS(-amplitude, 40)

        obj.playAnim(new Anim((prog)=>{

            // Generating and updating the drawn path
            obj.setupResults = Render.generate(
                startPos2,        // The start pos of the 2nd generation (here it's the end pos of the 1st generation)      
                yFn2,             // Same Y function as the 1st generation, but with inverted amplitude
                -finalWidth*prog, // Same width as the 1st generation, but inverted (negative)
                animDuration/4,   // The precision in segments of the generated result
                ()=>Render.generate(startPos, yFn, finalWidth, animDuration/4) // The callback defining the base path. (Exact same as 1st generation)
            )

        }, animDuration))

    })
)
}, obj=>{// loopCB

    // Receiving the path through the obj's setupResults, and drawing it in red
    const path = obj.setupResults
    if (path) CVS.render.batchStroke(path, [255,0,0,1])

})