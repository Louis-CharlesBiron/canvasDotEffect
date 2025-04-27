import {Canvas, FPSCounter, TextDisplay, Pattern, Anim} from "cdejs"

const _ = null, fpsCounter = new FPSCounter(), CVS = new Canvas(document.getElementById("canvasId"), 
    ()=>{// loopingCB

        // Debug infos
        const fpsValue = fpsCounter.getFps()+"\n"+fpsCounter.fpsRaw
        if (fpsDisplay.textContent !== fpsValue) fpsDisplay.textContent = fpsValue
        mouseSpeed.textContent = CVS.mouse.speed?.toFixed(2)+" px/sec"
        mouseAngle.textContent = CVS.mouse.dir?.toFixed(2)+" deg"
    }
)

// Canvas objects declarations 
const helloWorldText = new TextDisplay(
    "Hello World!",
    CVS.getCenter(),
    (render, obj)=>new Pattern(render, "./medias/helloWorldBackground.mp4", obj, _, true, true),
    (render)=>render.textProfile1.update("italic bold 64px monospace"),
    _, _,
    (obj)=>obj.playAnim(new Anim(prog=>obj.scale = [Math.sin(Math.PI*prog*2), 1],-5000))
)

CVS.add(helloWorldText)

// Event listeners
CVS.setMouseMove()
CVS.setMouseLeave()
CVS.setMouseDown()
CVS.setMouseUp()
CVS.setKeyDown(_, true)
CVS.setKeyUp(_, true)

// Start drawing loop
CVS.startLoop()