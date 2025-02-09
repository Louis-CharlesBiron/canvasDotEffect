![GitHub commit activity](https://img.shields.io/github/commit-activity/m/Louis-CharlesBiron/canvasDotEffect?link=https%3A%2F%2Fgithub.com%2FLouis-CharlesBiron%2FcanvasDotEffect%2Fcommits%2Fmain%2F&label=Commit%20Activity)
![GitHub last commit](https://img.shields.io/github/last-commit/Louis-CharlesBiron/canvasDotEffect?link=https%3A%2F%2Fgithub.com%2FLouis-CharlesBiron%2FcanvasDotEffect%2Fcommits%2Fmain%2F&label=Last%20Commit)
![GitHub Created At](https://img.shields.io/github/created-at/Louis-CharlesBiron/canvasDotEffect?label=Since&color=5F9EA0)

# CanvasDotEffect

**CanvasDotEffect is a lightweight JS library that helps create customizable and interactive dot-based effects using the Canvas API.**

# Table of content
# Table of Contents

- [Getting Started / Minimal setup](#getting-started--minimal-setup)
- [Classes](#classes)
  - [Canvas](#canvas)
  - [Obj](#obj)
  - [Dot](#dot)
  - [Shape](#shape)
  - [Filled Shape](#filled-shape)
  - [Grid](#grid)
    - [Grid Assets](#grid-assets)
  - [Color](#color)
  - [Gradient](#gradient)
  - [Render](#render)
  - [RenderStyles](#renderstyles)
  - [Anim](#anim)
  - [Input Devices](#input-devices)
    - [TypingDevice](#typingdevice)
    - [Mouse](#mouse)
  - [Utilities](#utilities)
    - [CanvasUtils](#canvasutils)
    - [CDEUtils](#cdeutils)
- [Execution order](#execution-order)
- [Intended practices](#intended-practices)
- [Credits](#credits)



## Getting Started / Minimal setup

1. **Get the library file. ([canvasDotEffect.min.js](https://github.com/Louis-CharlesBiron/canvasDotEffect/blob/main/dist/canvasDotEffect.min.js))** 
```HTML
    <head>
        ...
        <script src="canvasDotEffect.min.js"></script>
    </head>
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
    const dummyShape = new Shape([50,50],[new Dot()])
    
    // Add it to the canvas
    CVS.add(dummyShape)
```

5. **Set the mouse event listeners for mouse interactions.**
```js
    // Set up the prebuilt event listeners, allowing the creation of more interactive effects!
    CVS.setmousemove(/*custom callback*/)
    CVS.setmouseleave()
    CVS.setmousedown()
    CVS.setmouseup()
```

6. **Once everything is created and ready to go, start the drawing loop!**
```js
    // Start
    CVS.startLoop()
```

**- In the end, you should have something like this:**
```js
    const CVS = new Canvas(document.getElementById("canvasId"))
    
    // Creating and adding shapes ...
    const dummyShape = new Shape([50,50],[new Dot()])
    CVS.add(dummyShape)
    
    CVS.setmousemove(/*custom callback*/)
    CVS.setmouseleave()
    CVS.setmousedown()
    CVS.setmouseup()
    
    CVS.startLoop()
```



# Class descriptions
The following sections are a short documentation of each class, basically what it does and what are the most important aspects of it.

 

# Canvas

The Canvas class is the core of the project. It manages the main loop, the window listeners, the delta time, the HTML canvas element, all the canvas objects, and much more.

#### **The Canvas constructor takes the following parameters:**
###### - `new Canvas(cvs, loopingCallback, frame, settings)`
- **cvs** -> The HTML canvas element to link to.
- **loopingCallback**? -> A custom callback ran each frame.
- **fpsLimit**? -> The maximum fps cap. Defaults to V-Sync.
- **frame**? -> If you don't want the canvas to take the size of its direct parent, you can provide another custom HTML element here.
- **settings**? -> The custom canvas settings (leave blank for prebuilt default settings).
- **willReadFrequently**? -> If `true`, optimizes the canvas context for frequent readings. (Defaults to `false`)

 

**To add objects to the canvas,** use the add() function:
###### - add(objs, isDef, active=true)
```js
    // For a source object
    CVS.add(yourShape)

    // For a standalone object
    CVS.add(yourObject, true)
    
    // For a prefab or inactive shape
    CVS.add(yourShape, false, false)
```

**To set up mouse/keyboard listeners for the canvas,** use the following prebuilt functions:
```js
    // Set the important mouse events 
    CVS.setmousemove(/*possible custom callback*/)
    CVS.setmouseleave()
    CVS.setmousedown()
    CVS.setmouseup()

    // Set the important keyboard events 
    CVS.setkeydown(/*possible custom callback*/)
    CVS.setkeyup()
```

**To control the canvas loop**, use the following functions:
```js
    // Starts the main loop
    CVS.startLoop() 

    // Stops the main loop
    CVS.stopLoop()
```

#### Example use:
###### - Creating a Canvas instance that display fps
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
 

# Obj

The Obj class is the template class of any canvas object. **It should not be directly instantiated.**

#### **All canvas objects will have at least these attributes:**
- ***id*** -> Id of the object.
- **initPos** -> Initial pos declaration. Can either be a pos array `[x, y]` or a callback `(Canvas)=>{... return [x, y]}`
- ***pos*** -> Array containing the `[x, y]` position of the object.
- ***initRadius*** -> Initial radius declaration. Can either be a number or a callback `(parent or this)=>{... return radius}`
- **radius** -> The radius in px object the dot (Or the radius of its dots if is a Shape).
- ***initColor*** -> Initial color declaration. Can either be a color value (see ↓) or a callback `(ctx, this)=>{... return colorValue}`
- **color** -> Either a Color instance `new Color("red")`, a string `"red"`, a hex value `#FF0000` or a RGBA array `[255, 0, 0, 1]`
- **setupCB** -> Custom callback called on the object's initialization `(this, this?.parent)=>{}`s
- ***setupResults*** -> The value returned by the `setupCB` call.
- **anchorPos** -> The reference point from which the object's pos will be set. Can either be a pos `[x,y]`, another canvas object instance, or a callback `(this, Canvas or parent)=>{... return [x,y]}` (Defaults to the parent's pos, or `[0, 0]` if the object has no parent)
- **alwaysActive** -> Whether the object stays active when outside the canvas bounds.
- ***initialized*** -> Whether the object has been initialized.

**This class also defines other useful base functions**, such as:
- Movements functions (`moveBy`, `addForce`, `follow`, ...)
- Informative functions (`isWithin`, `posDistances`, `getInitPos`, ...)
- Access to the object's animation play (`playAnim`)

 


**The follow function:** use `follow()` to make an object follow a custom path:
###### - `follow(duration, easing, action, progressSeparations)`
```js
   /**
     * Used to make an object follow a custom path
     * @param {Number} duration: duration of the animation in ms
     * @param {Function} easing: easing function 
     * @param {Function?} action: a custom callback that can be called in addition to the movement                                                        //newProg is 'prog' - the progress delimiter of the range
     * @param {[[Number, Function], ...]} progressSeparations: list of callback paired with a progress range, the callback must return a position (prog, newProg, initX, initY)=>return [x,y]
     * progressSeparations example: [0:(prog)=>[x1, y1]], [0.5:(prog, newProg)=>[x2, y2]] -> from 0% to 49% the pos from 1st callback is applied, from 50%-100% the pos from 2nd callback is applied  
     */
     
    // Example use, for 3 seconds, easeOutQuad, no custom callback, will travel in a sideways 'L' shape 
    let dx=400, dy=200
    dot.follow(3000, Anim.easeOutQuad, null, [[0,(prog)=>[dx*prog, 0]], [0.5,(prog, newProg)=>[dx*0.5, dy*newProg]]])
```

 

# Dot

The dot class is **meant** to be the *core* of all effects. It appears as a circular dot on the canvas by default.

#### **The Dot constructor takes the following parameters:**
###### - `new Dot(pos, radius, color, setupCB, anchorPos, alwaysActive)`
- *pos, radius, color, setupCB, anchorPos, alwaysActive* -> See the Obj class.

Its other attributes are:
- **parent**? -> The shape in which the dot is contained, if any. 
- **connections** -> a list referencing other dots, primarily to draw a connection between them. 



**To add or remove connections,** use the following functions:
```js
    // Adding a connection with another dot
    dot.addConnection(otherDot)

    // Removing a connection
    dot.removeConnection(otherDot)
```

**To delete the dot**, use the following function:
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
        ()=>{           // custom callback ran on dot's initialization
            console.log("I am now added to the canvas and ready to go!")
        }
    )
    
    // Add the dot as a standalone object by setting the 'isDef' to 'true'. (definition)
    CVS.add(aloneDot, true)
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
    ], Obj.DEFAULT_RADIUS, Color.DEFAULT_COLOR, Shape.DEFAULT_LIMIT)
    
    // Add the shape along with all of its dots as a single unit. (reference)
    CVS.add(squareLikeFormation)
```

 

# Shape

The Shape class (or its inheritors) plays a crucial part in creating proper effects. It provides the needed control over a group of dots and is used to make pretty much any effect. An empty shape (containing no dots) on its own is not visible by default.

One of the main features is the ***drawEffectCB***. This callback allows the creation of custom effects for each dot in the shape.

Effects are often ratio-based, meaning the *intensity* of the effect is based on the distance between the dot and the *ratioPos*. You can control the affected distance with the *limit* parameter, and the the object to which the distance\ratio is calculated with the *ratioPosCB* parameter.

#### **The Shape constructor takes the following parameters:**
###### - `new Shape(pos, dots, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, anchorPos, alwaysActive, fragile)`
- *pos, radius, color, setupCB, anchorPos, alwaysActive* -> See the Obj class.
- **initDots** -> Initial dots declaration. Can either be: an array of dots `[new Dot(...), existingDot, ...]`, a **String** (this will automatically call the shape's createFromString() function), or a callback `(Shape, Canvas)=>{... return anArrayOfDots}` 
- ***dots*** -> Array of all the current dots contained by the shape. 
- **limit** -> Defines the circular radius in which the dots' ratio is calculated. Each dot will have itself as its center to calculate the distance between it and the shape's *ratioPos*. (At the edges the ratio will be 0 and gradually gravitates to 1 at the center)
- **drawEffectCB** -> A callback containing your custom effect to display. It is run by every dot of the shape, every frame. `(render, dot, ratio, mouse, distance, parent, parentSetupResults, isActive, rawRatio)=>{...}`.
- **ratioPosCB**? -> References the mouse position by default. Can be used to set a custom *ratioPos* target `(Shape, dots)=>{... return [x, y]}`. Can be disabled if set to `null`.
- **fragile**? -> Whether the shape resets on document visibility change events. (Rarer, some continuous effects can break when the page is in the background due to the unusual deltaTime values sometimes occurring when the document is offscreen/unfocused) 

**Its other attributes are:**
- **rotation** -> The shape's rotation in degrees. Use the `rotateAt`, `rotateBy`, `rotateTo` functions to modify.
- **scale** -> The shape's X and Y scale factors `[scaleX, scaleY]`. Use the `scaleAt`, `scaleBy`, `scaleTo` functions to modify.


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
4. Sets the dots' alwaysActive property to that of the shape, if not previously defined.
5. Sets the dots' parent attribute to reference the shape.


### **To modify dots' properties all at once,** use the following functions:
###### - setRadius(radius),  setColor(color), setLimit(limit)
```js
    // Sets the radius of all dummyShape's dots to 10
    dummyShape.setRadius(10)
    
    // Sets the color of all dummyShape's dots to red
    dummyShape.setColor("red")
    
    // Sets the limit of all dummyShape's dots to 100
    dummyShape.setLimit(100)

```

### **To dynamically generate a formation of dots** use the `generate` functions:
###### - generate(yTrajectory, startOffset, length, gapX, yModifier, generationCallback)
```js
    // Generating a sine wave based formation
    const generatedDots = Shape.generate(
        x=>Math.sin(x/50)*100, // make the y follow a sine wave pattern
        [-50, 0],              // the generation start is offset by -50 horizontally
        1000,                  // the generation will span 1000 px in length
        10,                    // the generation is sectionned in 10px intervals
        [5, -5],               // a range allowing random Y between the [min, max]
        (dot, nextDot)=>{
            dot.addConnection(nextDot) // adding a connection between each dot
        }
    )

CVS.add(a)

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
     ], null, normalColorTester, 100, (render, dot, ratio, mouse, dist)=>{
     
         // Changes the opacity and color according to mouse distance
         dot.a = CDEUtils.mod(1, ratio, 0.8)
         dot.r = CDEUtils.mod(255, ratio, -255)
         dot.g = CDEUtils.mod(255, ratio, -255)
         
         
         // Changes the dot's radius, from 2 times the default radius with a range of 80% (10px..2px), according to mouse distance
         dot.radius = CDEUtils.mod(Obj.DEFAULT_RADIUS*2, ratio, Obj.DEFAULT_RADIUS*2*0.8)
         
         // Draws a ring around the dot, at 5 times the radius
         CanvasUtils.drawOuterRing(dot, [255,255,255,0.2], 5)
     })

    // Adding it to the canvas
    CVS.add(simpleShape)
```

#### Example use 2:
###### - Single throwable dot, with color and radius effects
```js
    const draggableDotShape = new Shape([0,0], new Dot([10,10]), null, null, null, (render, dot, ratio, mouse, dist, shape, setupResults)=>{
        
        // Checking if the mouse is over the dot and clicked, and changing the color according to the state
        const mouseOn = dot.isWithin(mouse.pos, true)
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
    const backAndForthDotShape = new Shape([200,200],
        new Dot([0,0], null, null, (dot, shape)=>{
            let distance = 150, ix = dot.x
            dot.playAnim(new Anim((progress, playCount, deltaTime)=>{
                dot.x = ix + ((playCount % 2) === 0 ? 1 : -1) * distance * progress
                if (progress == 1) ix = dot.x
            }, -1000, Anim.easeOutBack))
        })
    )
    
    
    // Setting simpleShape's anchorPos to the dot of backAndForthDotShape. (Using a callback since the dot doesn't exist yet)
    simpleShape.anchorPos = () => backAndForthDotShape.firstDot
    
    
    // Adding the shape to the canvas
    CVS.add(backAndForthDotShape)

```

 

# Filled Shape

The FilledShape class is a derivative of the Shape class. It allows to fill the area delimited by the shape's dots.


#### **The FilledShape constructor takes the following parameters:**
###### - `new FilledShape(fillColor, dynamicUpdates, pos, dots, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, anchorPos, alwaysActive, fragile)`
- *pos, dots, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, anchorPos, alwaysActive, fragile* -> See the Shape class.
- **fillColor** -> Defines the color of the shape's filling. Either a color value, a Gradient instance, or a callback returning any of the previous two `(ctx, shape)=>{... return [r, g, b, a]}`.
- **dynamicUpdates** -> Whether the shape's fill area checks for updates every frame


**To update the fill area manually:** use the `updatePath()` function:

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

 

# Grid 

The Grid class is a derivative of the Shape class. It allows the creation of dot-based symbols / text. To create your own set of symbols (source), see the *Grid Assets* section.

#### **The Grid constructor takes the following parameters:**
###### - `new Grid(keys, gaps, spacing, source, pos, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, anchorPos, alwaysActive, fragile)`
- *pos, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, anchorPos, alwaysActive, fragile* -> See the Shape class.
- **keys** -> A string containing the characters to create.
- **gaps** -> The `[x, y]` distances within the dots.
- **source** -> The source containing the symbol's definitions. See the *Grid Assets* section.
- **spacing** -> The distance between each symbol. (Letter spacing)


**To update the keys, gaps, source, or spacing:** use the following function:

###### - `setKeys(keys), setGaps(gaps), setSpacing(spacing), setSource(source)`
```js
    // Set the text to "hello world"
    dummyGrid.setKeys("hello world")
    
    // This will make the text look stretched vertically, since the X/Y ratio will be 25/100
    dummyGrid.setGaps([25, 100])
    
    // This will make all letters overlap each others
    dummyGrid.setSpacing(0)
    
    // This will change the current source to the default fontSource5x5, which contains only A-Z letters.   (Some key definitions may not be supported depending of which source or keys you're using)
    dummyGrid.setSource(GridAssets.fontSource5x5)
```

#### Example use 1:
###### - Displaying all A-Z letters, with a nice effect when passing the mouse over the shape
```js
    // Creating a Grid
    const coolAlphabet = new Grid(
        "abcdefg\nhijklm\nnopqrs\ntuvwxyz", // the keys corresponding to the alphabet letters, with some line breaks
        [5, 5],                             // equal gaps, this will make the alphabet look a bit square-ish
        50,                                 // 50px letter spacing
        GridAssets.fontSource5x5,                      // default source
        [10,10],                            // the shape position (The text will start from this point, as its top-left corner)
        2,                                  // 2px dot radius
        null,                               // color is left undefined, the shape will assign it the default value
        null,                               // limit is left defined, default value assigned (100)
        (render, dot, ratio)=>{                // This is the drawEffectCB, which gets call for every dot of the shape, every frame
        
            // This will make a nice proximity effect when the mouse is close.
            // The mod() function and the ratio allow us to modify the dot radius with
            // a linear interpolation based on the distance between the ratioPos (the mouse) and the current dot.
            dot.radius = CDEUtils.mod(Obj.DEFAULT_RADIUS, ratio, Obj.DEFAULT_RADIUS)     // DEFAULT_RADIUS = 5
            
            
            // By default, no connections are drawn between the dots of a grid.
            // We can use the drawDotConnections() function to draw them easily.
            CanvasUtils.drawDotConnections(dot, [255,0,0,1])
        }
    )
    

    // The grid is done and dusted, adding it to the canvas
    CVS.add(coolAlphabet)
```

 

# Grid Assets
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

    **Note:** A new vertical layer is created when the sub-array horizontal index is smaller than the previous sub-array's.
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

 

# Color

The Color class represents a color and provides multiple utility functions such as HSV control, RGBA control, color finding, color format conversions, and color normalization.

**Note:** Direct HSV / RGBA controls are not supported for gradients

#### **The Color constructor takes the following parameters:**
###### - `new Color(color, isChannel)`
- **color** -> The color value in any supported format. (Text: `"red"`, RGBA: `[255, 255, 255 ,1]`, HEX:"#123abcff", Gradient: `new Gradient( ... )`, Color: *an instance of this class*)
- **isChannel** -> If `true`, the Color instance will be considered a color channel and will not duplicate. (Channels are for global color distribution)

### **To convert a color to another format,** use the convertTo() function:
###### - converTo(format=Color.FORMATS.RGBA, color)
```js
    const red = "red"
    
    console.log("Here is red in some other formats:",
        Color.convertTo(Color.FORMATS.RGBA, red)
        Color.convertTo(Color.FORMATS.HSV, red)
        Color.convertTo(Color.FORMATS.HEX, red)
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


 

# Gradient

The Gradient class allows the creation of custom linear / radial gradients. A Gradient instance can be used in the *color* and *fillColor* fields of canvas objects. 

#### **The Gradient constructor takes the following parameters:**
###### - `new Gradient(ctx, positions, colorStops, type, rotation)`
- **ctx** -> The canvas context.
- **positions** -> The positions of the gradient. Giving a Shape instance will position automatically the gradient according to the pos of its dots. For manual positions: **linear gradients**: `[ [x1, y1], [x2, y2] ]`, **radial gradients** `[ [x1, y1, r1], [x2, y2, r2] ]`, *conic gradients:* `[ x, y ]`.
- **colorStops** -> An array containing the difference colors and their range `[0..1, color]`. Ex: `[ [0, "purple"], [0.5, [255,0,0,1]], [1, "#ABC123"] ]`.
- **type** -> The type of gradient. Either: Linear, Radial or Conic. (Defaults to Linear)
- **rotation** -> The rotation in degrees of the gradient. (Not applicable for Radial gradients)


### **To update a gradient,** use the updateGradient() function:
###### - updateGradient()
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
    dummyFilledShape.fillColorRaw.updateGradient()
```

**Note:** when using a Shape or a Dot instance as the 'positions' parameter, the gradient will update every frame automatically.

#### Example use 1:
###### - Coloring a FilledShape with a gradient and making a rotating gradient effect
```js
const gradientShape = new FilledShape(
        // Creating and returning a linear gradient with a callback.
        // This linear gradient will auto-position itself according to the shape's dots, start at 90deg rotation and will go from purple->red->yellow-ish
        (ctx, shape)=>new Gradient(ctx, shape, [[0, "purple"], [0.5, [255,0,0,1]], [1, "#ABC123"]], null, 90), 
        
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

 

# Render

Render is a class that centralizes most context operation. It provides functions to get types of lines and *stroke / fill* them. Most of the calls to this class are automated via other classes (such as *Dot* and *FilledShape*), except for the utility line getters which allow more customization. It also provides access to style profiles (RenderStyles).  Finally, it is automatically instanciated by, and linked to, any Canvas instance.

#### **The Render constructor takes the following parameters:**
- **ctx** -> The canvas context.

#### Example use 1:
###### - Manually drawing a custom beizer curve 
```js
    // Running in the drawEffectCB of a dummy shape...
    {
        ...
        
        // Drawing a beizer curve from [100, 100] to [100, 200], using the default control points, in red
        render.stroke(Render.getBeizerCurve([100,100], [100, 200]), [255, 0, 0, 1])
        
    }
```

#### Example use 2:
###### - Manually drawing a custom filled quadratic curve
```js
    // Running in the drawEffectCB of a dummy shape...
    {
        ...
        
        // Drawing a beizer curve from [100, 400] to [400, 300], using the default control points with 0.5 spread
        render.fill(Render.getQuadCurve(startPos, endPos, Render.getDefaultQuadraticControlPos([100, 400], [400, 300], 0.5)))
        
    }
```

# RenderStyles

The RenderStyles class allows the customization of renders via style profiles when drawing with the *Render* class. By default, the following static profiles are created: `DEFAULT_PROFILE`, `PROFILE1`, `PROFILE2` and PROFILE3. There is also a static `PROFILES` to add custom profiles.

#### **The RenderStyles constructor takes the following parameters:**
- **render** -> The canvas Render instance.
- **color** -> Either an RGBA array `[r, g, b, a]` or a `Color` instance.
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
    CVS.render.profiles.push(myNewStyleProfile)
    
    // the style profile is now accessible via render.profiles[indexOfTheProfile]
```

### **To reuse a style profile for multiple styles,** use the updateStyles() function:
###### -  updateStyles(color?, lineWidth?, lineDash?, lineDashOffset?, lineJoin?, lineCap?)
```js
    {// Running in the drawEffectCB function of some shape...
        
        // ...
        
        // Drawing a line between a dot and its ratioPos, using the profile1 styles and updating the color, lineWidth, lineDash, lineDashOffset
        CanvasUtils.drawLine(dot, dot.ratioPos, render.profile1.updateStyles(Color.rgba(0,255,255,CDEUtils.mod(1, ratio, 0.8)), 4, [5, 25], 10))
    
        // Drawing a dot's connections, using again the profile1 styles and updating only the color, lineWidth
        CanvasUtils.drawDotConnections(dot, render.profile1.updateStyles([255,0,0,1], 2))
    }

```

 

#### Example use 1:
###### - Styling a beizer curve (based on the example in *Render*)
```js
    // Running in the drawEffectCB of a dummy shape...
    {
        ...
        
        // Drawing a beizer curve from [100, 100] to [100, 200], using the styles from the render's profile1
        render.stroke(Render.getBeizerCurve([100,100], [100, 200], [150, 100], [100, 150], render.profile1)
    }
```

#### Example use 2:
###### - Styling connections
```js
    // Running in the drawEffectCB of a dummy shape...
    {
        ...
    
    // Drawing the connections between dots, and styling them with an updated version of render's profile1 and a custom lineType
    CanvasUtils.drawDotConnections(dot, render.profile1.updateStyles(
            Color.rgba(255, 0, 0, CDEUtils.mod(1, ratio, 0.8)), // updating the color to a dynamically shaded red
            4,   // updating the lineWidth to 4px
            [10] // updating the lineDash to 10px
        ),
        0, // no radius padding
        Render.LINE_TYPES.CUBIC_BEIZER // using a default beizer curve
    )
        
    }
```

# Anim

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

 
# Input Devices

## TypingDevice
The TypingDevice class is automatically created and accessible by any Canvas instance. It provides information about the user's keyboard, such as the current keys pressed.

**Note:** for setting the *keyup* and *keydown* event listeners, use the prebuilt functions from the Canvas class.

#### **The TypingDevice's main attributes are**:
- **keysPressed** -> The keys which are currently pressed.


### **To set the keys event listeners,** use the following prebuilt functions:
###### - setkeydown(cb, global), setkeyup(cb, global)
```js
    // Setting the keydown listener
    CVS.setkeydown()
    
    // Settign the keyup listener with a custom callback
    CVS.setkeyup((e)=>{
        console.log("Custom callback: ", e)
    })
    
    // OR
    
    // Setting both listeners globally. (This will detect the key inputs even when the canvas is not directly focused)
    CVS.setkeydown(null, true)
    CVS.setkeyup((e)=>{
        console.log("Custom callback: ", e)
    }, true)
```

### **To get whether a certain key is down,** use the isDown() function:
###### - isDown(key)
```js
    // Accessing the typing device's "a" key state
    const isKey_A_down = CVS.typingDevice.isDown("a")
    
    console.log("Is the 'a' key down: ", isKey_A_down)
```

## Mouse

The Mouse class is automatically created and accessible by any Canvas instance. It provides information about the user's mouse, such a position, speed, direction, and buttons pressed.

**Note:** for setting the *move*, *leave*, *up*, and *down* mouse event listeners, use the prebuilt functions from the Canvas class.

#### **The Mouse's main attributes are**:
- **valid** -> Whether the mouse pos is valid(is inside the canvas and initialized).
- **x** -> The current x value of the mouse on the canvas.
- **y** -> The current y value of the mouse on the canvas.
- **dir** -> The direction in degrees of the mouse's last movement.
- **speed** -> The current speed (in px/s) of the mouse.
- **clicked** -> Whether the main button of the mouse is active.
- **rightClicked** -> Whether the secondary button of the mouse is active.
- **scrollClicked** -> Whether the scroll button of the mouse is active (pressed).
- **extraForwardClicked** -> Whether the extra forward button of the mouse is active (not present on every mouse).
- **extraBackClicked** -> Whether the extra back button of the mouse is active (not present on every mouse).

#### Example use 1:
###### - Making a dot throwable, and changing its color on mouse hover and click
```js
    // Using the getDraggableDotCB utility function to get a dragCallback
    const dragCallback = CanvasUtils.getDraggableDotCB()
    
    // Creating a mostly default shape, with a single dot
    const throwableDot = new Shape([10, 10], new Dot([10, 10]), null, null, null, 
        (render, dot, ratio, m, dist, shape)=>{// drawEffectCB callback
    
            // Changing the dot's size based on mouse distance for an additional small effect
            dot.radius = CDEUtils.mod(shape.radius*2, ratio, shape.radius*2*0.5)
            
            // Checking if the mouse is hovering the dot
            const isMouseOver = dot.isWithin(m.pos, true)
            
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

 

# Utilities

## CanvasUtils
The CanvasUtils class provides generic functions for common effects.

### DrawOuterRing
This function is used to draw a ring around a dot.
###### drawOuterRing(dot, color, radiusMultiplier)
```js
    // (Running in the drawEffectCB() function of some shape...)
    {
        ...
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
        ...
        // Rotates the shape's gradient filling. Completes a revolution in 3 seconds
        CanvasUtils.rotateGradient(dummyFilledShape, 3000, 1, true)
    }
    
```

### getDraggableDotCB
This function is used to make a dot throwable.
###### getDraggableDotCB(pickableRadius=50)
```js
    // getDraggableDotCB should only be called once, but it returns a callback that needs to be called every frame
    
    // (Running at the top of some js file)
    // Provides the callback to make the dot throwable. 
    const dragAnimCallback = CanvasUtils.getDraggableDotCB()
    
    ...
    
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

### drawLine
This function is used to draw a connection between a Dot and another pos/object.
###### drawLine(dot, target, renderStyles, radiusPaddingMultiplier=0, lineType, spread)
```js
    // (Running in the drawEffectCB() function of some shape...)
    {
        ...
        // Only if the distance with the ratioPos is lower than the shape's limit
        if (dist < shape.limit) {
            // Draws a line between the dot and the dot's ratioPos, adjusting the opacity of the line via the distance ratio
            CanvasUtils.drawLine(
                dot,        // start Dot
                [200, 200], // end position (can also be a Dot)
                RenderStyles.PROFILE1.updateStyles(
                    Color.rgba(dot.r,dot.g,dot.b,CDEUtils.mod(0.5, ratio)) // updates only the color, but uses every previously set styles
                )
            )
        }
    }
```

### drawDotConnections
This function is used to draw the connections between a Dot and the ones in its `connections` attribute. **(Especially useful when using a Grid!)**
###### drawDotConnections(dot, renderStyles, radiusPaddingMultiplier=0, lineType, spread, isSourceOver=false)
```js
    // (Running in the drawEffectCB() function of some shape...)
    {
        ...
        // Draws lines between the dot and its connections, using the shape's color, and with a start padding of 2.5x the radius
        CanvasUtils.drawDotConnections(dot, shape.colorObject, 2.5)
    }
```

 

**Note:** Functions in this class only accept RGBA arrays or a Color instance for the *color* parameter.

****
### Generic follow paths
The sub class FOLLOW_PATHS provides generic follow paths.

- #### Infinity Sign
  **Provides a sideways "8" like follow path.**                                                                    
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
  **Provides a sine wave like follow path.**                                                                    
  *`SINE_WAVE(width, height)`*

- #### Cosine Wave
  **Similar to Sine Wave, provides a cosine wave like follow path.**                                            
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
    CanvasUtils.drawDotConnections(dot, RenderStyles.PROFILE1.updateStyles([255,0,0,1], null, null, null, [5]))

    // simple radius hover effect
    dot.radius = CDEUtils.mod(Obj.DEFAULT_RADIUS*2, ratio, Obj.DEFAULT_RADIUS*2*0.8)

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

}, null, true)

// adding the shape to the canvas
CVS.add(manualSineWaveDrawer)
```


## CDEUtils
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
This function is used to return the Pythagorian distance between two positions.
###### getDist(x1, y1, x2, y2)

### getMinMax
This function is used to return the biggest and lowest values within an array. (propPath can be used to specify a property path to access the values to compare if the array contains objects)
###### getMinMax(arr, propPath=null)

### repeatedTimeout
This function is used to run a callback for a specific amount of time.
###### repeatedTimeout(iterationCount, callback, delay=5)


# Execution Order

### Level 1: Static setup
**This is mostly the declaration state, nothing is fully created / usable just yet.**
- Canvas instance creation
- Initial canvas objects creation (shapes, dots, ...)
- Adding the initial canvas objects to the canvas
- Settings events listeners
- Starting the main loop

### Level 2: Adding canvas objects to the canvas
**Once everything is declared, objects will start getting added to the canvas.**
- Sets the *cvs* or *parent* attribute on *references* and *definitions* respectively
- Runs the `initialize()` function on both *references* and *definitions* (On every added object)
- Adds objects as *references* or *definitions* in the canvas

### Level 3: Direct canvas object initialization
**At this point all *references* and *definitions* are initialized. By initializing a *reference*, we also initialize its dots.**
- Creates / adds all of the shapes' dots and sets some of their attributes
- Runs the `initialize()` function for each dot contained in the shape. (After getting its `initialize()` function called, the shape calls the `initialize()` of all its dots, while also setting some of their attributes.)

**Runs the following on applicable objects:**
- if `initPos` is a callback -> `initPos(cvs, this)`
- if `initDots` is a string -> `createFromString(initDots)`
- if `initDots` is a callback -> `initDots(this, cvs)`
- if `initRadius` is a callback -> `initRadius(this)`
- if `initColor` is a callback -> `initColor(ctx, this)`
- `setupCB(this)`
- if a FilledShape and `fillColor` is a callback -> `initFillColor(ctx, this)`
- Adjusts the `pos` according to the `anchorPos`
- Sets the `initialized` attribute to `true` for shapes

### Level 4: Children's initialization
After this, every dot will be initialized, and all canvas objects will be ready to be drawn.

**Runs the following on referenced dots (*dots in shapes*):**
- if `initPos` is a callback -> `initPos(parent, this)`
- if `initRadius` is a callback -> `initRadius(parent, this)`
- if `initColor` is a callback -> `initColor(ctx, this)`
- `setupCB(this, parent)`
- Adjusts the `pos` according to the `anchorPos`

### Level 5: Drawing stage
**This is where the canvas objects will appear on the canvas. Starts when calling `startLoop()` on the Canvas instance. The `draw` function runs every frame for every canvas object. The following will happen:**
- DeltaTime becomes available via the Canvas instance
- Updates the object's `pos` according to the `anchorPos`
- Plays the object's animations, if any
- Sets the `initialized` attribute to `true` for dots after 1 frame
- Runs the `drawEffectCB` for dots
- Visually draws the dots
- Updates the `ratioPos` for shapes if `ratioPos` is a function
- Draws the fill area of filled shapes

 

**Note:**
- *Reference:* an object containing other objects. (ex: Shape)
- *Definition:* a standalone object. (ex: Dot without a parent Shape)



# Intended Practices

- Putting `null` as any parameter value will assign it the default value.

- Use the `mod()` function for effective ratio usages.
- If needed and applicable, use the available prebuilt event listeners.
- More complex shapes can have very extensive declarations, declare them in a separate file(s) and use them in a centralized project file. 

 

****
### Credits

Made by Louis-Charles Biron !