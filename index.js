const fpsCounter = new FPSCounter(), CVS = new Canvas(canvas, ()=>{//looping
    let fps = fpsCounter.getFps()+"\n"+fpsCounter.fpsRaw
    if (fpsDisplay.textContent !== fps) fpsDisplay.textContent = fps
    mouseSpeed.textContent = CVS?.mouse?.speed?.toFixed(2)+" px/sec"
    mouseAngle.textContent = CVS?.mouse?.dir?.toFixed(2)+" deg"
})

// DECLARE OBJS
let movementsTester = new Shape([500,500],[
     new Dot([450, 400]),
     new Dot([450, 500]),
     new Dot([450, 550]),
     new Dot([500, 450]),
     new Dot([550, 450]),
     new Dot([550, 500]),
     new Dot([550, 550]),
     new Dot([500, 550]),
 ], DEFAULT_RADIUS, DEFAULT_RGBA, 100, (ctx, dot, ratio, m, dist)=>{
     dot.a = mod(1, ratio, 0.8)
     //dot.r = mod(255, ratio, -255)
     //dot.g = mod(255, ratio, -255)
     //let idk = mod(5, ratio, 5)
     //dot.x += random(-idk, idk)
     //dot.y += random(-idk, idk)
     dot.radius = mod(DEFAULT_RADIUS*2, ratio, DEFAULT_RADIUS*2*0.8)
     CvsUtils.drawOuterRing(dot, [255,255,255,0.2], 5)

 })
toggleCenter(movementsTester)

let movementsTester2 = new Shape([50,50],[new Dot([50, 50])])

let dragAnim2 = CvsUtils.getDraggableDotCB()
let filledShapeTester = new FilledShape(
    (ctx, shape)=>new Gradient(ctx, shape, 90, [[0, "purple"], [0.267, [250,0,0,1]], [1, "#ABC123"]]),
    true, [150, 450], [new Dot([100, 400]), new Dot([100, 450]), new Dot([150, 450]),new Dot([150, 400]),new Dot([125,325])], null, null, null, (ctx, dot, ratio, m, dist, shape)=>{
    dot.a = mod(1, ratio, 0.6)
    if (shape.dots[0].id == dot.id) dragAnim2(shape.dots[0], m, dist, ratio)
})
filledShapeTester.queueAnim(new Anim((prog)=>filledShapeTester.rgbaFill.rotation=360*prog, -750))
CVS.add(filledShapeTester)

let animTesterDx = 200
let animTester = new Shape([400,200],[
    new Dot([400,200], null, null, (dot, shape)=>{
        dot.queueAnim(new Anim((progress, playCount)=>{
            dot.a=1-progress
            if (playCount % 2) dot.x+=animTesterDx*progress*CVS.deltaTime
            else dot.x-=animTesterDx*progress*CVS.deltaTime
        }, -1000))
    })
], DEFAULT_RADIUS, DEFAULT_RGBA, 25, (ctx, dot, ratio, m, dist)=>{
    CvsUtils.drawOuterRing(dot, [dot.a*255,dot.a*255,dot.a*255,mod(0.5, ratio)], 3)
})

let test2 = new Shape((shape, dots)=>{
    dots[0].addConnection(dots.last())
    dots[1].addConnection(dots.last(1))
    return [100,100]
},[new Dot((dot, shape)=>[shape.x,20]),new Dot([80,40]),new Dot([150,60]),new Dot([250,80])], 8, DEFAULT_RGBA, 100, (ctx, dot, ratio)=>{
    dot.radius = mod(DEFAULT_RADIUS*2, ratio, DEFAULT_RADIUS*2*0.8)

    CvsUtils.drawDotConnections(dot, [255,0,0,mod(1, ratio, 0.8)])
}, undefined, (shape)=>{
    let dx=400, dy=200, dot = shape.dots.last()
    dot.g = dot.b = 0
    dot.follow(3000, null, (prog, dot)=>{
        let d = new Dot(dot.pos_, 4)
            d.queueAnim(new Anim((progress, a)=>{
                d.a=1-progress
                if (progress==1) d.remove()
            }, 1000))

            shape.add(d, true)
    }, [0,(prog)=>[dx*prog, 0]], [0.5,(prog, newProg)=>[dx*0.5, dy*newProg]])
})


let dragAnim1 = CvsUtils.getDraggableDotCB()
let draggableDotTester = new Shape([10,10],[new Dot([10,10])], DEFAULT_RADIUS, null, null, (ctx, dot, ratio, m, dist, shape)=>{

    dot.radius = mod(dot.parent.radius*2, ratio, dot.parent.radius*2*0.5)
    
    let mouseOn = dot.isWithin(m.pos, true)
    if (mouseOn && m.clicked) dot.rgba = [255, 0, 0, 1]
    else if (mouseOn) dot.rgba = [0, 255, 0, 1]
    else dot.rgba = [255, 255, 255, 1]

    CvsUtils.drawOuterRing(dot, [255,255,255,mod(0.3, ratio)], 3)

    dragAnim1(shape.dots[0], m, dist, ratio)
})

let le = new Grid("abcdefg\nhijklm\nnopqrs\ntuvwxyz", [5, 5], 50, null, [10,200], 2, null, null, (ctx, dot, ratio, m, dist)=>{
    dot.radius = mod(DEFAULT_RADIUS, ratio, DEFAULT_RADIUS)
    if (dist < 200) {
        CvsUtils.drawConnections(dot, [dot.r,dot.g,dot.b,mod(0.5, ratio)], dot.ratioPos)
    }

   CvsUtils.drawDotConnections(dot, [255,0,0,1])
}, ()=>draggableDotTester.dots[0].pos)


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

