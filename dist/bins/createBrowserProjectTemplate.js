#!/usr/bin/env node
import {mkdirSync, copyFileSync, writeFileSync} from "fs"
import {join, dirname} from "path"
import {fileURLToPath} from "url"
import {createInterface} from "readline"
import {exec} from "child_process"

const destination = join(process.cwd(), process.argv[2]||""), libPath = join(dirname(fileURLToPath(import.meta.url)), "../canvasDotEffect.min.js")
mkdirSync(destination, {recursive:true})

// Add canvasDotEffect.min.js
copyFileSync(libPath, join(destination, "canvasDotEffect.min.js"))

// Add index.html
writeFileSync(join(destination, "index.html"), `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Template</title>
    <link rel="stylesheet" href="index.css">
</head>
<body>
    
    <div class="canvasHolder">
        <canvas id="canvasId"></canvas>
    </div>

    <div class="debug">
        <span id="fpsDisplay"></span>
        <span id="mouseInfo"></span>
        <span id="mouseSpeed"></span>
        <span id="mouseAngle"></span>
    </div>
    
    <script async src="canvasDotEffect.min.js"></script>
    <script async src="index.js"></script>
</body>
</html>`)

// Add index.css
writeFileSync(join(destination, "index.css"), `html, body {
    background-color: black;
    overflow: hidden;
    color: aliceblue;
    margin: 0;
    width: 100%;
    height: 100%;
}

.canvasHolder {
    width: 98%;
    height: 88%;
    border: 2px solid aliceblue;
    user-select: none;
}`)

// Add index.js
writeFileSync(join(destination, "index.js"), `const {CDEUtils,FPSCounter,CanvasUtils,Color,_HasColor,GridAssets,TypingDevice,Mouse,Render,TextStyles,RenderStyles,Canvas,Anim,_BaseObj,AudioDisplay,ImageDisplay,TextDisplay,_DynamicColor,Pattern,_Obj,Shape,Gradient,FilledShape,Grid,Dot} = CDE

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

// TODO

// Event listeners
CVS.setMouseMove()
CVS.setMouseLeave()
CVS.setMouseDown()
CVS.setMouseUp()
CVS.setKeyDown(_, true)
CVS.setKeyUp(_, true)

// Start drawing loop
CVS.startLoop()`)


console.log("\nCDEJS browser project template successfully created at '"+destination+"'!\n")

const cli = createInterface({input:process.stdin, output:process.stdout})
cli.question("Open in explorer? (Y/N)   ", value=>{
    if (!value || ["y", "yes", "ye", "ok", "for sure"].includes(value?.toLowerCase()?.trim())) exec("explorer "+destination)
    cli.close()
})

process.stdin.on("keypress", (_, key) => {
    if (key.name == "escape") cli.close()
})