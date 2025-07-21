#!/usr/bin/env node
import {mkdirSync, copyFileSync, writeFileSync} from "fs"
import {join, dirname} from "path"
import {fileURLToPath} from "url"
import {createInterface} from "readline"
import {exec} from "child_process"

const destination = join(process.cwd(), process.argv[2]||""),
      mediaDest = join(destination, "medias"),
      libPath = join(dirname(fileURLToPath(import.meta.url)), "../canvasDotEffect.min.js")

// Create folders
try {
    mkdirSync(destination, {recursive:true})
    mkdirSync(mediaDest)
} catch {}

// Create canvasDotEffect.min.js
copyFileSync(libPath, join(destination, "canvasDotEffect.min.js"))

// Create index.html
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
    
    <script src="canvasDotEffect.min.js"></script>
    <script async src="index.js"></script>
</body>
</html>`)

// Create index.css
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

// Create index.js
writeFileSync(join(destination, "index.js"), `const {CDEUtils,FPSCounter,CanvasUtils,Color,Render,TextStyles,RenderStyles,Canvas,Anim,AudioDisplay,ImageDisplay,TextDisplay,Pattern,Shape,Gradient,FilledShape,Grid,Dot} = CDE

const _ = null, fpsCounter = new FPSCounter(), CVS = new Canvas(document.getElementById("canvasId"), 
    ()=>{// loopingCB

        // Debug infos
        const fpsValue = fpsCounter.getFps()+" "+fpsCounter.fpsRaw
        if (fpsDisplay.textContent !== fpsValue) fpsDisplay.textContent = fpsValue
        mouseSpeed.textContent = CVS.mouse.speed?.toFixed(2)+" px/sec"
        mouseAngle.textContent = CVS.mouse.dir?.toFixed(2)+" deg"
    }
)

// Canvas objects declarations 
const demoShape = new Shape(CVS.getCenter(), [new Dot([-50, -50]),new Dot([-50, 0]),new Dot([-50, 50]),new Dot([0, -50]),new Dot([0, 50]),new Dot([50, -50]),new Dot([50, 0]),new Dot([50, 50])], _, _, 100,
    (render, dot, ratio)=>{// drawEffectCB
    
        // Changing the dot's radius from 50px down to 80% of 50px (range of 50px..10px), according to the mouse distance
        dot.radius = CDEUtils.mod(50, ratio, 50*0.8)
        
        // Drawing a ring around the dot
        CanvasUtils.drawOuterRing(dot, [255,255,255,0.25], 1)

    }, _, (shape)=>{// setupCB

    // Adding a rotation and scale animation
    shape.playAnim(new Anim((prog, i)=>{
        const adjustedProgress = i%2 ? prog : 1-prog
        
        shape.rotateAt(360*prog)
        shape.scaleAt([1+adjustedProgress*2, 1+adjustedProgress*2])
    }, -7500, Anim.easeInOutQuad))

    // Creating a pattern that will get duplicated for each dot of demoShape ((↓) set the "positions" parameter to the area containing all the dots)
    new Pattern(CVS.render, "./medias/coolBackground.mp4", demoShape.getBounds(50, 0, [3, 3]), _, true, true, _, 
        ()=>{// errorCB
            // If there is an error loading the file, set color to grey
            demoShape.setColor([255,255,255,0.25])
        },
        (pattern)=>{// readyCB
            // Once the video is loaded, set the shape2's color to the value of the pattern
            demoShape.setColor(pattern)
            
            // Speed up the video to 3x speed
            pattern.playbackRate = 3
        }
    )
 })

CVS.add(demoShape)


// Event listeners
let mouseMoveEvent=(mouse)=>mouseInfo.textContent = "("+mouse.x+", "+mouse.y+")" // debug info
CVS.setMouseMove(mouseMoveEvent)
CVS.setMouseLeave(mouseMoveEvent)
CVS.setMouseDown()
CVS.setMouseUp()
CVS.setKeyDown(_, true)
CVS.setKeyUp(_, true)

// Start drawing loop
CVS.start()`)

// Create coolBackground.mp4
fetch("https://file-examples.com/storage/fe9a194958686838db9645f/2017/04/file_example_MP4_480_1_5MG.mp4").then(res=>res.ok&&res.arrayBuffer()).then(buffer=>buffer&&writeFileSync(join(mediaDest, "coolBackground.mp4"), Buffer.from(buffer)))


console.log("CDEJS browser project template successfully created at '"+destination+"'!\n")

const cli = createInterface({input:process.stdin, output:process.stdout})
function close(cli) {
    cli.close()
    console.log("")
}

cli.question("Open in explorer [Y/N]?  ", value=>{
    const v = value?.toLowerCase()?.trim()
    if (v=="code") exec("code --new-window "+destination)
    else if (!v || ["y", "yes", "ye", "ok", "for sure"].includes(v)) exec("explorer "+destination)
    close(cli)
})

process.stdin.on("keypress", (_, key) => {
    if (key.name == "escape") close(cli)
})