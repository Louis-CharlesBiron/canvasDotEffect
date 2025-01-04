# What is CanvasDotEffect (CDE)

**CanvasDotEffect is a lightweight JS library that helps creating customizable and interactive dot based effects using the Canvas API.**



# Table of content
- Getting Started / Minimal setup
- Features
- Classes
    - Canvas
    - Obj
    - Dot
    - Shape
    - Filled Shape
    - Grid
        - Grid Assets
    - Gradient
    - Anim
    - Mouse
- Utilities
- Execution order
- Best practices
- Misc
- Credits


## Getting Started / Minimal setup

1. **Get the library file.** 
```html
    <head>
        ...
        <script src="canvasDotEffect.min.js"></script>
    </head>
```

2. **In your html file, place a canvas element. The canvas will automatically take the size of its parent** element.
```html
    <div class="canvasHolder">
        <canvas id="canvasId"></canvas>
    </div>
```

3. **In a JS file, create a new Canvas instance with the canvas element in parameter.**
```js
    const CVS = new Canvas(document.getElementById("canvasId"))
```

4. **From this Canvas instance, add any canvas objects you want.**
```js
    // Create a canvas object
    const dummyShape = new Shape([50,50],[new Dot([50, 50])])
    
    // Add it to the canvas
    CVS.add(dummyShape)
```

5. **Set the mouse event listeners for mouse interactions.**
```js
    // Set up the prebuilt event listener, allows the creation of more interactive effects!
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
    
    CVS.setmousemove(/*custom callback*/)
    CVS.setmouseleave()
    CVS.setmousedown()
    CVS.setmouseup()
    
    CVS.startLoop()
```

# Features
- Effects based on distances (distance ratio)
- TODO

# Class descriptions
This following sections are a short documentation of each class, basically what it does and what are the most important aspects of it.

 

# Canvas

The Canvas class is the core of the projet. It manages the main loop, the window listners, the delta time, the html canvas element, all the canvas objects and much more.

#### **The Canvas constructor takes the following parameters:**
###### - `new Canvas(cvs, loopingCallback, frame, settings)`
- **cvs** -> The HTML canvas element to link to.
- **loopingCallback**? -> A custom callback ran each frame.
- **frame**? -> If you don't want the canvas to take the size of its direct parent, you can provide another custom HTML element here.
- **settings**? -> The custom canvas settings (leave blank for prebuilt default settings).

**To add canvas object to the canvas,** use the add() function:
```js
    // For a source object
    CVS.add(yourShape)

    // For a standalone object
    CVS.add(yourObject, true)
```

**To set up mouse listeners for the canvas,** use the following prebuilt functions:
```js
    // Set the important mouse events 
    CVS.setmousemove(/*possible custom callback*/)
    CVS.setmouseleave()
    CVS.setmousedown()
    CVS.setmouseup()
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
        document.getElementById("canvas"),  // The html canvas element to link to
        ()=>{                               // Custom callback that runs every frame
            // Get current fps
            const fps = fpsCounter.getFps()
        
            // Display fps in other element
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
- **radius** -> The radius in px object the dot (Or the radius of its dots if is a Shape).
- **rgba** -> The red, green, blue and alpha values `[r, g, b, a]` of the object. (Or the rgba of its dots if is a Shape).
- **setupCB** -> Custom callback called on the object's initialization `(this, this?.parent)=>{}`

**This class also defines other useful base functions**, such as:
- Movements functions (`moveBy`, `addForce`, ...)
- Informative functions (`isWithin`, `posDistances`, ...)
- Access to the object's animation queue (`queueAnim`)

 

# Dot

The dot class is **meant** to be the core of all effects. It appears as a circular dot on the canvas by default.

#### **The Dot constructor takes the following parameters:**
###### - `new Dot(pos, radius, rgba, setupCB)`
- *pos, radius, rgba, setupCB* -> See the Obj class.

Its other attributes are:
- **parent**? -> The shape in which the dot is contained, if any. 
- **connections** -> a list referencing other dots, primarily to draw a connection betweem them. 

**The follow function:** use `follow()` to make a dot follow a custom path:

###### - `follow(duration, easing, action, ...progressSeparations)`
```js
   /**
     * Used to make the dot follow a custom path
     * @param {Number} duration: duration of the animation in ms
     * @param {Function} easing: easing function 
     * @param {Function?} action: custom callback that can be called in addition to the movement                                                        //newProg is 'prog' - the progress delimeter of the range
     * @param {...Array[Number, Function]} progressSeparations: list of callback paired with a progress range, the callback must return a position (prog, newProg, initX, initY)=>return [x,y]
     * progressSeparations example: [0:(prog)=>[x1, y1]], [0.5:(prog, newProg)=>[x2, y2]] -> from 0% to 49% the pos from 1st callback is applied, from 50%-100% the pos from 2nd callback is applied  
     */
     
    // Example use, for 3 seconds, easeOutQuad, no custom callback, will travel in a sideways 'L' shape 
    let dx=400, dy=200
    dot.follow(3000, Anim.easeOutQuad, null, [0,(prog)=>[dx*prog, 0]], [0.5,(prog, newProg)=>[dx*0.5, dy*newProg]])
```

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
        [0,0],          // positionned at [0,0]
        25,             // 25px radius
        [0,0,255,0.5],  // blue at 50% opacity
        ()=>{           // custom callback ran on dot's initialization
            
            console.log("I am now added to the canvas and ready to go!")
        }
    )
    
    // Add the dot as standalone object by setting the 'isDef' to 'true'. (definition)
    CVS.add(aloneDot, true)
```

#### Example use 2:
###### - Dots as part of a shape
```js
    // Creating a Shape containing some dots!
    const squareLikeFormation = new Shape([0,0], [
            new Dot([100, 100]), // Dots contained in a shape will take on some properties (rgba, radius, limit, ...) of the shape.
            new Dot([150, 100]),
            new Dot([150, 150]),
            new Dot([100, 150])
    ], Obj.DEFAULT_RADIUS, Obj.DEFAULT_COLOR)
    
    // Add the shape along with all of its dots as a single unit. (reference)
    CVS.add(squareLikeFormation)
```

 

# Shape

The Shape class (or its inheritors) plays a crucial part in creating proper effect. It provides the needed control over a group of dots, and is used to make pretty much any effects. A empty shape (containing no dots) on its own is not visible by default.

One of the main features is the *drawEffectCB*, this callback allows to create a custom effect and assign it to each dot in the shape.

Effects are often ratio-based, meaning the *intensity* of the effect is based on the distance between the dot and the *ratioPos*. You can control the affected distance with the *limit* parameter, and the the object to which the distance\ratio is calculated with the *ratioPosCB* parameter.

#### **The Shape constructor takes the following parameters:**
###### - `new Shape(pos, dots, radius, rgba, limit, drawEffectCB, ratioPosCB, setupCB, fragile)`
- *pos, radius, rgba, setupCB* -> See the Obj class.
- **initDots** -> Initial dots declaration. Can either be: an array of dots `[new Dot(...), existingDot, ...]`, a **String** (this will automatically call the shape's createFromString() function), or a callback `(Shape, Canvas)=>{... return anArrayOfDots}` 
- ***dots*** -> Array of all the current dots the contained by the shape. 
- **limit** -> Defines the circular radius in which the dots' ratio is calculated. Each dot will have itself as its center to calculate the distance between it and the shape's *ratioPos*. (At the edges the ratio will be 0 and gradually gravitates to 1 at the center)
- **drawEffectCB** -> A callback containing your custom effect to display. It is ran by every dot of the shape, every frame. `(ctx, Dot, ratio, mouse, distance, parent, rawRatio)=>{...}`.
- **ratioPosCB**? -> References the mouse position by default. Can be used to set a custom *ratioPos* target `(Shape, dots)=>{... return [x, y]}`. Can be disabled if set to `null`.
- **fragile**? -> Whether the shape resets on document visibility change events. (Rarer, some continuous effects can break when the page is in the background due to the unusual deltaTime values sometimes occuring when the document is offscreen/unfocused) 

**Its other attributes are:**
- **rotation** -> The shape's rotation in degrees. Use the `rotateAt`, `rotateBy`, `rotateTo` functions to modify.
- **scale** -> The shape's X and Y scale factors `[scaleX, scaleY]`. Use the `scaleAt`, `scaleBy`, `scaleTo` functions to modify.


### **To add one or many dots,** use the add() function:
###### - add(dots)
```js
    // Creating and adding a new empty Shape to the canvas
    const dummyShape = new Shape([100,100])
    CVS.add(dummyShape)
    
    // Later, adding a dot to the shape
    dummyShape.add(new Dot(50, 50))
    
    // or many dots
    dummyShape.add([new Dot(50, 50), new Dot(50, 100)])
```

**Note: adding dots to a shape:** 
1. **Overrides** the dots' color to the one set one of shape, regardless of definition.
2. Sets the dots' radius to the one of the shape, if NOT previously undefined.
3. Sets the dots' parent attribute to reference the shape.

### **Creating a formation of dots using a String** with the createFromString() function:
###### - createFromString(str, topLeftPos, gaps, dotChar?)
```js
   /**
     * createFromString can be used as a primitive/fast way to create a formation of dots, using text drawings.
     * @param {String} str: ex: "oo o o \n ooo \n ooo" 
     * @param {pos[x,y]} topLeftPos: starting pos of the formation
     * @param {[gapX, gapY]} gaps: the x and y distance between each dot
     * @param {Character} dotChar: the character used in the creation string other than the spaces ("o" by default)
     * @returns the created dots formation
     */
     
     // Creating the dots
     const spike = dummyShape.createFromString(`
        o
       o o
      o   o
     o     o
     `, [100, 100], [20, 25])
     
     // Adding the dot formation to the shape
     dummyShape.add(spike)

```

### **To modify dots' properties all at once** with the createFromString() function:
###### - setRadius(radius),  setRGBA(rgba), setLimit(limit)
```js
    // Sets the radius of all dummyShape's dots to 10
    dummyShape.setRadius(10)
    
    // Sets the color of all dummyShape's dots to red (rgba(255, 0, 0, 1)) 
    dummyShape.setRGBA([255, 0, 0, 1])
    
    // Sets the limit of all dummyShape's dots to 100
    dummyShape.setLimit(100)

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

#### Example use 1:
###### - idk shape exemaple
```js
    TODO like do at least like 3-5 examples
```

 

# Filled Shape

The FilledShape class is a derivate of the Shape class. It allows to fill the area delimited by the shape's dots.


#### **The FilledShape constructor takes the following parameters:**
###### - `new FilledShape(rgbaFill, dynamicUpdates, pos, dots, radius, rgba, limit, drawEffectCB, ratioPosCB, setupCB, fragile)`
- *pos, dots, radius, rgba, limit, drawEffectCB, ratioPosCB, setupCB, fragile* -> See the Shape class.
- **rgbaFill** -> Defines the color of the shape's filling. Either a color value, a Gradient instance or a callback returning any of the previous two `(ctx, shape)=>{... return [r, g, b, a]}`.
- **dynamicUpdates** -> Whether the shape's fill area checks for updates every frame


**To update the fill area manually:** use the `updatePath()` function:

###### - `updatePath()`
```js
    // ... Assuming there is a dummyFilledShape exisiting somewhere

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
            new Dot([100, 100]), // Top left corner
            new Dot([150, 100]), // Top right corner
            new Dot([150, 150]), // Bottom right corner
            new Dot([100, 150])  // Bottom left corner
        ]
    )

    // Adding it to the canvas
    CVS.add(myFilledShape)
```

**Note:** the fill area is based on the positions of the shape's dots, in the ORDER they currently are in *shape*.dots

 

# Grid 

The Grid class is a derivate of the Shape class. It allows the creation of dot-based symbols / text. To create your own set of symbols (source), see the *Grid Assets* section.

#### **The Grid constructor takes the following parameters:**
###### - `new Grid(keys, gaps, spacing, source, pos, radius, rgba, limit, drawEffectCB, ratioPosCB, setupCB, fragile)`
- *pos, radius, rgba, limit, drawEffectCB, ratioPosCB, setupCB, fragile* -> See the Shape class.
- **keys** -> A string containing the characters to create.
- **gaps** -> The `[x, y]` distances within the dots.
- **source** -> The source containing the symbols definitions. See *Grid Assets* section.
- **spacing** -> The distance between each symbol. (Letter spacing)


**The update the keys, gaps, source or spacing:** use the following function:

###### - `setKeys(keys), setGaps(gaps), setSpacing(spacing), setSource(source)`
```js
    // Set the text to "hello world"
    dummyGrid.setKeys("hello world")
    
    // This will make the text look streched vertically, since the X/Y ratio will be 25/100
    dummyGrid.setGaps([25, 100])
    
    // This will make all letters overlap each others
    dummyGrid.setSpacing(0)
    
    // This will change the current source to the default fontSource5x5, which contains only A-Z letters.   (Some key definitions may not be supported depanding of which source or keys you're using)
    dummyGrid.setSource(GridAssets.fontSource5x5)
```

#### Example use 1:
###### - Displaying all A-Z letters, with a nice effect when passing the mouse over the shape
```js
    // Creating a simple filledShape
    const coolAlphabet = new Grid(
        "abcdefg\nhijklm\nnopqrs\ntuvwxyz", // the keys corresponding to the alphabet letters, with some line breaks
        [5, 5],                             // equal gaps, this will make the alphabet look a bit square-ish
        50,                                 // 50px letter spacing
        GridAssets.fontSource5x5,                      // default source
        [10,10],                            // the shape position (The text will start from this point, as its top-left corner)
        2,                                  // 2px dot radius
        null,                               // rgba is left undefined, the shape will assigned it the default value ([255,255,255,1])
        null,                               // limit is left udefined, default value assigned (100)
        (ctx, dot, ratio)=>{                // This is the drawEffectCB, gets call for every dot of the shape, every frame
        
            // This will make a nice proximity effect when the mouse is close.
            // The mod() function and the ratio allow us to modify the dot radius with
            // a linear interpolation based on distance between the ratioPos (the mouse) and the current dot.
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
This class contains the source declarations used by the Grid class. A source is basically a set of symbol, just like a font is a set of letters / numbers. You can create your own symbols and source using the Grid Assets class. Sources are simply mapping *key* (any character, "A", "0", "%", ...) to *symbol* (a custom formation of dots).

### **The '`D`' constant:**
 `D` (for directions) is a prebuilt object providing the cardinal and intercardinal directions. These are used to connect the dots together and draw specific lines between them, to create a symbol.
 
### **Creating a custom source:**
A source is an object should contain:
- The width and height of all its symbols. (As of now, the width and height must be equal)
- The symbols definitions. (The key should be in uppercase)

Ex: `{ width: 3, height: 3, A: [...], B: [...], 5: [...] }`

### **Creating custom symbols:**
A symbol has this structure: `[...[index, directions]]`. It is composed of a main array, containing the sub-arrays.
- The main array defines the vertical layers, a new layer is created each time an horizontal index of is lower than the last.
- The sub-arrays each define a dot, and has its horizontal index and the directions of its connections.

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
   Since the "A" symbol doesn't have any dot at (0, 0) and (1, 0), we need to place the first dot at the coords (2, 0).
   To dot that, we only need to specify the horizontal index in sub-array. -> `[2]`.

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

 4. **Creating the 2nd vertical layer (*vertical index 1*).**  Since the first layer only had a single dot, it now compelted, with the correct placement and connections. Let's continue the example with the 2nd layer.
   This layer has dots only at (1, 1) and (1, 3), so we can already create the following sub-arrays -> [1,] and [3,]. Looking at the "A" graph above, the entire 3rd layer (*vertical index 2*) is filled with dots. 
   Though, to make the letter "A", we need to only connect to the dots at (0, 2) and (4, 2).
   We achieve these two connections by updating our previous sub-arrays like this -> [1, D.bl] and [3, D.br]

    **Note:** A new vertical layer is created when the a sub-array horizontal index is smaller than the previous sub-array's one.
    ```js
    // The main array
    [
        // Here, we are at the vertical layer (vertical index 0)
        [2, D.bl + D.br],  // A dot at (2, 0), with connections to any dot at (1, 1) and (3, 1)
        
        // Here, a new vertical layer is created (vertical index 1), because the first sub-array's horizontal index ([1, D.bl] -> 1) is smaller than the previous sub-array's horizontal index ([2, D.bl + D.br] -> 2)
        [1, D.bl], [3, D.br] // A dot at (1, 1), with connections to any dot at (0, 2) and another dot at (1, 3), with connections to any dot at (4, 2)
    ]
    ```
 5. **Continue the process until the symbol if fully formed**. In the end you should have something like this:
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


#### Particuliarities: 
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

 

# Gradient

The Gradient class allows the creation of custom linear / radial gradients. A Gradient instance can be used in the *rgba* and *rgbaFill* fields of cavnas objects. 

#### **The Gradient constructor takes the following parameters:**
###### - `new Gradient(ctx, positions, isLinear, ...colorStops)`
- **ctx** -> The canvas context.
- **positions** -> The positions of the gradient. Giving a Shape instance will position automatically the gradient according to the pos of its dots. For manual positions:linear gradients: `[ [x1, y1], [x2, y2] ]`, radial gradients `[ [x1, y1, r1], [x2, y2, r2] ]`.
- **isLinear** -> Whether the gradient is linear or radial. (If is a number, acts as the rotation in degrees of the linear gradient).
- **...colorStops** -> An array containing the difference colors and their range `[0..1, color]`. Ex: `[ [0, "purple"], [0.5, [255,0,0,1]], [1, "#ABC123"] ]`.

### **To update a gradient,** use the updateGradient() function:
###### - updateGradient()
```js
    // Creating a gradient
    const customGradient = new Gradient(
            CVS.ctx,                 // canvas context
            [ [0, 0], [100, 100] ],  // setting manual positions
            true,                    // is a linear gradient
            [0, "red"], [1, "blue"]  // goes from red to blue
        )

    // Assigning the gradient to a dummy filled shape
    dummyFilledShape.rgbaFill = customGradient

    // Ex: Updating color stops
    customGradient.colorStops = [[0, "green"], [1, "pink"]]

    // Access the gradient assigned to the shape's filling and update it
    dummyFilledShape.rgbaFill.updateGradient()
```

**Note:** when using a Shape instance as the 'positions' parameter, the gradient will update automatically.

#### Example use 1:
###### - Coloring a FilledShape with a gradient and making a rotating gradient effect
```js
const gradientShape = new FilledShape(
        // Creating and returning a gradient with a callback.
        // The gradient will auto-position itself according to the shape's dots, start at 90deg rotation and will go from purple->red->yellow-ish
        (ctx, shape)=>new Gradient(ctx, shape, 90, [[0, "purple"], [0.5, [255,0,0,1]], [1, "#ABC123"]]), 
        
        // Other parameters are used by the FilledShape, to make a square at [100, 100]
        false,
        [100, 100], 
        [
            new Dot([100, 100]),
            new Dot([150, 100]),
            new Dot([150, 150]),
            new Dot([100, 150])
        ]
    )
    
    // Creating and queueing the rotating gradient animation
    gradientShape.queueAnim(
        new Anim((progress)=>{
        
            // Getting the gradient
            const gradient = gradientShape.rgbaFill
            
            // rotating it
            gradient.rotation = 360 * progress
            
        }, -750) // repeating every 750 ms
    )

    // Adding it to the canvas
    CVS.add(gradientShape)
```

 

# Anim

The Anim class allows the creation of smooth animations and the use of easings.

#### **The Anim constructor takes the following parameters:**
- **animation** -> Callback containing the animation code `(progress)=>{...}`.
- **duration** -> The duration in miliseconds. (Negative values will make the animation repeat infinitly).
- **easing** -> The easing function to be used `(x)=>{... return x}`.
- **endCallback**? -> Custom callback ran upon the animation ending.

### **To play an animation:** 
Use the queueAnim() function on any canvas object. Animations get added to the end of the animation queue of an object and are played once they're at the first index of this queue. You can terminate the current animation and instantly replace it with another one by putting `true` as the second parameter.

###### - queueAnim(Anim, force?)
```js
    // Dummy animations
    const someAnim = new Anim(/* some parameters ... */)
    const animationThatNeedsToRunNOW = new Anim(/* some other parameters ... */)
    
    
    // This will queue the animation to be run once all previously queued animations are completed.
    dot.queueAnim(someAnim)
    
    // Will terminate and replace any animation running! (After 3 seconds)
    setTimeout(()=>{
        dot.queueAnim(animationThatNeedsToRunNOW, true)
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
            // fading the dot over 5 seconds
            dot.a = 1 - progress
            if (progress == 1) dot.remove()
        },
        5000 // 5 second duration
    )

    // Queueing the animation
    dot.queueAnim(fadingAnimation)
```

#### Example use 2:
###### - Making a dot smoothly move back and forth while blinking, every second, for eternity 
```js
    let distance = 200
    
    dot.queueAnim(new Anim((progress, playCount)=>{
        // fading the dot over 1 second
        dot.a = 1 - progress
        
        // moving the dot left or right depanding on if the animation play count is pair
        if (playCount % 2) dot.x += distance * progress * CVS.deltaTime
        else dot.x -= distance * progress * CVS.deltaTime
        
    }, -1000)) // repeats every 1 seconds because of the "-"
```

 

## Mouse

The Mouse class is automatically created and accessible by any Canvas instance. It provides information about the mouse.

**Note:** for setting the *move*, *leave*, *up* and *down* mouse event listeners, use the prebuilt functions from the Canvas class.

#### **The Mouse's main attributes are**:
- **valid** -> Whether the mouse pos is valid(is inside the canvas and initialized).
- **x** -> The current x value of the mouse on the canvas.
- **y** -> The current y value of the mouse on the canvas.
- **dir** -> The direction in degrees of the mouse's last movement.
- **speed** -> The current speed (in px/s) of the mouse.
- **clicked** -> Whether the main button of the mouse is active.
- **rightClicked** -> Whether the secondary button of the mouse is active.
- **scrollClicked** -> Whether the scroll button of the mouse is active (pressed).
- **extraForwardClicked** -> Whether the extra foward button of the mouse is active (not present on every mouse).
- **extraBackClicked** -> Whether the extra back button of the mouse is active (not present on every mouse).

#### Example use 1:
###### - Making a dot throwable, and changing its color on mouse hover and click
```js
    // Using the getDraggableDotCB utility function to get a dragCallback
    const dragCallback = CanvasUtils.getDraggableDotCB()
    
    // Creating a mostly default shape, with a single dot
    const throwableDot = new Shape([10, 10], new Dot([10, 10]), null, null, null, 
        (ctx, dot, ratio, m, dist, shape)=>{// drawEffect callback
    
            // Changing the dot's size based on mouse distance for an additional small effect
            dot.radius = CDEUtils.mod(shape.radius*2, ratio, shape.radius*2*0.5)
            
            // Checking if the mouse is hovering the dot
            const isMouseOver = dot.isWithin(m.pos, true)
            
            // if mouse is over and clicked, set the dot's color to red
            if (isMouseOver && m.clicked) {
                dot.rgba = [255, 0, 0, 1]
            }
            // if mouse is only over, set the dot's color to green
            else if (isMouseOver) {
                dot.rgba = [0, 255, 0, 1]
            }
            // if mouse is neither over or clicked, set the dot's color to white
            else {
                dot.rgba = [255, 255, 255, 1]
            }
        
            // Calling the dragCallback to make the dragging and throwing effet
            dragCallback(shape.dots[0], m, dist, ratio)
        }
    )
    
    // Adding the shape
    CVS.add(throwableDot)
```

 

# Utilities 

# Execution Order

### Level 1: Static setup
- Canvas instance creation
- Initial canvas objects creation (shapes, dots)
- Adding the initial canvas objects to the canvas
- Settings mouse events
- Starting the main loop

### Level 2: Adding canvas objects to the canvas
- Sets the *cvs* or *parent* attributes for *references* and *definitions* respectively
- Runs the initializes() function for both *references* and *definitions*
- Adds them as *references* or *definitions* in the canvas

### Level 3: Reference initialization
- Creates / adds all of the shapes' dots and sets some of their attributes
- Runs the initialize() function for each dot contained in the shape. (After getting its initialize() function called, the shape calls the initialize() of all its dots.)

**Runs the follwing on references (*shapes*):**
- if `initDots` is a string -> `createFromString(initDots)`
- if `initDots` is a callback -> `initDots(this, cvs)`
- if `initPos` is a callback -> `initPos(cvs, dots)`
- `setupCB(this)`
- if the Shape is a FilledShape and if `rgbaFill` is a callback -> `initRgbaFill(ctx, this)`

### Level 4: Children initialization
- All the dots are now initialized.

**Runs the follwing on referenced dots (*dots in shapes*):**
- if `initPos` is a callback -> `initPos(cvs, parent)`
- `setupCB(this, parent)`

### Level 5: Drawing stage


WHEN
anim.getFrame ~> in Obj.draw()
drawEffectCB ~> in dot.draw()
ratioPosCB  ~> in shape.draw()
draw?





# Best Practices

# General

by, at, to

 

## Credits

Made by Louis-Charles Biron