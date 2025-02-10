const fpsCounter = new CDEUtils.FPSCounter(), CVS = new Canvas(document.getElementById('canvasId'),()=>{//looping
    let fps = fpsCounter.getFps()+"\n"+fpsCounter.fpsRaw
    if (fpsDisplay.textContent !== fps) fpsDisplay.textContent = fps
    mouseSpeed.textContent = CVS?.mouse?.speed?.toFixed(2)+" px/sec"
    mouseAngle.textContent = CVS?.mouse?.dir?.toFixed(2)+" deg"
})
const dummyShape = new FilledShape((ctx, vshape) => new Gradient(ctx, vshape, [[0, 'blue'], [0.5, 'black'],[0.8, 'lime'],[1, 'gold']], null, 1), true, [200, 200], [new Dot([50, 0]), new Dot([0, 0]), new Dot([0, 50]), new Dot([100, 100], null, null, null, (dot, shape)=>shape.secondDot)], null, 'blue', null,
    (render, dot, ratio, mouse, distance, shape, parentSetupResults, isActive, rawRatio) => {
        render.stroke(Render.getQuadCurve(shape.dots[1].pos, [500, 500 + ratio * 100], ratio))
        dot.hue = CDEUtils.mod(1000, ratio); dot.radius = CDEUtils.mod(20, ratio, 15)
        dot.x+=CDEUtils.random(-2,2)
        dot.y+=CDEUtils.random(-2,2)

        CanvasUtils.drawDotConnections(dot,render.profile1.updateStyles(null,4,[5,15], CDEUtils.mod(1000, ratio)), null,Render.getBeizerCurve)



    }, null, (shape) => {


        shape.dots[1].follow(-2000, Anim.linear, null, CanvasUtils.FOLLOW_PATHS.INFINITY_SIGN(200, 100))
        shape.dots[0].addConnection(shape.dots[1])
        shape.dots[1].addConnection(shape.dots[2])
        shape.dots[2].addConnection(shape.dots[3])
        shape.dots[3].addConnection(shape.dots[0])

    }, null, true)
CVS.add(dummyShape)

let sfsf = dummyShape.duplicate()
CVS.add(sfsf)



CVS.setmousemove(/*custom callback*/)
CVS.setmouseleave()
CVS.setmousedown()
CVS.setmouseup()



CVS.startLoop()