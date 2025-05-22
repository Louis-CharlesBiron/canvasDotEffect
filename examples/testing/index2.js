const fpsCounter = new FPSCounter(), CVS = new Canvas(canvas, ()=>{//looping
    let fps = fpsCounter.getFps()+"\n"+fpsCounter.fpsRaw
    if (fpsDisplay.textContent !== fps) fpsDisplay.textContent = fps
    mouseSpeed.textContent = CVS?.mouse?.speed?.toFixed(2)+" px/sec"
    mouseAngle.textContent = CVS?.mouse?.dir?.toFixed(2)+" deg"
}, null)

// DECLARE OBJS

const _ = null


// TODO LINK CLASS
function createButton(text="Test yo man big button", pos=[500, 100], onClickCallback, fillColor="aliceblue", textColor="red", padding=[20, 30]) {

    // Creating the button's text
    const textDisplay = new TextDisplay(text, [0,0], textColor, _, _, _, (self)=>{// setupCB
        // Creating and adding to the canvas the button's box/background according to the text's size
        const [width, height] = self.trueSize, w = width/2+padding[1]/2, h = height/2+padding[0]/2,
              button = CVS.add(new FilledShape(fillColor, true, pos, [new Dot([-w,-h]),new Dot([w,-h]),new Dot([w,h]),new Dot([-w,h])], 0, fillColor, _, _, _, _, _, _, true))


        // Button visual changes
        const opacity = {default:1, hover: 0.75, click:0.5},
        hoverHandler=(hover)=>{
            // Updating the button's opacity and cursor style when mouse is
            button.fillColorObject.a = hover ? opacity.hover : opacity.default
            CVS.setCursorStyle(hover ? Canvas.CURSOR_STYLES.POINTER : Canvas.CURSOR_STYLES.DEFAULT)
        },
        clickHandler=(click)=>{
            // Updating the button's opacity and calling the custom click callback
            button.fillColorObject.a = click ? opacity.click : opacity.hover
            if (click && CDEUtils.isFunction(onClickCallback)) onClickCallback(button, self)
        }

        // Button listeners
        CVS.mouse.addListener(button, Mouse.LISTENER_TYPES.DOWN, ()=>clickHandler(true))
        CVS.mouse.addListener(button, Mouse.LISTENER_TYPES.UP, ()=>clickHandler(false))
        CVS.mouse.addListener(button, Mouse.LISTENER_TYPES.ENTER, ()=>hoverHandler(true))
        CVS.mouse.addListener(button, Mouse.LISTENER_TYPES.LEAVE, ()=>hoverHandler(false))

        // making the button available in the text's setupResults
        return button
    }, _, self=>self.setupResults)
    
    // Adding the text to the canvas
    CVS.add(textDisplay)
   
    // Returning the button and text objects
    return [textDisplay.setupResults, textDisplay]
}
 
createButton("My custom button", CVS.getCenter(), (button, text)=>{// onClick

    // Playing a rotation animation
    button.playAnim(new Anim((prog)=>{
        button.rotateAt(360*prog)
        text.rotateAt(360*prog)
    }, 5000, _, ()=>{// anim's endCallback
        
        // enabling back the listeners optimization
        CVS.mouseMoveListenersOptimizationEnabled=true
    }), true, true)

    
    // disabling the listeners optimization, this makes the mouse enter/exit event accurate when the object is moving
    CVS.mouseMoveListenersOptimizationEnabled=false
    console.log("Custom button clicked!")
})


// todo possibly optimize / abstract
const sizeX = 25, sizeY = 50

const tester = new FilledShape("red", true, CVS.getCenter(), [new Dot([-sizeX,-sizeY]),new Dot([sizeX,-sizeY]),new Dot([sizeX,sizeY]),new Dot([-sizeX,sizeY])], 3, _, _, _, _, shape=>{// setupCB

    tester.playAnim(new Anim((prog, i)=>{
        if (i%2) tester.scaleAt([3*prog, 3*prog])
        else tester.scaleAt([3*(1-prog), 3*(1-prog)])
        tester.fillColorObject.rgba[i%3] = prog*255
    }, -750, Anim.easeInOutQuad))

    tester.playAnim(new Anim((prog)=>{
        tester.rotateAt(prog*360)
    }, -3500, Anim.easeInOutSine))

    return {area:[[0,0],CVS.size], dir:0}
}, (shape, deltaTime)=>{// loopCB
    const [ix, iy] = shape.pos, speed = 500, [boundsX, boundsY] = shape.getBounds(), res = shape.setupResults, {area:[areaMin, areaMax]} = res
    
    if (boundsX[0] <= areaMin[0] && (res.dir==2||res.dir==3)) res.dir = res.dir==3?0:1 //left
    else if (boundsY[0] <= areaMin[1] && (res.dir==1||res.dir==2)) res.dir = res.dir==1?0:3 //top
    else if (boundsX[1] >= areaMax[0] && (res.dir==0||res.dir==1)) res.dir = res.dir==0?3:2 //right
    else if (boundsY[1] >= areaMax[1] && (res.dir==0||res.dir==3)) res.dir = res.dir==0?1:2 //bottom

    if (res.dir==0) shape.pos = [ix+speed*deltaTime, iy+speed*deltaTime]//(→↓)
    else if (res.dir==1) shape.pos = [ix+speed*deltaTime, iy-speed*deltaTime]//(→↑)
    else if (res.dir==2) shape.pos = [ix-speed*deltaTime, iy-speed*deltaTime]//(←↑)
    else if (res.dir==3) shape.pos = [ix-speed*deltaTime, iy+speed*deltaTime]//(←↓)
}, _, true)
CVS.add(tester)








// USER ACTIONS
const mMove=m=>mouseInfo.textContent = "("+m.x+", "+m.y+")"
CVS.setMouseMove(mMove)
CVS.setMouseLeave(mMove)
CVS.setMouseDown()
CVS.setMouseUp()
CVS.setKeyDown()
CVS.setKeyUp()

// START
CVS.startLoop()