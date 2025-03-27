const fpsCounter = new FPSCounter(), CVS = new Canvas(canvas, ()=>{//looping
    let fps = fpsCounter.getFps()+"\n"+fpsCounter.fpsRaw
    if (fpsDisplay.textContent !== fps) fpsDisplay.textContent = fps
    mouseSpeed.textContent = CVS?.mouse?.speed?.toFixed(2)+" px/sec"
    mouseAngle.textContent = CVS?.mouse?.dir?.toFixed(2)+" deg"
}, null)

// DECLARE OBJS

const normalColorTester = new Color("white")

let movementsTester = new Shape([300,300],[
    new Dot([-50, -50]),
    new Dot([-50, 0]),
    new Dot([-50, 50]),
    new Dot([0, -50]),
    new Dot([0, 0]),
    new Dot([0, 50]),
    new Dot([50, -50]),
    new Dot([50, 0]),
 ], null, normalColorTester, 100, (render, dot, ratio,)=>{
    dot.a = CDEUtils.mod(1, ratio, 0.8)
    //dot.r = CDEUtils.mod(255, ratio, -255)
    //dot.g = CDEUtils.mod(255, ratio, -255)
    //let idk = CDEUtils.mod(5, ratio, 5)
    //dot.x += CDEUtils.random(-idk, idk)
    //dot.y += CDEUtils.random(-idk, idk)
    dot.radius = CDEUtils.mod(_Obj.DEFAULT_RADIUS*2, ratio, _Obj.DEFAULT_RADIUS*2*0.8)
    CanvasUtils.drawOuterRing(dot, [255,255,255,0.2], 5)

    let kb = CVS.keyboard, speed = 100
    if (kb.hasKeysDown()) {
        if (kb.isDown("A")) dot.x -= speed*CVS.deltaTime
        if (kb.isDown("d")) dot.x += speed*CVS.deltaTime
        if (kb.isDown("W")) dot.y -= speed*CVS.deltaTime
        if (kb.isDown("s")) dot.y += speed*CVS.deltaTime
    }

 }, null, null, null, [50,0])
CanvasUtils.toggleCenter(CVS, movementsTester)


let dragAnim2 = CanvasUtils.getDraggableDotCB()
let filledShapeTester = new FilledShape(
    (ctx, shape)=>new Gradient(ctx, shape, [[0, "purple"], [0.267, new Color([250,0,0,1])], [1, "#ABC123"]], null, 90),
    true, [0,0], [new Dot([100, 400]), new Dot([100, 450]), new Dot([150, 450]),new Dot([150, 400]),new Dot([125,325])], null, null, null, (render, dot, ratio, res, m, dist, shape)=>{
    dot.a = CDEUtils.mod(1, ratio, 0.6)
    if (shape.dots[0].id == dot.id) dragAnim2(shape.dots[0], m, dist, ratio)
}, null, null, null, null, true)
filledShapeTester.playAnim(new Anim((prog)=>filledShapeTester.fillColorRaw.rotation=360*prog, -750))

let testMoreDragAnim = CanvasUtils.getDraggableDotCB()
let testMore = new Shape([0,0], [new Dot([600, 200]), new Dot([600, 300], null, "blue")], 15, (ctx, shape)=>new Gradient(ctx, shape, [[0, "red"], [1, "yellow"]], null, 90), null, (render, dot, ratio, res, m, dist, shape)=>{
    if (shape.dots[0].id == dot.id) {
        testMoreDragAnim(shape.dots[0], m, dist, ratio)

        let mouseOn = dot.isWithin(m.pos, true)
        if (mouseOn && m.clicked) dot.radius = 50
        else if (mouseOn) dot.radius = 25
        else dot.radius = dot.getInitRadius()
    }
})
testMore.playAnim(new Anim((prog)=>testMore.firstDot.colorRaw.rotation=-360*prog, -750))

//let aud = new AudioDisplay(AudioDisplay.loadMicrophone(), [200,50], "lime", AudioDisplay.BARS(), 64, true)
//CVS.add(aud)


let test2 = new Shape((shape, idk)=>{return [50+50,100+shape.dots.length]},[new Dot((dot, shape)=>[shape.x,20]),new Dot(()=>[40+45,40]),new Dot([0,0],null,null,null,[150,150]),new Dot([250,80])],
(shape, dot)=>{return shape.dots.length*2}, normalColorTester, 100, (render, dot, ratio, res, m, dist, parent)=>{
    dot.radius = CDEUtils.mod(_Obj.DEFAULT_RADIUS*2, ratio, _Obj.DEFAULT_RADIUS*2*0.8)

    CanvasUtils.drawDotConnections(dot, [255,0,0,CDEUtils.mod(1, ratio, 0.8)], false, Render.LINE_TYPES.QUADRATIC, CDEUtils.mod(2, ratio))
}, undefined, (shape)=>{
    let dx=400, dy=200, dot = shape.lastDot
    dot.g = 0
    dot.follow(3000, null, (prog, dot)=>{
        //let d = new Dot(null, 4, null, null, dot.pos)
        //    d.playAnim(new Anim((progress)=>{
        //        d.a=1-progress
        //        if (progress==1) d.remove()
        //    }, 1000))
        //shape.add(d)
    }, [[0,(prog)=>[dx*prog, 0]], [0.5,(prog, newProg)=>[dx*0.5, dy*newProg]]])


    shape.dots[0].addConnection(shape.lastDot)
    shape.dots[1].addConnection(CDEUtils.getLast(shape.dots, 1))

    return {a:"idk"}
})

// ALPHABET
let leColor = [255,0,0,1]
let le = new Grid("abcdefg\nhijklm\nnopqrs\ntuvwxyz", [5, 5], 50, null, [10,200], 2, null, null, (render, dot, ratio, res, m, dist, shape, isActive)=>{
    dot.radius = CDEUtils.mod(_Obj.DEFAULT_RADIUS, ratio, _Obj.DEFAULT_RADIUS)

    if (dist < shape.limit) CanvasUtils.drawLine(dot, dot.ratioPos, render.profile1.update(Color.rgba(0,255,255,CDEUtils.mod(1, ratio, 0.8)), null, Render.DEFAULT_COMPOSITE_OPERATION, null, 4, [5, 25]), 2)
    
    CanvasUtils.drawDotConnections(dot, render.profile1.update(leColor, null, null, null, 2, [0]))
}, ()=>draggableDotTester.dots[0].pos)



let test = new Grid("abcdefg\nhijklm".toUpperCase(), [5, 5], 50, null, [450,50], 2, null, null, (render, dot, ratio, res, m, dist, shape, isActive)=>{
    CanvasUtils.drawDotConnections(dot, render.profile1.update([255,255,255,1]))
})

CVS.add(test)

let testtest = new Grid("a\nh".toUpperCase(), [5, 5], 50, null, [400,50], 2, null, null, (render, dot, ratio, res, m, dist, shape, isActive)=>{
    CanvasUtils.drawDotConnections(dot, render.profile1.update([255,255,255,1]))
})
//CVS.add(testtest)
//testtest.singe([10, 10])

// SINGLE DRAGGABLE DOT
let dragAnim1 = CanvasUtils.getDraggableDotCB()
let draggableDotTester = new Shape([10,10],[new Dot([10,10])], null, null, null, (render, dot, ratio, res, m, dist, shape, isActive)=>{

    if (isActive) {
        let mouseOn = dot.isWithin(m.pos, true)
        if (mouseOn && m.clicked) dot.color = [255, 0, 0, 1]
        else if (mouseOn) dot.color = [0, 254, 0, 1]
        else dot.color = [255, 255, 255, 1]
    }

    CanvasUtils.drawOuterRing(dot, [255,255,255,CDEUtils.mod(0.3, ratio)], 3)

    dragAnim1(shape.dots[0], m, dist, ratio)
}, null, (shape)=>{
    let dot = shape.firstDot
    dot.playAnim(new Anim((prog, i, deltaTime, cprog)=>{
        dot.radius = i%2?25*(1-cprog):25*cprog
        le.limit = dot.radius*5
    }, -750, Anim.easeOutQuad))

    dot.playAnim(new Anim((prog, i)=>{dot.b = i%2?255*(1-prog):255*prog}, -750))
})

let animTester = new Shape([400,200],[
    new Dot([0,50], null, null, (dot, shape)=>{

        // overriding
        //let distance = 150, ix = dot.x
        //dot.playAnim(new Anim((progress, playCount)=>{
        //    dot.x = ix + ((playCount%2)||-1) * distance * progress
        //    if (progress==1) ix = dot.x
        //}, -1000, Anim.easeOutBack))

        // additive
        let distance = 150, ix = dot.x, ax = 0
        dot.playAnim(new Anim((prog, i) => {
            const dx = ((i%2)||-1)*distance*prog-ax
            dot.x += dx
            ax += dx
        
            if (prog == 1) {
                ix = dot.x
                ax = 0
            }
        }, -1000, Anim.easeOutBack))
        

    })
], null, null, 25, (render, dot, ratio)=>{
    CanvasUtils.drawOuterRing(dot, [dot.a*255,dot.a*255,dot.a*255,CDEUtils.mod(0.5, ratio)], 3)
}, null, null, null, ()=>draggableDotTester.firstDot?.pos, true)


let generationTester = new Shape([100,600], 
    Shape.generate(null, [-50, 0], 1000, 10, [-600, 150], (dot, nextDot)=>{
        //dot.addConnection(nextDot)

    }),
    3, "red", 100, (render, dot, ratio)=>{
        CanvasUtils.drawDotConnections(dot, [255,0,0,1])
        dot.radius = CDEUtils.mod(dot.getInitRadius()*2, ratio, dot.getInitRadius()*2*0.8)
        dot.a = CDEUtils.mod(1, ratio, 0.8)
})


let textValue = "BONJOUR, LOL?? :D", textGradient = new Color(new Gradient(CVS.ctx, Gradient.PLACEHOLDER, [[0, "gold"], [0.5, "red"], [1, "gold"]], null, 90), true)
for (let i = 0;i<20;i++) {
    let t = new TextDisplay(()=>textValue, [100, 100+1*i], textGradient, render=>render.textProfile1.update("18px arial", 25, null), "FILL", null, null, null, ()=>testMore.firstDot)
    
    t.playAnim(new Anim(prog=>{
        textGradient.colorRaw.rotation = -360*prog
        t.scale = [Math.sin(Math.PI*prog*2), 2.5*Math.sin(Math.PI*prog*2)]

    },-3000))
    t.playAnim(new Anim(prog=>{
        t.rotation = -360*prog
    },-22500))
    CVS.add(t)
}


const testText2 = new TextDisplay("Test § ->", [100, 550], (render, text)=>new Pattern(render, ImageDisplay.loadVideo("./img/vidTest.mp4",true,true), text), null, null, null, null, (text)=>{
    CanvasUtils.lookAt(testText2, filledShapeTester.firstDot)
})
CVS.add(testText2)

let imageTester = new ImageDisplay("./img/logo.png", [-250, 75], [250], (e,a)=>console.log(e,a), null, null, ()=>testMore.firstDot)

let trailTester = new Shape([200, 100], new Dot(), null, "lime", null, (render, dot, ratio, res, m, dist, shape)=>{
    if (dot.id==shape.firstDot.id) {
        res[0](shape.dots[0], m, dist, ratio)
        res[1](m)
    }
}, null, (shape)=>{
    return [
        CanvasUtils.getDraggableDotCB(),
        CanvasUtils.getTrailEffectCB(CVS, shape.firstDot, 10, (dot, ratio, isMoving, m)=>{
            if (isMoving && m.clicked) {
                dot.a = ratio
                dot.radius = 25*(1-ratio)
            }

            dot.radius = 25*ratio
        })
    ]
})

CVS.add(trailTester)

let yo = new Shape([0,0], new Dot([900, 700]), null, "aqua", null, (render, dot, ratio, res, m, dist, shape)=>{
    if (dot.id==shape.firstDot.id) {
        res[0](shape.dots[0], m, dist, ratio)
        res[1](m)
    }
}, null, (shape)=>{
    return [
        CanvasUtils.getDraggableDotCB(),
        CanvasUtils.getTrailEffectCB(CVS, shape.firstDot, 10, (dot, ratio, isMoving, m, pos, i)=>{
            if (isMoving) dot.moveTo(pos, 1000 * (i+1)/10, Anim.linear, null, false, true)
            
            if (isMoving && m.clicked) {
                dot.a = ratio
                dot.radius = 25*(1-ratio)
            }

            dot.a -= (1-ratio)/10
            dot.radius = 25*ratio
        }, true)
    ]
})

CVS.add(yo)

/*let compOp = Render.DEFAULT_COMPOSITE_OPERATION
let moreGridTester = new Grid("!?@#$%\n^&*(),.'\n-+_:;[]\n01234567890\n\\/|{}", [7, 7], 50, null, [250,5], 1, [255,255,255,0.5], 50, (render, dot, ratio, res, m, dist, shape, isActive)=>{
    const v = CDEUtils.mod(50, ratio)>>0, hasFilter = (v>>0), feDisplacementMap = res[0]

    if (feDisplacementMap.getAttribute("scale") != v) feDisplacementMap.setAttribute("scale", v)

    CanvasUtils.drawDotConnections(dot, render.profile3.update(leColor, hasFilter?"url(#test)":"none", compOp, 1, 3, [0]), null, null, null, !hasFilter)
}, null, ()=>{ 
    Canvas.loadSVGFilter(`<svg>
        <filter id="turbulence">
          <feTurbulence type="turbulence" baseFrequency="0.01 0.02" numOctaves="1" result="NOISE"></feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="NOISE" scale="50">
          </feDisplacementMap>
        </filter>
       </svg>`, "test")

    return [Canvas.getSVGFilter("test")[1], 50]
})
CVS.add(moreGridTester)

let visualEffectsTester = new Shape([700,600],[
    new Dot([0, -50]),
    new Dot([0, 0]),
    new Dot([0, 50]),
    new Dot([50, -50]),
    new Dot([50, 0]),
], null, normalColorTester, 100, (render, dot, ratio)=>{
    dot.a = CDEUtils.mod(1, ratio, 0.2)
    dot.radius = CDEUtils.mod(_Obj.DEFAULT_RADIUS*2, ratio, _Obj.DEFAULT_RADIUS*2*0.8)
    CanvasUtils.drawOuterRing(dot, render.profile4.update([255,255,255,0.2], ...dot.visualEffects), 5)


}, null, (shape)=>{
    shape.rotateAt(45)
    shape.setVisualEffects(["blur(3px)"])
    shape.firstDot.filter = "none"

}, null, [50,0])
CVS.add(visualEffectsTester)

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
CVS.add(aa)*/

Canvas.loadSVGFilter(`<svg>
    <filter id="turbulence">
      <feTurbulence type="turbulence" baseFrequency="0.01 0.02" numOctaves="1" result="NOISE"></feTurbulence>
      <feDisplacementMap in="SourceGraphic" in2="NOISE" scale="50">
      </feDisplacementMap>
    </filter>
   </svg>`, "f")

CVS.add(generationTester)
CVS.add(animTester)
CVS.add(draggableDotTester)
CVS.add(testMore)
CVS.add(filledShapeTester)
CVS.add(movementsTester)
CVS.add(test2)
CVS.add(le)
CVS.add(imageTester)

let dupelicateTester = le.duplicate()
for (let i=0;i<3;i++) {
    CVS.add(dupelicateTester)
    dupelicateTester.moveBy([100, 100])
    dupelicateTester = dupelicateTester.duplicate()
}

// USER ACTIONS
let mMove=m=>mouseInfo.textContent = "("+m.x+", "+m.y+")"
CVS.setmousemove(mMove)
CVS.setmouseleave(mMove)
CVS.setmousedown()
CVS.setmouseup()
CVS.setkeydown()
CVS.setkeyup()

// START
CVS.startLoop()