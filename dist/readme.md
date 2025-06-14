[![GitHub commit activity](https://img.shields.io/github/commit-activity/m/Louis-CharlesBiron/canvasDotEffect?link=https%3A%2F%2Fgithub.com%2FLouis-CharlesBiron%2FcanvasDotEffect%2Fcommits%2Fmain%2F&label=Commit%20Activity)](https://github.com/Louis-CharlesBiron/canvasDotEffect/commits/main/)
[![GitHub last commit](https://img.shields.io/github/last-commit/Louis-CharlesBiron/canvasDotEffect?link=https%3A%2F%2Fgithub.com%2FLouis-CharlesBiron%2FcanvasDotEffect%2Fcommits%2Fmain%2F&label=Last%20Commit)](https://github.com/Louis-CharlesBiron/canvasDotEffect/commits/main/)
[![NPM Version](https://img.shields.io/npm/v/cdejs?label=Version&color=%237761c0)](https://www.npmjs.com/package/cdejs)
[![NPM Downloads](https://img.shields.io/npm/d18m/cdejs?label=NPM%20Downloads&color=%231cc959)](https://www.npmjs.com/package/cdejs)
![GitHub Created At](https://img.shields.io/github/created-at/Louis-CharlesBiron/canvasDotEffect?label=Since&color=orange)
![NPM License](https://img.shields.io/npm/l/cdejs?label=License&color=cadetblue)

# CanvasDotEffect

**CanvasDotEffect is a lightweight, fully native, JS library that helps create customizable and interactive dot-based effects using the Canvas API.**

# Table of Contents

- [Getting Started / Minimal setup](#getting-started--minimal-setup)
- [Classes](#class-descriptions)
  - [Canvas](#canvas)
  - [_Obj](#_obj)
  - [Dot](#dot)
  - [Shape](#shape)
  - [Filled Shape](#filled-shape)
  - [Grid](#grid)
    - [Grid Assets](#grid-assets)
  - [TextDisplay](#textdisplay)
  - [ImageDisplay](#imagedisplay)
  - [AudioDisplay](#audiodisplay)
  - [Color](#color)
  - [Gradient](#gradient)
  - [Pattern](#pattern)
  - [Render](#render)
  - [TextStyles](#textStyles)
  - [RenderStyles](#renderstyles)
  - [Anim](#anim)
  - [Input Devices](#input-devices)
    - [TypingDevice](#typingdevice)
    - [Mouse](#mouse)
  - [Utilities](#utilities)
    - [CanvasUtils](#canvasutils)
    - [CDEUtils](#cdeutils)
    - [FPSCounter](#fpscounter)
- [Npx commands](#npx-commands)
- [React component template](#react-component-template)
- [Execution order](#execution-order)
- [Optimization](#optimization)
- [Intended practices](#intended-practices)
- [Credits](#credits)



## Getting Started / Minimal setup


#### Either run: `npx cdejs template yourProjectName` or follow these couple steps! (↓)
1. **Get the library file. (`npm install cdejs` or [canvasDotEffect.min.js](https://github.com/Louis-CharlesBiron/canvasDotEffect/blob/main/dist/canvasDotEffect.min.js))** 
```HTML
    <!-- Only if you're using the browser version! Otherwise use: import {...} from "cdejs" -->
    <script src="canvasDotEffect.min.js"></script>
```

2. **In your HTML file, place a canvas element. The canvas will later automatically take the size of its parent element**.
```HTML
    <div class="canvasHolder">
        <canvas id="canvasId"></canvas>
    </div>
```

3. **In a JS file, create a new Canvas instance with the HTML canvas element in parameter.**
```js
    const CVS = new Canvas(document.getElementById("canvasId"))
```

4. **From this Canvas instance, add any canvas objects you want.**
```js
    // Create a canvas object
    const dummyShape = new Shape([50, 50], [new Dot()])
    
    // Add it to the canvas
    CVS.add(dummyShape)
```

5. **Set the mouse event listeners for mouse interactions.**
```js
    // Set up the prebuilt event listeners, allowing the creation of more interactive effects!
    CVS.setMouseMove(/*custom callback*/)
    CVS.setMouseLeave()
    CVS.setMouseDown()
    CVS.setMouseUp()
```

6. **Once everything is created and ready to go, start the drawing loop!**
```js
    // Start
    CVS.start()
```

**- In the end, you should have something like this:**
```js
    const CVS = new Canvas(document.getElementById("canvasId"))
    
    // Creating and adding shapes ...
    const dummyShape = new Shape([50, 50], [new Dot()])
    CVS.add(dummyShape)
    
    CVS.setMouseMove()
    CVS.setMouseLeave()
    CVS.setMouseDown()
    CVS.setMouseUp()
    
    CVS.start()
```

**Note:** if you are using de [NPM](https://www.npmjs.com/package/cdejs) version of this librairy, using [Vite](https://vite.dev/) or any other bundler is recommended.
###### - Minimal example package.json
```json
{
  "name": "my_project",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "cdejs": "^1.1.5"
  },
  "devDependencies": {
    "vite": "^6.2.2"
  }
}
```


# [Class descriptions](#table-of-contents)
The following sections are short documentations of each class, basically what it does and what are the most important aspects of it.

 

# [Canvas](#table-of-contents)

The Canvas class is the core of the project. It manages the main loop, the window listeners, the delta time, the HTML canvas element, all the canvas objects, and much more.
#### **The Canvas constructor takes the following parameters:**
###### - `new Canvas(cvs, loopingCB, fpsLimit, visibilityChangeCB, cvsFrame, settings, willReadFrequently)`
- *id* -> The identifier of the canvas instance.
- **cvs** -> The HTML canvas element to link to.
- **loopingCB**? -> A callback ran each frame. `(Canvas)=>`
- **fpsLimit**? -> The maximum fps cap. Defaults and caps to V-Sync.
- **visibilityChangeCB**? -> A callback called on document visibility change. `(isVisible, cvs, event)=>`
- **cvsFrame**? -> If you don't want the canvas to take the size of its direct parent, you can provide another custom HTML element here.
- **settings**? -> The custom canvas settings (leave `null` for prebuilt default settings).
- **willReadFrequently**? -> If `true`, optimizes the canvas context for frequent readings. (Defaults to `false`)

**To add objects to the canvas,** use the add() function:
###### - add(objs, inactive=false)
```js
    // For a source object
    CVS.add(yourShape)

    
    // For a prefab or inactive shape
    CVS.add(yourShape, true)
```

**To set up mouse/keyboard listeners for the canvas,** use the following prebuilt functions:
```js
    // Set the important mouse events 
    CVS.setMouseMove(/*possible custom callback*/)
    CVS.setMouseLeave()
    CVS.setMouseDown()
    CVS.setMouseUp()

    // Set the important keyboard events 
    CVS.setKeyDown(/*possible custom callback*/)
    CVS.setKeyUp()
```

**To control the canvas loop**, use the following functions:
```js
    // Starts the main loop
    CVS.start() 

    // Stops the main loop
    CVS.stop()
```

**To control the canvas drawing loop speed**, use the following function:
```js
    // Slows down all animations/time related events by 4x
    CVS.speedModifier = 0.25
```

#### Example use:
###### - Creating a Canvas instance that displays fps
```js
    // Creating a FPSCounter instance
    const fpsCounter = new CDEUtils.FPSCounter()
    
    const CVS = new Canvas(
        document.getElementById("canvas"),  // The HTML canvas element to link to
        ()=>{                               // Custom callback that runs every frame
            // Get current fps
            const fps = fpsCounter.getFps()
        
            // Display fps in another element
            document.getElementById("fpsDisplay").textContent = fps
        }
    )
```
 

# [_Obj](#table-of-contents)

The _Obj class is the template class of most canvas object. **It should not be directly instantiated.**

#### **All canvas objects will have at least these attributes:**
- ***id*** -> Id of the object.
- **initPos** -> Initial pos declaration. Can either be a pos array `[x, y]` or a callback `(Canvas, obj)=>{... return [x, y]}`
- ***pos*** -> Array containing the `[x, y]` position of the object.
- ***initRadius*** -> Initial radius declaration. Can either be a number or a callback `(parent or obj)=>{... return radiusValue}`
- **radius** -> The radius in px object the dot (Or the radius of its dots if is a Shape).
- ***initColor*** -> Initial color declaration. Can either be a color value (see ↓) or a callback `(render, obj)=>{... return colorValue}`
- **color** -> Either a Color instance `new Color("red")`, a string `"red"`, a hex value `#FF0000` or a RGBA array `[255, 0, 0, 1]`
- **setupCB** -> Custom callback called on the object's initialization `(this, parent?)=>{}`s
- ***setupResults*** -> The value returned by the `setupCB` call.
- **loopCB** -> Custom callback called each frame for the object (obj, deltaTime)=>
- **anchorPos** -> The reference point from which the object's pos will be set. Can either be a pos `[x,y]`, another canvas object instance, or a callback `(obj, Canvas or parent)=>{... return [x,y]}` (Defaults to the parent's pos, or `[0, 0]` if the object has no parent). If your *anchorPos* references another object, make sure it is defined and initialized when used as the *anchorPos* value.
- **activationMargin** -> Defines the px margin where the object remains active when outside the canvas' visible bounds. If `true`, the object will always remain active.
- ***initialized*** -> Whether the object has been initialized.
- ***parent*** -> The parent of the object. (Shape, Canvas, ...)
- ***rotation*** -> The object's rotation in degrees. Use the `rotateAt`, `rotateBy` and `rotateTo` functions to modify.
- ***scale*** -> The shape's X and Y scale factors `[scaleX, scaleY]`. Use the `scaleAt`, `scaleBy` and `scaleTo` functions to modify.
- ***visualEffects*** -> The visual effects of the object in an array: `[filter, compositeOperation, opacity]`. `filter` is a string containing a regular css filter (`"blur(5px)"`, `url(#svgFilterId)`, etc). `compositeOperation` is one of `Render.COMPOSITE_OPERATIONS` (see [global composite operations](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation) for more information). `opacity` is the alpha value of the object (in addition to the object's color alpha).

**This class also defines other useful base functions**, such as:
- Movements functions (`moveBy`, `addForce`, `follow`, ...)
- Informative functions (`isWithin`, `getInitPos`, `getBounds`, ...)
- Access to the object's animations (`playAnim`, `clearAnims`, ...)

**The follow function:** use `follow()` to make an object follow a custom path:
###### - `follow(duration, easing, action, progressSeparations)`
```js
   /**
     * Used to make an object follow a custom path
     * @param {Number} duration: The duration of the animation in miliseconds
     * @param {Function} easing: The easing function 
     * @param {Function?} action: A custom callback that can be called in addition to the movement                                                        //newProg is 'prog' - the progress delimiter of the range
     * @param {[[Number, Function], ...]} progressSeparations: list of callback paired with a progress range, the callback must return a position (prog, newProg, initX, initY)=>return [x,y]
     * progressSeparations example: [0:(prog)=>[x1, y1]], [0.5:(prog, newProg)=>[x2, y2]] -> from 0% to 49% the pos from 1st callback is applied, from 50%-100% the pos from 2nd callback is applied  
     */
     
    // Example use, for 3 seconds, easeOutQuad, no custom callback, will travel in a sideways 'L' shape 
    let dx=400, dy=200
    dot.follow(3000, Anim.easeOutQuad, null, [[0,(prog)=>[dx*prog, 0]], [0.5,(prog, newProg)=>[dx*0.5, dy*newProg]]])
```

# [Dot](#table-of-contents)

The dot class is **meant** to be the *core* of most effects. It appears as a circular dot on the canvas by default.

#### **The Dot constructor takes the following parameters:**
###### - `new Dot(pos, radius, color, setupCB, anchorPos, activationMargin, disablePathCaching)`
- *pos, radius, color, setupCB, anchorPos, activationMargin* -> See the _Obj class.

Its other attribute is:
- **connections** -> a list referencing other dots, primarily to draw a connection between them. 
- **cachedPath** -> The cached Path2D object or `null` if path caching is disabled (Controlled via the `disablePathCaching` constructor parameter or by the `disablePathCaching()` function)


**To add or remove connections,** use the following functions:
```js
    // Adding a connection with another dot
    dot.addConnection(otherDot)

    // Removing a connection
    dot.removeConnection(otherDot)
```

**To control whether a dot caches its path** use the following functions:
```js
    // By default, path caching for dots is enabled.
    // But for very dynamic dots (changes every frame), sometimes it might be better to disable caching.

    // To disable path caching:
    const dynamicDot = new Dot(null, null, null, null, null, null, true) // disables the path caching via constructor
    existingDynamicDot.disablePathCaching() // disables the path caching via this function if the dot already exists

    // To enable path caching back use:
    existingDynamicDot.updateCachedPath() 
```

**To delete a dot**, use the following function:
```js
    // Removes the dot completely
    dot.remove()
```

#### Example use 1:
###### - A dot on its own (rare)
```js
    // Creating a lonely dot
    const aloneDot = new Dot(
        [0,0],          // positioned at [0,0]
        25,             // 25px radius
        [0,0,255,0.5],  // blue at 50% opacity
        ()=>{           // setupCB, custom callback ran on dot's initialization
            console.log("I am now added to the canvas and ready to go!")
        }
    )
    
    // Add the dot as a standalone object (definition)
    CVS.add(aloneDot)
```

#### Example use 2:
###### - Dots as part of a shape
```js
    // Creating a Shape containing some dots!
    const squareLikeFormation = new Shape([0,0], [
            new Dot([100, 100]), // Dots contained in a shape will take on some properties (color, radius, limit, ...) of the shape.
            new Dot([150, 100]),
            new Dot([150, 150]),
            new Dot([100, 150])
    ], _Obj.DEFAULT_RADIUS, Color.DEFAULT_COLOR, Shape.DEFAULT_LIMIT)
    
    // Add the shape along with all of its dots as a single unit. (reference)
    CVS.add(squareLikeFormation)
```

 

# [Shape](#table-of-contents)

The Shape class (or its inheritors) plays a crucial part in creating proper effects. It provides the needed control over a group of dots and is used to make pretty much any effect. An empty shape (containing no dots) on its own is not visible by default.

One of the main features is the ***drawEffectCB***. This callback allows the creation of custom effects for each dot in the shape.

Effects are often ratio-based, meaning the *intensity* of the effect is based on the distance between the dot and the *ratioPos*. You can control the affected distance with the *limit* parameter, and the the object to which the distance\ratio is calculated with the *ratioPosCB* parameter.

#### **The Shape constructor takes the following parameters:**
###### - `new Shape(pos, dots, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, loopCB, anchorPos, activationMargin, fragile)`
- *pos, radius, color, setupCB, loopCB, anchorPos, activationMargin* -> See the _Obj class.
- **initDots** -> Initial dots declaration. Can either be: an array of dots `[new Dot(...), existingDot, ...]`, a **String** (this will automatically call the shape's createFromString() function), or a callback `(Shape, Canvas)=>{... return anArrayOfDots}` 
- ***dots*** -> Array of all the current dots contained by the shape. 
- **limit** -> Defines the circular radius in which the dots' ratio is calculated. Each dot will have itself as its center to calculate the distance between it and the shape's *ratioPos*. (At the edges the ratio will be 0 and gradually gravitates to 1 at the center)
- **drawEffectCB** -> A custom callback containing the effects to display. It is run by every dot of the shape, every frame. `(render, dot, ratio, parentSetupResults, mouse, distance, parent, isActive, rawRatio)=>{...}`.
- **ratioPosCB**? -> References the mouse position by default. Can be used to set a custom *ratioPos* target `(Shape, dots)=>{... return [x, y]}`. Can be disabled if set to `null`.
- **fragile**? -> Whether the shape resets on document visibility change events. (Rarer, some continuous effects can break when the page is in the background due to the unusual deltaTime values sometimes occurring when the document is offscreen/unfocused)

### **To add one or many dots,** use the add() function:
###### - add(dots)
```js
    // Creating and adding a new empty Shape to the canvas
    const dummyShape = new Shape([100,100])
    CVS.add(dummyShape)
    
    // Later, adding a dot to the shape, at [150, 150] on the canvas
    dummyShape.add(new Dot(50, 50))
    
    // or many dots
    dummyShape.add([new Dot(50, 50), new Dot(50, 100)])
```

**Note, adding dots to a shape:** 
1. Sets the dots' the dots' color to the one of shape, if not previously defined.
2. Sets the dots' radius to the one of the shape, if not previously defined.
3. Sets the dots' anchorPos to the shape's pos, if not previously defined.
4. Sets the dots' activationMargin property to that of the shape, if not previously defined.
5. Sets the dots' parent attribute to reference the shape.


### **To modify dots' properties all at once,** use the following functions:
###### - setRadius(radius, onlyReplaceDefaults),  setColor(color, onlyReplaceDefaults), setLimit(limit, onlyReplaceDefaults), [enable/disable]DotsPathCaching()
```js
    // Sets the radius of all dummyShape's dots to 10
    dummyShape.setRadius(10)
    
    // Sets the color of all dummyShape's dots to red
    dummyShape.setColor("red")
    
    // Sets the limit of all dummyShape's dots to 100
    dummyShape.setLimit(100)
    
    
    // Disables the path caching of all dummyShape's dots
    dummyShape.disableDotsPathCaching()
    
    // Enables the path caching of all dummyShape's dots
    dummyShape.enableDotsPathCaching()
```

### **To dynamically generate a formation of dots** use the `generate` functions:
###### - generate(yTrajectory, startOffset, length, gapX, yModifier, generationCallback)
```js
    // Generating a sine wave-based formation
    const generatedDots = Shape.generate(
        x=>Math.sin(x/50)*100, // make the y follow a sine wave pattern
        [-50, 0],           // the generation start is offset by -50 horizontally
        1000,               // the generation will span 1000 px in length
        10,                   // the generation is sectioned in 10px intervals
        [5, -5],            // a range allowing random Y between the [min, max]
        (dot, nextDot)=>{
            dot.addConnection(nextDot) // adding a connection between each dot
        }
    )

    // Creating a new shape containing the generated dots
    const dummyShape = new Shape([0, 0], generatedDots)

    // Adding the shape to the canvas
    CVS.add(dummyShape)

```

### **To rotate or scale,** use the multiple prebuilt rotate/scale functions:
###### - rotateBy(deg, centerPos?), - rotateAt(deg, centerPos?), - rotateTo(deg, time, easing?, force?, centerPos?)
```js
    // This will rotate all of dummyShape's dots around the shape's pos by 45 degrees
    dummyShape.rotateBy(45)
    
    // This will rotate all of dummyShape's dots around the pos [100, 100] at 180 degrees
    dummyShape.rotateAt(180, [100, 100])
    
    // This will smoothly rotate all of dummyShape's dots around the shape's pos at 125 degrees, over 5 seconds
    dummyShape.rotateTo(125, 5000)
```
###### - scaleBy(scale, centerPos?), - scaleAt(scale, centerPos?), - scaleTo(scale, time, easing?, force?, centerPos?)
```js
    // This will scale the distance between all of dummyShape's dots by 2x horizontally, from the point [250, 100] 
    dummyShape.scaleBy([2, 1], [250, 100])
    
    // This will scale the distance between all of dummyShape's dots to 4x, from the shape's pos
    dummyShape.scaleAt([4, 4])
    
    // This will smoothly scale the distance between all of dummyShape's dots to 2.5x horizontally and 
    // 3.5x vertically, from the shape's pos, over 3 seconds
    dummyShape.scaleTo([2.5, 3.5], 3000)
```

### **To remove a dot or the entire shape,** use the following functions:
###### - remove(), removeDot(dotOrId)
```js
    // This will remove the dot with the id 10
    dummyShape.removeDot(10)
    
    // This will remove the first dot of the shape
    dummyShape.removeDot(dummyShape.dots[0])
    
    // This will remove the entire shape, along with its dots!
    dummyShape.remove()
```

### **To duplicate a shape,** use the duplicate() function:
###### - duplicate()
```js
    // Creating a dummy shape
    const dummyShape = new Shape([10,10], new Dot())
    
    // Adding it to the canvas and thus initializing it
    CVS.add(dummyShape)
    
    
    // Creating a copy of the dummyShape (which needs to be initialized)
    const dummyShapeCopy = dummyShape.duplicate()
    
    // Adding it to the canvas
    CVS.add(dummyShapeCopy)
    
    // Moving the copy 100px to the right
    dummyShapeCopy.moveBy([100, 0])
    
```

#### Example use 1:
###### - Simple shape with small mouse effects
```js
    // Creating a simple square-like shape
    const simpleShape = new Shape([100,100],[
         new Dot([-50, -50]),
         new Dot([-50, 0]),
         new Dot([-50, 50]),
         new Dot([0, -50]),
         new Dot([0, 50]),
         new Dot([50, -50]),
         new Dot([50, 0]),
         new Dot([50, 50]),
     ], null, null, 100, (render, dot, ratio)=>{
     
         // Changes the opacity and color according to mouse distance
         dot.a = CDEUtils.mod(1, ratio, 0.8)
         dot.r = CDEUtils.mod(255, ratio, -255)
         dot.g = CDEUtils.mod(255, ratio, -255)
         
         
         // Changes the dot's radius, from 2 times the default radius with a range of 80% (10px..2px), according to mouse distance
         dot.radius = CDEUtils.mod(_Obj.DEFAULT_RADIUS*2, ratio, _Obj.DEFAULT_RADIUS*2*0.8)
         
         // Draws a ring around the dot, at 5 times the radius
         CanvasUtils.drawOuterRing(dot, [255,255,255,0.2], 5)
     })

    // Adding it to the canvas
    CVS.add(simpleShape)
```

#### Example use 2:
###### - Single throwable dot, with color and radius effects
```js
    const draggableDotShape = new Shape([0,0], new Dot([10,10]), null, null, null, (render, dot, ratio, setupResults, mouse, dist, shape)=>{
        
        // Checking if the mouse is over the dot and clicked, and changing the color according to the state
        const mouseOn = dot.isWithin(mouse.pos)
        if (mouseOn && mouse.clicked) dot.color = [255, 0, 0, 1]
        else if (mouseOn) dot.color = [0, 255, 0, 1]
        else dot.color = [255, 255, 255, 1]
    
        // Draws a ring around the dot, at 3 times the radius, only visible if the mouse is near
        CanvasUtils.drawOuterRing(dot, [255,255,255,CDEUtils.mod(0.3, ratio)], 3)
    
        // Making the dot drawable
        const dragAnim = setupResults
        dragAnim(shape.firstDot, mouse, dist, ratio)
        
    }, null, (shape)=>{

        // Accessing the dot
        const dot = shape.firstDot
        
        // Adding an infinite anim that changes the radius size back and forth
        dot.playAnim(new Anim((progress, i)=>{
            dot.radius = i%2?25*(1-prog):25*prog
        }, -750, Anim.easeOutQuad))

        // Getting the dragging animation callback
        const dragAnim = CanvasUtils.getDraggableDotCB()

        // Making it available in the drawEffectCB as setupResults
        return dragAnim
    })
    
    // Adding it to the canvas
    CVS.add(draggableDotShape)
```

#### Example use 3:
###### - Linking a shape pos to another one with anchorPos
```js
    // Assuming we have simpleShape from example use 1 available...

    // Creating a shape with a dot moving back and forth every second
    const backAndForthDotShape = new Shape([200,200], new Dot([0,0], null, null, (dot, shape)=>{
            let distance = 150, ix = dot.x
            dot.playAnim(new Anim((progress, playCount, deltaTime)=>{
                dot.x = ix + ((playCount % 2) == 0 ? 1 : -1) * distance * progress
                if (progress == 1) ix = dot.x
            }, -1000, Anim.easeOutBack))
        })
    )
    
    
    // Setting simpleShape's anchorPos to the dot of backAndForthDotShape. (Using a callback since the dot doesn't exist yet)
    simpleShape.anchorPos = () => backAndForthDotShape.firstDot
    
    
    // Adding the shape to the canvas
    CVS.add(backAndForthDotShape)

```
# [Filled Shape](#table-of-contents)

The FilledShape class is a derivative of the Shape class. It allows to fill the area delimited by the shape's dots.

#### **The FilledShape constructor takes the following parameters:**
###### - `new FilledShape(fillColor, dynamicUpdates, pos, dots, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, loopCB, anchorPos, activationMargin, fragile)`
- *pos, dots, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, loopCB, anchorPos, activationMargin, fragile* -> See the Shape class.
- **fillColor** -> Defines the color of the shape's filling. Either a color value, a Gradient instance, or a callback returning any of the previous two `(render, shape)=>{... return [r, g, b, a]}`.
- **dynamicUpdates** -> Whether the shape's fill area checks for updates every frame


#### **To update the fill area manually:** use the `updatePath()` function:

###### - `updatePath()`
```js
    // ... Assuming there is a dummyFilledShape existing somewhere

    // Moving it somewhere else
    dummyFilledShape.moveAt(250, 250)

    // If the dynamicUpdates parameter isn't set to 'true', the fill area will ONLY update IF the updatePath() function is called
    dummyFilledShape.updatePath()
```

#### Example use 1:
###### - Simple red square
```js
  // Creating a simple filledShape
    const myFilledShape = new FilledShape(
        "red", // color of the fill area
        true,  // Automatically updates the fill area positions
        [100, 100], // shape pos
        [
            new Dot([-50, -50]), // Top left corner
            new Dot([50, -50]),  // Top right corner
            new Dot([50, 50]),   // Bottom right corner
            new Dot([-50, 50])   // Bottom left corner
        ]
    )

    // Adding it to the canvas
    CVS.add(myFilledShape)
```

#### Example use 2:
###### - Comparing default bounds vs accurate bounds
```js
    // Creating a FilledShape with a complex shape
    const someObj = new FilledShape([75,75,75,1], true, CVS.getCenter(), [new Dot([0,0]),new Dot([100,-50]),new Dot([300,50]),new Dot([100,80]),new Dot([270,-90]),new Dot([-70,-90]),new Dot([-150,190])], 3, [100,100,100,1])

    // Setting a slow rotation / scaling animation, repeating every 60 seconds
    someObj.setupCB = (obj)=>{
        obj.playAnim(new Anim(prog=>obj.rotateAt(prog*360), -60000))
        obj.playAnim(new Anim((prog, i)=>obj.scaleAt([0.25+(i%2?prog:(1-prog)), 0.25+(i%2?prog:(1-prog))]), -60000))
    }

    // drawing the both the raw outline and accurate outline
    someObj.loopCB = (obj)=>{
        CanvasUtils.drawOutline(CVS.render, obj)
        CanvasUtils.drawOutlineAccurate(CVS.render, obj)
    }

    // Enabling accurate move listeners mode, this makes the mouse enter/exit events accurate when the object is moving
    CVS.enableAccurateMouseMoveListenersMode()

    // Listeners for enter/exit/click on the object, using the default bounds (red rectangle)
    CVS.mouse.addListener(someObj, Mouse.LISTENER_TYPES.ENTER, ()=>console.log("FAST - enter"))
    CVS.mouse.addListener(someObj, Mouse.LISTENER_TYPES.EXIT , ()=>console.log("FAST - exit"))
    CVS.mouse.addListener(someObj, Mouse.LISTENER_TYPES.DOWN , ()=>console.log("FAST - click"))

    // Listeners for enter/exit/click on the object, using the accurate bounds (blue outline)
    CVS.mouse.addListener(someObj, Mouse.LISTENER_TYPES.ENTER, ()=>console.log("ACCURATE - enter"), true)
    CVS.mouse.addListener(someObj, Mouse.LISTENER_TYPES.EXIT , ()=>console.log("ACCURATE - exit") , true)
    CVS.mouse.addListener(someObj, Mouse.LISTENER_TYPES.DOWN , ()=>console.log("ACCURATE - click"), true)

    // Adding the object to the canvas
    CVS.add(someObj)
```

 

# [Grid](#table-of-contents) 

The Grid class is a derivative of the Shape class. It allows the creation of dot-based symbols / text. To create your own set of symbols (source), see the *Grid Assets* section.

#### **The Grid constructor takes the following parameters:**
###### - `new Grid(keys, gaps, spacing, source, pos, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, loopCB, anchorPos, activationMargin, fragile)`
- *pos, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, loopCB, anchorPos, activationMargin, fragile* -> See the Shape class.
- **keys** -> A string containing the characters to create.
- **gaps** -> The `[x, y]` distances within the dots.
- **source** -> The source containing the symbol's definitions. See the *Grid Assets* section.
- **spacing** -> The distance between each symbol. (Letter spacing)

#### Example use 1:
###### - Displaying all A-Z letters, with a nice effect when passing the mouse over the shape
```js
    // Creating a Grid
    const coolAlphabet = new Grid(
        "abcdefg\nhijklm\nnopqrs\ntuvwxyz", // the keys corresponding to the alphabet letters, with some line breaks
        [5, 5],                             // equal gaps, this will make the alphabet look a bit square-ish
        50,                                 // 50px letter spacing
        GridAssets.DEFAULT_SOURCE,          // default source
        [10,10],                            // the shape position (The text will start from this point, as its top-left corner)
        2,                                  // 2px dot radius
        null,                               // color is left undefined, the shape will assign it the default value
        null,                               // limit is left defined, default value assigned (100)
        (render, dot, ratio)=>{                // This is the drawEffectCB, which gets call for every dot of the shape, every frame
        
            // This will make a nice proximity effect when the mouse is close.
            // The mod() function and the ratio allow us to modify the dot radius with
            // a linear interpolation based on the distance between the ratioPos (the mouse) and the current dot.
            dot.radius = CDEUtils.mod(_Obj.DEFAULT_RADIUS, ratio, _Obj.DEFAULT_RADIUS)     // DEFAULT_RADIUS = 5
            
            
            // By default, no connections are drawn between the dots of a grid.
            // We can use the drawDotConnections() function to draw them easily.
            CanvasUtils.drawDotConnections(dot, [255,0,0,1])
        }
    )
    

    // The grid is done and dusted, adding it to the canvas
    CVS.add(coolAlphabet)
```

#### Example use 2:
###### - Creating a grid, that gets distorted around the area of the mouse
```js
// Creating a grid with symbols that distort themselves on mouse hover
const distortedGrid = new Grid(
    "abc\n123\n%?&", // symbols used
    [7, 7],     // gaps of 7px between each dot
    50,         // spacing of 50px between symbols
    null,       // using the default source
    [100, 100], // pos
    2,          // dot's radius
    "aliceblue",// dot's color 
    50,         // limit of 50px
    (render, dot, ratio, filterId)=>{ // grid's drawEffectCB

        const scaleValue = CDEUtils.mod(50, ratio), // the scale value adjusted by the distance of the mouse
              hasFilter = scaleValue>>0, // whether the current dot is affected by the filter (IMPORTANT FOR PERFORMANCES)
              filterValue = hasFilter ? "url(#"+filterId+")" : "none" // adjusting the filter value

        // accessing the <feDisplacementMap> element of the filter and updating its scale attribute
        Canvas.getSVGFilter(filterId)[1].setAttribute("scale", scaleValue)

        // drawing the symbols and applying some simple style changes, as well as the (↓) distortion filter. /!\ Also setting the (↓) "forceBatching" parameter to whether the filter is active or not
        CanvasUtils.drawDotConnections(dot, render.profile5.update([255,0,0,1], filterValue, null, 1, 3), null, null, null, !hasFilter)

        // finishing with a simple opacity effect for the dots
        dot.a = CDEUtils.mod(1, ratio)

}, null, ()=>{ // grid's setupCB

    // filter id to be used for the filter url
    const filterId = "myFilter"

    // loading a simple custom distortion SVG filter
    Canvas.loadSVGFilter(`<svg>
        <filter id="turbulence">
          <feTurbulence type="turbulence" baseFrequency="0.01 0.02" numOctaves="1" result="NOISE"></feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="NOISE" scale="25">
          </feDisplacementMap>
        </filter>
       </svg>`, filterId)
    
    return filterId
})

// Adding the grid to the canvas
CVS.add(distortedGrid)
```
 

# [Grid Assets](#table-of-contents)
This class contains the source declarations used by the Grid class. A source is basically a set of symbols, just like a font is a set of letters / numbers. You can create your own symbols and sources using the Grid Assets class. Sources are simply mapping *key* (any character, "A", "0", "%", ...) to *symbol* (a custom formation of dots).

### **The '`D`' constant:**
 `D` (for directions) is a prebuilt object providing the cardinal and intercardinal directions. These are used to connect the dots together and draw specific lines between them, to create a symbol.
 
### **Creating a custom source:**
A source is an object that should contain:
- The width and height of all its symbols. (As of now, the width and height must be equal)
- The symbol's definitions. (The key should be in uppercase)

Ex: `{ width: 3, height: 3, A: [...], B: [...], 5: [...] }`

### **Creating custom symbols:**
A symbol has this structure: `[...[index, directions]]`. It is composed of a main array, containing the sub-arrays.
- The main array defines the vertical layers, a new layer is created each time a horizontal index is lower than the last.
- The sub-arrays each define a dot and contain its horizontal index and the directions of its connections.

**Example for creating the letter "A" in a 5x5 source:**
###### The final result should be dots placed like this 


| Top-Left | 0 | 1 | 2 | 3 | 4 | Top-Right |
| - |:-:|:-:|:-:|:-:|:-:|:-: |
| 0 |   |   | o |   |   ||
| 1 |   | o |   | o |   ||
| 2 | o | o | o | o | o ||
| 3 | o |   |   |   | o ||
| 4 | o |   |   |   | o ||
|**Bottom-Left**||||||**Bottom-Right**|


### **The steps to create a symbol:**
 1. **Creating the main array** -> `[ ]`
    ```js
    // The main array
    [
    
    ]
     ```
 
 2. **Creating the 1st vertical layer (*vertical index 0*).** 
   Since the "A" symbol doesn't have any dot at (0, 0) and (1, 0), we need to place the first dot at the cords (2, 0).
   To do that, we only need to specify the horizontal index in the sub-array. -> `[2]`.

    ```js
    // The main array
    [
        [2]  // A dot at (2, 0)
    ]
    ```

 3. **Adding connections.** A dot is now placed at (2,0), but it still has no connection to any other dot. To add connections,
   we use the '`D`' constant. In this example, the needed connections are with the dots at (1, 1) and (3, 1). To achieve these, 
   we add a bottom-left (bl) connection and a bottom-right (br) connection, as the second parameter of the sub-array -> `[2, D.bl + D.br]`

    **Note:** always define connections from upper dots to lower dots, and from left to right, to avoid redundancy.
    ```js
    // The main array
    [
        [2, D.bl + D.br]  // A dot at (2, 0), with connections to any dot at (1, 1) and (3, 1)
    ]
    ```

 4. **Creating the 2nd vertical layer (*vertical index 1*).**  Since the first layer only had a single dot, it is now completed, with the correct placement and connections. Let's continue the example with the 2nd layer.
   This layer has dots only at (1, 1) and (1, 3), so we can already create the following sub-arrays -> [1,] and [3,]. Looking at the "A" graph above, the entire 3rd layer (*vertical index 2*) is filled with dots. 
   Though, to make the letter "A", we need to only connect to the dots at (0, 2) and (4, 2).
   We achieve these two connections by updating our previous sub-arrays like this -> [1, D.bl] and [3, D.br]

    **Note:** A new vertical layer is created when the sub-array horizontal index is smaller than the previous sub-array's. (When the horizontal index is negative, it forces the creation of a new vertical layer and starts it at the absolute value of the negative horizontal index) (You can also use `Infinity` to "skip" a layer without putting any dot)
    ```js
    // The main array
    [
        // Here, we are at the vertical layer (vertical index 0)
        [2, D.bl + D.br],  // A dot at (2, 0), with connections to any dot at (1, 1) and (3, 1)
        
        // Here, a new vertical layer is created (vertical index 1), because the first sub-array's horizontal index ([1, D.bl] -> 1) is smaller than the previous sub-array's horizontal index ([2, D.bl + D.br] -> 2)
        [1, D.bl], [3, D.br] // A dot at (1, 1), with connections to any dot at (0, 2) and another dot at (1, 3), with connections to any dot at (4, 2)
    ]
    ```
 5. **Continue the process until the symbol is fully formed**. In the end, you should have something like this:
     ```js
    // The main array
    [
        // Here, we are at the vertical layer (vertical index 0)
        [2, D.bl + D.br],  // A dot at (2, 0), with connections to any dot at (1, 1) and (3, 1)
        
        // Here, a new vertical layer is created (vertical index 1), because the first sub-array's horizontal index ([1, D.bl] -> 1) is smaller than the previous sub-array's horizontal index ([2, D.bl + D.br] -> 2)
        [1, D.bl], [3, D.br], // A dot at (1, 1), with connections to any dot at (0, 2) and another dot at (1, 3), with connections to any dot at (4, 2)
        
        // (vertical index 2)
        [0, D.r + D.b], [1, D.r], [2, D.r], [3, D.r], [4, D.b],
        
        // (vertical index 3)
        [0,D.b], [4,D.b],
        
        // (vertical index 4)
        [0], [4] // Dots at the bottom (0, 4) and (4, 4), connected by the dots at vertical layer 3, but not initiating any connections themselves
    ]
    
    
    
    // Uncommented
    [
        [2,D.bl+D.br],
        [1,D.bl],[3,D.br],
        [0,D.r+D.b],[1,D.r],[2,D.r],[3,D.r],[4,D.b],
        [0,D.b],[4,D.b],
        [0],[4]
    ]
    ```


#### Particularities: 
   - Leaving a sub-array's horizontal index empty (ex: `[,D.br]`), will result in it taking in value the increment of the previous sub-array's horizontal index. Ex -> `[2, D.br]`, `[, D.bl]` (here `[, D.bl]` is equal to `[3, D.bl]`).
   - Leaving a sub-array's connections parameter empty (ex: `[2]`), will make it so the dot does not initiate any connection.
- Leaving a sub-array completely empty (ex: `[]`) logically implies that a dot will be created at the next horizontal index and that it won't initiate connections.
- **Important**: You cannot start a new vertical layer using a sub-array without a horizontal index (empty). 

### **In the end, the example source should look like this:**

```js
{
    width:5,
    height:5,
    
    A: [
        [2,D.bl+D.br],
        [1,D.bl],[3,D.br],
        [0,D.r+D.b],[1,D.r],[2,D.r],[3,D.r],[4,D.b],
        [0,D.b],[4,D.b],
        [0],[4]
    ],
    
    // Other symbols ...
}
```
 

# [TextDisplay](#table-of-contents)

The TextDisplay class allows the drawing of text as a canvas object.

#### **The TextDisplay constructor takes the following parameters:**
###### - `new TextDisplay(text, pos, color, textStyles, drawMethod, maxWidth, setupCB, loopCB, anchorPos, activationMargin)`
- *pos, color, setupCB, loopCB, anchorPos, activationMargin* -> See the _Obj / *_BaseObj* class.
- **text** -> The text to be displayed. Either a `String` or a callback `(parent, this)=>{... return "textToDisplay"}`.
- **textStyles** -> The style profile to be used for styling the text. Either a `TextStyles` or  a callback `(render)=>{... return TextStyles}`.
- **drawMethod** -> The draw method used when drawing the text, Either `"FILL"` or `"STROKE"`.
- **maxWidth**? -> The max width in pixels of the drawn text.

**Its other attribute is:**
- **size** -> The text's *width* and *height* in pixels `[width, height]`. Does not take into account scaling, use the `trueSize` getter for adjusted size.

#### Example use 1:
###### - Drawing a simple spinning text
```js
const helloWorldText = new TextDisplay(
    "Hello World!", // Displayed text
    [200, 100],     // positioned at [200, 100]
    "lightblue",    // colored light blue
    (render)=>render.textProfile1.update("italic 24px monospace"), // using the textProfile1 styles, only over writing the font
    null, // leaving drawMethod to the default value ("FILL")
    null, // leaving maxWidth to the default value (undefined)
    (textDisplay)=>{// setupCB
    
        // adding a spin animation, repeating every 3 seconds
        textDisplay.playAnim(new Anim(prog=>{
            // Updating the horizontal scale to go from 1, to -1, back to 1
            textDisplay.scale = [Math.sin(Math.PI*prog*2), 1]
        },-3000))
        
    })

// Adding the object to the canvas.
CVS.add(helloWorldText)

```
 

# [ImageDisplay](#table-of-contents)

The ImageDisplay class allows the drawing of images, videos and live camera/screen feeds.

#### **The ImageDisplay constructor takes the following parameters:**
###### - `new ImageDisplay(source, pos, size, errorCB, setupCB, loopCB, anchorPos, activationMargin)`
- *pos, setupCB, loopCB, anchorPos, activationMargin* -> See the _Obj / *_BaseObj* class.
- **source** -> The source of the image. One of `ImageDisplay.SOURCE_TYPES`.
- **size** -> The display size of the image `[width, height]`. (Resizes the image)
- **errorCB** -> A callback called when the source produces an error `(errorType, e?)=>`.

**Its other attributes are:**
- **sourceCroppingPositions** -> The source cropping positions. Delimits a rectangle which indicates the source drawing area to draw from: `[ [startX, startY], [endX, endY] ]`. (Defaults to no cropping)

#### Example use 1:
###### - Drawing an image from the web
```js
// Creating an ImageDisplay with a url pointing to an image
const myCoolImage = new ImageDisplay("https://static.wikia.nocookie.net/ftgd/images/9/97/ExtremeDemon.png/revision/latest?cb=20240801164829")

// Adding the object to the canvas.
CVS.add(myCoolImage)
```

#### Example use 2:
###### - Drawing an image from a file, resizing it, and cropping it
```js
// Creating an ImageDisplay by loading a local file, and adjusting the sizes
const myCoolImage = new ImageDisplay(
    "./img/logo.png", // local file located at [currentFolder]/img/logo.png
    [0,0],            // position of the top-left corner
    [100, 100]        // rezises the image to 100x100
)

// Cropping the source image to use only from [20, 20] to [150, 150]
myCoolImage.sourceCroppingPositions = [[20,20], [150, 150]]

// Adding the object to the canvas.
CVS.add(myCoolImage)
```

#### Example use 3:
###### - Drawing and playing a video
```js
// Creating an ImageDisplay playing a video
const dummyVideo = new ImageDisplay(
    "./img/vidTest.mp4", // local file located at [currentFolder]/img/vidTest.mp4
    null, // using default pos ([0, 0])
    null, // using natural size (default)
    (video)=>{
        // SetupCB, runs when the source is loaded

        // Automatically starts the video once loaded
        video.playVideo()
    }
)

// Adding the object to the canvas.
CVS.add(dummyVideo)
```

#### Example use 4:
###### - Drawing live feeds from the camera and screen
```js
// Creating an ImageDisplay displaying the camera (requires user permission)
const cameraFeed = new ImageDisplay(
    ImageDisplay.loadCamera(), // get the camera, with default settings
    [0,0], // draw at origin
    ImageDisplay.RESOLUTIONS.SD // shrink it down to 640x480
)

// Creating an ImageDisplay displaying a screen (requires user actions and permission)
const screenFeed = new ImageDisplay(
    ImageDisplay.loadCapture(), // get the screen capture, with default settings
    [640,0], // draw next to the camera display
    [1920/4, 1080/4] // resize it to Full HD divided by 4
)

// Adding both objects to the canvas.
CVS.add(cameraFeed)
CVS.add(screenFeed)
```

**Note:** Canvas image smoothing property is disabled by default to improve performances.

 


# [AudioDisplay](#table-of-contents)

The AudioDisplay class allows the visualization of audio from song, videos, live microphone / computer audio, etc, in cutomizable forms.

#### **The AudioDisplay constructor takes the following parameters:**
###### - `new AudioDisplay(source, pos, color, binCB, sampleCount, disableAudio, offsetPourcent, loadErrorCB, setupCB, loopCB, anchorPos, activationMargin)`
- *pos, color, setupCB, loopCB, anchorPos, activationMargin* -> See the _Obj / *_BaseObj* class.
- **source** -> The source of the audio. One of `AudioDisplay.SOURCE_TYPES`.
- **binCB** -> A custom callback called for each bin of the FFT data array. Used to draw the audio. `(render, bin, atPos, accumulator audioDisplay, i, sampleCount, rawBin)=>{... return? [ [newX, newY], newAccumulatorValue ]}`
- **sampleCount** -> The count of bins to use / display. Ex: if sampleCount is "32" and the display style is `BARS`, 32 bars will be displayed. *Note: (fftSize is calculated by selecting the nearest valid value based on twice the provided sampleCount).*
- **disableAudio** -> Whether this AudioDisplay actually output outputs sounds/audio. *Note: (This value does not affect the visual display, only whether you can hear what is playing or not).*
- **offsetPourcent** -> A number between 0 and 1 representing the offset pourcent in the order of the bins when calling binCB. 
- **errorCB** -> A callback called when the source produces an error `(errorType, e?)=>`.
- **transformable** -> If above 0, allows transformations with non batched canvas operations. (Mostly managed automatically)

**Its other attributes are the following audio context / analyser / modifier nodes:**

*(see [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) for more information)*
- *audioCtx*
- *audioAnalyser*
- *gainNode*
- *biquadFilterNode*
- *convolverNode*
- *waveShaperNode*
- *dynamicsCompressorNode*
- *pannerNode*
- *delayNode*


**Note:** ↑ *The audio chain is also defined in the above order.* 

#### Example use 1:
###### - Displaying the waveform of a .mp3 file
```js
// Creating an AudioDisplay playing and displaying a local file
const audioDisplay = new AudioDisplay(
    "./audio/song.mp3", // the filepath of the .mp3 file
    [100,100],          // the pos of the display
    "lime",             // color of the display
    AudioDisplay.BARS(),// the display type (here we use the generic bars/waveform display)
    64,    // the sample count, here 64 bars will be displayed (and the fftSize will be 128)
    false, // not disabling the audio so we can hear the song.mp3 playing
    0,     // no offset
    (type, e)=>console.log("Dang it, error! Type:", type, " | ", e) // onerror callback
)

// Adding the object to the canvas.
CVS.add(audioDisplay)
```

#### Example use 2:
###### - Displaying the microphone output as a circle
```js
// Creating an AudioDisplay displaying the microphone
const micDisplay = new AudioDisplay(
    AudioDisplay.loadMicrophone(), // loading the microphone
    [100,100],          // the pos of the display
    "lime",             // color of the display
    (render, bin, pos, audioDisplay, accumulator, i)=>{// binCB
        const maxRadius = 500/AudioDisplay.MAX_NORMALISED_DATA_VALUE, // defining a max radius of 500px
              precision = 100 // used to skip over some bins (the lowest this is, the more precise the display will be, but the more performance-heavy it will be too!)
        
        // optimizing with the precision variable (only drawing every <precision> time)
        if (i%precision==0) {

            // drawing the circles, the radius is based on the current bin value, and it's style is based on this audioDisplay object's styles
            render.batchStroke(Render.getArc(pos, maxRadius*bin), audioDisplay._color, audioDisplay.visualEffects)
        }
    },
    2000,   // the sample count, here a maximum of 2000 bins would be displayed (and the fftSize will be 4096)
    true,  // disabling the audio to prevent echo
)

// Adding the object to the canvas.
CVS.add(micDisplay)

```

#### Example use 3:
###### - Displaying the screen's audio and applying some audio modifications
```js
// Loading and displaying the screen audio. For this, the user needs to select a valid tab/window/screen.
const audioDisplay = new AudioDisplay(AudioDisplay.loadScreenAudio(), [100,100], "lime", AudioDisplay.BARS(), 64)

// Applying some audio modifiers:

// Setting the volume to 200%
audioDisplay.setVolume(2)

// Sets the audio filter to keep low frequencies and cut high ones
audioDisplay.setBiquadFilterType(AudioDisplay.BIQUAD_FILTER_TYPES.LOWPASS)

// delays the audio by 1 second
audioDisplay.setDelay(1)

// sets the distortion level to 10
audioDisplay.setDistortionCurve(10)

// sets the origin of the audio to seem like it's coming from 1 meter to the left
audioDisplay.setOriginPos(-1)

// since this sounds pretty bad, you could also reset all the modifiers with this:
//audioDisplay.resetAudioModifiers()

// Adding the object to the canvas.
CVS.add(audioDisplay)
```

#### Example use 4:
###### - Creating a reverb effect using the convolverNode
```js
// Taking back the audioDisplay from example 1.
const audioDisplay = new AudioDisplay("./audio/song.mp3", [100,100], "lime", AudioDisplay.BARS(), 64)

// For this to work, you need an impulse response file

// This will load the IR and, by default, assign its buffer to the convolverNode then connect the latter. (You also can handle this yourself by specifying the second parameter: "readyCallback")
audioDisplay.loadImpulseResponse("./audio/IR.wav")

// To disable this effect, disconnect the convolverNode:
// audioDisplay.disconnectConvolver()

// Adding the object to the canvas.
CVS.add(audioDisplay)
```

**Note:** Due to the high customizability of the display, the `getAutomaticPosition` / `getBounds` functions are not always reliable, therefore the positions are recommended to be entered manually.

 

# [Color](#table-of-contents)

The Color class represents a color and provides multiple utility functions such as HSV control, RGBA control, color finding, color format conversions, and color normalization.

**Note:** Direct HSV / RGBA controls are not supported for gradients

#### **The Color constructor takes the following parameters:**
###### - `new Color(color, isChannel)`
- **color** -> The color value in any supported format. (Text: `"red"`, RGBA: `[255, 255, 255 ,1]`, HEX:"#123abcff", Gradient: `new Gradient( ... )`, Color: *an instance of this class*)
- **isChannel** -> If `true`, the Color instance will be considered a color channel and will not duplicate. (Channels are for global color distribution)

### **To convert a color to another format,** use the convertTo() function:
###### - converTo(color, format=Color.FORMATS.RGBA)
```js
    const red = "red"
    
    console.log("Here is red in some other formats:",
        Color.convertTo(red, Color.FORMATS.RGBA)
        Color.convertTo(red, Color.FORMATS.HSV)
        Color.convertTo(red, Color.FORMATS.HEX)
    )
```
**Note:** `ConvertTo` doesn't support gradients.

### **To find the first position of a color in the canvas,** use the findFirstPos() function:
###### - findFirstPos(canvas, color, useAlpha=false, temperance=Color.DEFAULT_TEMPERANCE, searchStart=Color.DEFAULT_SEARCH_START, areaSize=[])
```js
    const redColor = new Color([255, 0, 0, 1])
    
    
    const whereRedIsAt = Color.findFirstPos(
        CVS, // Canvas instance
        redColor // Color instance
    )
    
    
    if (whereRedIsAt) console.log("The color red was found at: X:"+whereRedIsAt[0]+", Y:"+whereRedIsAt[1])
    else console.log("The canvas doesn't contain the color red")
```


 

# [Gradient](#table-of-contents)

The Gradient class allows the creation of custom linear / radial gradients. A Gradient instance can be used in the *color* and *fillColor* fields of canvas objects. 

#### **The Gradient constructor takes the following parameters:**
###### - `new Gradient(render, positions, colorStops, type, rotation)`
- **render** -> The canvas Render instance, or context.
- **positions** -> The positions of the gradient. Providing a canvas object will automatically position it to cover the minimal area containing all of the provided objects. For manual positions: **linear gradients**: `[ [x1, y1], [x2, y2] ]`, **radial gradients** `[ [x1, y1, r1], [x2, y2, r2] ]`, *conic gradients:* `[ x, y ]`.
- **colorStops** -> An array containing the difference colors and their range `[0..1, color]`. Ex: `[ [0, "purple"], [0.5, [255,0,0,1]], [1, "#ABC123"] ]`.
- **type** -> The type of gradient. Either: Linear, Radial or Conic. (Defaults to Linear)
- **rotation** -> The rotation in degrees of the gradient. (Not applicable for Radial gradients)


### **To manually update a Gradient,** use the update() function:
###### - update()
```js
    // Creating a gradient
    const customGradient = new Gradient(
            CVS.ctx,                   // canvas context
            [ [0, 0], [100, 100] ],    // setting manual position
            [[0, "red"], [1, "blue"]], // goes from red to blue
            Gradient.TYPES.LINEAR      // linear gradient
        )

    // Assigning the gradient to a dummy filled shape
    dummyFilledShape.fillColor = customGradient

    // Ex: Updating color stops
    customGradient.colorStops = [[0, "green"], [1, "pink"]]

    // Access the gradient assigned to the shape's filling and update it
    dummyFilledShape.fillColorRaw.update()
```

**Note:** when using a Shape, a Dot, or a TextDisplay instance as the 'positions' parameter, the gradient will update every frame automatically.

#### Example use 1:
###### - Coloring a FilledShape with a gradient and making a rotating gradient effect
```js
const gradientShape = new FilledShape(
        // Creating and returning a linear gradient with a callback.
        // This linear gradient will auto-position itself according to the shape's dots, start at 90deg rotation, and will go from purple->red->yellow-ish
        (render, shape)=>new Gradient(render, shape, [[0, "purple"], [0.5, [255,0,0,1]], [1, "#ABC123"]], null, 90), 
        
        // Other parameters are used by the FilledShape, to make a square at [100, 100]
        false,
        [200, 200], 
        [
            new Dot([-50, -50]), // Top left corner
            new Dot([50, -50]),  // Top right corner
            new Dot([50, 50]),   // Bottom right corner
            new Dot([-50, 50])   // Bottom left corner
        ]
    )
    
    // Creating and playing the rotating gradient animation
    gradientShape.playAnim(
        new Anim((progress)=>{
        
            // Getting the gradient instance
            const gradient = gradientShape.fillColorRaw
            
            // Rotating it
            gradient.rotation = 360 * progress
            
        }, -750) // repeating every 750 ms
    )

    // Adding it to the canvas
    CVS.add(gradientShape)
```

 

# [Pattern](#table-of-contents)

The Pattern class allows the creation image/video based colors. A Pattern instance can be used in the *color* and *fillColor* fields of canvas objects. 
#### **The Pattern constructor takes the following parameters:**
###### - `new Pattern(render, source, positions, sourceCroppingPositions, keepAspectRatio, forcedUpdates, rotation, errorCB, readyCB, frameRate, repeatMode)`
- **render** -> The canvas Render instance, or context.
- *source* -> The source declaration of the pattern. One of `ImageDisplay.SOURCE_TYPES`.
- **positions** -> The positions of the pattern. (`[ [x1, y1], [x2, y2] ]`) Providing a canvas object will automatically position it to cover the minimal area containing all of the provided objects.
- **sourceCroppingPositions** -> The source cropping positions. Delimits a rectangle which indicates the source drawing area to draw from: `[ [startX, startY], [endX, endY] ]`. (Defaults to no cropping)
- **keepAspectRatio** -> Whether the displayed pattern keeps the same aspect ratio when resizing.
- **forcedUpdates** -> Whether/How the pattern updates are forced. One of `Pattern.FORCE_UPDATE_LEVELS` .
- **rotation** -> The pattern's current rotation in degrees.
- **errorCB** -> A callback called when the source produces an error `(errorType, e?)=>`.
- **readyCB** -> Similar to `setupCB`. A callback that gets called when the source has been initialized `(pattern)=>`. *Note: this attribute doesn't transfer when calling the duplicate() function to avoid StackOverflow errors.*
- **frameRate** -> The update frequency of the current source. (Controls the frequency of video/canvas sources updates, as well as the frequency of any other sources when a visible property gets updated: e.g *when the rotation gets changed*)
- **repeatMode** -> Whether the pattern repeats horizontally/vertically. One of `Pattern.REPETITION_MODES`.

#### Example use 1:
###### - Coloring some dots with a custom image 
```js
    // Creating a dummy shape with two big dots, here parts of the image are going to be visible through the dots
    const dummyShape = new Shape([100, 100], [new Dot([250,250]), new Dot([0,0])], 50, (render, shape)=>
        new Pattern(
            render, // the render instance
            "./img/img2.jpg", // the source of the image, here it's the path to a local file
            shape, // making the pattern fit the shape size
            null,  // no source cropping
            true   // preserving the default aspect ratio
        )
    )
    
    // Adding the shape to the canvas
    CVS.add(dummyShape)
```

#### Example use 2:
###### - Coloring some text with a camera feed
```js
    // Creating a dummy text display
    const dummyText = new TextDisplay("Hey, this is just\n some random text in\n order to fill up space,\n have a nice day! :D", [250, 250], (render, text)=>
            new Pattern(
                render, // the render instance
                Pattern.loadCamera(), // the source of the pattern, here it's we are requesting access to the live camera feed
                text, // making the pattern fit the size of the text
                null, // no source cropping
                false, // resizing will most likely change the aspect ratio
                Pattern.FORCE_UPDATE_LEVELS.RESPECT_FRAME_RATE // automatically resizes the pattern if the textDisplay size/pos changes
            ))
    
    // Adding the text to the canvas
    CVS.add(dummyText)
```

#### Example use 3:
###### - Sharing VS duplicating a pattern
```js
    // DUPLICATING PATTERN (Can be performance-heavy when using dynamic patterns such as video, camera, etc)
    // Creating and adding a basic shape that contains 9 dots in a 3x3 grid disposition
    const shape1 = new Shape([100,100],[new Dot([-50, -50]), new Dot([-50, 0]), new Dot([-50, 50]), new Dot([0, -50]), new Dot([0, 0]), new Dot([0, 50]), new Dot([50, -50]), new Dot([50, 0]), new Dot([50, 50])], 25)
    CVS.add(shape1)

    // Creating a pattern that will get duplicated for each dot of shape1 (set the "positions" (↓) parameter to the placeholder value)
    const duplicatedPattern = new Pattern(CVS.render, Pattern.loadCamera(), Pattern.PLACEHOLDER, null, null, null, null, null, 
        (pattern)=>{// readyCB
            // once the camera is loaded, set the shape1's color to the value of the pattern
            shape1.setColor(pattern)
        }
    )
```
```js
    // SHARED PATTERN
    // Creating and adding a basic shape that contains 9 dots in a 3x3 grid disposition
    const shape2 = new Shape([300,100],[new Dot([-50, -50]), new Dot([-50, 0]), new Dot([-50, 50]), new Dot([0, -50]), new Dot([0, 0]), new Dot([0, 50]), new Dot([50, -50]), new Dot([50, 0]), new Dot([50, 50])], 25)
    CVS.add(shape2)

    // Creating a pattern that will get duplicated for each dot of shape1 (set the "positions" (↓) parameter to the area containing all the dots)
    const sharedPattern = new Pattern(CVS.render, Pattern.loadCamera(), shape2.getBounds(), null, null, null, null, null,
        (pattern)=>{// readyCB
            // once the camera is loaded, set the shape2's color to the value of the pattern
            shape2.setColor(pattern)
        }
    )
```

#### Example use 4:
###### - Using a pattern to color non-objects (In this case, lines)
```js
    // Creating a variable containing the color of the grid's symbol lines
    let gridLineColor = [255,0,0,1],
        lineWidth = 3

    // Creating a simple grid displaying a couple of letters
    const grid = new Grid("abc\nDEF\nghi", [15, 15], 75, null, [50,50], 2, null, null, 
        (render, dot, ratio, res, m, dist, shape, isActive)=>{// drawEffectCB
            // simple effect to change the dot's radius
            dot.radius = CDEUtils.mod(_Obj.DEFAULT_RADIUS*2, ratio, _Obj.DEFAULT_RADIUS)

            // drawing the grid's lines (connections) using the previous variable (↓). Note: the variable could also have been defined in the setupCB
            CanvasUtils.drawDotConnections(dot, render.profile1.update(gridLineColor, null, null, null, lineWidth, [0]))
        }
    )

    // Adding the grid to the canvas. (This initializes it, which is needed to correct bounds using "getBounds()")
    CVS.add(grid)

    // Assigning a pattern to the gridLineColor variable so it displays the camera as the color
    const padding = (grid.radius+lineWidth)*2
    gridLineColor = new Pattern(CVS.render, Pattern.loadCamera(), grid.getBounds(padding), null, null, null, null, null, 
        (pattern)=>{// readyCB
            // (Optional): You can also set the dot's color to be this pattern. 
            // once the camera is loaded, we're setting the grid's dots color to the value of the pattern
            grid.setColor(pattern)
        }
    )
```

 **Note:** Camera/screen share will not be available when using insecure origins. *(http://)* 

# [Render](#table-of-contents)

Render is a class that centralizes most context operations. It provides functions to get *lines* and *text*, as well as functions to *stroke / fill* them. Most of the calls to this class are automated via other classes (such as *Dot* and *FilledShape*), except for the utility line getters which allow more customization. It also provides access to style profiles for lines and text (RenderStyles, TextDisplay). Finally, it is automatically instantiated by, and linked to, any Canvas instance and should not be instantiated manually.

#### Example use 1:
###### - Manually drawing a custom bezier curve 
```js
    // Running in the drawEffectCB of a dummy shape...
    {
        ...
        
        // Drawing a bezier curve from [100, 100] to [100, 200], using the default control points, in red
        render.stroke(Render.getBezierCurve([100,100], [100, 200]), [255, 0, 0, 1])
        
    }
```

#### Example use 2:
###### - Manually drawing a custom filled quadratic curve
```js
    // Running in the drawEffectCB of a dummy shape...
    {
        ...
        
        // Drawing a bezier curve from [100, 400] to [400, 300], using the default control points with 0.5 spread
        render.fill(Render.getQuadCurve(startPos, endPos, Render.getDefaultQuadraticControlPos([100, 400], [400, 300], 0.5)))
        
    }
```

#### Example use 3:
###### - Smoothly drawing a sine graph
```js
    // Creating an empty obj to draw a sine graph
    CanvasUtils.createEmptyObj(CVS, obj=>{// loopCB

        // Receiving the path through the obj's setupResults, and drawing it
        const path = obj.setupResults
        if (path) CVS.render.batchStroke(path)

    }, obj=>{// setupCB

        // Generating a new path 500 times at 10ms intervals
        CDEUtils.repeatedTimeout(500, (i)=>{

            // Generating and updating the drawn path
            obj.setupResults = Render.generate(
                [10, 10],             // The start position of the generation
                (x)=>Math.sin(x)*100, // The function providing a Y value depanding on a given X value. (x)=>{... return y}
                i,                    // The width of the generation. Will be 500px at the end
                segmentCount = 200    // The precision in segments of the generated result
            )
            
        }, 10)
    })
```

# [RenderStyles](#table-of-contents)

The RenderStyles class allows the customization of renders via style profiles when drawing with the *Render* class. By default, the following profiles are created and accessible via any Render instance: `defaultProfile` and `profile1`, to `profile5`. There is also a `profiles` array to add more custom profiles.

#### **The RenderStyles constructor takes the following parameters:**
###### - `new RenderStyles(render, color, filter, compositeOperation, opacity, lineWidth, lineDash, lineDashOffset, lineJoin, lineCap)`
- **render** -> The canvas Render instance.
- **color** -> Either an RGBA array `[r, g, b, a]` or a `Color` instance.
- **filter** -> A string containing a filter in CSS formatting: `"blur(5px)"`, `url(#svgFilterId)`, etc. (Usage of filters may cause some performance issues, and some SVG filters can be invasive)
- **compositeOperation** -> The composite operation used. One of `Render.COMPOSITE_OPERATIONS` (see [global composite operations](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation) for more information) (some composite operations can be invasive)
- **opacity** -> The alpha value of the object ranging from 0 to 1. (This alpha is additive to the object's color alpha).
- **lineWidth** -> The width in px of the drawn line.
- **lineDash** -> Gaps length within the line
- **lineDashOffset** -> Offset in px of the start of the gaps (dashes).
- **lineJoin** -> Determines the shape of line joins. Either: *miter*, *bevel* or *round*
- **lineCap** -> Determines the shape of line ends. Either: *butt*, *square* or *round*


**Note:** See [MDN Canvas API documentation](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineCap) for more information on line styling properties.


### **To create a new style profile,** use the duplicate() function:
###### -  duplicate(render?, color?, lineWidth?, lineDash?, lineDashOffset?, lineJoin?, lineCap?)
```js
    // Creating a new style profile from the RenderStyles' template profile
    const myNewStyleProfile = RenderStyles.DEFAULT_PROFILE.duplicate(CVS.render)

    // Adding a new style profile to the render's custom profile list
    CVS.render.profiles.push(myNewStyleProfile) //The style profile is now accessible via render.profiles

    // OR

    // use the render instance function: createCustomStylesProfile()
```

### **To reuse a style profile for multiple styles,** use the update() function:
###### -  update(color?, lineWidth?, lineDash?, lineDashOffset?, lineJoin?, lineCap?)
```js
    {// Running in the drawEffectCB function of some shape...
        
        // ...
        
        // Drawing a line between a dot and its ratioPos, using the profile1 styles and updating the color, lineWidth, lineDash, lineDashOffset
        CanvasUtils.drawLine(dot, dot.ratioPos, render.profile1.update(Color.rgba(0,255,255,CDEUtils.mod(1, ratio, 0.8)), 4, [5, 25], 10))
    
        // Drawing a dot's connections, using again the profile1 styles and updating only the color, lineWidth
        CanvasUtils.drawDotConnections(dot, render.profile1.update([255,0,0,1], 2))
    }

```

 

#### Example use 1:
###### - Styling a bezier curve (based on the example in *Render*)
```js
    // Running in the drawEffectCB of a dummy shape...
    {
        ...
        
        // Drawing a bezier curve from [100, 100] to [100, 200], using the styles from the render's profile1
        render.stroke(Render.getBezierCurve([100,100], [100, 200], [150, 100], [100, 150], render.profile1)
    }
```

#### Example use 2:
###### - Styling connections
```js
    // Running in the drawEffectCB of a dummy shape...
    {
        ...
    
    // Drawing the connections between dots, and styling them with an updated version of render's profile1 and a custom lineType
    CanvasUtils.drawDotConnections(dot, render.profile1.update(
            Color.rgba(255, 0, 0, CDEUtils.mod(1, ratio, 0.8)), // updating the color to a dynamically shaded red
            4,   // updating the lineWidth to 4px
            [10] // updating the lineDash to 10px
        ),
        0, // no radius padding
        Render.LINE_TYPES.CUBIC_BEZIER // using a default bezier curve
    )
        
    }
```

# [TextStyles](#table-of-contents)

The TextStyles class (similar to TextStyles) allows the customization of text via style profiles when drawing text with the *TextDisplay* class. By default, the following profiles are created and accessible via any Render instance: `defaultTextProfile` and `textProfile1` to `textProfile5`. There is also a `textProfiles` array to add more custom profiles. *(Most functions from TextStyles apply very similarly to TextStyles)*

#### **The TextStyles constructor takes the following parameters:**
###### - `new TextStyles(render, font, letterSpacing, wordSpacing, fontVariantCaps, direction, fontStretch, fontKerning, textAlign, textBaseline, textRendering)`
- **render** -> The canvas Render instance.
- **font** -> The text font properties as a string. Ex: "italic 32px Arial"
- **letterSpacing** -> The gap in pixels between the letters.
- **wordSpacing** -> Then gaps in pixels between the words.
- **fontVariantCaps** -> Specifies an alternative capitalization style.
- **direction** -> Specifies the text writing direction.
- **fontStretch** -> The text stretching property.
- **fontKerning** -> Whether the default spacing of certain letters is uniform.
- **textAlign** -> The text horizontal alignment.
- **textBaseline** -> The text vertical alignment.
- **textRendering** -> The text rendering optimization method.


**Note:** See [MDN Canvas API documentation](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font) for more information on text styling properties.


# [Anim](#table-of-contents)

The Anim class allows the creation of smooth animations and the use of easings.

#### **The Anim constructor takes the following parameters:**
- **animation** -> Callback containing the animation code `(progress)=>{...}`.
- **duration** -> The duration in milliseconds. (Negative values will make the animation repeat infinitely).
- **easing** -> The easing function to be used `(x)=>{... return x}`.
- **endCallback**? -> Custom callback ran upon the animation ending.

### **To play an animation:** 
Use the playAnim() function on any canvas object. All objects have an `anims` property containing the `currents` and the `backlog` animations.

- **The `currents` behave like this:** By default, an animation is added to the `currents` array. Every animation in the `currents` array runs simultaneously.

- **The `backlog` behaves like this:** When the `isUnique` parameter is `true`, animations get added to the end of the backlog queue of an object. Animations are then played one at a time, upon their arrival at the first index of the queue. Setting the `force` parameter to `true` terminates the current backlog animation and instantly replaces it with the provided `anim` parameter.

###### - playAnim(Anim, isUnique, force)
`Currents` animations:
```js
    // Dummy animations
    const someAnim = new Anim(/* some parameters ... */)
    const anotherAnim = new Anim(/* some other parameters ... */)
    
    // This will run all both anims simultaneously
    dummyShape.playAnim(someAnim)
    dummyShape.playAnim(anotherAnim)

```
    

`Backlog` animations:
```js
    // Dummy animations
    const someUniqueAnim = new Anim(/* some parameters ... */)
    const uniqueAnimationThatNeedsToRunNOW = new Anim(/* some other parameters ... */)
    
    // This will queue the animation to be run once all previously queued animations are completed.
    dot.playAnim(someUniqueAnim, true)
    
    // Will terminate and replace any animation running! (After 3 seconds)
    setTimeout(()=>{
        dot.playAnim(animationThatNeedsToRunNOW, true, true)
    }, 3000)
```

**To reset an animation,** use the reset() function:
```js
    // This will reset the animation to progress=0 
    anim.reset()
```
#### Example use 1:
###### - Fading a dot and deleting it once it's fully invisible
```js
    // Getting a dot
    const dot = dummyShape.dots[0]
    
    // Creating the animation
    const fadingAnimation = new Anim(
        (progress)=>{
            // fading off the dot over 5 seconds
            dot.a = 1 - progress
            
            // deleting the dot once invisible
            if (progress == 1) dot.remove()
        },
        5000 // 5 second duration
    )

    // playing the animation
    dot.playAnim(fadingAnimation)
```

#### Example use 2:
###### - Making a dot smoothly move back and forth 200px, while blinking, every second, for eternity 
```js
    let distance = 200, ix = dot.x
    dot.playAnim(new Anim((progress, playCount, deltaTime)=>{
        // fading the dot over 1 second
        dot.a = 1 - progress
        
        // moving the dot left or right depending on if the animation play count is pair
            dot.x = ix + ((playCount%2)||-1) * distance * progress
            if (progress==1) ix = dot.x
        
    }, -1000)) // repeats every 1 seconds because of the "-"
```

 
# [Input Devices](#table-of-contents)

## [TypingDevice](#table-of-contents)
The TypingDevice class is automatically created and accessible by any Canvas instance. It provides information about the user's keyboard, such as the current keys pressed.

**Note:** for setting the *keyup* and *keydown* event listeners, use the prebuilt functions from the Canvas class.

#### **The TypingDevice's main attributes are**:
- **keysPressed** -> The keys which are currently pressed.


### **To set the keys event listeners,** use the following prebuilt functions:
###### - setKeyDown(cb, global), setKeyUp(cb, global)
```js
    // Setting the keydown listener
    CVS.setKeyDown()
    
    // Setting the keyup listener with a custom callback (typingDevice, event)=>
    CVS.setKeyUp((typingDevice, e)=>{
        console.log("Custom callback: ", typingDevice, e)
    })
    
    // OR
    
    // Setting both listeners globally. (This will detect the key inputs even when the canvas is not directly focused)
    CVS.setKeyDown(null, true)
    CVS.setKeyUp((typingDevice, e)=>{
        console.log("Custom callback: ", typingDevice, e)
    }, true)
```

### **To get whether a certain key is down,** use the isDown() function:
###### - isDown(keys)
```js
    // Accessing the typing device's "a" key state
    const isKey_A_down = CVS.typingDevice.isDown("a")
    
    console.log("Is the 'a' key down: ", isKey_A_down)

    // OR

    // Checking whether one of muliple keys is down
    const arrowKeys = [TypingDevice.KEYS.ARROW_UP, TypingDevice.KEYS.ARROW_DOWN, TypingDevice.KEYS.ARROW_LEFT, TypingDevice.KEYS.ARROW_RIGHT]
    const isAnyArrowKeyPressed = CVS.typingDevice.isDown(arrowKeys)
    
    console.log("Is pressing any arrow key: ", isAnyArrowKeyPressed)
```

## [Mouse](#table-of-contents)

The Mouse class is automatically created and accessible by any Canvas instance. It provides information about the user's mouse, such a position, speed, direction, and buttons pressed as well as adding custom listeners.

**Note:** for setting the *move*, *leave*, *up*, and *down* mouse event listeners, use the prebuilt functions from the Canvas class.

#### **The Mouse's main attributes are**:
- **valid** -> Whether the mouse pos is valid(is inside the canvas and initialized).
- **x** -> The current x value of the mouse on the canvas.
- **y** -> The current y value of the mouse on the canvas.
- **dir** -> The direction in degrees of the mouse's last movement.
- **speed** -> The current speed (in px/s) of the mouse.
- **clicked** -> Whether the main button of the mouse is pressed.
- **rightClicked** -> Whether the secondary button of the mouse is pressed.
- **scrollClicked** -> Whether the scroll button of the mouse is pressed.
- **extraForwardClicked** -> Whether the extra forward button of the mouse is pressed.
- **extraBackClicked** -> Whether the extra back button of the mouse is pressed.
- **holdValue** -> A custom value to set manually. Ex: can be used to reference an object the mouse is holding more easily.
- **listeners** -> The list of all current listeners grouped by type.

### **To set the mouse event listeners,** use the following prebuilt functions:
###### - setMouseMove(cb, global), setMouseLeave(cb, global), setMouseDown(cb, global), setMouseUp(cb, global)
```js
    // Setting the mousemove listener
    CVS.setMouseMove()

    // Setting the mousedown listener with a custom callback (mouse, event)=>
    CVS.setMouseDown((mouse, e)=>{
        console.log("Custom callback: ", mouse, e)
    })

    // OR
    
    // Setting listeners globally. (This will detect the mouse inputs even if the mouse is not directly interacting with the canvas)
    CVS.setMouseMove(null, true)
    CVS.setMouseDown((mouse, e)=>{
        console.log("Custom callback: ", mouse, e)
    }, true)
    CVS.setMouseUp((mouse, e)=>{
        console.log("Other custom callback: ", mouse, e)
    }, true)
```

### **To manage custom listeners,** use the following functions:
###### - addListener(obj, type, callback, useAccurateBounds, forceStaticPositions)
###### - updateListener(type, id, newObj, newCallback, useAccurateBounds, forceStaticPositions), 
###### - removeListener(type, id)
```js

    // Adding a mouse down to a canvas object
    const listenerId = CVS.mouse.addListener(someShape, Mouse.LISTENER_TYPES.DOWN, (obj, mousePos)=>{
        console.log("The shape was clicked!")
    })

    // Updating the previous listener's callback. (Setting newObj/newCallback to null doesn't update it)
    CVS.mouse.updateListener(Mouse.LISTENER_TYPES.DOWN, listenerId, null, (obj, mousePos)=>{
        console.log("This is the new click callback!")
    })

    // Removing the aforementioned listener
    CVS.mouse.removeListener(Mouse.LISTENER_TYPES.DOWN, listenerId)
```

#### Example use 1:
###### - Making a dot throwable, and changing its color on mouse hover and click
```js
// Using the getDraggableDotCB utility function to get a dragCallback
const dragCallback = CanvasUtils.getDraggableDotCB()

// Creating a mostly default shape, with a single dot
const throwableDot = new Shape([10, 10], new Dot([10, 10]), null, null, null, 
    (render, dot, ratio, setupResults, mouse, dist, shape)=>{// drawEffectCB callback

        // Changing the dot's size based on mouse distance for an additional small effect
        dot.radius = CDEUtils.mod(shape.radius*2, ratio, shape.radius*2*0.5)
        
        // Checking if the mouse is hovering the dot
        const isMouseOver = dot.isWithin(m.pos)
        
        // if the mouse is over and clicked, set the dot's color to red
        if (isMouseOver && m.clicked) {
            dot.color = [255, 0, 0, 1]
        }
        // if the mouse is only over, set the dot's color to green
        else if (isMouseOver) {
            dot.color = [0, 255, 0, 1]
        }
        // if the mouse is neither over nor clicked, set the dot's color to white
        else {
            dot.color = [255, 255, 255, 1]
        }
    
        // Calling the dragCallback to make the dragging and throwing effect
        dragCallback(shape.dots[0], m, dist, ratio)
    }
)

// Adding the shape
CVS.add(throwableDot)
```

#### Example use 2:
###### - Creating a custom button
```js
// Creates a custom button
function createButton(text="Test yo man big button", pos=[500, 100], onClickCallback, backgroundColor="aliceblue", textColor="red", padding=[20, 30]) {

    // Creating the button's text
    const textDisplay = new TextDisplay(text, [0,0], textColor, null, null, null, (self)=>{// setupCB
        // Creating and adding to the canvas the button's box/background according to the text's size
        const [width, height] = self.trueSize, w = width/2+padding[1]/2, h = height/2+padding[0]/2,
              button = CVS.add(new FilledShape(backgroundColor, true, pos, [new Dot([-w,-h]),new Dot([w,-h]),new Dot([w,h]),new Dot([-w,h])], 0, backgroundColor))


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
    }, null, self=>self.setupResults)
    
    // Adding the text to the canvas
    CVS.add(textDisplay)
   
    // Returning the button and text objects
    return [textDisplay.setupResults, textDisplay]
}
 
// Creating a custom button!
createButton("My custom button", CVS.getCenter(), (button, text)=>{// onClick

    // Playing a rotation animation
    button.playAnim(new Anim((prog)=>{
        button.rotateAt(360*prog)
        text.rotateAt(360*prog)
    }, 5000, null, ()=>{// anim's endCallback
        // Disabling the accurate mouse move listeners mode once the rotation animation is finished (better for performance)
        CVS.disableAccurateMouseMoveListenersMode()
    }), true, true)

    
    // Enabling accurate move listeners mode, this makes the mouse enter/exit events accurate when the object is moving
    CVS.enableAccurateMouseMoveListenersMode()
    console.log("Custom button clicked!")
})
```

# [Utilities](#table-of-contents)

## [CanvasUtils](#table-of-contents)
The CanvasUtils class provides generic functions for common effects.

### DrawOuterRing
This function is used to draw a ring around a dot.
###### drawOuterRing(dot, color, radiusMultiplier, forceBatching)
```js

{// (Running in the drawEffectCB() function of some shape...)
    //...
    // Draws a ring around the dot, 3x bigger than the dot's radius and of the same color
    CanvasUtils.drawOuterRing(dot, dot.colorObject, 3)   
}
```

### RotateGradient
This function is used to rotate the gradient of an object.
###### rotateGradient(obj, duration=1000, speed=1, isFillColor=false)
```js
    // (Running in dummyFilledShape' setupCB)
    // rotateGradient should only be called once, as it starts an infinite animation
    {
        //...
        // Rotates the shape's gradient filling. Completes a revolution in 3 seconds
        CanvasUtils.rotateGradient(dummyFilledShape, 3000, 1, true)
    }
    
```

### CreateEmptyObj
This function is used to create a blank object with only a loopCB and/or setupCB. Useful to draw non objects which often require a loop.
###### createEmptyObj(cvs, loopCB, setupCB)
```js
CanvasUtils.createEmptyObj(CVS, obj=>{// loopCB

    // Drawing a line from [0,0] to [100, 100]
    CVS.render.batchStroke(Render.getLine([0,0], [100, 100]))
})
```

### getDraggableDotCB
This function is used to make a dot throwable.
###### getDraggableDotCB(pickableRadius=50)
```js
// getDraggableDotCB should only be called once, but it returns a callback that needs to be called every frame

// (Running in of some js file)
// Provides the callback to make the dot throwable. 
const dragAnimCallback = CanvasUtils.getDraggableDotCB()

//...

// (Running in the drawEffectCB() function of some shape...)
{
    ...
    // Only for the first dot of the shape
    if (shape.firstDot.id == dot.id) {
        // Makes the dot pickable in a 100px radius, and throwable using default CDE physics (works best on higher refresh rates)
        dragAnimCallback(dot, mouse, dist, ratio, 100)
    }
}
```

### getTrailEffectCB
This function is used to make an object have a customizable trail effect when moving.
###### getTrailEffectCB(canvas, obj, length=8, moveEffectCB=null, disableDefaultMovements=false)
```js
// getTrailEffectCB should only be called once, but it returns a callback that needs to be called every frame

// Here we create a shape with a single dot receiving the trail effect.
const trailingDot = new Shape([200, 100], new Dot(), null, "lime", null,
    (render, dot, ratio, [dragCB, trailCB], mouse, dist, shape)=>{// drawEffectCB
    
        // Make sure the effect is only running on the desired dot (Optional in this example, since there is only one dot)
        if (dot.id==shape.firstDot.id) {
            dragCB(shape.firstDot, mouse, dist, ratio) // see previous example for details
            trailCB(mouse) // call the trail effect callback every frame and give it the mouse in parameter
        }
}, null, (shape)=>{// setupCB

    // Here we get/initialize both effect callbacks in an array to be reused in the drawEffectCB
    return [
    
        CanvasUtils.getDraggableDotCB(), // see previous example for details
        
        
        // Creating a trail effect based on the shape's first dot, with a length of 10
        CanvasUtils.getTrailEffectCB(CVS, shape.firstDot, 10, (dot, ratio, isMoving, mouse)=>{// moveEffectCB
            
            // This callback is called every frame
            // "ratio" is the index of the object in the trail divided by the length of the trail
            // "isMoving" represents whether the object is currently moving or not
            
            //While the user is dragging/moving the dot, every trail object has a set value
            if (isMoving && mouse.clicked) {
                dot.a = ratio
                dot.radius = 25*(1-ratio)
            }

            // otherwise, the trail objects progressively lose visibility
            dot.a -= (1-ratio)/1000
            dot.radius = 25*ratio
        })
        
    ]
})

// Add the shape to the canvas
CVS.add(trailingDot)
```

### drawLine
This function is used to draw a connection between a Dot and another pos/object.
###### drawLine(dot, target, renderStyles, radiusPaddingMultiplier=0, lineType, spread, forceBatching)
```js
{// (Running in the drawEffectCB() function of some shape...)
    //...
    // Only if the distance with the ratioPos is lower than the shape's limit
    if (dist < shape.limit) {
        // Draws a line between the dot and the dot's ratioPos, adjusting the opacity of the line via the distance ratio
        CanvasUtils.drawLine(
            dot,        // start Dot
            [200, 200], // end position (can also be a Dot)
            render.profile.update(
                Color.rgba(dot.r,dot.g,dot.b,CDEUtils.mod(0.5, ratio)) // updates only the color, but uses every previously set styles
            )
        )
    }
}
```

### drawDotConnections
This function is used to draw the connections between a Dot and the ones in its `connections` attribute. **(Especially useful when using a Grid!)**
###### drawDotConnections(dot, renderStyles, radiusPaddingMultiplier=0, lineType, spread, forceBatching)
```js
{// (Running in the drawEffectCB() function of some shape...)
    //...
    // Draws lines between the dot and its connections, using the shape's color, and with a start padding of 2.5x the radius
    CanvasUtils.drawDotConnections(dot, shape.colorObject, 2.5)
}
```

### drawOutline
This function is used to draw a rectangular outline of the minimal area containing all of the provided object
###### drawOutline(render, obj, color=[255,0,0,1])
```js
{// (Running in the loopCB() function of some object...)
    //...
    // Draws a red box containing all of the obj
    CanvasUtils.drawOutline(CVS.render, obj, [255,0,0,1])
}
```
 

**Note:** Functions in this class only accept RGBA arrays or a Color instance for the *color* parameter.

****
### Generic follow paths
The object FOLLOW_PATHS provides generic follow paths.

- #### Infinity Sign
  **Provides a sideways "8"-like follow path.**                                                                    
  *`INFINITY_SIGN(width, height, progressOffset)`*

- #### Circle
  **Provides a circular follow path.**                                                                    
  *`CIRCLE(width, height, progressOffset)`*

- #### Rectangle
  **Provides a rectangular follow path.**                                                                    
  *`RECTANGLE(width, height, progressOffset)`*

- #### Quadratic
  **Provides a vertical quadratic curve follow path.**                                                                    
  *`QUADRATIC(width, height, isFliped)`*

- #### Linear
  **Provides a linear follow path.**                                                                    
  *`LINEAR(width, a)`*

- #### Sine Wave
  **Provides a sine wave-like follow path.**                                                                    
  *`SINE_WAVE(width, height)`*

- #### Cosine Wave
  **Similar to Sine Wave, provides a cosine wave-like follow path.**                                            
  *`COSINE_WAVE(width, height)`*

- #### Relative
  **Doesn't move the dot, unless provided a x/y value. Also accepts other generic follow paths as x/y values.**        *`RELATIVE(forceX?, forceY?)`*


#### Example use 1:
###### - Make a dot follow a circle of 200px radius, over 5 seconds
```js
    dummyShape.dots[0].follow(5000, Anim.linear, null, CanvasUtils.FOLLOW_PATHS.CIRCLE(400, 400))
```

#### Example use 2:
###### - Drawing a sine wave graph
```js
const manualSineWaveDrawer = new Shape([100, 100], [
    new Dot(), // adding a blank dot
    new Dot([10, 0],null,null,null,(dot, shape)=>shape.firstDot) // adding a dot with the first dot as its anchorPos
], null, null, 100, (render, dot, ratio)=>{// shape's drawEffectCB

    // drawing a dotted red line between the two dots
    CanvasUtils.drawDotConnections(dot, render.profile1.update([255,0,0,1], null, null, null, [5]))

    // simple radius hover effect
    dot.radius = CDEUtils.mod(_Obj.DEFAULT_RADIUS*2, ratio, _Obj.DEFAULT_RADIUS*2*0.8)

}, null, (shape)=>{// Shape's setupCB
    
    // making the first dot follow a circle path over 5 seconds
    shape.firstDot.follow(5000, null, (prog, dot)=>{
        shape.add(new Dot(null, 4, null, null, dot.pos)) // creating a new dot each frame at the dot's pos
    }, CanvasUtils.FOLLOW_PATHS.CIRCLE(null, null, 0.5))

    
    // making the second dot follow a linear path for its X value and not providing any forced Y value (The Y value will be changed via the anchorPos).
    shape.dots[1].follow(5000, Anim.LINEAR, (prog, dot)=>{
        shape.add(new Dot(null, 2, "red", null, dot.pos)) // creating a new dot each frame at the dot's pos
    }, CanvasUtils.FOLLOW_PATHS.RELATIVE(CanvasUtils.FOLLOW_PATHS.LINEAR(800, 0)))

    // adding a connection between the first and second dot
    shape.firstDot.addConnection(shape.dots[1])

}, null, null, true)

//Adding the shape to the canvas
CVS.add(manualSineWaveDrawer)
```


## [CDEUtils](#table-of-contents)
The CDEUtils class provides utilities such as `random`, `clamp`, `FPSCounter`, and `mod`.

### Linear interpolation (mod)
This function is used to get a value in a range.
###### mod(max, ratio, range)
```js
    // (Running in the drawEffectCB() function of some shape...)
    {
        ...
        // It is recommended to always put the ratio provided by drawEffectCB() as the second parameter of mod.
        // The dot opacity will go from 1(max) to 0.2(min) depending on the value of the ratio
        dot.a = CDEUtils.mod(1, ratio, 0.8)   
    }
```

### random
This function is used to return a random value. (decimal or whole)
###### random(min, max, decimals=0)

### clamp
This function is used to clamp a value within certain bounds.
###### clamp(value, min=Infinity, max=Infinity)

### getDist
This function is used to return the Pythagorean distance between two positions.
###### getDist(x1, y1, x2, y2)

### getMinMax
This function is used to return the biggest and lowest values within an array. (propPath can be used to specify a property path to access the values to compare if the array contains objects)
###### getMinMax(arr, propPath=null)

### repeatedTimeout
This function is used to run a callback for a specific amount of time.
###### repeatedTimeout(iterationCount, callback, delay=5)

## [FPSCounter](#table-of-contents)
The FPSCounter class allows to get the live frame per second value of a running loop.


#### Example use:
###### - Displaying the canvas FPS
```js
// Creating a FPSCounter instance
const fpsCounter = new FPSCounter()

// Creating a Canvas
const CVS = new Canvas(canvas, ()=>{//loopingCB

    // Get the fps value (needs to be run each frame)
    const fpsValue = fpsCounter.getFps()
    
    // Displaying the live FPS
    document.getElementById("fps_display").textContent = fpsValue+" fps"
})
```

# [Npx Commands](#table-of-contents)

Here is the list of available npx commands:

### To access all cdejs commands remotly / other util commands

#### `npx cdejs <commandName> <params?>`

This is the global cdejs command. It provides access to all regular cdejs commands and some more. It also provides basic command autocompletion upon receiving an uncomplete command name.

#### Example use 1:
Creating a project template using the `cdejs-template` command. (see below for more details)
`npx cdejs template myProjectName`

#### Example use 2:
Lists all available cdejs commands. (As well as aliases)
`npx cdejs list`


### To create a project template

#### `npx cdejs-template <projectName?>` | *`npx cdejs-t <projectName?>`*

This command creates a **modular** CanvasDotEffect project template. It accepts an optional project name as parameter.

### To create a browser project template

#### `npx cdejs-browser-template <projectName?>` | *`npx cdejs-bt <projectName?>`*

This command creates a **non modular** CanvasDotEffect project template. It accepts an optional project name as parameter.

### To create the CDECanvas React component

#### `npx cdejs-react`

This command creates the proposed CDECanvas React component, for usage of this library with React. (See [React component template](#react-component-template) for more informations)

### To open the documentation

#### `npx cdejs-documentation` | *`npx cdejs-doc`*

This command opens the library documentation in the default browser.

### To view classes / common callbacks signatures

#### `npx cdejs-signature <filter?> <withDefaultValues?>` | *`npx cdejs-sig <filter?> <withDefaultValues?>`*

This command shows the signature of classes and common available callbacks. It accepts an optional filter as its first parameter. 

Examples: 
- `npx cdejs-signature *` will return every available signature

- `npx cdejs-signature shape` will return every available signature containing "shape" (*Shape / FilledShape*)

- `npx cdejs-signature dot true` will return the *Dot* signature and will show all default parameters

# [React component template](#table-of-contents)

Here is the proposed CDECanvas React component. Run **`npx cdejs-react`** or create a CDECanvas.jsx file and copy and paste the code below.

```jsx
import {forwardRef, useEffect, useImperativeHandle, useRef} from "react"
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
        else CVS.start()

        // On unmount
        return ()=>CVS.stopLoop()
    }, [])

    return <canvas ref={htmlElementCanvasRef}></canvas>
})
```

# [Execution Order](#table-of-contents)

### Level 1: Static setup
**This is mostly the declaration state, nothing is fully created / usable just yet.**
- Canvas instance creation
- Initial canvas object creation (shapes, dots, ...)
- Adding the initial canvas objects to the canvas
- Settings events listeners
- Starting the main loop

### Level 2: Adding canvas objects to the canvas
**Once everything is declared, objects will start getting added to the canvas.**
- Sets the *parent* attribute on *references* and *definitions*
- Runs the `initialize()` function on both *references* and *definitions* (On every added object)
- Adds objects as *references* or *definitions* in the canvas

### Level 3: Root canvas object initialization
**At this point all *references* and *definitions* are initialized. By initializing a *reference*, we also initialize its children (ex: dots).**
- Creates / adds all of the shapes' dots and sets some of their attributes
- Runs the `initialize()` function for each dot contained in the shape. (After getting its `initialize()` function called, the shape calls the `initialize()` of all its dots, while also setting some of their attributes.)

**Runs the following on applicable objects:**
- if `initPos` is a callback -> `initPos(canvas, this)`
- if `initDots` is a string -> `createFromString(initDots)`
- if `initDots` is a callback -> `initDots(this, canvas)`
- if `initRadius` is a callback -> `initRadius(this)`
- if `initColor` is a callback -> `initColor(render, this)`
- `setupCB(this, parent)`
- if a FilledShape and `fillColor` is a callback -> `initFillColor(render, this)`
- Adjusts the `pos` according to the `anchorPos`
- Sets the `initialized` attribute to `true` for shapes

### Level 4: Children's initialization
After this, every dot will be initialized, and all canvas objects will be ready to be drawn.

**Runs the following on referenced dots (*dots in shapes*):**
- if `initPos` is a callback -> `initPos(parent, this)`
- if `initRadius` is a callback -> `initRadius(parent, this)`
- if `initColor` is a callback -> `initColor(render, this)`
- `setupCB(this, parent)`
- Adjusts the `pos` according to the `anchorPos`

### Level 5: Drawing stage
**This is where the canvas objects will appear on the canvas. Starts when calling `start()` on the Canvas instance. The `draw` function runs every frame for every canvas object. The following will happen:**
- DeltaTime becomes available via the Canvas instance
- Updates the object's `pos` according to the `anchorPos`
- Plays the object's animations, if any
- Sets the `initialized` attribute to `true` for dots after 1 frame
- Runs the `drawEffectCB` for dots
- Runs the `loopCB` for all objects
- Visually draws the dots
- Updates the `ratioPos` for shapes if `ratioPos` is a function
- Draws the fill area of filled shapes

 

**Notes:**
- *Reference:* an object containing other objects. (ex: Shape, FilledShape, Grid)
- *Definition:* a standalone object. (ex: Dot without a parent Shape, TextDisplay, ImageDisplay)

- When accessing a shape's dots within the *setupCB* call, dots will have their *initialized* attribute set to *false*, but will still be mostly fully initialized, and thus, usable. (Only applicable for dots)

 

# [Optimization](#table-of-contents)
To keep the best performance in your website/app, you may want to use some optimization techniques. Here are some tips you can use to optimize your effects.


## - Using a static canvas:
Using a static canvas is a lot more performant when working with stuff that doesn't need to be updated often.

#### Static canvas example:
```js
// Creating a static canvas uses the same declaration as a classic canvas
const staticCVS = new Canvas(canvasElement, ()=>{/*Custom callback that gets call each frame*/})

// ** Here you would declare and add all the shapes and objects **

// Here is a simple shape for example
const dummyShape = new Shape([100, 100],[new Dot([-50, -50]),new Dot([-50, 50]),new Dot([50, -50]),new Dot([50, 50]),])
staticCVS.add(dummyShape)

// Once declarations are done, initialize the canvas as static
staticCVS.initializeStatic()

```
#### Updating a static canvas:
```js
// (Considering the example above ↑)
// You can use the following:

// Draw a single frame
staticCVS.drawStatic()

// Clear the canvas
staticCVS.clear()

// Clear the canvas and draw a frame
staticCVS.cleanDrawStatic()
```
**Notes:** 
- Since there is no drawing loop, you do not need to run `CVS.start()`
- You can also overlay dynamic and static canvases to seamlessly distribute the drawing process.
 

## - Optimize repetitive operations:
Callbacks such as `drawEffectCB` can sometimes run thousands of times per second, so make sure these are as optimized as possible.

#### Optimization examples for `drawEffectCB`:
```js
/*
In this example, we compare two drawEffectCB that both do the same thing,
one version is optimized while the other isn't.
*/


const badDrawEffectCB = (render, dot, ratio, dragAnim, mouse, dist, shape)=>{

    // Logging the current dot to the console
    console.log(dot)

    // Dynamically updating the current dot's alpha
    dot.a = CDEUtils.mod(1, ratio, 0.6)
    
    // Drawing a line between the current dot and its ratioPos
    CanvasUtils.drawLine(dot, dot.ratioPos, render.profile1.update(Color.rgba(0,255,255,CDEUtils.mod(1, ratio, 0.8))))

    // Running the draggableCB to make ONLY the first dot draggable (here dragAnim comes from the setupCB)    
    dragAnim(shape.dots[0], mouse, dist, ratio)
    
    // Updating the first dot's color on mouse hover/click
    const mouseOn = shape.dots[0].isWithin(mouse.pos)
    if (mouseOn && mouse.clicked) shape.dots[0].color = [255, 0, 0, 1]
    else if (mouseOn) shape.dots[0].color = [0, 254, 0, 1]
    else shape.dots[0].color = [255, 255, 255, 1]
    
}



const optimizedDrawEffectCB = (render, dot, ratio, dragAnim, mouse, dist, shape, isActive)=>{

    // Never leave console logs in drawEffectCb for production as these cause ABSOLUTELY HORENDOUS LAG, especially when the console is opened.
    // DONT DO THIS -> console.log(dot)

    // This was pretty much already optimized
    dot.a = CDEUtils.mod(1, ratio, 0.6)
    
    // Here, since the alpha is going to be 0, we can prevent drawing when the lines are not visible anyway (outside the shape's limit)
    if (dist < shape.limit) CanvasUtils.drawLine(dot, dot.ratioPos, render.profile1.update([0,255,255,CDEUtils.mod(1, ratio, 0.8)]))

    // We can store the firstDot into a variable to avoid the object lookups each time
    const firstDot = shape.dots[0]
    
    // Since only the first dot is made draggable, it is better to avoid calling the dragAnim for each dot
    if (firstDot.id == dot.id) {
        dragAnim(firstDot, mouse, dist, ratio)
        
        // Again, the effect is only for the first dot
        // Here we use the provided "isActive" variable to make sure the mouse checks are only running when necessary
        if (isActive) {// (isActive is only true if ratio < 1)
            const mouseOn = firstDot.isWithin(mouse.pos)
            if (mouseOn && mouse.clicked) firstDot.color = [255, 0, 0, 1]
            else if (mouseOn) firstDot.color = [0, 254, 0, 1]
            else firstDot.color = [255, 255, 255, 1]
        }
    }
    
}
```

# [Intended Practices](#table-of-contents)

- Putting `null` as any parameter value will assign it the default value.
- Putting `undefined` as any parameter value will override the default behavior if applicable.

- Use the `mod()` function for effective ratio usages.
- If needed and applicable, use the available prebuilt event listeners.
- More complex shapes can have very extensive declarations, declare them in a separate file(s) and use them in a centralized project file. 


****
### [Credits](#table-of-contents)

Made by Louis-Charles Biron !
