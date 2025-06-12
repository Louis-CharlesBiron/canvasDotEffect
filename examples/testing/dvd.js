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

    // IDK LOL
    textDisplay.loopCB=()=>CanvasUtils.drawOutline(CVS.render, textDisplay)
    textDisplay.setupResults.loopCB=()=>CanvasUtils.drawOutline(CVS.render, textDisplay.setupResults)
   
    // Returning the button and text objects
    return [textDisplay.setupResults, textDisplay]
}
 
const [aaa, bbb] = createButton("My custom button", CVS.getCenter(), (button, text)=>{// onClick
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

const tester = new FilledShape("red", true, CVS.getCenter(), [new Dot([-sizeX,-sizeY]),new Dot([sizeX,-sizeY]),new Dot([sizeX,sizeY]),new Dot([-sizeX,sizeY])], 3, _, _, _, _, obj=>{// setupCB
    obj.playAnim(new Anim((prog, i)=>{
        obj.rotateAt(prog*360*4)
        obj.fillColorObject.rgba[i%3] = prog*255
    }, -3500, Anim.easeInOutBounce))

    obj.playAnim(new Anim((prog, i)=>obj.scaleAt([(i%2?prog:(1-prog))*4, (i%2?prog:(1-prog))*2]), -2500))


    return {area:[[0,0],CVS.size], dir:0}
}, (obj, deltaTime)=>{// loopCB
    const [ix, iy] = obj.pos, speed = 700, [cornerTL, cornerBR] = obj.getBounds([0,0,0,0]), res = obj.setupResults, {area:[areaMin, areaMax]} = res, 
          d = speed*deltaTime

    CanvasUtils.drawOutline(CVS.render, obj)
    
    if      (((cornerTL[0] <= areaMin[0]) || (cornerBR[0] <= areaMin[0])) && (res.dir==2||res.dir==3)) res.dir = res.dir==3?0:1 //left
    else if (((cornerTL[1] <= areaMin[1]) || (cornerBR[1] <= areaMin[1])) && (res.dir==1||res.dir==2)) res.dir = res.dir==1?0:3 //top
    else if (((cornerBR[0] >= areaMax[0]) || (cornerTL[0] >= areaMax[0])) && (res.dir==0||res.dir==1)) res.dir = res.dir==0?3:2 //right
    else if (((cornerBR[1] >= areaMax[1]) || (cornerTL[1] >= areaMax[1])) && (res.dir==0||res.dir==3)) res.dir = res.dir==0?1:2 //bottom

    if      (res.dir==0) obj.pos = [ix+d, iy+d]//(→↓)
    else if (res.dir==1) obj.pos = [ix+d, iy-d]//(→↑)
    else if (res.dir==2) obj.pos = [ix-d, iy-d]//(←↑)
    else if (res.dir==3) obj.pos = [ix-d, iy+d]//(←↓)
}, _, true)
CVS.add(tester)






function DvDfy(TARGET) {
    TARGET.setupCB = obj=>{// setupCB
        const modifier = CDEUtils.random(0,1) ? -1 : 1
        setTimeout(()=>obj.playAnim(new Anim(prog=>obj.rotateAt(prog*360*modifier), -10000, CDEUtils.random(0,1)?Anim.easeInOutBounce:Anim.easeInOutSine)), -CDEUtils.random(500,1500))
        obj.playAnim(new Anim((prog, i)=>{
            obj.scaleAt([(i%2?prog:(1-prog)), (i%2?prog:(1-prog))*2])
            if (obj.fillColorObject) obj.fillColorObject.rgba[i%3] = prog*255
            if (obj.colorObject) obj.colorObject.rgba[i%3] = prog*255
        }, -CDEUtils.random(1000,3000)))
        return {area:[[0,0],CVS.size], dir:0}
    }
    TARGET.loopCB = (obj, deltaTime)=>{// loopCB
        const [ix, iy] = obj.pos, speed = 500, [cornerTL, cornerBR] = obj.getBounds([0,0,0,0]), res = obj.setupResults, {area:[areaMin, areaMax]} = res, 
            d = speed*deltaTime

        CanvasUtils.drawOutline(CVS.render, obj)
        
        if      (((cornerTL[0] <= areaMin[0]) || (cornerBR[0] <= areaMin[0])) && (res.dir==2||res.dir==3)) res.dir = res.dir==3?0:1 //left
        else if (((cornerTL[1] <= areaMin[1]) || (cornerBR[1] <= areaMin[1])) && (res.dir==1||res.dir==2)) res.dir = res.dir==1?0:3 //top
        else if (((cornerBR[0] >= areaMax[0]) || (cornerTL[0] >= areaMax[0])) && (res.dir==0||res.dir==1)) res.dir = res.dir==0?3:2 //right
        else if (((cornerBR[1] >= areaMax[1]) || (cornerTL[1] >= areaMax[1])) && (res.dir==0||res.dir==3)) res.dir = res.dir==0?1:2 //bottom

        if      (res.dir==0) obj.pos = [ix+d, iy+d] //(→↓)
        else if (res.dir==1) obj.pos = [ix+d, iy-d] //(→↑)
        else if (res.dir==2) obj.pos = [ix-d, iy-d] //(←↑)
        else if (res.dir==3) obj.pos = [ix-d, iy+d] //(←↓)
    }
    TARGET.activationMargin = true
    CVS.add(TARGET)
}


const YO = new TextDisplay("DVD test\n1 :) 1\n2 (: 2\nDVD test", CVS.getResponsivePos([0.5, 0.5]), _, r=>new TextStyles(r))
const YO2 = new ImageDisplay("./img/img2.jpg", CVS.getResponsivePos([0.25, 0.25]), [200, 100]);YO2.opacity = 0.5
const YO3 = new Dot(CVS.getResponsivePos([0.75, 0.75]), 25)
const YO4 = new FilledShape([0,255,0,0.5], true, CVS.getCenter(), [new Dot([0,0]),new Dot([100,-50]),new Dot([300,50]),new Dot([100,80]),new Dot([270,-90]),new Dot([-70,-90]),new Dot([-150,190])], 3, [0,255,0,0.75])
const YO5 = new AudioDisplay("./img/song.mp3", CVS.getResponsivePos([0.25, 0.25]), "lime", AudioDisplay.BARS(190, 10, 5, 2, true), 32, true) 
const YO6 = new Grid("HELLO WORLD Grid!!\n        101", [5, 5], 50, _, [10,200], 0, _, _, (render, dot, ratio)=>CanvasUtils.drawDotConnections(dot, render.profile1.update([255,0,255,1],_,_,_,5)))

DvDfy(YO)
DvDfy(YO2)
DvDfy(YO3)
DvDfy(YO4)
DvDfy(YO5)
DvDfy(YO6)





// USER ACTIONS
const mMove=m=>mouseInfo.textContent = "("+m.x+", "+m.y+")"
CVS.setMouseMove(mMove)
CVS.setMouseLeave(mMove)
CVS.setMouseDown()
CVS.setMouseUp()
CVS.setKeyDown()
CVS.setKeyUp()

// START
CVS.start()