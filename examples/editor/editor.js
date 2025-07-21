"use strict"
const _ = null, fpsCounter = new FPSCounter(), CVS = new Canvas(canvas, ()=>{
        const fpsValue = fpsCounter.getFps()+" "+fpsCounter.fpsRaw
        if (fpsDisplay.textContent !== fpsValue) fpsDisplay.textContent = fpsValue
        mouseSpeed.textContent = CVS.mouse.speed?.toFixed(2)+" px/sec"
        mouseAngle.textContent = CVS.mouse.dir?.toFixed(2)+" deg"
    }
)

CVS.add(new TextDisplay("Create some stuff!", CVS.getCenter(), null, null, null, null, ()=>console.log("test")))
CVS.add(new TextDisplay(":)", CDEUtils.addPos(CVS.getCenter(), [0, 50])))



debugPlay.onclick=()=>CVS.start()
debugStop.onclick=()=>{
    CVS.stop()
    setTimeout(()=>fpsDisplay.textContent = 0, 50)
}

let mouseMoveEvent=(mouse)=>mouseInfo.textContent = "("+mouse.x+", "+mouse.y+")"
CVS.setMouseMove(mouseMoveEvent)
CVS.setMouseLeave(mouseMoveEvent)
CVS.setMouseDown((mouse)=>{
    if (mouseAction == MOUSE_ACTIONS.DOT_PLACER) {
        CVS.add(new Dot(mouse.pos))
        updateAllEls()
    }
})
CVS.setMouseUp()
CVS.setKeyDown()
CVS.setKeyUp()

CVS.start()






/**
 * BUTTONS BINDINGS
*/
const MOUSE_ACTIONS = {OBJECT_SELECTOR:0, DOT_PLACER:1, OBJECT_REMOVER:2}


// MANAGEMENT //
m_addObj.onclick=()=>{

}

m_removeAll.onclick=()=>CVS.removeAllObjects()


// QUERY //
let selectedObj = null, mouseAction = MOUSE_ACTIONS.OBJECT_SELECTOR

const createOption = (text, id)=>`<option value="${id}">${text}</option>`

function updateAllEls(noHTML) {
    const els = CVS.allEls, e_ll = els.length
    
    if (!noHTML) {
        const options = els.map(obj=>createOption(obj.instanceOf+" #"+obj.id, obj.id)).join("")
        q_allEls.innerHTML = options
    }

    CVS.mouse.removeAllListeners()
    for (let i=0;i<e_ll;i++) {
        if (mouseAction == MOUSE_ACTIONS.OBJECT_SELECTOR) {
            CVS.mouse.addListener(els[i], Mouse.LISTENER_TYPES.CLICK, (mousePos, obj)=>updateSelectedObj(obj))
            CVS.mouse.addListener(els[i], Mouse.LISTENER_TYPES.ENTER, (mousePos, obj)=>{
                obj.loopCB=()=>{CanvasUtils.drawOutline(CVS.render, obj, [50, 255, 100, 0.65])}
            })
            CVS.mouse.addListener(els[i], Mouse.LISTENER_TYPES.EXIT, (mousePos, obj)=>{
                obj.loopCB=null
            })            
        } 
        else if (mouseAction == MOUSE_ACTIONS.OBJECT_REMOVER) {
            CVS.mouse.addListener(els[i], Mouse.LISTENER_TYPES.CLICK, (mousePos, obj)=>deleteObj(obj))
            CVS.mouse.addListener(els[i], Mouse.LISTENER_TYPES.ENTER, (mousePos, obj)=>{
                obj.loopCB=()=>{CanvasUtils.drawOutline(CVS.render, obj, [255, 50, 50, 0.65])}
            })
            CVS.mouse.addListener(els[i], Mouse.LISTENER_TYPES.EXIT, (mousePos, obj)=>{
                obj.loopCB=null
            })    
        }

    }
}

function updateQueryInputs(isInit, fromObject) {
    if (fromObject) q_allEls.selectedIndex = CVS.allEls.findIndex(obj=>obj.id==fromObject.id)
    q_selected.textContent = `Selected object: ${q_allEls.selectedOptions[0]?.textContent||"None"}`
    q_id.value = +q_allEls.value??""
    if (!fromObject) updateSelectedObj(CVS.get(isInit ? 0 : +q_allEls.options[q_allEls.selectedIndex]?.value))
}

// init inputs
updateAllEls()
updateQueryInputs(true)


// obj select query
q_allEls.oninput=()=>{
    updateQueryInputs()
}

// obj id query
q_id.oninput=()=>{
    const obj = CVS.get(q_id.value)
    if (obj) {
        const id = obj.id
        q_allEls.selectedIndex = CVS.allEls.findIndex(obj=>obj.id==id)
        q_selected.textContent = `Selected object: ${obj.instanceOf+" #"+id}`
        updateSelectedObj(obj)
    }
}

// EDITOR //
function updateSelectedObj(obj) {
    selectedObj = obj
    if (obj) {
        updateQueryInputs(false, obj)

        e_posX.value = obj.x
        e_posY.value = obj.y
        e_color.value = e_colorPicker.value = Color.convertTo(obj.rgba, Color.CONVERTABLE_FORMATS.HEX)
        e_setupCB.value = obj.setupCB||""
        e_loopCB.value = obj.loopCB||""
        e_anchorPosX.value = obj.anchorPos[0]
        e_anchorPosY.value = obj.anchorPos[1]
        e_activeMargin.value = obj.activationMargin
    }
}

function deleteObj(obj) {
    obj.remove()
    updateAllEls()
    updateQueryInputs()
}

// obj delete
e_remove.onclick=()=>deleteObj()

// obj pos
e_posX.oninput=(e)=>{
    if (selectedObj) selectedObj.x = +e_posX.value
}
e_posY.oninput=()=>{
    if (selectedObj) selectedObj.y = +e_posY.value
}

// obj color
e_colorPicker.oninput=()=>{
    if (selectedObj) {
        selectedObj.color = e_colorPicker.value
        e_color.value = e_colorPicker.value
    }
}
e_color.oninput=()=>{
    const v = e_color.value, formatValid = Color.getFormat(v)
    if (selectedObj && formatValid) {
        selectedObj.color = v
        e_colorPicker.value = Color.convertTo(v, Color.CONVERTABLE_FORMATS.HEX)
    }
}

// setup/loop CB
e_setupCB.onchange=()=>{
    if (selectedObj) {
        
    }
}
e_loopCB.onchange=()=>{

}

// obj anchor pos
e_anchorPosX.oninput=(e)=>{
    if (selectedObj) selectedObj.anchorPos = [+e_anchorPosX.value, selectedObj.anchorPos[1]]
}
e_anchorPosY.oninput=()=>{
    if (selectedObj) selectedObj.anchorPos = [selectedObj.anchorPos[0], +e_anchorPosY.value]
}

// obj activation margin
e_activeMargin.oninput=()=>{
    if (selectedObj) selectedObj.activationMargin = +e_activeMargin.value
}


// DOT radius
e_radius.oninput=()=>{
    if (selectedObj) selectedObj.radius = +e_radius.value
}



// MOUSE ACTIONS
p_selectObj.oninput=()=>{
    mouseAction = MOUSE_ACTIONS.OBJECT_SELECTOR
    updateAllEls(true)
}
p_removeDot.oninput=()=>{
    mouseAction = MOUSE_ACTIONS.OBJECT_REMOVER
    updateAllEls(true)
}
p_placeDot.oninput=()=>{
    mouseAction = MOUSE_ACTIONS.DOT_PLACER
    CVS.mouse.removeAllListeners()
}