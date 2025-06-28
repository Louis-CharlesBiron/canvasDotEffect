const _ = null

const fpsCounter = new FPSCounter(), CVS = new Canvas(0?canvas:new OffscreenCanvas(1000, 1000), ()=>{//looping
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
CVS.setKeyDown((kb, e)=>updateInput(e))
CVS.setKeyUp()

let mMove2=m=>mouseInfo2.textContent = "("+m.x+", "+m.y+")"
CVS2.setMouseMove(mMove2)
CVS2.setMouseLeave(mMove2)
CVS2.setMouseDown()
CVS2.setMouseUp()
CVS2.setKeyDown()
CVS2.setKeyUp()

// START
CVS.start()
CVS2.start()



const fpsCounter3 = new FPSCounter(), CVS3 = new Canvas(canvas3, ()=>{//runs once because static canvas
    console.log("STATIC FRAME")
})



let imageTester = new ImageDisplay("./img/logo.png", [250, 75], [250], (e,a)=>console.log(e,a))
CVS3.add(imageTester)

let test = new Grid("abcdefg\nhijklm".toUpperCase(), [5, 5], 50, null, [450,50], 2, null, null, (render, dot, ratio, res, m, dist, shape, isActive)=>{
    CanvasUtils.drawDotConnections(dot, render.profile1.update([255,255,255,1]))
})
CVS3.add(test)



let movementsTester = new Shape([300,300],[
    new Dot([-50, -50]),
    new Dot([-50, 0]),
    new Dot([-50, 50]),
    new Dot([0, -50]),
    new Dot([0, 0]),
    new Dot([0, 50]),
    new Dot([50, -50]),
    new Dot([50, 0]),
 ], null, _, 100, (render, dot, ratio,)=>{
    dot.a = CDEUtils.mod(1, ratio, 0.8)
    dot.radius = CDEUtils.mod(_Obj.DEFAULT_RADIUS*2, ratio, _Obj.DEFAULT_RADIUS*2*0.8)
    CanvasUtils.drawOuterRing(dot, [255,255,255,0.2], 5)

 }, null, null, null, [50,0])
 CVS3.add(movementsTester)



 let dragAnim2 = CanvasUtils.getDraggableDotCB()
let filedASD = new FilledShape(
    (ctx, shape)=>new Gradient(ctx, shape, [[0, "purple"], [0.267, new Color([250,0,0,1])], [1, "#ABC123"]], null, 90),
    true, [0,-100], [new Dot([100, 400]), new Dot([100, 450]), new Dot([150, 450]),new Dot([150, 400]),new Dot([125,325])], null, null, null, (render, dot, ratio, res, m, dist, shape)=>{
    dot.a = CDEUtils.mod(1, ratio, 0.6)
    if (shape.dots[0].id == dot.id) dragAnim2(shape.dots[0], m, dist, ratio)
}, null, null, null, null, true)
filedASD.playAnim(new Anim((prog)=>filedASD.fillColorRaw.rotation=360*prog, -750))
CVS3.add(filedASD)



let textValue = "BONJOUR, LOL?? :D", textGradient = new Color(new Gradient(CVS3.ctx, Gradient.PLACEHOLDER, [[0, "gold"], [0.5, "red"], [1, "gold"]], null, 90), true)
for (let i = 0;i<20;i++) {
    let t = new TextDisplay(()=>textValue, [100, 100+1*i], textGradient, render=>render.textProfile1.update("18px arial", 25, null))
    
    t.playAnim(new Anim(prog=>{
        textGradient.colorRaw.rotation = -360*prog
        t.scale = [Math.sin(Math.PI*prog*2), 2.5*Math.sin(Math.PI*prog*2)]

    },-3000))
    t.playAnim(new Anim(prog=>{
        t.rotation = -360*prog
    },-22500))
    CVS3.add(t)
}



let aa = new Shape([100,100], [new Dot([-50, -50]),
    new Dot([-50, 0]),
    new Dot([-50, 50]),
    new Dot([0, -50]),
    new Dot([0, 0]),
    new Dot([0, 50]),
    new Dot([50, -50]),
    new Dot([50, 0]),new Dot([50, 50])], 5, [255,255,255,0.5], 50, (render, dot, ratio, feDisplacementMap)=>{
    const v = CDEUtils.mod(50, ratio), hasFilter = v>>0,  filterValue = hasFilter ? "url(#yo)" : "none", dotFilterValue = "url(#yo) blur("+Math.round(v)/10+"px)"
    if (feDisplacementMap.getAttribute("scale") != v) feDisplacementMap.setAttribute("scale", v)
    if (dot.filter !== dotFilterValue) dot.filter = dotFilterValue
    CanvasUtils.drawOuterRing(dot, render.profile3.update([255,250,255,1], filterValue), 3, null, null, null, !hasFilter)
}, null, ()=>{ 
    Canvas.loadSVGFilter(`<svg>
        <filter id="turbulence">
          <feTurbulence type="turbulence" baseFrequency="0.01 0.02" numOctaves="1" result="NOISE"></feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="NOISE" scale="50">
          </feDisplacementMap>
        </filter>
       </svg>`, "yo")

       return Canvas.getSVGFilter("yo")[1]
})
CVS3.add(aa)




CVS3.initializeStatic()

