#!/usr/bin/env node
import {exec} from "child_process"
import {join} from "path"
import {createInterface} from "readline"


const destination = process.cwd()

// Create CDECanvas.jsx
writeFileSync(join(destination, "CDECanvas.jsx"), `import {forwardRef, useEffect, useImperativeHandle, useRef} from "react"
import {Canvas, CDEUtils} from "cdejs"

/**
 * HOW TO USE:
 * 
 * 1. Add the <CDECanvas/> component at the root of your target element.
 * 2. If necessary, create a ref and link it to your <CDECanvas ref={*yourRef*}/> component to access some utility functions of the canvas. (See the imperativeHandle bellow)
 * 3. Create your declarations and interactions and build cool effects!
 * 
 * PARAMETERS:
 * - declarations -> A callback containing the setup/declaration of all canvas obj and if applicable, adding them to the canvas. (CVS)=>{...}
 * - interactions -> A callback containing the desired built-in input device listeners. (CVS)=>{...}
 * - isStatic -> If true, initializes the canvas as static.
 * - loopingCB, fpsLimit, visibilityChangeCB, cvsFrame, settings, willReadFrequently -> see https://github.com/Louis-CharlesBiron/canvasDotEffect?#canvas
 */
export const CDECanvas = forwardRef(({declarations, interactions, isStatic, loopingCB, fpsLimit, visibilityChangeCB, cvsFrame, settings, willReadFrequently}, ref)=>{
    const htmlElementCanvasRef = useRef(null), cvsInstanceRef = useRef(null)

    // Utility canvas functions
    useImperativeHandle(ref, ()=>({
        getCVS:()=>cvsInstanceRef.current,
        adjustSize:()=>cvsInstanceRef.current.setSize()
    }))

    useEffect(()=>{
        const CVS = new Canvas(htmlElementCanvasRef.current, loopingCB, fpsLimit, visibilityChangeCB, cvsFrame, settings, willReadFrequently)
        cvsInstanceRef.current = CVS

        // Setup canvas objects and listeners
        if (CDEUtils.isFunction(declarations)) declarations(CVS)
        if (CDEUtils.isFunction(interactions)) interactions(CVS)
        
        // Start
        if (isStatic) CVS.initializeStatic()
        else CVS.startLoop()

        // On unmount
        return ()=>CVS.stopLoop()
    }, [])

    return <canvas ref={htmlElementCanvasRef}></canvas>
})`)


console.log("\nDefault CDECanvas React component successfully created at '"+join(destination, "CDECanvas.jsx")+"'!\n")

const cli = createInterface({input:process.stdin, output:process.stdout})
function close(cli) {
    cli.close()
    console.log("")
}

cli.question("Open in explorer? (Y/N)\n", value=>{
    if (!value || ["y", "yes", "ye", "ok", "for sure"].includes(value?.toLowerCase()?.trim())) exec("explorer "+destination)
    close(cli)
})

process.stdin.on("keypress", (_, key) => {
    if (key.name == "escape") close(cli)
})