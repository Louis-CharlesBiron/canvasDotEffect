const fpsCounter = new CDEUtils.FPSCounter(), CVS = new Canvas(canvas, ()=>{//looping
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
 ], null, normalColorTester, 100, (render, dot, ratio, m, dist)=>{
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

 }, null, null, [50,0])
CanvasUtils.toggleCenter(movementsTester)


let dragAnim2 = CanvasUtils.getDraggableDotCB()
let filledShapeTester = new FilledShape(
    (ctx, shape)=>new Gradient(ctx, shape, [[0, "purple"], [0.267, new Color([250,0,0,1])], [1, "#ABC123"]], null, 90),
    true, [0,0], [new Dot([100, 400]), new Dot([100, 450]), new Dot([150, 450]),new Dot([150, 400]),new Dot([125,325])], null, null, null, (render, dot, ratio, m, dist, shape)=>{
    dot.a = CDEUtils.mod(1, ratio, 0.6)
    if (shape.dots[0].id == dot.id) dragAnim2(shape.dots[0], m, dist, ratio)
}, null, null, null, true)
//filledShapeTester.playAnim(new Anim((prog)=>filledShapeTester.fillColorRaw.rotation=360*prog, -750))

let testMoreDragAnim = CanvasUtils.getDraggableDotCB()
let testMore = new Shape([0,0], [new Dot([600, 200]), new Dot([600, 300], null, "blue")], 15, (ctx, shape)=>new Gradient(ctx, shape, [[0, "red"], [1, "yellow"]], null, 90), null, (render, dot, ratio, m, dist, shape)=>{
    if (shape.dots[0].id == dot.id) {
        testMoreDragAnim(shape.dots[0], m, dist, ratio)

        let mouseOn = dot.isWithin(m.pos, true)
        if (mouseOn && m.clicked) dot.radius = 50
        else if (mouseOn) dot.radius = 25
        else dot.radius = dot.getInitRadius()
    }
}, null, null, null)
testMore.playAnim(new Anim((prog)=>testMore.firstDot.colorRaw.rotation=-360*prog, -750))



let test2 = new Shape((shape, dots)=>{return [50+50,100]},[new Dot((dot, shape)=>[shape.x,20]),new Dot(()=>[40+45,40]),new Dot([0,0],null,null,null,[150,150]),new Dot([250,80])],
(shape)=>{return shape.dots.length*2}, normalColorTester, 100, (render, dot, ratio, m, dist, parent, res)=>{
    dot.radius = CDEUtils.mod(_Obj.DEFAULT_RADIUS*2, ratio, _Obj.DEFAULT_RADIUS*2*0.8)

    CanvasUtils.drawDotConnections(dot, [255,0,0,CDEUtils.mod(1, ratio, 0.8)], false, Render.LINE_TYPES.QUADRATIC, CDEUtils.mod(2, ratio))
}, undefined, (shape)=>{
    let dx=400, dy=200, dot = shape.dots.last()
    dot.g = 0
    dot.follow(3000, null, (prog, dot)=>{
        //let d = new Dot(null, 4, null, null, dot.pos)
        //    d.playAnim(new Anim((progress)=>{
        //        d.a=1-progress
        //        if (progress==1) d.remove()
        //    }, 1000))
        //shape.add(d)
    }, [[0,(prog)=>[dx*prog, 0]], [0.5,(prog, newProg)=>[dx*0.5, dy*newProg]]])


    shape.dots[0].addConnection(shape.dots.last())
    shape.dots[1].addConnection(shape.dots.last(1))

    return {a:"idk"}
})

// ALPHABET
let leColor = [255,0,0,1]
let le = new Grid("abcdefg\nhijklm\nnopqrs\ntuvwxyz", [5, 5], 50, null, [10,200], 2, null, null, (render, dot, ratio, m, dist, shape, cr, isActive)=>{
    dot.radius = CDEUtils.mod(_Obj.DEFAULT_RADIUS, ratio, _Obj.DEFAULT_RADIUS)

    if (dist < shape.limit) CanvasUtils.drawLine(dot, dot.ratioPos, render.profile1.update(Color.rgba(0,255,255,CDEUtils.mod(1, ratio, 0.8)), 4, [5, 25]), 2)
    
    CanvasUtils.drawDotConnections(dot, render.profile1.update(leColor, 2, [0]))
}, ()=>draggableDotTester.dots[0].pos, null)




// SINGLE DRAGGABLE DOT
let dragAnim1 = CanvasUtils.getDraggableDotCB()
let draggableDotTester = new Shape([10,10],[new Dot([10,10])], null, null, null, (render, dot, ratio, m, dist, shape, sr, isActive)=>{

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
        
            if (prog === 1) {
                ix = dot.x
                ax = 0
            }
        }, -1000, Anim.easeOutBack))
        

    })
], null, null, 25, (render, dot, ratio, m, dist)=>{
    CanvasUtils.drawOuterRing(dot, [dot.a*255,dot.a*255,dot.a*255,CDEUtils.mod(0.5, ratio)], 3)
}, null, null, ()=>draggableDotTester.firstDot?.pos, true)


let generationTester = new Shape([100,600], 
    Shape.generate(null, [-50, 0], 1000, 10, [-600, 150], (dot, nextDot)=>{
        //dot.addConnection(nextDot)

    }),
    3, "red", 100, (render, dot, ratio, m, dist, parent)=>{
        CanvasUtils.drawDotConnections(dot, [255,0,0,1])
        dot.radius = CDEUtils.mod(dot.getInitRadius()*2, ratio, dot.getInitRadius()*2*0.8)
        dot.a = CDEUtils.mod(1, ratio, 0.8)
})


let textValue = "BONJOUR, LOL?? :D", textGradient = new Color(new Gradient(CVS.ctx, Gradient.PLACEHOLDER, [[0, "gold"], [0.5, "red"], [1, "gold"]], null, 90), true)
for (let i = 0;i<20;i++) {
    let t = new TextDisplay(()=>textValue, [100, 100+1*i], textGradient, render=>render.textProfile1.update("18px arial", 25, null), "FILL", null, null, ()=>testMore.firstDot)
    
    t.playAnim(new Anim(prog=>{
        textGradient.colorRaw.rotation = -360*prog
        t.scale = [Math.sin(Math.PI*prog*2), 2.5*Math.sin(Math.PI*prog*2)]

    },-3000))
    t.playAnim(new Anim(prog=>{
        t.rotation = -360*prog
    },-22500))
    CVS.add(t, true)
}


const testText2 = new TextDisplay("Test § ->", [100, 550], (render, text)=>new Pattern(render, ImageDisplay.loadVideo("./img/vidTest.mp4",true,true), text))
CVS.add(testText2, true)

const loopTODObetter = CanvasUtils.SHAPES.DEBUG_SHAPE([0,0], new Dot())
loopTODObetter.drawEffectCB=(render, dot, ratio, mouse)=>{
    CanvasUtils.lookAt(testText2, filledShapeTester.firstDot)
}
CVS.add(loopTODObetter)

let imageTester = new ImageDisplay(ImageDisplay.loadImage("./img/logo.png"), [-250, 75], [250], null, ()=>testMore.firstDot)
CVS.add(imageTester, true)



CVS.add(generationTester)
CVS.add(animTester)
CVS.add(draggableDotTester)
CVS.add(testMore)
CVS.add(filledShapeTester)
CVS.add(movementsTester)
CVS.add(test2)
CVS.add(le)

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

