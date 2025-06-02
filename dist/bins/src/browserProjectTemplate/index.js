const {CDEUtils,FPSCounter,CanvasUtils,Color,_HasColor,GridAssets,TypingDevice,Mouse,Render,TextStyles,RenderStyles,Canvas,Anim,_BaseObj,AudioDisplay,ImageDisplay,TextDisplay,_DynamicColor,Pattern,_Obj,Shape,Gradient,FilledShape,Grid,Dot} = CDE

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

/*
     TODO

    - minimize the npx command files (in wrapper.exe)
    - add npx command cdejs-browser-template
    - add more npx command shortcuts, cdejs-t1, cdejs-t2, etc...

    - simple demo obj in this file

    - figure out how to dynamically integrate medias (maybe)

    - update documentation
*/


// Event listeners
CVS.setMouseMove()
CVS.setMouseLeave()
CVS.setMouseDown()
CVS.setMouseUp()
CVS.setKeyDown(_, true)
CVS.setKeyUp(_, true)

// Start drawing loop
CVS.startLoop()