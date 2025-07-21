const _ = null, fpsCounter = new FPSCounter(), CVS = new Canvas(canvas, ()=>{
        const fpsValue = fpsCounter.getFps()+" "+fpsCounter.fpsRaw
        if (fpsDisplay.textContent !== fpsValue) fpsDisplay.textContent = fpsValue
        mouseSpeed.textContent = CVS.mouse.speed?.toFixed(2)+" px/sec"
        mouseAngle.textContent = CVS.mouse.dir?.toFixed(2)+" deg"
    }
)

CVS.add(new TextDisplay("Create some stuff!", CVS.getCenter()))



// Event listeners
debugPlay.onclick=()=>CVS.start()
debugStop.onclick=()=>{
    CVS.stop()
    setTimeout(()=>fpsDisplay.textContent = 0, 50)
}

let mouseMoveEvent=(mouse)=>mouseInfo.textContent = "("+mouse.x+", "+mouse.y+")" // debug info
CVS.setMouseMove(mouseMoveEvent)
CVS.setMouseLeave(mouseMoveEvent)
CVS.setMouseDown()
CVS.setMouseUp()
CVS.setKeyDown(_, true)
CVS.setKeyUp(_, true)

// Start drawing loop
CVS.start()