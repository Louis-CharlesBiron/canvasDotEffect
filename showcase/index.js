const fpsCounter = new CDEUtils.FPSCounter(), CVS = new Canvas(canvas, ()=>{//looping
    let fps = fpsCounter.getFps()+"\n"+fpsCounter.fpsRaw
    if (fpsDisplay.textContent !== fps) fpsDisplay.textContent = fps
    mouseSpeed.textContent = CVS?.mouse?.speed?.toFixed(2)+" px/sec"
    mouseAngle.textContent = CVS?.mouse?.dir?.toFixed(2)+" deg"
})

// can do color channels now with Color class

// DECLARE OBJS

const normalColorTester = new Color("white")

let movementsTester = new Shape([500,500],[
     new Dot([450, 400]),
     new Dot([450, 500]),
     new Dot([450, 550]),
     new Dot([500, 450]),
     new Dot([550, 450]),
     new Dot([550, 500]),
     new Dot([550, 550]),
     new Dot([500, 550]),
 ], null, normalColorTester, 100, (ctx, dot, ratio, m, dist)=>{
     dot.a = CDEUtils.mod(1, ratio, 0.8)
     //dot.r = CDEUtils.mod(255, ratio, -255)
     //dot.g = CDEUtils.mod(255, ratio, -255)
     //let idk = CDEUtils.mod(5, ratio, 5)
     //dot.x += CDEUtils.random(-idk, idk)
     //dot.y += CDEUtils.random(-idk, idk)
     dot.radius = CDEUtils.mod(Obj.DEFAULT_RADIUS*2, ratio, Obj.DEFAULT_RADIUS*2*0.8)
     CanvasUtils.drawOuterRing(dot, [255,255,255,0.2], 5)

 })
CanvasUtils.toggleCenter(movementsTester)

let movementsTester2 = new Shape([50,50],[new Dot([50, 50])])

let dragAnim2 = CanvasUtils.getDraggableDotCB()
let filledShapeTester = new FilledShape(
    (ctx, shape)=>new Gradient(ctx, shape, 90, [[0, "purple"], [0.267, new Color([250,0,0,1])], [1, "#ABC123"]]),
    true, [150, 450], [new Dot([100, 400]), new Dot([100, 450]), new Dot([150, 450]),new Dot([150, 400]),new Dot([125,325])], null, null, null, (ctx, dot, ratio, m, dist, shape)=>{
    dot.a = CDEUtils.mod(1, ratio, 0.6)
    if (shape.dots[0].id == dot.id) dragAnim2(shape.dots[0], m, dist, ratio)
})
filledShapeTester.playAnim(new Anim((prog)=>filledShapeTester.fillColorRaw.rotation=360*prog, -750))
CVS.add(filledShapeTester)

let testMoreDragAnim = CanvasUtils.getDraggableDotCB()
let testMore = new Shape([0,0], [new Dot([600, 200]), new Dot([600, 300])], 15, (ctx, shape)=>new Gradient(ctx, shape, 90, [[0, "red"], [1, "yellow"]]), null, (ctx, dot, ratio, m, dist, shape)=>{
    if (shape.dots[0].id == dot.id) {
        testMoreDragAnim(shape.dots[0], m, dist, ratio)

        let mouseOn = dot.isWithin(m.pos, true)
        if (mouseOn && m.clicked) dot.radius = 50
        else if (mouseOn) dot.radius = 25
        else dot.radius = dot.getInitRadius()
    }
})
testMore.playAnim(new Anim((prog)=>testMore.colorRaw.rotation=-360*prog, -750))
CVS.add(testMore)



let animTesterDx = 200
let animTester = new Shape([400,200],[
    new Dot([400,200], null, null, (dot, shape)=>{
        dot.playAnim(new Anim((progress, playCount)=>{
            dot.a=1-progress
            if (playCount % 2) dot.x+=animTesterDx*progress*CVS.deltaTime
            else dot.x-=animTesterDx*progress*CVS.deltaTime
        }, -1000))
    })
], null, null, 25, (ctx, dot, ratio, m, dist)=>{
    CanvasUtils.drawOuterRing(dot, [dot.a*255,dot.a*255,dot.a*255,CDEUtils.mod(0.5, ratio)], 3)
})

let test2 = new Shape((shape, dots)=>{return [50+50,100]},[new Dot((dot, shape)=>[shape.x,20]),new Dot([80,40]),new Dot([150,60]),new Dot([250,80])], (shape)=>{return shape.dots.length*2}, normalColorTester, 100, (ctx, dot, ratio)=>{
    dot.radius = CDEUtils.mod(Obj.DEFAULT_RADIUS*2, ratio, Obj.DEFAULT_RADIUS*2*0.8)

    CanvasUtils.drawDotConnections(dot, [255,0,0,CDEUtils.mod(1, ratio, 0.8)])
}, undefined, (shape)=>{
    let dx=400, dy=200, dot = shape.dots.last()
    dot.g = 0
    dot.follow(3000, null, (prog, dot, cprog)=>{
        let d = new Dot(dot.pos_, 4)
            d.playAnim(new Anim((progress, a)=>{
                d.a=1-progress
                if (progress==1) d.remove()
            }, 1000))

        shape.add(d, true)
    }, [0,(prog)=>[dx*prog, 0]], [0.5,(prog, newProg)=>[dx*0.5, dy*newProg]])


    shape.dots[0].addConnection(shape.dots.last())
    shape.dots[1].addConnection(shape.dots.last(1))
})

// ALPHABET
let le = new Grid("abcdefg\nhijklm\nnopqrs\ntuvwxyz", [5, 5], 50, null, [10,200], 2, null, null, (ctx, dot, ratio, m, dist, shape)=>{
    dot.radius = CDEUtils.mod(Obj.DEFAULT_RADIUS, ratio, Obj.DEFAULT_RADIUS)

    if (dist < shape.limit) CanvasUtils.drawConnection(dot, [dot.r,dot.g,dot.b,CDEUtils.mod(0.5, ratio)], dot.ratioPos)

    CanvasUtils.drawDotConnections(dot, [255,0,0,1])
}, ()=>draggableDotTester.dots[0].pos)



// SINGLE DRAGGABLE DOT
let dragAnim1 = CanvasUtils.getDraggableDotCB()
let draggableDotTester = new Shape([10,10],[new Dot([10,10])], null, null, null, (ctx, dot, ratio, m, dist, shape)=>{

    let mouseOn = dot.isWithin(m.pos, true)
    if (mouseOn && m.clicked) dot.color = [255, 0, 0, 1]
    else if (mouseOn) dot.color = [0, 255, 0, 1]
    else dot.color = [255, 255, 255, 1]

    CanvasUtils.drawOuterRing(dot, [255,255,255,CDEUtils.mod(0.3, ratio)], 3)

    dragAnim1(shape.dots[0], m, dist, ratio)
}, null, (shape)=>{
    let dot = shape.firstDot
    dot.playAnim(new Anim((prog, i)=>{
        dot.radius = i%2?25*(1-prog):25*prog
        le.limit = dot.radius*5
    }, -750, Anim.easeOutQuad))

    dot.playAnim(new Anim((prog, i, cprog)=>{dot.b = i%2?255*(1-cprog):255*cprog}, -750))
})




CVS.add(draggableDotTester)
CVS.add(movementsTester)
CVS.add(animTester)
CVS.add(le)
CVS.add(test2)

// USER ACTIONS
let mMove=m=>mouseInfo.textContent = "("+m.x+", "+m.y+")"
CVS.setmousemove(mMove)
CVS.setmouseleave(mMove)
CVS.setmousedown()
CVS.setmouseup()

// START
CVS.startLoop()

