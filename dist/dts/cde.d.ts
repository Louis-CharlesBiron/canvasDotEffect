export class CDEUtils {
    static DEFAULT_ACCEPTABLE_DIFFERENCE: number;
    static CIRC: number;
    static TO_DEGREES: number;
    /**
     * Returns the element at the specified index, starting from the end of the array
     * @param {Array} arr: the array
     * @param {Number?} index: the index
     * @returns the element at index
     */
    static getLast(arr: any[], index?: number | null): any;
    /**
     * Adds an element to the specified index of the array
     * @param {Array} arr: the array
     * @param {*} el: the element to add
     * @param {Number?} index: the index
     * @returns the updated array
     */
    static addAt(arr: any[], el: any, index?: number | null): any[];
    /**
     * Returns a random number within the min and max range
     * @param {Number} min: the minimal possible value (included)
     * @param {Number} max: the maximal possible value (included)
     * @param {Number?} decimals: the decimal point. (Defaults to integers)
     * @returns the generated number
     */
    static random(min: number, max: number, decimals?: number | null): number;
    /**
     * Clamps a number between the min and max
     * @param {Number} num: the number to clamp
     * @param {Number?} min: the minimal value
     * @param {Number?} max: the maximal value
     * @returns
     */
    static clamp(num: number, min?: number | null, max?: number | null): number;
    /**
     * Returns the average of an array of numbers
     * @param {Number[]} arr: an array of numbers
     * @returns the average
     */
    static avg(arr: number[]): number;
    /**
     * Returns whether a value is defined
     * @param {*} value: the value to check
     * @returns whether the value is defined
     */
    static isDefined(value: any): boolean;
    /**
     * Returns whether a value is a function
     * @param {*} value: the value to check
     * @returns whether the value is a function
     */
    static isFunction(value: any): boolean;
    /**
     * Rounds a number to a specific decimal point
     * @param {Number} num: the number to round
     * @param {Number?} decimals: the decimal rounding point
     * @returns
     */
    static round(num: number, decimals?: number | null): number;
    /**
     * Fades a numeric value according to Anim progress and playCount
     * @param {Number} prog: an Anim instance's progress
     * @param {Number?} i: an Anin instance's play count. (Controls the direction of the fading animation)
     * @param {Number?} minValue: the minimal value to reach
     * @param {Number?} maxValue: the maximal value to reach
     * @returns the calculated number
     */
    static fade(prog: number, i?: number | null, minValue?: number | null, maxValue?: number | null): number;
    /**
     * Calculates a 0..1 ratio based on the distance between two object and a limit/threshold
     * @param {[x,y] | _BaseObj} pos1: a pos or _BaseObj inheritor instance
     * @param {[x,y] | _BaseObj} pos2: another pos or _BaseObj inheritor instance
     * @param {Number?} limit: the distance threshold use to calculate the ratio
     * @returns a number between 0 and 1
     */
    static getRatio(pos1: [x, y] | _BaseObj, pos2: [x, y] | _BaseObj, limit?: number | null): number;
    /**
     * Returns an array of a shape's dots ordered by the distance between them and the specified dot
     * @param {Dot} dot: a Dot instance
     * @param {Shape?} shape: a Shape instance. (Defaults to the shape containing "dot")
     * @returns an ordered list of all dots [[dot, distance], ...]
     */
    static getNearestDots(dot: Dot, shape?: Shape | null): any;
    /**
     * Makes a callback only called after a certain amount of time without 'interaction'.
     * This function returns a 'regulation callback' that will call the provided "callback" only after the provided amount of time has passed without it getting called.
     * For example, calling the 'regulation callback', with a timeout of 1000ms, everytime a key is pressed will make it so the provided "callback" will be called only after no keys were pressed for 1 seconds.
     * @param {Function} callback: a function to be called after "timeout" amount of time has passed with no 'interaction'
     * @param {Number?} timeout: the minimal time window, in miliseconds, before calling callback after an 'interaction'
     * @returns the 'regulation callback'
     */
    static getRegulationCB(callback: Function, timeout?: number | null): (...params: any[]) => void;
    /**
     * Basically regular setInterval, but without the initial timeout on the first call
     * @param {Function} callback: a function to be called
     * @param {Number?} timeout: the timeout value in miliseconds
     * @returns the setInteraval id
     */
    static noTimeoutInterval(callback: Function, timeout?: number | null): number;
    /**
     * Creates a copy of the provided array. (only length 2)
     * @param {*} arr
     * @returns the array copy
     */
    static unlinkArr2(arr: any): any[];
    /**
     * Creates a copy of the provided array. (only length 3)
     * @param {*} arr
     * @returns the array copy
     */
    static unlinkArr3(arr: any): any[];
    /**
     * Creates a copy of the provided array.
     * @param {[ [x, y], [x2, y2] ] | [x,y]} arr
     * @returns the array copy
     */
    static unlinkPositions(arr: [[x, y], [x2, y2]] | [x, y]): any[];
    /**
     * Rotates the provided pos around a point
     * @param {[x,y]?} pos: the pos to rotate
     * @param {Number?} deg: the degrees to rotate
     * @param {[x,y]?} centerPos: the center pos of the rotation
     * @returns the rotated pos
     */
    static rotatePos(pos?: [x, y] | null, deg?: number | null, centerPos?: [x, y] | null): any[];
    /**
     * Scales the provided pos from a center point
     * @param {[x,y]?} pos: the pos to scale
     * @param {[scaleX, scaleY]?} scale: the x/y scale factors
     * @param {[x,y]?} centerPos: the center pos of the scaling
     * @returns the scaled pos
     */
    static scalePos(pos?: [x, y] | null, scale?: [scaleX, scaleY] | null, centerPos?: [x, y] | null): any[];
    /**
     * Returns the center pos of the provided positions
     * @param {[[x1,y1], [x2,y2]]} positions: a rectangular area defined by two corners
     * @returns the center pos pos
     */
    static getPositionsCenter(positions: [[x1, y1], [x2, y2]]): number[];
    /**
     * Returns the pythagorian distance between 2 points
     * @param {Number} x1: the x value of the first point
     * @param {Number} y1: the y value of the first point
     * @param {Number} x2: the x value of the second point
     * @param {Number} y2: the y value of the second point
     * @returns the distance
     */
    static getDist(x1: number, y1: number, x2: number, y2: number): number;
    /**
     * Returns the pythagorian distance between 2 points
     * @param {Number} x1: the x value of the first point
     * @param {Number} y1: the y value of the first point
     * @param {Number} x2: the x value of the second point
     * @param {Number} y2: the y value of the second point
     * @returns the distance
     */
    static getDist_pos(pos1: any, pos2: any): number;
    /**
     * Returns the "a", "b" and "function" values formed by a line between 2 positions
     * @param {[x,y]} pos1: a point
     * @param {[x,y]} pos2: another point
     */
    static getLinearFn(pos1: [x, y], pos2: [x, y]): any[];
    /**
    * Returns the "a", "b" and "function" values formed by a line between 2 positions
     * @param {Number} x1: the x value of a point
     * @param {Number} y1: the y value of a point
     * @param {Number} x2: the x value of another point
     * @param {Number} y2: the y value of another point
     */
    static getLinearFn_coords(x1: number, y1: number, x2: number, y2: number): (number | number[] | ((x: any) => number))[];
    /**
     * Returns the "a", "b" and "function" values of the perpendicular line
     * @param {Array} linearFnResult: the results of getLinearFn()
     */
    static getPerpendicularLinearFn(linearFnResult: any[]): any[];
    /**
     * Returns a random value in a range
     * @param {[min, max]} minMax
     * @returns the random clamped value
     */
    static getValueFromRange(minMax: [min, max]): number;
    /**
     * Shallow array equals
     * @param {Array} arr1
     * @param {Array} arr2
     * @returns whether both array are equal
     */
    static arrayEquals(arr1: any[], arr2: any[]): boolean;
    /**
     * Adds a pos to another
     * @param {[x,y]} arr1: a pos array
     * @param {[x,y]} arr2: another pos array
     * @returns the resulting pos array
     */
    static addPos(pos1: any, pos2: any): any[];
    /**
     * Substracts a pos to another
     * @param {[x,y]} arr1: a pos array
     * @param {[x,y]} arr2: another pos array
     * @returns the resulting pos array
     */
    static subPos(pos1: any, pos2: any): number[];
    /**
     * Multiplies a pos to another
     * @param {[x,y]} arr1: a pos array
     * @param {[x,y]} arr2: another pos array
     * @returns the resulting pos array
     */
    static mulPos(pos1: any, pos2: any): number[];
    /**
     * Divides a pos to another
     * @param {[x,y]} arr1: a pos array
     * @param {[x,y]} arr2: another pos array
     * @returns the resulting pos array
     */
    static divPos(pos1: any, pos2: any): number[];
    /**
     * Pos array equals (or arr[2])
     * @param {[x,y]} arr1: a pos array
     * @param {[x,y]} arr2: another pos array
     * @returns whether both pos array are equal
     */
    static posEquals(arr1: [x, y], arr2: [x, y]): boolean;
    /**
     * Positions array equals
     * @param {[[x1,y1], [x2,y2]]} positions1: a rectangular area defined by two corners
     * @param {[[x1,y1], [x2,y2]]} positions2: another rectangular area defined by two corners
     * @returns whether both positions array are equal
     */
    static positionsEquals(positions1: [[x1, y1], [x2, y2]], positions2: [[x1, y1], [x2, y2]]): boolean;
    /**
    * Returns the interpolated number between (max) and (max - range)
    * @param {Number} max: the max value to return
    * @param {Number} ratio: the linear interpolation progress (0 to 1)
    * @param {Number} range: defines the range of the max value to be used, inverts direction when negated
                            [if range=max, then (0 to max) will be used] or
                            [if range=max/2, only (max/2 to max) will be used] or
                            [if range=0, only (max to max) will be used]
    */
    static mod(max: number, ratio: number, range?: number): number;
    /**
     * Returns converted given degrees into radians
     * @param {Number} deg: the degrees
     * @returns the equivalent radians
     */
    static toRad(deg: number): number;
    /**
     * Returns converted given radians into degrees
     * @param {Number} rad: the radians
     * @returns the equivalent degrees
     */
    static toDeg(rad: number): number;
    /**
    * Rounds the specied decimal number if it's close enough to its rounded value
    * @param {Number} num: a decimal number
    * @param {Number} acceptableDiff: the minimal difference between the given decimal number and it's rounded conterpart, for them be considered the same
    * @returns The potentially adjusted number
    */
    static getAcceptableDiff(num: number, acceptableDiff?: number): number;
    /**
    * @param {[Number|Object]} arr: array containing numbers or objects a numberic property
    * @param {String?} propPath: the path of the compared value if the array is containing objects
    * @returns the [min, max] values of the array
    */
    static getMinMax(arr: [number | any], propPath?: string | null): number[];
    /**
    * Calls a function repeatedly with a delay between calls
    * @param {Number} iterationCount: the number of time the callback is called
    * @param {Function} callback: the function to call (i)=>
    * @param {Number} delay: delay between each calls
    */
    static repeatedTimeout(iterationCount: number, callback: Function, delay?: number): void;
    static stackTraceLog(...logs: any[]): void;
}
export class FPSCounter {
    static COMMON_REFRESH_RATES: number[];
    static ABNORMAL_FLUCTUATION_THRESHOLD: number;
    /**
     * Allows to get the current frames per second.
     * To use: either getFpsRaw for raw fps, AND/OR getFps for a smoother fps display
     * @param {Number?} averageSampleSize: the sample size used to calculate the current fps average
     */
    constructor(averageSampleSize: number | null);
    _averageSampleSize: number;
    _times: any[];
    _averageSample: any[];
    _maxFps: number;
    /**
     * Run in a loop to get how many times per seconds it runs
     * @returns the current amount of times ran in a second
     */
    getFpsRaw(): number;
    /**
     * Run in a loop to get how many times per seconds it runs
     * @returns the current averaged amount of times ran in a second
     */
    getFps(): number;
    /**
     * Compares the max acheive fps and a chart of common refresh rates. (This function only works while either 'getFpsRaw()' or 'getFps' is running in a loop)
     * @param {Number?} forceFPS: if defined, returns the probable refresh rate for this fps value. Defaults to the user's max fps.
     * @returns the probable refresh rate of the user or null if not enough time has passed
     */
    getApproximatedUserRefreshRate(forceFPS?: number | null): number;
    /**
     * Tries to calculate the most stable fps based on the current amount of lag, device performance / capabilities. Results will fluctuate over time. (This function only works while 'getFps()' is running in a loop)
     * @param {Boolean?} prioritizeStability: whether the recommended value prioritizes a lower but, more stable fps value over a higher, but less stable fps value
     * @param {Number?} stabilityThreshold: the stability threshold used when prioritizeStability is enabled. The higher this is, the more inclined it is to return a higher fps value when close to the next fps threshold
     * @returns the recommended fps value
     */
    getRecommendedFPS(prioritizeStability?: boolean | null, stabilityThreshold?: number | null): number;
    /**
     * Runs getRecommendedFPS multiple times over a period of time to figure out what is the recommended fps value in a specific environment.
     * @param {Function} resultCB: a function called once the evaluation ends, containing the recommended value and statistics. (results)=>
     * @param {Number?} duration: the evalution duration in miliseconds. (The evaluation will last exactly 1 second longer than this value)
     * @param {Number?} sampleCount: how many getRecommendedFPS samples to take in order to recommend a fps value
     * @param {Boolean?} prioritizeStability: whether the recommended value prioritizes a lower but, more stable fps value over a higher, but less stable fps value
     * @param {Number?} stabilityThreshold: the stability threshold used when prioritizeStability is enabled. The higher this is, the more inclined it is to return a higher fps value when close to the next fps threshold
     */
    runRecommendedFPSEvaluation(resultCB: Function, duration?: number | null, sampleCount?: number | null, prioritizeStability?: boolean | null, stabilityThreshold?: number | null): void;
    get instanceOf(): string;
    get maxFps(): number;
    set averageSampleSize(averageSampleSize: number);
    get averageSampleSize(): number;
    get fpsRaw(): number;
}
export class CanvasUtils {
    static SHOW_CENTERS_DOT_ID: {};
    static toggleCenter(canvas: any, shape: any, radius?: number, color?: number[]): void;
    static showIntersectionPoints(canvas: any, res: any): void;
    /**
     * Returns true if the provided dot is the first one of the shape
     * @param {Dot} dot: a Dot in a Shape
     */
    static firstDotOnly(dot: Dot): boolean;
    /**
     * Generic function to draw an outer ring around a dot
     * @param {Dot} dot: a Dot instance
     * @param {RenderStyles | [r,g,b,a]} renderStyles: the style profile or color of the ring
     * @param {Number?} radiusMultiplier: the ring radius is based on the dot's radius times the radius multiplier
     * @param {Boolean?} forceBatching: allows to force batching even if a URL filter is defined
     */
    static drawOuterRing(dot: Dot, renderStyles: RenderStyles | [r, g, b, a], radiusMultiplier?: number | null, forceBatching?: boolean | null): void;
    /**
     * Generic function to draw connection line between the specified dot and a sourcePos
     * @param {Dot} dot: a Dot instance
     * @param {Dot | [x,y]} target: a Dot instance or a pos array
     * @param {RenderStyles | [r,g,b,a]} renderStyles: the style profile or color of the line
     * @param {Number} radiusPaddingMultiplier: the padding around the dot based on the multiplication of its radius
     * @param {Render.LINE_TYPES} lineType: the line type to use
     * @param {Number?} spread: a modifier value for the default control pos generation (for bezier and quadratic curves)
     * @param {Boolean?} forceBatching: allows to force batching even if a URL filter is defined
     */
    static drawLine(dot: Dot, target: Dot | [x, y], renderStyles: RenderStyles | [r, g, b, a], radiusPaddingMultiplier: number, lineType: {
        LINEAR: typeof Render.getLine;
        QUADRATIC: typeof Render.getQuadCurve;
        CUBIC_BEZIER: typeof Render.getBezierCurve;
    }, spread: number | null, forceBatching: boolean | null): void;
    /**
     * Generic function to draw connection lines between the specified dot and all the dots in its connections property
     * @param {Dot} dot: a Dot instance
     * @param {RenderStyles | [r,g,b,a]} renderStyles: the style profile or color of the line
     * @param {Number} radiusPaddingMultiplier: the padding around the dot based on the multiplication of its radius
     * @param {Render.LINE_TYPES} lineType: the line type to use
     * @param {Number?} spread: a modifier value for the default control pos generation (for bezier and quadratic curves)
     * @param {Boolean?} forceBatching: allows to force batching even if a URL filter is defined
     */
    static drawDotConnections(dot: Dot, renderStyles: RenderStyles | [r, g, b, a], radiusPaddingMultiplier: number, lineType: {
        LINEAR: typeof Render.getLine;
        QUADRATIC: typeof Render.getQuadCurve;
        CUBIC_BEZIER: typeof Render.getBezierCurve;
    }, spread: number | null, forceBatching: boolean | null): void;
    /**
     * Generic function to get a callback that can make a dot draggable and throwable. This function should only be called once, but the returned callback, every frame.
     * @param {Boolean?} disableMultipleDrag: if true, disables dragging multiple objects at once
     * @returns a callback to be called in the drawEffectCB of the shape containing the dot, only for the dot, and giving the following parameters: (dot, mouse, dist, ratio, pickableRadius?)=>{...}
     */
    static getDraggableDotCB(disableMultipleDrag?: boolean | null): (dot: any, mouse: any, dist: any, ratio: any, pickableRadius?: number) => void;
    /**
     * Returns a callback allowing a dot to have a custom trail effect. This function should only be called once, but the returned callback, every frame.
     * @param {Canvas} canvas: canvas instance
     * @param {Dot} dot: a Dot instance
     * @param {Number} length: the number of the trail elements (fake dots)
     * @param {Function?} moveEffectCB: called on each movement for each trail element. (trailElement, ratio, isMoving, mouse, trailElementPos, trailElementIndex)=>
     * @param {Boolean?} disableDefaultMovements: if true, disables default movements of trail elements. Useful if custom movements are defined in the "moveEffectCB"
     * @returns a callback to be called in the drawEffectCB of the shape containing the dot, only for the target dot, and giving the following parameter: (mouse)=>{...}
     */
    static getTrailEffectCB(canvas: Canvas, dot: Dot, length?: number, moveEffectCB?: Function | null, disableDefaultMovements?: boolean | null): (mouse: any) => void;
    /**
     * Returns a callback allowing an object to move between it's current pos and a pos at a specific distance. This function should only be called once, but the returned callback, every frame inside a animation callback.
     * @param {_BaseObj} obj: a _BaseObj inheritor instance
     * @param {[distanceX, distanceY]?} distances: the X/Y distances to move the object to
     * @param {Boolean?} isAdditive: whether the pos of the object is set in a relative or absolute manner
     * @returns a callback to be called by an animation
     */
    static getMovementOscillatorCB(obj: _BaseObj, distances?: any, isAdditive?: boolean | null): (prog: any, i: any) => void;
    /**
     * Generic function to rotate the gradient of an object
     * @param {_BaseObj} obj: a _BaseObj inheritor instance
     * @param {Number?} duration: the duration of a full animation cycle
     * @param {Number?} speed: the speed modifier of the spin
     * @param {Boolean} isFillColor: whether the fillColor or the color is to spin
     * @returns the created Anim instace
     */
    static rotateGradient(obj: _BaseObj, duration?: number | null, speed?: number | null, isFillColor?: boolean): Anim;
    /**
     * Rotates the provided obj for it to face the target.
     * @param {_BaseObj} obj: a _BaseObj inheritor instance
     * @param {[x,y] | _BaseObj} obtargetj: a pos array or a _BaseObj inheritor instance to rotate towards
     * @param {Number?} offset: the rotation offset in degrees. (facing: top=90, right=0, bottom=270, left=180)
     */
    static lookAt(obj: _BaseObj, target: any, offset?: number | null): void;
    /**
     * Draws the minimal rectangular area fitting the provided object
     * @param {Render} render: a Render instance to draw with
     * @param {_BaseObj} obj: a _BaseObj inheritor instance
     * @param {Color | [r,g,b,a] ?} color: the color of the outline
     */
    static drawOutline(render: Render, obj: _BaseObj, color?: Color | ([r, g, b, a] | null)): void;
    /**
     * Draws the accurate area fitting the provided object
     * @param {Render} render: a Render instance to draw with
     * @param {_BaseObj} obj: a _BaseObj inheritor instance
     * @param {Color | [r,g,b,a] ?} color: the color of the outline
     */
    static drawOutlineAccurate(render: Render, obj: _BaseObj, color?: Color | ([r, g, b, a] | null)): void;
    /**
     * Draws a dot at the provided pos
     * @param {Render} render: a Render instance to draw with
     * @param {[x,y]} pos: the pos
     * @param {Color | [r,g,b,a] ?} color: the color of the dot
     * @param {Number?} radius: the radius of the dot
     */
    static drawPos(render: Render, pos: [x, y], color: Color | ([r, g, b, a] | null), radius: number | null): void;
    static SHAPES: {
        DEBUG_SHAPE: (pos: any, dots: any) => Shape;
        THROWABLE_DOT: (pos: any, radius: any, color: any) => Shape;
    };
    /**
     * Creates a simple drawable area with mouse control, as a canvas object
     * @param {Canvas} CVS: The Canvas instance to use
     * @param {[[x1, y1], [x2, y2]]?} borderPositions: The two corners delimiting the draw area
     * @param {RenderStyles | [r,g,b,a]?} renderStyles: The style profile / color of the drawings
     * @param {Number?} newLineMoveThreshold: The number of mouse events to wait before drawing a line
     * @param {Color | [r,g,b,a]?} borderColor: The color of the border
     * @returns the created object and the mouse listeners ids
     */
    static createDrawingBoard(CVS: Canvas, borderPositions?: [[x1, y1], [x2, y2]] | null, renderStyles?: RenderStyles | ([r, g, b, a] | null), newLineMoveThreshold?: number | null, borderColor?: Color | ([r, g, b, a] | null)): {
        obj: Shape;
        mouseListeners: {
            click: any;
            enter: any;
            move: any;
        };
    };
    /**
     * Creates a blank, setup/loop only, object. Can be used to draw non objects.
     * @param {Canvas} CVS: The Canvas instance to use
     * @param {Function} setupCB: Function called on object's initialization. (this, this.parent)=>
     * @param {Function} loopCB Function called each frame for this object (this)=>
     * @returns The created empty Shape object
     */
    static createEmptyObj(CVS: Canvas, setupCB: Function, loopCB: Function): Shape;
    /**
     * Creates a simple button
     * @param {Canvas} CVS: the canvas instance to use
     * @param {String?} text: the button's text
     * @param {[x,y]?} pos: the center pos of the button
     * @param {Function?} onClickCB: function called on button click
     * @param {String | [r,g,b,a] | Color?} fillColor: the fill color of the button
     * @param {String | [r,g,b,a] | Color?} textColor: the text color of the button
     * @param {[paddingX, paddingY]?} padding: the vertical and horizontal padding of the button
     * @param {Function?} onHoverCB: function called on button enter/leave
     * @param {Boolean?} disableDefaultEffects: if true, disable all default visual effects
     * @returns the button as a FilledShape and a TextDisplay: [FilledShape, TextDisplay]
     */
    static createButton(CVS: Canvas, text?: string | null, pos?: [x, y] | null, onClickCB?: Function | null, fillColor?: string | [r, g, b, a] | (Color | null), textColor?: string | [r, g, b, a] | (Color | null), padding?: [paddingX, paddingY] | null, onHoverCB?: Function | null, disableDefaultEffects?: boolean | null): any[];
    /**
     * Provides generic follow paths
     */
    static FOLLOW_PATHS: {
        INFINITY_SIGN: (width: any, height: any, progressOffset: any) => (number | ((prog: any) => number[]))[][];
        CIRCLE: (width: any, height: any, progressOffset: any) => (number | ((prog: any) => number[]))[][];
        RECTANGLE: (width: any, height: any, progressOffset: any) => (number | ((prog: any) => any[]))[][];
        QUADRATIC: (width: any, height: any, isFliped: any) => (number | ((prog: any) => number[]))[][];
        LINEAR: (width: any, a: any) => (number | ((prog: any) => number[]))[][];
        SINE_WAVE: (width: any, height: any) => (number | ((prog: any) => number[]))[][];
        COSINE_WAVE: (width: any, height: any) => (number | ((prog: any) => number[]))[][];
        RELATIVE: (forceX: any, forceY: any) => (number | ((prog: any) => any[]))[][];
    };
}
export class Color {
    static DEFAULT_COLOR: string;
    static DEFAULT_RGBA: number[];
    static DEFAULT_COLOR_VALUE: string;
    static CSS_COLOR_TO_RGBA_CONVERTIONS: {
        transparent: number[];
        aliceblue: number[];
        antiquewhite: number[];
        aqua: number[];
        aquamarine: number[];
        azure: number[];
        beige: number[];
        bisque: number[];
        black: number[];
        blanchedalmond: number[];
        blue: number[];
        blueviolet: number[];
        brown: number[];
        burlywood: number[];
        cadetblue: number[];
        chartreuse: number[];
        chocolate: number[];
        coral: number[];
        cornflowerblue: number[];
        cornsilk: number[];
        crimson: number[];
        cyan: number[];
        darkblue: number[];
        darkcyan: number[];
        darkgoldenrod: number[];
        darkgray: number[];
        darkgreen: number[];
        darkkhaki: number[];
        darkmagenta: number[];
        darkolivegreen: number[];
        darkorange: number[];
        darkorchid: number[];
        darkred: number[];
        darksalmon: number[];
        darkseagreen: number[];
        darkslateblue: number[];
        darkslategray: number[];
        darkturquoise: number[];
        darkviolet: number[];
        deeppink: number[];
        deepskyblue: number[];
        dimgray: number[];
        dodgerblue: number[];
        firebrick: number[];
        floralwhite: number[];
        forestgreen: number[];
        fuchsia: number[];
        gainsboro: number[];
        ghostwhite: number[];
        gold: number[];
        goldenrod: number[];
        gray: number[];
        grey: number[];
        green: number[];
        greenyellow: number[];
        honeydew: number[];
        hotpink: number[];
        indianred: number[];
        indigo: number[];
        ivory: number[];
        khaki: number[];
        lavender: number[];
        lavenderblush: number[];
        lawngreen: number[];
        lemonchiffon: number[];
        lightblue: number[];
        lightcoral: number[];
        lightcyan: number[];
        lightgoldenrodyellow: number[];
        lightgray: number[];
        lightgreen: number[];
        lightpink: number[];
        lightsalmon: number[];
        lightseagreen: number[];
        lightskyblue: number[];
        lightslategray: number[];
        lightsteelblue: number[];
        lightyellow: number[];
        lime: number[];
        limegreen: number[];
        linen: number[];
        magenta: number[];
        maroon: number[];
        mediumaquamarine: number[];
        mediumblue: number[];
        mediumorchid: number[];
        mediumpurple: number[];
        mediumseagreen: number[];
        mediumslateblue: number[];
        mediumspringgreen: number[];
        mediumturquoise: number[];
        mediumvioletred: number[];
        midnightblue: number[];
        mintcream: number[];
        mistyrose: number[];
        moccasin: number[];
        navajowhite: number[];
        navy: number[];
        oldlace: number[];
        olive: number[];
        olivedrab: number[];
        orange: number[];
        orangered: number[];
        orchid: number[];
        palegoldenrod: number[];
        palegreen: number[];
        paleturquoise: number[];
        palevioletred: number[];
        papayawhip: number[];
        peachpuff: number[];
        peru: number[];
        pink: number[];
        plum: number[];
        powderblue: number[];
        purple: number[];
        rebeccapurple: number[];
        red: number[];
        rosybrown: number[];
        royalblue: number[];
        saddlebrown: number[];
        salmon: number[];
        sandybrown: number[];
        seagreen: number[];
        seashell: number[];
        sienna: number[];
        silver: number[];
        skyblue: number[];
        slateblue: number[];
        slategray: number[];
        snow: number[];
        springgreen: number[];
        steelblue: number[];
        tan: number[];
        teal: number[];
        thistle: number[];
        tomato: number[];
        turquoise: number[];
        violet: number[];
        wheat: number[];
        white: number[];
        whitesmoke: number[];
        yellow: number[];
        yellowgreen: number[];
    };
    static RGBA_TO_CSS_COLOR_CONVERTIONS: {
        "0,0,0,0": string;
        "240,248,255,1": string;
        "250,235,215,1": string;
        "0,255,255,1": string;
        "127,255,212,1": string;
        "240,255,255,1": string;
        "245,245,220,1": string;
        "255,228,196,1": string;
        "0,0,0,1": string;
        "255,235,205,1": string;
        "0,0,255,1": string;
        "138,43,226,1": string;
        "165,42,42,1": string;
        "222,184,135,1": string;
        "95,158,160,1": string;
        "127,255,0,1": string;
        "210,105,30,1": string;
        "255,127,80,1": string;
        "100,149,237,1": string;
        "255,248,220,1": string;
        "220,20,60,1": string;
        "0,0,139,1": string;
        "0,139,139,1": string;
        "184,134,11,1": string;
        "169,169,169,1": string;
        "0,100,0,1": string;
        "189,183,107,1": string;
        "139,0,139,1": string;
        "85,107,47,1": string;
        "255,140,0,1": string;
        "153,50,204,1": string;
        "139,0,0,1": string;
        "233,150,122,1": string;
        "143,188,143,1": string;
        "72,61,139,1": string;
        "47,79,79,1": string;
        "0,206,209,1": string;
        "148,0,211,1": string;
        "255,20,147,1": string;
        "0,191,255,1": string;
        "105,105,105,1": string;
        "30,144,255,1": string;
        "178,34,34,1": string;
        "255,250,240,1": string;
        "34,139,34,1": string;
        "220,220,220,1": string;
        "248,248,255,1": string;
        "255,215,0,1": string;
        "218,165,32,1": string;
        "128,128,128,1": string;
        "0,128,0,1": string;
        "173,255,47,1": string;
        "240,255,240,1": string;
        "255,105,180,1": string;
        "205,92,92,1": string;
        "75,0,130,1": string;
        "255,255,240,1": string;
        "240,230,140,1": string;
        "230,230,250,1": string;
        "255,240,245,1": string;
        "124,252,0,1": string;
        "255,250,205,1": string;
        "173,216,230,1": string;
        "240,128,128,1": string;
        "224,255,255,1": string;
        "250,250,210,1": string;
        "211,211,211,1": string;
        "144,238,144,1": string;
        "255,182,193,1": string;
        "255,160,122,1": string;
        "32,178,170,1": string;
        "135,206,250,1": string;
        "119,136,153,1": string;
        "176,224,230,1": string;
        "255,255,224,1": string;
        "0,255,0,1": string;
        "50,205,50,1": string;
        "250,240,230,1": string;
        "255,0,255,1": string;
        "128,0,0,1": string;
        "102,205,170,1": string;
        "0,0,205,1": string;
        "186,85,211,1": string;
        "147,112,219,1": string;
        "60,179,113,1": string;
        "123,104,238,1": string;
        "0,250,154,1": string;
        "72,209,204,1": string;
        "199,21,133,1": string;
        "25,25,112,1": string;
        "245,255,250,1": string;
        "255,228,225,1": string;
        "255,228,181,1": string;
        "255,222,173,1": string;
        "0,0,128,1": string;
        "253,245,230,1": string;
        "128,128,0,1": string;
        "107,142,35,1": string;
        "255,165,0,1": string;
        "255,69,0,1": string;
        "218,112,214,1": string;
        "238,232,170,1": string;
        "152,251,152,1": string;
        "175,238,238,1": string;
        "219,112,147,1": string;
        "255,239,213,1": string;
        "255,218,185,1": string;
        "205,133,63,1": string;
        "255,192,203,1": string;
        "221,160,221,1": string;
        "128,0,128,1": string;
        "102,51,153,1": string;
        "255,0,0,1": string;
        "188,143,143,1": string;
        "65,105,225,1": string;
        "139,69,19,1": string;
        "250,128,114,1": string;
        "244,164,96,1": string;
        "46,139,87,1": string;
        "255,245,238,1": string;
        "160,82,45,1": string;
        "192,192,192,1": string;
        "135,206,235,1": string;
        "106,90,205,1": string;
        "112,128,144,1": string;
        "255,250,250,1": string;
        "0,255,127,1": string;
        "70,130,180,1": string;
        "210,180,140,1": string;
        "0,128,128,1": string;
        "216,191,216,1": string;
        "255,99,71,1": string;
        "64,224,208,1": string;
        "238,130,238,1": string;
        "245,222,179,1": string;
        "255,255,255,1": string;
        "245,245,245,1": string;
        "255,255,0,1": string;
        "154,205,50,1": string;
    };
    static FORMATS: {
        RGBA: string;
        TEXT: string;
        HEX: string;
        GRADIENT: string;
        PATTERN: string;
        COLOR: string;
        HSV: string;
    };
    static CONVERTABLE_FORMATS: {
        RGBA: string;
        TEXT: string;
        HEX: string;
        HSV: string;
    };
    static STRICT_FORMATS: {
        RGBA: string;
        COLOR: string;
    };
    static DEFAULT_TEMPERANCE: number;
    static SEARCH_STARTS: {
        TOP_LEFT: string;
        BOTTOM_RIGHT: string;
    };
    static DEFAULT_SEARCH_START: string;
    static DEFAULT_DECIMAL_ROUNDING_POINT: number;
    static OPACITY_VISIBILITY_THRESHOLD: number;
    /**
     * Converts a color to another color format
     * @param {String | [r,g,b,a] | Color} color: the color to convert
     * @param {Color.CONVERTABLE_FORMATS} format
     * @returns the color in the provided format
     */
    static convertTo(color: string | [r, g, b, a] | Color, format?: {
        RGBA: string;
        TEXT: string;
        HEX: string;
        HSV: string;
    }): string | [r, g, b, a] | Color;
    /**
     * Returns a random color value
     * @param {Color.CONVERTABLE_FORMATS} outputFormat: the result's ouput format, one of CONVERTABLE_FORMATS
     * @param {Boolean} randomizeAlpha: whether the alpha is also randomized, if false, alpha defaults to 1
     * @param {Array} rRange: if defined, defines the min/max range to chose the r value from
     * @param {Array} gRange: if defined, defines the min/max range to chose the g value from
     * @param {Array} bRange: if defined, defines the min/max range to chose the b value from
     * @param {Array} aRange: if defined, defines the min/max range to chose the a value from
     */
    static random(outputFormat?: {
        RGBA: string;
        TEXT: string;
        HEX: string;
        HSV: string;
    }, randomizeAlpha?: boolean, rRange?: any[], gRange?: any[], bRange?: any[], aRange?: any[]): string | number[] | [r, g, b, a] | Color;
    static #unlinkRGBA(rgba: any): any[];
    static #rgbaToHsv(rgba: any): number[];
    static #hsvToRgba(hsv: any): number[];
    static #rgbaToHex(rgba: any): string;
    static #hexToRgba(hex: any): number[];
    /**
     * Returns the format of the provided color
     * @param {String | [r,g,b,a] | Color} color: the color definition
     */
    static getFormat(color: string | [r, g, b, a] | Color): string;
    /**
     * Uniquifies a color to a unique Color instance
     * @param {String | [r,g,b,a] | Color} color: a color definition
     * @returns a unique Color instance
     */
    static uniquify(color: string | [r, g, b, a] | Color): Color;
    /**
     * Adds specific values to a rgba array
     * @param {[r,g,b,a]} rgba: the rgba array to modify
     * @param {Number?} rValue: the red value to add
     * @param {Number?} gValue: the green value to add
     * @param {Number?} bValue: the blue value to add
     * @param {Number?} aValue: the alpha value to add
     * @returns an updated rgba array
     */
    static rgbaAdd(rgba: [r, g, b, a], rValue?: number | null, gValue?: number | null, bValue?: number | null, aValue?: number | null): number[];
    /**
     * Adds a value to a each value of a rgba array (except alpha)
     * @param {[r,g,b,a]} rgba: the rgba array to modify
     * @param {Number?} value: the value to add
     * @returns an updated rgba array
     */
    static rgbaAddAll(rgba: [r, g, b, a], value?: number | null): any[];
    /**
     * Sets specific values of a rgba array
     * @param {[r,g,b,a]} rgba: the rgba array to modify
     * @param {Number?} rValue: the new red value
     * @param {Number?} gValue: the new green value
     * @param {Number?} bValue: the new blue value
     * @param {Number?} aValue: the new alpha value
     * @returns an updated rgba array
     */
    static rgbaSet(rgba: [r, g, b, a], rValue: number | null, gValue: number | null, bValue: number | null, aValue: number | null): number[];
    /**
     * Updates a rgba array by hsv modifications
     * @param {[r,g,b,a]} rgba: the rgba array to modify
     * @param {Number?} hueValue: the hue value to add
     * @param {Number?} saturationValue: the saturation value to add
     * @param {Number?} brightnessValue: the brightness value to add
     * @returns an updated rgba array
     */
    static rgbaHsvAdd(rgba: [r, g, b, a], hueValue: number | null, saturationValue: number | null, brightnessValue: number | null): number[];
    /**
     * Formats a rgba array to a usable rgba value
     * @param {[r,g,b,a]} rgba: the rgba array to format
     * @returns a string containing the color as rgba format
     */
    static formatRgba(rgba: [r, g, b, a]): string;
    /**
     * Creates an rgba array
     * @param {Number?} r: a number between 0 and 255 that represents the red value
     * @param {Number?} g: a number between 0 and 255 that represents the green value
     * @param {Number?} b: a number between 0 and 255 that represents the blue value
     * @param {Number?} a: a number between 0 and 1 that represents the opacity
     * @returns the created rgba array
     */
    static rgba(r?: number | null, g?: number | null, b?: number | null, a?: number | null): number[];
    /**
     * Returns the usable value of a color from any supported format
     * @param {String | [r,g,b,a] | Color} color: the color definition
     */
    static getColorValue(color: string | [r, g, b, a] | Color): any;
    /**
     * Returns the first pos where the provided color is found in the canvas
     * @param {Canvas} canvas: Canvas instance
     * @param {Color} color: Color instance
     * @param {Boolean} useAlpha: Whether the search considers opacity
     * @param {Number} temperance: The validity margin for the r,g,b,a values
     * @param {SEARCH_STARTS} searchStart: Direction from which the search starts
     * @param {[width, height]} areaSize: The search area. (Defaults to the canvas size)
     * @returns The found pos [x,y] or null if nothing was found
     */
    static findFirstPos(canvas: Canvas, color: Color, useAlpha?: boolean, temperance?: number, searchStart?: SEARCH_STARTS, areaSize?: any): number[];
    /**
     * Represents a color value
     * @param {String | [r,g,b,a] | Color} color: the color definition
     * @param {Boolean?} isChannel: if true, this Color will be used as a channel and will not duplicate
     */
    constructor(color: string | [r, g, b, a] | Color, isChannel?: boolean | null);
    _color: string | [r, g, b, a];
    _format: string;
    _isChannel: boolean;
    /**
     * Converts a color to another color format
     * @param {String | [r,g,b,a] | Color} color: the color to convert
     * @param {Color.CONVERTABLE_FORMATS} format
     * @returns the color in the provided format
     */
    convertTo(color?: string | [r, g, b, a] | Color, format?: {
        RGBA: string;
        TEXT: string;
        HEX: string;
        HSV: string;
    }): string | [r, g, b, a] | Color;
    /**
     * Returns a new instance of the same color
     * @param {[pos1, pos2]} dynamicColorPositions: the positions if the color is a _DynamicColor instance
     */
    duplicate(dynamicColorPositions: [pos1, pos2]): Color;
    toString(): any;
    get instanceOf(): string;
    set color(color: any);
    get color(): any;
    get colorRaw(): string | [r, g, b, a];
    get isChannel(): boolean;
    set rgba(rgba: any);
    get rgba(): any;
    get hsv(): any;
    set r(r: any);
    get r(): any;
    set g(g: any);
    get g(): any;
    set b(b: any);
    get b(): any;
    set a(a: any);
    get a(): any;
    set hue(hue: any);
    get hue(): any;
    set saturation(saturation: any);
    get saturation(): any;
    set brightness(brightness: any);
    get brightness(): any;
    #private;
}
export class _HasColor {
    /**
     * Abstract class, provides color attributes to other classes
     * @param {String | [r,g,b,a] | Color | Function} color: the color definition
     */
    constructor(color: string | [r, g, b, a] | Color | Function);
    _initColor: string | Function | [r, g, b, a] | Color;
    _color: string | Function | [r, g, b, a] | Color;
    getInitColor(): any;
    get instanceOf(): string;
    get colorObject(): string | Function | [r, g, b, a] | Color;
    get colorRaw(): any;
    set color(color: any);
    get color(): any;
    set initColor(initColor: string | Function | [r, g, b, a] | Color);
    get initColor(): string | Function | [r, g, b, a] | Color;
    get rgba(): any;
    set r(r: any);
    get r(): any;
    set g(g: any);
    get g(): any;
    set b(b: any);
    get b(): any;
    set a(a: any);
    get a(): any;
    get hsv(): any;
    set hue(hue: any);
    get hue(): any;
    set saturation(saturation: any);
    get saturation(): any;
    set brightness(brightness: any);
    get brightness(): any;
}
export class GridAssets {
    static D: {
        places: any[];
    };
    static DEFAULT_SOURCE: {
        width: number;
        height: number;
        A: any[][];
        B: any[][];
        C: any[][];
        D: any[][];
        E: any[][];
        F: any[][];
        G: any[][];
        H: any[][];
        I: any[][];
        J: any[][];
        K: any[][];
        L: any[][];
        M: any[][];
        N: any[][];
        O: any[][];
        P: any[][];
        Q: any[][];
        R: any[][];
        S: any[][];
        T: any[][];
        U: any[][];
        V: any[][];
        W: any[][];
        X: any[][];
        Y: any[][];
        Z: any[][];
        a: any[][];
        b: any[][];
        c: any[][];
        d: any[][];
        e: any[][];
        f: any[][];
        g: any[][];
        h: any[][];
        i: any[][];
        j: any[][];
        k: any[][];
        l: any[][];
        m: any[][];
        n: any[][];
        o: any[][];
        p: any[][];
        q: any[][];
        r: any[][];
        s: any[][];
        t: any[][];
        u: any[][];
        v: any[][];
        w: any[][];
        x: any[][];
        y: any[][];
        z: any[][];
        "!": any[][];
        "?": any[][];
        "@": any[][];
        "#": any[][];
        $: any[][];
        "%": any[][];
        "^": any[][];
        "&": any[][];
        "*": any[][];
        "(": any[][];
        ")": any[][];
        "{": any[][];
        "}": any[][];
        ",": any[][];
        ".": any[][];
        "+": any[][];
        _: any[][];
        "-": any[][];
        "=": any[][];
        ";": any[][];
        ":": any[][];
        "[": any[][];
        "]": any[][];
        "'": any[][];
        "|": any[][];
        "/": any[][];
        "\\": any[][];
        "0": any[][];
        "1": any[][];
        "2": any[][];
        "3": any[][];
        "4": any[][];
        "5": any[][];
        "6": any[][];
        "7": any[][];
        "8": any[][];
        "9": any[][];
    };
    static get fontSource5x5(): {
        width: number;
        height: number;
        A: any[][];
        B: any[][];
        C: any[][];
        D: any[][];
        E: any[][];
        F: any[][];
        G: any[][];
        H: any[][];
        I: any[][];
        J: any[][];
        K: any[][];
        L: any[][];
        M: any[][];
        N: any[][];
        O: any[][];
        P: any[][];
        Q: any[][];
        R: any[][];
        S: any[][];
        T: any[][];
        U: any[][];
        V: any[][];
        W: any[][];
        X: any[][];
        Y: any[][];
        Z: any[][];
        a: any[][];
        b: any[][];
        c: any[][];
        d: any[][];
        e: any[][];
        f: any[][];
        g: any[][];
        h: any[][];
        i: any[][];
        j: any[][];
        k: any[][];
        l: any[][];
        m: any[][];
        n: any[][];
        o: any[][];
        p: any[][];
        q: any[][];
        r: any[][];
        s: any[][];
        t: any[][];
        u: any[][];
        v: any[][];
        w: any[][];
        x: any[][];
        y: any[][];
        z: any[][];
        "!": any[][];
        "?": any[][];
        "@": any[][];
        "#": any[][];
        $: any[][];
        "%": any[][];
        "^": any[][];
        "&": any[][];
        "*": any[][];
        "(": any[][];
        ")": any[][];
        "{": any[][];
        "}": any[][];
        ",": any[][];
        ".": any[][];
        "+": any[][];
        _: any[][];
        "-": any[][];
        "=": any[][];
        ";": any[][];
        ":": any[][];
        "[": any[][];
        "]": any[][];
        "'": any[][];
        "|": any[][];
        "/": any[][];
        "\\": any[][];
        "0": any[][];
        "1": any[][];
        "2": any[][];
        "3": any[][];
        "4": any[][];
        "5": any[][];
        "6": any[][];
        "7": any[][];
        "8": any[][];
        "9": any[][];
    };
}
export class TypingDevice {
    static KEYS: {
        A: string;
        B: string;
        C: string;
        D: string;
        E: string;
        F: string;
        G: string;
        H: string;
        I: string;
        J: string;
        K: string;
        L: string;
        M: string;
        N: string;
        O: string;
        P: string;
        Q: string;
        R: string;
        S: string;
        T: string;
        U: string;
        V: string;
        W: string;
        X: string;
        Y: string;
        Z: string;
        DIGIT_0: string;
        DIGIT_1: string;
        DIGIT_2: string;
        DIGIT_3: string;
        DIGIT_4: string;
        DIGIT_5: string;
        DIGIT_6: string;
        DIGIT_7: string;
        DIGIT_8: string;
        DIGIT_9: string;
        SPACE: string;
        ENTER: string;
        TAB: string;
        BACKSPACE: string;
        ESCAPE: string;
        SHIFT: string;
        CONTROL: string;
        ALT: string;
        ALT_GRAPH: string;
        META: string;
        CAPS_LOCK: string;
        CONTEXT_MENU: string;
        ARROW_UP: string;
        ARROW_DOWN: string;
        ARROW_LEFT: string;
        ARROW_RIGHT: string;
        HOME: string;
        END: string;
        PAGE_UP: string;
        PAGE_DOWN: string;
        INSERT: string;
        DELETE: string;
        F1: string;
        F2: string;
        F3: string;
        F4: string;
        F5: string;
        F6: string;
        F7: string;
        F8: string;
        F9: string;
        F10: string;
        F11: string;
        F12: string;
        F13: string;
        F14: string;
        F15: string;
        F16: string;
        F17: string;
        F18: string;
        F19: string;
        F20: string;
        F21: string;
        F22: string;
        F23: string;
        F24: string;
        NUMPAD_0: string;
        NUMPAD_1: string;
        NUMPAD_2: string;
        NUMPAD_3: string;
        NUMPAD_4: string;
        NUMPAD_5: string;
        NUMPAD_6: string;
        NUMPAD_7: string;
        NUMPAD_8: string;
        NUMPAD_9: string;
        NUMPAD_ADD: string;
        NUMPAD_SUBTRACT: string;
        NUMPAD_MULTIPLY: string;
        NUMPAD_DIVIDE: string;
        NUMPAD_DECIMAL: string;
        NUMPAD_ENTER: string;
        PAUSE: string;
        PRINT_SCREEN: string;
        SCROLL_LOCK: string;
        NUM_LOCK: string;
        LAUNCH_APPLICATION_1: string;
        LAUNCH_APPLICATION_2: string;
        BRACKET_LEFT: string;
        BRACKET_RIGHT: string;
        SEMICOLON: string;
        QUOTE: string;
        COMMA: string;
        PERIOD: string;
        SLASH: string;
        BACKSLASH: string;
        EQUAL: string;
        MINUS: string;
        BACKQUOTE: string;
        AUDIO_VOLUME_UP: string;
        AUDIO_VOLUME_DOWN: string;
        AUDIO_VOLUME_MUTE: string;
        MEDIA_PLAY_PAUSE: string;
        MEDIA_NEXT_TRACK: string;
        MEDIA_PREVIOUS_TRACK: string;
        MEDIA_STOP: string;
        BROWSER_BACK: string;
        BROWSER_FORWARD: string;
        BROWSER_REFRESH: string;
        BROWSER_STOP: string;
        BROWSER_SEARCH: string;
        BROWSER_FAVORITES: string;
        BROWSER_HOME: string;
    };
    _keysPressed: any[];
    setDown(e: any): void;
    setUp(e: any): void;
    /**
     * Checks if a key is pressed
     * @param {String | Array} keys: the key or key group
     * @returns  whether (one of) the provided key(s) is down
     */
    isDown(keys: string | any[]): any;
    /**
     * @returns whether any key is pressed
     */
    hasKeysDown(): boolean;
    get instanceOf(): string;
    get keysPressedRaw(): any[];
    set keysPressed(keysPressed: any[]);
    get keysPressed(): any[];
    get keyCodesPressed(): any[];
}
export class Mouse {
    static DEFAULT_MOUSE_DECELERATION: number;
    static DEFAULT_MOUSE_MOVE_TRESHOLD: number;
    static DEFAULT_MOUSE_ANGULAR_DECELERATION: number;
    static #LISTENER_ID_GIVER: number;
    static LISTENER_TYPES: {
        CLICK: number;
        DOWN: number;
        UP: number;
        MAIN_DOWN: number;
        MAIN_UP: number;
        MIDDLE_DOWN: number;
        MIDDLE_UP: number;
        RIGHT_DOWN: number;
        RIGHT_UP: number;
        EXTRA_FOWARD_DOWN: number;
        EXTRA_FOWARD_UP: number;
        EXTRA_BACK_DOWN: number;
        EXTRA_BACK_UP: number;
        MOVE: number;
        ENTER: number;
        LEAVE: number;
        EXIT: number;
    };
    /**
     * Represents the user's mouse. Automatically instantiated by a Canvas instance
     * @param {CanvasRenderingContext2D} ctx: the canvas context to link to
     */
    constructor(ctx: CanvasRenderingContext2D);
    _ctx: CanvasRenderingContext2D;
    _valid: boolean;
    _x: number;
    _y: number;
    _lastPos: number[];
    _rawX: number;
    _rawY: number;
    _dir: any;
    _speed: any;
    _clicked: boolean;
    _rightClicked: boolean;
    _scrollClicked: boolean;
    _extraForwardClicked: boolean;
    _extraBackClicked: boolean;
    _holdValue: {};
    _listeners: any[];
    _moveListenersOptimizationEnabled: boolean;
    calcSpeed(deltaTime: any): void;
    calcAngle(): void;
    updateMouseClicks(e: any): void;
    /**
     * Invalidates mouse position
     */
    invalidate(): void;
    /**
     * Updates current mouse position considering page offsets
     * @param {Number} x: the new x value of the mouse
     * @param {Number} y: the new y value of the mouse
     * @param {[offsetX, offsetY]} offset: the x/y offset values
     */
    updatePos(x: number, y: number, offset: [offsetX, offsetY]): void;
    /**
     * Sets and returns whether the current mouse position is valid
     * @returns whether the mouse pos is valid
     */
    checkValid(): boolean;
    /**
     * Adds a custom mouse event listener binded to an object/area
     * @param {canvas object - [[x1,y1],[x2,y2]]} obj: Either a canvas object or a positions array
     * @param {LISTENER_TYPES} type: One of Mouse.LISTENER_TYPES
     * @param {Function} callback: a custom function called upon event trigger. (mousePos, obj, mouse)=>
     * @param {Boolean} useAccurateBounds: If true, uses the obj's accurate bounds calculation
     * @param {Boolean} forceStaticPositions: If true, stores the obj positions statically, rather than the entire object
     * @returns The listener id
     */
    addListener(obj: any, type: LISTENER_TYPES, callback: Function, useAccurateBounds?: boolean, forceStaticPositions?: boolean): any;
    checkListeners(type: any): void;
    /**
     * Updates an existing listener
     * @param {LISTENER_TYPES} type: One of Mouse.LISTENER_TYPES
     * @param {Number} id: listener's id
     * @param {canvas object | [[x1,y1],[x2,y2]]?} newObj: if provided, updates the listeners's obj to this value
     * @param {Function?} newCallback: if provided, updates the listeners's callback to this value. (mousePos, obj, mouse)=>
     * @param {Boolean} useAccurateBounds: If true, uses the obj's accurate bounds calculation
     * @param {Boolean} forceStaticPositions: If true, stores the obj positions statically, rather than the entire object
     */
    updateListener(type: LISTENER_TYPES, id: number, newObj: any, newCallback: Function | null, useAccurateBounds: boolean, forceStaticPositions?: boolean): void;
    /**
     * Removes one or all exisiting listeners of a certain type
     * @param {LISTENER_TYPES} type: One of Mouse.LISTENER_TYPES
     * @param {Number | String} id: Either the listener's id or * to remove all listeners of this type
     */
    removeListener(type: LISTENER_TYPES, id: number | string): void;
    /**
     * Removes all existing listeners
     */
    removeAllListeners(): void;
    /**
     * Returns whether the provided pos is inside the provided positions
     * @param {[x,y]} pos: the pos to check
     * @param {[[x1, y1], [x2, y2]] | Path2D} positions: the positions or path defining an area
     * @param {Boolean} isPath2D: whether "positions" is a Path2D instance
     * @returns whether "pos" is inside "positions"
     */
    isWithin(pos: any, positions: [[x1, y1], [x2, y2]] | Path2D, isPath2D: boolean): boolean;
    get instanceOf(): string;
    set ctx(ctx: CanvasRenderingContext2D);
    get ctx(): CanvasRenderingContext2D;
    set valid(valid: boolean);
    get valid(): boolean;
    get x(): number;
    get y(): number;
    get pos(): number[];
    get rawX(): number;
    get rawY(): number;
    get rawPos(): number[];
    get deltaTimeLastX(): any;
    get deltaTimeLastY(): any;
    get lastX(): number;
    get lastY(): number;
    get lastPos(): number[];
    set dir(_dir: any);
    get dir(): any;
    set speed(_speed: any);
    get speed(): any;
    set clicked(_clicked: boolean);
    get clicked(): boolean;
    set scrollClicked(_scrollClicked: boolean);
    get scrollClicked(): boolean;
    set rightClicked(_rightClicked: boolean);
    get rightClicked(): boolean;
    set extraBackClicked(_extraBackClicked: boolean);
    get extraBackClicked(): boolean;
    set extraForwardClicked(_extraForwardClicked: boolean);
    get extraForwardClicked(): boolean;
    set holdValue(holdValue: {});
    get holdValue(): {};
    get listeners(): any[];
    get moveListenersOptimizationEnabled(): boolean;
    #private;
}
export class Render {
    static PROFILE_ID_GIVER: number;
    static TEXT_PROFILE_ID_GIVER: number;
    static COMPOSITE_OPERATIONS: {
        UNDER: string;
        OVER: string;
        SOURCE_OVER: string;
        SOURCE_IN: string;
        SOURCE_OUT: string;
        SOURCE_ATOP: string;
        DESTINATION_OVER: string;
        DESTINATION_IN: string;
        DESTINATION_OUT: string;
        DESTINATION_ATOP: string;
        LIGHTER: string;
        COPY: string;
        XOR: string;
        MULTIPLY: string;
        SCREEN: string;
        OVERLAY: string;
        DARKEN: string;
        LIGHTEN: string;
        COLOR_DODGE: string;
        COLOR_BURN: string;
        HARD_LIGHT: string;
        SOFT_LIGHT: string;
        DIFFERENCE: string;
        EXCLUSION: string;
        HUE: string;
        SATURATION: string;
        COLOR: string;
        LUMINOSITY: string;
    };
    static FILTERS: {
        BLUR: (v: any) => string;
        BRIGHTNESS: (v: any) => string;
        CONTRAST: (v: any) => string;
        DROPSHADOW: (value: any) => string;
        GRAYSCALE: (v: any) => string;
        HUE_ROTATE: (v: any) => string;
        INVERT: (v: any) => string;
        OPACITY: (v: any) => string;
        SATURATE: (v: any) => string;
        SEPIA: (v: any) => string;
        URL: (v: any) => string;
    };
    static DEFAULT_COMPOSITE_OPERATION: string;
    static DEFAULT_FILTER: string;
    static DEFAULT_ALPHA: number;
    static PATH_TYPES: {
        LINEAR: typeof Render.getLine;
        QUADRATIC: typeof Render.getQuadCurve;
        CUBIC_BEZIER: typeof Render.getBezierCurve;
        ARC: typeof Render.getArc;
        ARC_TO: typeof Render.getArcTo;
        ELLIPSE: typeof Render.getEllispe;
        RECT: typeof Render.getRect;
        POSITIONS_RECT: typeof Render.getPositionsRect;
        ROUND_RECT: typeof Render.getRoundRect;
        POSITIONS_ROUND_RECT: typeof Render.getPositionsRoundRect;
    };
    static LINE_TYPES: {
        LINEAR: typeof Render.getLine;
        QUADRATIC: typeof Render.getQuadCurve;
        CUBIC_BEZIER: typeof Render.getBezierCurve;
    };
    static DRAW_METHODS: {
        FILL: string;
        STROKE: string;
    };
    static COLOR_TRANSFORMS: {
        NONE: any;
        INVERT: number;
        GRAYSCALE: number;
        SEPIA: number;
        RANDOMIZE: number;
        STATIC: number;
        MULTIPLY: number;
        BGRA: number;
        TINT: number;
        FORCE_TINT: number;
    };
    /**
     * Instanciates and returns a path containing a line
     * @param {[x,y]} startPos: the start pos of the line
     * @param {[x,y]} endPos: the end pos of the line
     * @returns a Path2D instance
     */
    static getLine(startPos: [x, y], endPos: [x, y]): Path2D;
    /**
     * Instanciates and returns a path containing a quadratic curve
     * @param {[x,y]} startPos: the start pos of the line
     * @param {[x,y]} endPos: the end pos of the line
     * @param {[x,y]?} controlPos: the control pos of the curve
     * @returns a Path2D instance
     */
    static getQuadCurve(startPos: [x, y], endPos: [x, y], controlPos?: [x, y] | null): Path2D;
    /**
     * Returns a control pos to create a decent default quadratic curve
     * @param {[x,y]} startPos: the start pos of the line
     * @param {[x,y]} endPos: the end pos of the line
     * @param {Number?} spread: a modifier value for the default control pos generation
     * @returns a control pos [x,y]
     */
    static getDefaultQuadraticControlPos(startPos: [x, y], endPos: [x, y], spread?: number | null): number[];
    /**
     * Instanciates and returns a path containing a cubic bezier curve
     * @param {[x,y]} startPos: the start pos of the line
     * @param {[x,y]} endPos: the end pos of the line
     * @param {[x,y]?} controlPos1: the first control pos of the curve
     * @param {[x,y]?} controlPos2: the second control pos of the curve
     * @returns a Path2D instance
     */
    static getBezierCurve(startPos: [x, y], endPos: [x, y], controlPos1?: [x, y] | null, controlPos2?: [x, y] | null): Path2D;
    /**
     * Returns 2 control positions to create a decent default bezier curve
     * @param {[x,y]} startPos: the start pos of the line
     * @param {[x,y]} endPos: the end pos of the line
     * @param {Number?} spread: a modifier value for the default control pos generation
     * @returns a control pos [x,y]
     */
    static getDefaultBezierControlPos(startPos: [x, y], endPos: [x, y], spread?: number | null): any[][];
    /**
     * Instanciates and returns a path containing an arc
     * @param {[x,y]} pos: the pos of the arc
     * @param {Number?} radius: the radius in pixels of the arc
     * @param {Number?} startAngleRadian: the start angle of the arc in radian
     * @param {Number?} endAngleRadian: the end angle of the arc in radian
     * @returns a Path2D instance
     */
    static getArc(pos: [x, y], radius?: number | null, startAngleRadian?: number | null, endAngleRadian?: number | null): Path2D;
    /**
     * Instanciates and returns a path containing an arcTo
     * @param {[x,y]} startPos: the start pos of the line
     * @param {[x,y]} controlPos1: the first control pos of the arc
     * @param {[x,y]} controlPos2: the second control pos of the arc
     * @param {Number} radius: the radius in pixels of the arc
     * @returns a Path2D instance
     */
    static getArcTo(startPos: [x, y], controlPos1: [x, y], controlPos2: [x, y], radius: number): Path2D;
    /**
     * Instanciates and returns a path containing an ellipse
     * @param {[x,y]} centerPos: the center pos of the ellipse
     * @param {Number} radiusX: the horizontal radius
     * @param {Number} radiusY: the vertical radius
     * @param {Number?} rotationRadian: the rotation of the ellipse in radian
     * @param {Number?} startAngleRadian: the start angle of the ellipse in radian
     * @param {Number?} endAngleRadian: the end angle of the ellipse in radian
     * @param {Boolean?} counterclockwise: the rotation side
     * @returns a Path2D instance
     */
    static getEllispe(centerPos: [x, y], radiusX: number, radiusY: number, rotationRadian?: number | null, startAngleRadian?: number | null, endAngleRadian?: number | null, counterclockwise?: boolean | null): Path2D;
    /**
     * Instanciates and returns a path containing an rectangle
     * @param {[x,y]} pos: the top left pos
     * @param {Number} width: the width of the rectangle
     * @param {Number} height: the height of the rectangle
     * @returns a Path2D instance
     */
    static getRect(pos: [x, y], width: number, height: number): Path2D;
    /**
     * Instanciates and returns a path containing an rectangle
     * @param {[x,y]} pos: the top left pos
     * @param {[x,y]} pos2: the bottom right pos
     * @returns a Path2D instance
     */
    static getPositionsRect(pos: [x, y], pos2: [x, y]): Path2D;
    /**
     * Instanciates and returns a path containing an rounded rectangle
     * @param {[x,y]} pos: the top left pos
     * @param {Number} width: the width of the rectangle
     * @param {Number} height: the height of the rectangle
     * @param {Number?} cornerRadius: the corner radius
     * @returns a Path2D instance
     */
    static getRoundRect(pos: [x, y], width: number, height: number, cornerRadius?: number | null): Path2D;
    /**
     * Instanciates and returns a path containing an rounded rectangle
     * @param {[x,y]} pos: the top left pos
     * @param {[x,y]} pos2: the bottom right pos
     * @param {Number?} cornerRadius: the corner radius
     * @returns a Path2D instance
     */
    static getPositionsRoundRect(pos: [x, y], pos2: [x, y], cornerRadius?: number | null): Path2D;
    /**
     * Instanciates and returns a path containing svg data
     * @param {String} data: SVG path data
     * @returns a Path2D instance
     */
    static getFromSVGPath(data: string): Path2D;
    /**
     * The generate() function allows the generation of a custom graph
     * @param {[x, y]} startPos: pos array defining the starting pos
     * @param {Function} yFn: a function providing a Y value depanding on a given X value. (x)=>{... return y}
     * @param {Number} width: the width in pixels of the generation result. Negative values will generate reversed left-side graphs
     * @param {Number} segmentCount: precision in segments of the generated result
     * @param {Function} baseGeneration: callback returning a path2d which will receive this generation result
     * @returns {Path2D | null} The generated path or null if the width or segmentCount is lower than 1
     */
    static generate(startPos: [x, y], yFn: Function, width: number, segmentCount?: number, baseGeneration?: Function): Path2D | null;
    /**
     * Given the following parameters, returns the endPos of a path generated with Render.generate()
     * @param {[x, y]} startPos: pos array defining the starting pos
     * @param {Function} yFn: a function providing a Y value depanding on a given X value. (x)=>{... return y}
     * @param {Number} width: the width in pixels of the generation result
     * @returns {[x, y]} the end pos
     */
    static getGenerationEndPos(startPos: [x, y], yFn: Function, width: number): [x, y];
    /**
     * Create a path connecting all the pos/obj provided in parameter
     * @param {Array} posArrays: An array of pos or obj to draw a connection to. The connections are drawn in order of their index.
     * @param {Render.LINE_TYPES | null} lineType: The line type used to create the path. Leave null/undefined for slightly more optimized linear lines.
     * @returns The created path.
     */
    static composePath(posArrays: any[], lineType: {
        LINEAR: typeof Render.getLine;
        QUADRATIC: typeof Render.getQuadCurve;
        CUBIC_BEZIER: typeof Render.getBezierCurve;
    } | null): Path2D;
    /**
     * Combines all provided paths together
     * @param {Array} paths: an array containing path2ds
     * @returns A single path2d containing all of the provided paths
     */
    static mergePaths(paths: any[]): any;
    static Y_FUNCTIONS: {
        SINUS: (height?: number, periodWidth?: number) => (x: any) => number;
        COSINUS: (height?: number, periodWidth?: number) => (x: any) => number;
        LINEAR: (a?: number) => (x: any) => number;
    };
    /**
     * Drawing manager, centralises most context operation. Automatically instantiated by a Canvas instance
     * @param {CanvasRenderingContext2D} ctx: canvas context to link to
     */
    constructor(ctx: CanvasRenderingContext2D);
    _ctx: CanvasRenderingContext2D;
    _batchedStrokes: {};
    _batchedFills: {};
    _bactchedStandalones: any[];
    _defaultProfile: RenderStyles;
    _profile1: RenderStyles;
    _profile2: RenderStyles;
    _profile3: RenderStyles;
    _profile4: RenderStyles;
    _profile5: RenderStyles;
    _profiles: any[];
    _defaultTextProfile: TextStyles;
    _textProfile1: TextStyles;
    _textProfile2: TextStyles;
    _textProfile3: TextStyles;
    _textProfile4: TextStyles;
    _textProfile5: TextStyles;
    _textProfiles: any[];
    /**
     * Creates and adds a new custom RenderStyles profile base on a given base profile
     * @param {RenderStyles} baseProfile: the RenderStyles instance to base the copy on
     * @returns a RenderStyles instance
     */
    createCustomStylesProfile(baseProfile?: RenderStyles): RenderStyles;
    /**
     * Creates and adds a new custom TextStyles profile base on a given base profile
     * @param {TextStyles} baseTextProfile: the TextStyles instance to base the copy on
     * @returns a TextStyles instance
     */
    createCustomTextStylesProfile(baseTextProfile?: TextStyles): TextStyles;
    /**
     * Queues a path to be stroked in batch at the end of the current frame
     * @param {Path2D} path: the path to batch
     * @param {RenderStyles | [r,g,b,a]?} renderStyles: either a rgba array or a RenderStyles instance
     * @param {[filter, compositeOperation, opacity]?} forceVisualEffects: the filter, composite operation and opacity effects to apply
     */
    batchStroke(path: Path2D, renderStyles?: RenderStyles | ([r, g, b, a] | null), forceVisualEffects?: [filter, compositeOperation, opacity] | null): void;
    /**
     * Queues a path to be filled in batch at the end of the current frame
     * @param {Path2D} path: the path to batch
     * @param {RenderStyles | [r,g,b,a]?} renderStyles: either a rgba array or a RenderStyles instance
     * @param {[filter, compositeOperation, opacity]?} forceVisualEffects: the filter, composite operation and opacity effects to apply
     */
    batchFill(path: Path2D, renderStyles?: RenderStyles | ([r, g, b, a] | null), forceVisualEffects?: [filter, compositeOperation, opacity] | null): void;
    /**
     * Fills and strokes all batched paths
     */
    drawBatched(): void;
    /**
     * Directly strokes a path on the canvas
     * @param {Path2D} path: the path to batch
     * @param {RenderStyles | [r,g,b,a]?} renderStyles: either a rgba array or a RenderStyles instance
     * @param {[filter, compositeOperation, opacity]?} forceVisualEffects: the filter, composite operation and opacity effects to apply
     */
    stroke(path: Path2D, renderStyles?: RenderStyles | ([r, g, b, a] | null), forceVisualEffects?: [filter, compositeOperation, opacity] | null): void;
    /**
     * Directly fills a path on the canvas
     * @param {Path2D} path: the path to batch
     * @param {RenderStyles | [r,g,b,a]?} renderStyles: either a rgba array or a RenderStyles instance
     * @param {[filter, compositeOperation, opacity]?} forceVisualEffects: the filter, composite operation and opacity effects to apply
     */
    fill(path: Path2D, renderStyles?: RenderStyles | ([r, g, b, a] | null), forceVisualEffects?: [filter, compositeOperation, opacity] | null): void;
    /**
     * Directly strokes text on the canvas
     * @param {String} text: the text to draw
     * @param {[x,y]} pos: the pos of the text
     * @param {Color | [r,g,b,a]} color: the color of the text
     * @param {TextStyles} textStyles: a TextStyles instance
     * @param {Number?} maxWidth: the max width of the text
     * @param {Number?} lineHeight: the line height in pixels if the text is multiline
     * @param {[filter, compositeOperation, opacity]?} visualEffects: the filter, composite operation and opacity effects to apply
     */
    strokeText(text: string, pos: [x, y], color: Color | [r, g, b, a], textStyles: TextStyles, maxWidth?: number | null, lineHeight?: number | null, visualEffects?: [filter, compositeOperation, opacity] | null): void;
    /**
     * Directly fills text on the canvas
     * @param {String} text: the text to draw
     * @param {[x,y]} pos: the pos of the text
     * @param {Color | [r,g,b,a]} color: the color of the text
     * @param {TextStyles} textStyles: a TextStyles instance
     * @param {Number?} maxWidth: the max width of the text
     * @param {Number?} lineHeight: the line height in pixels if the text is multiline
     * @param {[filter, compositeOperation, opacity]?} visualEffects: the filter, composite operation and opacity effects to apply
     */
    fillText(text: string, pos: [x, y], color: Color | [r, g, b, a], textStyles: TextStyles, maxWidth?: number | null, lineHeight?: number | null, visualEffects?: [filter, compositeOperation, opacity] | null): void;
    /**
     * Directly draws an image on the canvas
     * @param {CanvasImageSource} img: the img to draw
     * @param {[x,y]} pos: the top left position of the image
     * @param {[width,height]} size: the size of the image
     * @param {[[startX, startY], [endX, endY]]?} croppingPositions: cropping positions delimiting a rectangle, cropping everything outside of it. (Defaults to no cropping)
     * @param {[filter, compositeOperation, opacity]?} visualEffects: the filter, composite operation and opacity effects of the image
     */
    drawImage(img: CanvasImageSource, pos: [x, y], size: [width, height], croppingPositions: [[startX, startY], [endX, endY]] | null, visualEffects?: [filter, compositeOperation, opacity] | null): void;
    /**
     * Directly draws an image on the canvas once everything batchded has been drawn
     * @param {CanvasImageSource} img: the img to draw
     * @param {[x,y]} pos: the top left position of the image
     * @param {[width,height]} size: the size of the image
     * @param {[[startX, startY], [endX, endY]]?} croppingPositions: cropping positions delimiting a rectangle, cropping everything outside of it. (Defaults to no cropping)
     * @param {[filter, compositeOperation, opacity]?} visualEffects: the filter, composite operation and opacity effects of the image
     */
    drawLateImage(img: CanvasImageSource, pos: [x, y], size: [width, height], croppingPositions: [[startX, startY], [endX, endY]] | null, visualEffects?: [filter, compositeOperation, opacity] | null): void;
    /**
     * Replaces a color on the canvas by another one in a specified area
     * @param {Color | [r,g,b,a]} targetColor: The color to be replaced by newColor
     * @param {Color | [r,g,b,a]} newColor: The color replacing targetColor
     * @param {Number, [rT,gT,bT]} temperance: The validity margin for the r, g, b values of the targetColor
     * @param {[[x, y], [x, y]] | null} area: A positions array defining the area to replace the color in
     * @param {Number} densityDivider: The higher the divider, the more pixels will skip the processing. (Defaults to 1, meaning every pixel gets processed)
     * @param {Boolean} preventLate: If true, doesn't include colors from batched operations
     */
    replaceColor(targetColor: Color | [r, g, b, a], newColor?: Color | [r, g, b, a], temperance?: number, area?: [[x, y], [x, y]] | null, densityDivider?: number, preventLate?: boolean): void;
    /**
     * Applies pixel manipulation to a specified area
     * @param {Render.COLOR_TRANSFORMS} transform
     * @param {Number | Array} modifier: the modifier value
     * @param {[[x, y], [x, y]] | null} area: A positions array defining the area to replace the color in
     * @param {Number} densityDivider: The higher the divider, the more pixels will skip the processing. (Defaults to 1, meaning every pixel gets processed)
     * @param {Boolean} preventLate: If true, doesn't include colors from batched operations
     */
    transformArea(transform: {
        NONE: any;
        INVERT: number;
        GRAYSCALE: number;
        SEPIA: number;
        RANDOMIZE: number;
        STATIC: number;
        MULTIPLY: number;
        BGRA: number;
        TINT: number;
        FORCE_TINT: number;
    }, modifier: number | any[], area?: [[x, y], [x, y]] | null, densityDivider?: number, preventLate?: boolean): void;
    get instanceOf(): string;
    set ctx(_ctx: CanvasRenderingContext2D);
    get ctx(): CanvasRenderingContext2D;
    get batchedStrokes(): {};
    get batchedFills(): any[];
    get batchedStandalones(): any;
    set defaultProfile(_defaultProfile: RenderStyles);
    get defaultProfile(): RenderStyles;
    set profile1(_profile1: RenderStyles);
    get profile1(): RenderStyles;
    set profile2(_profile2: RenderStyles);
    get profile2(): RenderStyles;
    set profile3(_profile3: RenderStyles);
    get profile3(): RenderStyles;
    set profile4(_profile4: RenderStyles);
    get profile4(): RenderStyles;
    set profile5(_profile5: RenderStyles);
    get profile5(): RenderStyles;
    set profiles(_profiles: any[]);
    get profiles(): any[];
    set defaultTextProfile(_defaultTextProfile: TextStyles);
    get defaultTextProfile(): TextStyles;
    set textProfile1(_textProfile1: TextStyles);
    get textProfile1(): TextStyles;
    set textProfile2(_textProfile2: TextStyles);
    get textProfile2(): TextStyles;
    set textProfile3(_textProfile3: TextStyles);
    get textProfile3(): TextStyles;
    set textProfile4(_textProfile4: TextStyles);
    get textProfile4(): TextStyles;
    set textProfile5(_textProfile5: TextStyles);
    get textProfile5(): TextStyles;
    set textProfiles(_textProfiles: any[]);
    get textProfiles(): any[];
    set currentCtxVisuals(currentCtxVisuals: (string | number)[]);
    get currentCtxVisuals(): (string | number)[];
    set currentCtxStyles(currentCtxStyles: (string | number | any[] | {
        MITER: string;
        BEVEL: string;
        ROUND: string;
    } | {
        BUTT: string;
        SQUARE: string;
        ROUND: string;
    })[]);
    get currentCtxStyles(): (string | number | any[] | {
        MITER: string;
        BEVEL: string;
        ROUND: string;
    } | {
        BUTT: string;
        SQUARE: string;
        ROUND: string;
    })[];
    set currentCtxTextStyles(currentCtxTextStyles: (string | number | {
        AUTO: string;
        FAST: string;
        LEGIBLE: string;
        PRECISE: string;
    } | {
        NORMAL: string;
        SMALL_CAPS: string;
        ALL_SMALL_CAPS: string;
        PETITE_CAPS: string;
        ALL_PETITE_CAPS: string;
        UNICASE: string;
        TILTING_CAPS: string;
    } | {
        LEFT_TO_RIGHT: string;
        RIGHT_TO_LEFT: string;
        INHERIT: string;
    } | {
        ULTRA_CONDENSED: string;
        EXTRA_CONDENSED: string;
        CONDENSED: string;
        SEMI_CONDENSED: string;
        NORMAL: string;
        SEMI_EXPANDED: string;
        EXPANDED: string;
        EXTRA_EXPANDED: string;
        ULTRA_EXPANDED: string;
    } | {
        AUTO: string;
        NORMAL: string;
        NONE: string;
    } | {
        LEFT: string;
        RIGHT: string;
        CENTER: string;
        START: string;
        END: string;
    } | {
        TOP: string;
        BOTTOM: string;
        HANGING: string;
        MIDDLE: string;
        ALPHABETIC: string;
        IDEOGRAPHIC: string;
    })[]);
    get currentCtxTextStyles(): (string | number | {
        AUTO: string;
        FAST: string;
        LEGIBLE: string;
        PRECISE: string;
    } | {
        NORMAL: string;
        SMALL_CAPS: string;
        ALL_SMALL_CAPS: string;
        PETITE_CAPS: string;
        ALL_PETITE_CAPS: string;
        UNICASE: string;
        TILTING_CAPS: string;
    } | {
        LEFT_TO_RIGHT: string;
        RIGHT_TO_LEFT: string;
        INHERIT: string;
    } | {
        ULTRA_CONDENSED: string;
        EXTRA_CONDENSED: string;
        CONDENSED: string;
        SEMI_CONDENSED: string;
        NORMAL: string;
        SEMI_EXPANDED: string;
        EXPANDED: string;
        EXTRA_EXPANDED: string;
        ULTRA_EXPANDED: string;
    } | {
        AUTO: string;
        NORMAL: string;
        NONE: string;
    } | {
        LEFT: string;
        RIGHT: string;
        CENTER: string;
        START: string;
        END: string;
    } | {
        TOP: string;
        BOTTOM: string;
        HANGING: string;
        MIDDLE: string;
        ALPHABETIC: string;
        IDEOGRAPHIC: string;
    })[];
    #private;
}
export class TextStyles {
    static CAPS_VARIANTS: {
        NORMAL: string;
        SMALL_CAPS: string;
        ALL_SMALL_CAPS: string;
        PETITE_CAPS: string;
        ALL_PETITE_CAPS: string;
        UNICASE: string;
        TILTING_CAPS: string;
    };
    static DIRECTIONS: {
        LEFT_TO_RIGHT: string;
        RIGHT_TO_LEFT: string;
        INHERIT: string;
    };
    static STRETCHES: {
        ULTRA_CONDENSED: string;
        EXTRA_CONDENSED: string;
        CONDENSED: string;
        SEMI_CONDENSED: string;
        NORMAL: string;
        SEMI_EXPANDED: string;
        EXPANDED: string;
        EXTRA_EXPANDED: string;
        ULTRA_EXPANDED: string;
    };
    static KERNINGS: {
        AUTO: string;
        NORMAL: string;
        NONE: string;
    };
    static ALIGNMENTS: {
        LEFT: string;
        RIGHT: string;
        CENTER: string;
        START: string;
        END: string;
    };
    static BASELINES: {
        TOP: string;
        BOTTOM: string;
        HANGING: string;
        MIDDLE: string;
        ALPHABETIC: string;
        IDEOGRAPHIC: string;
    };
    static RENDERINGS: {
        AUTO: string;
        FAST: string;
        LEGIBLE: string;
        PRECISE: string;
    };
    static DEFAULT_FONT: string;
    static DEFAULT_LETTER_SPACING: string;
    static DEFAULT_WORD_SPACING: string;
    static DEFAULT_FONT_VARIANT_CAPS: string;
    static DEFAULT_DIRECTION: string;
    static DEFAULT_FONT_STRETCH: string;
    static DEFAULT_FONT_KERNING: string;
    static DEFAULT_TEXT_ALIGN: string;
    static DEFAULT_TEXT_BASELINE: string;
    static DEFAULT_TEXT_RENDERING: string;
    static DEFAULT_PROFILE: TextStyles;
    static SUPPORTED_FONTS_FORMATS: string[];
    static #FONTFACE_NAME_OFFSET: number;
    /**
     * Directly applies the provided styles
     * @param {String?} font: the text font-style, font-variant, font-weight, font-size, line-height and font-family to use
     * @param {Number | String ?} letterSpacing: the gaps in px between letters
     * @param {Number | String ?} wordSpacing: the gaps in px between words
     * @param {TextStyles.CAPS_VARIANTS?} fontVariantCaps: specifies alternative capitalization
     * @param {TextStyles.DIRECTIONS?} direction: the text direction
     * @param {TextStyles.STRETCHES?} fontStretch: the text streching
     * @param {TextStyles.KERNINGS?} fontKerning: whether the default spacing of certain letters is uniform
     * @param {TextStyles.ALIGNMENTS?} textAlign: the text horizontal alignment
     * @param {TextStyles.BASELINES?} textBaseline: the text vertical alignment
     * @param {TextStyles.RENDERINGS?} textRendering: the text rendering method
     */
    static apply(ctx: any, font: string | null, letterSpacing: number | (string | null), wordSpacing: number | (string | null), fontVariantCaps: {
        NORMAL: string;
        SMALL_CAPS: string;
        ALL_SMALL_CAPS: string;
        PETITE_CAPS: string;
        ALL_PETITE_CAPS: string;
        UNICASE: string;
        TILTING_CAPS: string;
    } | null, direction: {
        LEFT_TO_RIGHT: string;
        RIGHT_TO_LEFT: string;
        INHERIT: string;
    } | null, fontStretch: {
        ULTRA_CONDENSED: string;
        EXTRA_CONDENSED: string;
        CONDENSED: string;
        SEMI_CONDENSED: string;
        NORMAL: string;
        SEMI_EXPANDED: string;
        EXPANDED: string;
        EXTRA_EXPANDED: string;
        ULTRA_EXPANDED: string;
    } | null, fontKerning: {
        AUTO: string;
        NORMAL: string;
        NONE: string;
    } | null, textAlign: {
        LEFT: string;
        RIGHT: string;
        CENTER: string;
        START: string;
        END: string;
    } | null, textBaseline: {
        TOP: string;
        BOTTOM: string;
        HANGING: string;
        MIDDLE: string;
        ALPHABETIC: string;
        IDEOGRAPHIC: string;
    } | null, textRendering: {
        AUTO: string;
        FAST: string;
        LEGIBLE: string;
        PRECISE: string;
    } | null): void;
    /**
     * Returns whether the provided font file type is supported
     * @param {String | File} file: the file or filename
     * @returns Whether the font file is supported or not
     */
    static isFontFormatSupported(file: string | File): boolean;
    /**
     * Loads a custom font by file or url. Direct font files are loaded using the FontFace api, while non direct font source are loaded via an HTML <link> element.
     * @param {String | ArrayBuffer | TypedArray} src: The source of the font, either a file or a url
     * @param {String?} fontFaceName: The font family name of the custom font (Only applicable for FontFace load)
     * @param {Object?} fontFaceDescriptors: Object defining the font properties (Only applicable for FontFace load)
     * @param {Function?} readyCB: Callback called upon custom font loading completed. (fontFace, fontFamily)=>{...} (Only applicable for FontFace load)
     * @param {Function?} errorCB: Callback called upon custom font loading errors. (error)=>{...} (Only applicable for FontFace load)
     * @returns The loaded font via a FontFace instance or a <link> element
     */
    static loadCustomFont(src: string | ArrayBuffer | TypedArray, fontFaceName?: string | null, fontFaceDescriptors?: any | null, readyCB?: Function | null, errorCB?: Function | null): FontFace | HTMLLinkElement;
    /**
     * Formats possible font styling parameters into a valid font string
     * @param {String} family: the font-family value
     * @param {String} size: the font-size value
     * @param {String?} weight: the font-weight value
     * @param {String?} style: the font-style value
     * @param {String?} variant: the font-variant value
     * @param {String?} lineHeight: the line-height value
     * @returns a string usable for the canvas context "font" property
     */
    static getFontStyleDeclaration(family: string, size: string, weight?: string | null, style?: string | null, variant?: string | null, lineHeight?: string | null): string;
    /**
     * Represents a styling profile for text
     * @param {Render} render: the render instance to link to
     * @param {String?} font: the text font-style, font-variant, font-weight, font-size, line-height and font-family to use
     * @param {Number | String ?} letterSpacing: the gaps in px between letters
     * @param {Number | String ?} wordSpacing: the gaps in px between words
     * @param {TextStyles.CAPS_VARIANTS?} fontVariantCaps: specifies alternative capitalization
     * @param {TextStyles.DIRECTIONS?} direction: the text direction
     * @param {TextStyles.STRETCHES?} fontStretch: the text streching
     * @param {TextStyles.KERNINGS?} fontKerning: whether the default spacing of certain letters is uniform
     * @param {TextStyles.ALIGNMENTS?} textAlign: the text horizontal alignment
     * @param {TextStyles.BASELINES?} textBaseline: the text vertical alignment
     * @param {TextStyles.RENDERINGS?} textRendering: the text rendering method
     */
    constructor(render: Render, font: string | null, letterSpacing: number | (string | null), wordSpacing: number | (string | null), fontVariantCaps: {
        NORMAL: string;
        SMALL_CAPS: string;
        ALL_SMALL_CAPS: string;
        PETITE_CAPS: string;
        ALL_PETITE_CAPS: string;
        UNICASE: string;
        TILTING_CAPS: string;
    } | null, direction: {
        LEFT_TO_RIGHT: string;
        RIGHT_TO_LEFT: string;
        INHERIT: string;
    } | null, fontStretch: {
        ULTRA_CONDENSED: string;
        EXTRA_CONDENSED: string;
        CONDENSED: string;
        SEMI_CONDENSED: string;
        NORMAL: string;
        SEMI_EXPANDED: string;
        EXPANDED: string;
        EXTRA_EXPANDED: string;
        ULTRA_EXPANDED: string;
    } | null, fontKerning: {
        AUTO: string;
        NORMAL: string;
        NONE: string;
    } | null, textAlign: {
        LEFT: string;
        RIGHT: string;
        CENTER: string;
        START: string;
        END: string;
    } | null, textBaseline: {
        TOP: string;
        BOTTOM: string;
        HANGING: string;
        MIDDLE: string;
        ALPHABETIC: string;
        IDEOGRAPHIC: string;
    } | null, textRendering: {
        AUTO: string;
        FAST: string;
        LEGIBLE: string;
        PRECISE: string;
    } | null);
    _id: number;
    _render: Render;
    _font: string;
    _letterSpacing: string | number;
    _wordSpacing: string | number;
    _fontVariantCaps: string | {
        NORMAL: string;
        SMALL_CAPS: string;
        ALL_SMALL_CAPS: string;
        PETITE_CAPS: string;
        ALL_PETITE_CAPS: string;
        UNICASE: string;
        TILTING_CAPS: string;
    };
    _direction: string | {
        LEFT_TO_RIGHT: string;
        RIGHT_TO_LEFT: string;
        INHERIT: string;
    };
    _fontStretch: string | {
        ULTRA_CONDENSED: string;
        EXTRA_CONDENSED: string;
        CONDENSED: string;
        SEMI_CONDENSED: string;
        NORMAL: string;
        SEMI_EXPANDED: string;
        EXPANDED: string;
        EXTRA_EXPANDED: string;
        ULTRA_EXPANDED: string;
    };
    _fontKerning: string | {
        AUTO: string;
        NORMAL: string;
        NONE: string;
    };
    _textAlign: string | {
        LEFT: string;
        RIGHT: string;
        CENTER: string;
        START: string;
        END: string;
    };
    _textBaseline: string | {
        TOP: string;
        BOTTOM: string;
        HANGING: string;
        MIDDLE: string;
        ALPHABETIC: string;
        IDEOGRAPHIC: string;
    };
    _textRendering: string | {
        AUTO: string;
        FAST: string;
        LEGIBLE: string;
        PRECISE: string;
    };
    /**
     * @returns a separate copy of the profile
     */
    duplicate(render?: Render, font?: string, letterSpacing?: string | number, wordSpacing?: string | number, fontVariantCaps?: string | {
        NORMAL: string;
        SMALL_CAPS: string;
        ALL_SMALL_CAPS: string;
        PETITE_CAPS: string;
        ALL_PETITE_CAPS: string;
        UNICASE: string;
        TILTING_CAPS: string;
    }, direction?: string | {
        LEFT_TO_RIGHT: string;
        RIGHT_TO_LEFT: string;
        INHERIT: string;
    }, fontStretch?: string | {
        ULTRA_CONDENSED: string;
        EXTRA_CONDENSED: string;
        CONDENSED: string;
        SEMI_CONDENSED: string;
        NORMAL: string;
        SEMI_EXPANDED: string;
        EXPANDED: string;
        EXTRA_EXPANDED: string;
        ULTRA_EXPANDED: string;
    }, fontKerning?: string | {
        AUTO: string;
        NORMAL: string;
        NONE: string;
    }, textAlign?: string | {
        LEFT: string;
        RIGHT: string;
        CENTER: string;
        START: string;
        END: string;
    }, textBaseline?: string | {
        TOP: string;
        BOTTOM: string;
        HANGING: string;
        MIDDLE: string;
        ALPHABETIC: string;
        IDEOGRAPHIC: string;
    }, textRendering?: string | {
        AUTO: string;
        FAST: string;
        LEGIBLE: string;
        PRECISE: string;
    }): TextStyles;
    /**
     * @returns the profile's styles as an array
     */
    getStyles(): (string | number | {
        AUTO: string;
        FAST: string;
        LEGIBLE: string;
        PRECISE: string;
    } | {
        NORMAL: string;
        SMALL_CAPS: string;
        ALL_SMALL_CAPS: string;
        PETITE_CAPS: string;
        ALL_PETITE_CAPS: string;
        UNICASE: string;
        TILTING_CAPS: string;
    } | {
        LEFT_TO_RIGHT: string;
        RIGHT_TO_LEFT: string;
        INHERIT: string;
    } | {
        ULTRA_CONDENSED: string;
        EXTRA_CONDENSED: string;
        CONDENSED: string;
        SEMI_CONDENSED: string;
        NORMAL: string;
        SEMI_EXPANDED: string;
        EXPANDED: string;
        EXTRA_EXPANDED: string;
        ULTRA_EXPANDED: string;
    } | {
        AUTO: string;
        NORMAL: string;
        NONE: string;
    } | {
        LEFT: string;
        RIGHT: string;
        CENTER: string;
        START: string;
        END: string;
    } | {
        TOP: string;
        BOTTOM: string;
        HANGING: string;
        MIDDLE: string;
        ALPHABETIC: string;
        IDEOGRAPHIC: string;
    })[];
    /**
     * Updates a profile's attributes and returns the updated version
     * @param {String?} font: the text font-style, font-variant, font-weight, font-size, line-height and font-family to use
     * @param {Number | String ?} letterSpacing: the gaps in px between letters
     * @param {Number | String ?} wordSpacing: the gaps in px between words
     * @param {TextStyles.CAPS_VARIANTS?} fontVariantCaps: specifies alternative capitalization
     * @param {TextStyles.DIRECTIONS?} direction: the text direction
     * @param {TextStyles.STRETCHES?} fontStretch: the text streching
     * @param {TextStyles.KERNINGS?} fontKerning: whether the default spacing of certain letters is uniform
     * @param {TextStyles.ALIGNMENTS?} textAlign: the text horizontal alignment
     * @param {TextStyles.BASELINES?} textBaseline: the text vertical alignment
     * @param {TextStyles.RENDERINGS?} textRendering: the text rendering method
     * @returns the updated TextStyles instance
     */
    update(font: string | null, letterSpacing: number | (string | null), wordSpacing: number | (string | null), fontVariantCaps: {
        NORMAL: string;
        SMALL_CAPS: string;
        ALL_SMALL_CAPS: string;
        PETITE_CAPS: string;
        ALL_PETITE_CAPS: string;
        UNICASE: string;
        TILTING_CAPS: string;
    } | null, direction: {
        LEFT_TO_RIGHT: string;
        RIGHT_TO_LEFT: string;
        INHERIT: string;
    } | null, fontStretch: {
        ULTRA_CONDENSED: string;
        EXTRA_CONDENSED: string;
        CONDENSED: string;
        SEMI_CONDENSED: string;
        NORMAL: string;
        SEMI_EXPANDED: string;
        EXPANDED: string;
        EXTRA_EXPANDED: string;
        ULTRA_EXPANDED: string;
    } | null, fontKerning: {
        AUTO: string;
        NORMAL: string;
        NONE: string;
    } | null, textAlign: {
        LEFT: string;
        RIGHT: string;
        CENTER: string;
        START: string;
        END: string;
    } | null, textBaseline: {
        TOP: string;
        BOTTOM: string;
        HANGING: string;
        MIDDLE: string;
        ALPHABETIC: string;
        IDEOGRAPHIC: string;
    } | null, textRendering: {
        AUTO: string;
        FAST: string;
        LEGIBLE: string;
        PRECISE: string;
    } | null): this;
    /**
     * Directly applies the styles of the profile
     * @param {String?} font: the text font-style, font-variant, font-weight, font-size, line-height and font-family to use
     * @param {Number | String ?} letterSpacing: the gaps in px between letters
     * @param {Number | String ?} wordSpacing: the gaps in px between words
     * @param {TextStyles.CAPS_VARIANTS?} fontVariantCaps: specifies alternative capitalization
     * @param {TextStyles.DIRECTIONS?} direction: the text direction
     * @param {TextStyles.STRETCHES?} fontStretch: the text streching
     * @param {TextStyles.KERNINGS?} fontKerning: whether the default spacing of certain letters is uniform
     * @param {TextStyles.ALIGNMENTS?} textAlign: the text horizontal alignment
     * @param {TextStyles.BASELINES?} textBaseline: the text vertical alignment
     * @param {TextStyles.RENDERINGS?} textRendering: the text rendering method
     */
    apply(font?: string | null, letterSpacing?: number | (string | null), wordSpacing?: number | (string | null), fontVariantCaps?: {
        NORMAL: string;
        SMALL_CAPS: string;
        ALL_SMALL_CAPS: string;
        PETITE_CAPS: string;
        ALL_PETITE_CAPS: string;
        UNICASE: string;
        TILTING_CAPS: string;
    } | null, direction?: {
        LEFT_TO_RIGHT: string;
        RIGHT_TO_LEFT: string;
        INHERIT: string;
    } | null, fontStretch?: {
        ULTRA_CONDENSED: string;
        EXTRA_CONDENSED: string;
        CONDENSED: string;
        SEMI_CONDENSED: string;
        NORMAL: string;
        SEMI_EXPANDED: string;
        EXPANDED: string;
        EXTRA_EXPANDED: string;
        ULTRA_EXPANDED: string;
    } | null, fontKerning?: {
        AUTO: string;
        NORMAL: string;
        NONE: string;
    } | null, textAlign?: {
        LEFT: string;
        RIGHT: string;
        CENTER: string;
        START: string;
        END: string;
    } | null, textBaseline?: {
        TOP: string;
        BOTTOM: string;
        HANGING: string;
        MIDDLE: string;
        ALPHABETIC: string;
        IDEOGRAPHIC: string;
    } | null, textRendering?: {
        AUTO: string;
        FAST: string;
        LEGIBLE: string;
        PRECISE: string;
    } | null): void;
    get instanceOf(): string;
    get id(): any;
    set render(render: Render);
    get render(): Render;
    set font(_font: string);
    get font(): string;
    set letterSpacing(_letterSpacing: number);
    get letterSpacing(): number;
    set wordSpacing(_wordSpacing: number);
    get wordSpacing(): number;
    set fontVariantCaps(_fontVariantCaps: string | {
        NORMAL: string;
        SMALL_CAPS: string;
        ALL_SMALL_CAPS: string;
        PETITE_CAPS: string;
        ALL_PETITE_CAPS: string;
        UNICASE: string;
        TILTING_CAPS: string;
    });
    get fontVariantCaps(): string | {
        NORMAL: string;
        SMALL_CAPS: string;
        ALL_SMALL_CAPS: string;
        PETITE_CAPS: string;
        ALL_PETITE_CAPS: string;
        UNICASE: string;
        TILTING_CAPS: string;
    };
    set direction(_direction: string | {
        LEFT_TO_RIGHT: string;
        RIGHT_TO_LEFT: string;
        INHERIT: string;
    });
    get direction(): string | {
        LEFT_TO_RIGHT: string;
        RIGHT_TO_LEFT: string;
        INHERIT: string;
    };
    set fontStretch(_fontStretch: string | {
        ULTRA_CONDENSED: string;
        EXTRA_CONDENSED: string;
        CONDENSED: string;
        SEMI_CONDENSED: string;
        NORMAL: string;
        SEMI_EXPANDED: string;
        EXPANDED: string;
        EXTRA_EXPANDED: string;
        ULTRA_EXPANDED: string;
    });
    get fontStretch(): string | {
        ULTRA_CONDENSED: string;
        EXTRA_CONDENSED: string;
        CONDENSED: string;
        SEMI_CONDENSED: string;
        NORMAL: string;
        SEMI_EXPANDED: string;
        EXPANDED: string;
        EXTRA_EXPANDED: string;
        ULTRA_EXPANDED: string;
    };
    set fontKerning(_fontKerning: string | {
        AUTO: string;
        NORMAL: string;
        NONE: string;
    });
    get fontKerning(): string | {
        AUTO: string;
        NORMAL: string;
        NONE: string;
    };
    set textAlign(_textAlign: string | {
        LEFT: string;
        RIGHT: string;
        CENTER: string;
        START: string;
        END: string;
    });
    get textAlign(): string | {
        LEFT: string;
        RIGHT: string;
        CENTER: string;
        START: string;
        END: string;
    };
    set textBaseline(_textBaseline: string | {
        TOP: string;
        BOTTOM: string;
        HANGING: string;
        MIDDLE: string;
        ALPHABETIC: string;
        IDEOGRAPHIC: string;
    });
    get textBaseline(): string | {
        TOP: string;
        BOTTOM: string;
        HANGING: string;
        MIDDLE: string;
        ALPHABETIC: string;
        IDEOGRAPHIC: string;
    };
    set textRendering(_textRendering: string | {
        AUTO: string;
        FAST: string;
        LEGIBLE: string;
        PRECISE: string;
    });
    get textRendering(): string | {
        AUTO: string;
        FAST: string;
        LEGIBLE: string;
        PRECISE: string;
    };
    #private;
}
export class RenderStyles extends _HasColor {
    [x: number]: string | (() => {});
    static JOIN_TYPES: {
        MITER: string;
        BEVEL: string;
        ROUND: string;
    };
    static CAP_TYPES: {
        BUTT: string;
        SQUARE: string;
        ROUND: string;
    };
    static DEFAULT_WIDTH: number;
    static DEFAULT_CAP: string;
    static DEFAULT_JOIN: string;
    static DEFAULT_DASH: any[];
    static DEFAULT_DASH_OFFSET: number;
    static SERIALIZATION_SEPARATOR: string;
    static DEFAULT_PROFILE: RenderStyles;
    /**
     * Directly applies the provided styles
     * @param {Color | [r,g,b,a]?} color: the color to use
     * @param {String?} filter: the filter value, as a CSS filter
     * @param {Render.COMPOSITE_OPERATIONS?} compositeOperation: the composite operation used (/!\ Some composite operations are invasive)
     * @param {Number?} opacity: the opacity level, as a number from 0..1
     * @param {Number?} lineWidth: the width of stroked lines, in pixel
     * @param {Number | Array ?} lineDash: the line dash distance(s), in pixel
     * @param {Number?} lineDashOffset: the offset of line dashes, in pixel
     * @param {RenderStyles.JOIN_TYPES?} lineJoin: the line join style
     * @param {RenderStyles.CAP_TYPES?} lineCap: the line cap style
     */
    static apply(render: any, color: Color | ([r, g, b, a] | null), filter: string | null, compositeOperation: {
        UNDER: string;
        OVER: string;
        SOURCE_OVER: string;
        SOURCE_IN: string;
        SOURCE_OUT: string;
        SOURCE_ATOP: string;
        DESTINATION_OVER: string;
        DESTINATION_IN: string;
        DESTINATION_OUT: string;
        DESTINATION_ATOP: string;
        LIGHTER: string;
        COPY: string;
        XOR: string;
        MULTIPLY: string;
        SCREEN: string;
        OVERLAY: string;
        DARKEN: string;
        LIGHTEN: string;
        COLOR_DODGE: string;
        COLOR_BURN: string;
        HARD_LIGHT: string;
        SOFT_LIGHT: string;
        DIFFERENCE: string;
        EXCLUSION: string;
        HUE: string;
        SATURATION: string;
        COLOR: string;
        LUMINOSITY: string;
    } | null, opacity: number | null, lineWidth: number | null, lineDash: number | (any[] | null), lineDashOffset: number | null, lineJoin: {
        MITER: string;
        BEVEL: string;
        ROUND: string;
    } | null, lineCap: {
        BUTT: string;
        SQUARE: string;
        ROUND: string;
    } | null): void;
    /**
     * Represents a styling profile for paths
     * @param {Render} render: the render instance to link to
     * @param {Color | [r,g,b,a]?} color: the color to use
     * @param {String?} filter: the filter value, as a CSS filter
     * @param {Render.COMPOSITE_OPERATIONS?} compositeOperation: the composite operation used (/!\ Some composite operations are invasive)
     * @param {Number?} opacity: the opacity level, as a number from 0..1
     * @param {Number?} lineWidth: the width of stroked lines, in pixel
     * @param {Number | Array ?} lineDash: the line dash distance(s), in pixel
     * @param {Number?} lineDashOffset: the offset of line dashes, in pixel
     * @param {RenderStyles.JOIN_TYPES?} lineJoin: the line join style
     * @param {RenderStyles.CAP_TYPES?} lineCap: the line cap style
     */
    constructor(render: Render, color: Color | ([r, g, b, a] | null), filter: string | null, compositeOperation: {
        UNDER: string;
        OVER: string;
        SOURCE_OVER: string;
        SOURCE_IN: string;
        SOURCE_OUT: string;
        SOURCE_ATOP: string;
        DESTINATION_OVER: string;
        DESTINATION_IN: string;
        DESTINATION_OUT: string;
        DESTINATION_ATOP: string;
        LIGHTER: string;
        COPY: string;
        XOR: string;
        MULTIPLY: string;
        SCREEN: string;
        OVERLAY: string;
        DARKEN: string;
        LIGHTEN: string;
        COLOR_DODGE: string;
        COLOR_BURN: string;
        HARD_LIGHT: string;
        SOFT_LIGHT: string;
        DIFFERENCE: string;
        EXCLUSION: string;
        HUE: string;
        SATURATION: string;
        COLOR: string;
        LUMINOSITY: string;
    } | null, opacity: number | null, lineWidth: number | null, lineDash: number | (any[] | null), lineDashOffset: number | null, lineJoin: {
        MITER: string;
        BEVEL: string;
        ROUND: string;
    } | null, lineCap: {
        BUTT: string;
        SQUARE: string;
        ROUND: string;
    } | null);
    _id: number;
    _render: Render;
    _filter: string;
    _compositeOperation: string | {
        UNDER: string;
        OVER: string;
        SOURCE_OVER: string;
        SOURCE_IN: string;
        SOURCE_OUT: string;
        SOURCE_ATOP: string;
        DESTINATION_OVER: string;
        DESTINATION_IN: string;
        DESTINATION_OUT: string;
        DESTINATION_ATOP: string;
        LIGHTER: string;
        COPY: string;
        XOR: string;
        MULTIPLY: string;
        SCREEN: string;
        OVERLAY: string;
        DARKEN: string;
        LIGHTEN: string;
        COLOR_DODGE: string;
        COLOR_BURN: string;
        HARD_LIGHT: string;
        SOFT_LIGHT: string;
        DIFFERENCE: string;
        EXCLUSION: string;
        HUE: string;
        SATURATION: string;
        COLOR: string;
        LUMINOSITY: string;
    };
    _opacity: number;
    _lineWidth: number;
    _lineDash: number | any[];
    _lineDashOffset: number;
    _lineJoin: string | {
        MITER: string;
        BEVEL: string;
        ROUND: string;
    };
    _lineCap: string | {
        BUTT: string;
        SQUARE: string;
        ROUND: string;
    };
    /**
     * @returns a separate copy of the profile
     */
    duplicate(render?: Render, color?: string | Function | [r, g, b, a] | Color, filter?: string, compositeOperation?: string | {
        UNDER: string;
        OVER: string;
        SOURCE_OVER: string;
        SOURCE_IN: string;
        SOURCE_OUT: string;
        SOURCE_ATOP: string;
        DESTINATION_OVER: string;
        DESTINATION_IN: string;
        DESTINATION_OUT: string;
        DESTINATION_ATOP: string;
        LIGHTER: string;
        COPY: string;
        XOR: string;
        MULTIPLY: string;
        SCREEN: string;
        OVERLAY: string;
        DARKEN: string;
        LIGHTEN: string;
        COLOR_DODGE: string;
        COLOR_BURN: string;
        HARD_LIGHT: string;
        SOFT_LIGHT: string;
        DIFFERENCE: string;
        EXCLUSION: string;
        HUE: string;
        SATURATION: string;
        COLOR: string;
        LUMINOSITY: string;
    }, opacity?: number, lineWidth?: number, lineDash?: number | any[], lineDashOffset?: number, lineJoin?: string | {
        MITER: string;
        BEVEL: string;
        ROUND: string;
    }, lineCap?: string | {
        BUTT: string;
        SQUARE: string;
        ROUND: string;
    }): RenderStyles;
    /**
     * @returns the profile's styles as an array
     */
    getStyles(): (string | number | any[] | {
        MITER: string;
        BEVEL: string;
        ROUND: string;
    } | {
        BUTT: string;
        SQUARE: string;
        ROUND: string;
    })[];
    /**
     * Serializes the styles profile
     * @returns the serialized profiled
     */
    toString(color?: string | Function | [r, g, b, a] | Color, filter?: string, compositeOperation?: string | {
        UNDER: string;
        OVER: string;
        SOURCE_OVER: string;
        SOURCE_IN: string;
        SOURCE_OUT: string;
        SOURCE_ATOP: string;
        DESTINATION_OVER: string;
        DESTINATION_IN: string;
        DESTINATION_OUT: string;
        DESTINATION_ATOP: string;
        LIGHTER: string;
        COPY: string;
        XOR: string;
        MULTIPLY: string;
        SCREEN: string;
        OVERLAY: string;
        DARKEN: string;
        LIGHTEN: string;
        COLOR_DODGE: string;
        COLOR_BURN: string;
        HARD_LIGHT: string;
        SOFT_LIGHT: string;
        DIFFERENCE: string;
        EXCLUSION: string;
        HUE: string;
        SATURATION: string;
        COLOR: string;
        LUMINOSITY: string;
    }, opacity?: number, lineWidth?: number, lineDash?: number | any[], lineDashOffset?: number, lineJoin?: string | {
        MITER: string;
        BEVEL: string;
        ROUND: string;
    }, lineCap?: string | {
        BUTT: string;
        SQUARE: string;
        ROUND: string;
    }): string;
    /**
     * Serializes the styles profile, but only the color value and visual effects
     * @returns the serialized profiled
     */
    fillOptimizedToString(color?: string | Function | [r, g, b, a] | Color, filter?: string, compositeOperation?: string | {
        UNDER: string;
        OVER: string;
        SOURCE_OVER: string;
        SOURCE_IN: string;
        SOURCE_OUT: string;
        SOURCE_ATOP: string;
        DESTINATION_OVER: string;
        DESTINATION_IN: string;
        DESTINATION_OUT: string;
        DESTINATION_ATOP: string;
        LIGHTER: string;
        COPY: string;
        XOR: string;
        MULTIPLY: string;
        SCREEN: string;
        OVERLAY: string;
        DARKEN: string;
        LIGHTEN: string;
        COLOR_DODGE: string;
        COLOR_BURN: string;
        HARD_LIGHT: string;
        SOFT_LIGHT: string;
        DIFFERENCE: string;
        EXCLUSION: string;
        HUE: string;
        SATURATION: string;
        COLOR: string;
        LUMINOSITY: string;
    }, opacity?: number): string;
    /**
     * Updates a profile's attributes and returns the updated version
     * @param {Color | [r,g,b,a]?} color: the color to use
     * @param {String?} filter: the filter value, as a CSS filter
     * @param {Render.COMPOSITE_OPERATIONS?} compositeOperation: the composite operation used (/!\ Some composite operations are invasive)
     * @param {Number?} opacity: the opacity level, as a number from 0..1
     * @param {Number?} lineWidth: the width of stroked lines, in pixel
     * @param {Number | Array ?} lineDash: the line dash distance(s), in pixel
     * @param {Number?} lineDashOffset: the offset of line dashes, in pixel
     * @param {RenderStyles.JOIN_TYPES?} lineJoin: the line join style
     * @param {RenderStyles.CAP_TYPES?} lineCap: the line cap style
     * @returns the updated RenderStyles instance
     */
    update(color: Color | ([r, g, b, a] | null), filter: string | null, compositeOperation: {
        UNDER: string;
        OVER: string;
        SOURCE_OVER: string;
        SOURCE_IN: string;
        SOURCE_OUT: string;
        SOURCE_ATOP: string;
        DESTINATION_OVER: string;
        DESTINATION_IN: string;
        DESTINATION_OUT: string;
        DESTINATION_ATOP: string;
        LIGHTER: string;
        COPY: string;
        XOR: string;
        MULTIPLY: string;
        SCREEN: string;
        OVERLAY: string;
        DARKEN: string;
        LIGHTEN: string;
        COLOR_DODGE: string;
        COLOR_BURN: string;
        HARD_LIGHT: string;
        SOFT_LIGHT: string;
        DIFFERENCE: string;
        EXCLUSION: string;
        HUE: string;
        SATURATION: string;
        COLOR: string;
        LUMINOSITY: string;
    } | null, opacity: number | null, lineWidth: number | null, lineDash: number | (any[] | null), lineDashOffset: number | null, lineJoin: {
        MITER: string;
        BEVEL: string;
        ROUND: string;
    } | null, lineCap: {
        BUTT: string;
        SQUARE: string;
        ROUND: string;
    } | null): this;
    /**
     * Directly applies the styles of the profile
     * @param {Color | [r,g,b,a]?} color: the color to use
     * @param {String?} filter: the filter value, as a CSS filter
     * @param {Render.COMPOSITE_OPERATIONS?} compositeOperation: the composite operation used (/!\ Some composite operations are invasive)
     * @param {Number?} opacity: the opacity level, as a number from 0..1
     * @param {Number?} lineWidth: the width of stroked lines, in pixel
     * @param {Number | Array ?} lineDash: the line dash distance(s), in pixel
     * @param {Number?} lineDashOffset: the offset of line dashes, in pixel
     * @param {RenderStyles.JOIN_TYPES?} lineJoin: the line join style
     * @param {RenderStyles.CAP_TYPES?} lineCap: the line cap style
     */
    apply(color?: Color | ([r, g, b, a] | null), filter?: string | null, compositeOperation?: {
        UNDER: string;
        OVER: string;
        SOURCE_OVER: string;
        SOURCE_IN: string;
        SOURCE_OUT: string;
        SOURCE_ATOP: string;
        DESTINATION_OVER: string;
        DESTINATION_IN: string;
        DESTINATION_OUT: string;
        DESTINATION_ATOP: string;
        LIGHTER: string;
        COPY: string;
        XOR: string;
        MULTIPLY: string;
        SCREEN: string;
        OVERLAY: string;
        DARKEN: string;
        LIGHTEN: string;
        COLOR_DODGE: string;
        COLOR_BURN: string;
        HARD_LIGHT: string;
        SOFT_LIGHT: string;
        DIFFERENCE: string;
        EXCLUSION: string;
        HUE: string;
        SATURATION: string;
        COLOR: string;
        LUMINOSITY: string;
    } | null, opacity?: number | null, lineWidth?: number | null, lineDash?: number | (any[] | null), lineDashOffset?: number | null, lineJoin?: {
        MITER: string;
        BEVEL: string;
        ROUND: string;
    } | null, lineCap?: {
        BUTT: string;
        SQUARE: string;
        ROUND: string;
    } | null): void;
    get id(): any;
    set render(render: Render);
    get render(): Render;
    set lineWidth(_lineWidth: number);
    get lineWidth(): number;
    set lineCap(_lineCap: string | {
        BUTT: string;
        SQUARE: string;
        ROUND: string;
    });
    get lineCap(): string | {
        BUTT: string;
        SQUARE: string;
        ROUND: string;
    };
    set lineJoin(_lineJoin: string | {
        MITER: string;
        BEVEL: string;
        ROUND: string;
    });
    get lineJoin(): string | {
        MITER: string;
        BEVEL: string;
        ROUND: string;
    };
    set lineDash(_lineDash: number | any[]);
    get lineDash(): number | any[];
    set lineDashOffset(_lineDashOffset: number);
    get lineDashOffset(): number;
    #private;
}
export class Canvas {
    static DOMParser: DOMParser;
    static CANVAS_ID_GIVER: number;
    static ELEMENT_ID_GIVER: number;
    static DEFAULT_MAX_DELTATIME_MS: number;
    static DEFAULT_MAX_DELTATIME: number;
    static DEFAULT_MAXDELAY_MULTIPLIER: number;
    static DEFAULT_CANVAS_ACTIVE_AREA_PADDING: number;
    static DEFAULT_CVSDE_ATTR: string;
    static DEFAULT_CVSFRAMEDE_ATTR: string;
    static DEFAULT_CUSTOM_SVG_FILTER_ID_PREFIX: string;
    static DEFAULT_CUSTOM_SVG_FILTER_CONTAINER_ID: string;
    static CURSOR_STYLES: any;
    static LOADED_SVG_FILTERS: {};
    static DEFAULT_CTX_SETTINGS: {
        imageSmoothingEnabled: boolean;
        font: string;
        letterSpacing: string;
        wordSpacing: string;
        fontVariantCaps: string;
        direction: string;
        fontSretch: string;
        fontKerning: string;
        textAlign: string;
        textBaseline: string;
        textRendering: string;
        lineDashOffset: number;
        lineJoin: string;
        lineCap: string;
        lineWidth: number;
        fillStyle: string;
        stokeStyle: string;
    };
    static DEFAULT_CANVAS_WIDTH: number;
    static DEFAULT_CANVAS_HEIGHT: number;
    static DEFAULT_CANVAS_STYLES: {
        position: string;
        top: string;
        left: string;
        width: string;
        height: string;
        "background-color": string;
        border: string;
        outline: string;
        "pointer-events": string;
        "z-index": number;
        padding: string;
        margin: string;
        "-webkit-transform": string;
        "-moz-transform": string;
        "-ms-transform": string;
        transform: string;
        "touch-action": string;
        "-webkit-user-select": string;
        "user-select": string;
    };
    static STATIC_MODE: number;
    static STATIC: string;
    static STATES: {
        STOPPED: number;
        LOOPING: number;
        REQUESTED_STOP: number;
    };
    static #ON_LOAD_CALLBACKS: any[];
    static #ON_FIRST_INTERACT_CALLBACKS: any[];
    static DEFAULT_MOUSE_MOVE_THROTTLE_DELAY: number;
    static ACTIVATION_MARGIN_DISABLED: number;
    static MOBILE_SCROLLING_STATES: {
        DISABLED: number;
        IF_CANVAS_STOPPED: number;
        ALWAYS: number;
    };
    static #DOM_CANVAS_LINKS: any;
    static #DOM_CANVAS_INTERSECTION_OBSERVER: IntersectionObserver;
    /**
     * Creates and instantiates a canvas in the specified targetElement
     * @param {HTMLElement?} targetElement: the html element to create the canvas in
     * @param {Function?} loopingCB: a function called along with the loop() function. (deltatime)=>{...}
     * @param {Number?} fpsLimit: the maximal frames per second cap. Defaults to V-Sync
     * @param {HTMLElement?} cvsFrame: if defined, sets this element as the reference parent of the canvas element
     * @param {Object?} settings: an object containing the canvas settings
     * @param {Boolean?} willReadFrequently: whether the getImageData optimizations are enabled
     * @returns the created Canvas instance
     */
    static create(targetElement: HTMLElement | null, loopingCB: Function | null, fpsLimit: number | null, cvsFrame: HTMLElement | null, settings?: any | null, willReadFrequently?: boolean | null): Canvas;
    /**
     * Returns the Canvas instance linked to the provided HTML canvas element
     * @param {HTMLCanvasElement} cvs: an HTML canvas element
     * @returns the Canvas instance linked, if any
     */
    static getFromHTMLCanvas(cvs: HTMLCanvasElement): any;
    /**
     * Adds a callback to be called once the document is loaded
     * @param {Function} callback: the callback to call
     */
    static addOnLoadCallback(callback: Function): void;
    /**
     * Adds a callback to be called once the document has been interacted with for the first time
     * @param {Function} callback: the callback to call
     */
    static addOnFirstInteractCallback(callback: Function): void;
    /**
     * Loads a custom svg filter to use
     * @param {String} svgContent: string containing the svg filter, e.g: `<svg><filter id="someId"> ... the filter contents </svg>`
     * @param {String?} id: the id of the svg filter. (Takes the one of the svgContent <filter> element if not defined)
     * @returns the usable id
     */
    static loadSVGFilter(svgContent: string, id: string | null): string;
    /**
     * Returns the filter elements of a loaded svg filter
     * @param {String} id: the identifier of the svg filter
     */
    static getSVGFilter(id: string): any;
    /**
     * Deletes a loaded svg filter
     * @param {String} id: the identifier of the svg filter
     */
    static removeSVGFilter(id: string): void;
    static #onFirstInteraction(e: any): void;
    /**
     * Represents a html canvas element
     * @param {HTMLCanvasElement | OffscreenCanvas} cvs: the html canvas element or an OffscreenCanvas instance to link to
     * @param {Function?} loopingCB: a function called along with the loop() function. (deltatime)=>{...}
     * @param {Number?} fpsLimit: the maximal frames per second cap. Defaults to V-Sync
     * @param {HTMLElement?} cvsFrame: if defined and if "cvs" is an HTML canvas, sets this element as the reference parent of the canvas element
     * @param {Object?} settings: an object containing the canvas settings
     * @param {Boolean?} willReadFrequently: whether the getImageData optimizations are enabled
     */
    constructor(cvs: HTMLCanvasElement | OffscreenCanvas, loopingCB: Function | null, fpsLimit: number | null, cvsFrame: HTMLElement | null, settings?: any | null, willReadFrequently?: boolean | null);
    _id: number;
    _cvs: OffscreenCanvas | HTMLCanvasElement;
    _frame: any;
    set onVisibilityChangeCB(onVisibilityChangeCB: (isVisible: any, CVS: any, e: any) => void);
    get onVisibilityChangeCB(): (isVisible: any, CVS: any, e: any) => void;
    _onResizeCB: any;
    _onScrollCB: any;
    set onIntersectionChangeCB(onIntersectionChangeCB: (isVisible: any, CVS: any, e: any) => void);
    get onIntersectionChangeCB(): (isVisible: any, CVS: any, e: any) => void;
    _ctx: RenderingContext | OffscreenCanvasRenderingContext2D;
    _settings: any;
    _els: {
        refs: any[];
        defs: any[];
    };
    _state: number;
    _loopingCB: Function;
    set fpsLimit(fpsLimit: number | "static");
    get fpsLimit(): number | "static";
    _speedModifier: number;
    _deltaTime: number;
    _fixedTimeStamp: number;
    _windowListeners: {
        removeOnloadListener: () => void;
        removeOnreziseListener?: undefined;
        removeOnvisibilitychangeListener?: undefined;
        removeOnscrollListener?: undefined;
    } | {
        removeOnreziseListener: () => void;
        removeOnvisibilitychangeListener: () => void;
        removeOnscrollListener: () => void;
        removeOnloadListener: () => void;
    };
    _viewPos: number[];
    _offset: any;
    _typingDevice: TypingDevice;
    _mouse: Mouse;
    _render: Render;
    _anims: any[];
    _mouseMoveThrottlingDelay: number;
    /**
     * Modifies the canvas cursor appearance
     * @param {Canvas.CURSOR_STYLES} cursorStyle: the cursor style to use
     */
    setCursorStyle(cursorStyle?: any): void;
    updateOffset(): any;
    /**
     * Plays a single frame of the drawing loop.
     * @param {Number?} customTime: if provided, forces a time jump. Else doesn't affect time
     */
    drawSingleFrame(customTime?: number | null): void;
    /**
     * Starts the canvas drawing loop
     */
    startLoop(): number;
    /**
     * Starts the canvas drawing loop
     */
    start(): void;
    /**
     * Stops the canvas drawing loop
     */
    stopLoop(): void;
    /**
     * Stops the canvas drawing loop
     */
    stop(): void;
    updateCachedAllEls(): void;
    draw(): void;
    /**
     * Clears the provided area of the canvas
     * @param {Number?} x: the x value of the top-left corner
     * @param {Number?} y: the y value of the top-left corner
     * @param {Number?} x2: the x value of the bottom-right corner
     * @param {Number?} y2: the y value of the bottom-right corner
     */
    clear(x?: number | null, y?: number | null, x2?: number | null, y2?: number | null): void;
    /**
     * Initializes the canvas as static
     */
    initializeStatic(): void;
    /**
     * Draws a single frame (use with static canvas)
     */
    drawStatic(): void;
    /**
     * Clears the canvas and draws a single frame (use with static canvas)
     */
    cleanDrawStatic(): void;
    /**
     * Resets every fragile references
     */
    resetReferences(): void;
    /**
     * Discards all current context transformations
     */
    resetTransformations(): void;
    /**
     * Moves the camera view to a specific x/y value
     * @param {[x,y]} pos: the pos to move the camera view to
     */
    moveViewAt(pos: any): void;
    /**
     * Moves the camera view by specified x/y values
     * @param {[x,y]} pos: the x/y values to move the camera view by
     */
    moveViewBy(pos: any): void;
    /**
     * Smoothly moves the camera view to the provided pos, in set time
     * @param {[x,y]} pos: the pos to move the camera view to
     * @param {Number?} time: the move time in miliseconds
     * @param {Function?} easing: the easing function used. (x)=>{return y}
     * @param {[x,y]} initPos: the pos to start the movement. Defaults to the current camera view pos
     * @returns the created Anim instance
     */
    moveViewTo(pos: [x, y], time?: number | null, easing?: Function | null, initPos?: [x, y]): Anim;
    /**
     * Adds an animation to play
     * @param {Anim} anim: the Anim instance containing the animation
     * @returns the provided Anim instance
     */
    playAnim(anim: Anim): Anim;
    /**
     * Sets the width and height in pixels of the canvas element
     * @param {Number?} forceWidth: if defined, forces the canvas to resize to this width in pixels
     * @param {Number?} forceHeight: if defined, forces the canvas to resize to this height in pixels
     * @param {Boolean?} forceCSSupdate if true, also force the resizes on the frame using CSS
     */
    setSize(forceWidth: number | null, forceHeight: number | null, forceCSSupdate: boolean | null): void;
    /**
     * Updates current canvas settings
     * @param {Object?} settings: an object containing the canvas settings
     */
    updateSettings(settings: any | null): any;
    /**
     * Adds one or many objects to the canvas, either as a definition or as a reference/source
     * @param {_BaseObj | Array[_BaseObj]} objs: the object(s) to add
     * @param {Boolean?} inactive: if true, only initializes the object without adding it to the canvas
     * @returns
     */
    add(objs: _BaseObj | any, inactive?: boolean | null): any;
    /**
     * Removes an object from the canvas
     * @param {Number} id: the id of the object to delete
     */
    remove(id: number): void;
    /**
     * Removes all objects added to the canvas
     */
    removeAllObjects(): void;
    /**
     * Get an object from the canvas
     * @param {Number} id: the id of the object to get
     * @returns the desired object
     */
    get(id: number): any;
    /**
     * Removes any element from the canvas by instance type
     * @param {Class} instanceType: the class definition
     * @returns any object matching the class definition
     */
    getObjs(instanceType: Class): any;
    /**
     * Saves the context parameters
     */
    save(): void;
    /**
     * Restore the saved context parameters
     */
    restore(): void;
    /**
     * Defines the onmousemove listener
     * @param {Function} callback: a function called on event. (mouse, event)=>{...}
     * @param {Boolean?} global: whether the events are dispatched only on the canvas or the whole window
     * @returns a callback which removes the listeners
     */
    setMouseMove(callback: Function, global: boolean | null): false | (() => void);
    /**
     * Defines the onmouseleave listener
     * @param {Function} callback: a function called on event. (mouse, event)=>{...}
     * @param {Boolean?} global: whether the events are dispatched only on the canvas or the whole window
     * @returns a callback which removes the listeners
     */
    setMouseLeave(callback: Function, global: boolean | null): false | (() => any);
    /**
     * Defines the onmousedown listener
     * @param {Function} callback: a function called on event. (mouse, event)=>{...}
     * @param {Boolean?} global: whether the events are dispatched only on the canvas or the whole window
     * @returns a callback which removes the listeners
     */
    setMouseDown(callback: Function, global: boolean | null): false | (() => void);
    /**
     * Defines the onmouseup listener
     * @param {Function} callback: a function called on event. (mouse, event)=>{...}
     * @param {Boolean?} global: whether the events are dispatched only on the canvas or the whole window
     * @returns a callback which removes the listeners
     */
    setMouseUp(callback: Function, global: boolean | null): false | (() => void);
    /**
     * Defines the onkeydown listener
     * @param {Function} callback: a function called on event. (typingDevice, event)=>{...}
     * @param {Boolean?} global: whether the events are dispatched only on the canvas or the whole window
     * @returns a callback which removes the listeners
     */
    setKeyDown(callback: Function, global: boolean | null): false | (() => any);
    /**
     * Defines the onkeyup listener
     * @param {Function} callback: a function called on event. (typingDevice, event)=>{...}
     * @param {Boolean?} global: whether the events are dispatched only on the canvas or the whole window
     * @returns a callback which removes the listeners
     */
    setKeyUp(callback: Function, global: boolean | null): false | (() => any);
    /**
     * @returns the center [x,y] of the canvas
     */
    getCenter(): number[];
    /**
     * Returns whether the provided position is within the canvas bounds
     * @param {[x,y]} pos: the pos to check
     * @param {Number?} padding: the padding applied to the results
     */
    isWithin(pos: [x, y], padding?: number | null): boolean;
    /**
     * Returns the pixel value of the provided pourcent value
     * @param {Number} pourcentileValue: a number between 0 and 1 representing a pourcentile
     * @param {Boolean?} useWidth: whether the width or height should be used
     */
    pct(pourcentileValue: number, useWidth?: boolean | null): number;
    /**
     * Returns the px values of the provided pourcent values.
     * @param {[x%, y%]} pourcentilePos: the x/y pourcentiles as numbers between 0 and 1
     * @param {[width,height]?} referenceDims: the reference dimensions used to calculate the values
     */
    getResponsivePos(pourcentilePos: any, referenceDims?: [width, height] | null): number[];
    /**
     * Enables checks for mouse enter/leave listeners every frame
     */
    enableAccurateMouseMoveListenersMode(): void;
    set mouseMoveListenersOptimizationEnabled(enabled: boolean);
    get mouseMoveListenersOptimizationEnabled(): boolean;
    /**
     * Disables checks for mouse enter/leave listeners every frame (only checks on mouse movements)
     */
    disableAccurateMouseMoveListenersMode(): void;
    /**
     * Disables all mouse move throttling cause by the mouseMoveThrottlingDelay property.
     */
    disableMouseMoveThrottling(): void;
    /**
     * Disables all on intersection change actions
     */
    disableViewportIntersectionOptimizations(): void;
    /**
     * Sets the on interaction change actions to be the default optimizations
     */
    enableDefaultViewportIntersectionOptimizations(): void;
    get instanceOf(): string;
    set id(id: number);
    get id(): number;
    get cvs(): OffscreenCanvas | HTMLCanvasElement;
    get frame(): any;
    get ctx(): RenderingContext | OffscreenCanvasRenderingContext2D;
    set width(w: any);
    get width(): any;
    set height(h: any);
    get height(): any;
    get size(): any;
    get settings(): any;
    set loopingCB(loopingCB: Function);
    get loopingCB(): Function;
    get looping(): boolean;
    get stopped(): boolean;
    get state(): number;
    get deltaTime(): number;
    get windowListeners(): {
        removeOnloadListener: () => void;
        removeOnreziseListener?: undefined;
        removeOnvisibilitychangeListener?: undefined;
        removeOnscrollListener?: undefined;
    } | {
        removeOnreziseListener: () => void;
        removeOnvisibilitychangeListener: () => void;
        removeOnscrollListener: () => void;
        removeOnloadListener: () => void;
    };
    get timeStamp(): any;
    get timeStampNotFixed(): any;
    get timeStampRaw(): any;
    get els(): {
        refs: any[];
        defs: any[];
    };
    get mouse(): Mouse;
    get typingDevice(): TypingDevice;
    get keyboard(): TypingDevice;
    set offset(offset: any);
    get offset(): any;
    get defs(): any[];
    get refs(): any[];
    get allDefsAndRefs(): any[];
    get allEls(): any;
    get fpsLimitRaw(): any;
    set onResizeCB(onResize: any);
    get onResizeCB(): any;
    set onScrollCB(onScrollCB: any);
    get onScrollCB(): any;
    get maxTime(): any;
    get viewPos(): number[];
    get render(): Render;
    set speedModifier(speedModifier: number);
    get speedModifier(): number;
    get anims(): any[];
    get isOffscreenCanvas(): boolean;
    set mouseMoveThrottlingDelay(mouseMoveThrottlingDelay: number);
    get mouseMoveThrottlingDelay(): number;
    get dimensions(): any[];
    get hasBeenStarted(): boolean;
    set mobileScrollingState(state: number);
    get mobileScrollingState(): number;
    _fpsLimit: any;
    _onVisibilityChangeCB: (isVisible: any, CVS: any, e: any) => void;
    _onIntersectionChangeCB: (isVisible: any, CVS: any, e: any) => void;
    #private;
}
export class Anim {
    static #ANIM_ID_GIVER: number;
    static DEFAULT_DURATION: number;
    static easeInSine: (x: any) => number;
    static easeOutSine: (x: any) => number;
    static easeInOutSine: (x: any) => number;
    static easeInCubic: (x: any) => number;
    static easeOutCubic: (x: any) => number;
    static easeInOutCubic: (x: any) => number;
    static easeInQuint: (x: any) => number;
    static easeOutQuint: (x: any) => number;
    static easeInOutQuint: (x: any) => number;
    static easeInCirc: (x: any) => number;
    static easeOutCirc: (x: any) => number;
    static easeInOutCirc: (x: any) => number;
    static easeInElastic: (x: any) => number;
    static easeOutElastic: (x: any) => number;
    static easeInOutElastic: (x: any) => number;
    static easeInQuad: (x: any) => number;
    static easeOutQuad: (x: any) => number;
    static easeInOutQuad: (x: any) => number;
    static easeInQuart: (x: any) => number;
    static easeOutQuart: (x: any) => number;
    static easeInOutQuart: (x: any) => number;
    static easeInExpo: (x: any) => number;
    static easeOutExpo: (x: any) => number;
    static easeInOutExpo: (x: any) => number;
    static easeInBack: (x: any) => number;
    static easeOutBack: (x: any) => number;
    static easeInOutBack: (x: any) => number;
    static easeInBounce: (x: any) => number;
    static easeOutBounce: (x: any) => number;
    static easeInOutBounce: (x: any) => number;
    static linear: (x: any) => any;
    /**
     * Allows the creation of smooth progress based animations
     * @param {Function} animationCB: a function called each frame containing the animation code. (clampedProgress, playCount, progress)=>{...}
     * @param {Number?} duration: the animation duration in miliseconds. Negative numbers make the animation loop infinitely
     * @param {Function?} easing: the easing function used. (x)=>{return y}
     * @param {Function?} endCB: a function called upon the anim end
     */
    constructor(animationCB: Function, duration: number | null, easing: Function | null, endCB: Function | null);
    _id: number;
    _animation: Function;
    _duration: number;
    _easing: Function;
    _endCB: Function;
    _startTime: any;
    _progress: number;
    _playCount: number;
    _isReversed: boolean;
    getFrame(time: any, deltaTime: any): void;
    end(deltaTime: any): void;
    reset(isInfiniteReset: any, deltaTime: any): void;
    get instanceOf(): string;
    get id(): number;
    set animation(_animation: Function);
    get animation(): Function;
    set duration(_duration: number);
    get duration(): number;
    set easing(_easing: Function);
    get easing(): Function;
    set endCB(_endCB: Function);
    get endCB(): Function;
    get startTime(): any;
    get progress(): number;
    get progressRaw(): number;
    get playCount(): number;
}
export class _BaseObj extends _HasColor {
    static DEFAULT_POS: number[];
    static DEFAULT_ACTIVATION_MARGIN: number;
    static ACTIVATION_MARGIN_DISABLED: number;
    static ABSOLUTE_ANCHOR: number[];
    static POSITION_PRECISION: number;
    /**
     * Abstract canvas obj class
     * @param {[x,y]?} pos: the [x,y] pos of the object
     * @param {Color | [r,g,b,a] ?} color: the color of the object
     * @param {Function?} setupCB: function called on object's initialization (this, parent)=>{...}
     * @param {Function?} loopCB: function called each frame for this object (this)=>{...}
     * @param {[x,y] | Function | _BaseObj ?} anchorPos: reference point from which the object's pos will be set. Either a pos array, a callback (this, parent)=>{return [x,y] | _baseObj} or a _BaseObj inheritor
     * @param {Number | Boolean ?} activationMargin: the pixel margin amount from where the object remains active when outside the canvas visual bounds. If "true", the object will always remain active.
     */
    constructor(pos: [x, y] | null, color: Color | ([r, g, b, a] | null), setupCB: Function | null, loopCB: Function | null, anchorPos: [x, y] | Function | (_BaseObj | null), activationMargin: number | (boolean | null));
    _id: number;
    _initPos: [x, y];
    _pos: number[];
    _setupCB: Function;
    _loopCB: Function;
    _setupResults: any;
    _anchorPos: Function | [x, y] | _BaseObj;
    _activationMargin: number | boolean;
    _parent: any;
    _rotation: number;
    _scale: number[];
    _anims: {
        backlog: any[];
        currents: any[];
    };
    _visualEffects: any;
    _initialized: boolean;
    initialize(): void;
    draw(time: any, deltaTime: any): void;
    /**
     * @returns the value of the inital pos declaration
     */
    getInitPos(): any[];
    setAnchoredPos(): void;
    /**
     * Instantly moves the object to the given pos
     * @param {[x,y]} pos: the pos to move to
     */
    moveAt(pos: any): void;
    set x(x: number);
    get x(): number;
    set y(y: number);
    get y(): number;
    /**
     * Instantly moves the object by the increments provided
     * @param {[x,y]} pos: the x/y values to increment by
     */
    moveBy(pos: any): void;
    /**
     * Smoothly moves to a pos in set time
     * @param {[x,y]} pos: the pos to move to
     * @param {Number?} time: the move time in miliseconds
     * @param {Function?} easing: the easing function used. (x)=>{return y}
     * @param {[x,y]?} initPos: the pos to start the movement. Defaults to object's current pos
     * @param {Boolean?} isUnique: if true, the animation gets queue in the object's animation backlog.
     * @param {Boolean?} force: if true, terminates the current backlog animation and replaces it with this animation
     * @returns the created Anim instance
     */
    moveTo(pos: [x, y], time: number | null, easing: Function | null, initPos: [x, y] | null, isUnique: boolean | null, force: boolean | null): Anim;
    /**
     * Rotates the object clock-wise by a specified degree increment around its pos
     * @param {Number} deg: the degrees to rotate by
     */
    rotateBy(deg: number): void;
    set rotation(_rotation: number);
    get rotation(): number;
    /**
     * Rotates the object to a specified degree around its pos
     * @param {Number} deg: the degrees to rotate to
     */
    rotateAt(deg: number): void;
    /**
     * Smoothly rotates the object to a specified degree around its pos
     * @param {Number} deg: the degrees to rotate to
     * @param {Number?} time: the rotate time in miliseconds
     * @param {Function?} easing: the easing function used. (x)=>{return y}
     * @param {Boolean?} isUnique: if true, the animation gets queue in the object's animation backlog.
     * @param {Boolean?} force: if true, terminates the current backlog animation and replaces it with this animation
     * @returns the created Anim instance
     */
    rotateTo(deg: number, time?: number | null, easing?: Function | null, isUnique?: boolean | null, force?: boolean | null): Anim;
    /**
     * Scales the object by a specified amount [scaleX, scaleY] from its pos
     * @param {[scaleX, scaleY]} scale: the x/y values to scale the object by
     */
    scaleBy(scale: any): void;
    /**
     * Scales the object to a specified amount [scaleX, scaleY] from its pos
     * @param {[scaleX, scaleY]} scale: the x/y values to scale the object to
     */
    scaleAt(scale: [scaleX, scaleY]): void;
    set scale(scale: number[]);
    get scale(): number[];
    /**
     * Smoothly scales the text to a specified amount [scaleX, scaleY] from its pos
     * @param {[scaleX, scaleY]} scale: the x/y values to scale the object to
     * @param {Number?} time: the scale time in miliseconds
     * @param {Function?} easing: the easing function used. (x)=>{return y}
     * @param {[x,y]} centerPos: the center pos used for scaling
     * @param {Boolean?} isUnique: if true, the animation gets queue in the object's animation backlog.
     * @param {Boolean?} force: if true, terminates the current backlog animation and replaces it with this animation
     * @returns the created Anim instance
     */
    scaleTo(scale: [scaleX, scaleY], time?: number | null, easing?: Function | null, centerPos?: [x, y], isUnique?: boolean | null, force?: boolean | null): Anim;
    /**
    * Used to make an object follow a custom path
    * @param {Number} duration: duration of the animation in ms
    * @param {Function} easing: easing function
    * @param {Function?} action: custom callback that can be called in addition to the movement                                                        //newProg is 'prog' - the progress delimeter of the range
    * @param {[[Number, Function], ...]} progressSeparations: list of callback paired with a progress range, the callback must return a position (prog, newProg, initX, initY)=>return [x,y]
    * progressSeparations example: [0:(prog)=>[x1, y1]], [0.5:(prog, fprog)=>[x2, y2]] -> from 0% to 49% the pos from 1st callback is applied, from 50%-100% the pos from 2nd callback is applied
    */
    follow(duration: number, easing: Function, action: Function | null, progressSeparations: [[number, Function], ...any]): void;
    /**
     * Moves the object in the specified direction, at the specified distance/force
     * @param {Number} distance: the distance in pixels
     * @param {Number} deg: the degree representing the direction of the movement
     * @param {Number?} time: the move time in miliseconds
     * @param {Function?} easing: the easing function used. (x)=>{return y}
     * @param {Boolean?} isUnique: if true, the animation gets queue in the object's animation backlog.
     * @param {Boolean?} animForce: if true, terminates the current backlog animation and replaces it with this animation
     * @returns the created Anim instance
     */
    addForce(distance: number, deg: number, time?: number | null, easing?: Function | null, isUnique?: boolean | null, animForce?: boolean | null): Anim;
    /**
     * Adds an animation to play on the object
     * @param {Anim} anim: the Anim instance containing the animation
     * @param {Boolean?} isUnique: if true, the animation gets queue in the object's animation backlog.
     * @param {Boolean?} force: if true, terminates the current backlog animation and replaces it with this animation
     * @returns the provided Anim instance
     */
    playAnim(anim: Anim, isUnique: boolean | null, force: boolean | null): Anim;
    /**
     * Clears all blacklog and currents anim
     */
    clearAnims(): void;
    /**
     * Allows flexible pos declarations, if a x/y value is null, it gets adjusted to the current corresponding object's value
     * @param {[x,y]} pos: a pos array
     * @returns the adjusted pos array
     */
    adjustPos(pos: any): any[];
    /**
     * Deletes the object from the canvas
     */
    remove(): void;
    /**
     * Returns whether the provided pos is in the provided area
     * @param {[x,y]} pos: the pos to check
     * @param {[[x1,y1], [x2,y2]]} positions: the two pos representing the recangular area
     */
    isWithin(pos: [x, y], positions: [[x1, y1], [x2, y2]]): boolean;
    /**
     * Returns the center pos of the provided positions
     * @param {[[x1,y1], [x2,y2]]} positions: the two pos represencting the recangular area
     */
    getCenter(positions: [[x1, y1], [x2, y2]]): number[];
    /**
     * Returns the 4 corners of the provided positions accounting for rotation and scale
     * @param {[[x1,y1], [x2,y2]]} positions: the two pos represencting the recangular area
     * @param {Number | [paddingTop, paddingRight?, paddingBottom?, paddingLeft?] ?} padding: the padding applied to the results
     * @param {Number?} rotation: the rotation in degrees of the area
     * @param {[scaleX, scaleY]?} scale: the scale of the area
     * @param {[x,y]?} centerPos: the center pos used for rotation/scale
     * @returns corners -> [TO:-LEFT, BOTTOM-RIGHT, TOP-RIGHT, BOTTOM-LEFT]
     */
    getCorners(positions: [[x1, y1], [x2, y2]], padding?: number | ([paddingTop, paddingRight?, paddingBottom?, paddingLeft?] | null), rotation?: number | null, scale?: [scaleX, scaleY] | null, centerPos?: [x, y] | null): [[x1, y1], [x2, y2]];
    /**
     * Returns the minimal rectangular area defined by the provided positions
     * @param {[[x1,y1], [x2,y2]]} positions: the two pos represencting the recangular area
     * @param {Number | [paddingTop, paddingRight?, paddingBottom?, paddingLeft?] ?} padding: the padding applied to the results
     * @param {Number?} rotation: the rotation in degrees of the area
     * @param {[scaleX, scaleY]?} scale: the scale of the area
     * @param {[x,y]?} centerPos: the center pos used for rotation/scale
     * @returns the area positions [[x1,y1], [x2,y2]]
     */
    getBounds(positions: [[x1, y1], [x2, y2]], padding: number | ([paddingTop, paddingRight?, paddingBottom?, paddingLeft?] | null), rotation: number | null, scale: [scaleX, scaleY] | null, centerPos?: [x, y] | null): any[][];
    /**
     * Disables the object by setting its activation margin to 0
     */
    disable(): void;
    /**
     * Enables the object by setting its activation margin back to what it was before disabling
     */
    enable(): void;
    get id(): number;
    set pos(pos: number[]);
    get pos(): number[];
    get pos_(): any[];
    set relativeX(x: number);
    get relativeX(): number;
    set relativeY(y: number);
    get relativeY(): number;
    set relativePos(pos: number[]);
    get relativePos(): number[];
    get stringPos(): string;
    set initPos(initPos: [x, y]);
    get initPos(): [x, y];
    get currentBacklogAnim(): any;
    get anims(): {
        backlog: any[];
        currents: any[];
    };
    set setupCB(cb: Function);
    get setupCB(): Function;
    set loopCB(cb: Function);
    get loopCB(): Function;
    set loopingCB(cb: Function);
    get loopingCB(): Function;
    set setupResults(value: any);
    get setupResults(): any;
    set initialized(init: boolean);
    get initialized(): boolean;
    set activationMargin(activationMargin: number | boolean);
    get activationMargin(): number | boolean;
    set anchorPosRaw(anchorPos: Function | [x, y] | _BaseObj);
    get anchorPosRaw(): Function | [x, y] | _BaseObj;
    set anchorPos(anchorPos: any);
    get anchorPos(): any;
    set lastAnchorPos(lastAnchorPos: number[]);
    get lastAnchorPos(): number[];
    get hasAnchorPosChanged(): any;
    get parent(): any;
    set visualEffects(visualEffects: any);
    get visualEffects(): any;
    get visualEffects_(): any[];
    set filter(filter: any);
    get filter(): any;
    set compositeOperation(compositeOperation: any);
    get compositeOperation(): any;
    set opacity(opacity: any);
    get opacity(): any;
    get safeColorObject(): string | Function | [r, g, b, a] | Color;
    get lastActivationMargin(): any;
    get enabled(): boolean;
    get disabled(): boolean;
    #private;
}
export class AudioDisplay extends _BaseObj {
    [x: number]: string | (() => {});
    static LOADED_IR_BUFFERS: any[];
    static SUPPORTED_AUDIO_FORMATS: string[];
    static SOURCE_TYPES: {
        FILE_PATH: string;
        DYNAMIC: string;
        MICROPHONE: string;
        SCREEN_AUDIO: string;
        VIDEO: {
            new (): HTMLVideoElement;
            prototype: HTMLVideoElement;
        };
        AUDIO: {
            new (): HTMLAudioElement;
            prototype: HTMLAudioElement;
        };
    };
    static MINIMAL_FFT: number;
    static MAXIMAL_FFT: number;
    static DEFAULT_SAMPLE_COUNT: number;
    static DEFAULT_BINCB: (render: any, bin: any, pos: any, audioDisplay: any) => any[];
    static DEFAULT_BINCB_TRANSFORMABLE: (render: any, bin: any, pos: any, audioDisplay: any) => any[];
    static BIN_CALLBACKS: {
        DEFAULT: (render: any, bin: any, pos: any, audioDisplay: any) => any[];
        CIRCLE: (render: any, bin: any, pos: any, audioDisplay: any, accumulator: any, i: any) => void;
        BARS: (render: any, bin: any, pos: any, audioDisplay: any) => any[];
        TOP_WAVE: (render: any, bin: any, pos: any, audioDisplay: any, accumulator: any, i: any, sampleCount: any) => any[];
    };
    static MICROPHONE_CHANNELS: {
        MONO: number;
        STEREO: number;
    };
    static DEFAULT_MICROPHONE_DELAY: number;
    static DEFAULT_MICROPHONE_AUTO_GAIN_CONTROL: boolean;
    static DEFAULT_MICROPHONE_ECHO_CANCELLATION: boolean;
    static DEFAULT_MICROPHONE_NOISE_SUPPRESSION: boolean;
    static DEFAULT_MICROPHONE_CHANNEL_COUNT: number;
    static DEFAULT_MICROPHONE_SAMPLE_RATE: number;
    static DEFAULT_MICROPHONE_SAMPLE_SIZE: number;
    static DEFAULT_MICROPHONE_SETTINGS: {
        type: string;
        settings: {
            autoGainControl: boolean;
            channelCount: number;
            echoCancellation: boolean;
            latency: number;
            noiseSuppression: boolean;
            sampleRate: number;
            sampleSize: number;
        };
    };
    static DEFAULT_SCREEN_AUDIO_SETTINGS: {
        type: string;
        settings: {
            autoGainControl: boolean;
            channelCount: number;
            echoCancellation: boolean;
            latency: number;
            noiseSuppression: boolean;
            sampleRate: number;
            sampleSize: number;
        };
    };
    static MAX_NORMALISED_DATA_VALUE: number;
    static MAX_DELAY_TIME: number;
    static ERROR_TYPES: {
        NO_PERMISSION: number;
        DEVICE_IN_USE: number;
        SOURCE_DISCONNECTED: number;
        FILE_NOT_FOUND: number;
        NOT_AVAILABLE: number;
        NOT_SUPPORTED: number;
    };
    static BIQUAD_FILTER_TYPES: {
        DEFAULT: string;
        ALLPASS: string;
        BANDPASS: string;
        HIGHPASS: string;
        HIGHSHELF: string;
        LOWPASS: string;
        LOWSHELF: string;
        NOTCH: string;
        PEAKING: string;
    };
    static IS_MICROPHONE_SUPPORTED: () => boolean;
    static IS_SCREEN_ADUIO_SUPPORTED: () => boolean;
    static DEFAULT_MEDIA_ERROR_CALLBACK: (errorCode: any, media: any) => void;
    /**
     * Initializes a AudioDisplay data source
     * @param {AudioDisplay.SOURCE_TYPES} dataSrc: the source of the audio
     * @param {Function?} loadCallback: a function called upon source load (audioElement, isStream)=>
     * @param {Function?} errorCB: a function called if there is an error with the source (errorType, dataSrc, e?)=>
     */
    static initializeDataSource(dataSrc: {
        FILE_PATH: string;
        DYNAMIC: string;
        MICROPHONE: string;
        SCREEN_AUDIO: string;
        VIDEO: {
            new (): HTMLVideoElement;
            prototype: HTMLVideoElement;
        };
        AUDIO: {
            new (): HTMLAudioElement;
            prototype: HTMLAudioElement;
        };
    }, loadCallback: Function | null, errorCB: Function | null): void;
    static #initAudioDataSource(dataSource: any, loadCallback: any, errorCB: any): void;
    static #initMicrophoneDataSource(settings: boolean, loadCallback: any, errorCB: any): void;
    static #initScreenAudioDataSource(settings: boolean, loadCallback: any, errorCB: any): void;
    /**
     * Returns a usable audio source
     * @param {String} src: the source of the audio
     * @param {Boolean?} looping: whether the audio loops
     * @param {Boolean?} autoPlay: whether the audio autoplays
     * @returns a Audio instance
     */
    static loadAudio(path: any, looping?: boolean | null, autoPlay?: boolean | null): HTMLAudioElement;
    /**
     * Returns a usable microphone capture source
     * @param {Boolean?} autoGainControl: whether the auto gain control is enabled
     * @param {Boolean?} echoCancellation: whether the echo cancellation is enabled
     * @param {Boolean?} noiseSuppression: whether the noise suppression is enabled
     * @param {Boolean?} isStereo: whether the microphone is mono or stereo
     * @param {Number?} delay: the delay of the microphone
     * @param {Number?} sampleRate: the sample rate
     * @param {Number?} sampleSize: the sample size
     * @returns an object containing microphone settings, usable as a source
     */
    static loadMicrophone(autoGainControl: boolean | null, echoCancellation: boolean | null, noiseSuppression: boolean | null, isStereo: boolean | null, delay: number | null, sampleRate: number | null, sampleSize: number | null): {
        type: string;
        settings: {
            autoGainControl: boolean;
            channelCount: number;
            echoCancellation: boolean;
            latency: number;
            noiseSuppression: boolean;
            sampleRate: number;
            sampleSize: number;
        };
    };
    /**
     * Returns a usable screen audio capture source
     * @param {Boolean?} autoGainControl: whether the auto gain control is enabled
     * @param {Boolean?} echoCancellation: whether the echo cancellation is enabled
     * @param {Boolean?} noiseSuppression: whether the noise suppression is enabled
     * @param {Boolean?} isStereo: whether the screen audio is mono or stereo
     * @param {Number?} delay: the delay of the screen audio
     * @param {Number?} sampleRate: the sample rate
     * @param {Number?} sampleSize: the sample size
     * @returns an object containing screen audio settings, usable as a source
     */
    static loadScreenAudio(autoGainControl: boolean | null, echoCancellation: boolean | null, noiseSuppression: boolean | null, isStereo: boolean | null, delay: number | null, sampleRate: number | null, sampleSize: number | null): {
        type: string;
        settings: {
            autoGainControl: boolean;
            channelCount: number;
            echoCancellation: boolean;
            latency: number;
            noiseSuppression: boolean;
            sampleRate: number;
            sampleSize: number;
        };
    };
    /**
     * Provides a generic customizable distortion curve to use with the waveShaperNode.curve (based on https://stackoverflow.com/questions/22312841/waveshaper-node-in-webaudio-how-to-emulate-distortion)
     * @param {Number} intensity: the intensity of the distortion curve
     * @param {Number?} sampleCount: the distortion curve size
     * @returns the generated distortion curve
     */
    static getDistortionCurve(intensity: number, sampleCount?: number | null): Float32Array<ArrayBuffer>;
    /**
     * Returns whether the provided audio file type is supported
     * @param {String | File} file: the file or filename
     * @returns Whether the audio file is supported or not
     */
    static isAudioFormatSupported(file: string | File): boolean;
    /**
     * @returns Returns all the supported file formats in a string usable in a HTML file input
     */
    static getSupportedHTMLAcceptValue(): string;
    /**
     * Returns the name of the errors
     * @param {AudioDisplay.ERROR_TYPES} errorCode: The error code contained in ERROR_TYPES
     * @returns the name of the error based on the error code
     */
    static getErrorFromCode(errorCode: {
        NO_PERMISSION: number;
        DEVICE_IN_USE: number;
        SOURCE_DISCONNECTED: number;
        FILE_NOT_FOUND: number;
        NOT_AVAILABLE: number;
        NOT_SUPPORTED: number;
    }): any;
    /**
     * Generic binCB for a waveform display
     * @param {Number?} maxHeight: the maximal height in pixels of the bars
     * @param {Number?} minHeight: the minimal height in pixels of the bars
     * @param {Number?} spacing: the horizontal space in pixels between each bar
     * @param {Number?} barWidth: the width in pixels of each bar
     * @param {Boolean?} transformable: whether the binCB accpets visual effects
     * @returns a usable binCB
     */
    static BARS(maxHeight: number | null, minHeight: number | null, spacing: number | null, barWidth: number | null, transformable: boolean | null): (render: any, bin: any, pos: any, audioDisplay: any) => any[];
    /**
     * Generic binCB for a circular display
     * @param {Number?} maxRadius: the maximal radius in pixels
     * @param {Number?} minRadius: the minimal radius in pixels
     * @param {Boolean?} transformable: whether the binCB accpets visual effects
     * @param {Number?} precision: how many bins to skip before drawing a bin. The lower, the prettier, the higher, the most performant.
     * @returns a usable binCB
     */
    static CIRCLE(maxRadius: number | null, minRadius: number | null, transformable: boolean | null, precision: number | null): (render: any, bin: any, pos: any, audioDisplay: any, accumulator: any, i: any) => void;
    /**
     * Generic binCB for sin-ish wave display
     * @param {Number?} maxHeight: the maximal height in pixels of the bina
     * @param {Number?} minHeight: the minimal height in pixels of the bina
     * @param {Number?} spacing: the horizontal space in pixels between each bin
     * @param {Boolean?} transformable: whether the binCB accpets visual effects
     * @param {Number?} precision: how many bins to skip before drawing a bin. The lower, the prettier, the higher, the most performant.
     * @returns a usable binCB
     */
    static TOP_WAVE(maxHeight: number | null, minHeight: number | null, spacing: number | null, transformable: boolean | null, precision: number | null): (render: any, bin: any, pos: any, audioDisplay: any, accumulator: any, i: any, sampleCount: any) => any[];
    /**
     * Generic binCB for spiral particle cloud display
     * @param {Number?} maxRadius: the maximal radius in pixels
     * @param {Number?} minRadius: the minimal radius in pixels
     * @param {Number?} particleRadius: the radius of each particle
     * @param {Boolean?} transformable: whether the binCB accpets visual effects
     * @param {Number?} precision: how many bins to skip before drawing a bin. The lower, the prettier, the higher, the most performant.
     * @param {Number?} angleStep: the circular distance between each particle, in radian
     * @returns a usable binCB
     */
    static CLOUD(maxRadius: number | null, minRadius: number | null, particleRadius: number | null, transformable: boolean | null, precision: number | null, angleStep: number | null): (render: any, bin: any, pos: any, audioDisplay: any, accumulator: any, i: any) => any[];
    /**
     * Displays audio as an object
     * @param {AudioDisplay.SOURCE_TYPES?} source: the source of the audio
     * @param {[x,y]?} pos: the pos of the object
     * @param {Color | String | [r,g,b,a]?} color: the color of the object
     * @param {Function?} binCB: a function called for each bin of the audio, used to create the display. (render, bin, atPos, audioDisplay, accumulator, i, sampleCount, rawBin)=>{... return? [ [newX, newY], newAccumulatorValue ]}
     * @param {Number?} sampleCount: the max count of bins, (fftSize is calculated by the nearest valid value). Ex: if sampleCount is "32" and the display style is "BARS", 32 bars will be displayed
     * @param {Boolean?} disableAudio: whether the audio output is disabled or not (does not affect the visual display)
     * @param {Number?} offsetPourcent: the offset pourcent (0..1) in the bins order when calling binCB
     * @param {Function?} errorCB: a function called if there is an error with the source (errorType, source, e?)=>
     * @param {Function?} setupCB: function called on object's initialization (this, parent)=>{...}
     * @param {Function?} loopCB: function called each frame for this object (this)=>{...}
     * @param {[x,y] | Function | _BaseObj ?} anchorPos: reference point from which the object's pos will be set. Either a pos array, a callback (this, parent)=>{return [x,y] | _baseObj} or a _BaseObj inheritor
     * @param {Number | Boolean ?} activationMargin: the pixel margin amount from where the object remains active when outside the canvas visual bounds. If "true", the object will always remain active.
     */
    constructor(source: {
        FILE_PATH: string;
        DYNAMIC: string;
        MICROPHONE: string;
        SCREEN_AUDIO: string;
        VIDEO: {
            new (): HTMLVideoElement;
            prototype: HTMLVideoElement;
        };
        AUDIO: {
            new (): HTMLAudioElement;
            prototype: HTMLAudioElement;
        };
    } | null, pos: [x, y] | null, color: Color | string | ([r, g, b, a] | null), binCB: Function | null, sampleCount: number | null, disableAudio: boolean | null, offsetPourcent: number | null, errorCB: Function | null, setupCB: Function | null, loopCB: Function | null, anchorPos: [x, y] | Function | (_BaseObj | null), activationMargin: number | (boolean | null));
    _source: string | {
        FILE_PATH: string;
        DYNAMIC: string;
        MICROPHONE: string;
        SCREEN_AUDIO: string;
        VIDEO: {
            new (): HTMLVideoElement;
            prototype: HTMLVideoElement;
        };
        AUDIO: {
            new (): HTMLAudioElement;
            prototype: HTMLAudioElement;
        };
    };
    _binCB: Function;
    _sampleCount: number;
    _disableAudio: boolean;
    _offsetPourcent: number;
    _errorCB: Function;
    _transformable: number;
    _audioCtx: AudioContext;
    _audioAnalyser: AnalyserNode;
    _gainNode: GainNode;
    _biquadFilterNode: BiquadFilterNode;
    _convolverNode: ConvolverNode;
    _waveShaperNode: WaveShaperNode;
    _dynamicsCompressorNode: DynamicsCompressorNode;
    _pannerNode: PannerNode;
    _delayNode: DelayNode;
    draw(render: any, time: any, deltaTime: any): void;
    /**
     * (UNRELIABLE WITH AudioDisplay) Returns whether the provided pos is in the audio display
     * @param {[x,y]} pos: the pos to check
     * @param {Number | [paddingTop, paddingRight?, paddingBottom?, paddingLeft?] ?} padding: the padding added to the validity area
     * @param {Number?} rotation: the rotation in degrees of the area
     * @param {[scaleX, scaleY]?} scale: the scale of the area
     * @returns whether the provided pos is in the audio display
     */
    isWithin(pos: [x, y], padding: number | ([paddingTop, paddingRight?, paddingBottom?, paddingLeft?] | null), rotation: number | null, scale: [scaleX, scaleY] | null): boolean;
    /**
     * (UNRELIABLE WITH AudioDisplay) returns the center pos of the audio display
     */
    getCenter(): number[];
    /**
     * (UNRELIABLE WITH AudioDisplay) returns the minimal rectangular area containing all of the audio display
     * @param {Number | [paddingTop, paddingRight?, paddingBottom?, paddingLeft?] ?} padding: the padding added to the validity area
     * @param {Number?} rotation: the rotation in degrees of the area
     * @param {[scaleX, scaleY]?} scale: the scale of the area
     * @returns the area positions [[x1,y1], [x2,y2]]
     */
    getBounds(padding: number | ([paddingTop, paddingRight?, paddingBottom?, paddingLeft?] | null), rotation?: number | null, scale?: [scaleX, scaleY] | null): any[][];
    initializeSource(source?: string | {
        FILE_PATH: string;
        DYNAMIC: string;
        MICROPHONE: string;
        SCREEN_AUDIO: string;
        VIDEO: {
            new (): HTMLVideoElement;
            prototype: HTMLVideoElement;
        };
        AUDIO: {
            new (): HTMLAudioElement;
            prototype: HTMLAudioElement;
        };
    }): void;
    /**
     * Connects the convolverNode to the audio chain
     */
    connectConvolver(): void;
    /**
     * Disconnects the convolverNode from the audio chain
     */
    disconnectConvolver(): void;
    /**
     * Loads a impulse response file into a usable buffer
     * @param {String} src: the source of the impulse response file
     * @param {Function?} readyCallback: a function called once the file is loaded
     */
    loadImpulseResponse(src: string, readyCallback?: Function | null): void;
    /**
     * Sets the volume of the audio
     * @param {Number?} gain: the gain value
     */
    setVolume(gain?: number | null): void;
    /**
     * Sets the filter type of the biquadFilterNode
     * @param {AudioDisplay.BIQUAD_FILTER_TYPES} filterType: the type of filter to use
     */
    setBiquadFilterType(filterType?: {
        DEFAULT: string;
        ALLPASS: string;
        BANDPASS: string;
        HIGHPASS: string;
        HIGHSHELF: string;
        LOWPASS: string;
        LOWSHELF: string;
        NOTCH: string;
        PEAKING: string;
    }): void;
    /**
     * Sets the distortion curve of the waveShaperNode
     * @param {Number?} intensity: the intensity of the distortion curve. Defaults to no distortion
     */
    setDistortionCurve(intensity?: number | null): void;
    /**
     * Sets the 3D position of the audio's origin
     * @param {Number?} x: the x position
     * @param {Number?} y: the y position
     * @param {Number?} z: the z position
     * @param {Number?} secondsOffset: the time offset in seconds
     */
    setOriginPos(x?: number | null, y?: number | null, z?: number | null, secondsOffset?: number | null): void;
    /**
     * Sets the audio feedback delay
     * @param {Number?} seconds: the delay value
     */
    setDelay(seconds?: number | null): void;
    /**
     * Sets the convolverNode impulse response buffer
     * @param {AudioBuffer} buffer: the impulse response buffer to use
     */
    setReverb(buffer?: AudioBuffer): void;
    /**
     * resets all audio modifiers to their default values (no audio changes)
     */
    resetAudioModifiers(): void;
    /**
     * @returns a separate copy of this AudioDisplay instance (only if initialized)
     */
    duplicate(source?: string | {
        FILE_PATH: string;
        DYNAMIC: string;
        MICROPHONE: string;
        SCREEN_AUDIO: string;
        VIDEO: {
            new (): HTMLVideoElement;
            prototype: HTMLVideoElement;
        };
        AUDIO: {
            new (): HTMLAudioElement;
            prototype: HTMLAudioElement;
        };
    }, pos?: any[], color?: string | Function | [r, g, b, a] | Color, binCB?: Function, sampleCount?: number, disableAudio?: boolean, offsetPourcent?: number, errorCB?: Function, setupCB?: Function, loopCB?: Function, anchorPos?: Function | [x, y] | _BaseObj, activationMargin?: number | boolean): AudioDisplay;
    get source(): string | {
        FILE_PATH: string;
        DYNAMIC: string;
        MICROPHONE: string;
        SCREEN_AUDIO: string;
        VIDEO: {
            new (): HTMLVideoElement;
            prototype: HTMLVideoElement;
        };
        AUDIO: {
            new (): HTMLAudioElement;
            prototype: HTMLAudioElement;
        };
    };
    set binCB(_binCB: Function);
    get binCB(): Function;
    set sampleCount(_sampleCount: number);
    get sampleCount(): number;
    set disableAudio(_disableAudio: boolean);
    get disableAudio(): boolean;
    set offsetPourcent(_offsetPourcent: number);
    get offsetPourcent(): number;
    set errorCB(_errorCB: Function);
    get errorCB(): Function;
    get audioCtx(): AudioContext;
    get audioAnalyser(): AnalyserNode;
    get gainNode(): GainNode;
    get biquadFilterNode(): BiquadFilterNode;
    get convolverNode(): ConvolverNode;
    get waveShaperNode(): WaveShaperNode;
    get dynamicsCompressorNode(): DynamicsCompressorNode;
    get pannerNode(): PannerNode;
    get delayNode(): DelayNode;
    get data(): any;
    get fft(): any;
    get bufferLength(): any;
    get transformableRaw(): number;
    set transformable(transformable: boolean);
    get transformable(): boolean;
    get video(): string | {
        FILE_PATH: string;
        DYNAMIC: string;
        MICROPHONE: string;
        SCREEN_AUDIO: string;
        VIDEO: {
            new (): HTMLVideoElement;
            prototype: HTMLVideoElement;
        };
        AUDIO: {
            new (): HTMLAudioElement;
            prototype: HTMLAudioElement;
        };
    };
    get image(): string | {
        FILE_PATH: string;
        DYNAMIC: string;
        MICROPHONE: string;
        SCREEN_AUDIO: string;
        VIDEO: {
            new (): HTMLVideoElement;
            prototype: HTMLVideoElement;
        };
        AUDIO: {
            new (): HTMLAudioElement;
            prototype: HTMLAudioElement;
        };
    };
    set paused(paused: any);
    get paused(): any;
    set isPaused(isPaused: any);
    get isPaused(): any;
    set playbackRate(playbackRate: any);
    get playbackRate(): any;
    set speed(speed: any);
    get speed(): any;
    set currentTime(currentTime: any);
    get currentTime(): any;
    set loop(loop: any);
    get loop(): any;
    set isLooping(isLooping: any);
    get isLooping(): any;
    set rotation(rotation: any);
    set scale(scale: any);
    #private;
}
export class ImageDisplay extends _BaseObj {
    [x: number]: string | (() => number);
    static SUPPORTED_IMAGE_FORMATS: string[];
    static SUPPORTED_VIDEO_FORMATS: string[];
    static DEFAULT_WIDTH: number;
    static DEFAULT_HEIGHT: number;
    static SOURCE_TYPES: {
        FILE_PATH: string;
        DYNAMIC: string;
        CAMERA: string;
        CAPTURE: string;
        IMAGE: {
            new (): HTMLImageElement;
            prototype: HTMLImageElement;
        };
        SVG: {
            new (): SVGImageElement;
            prototype: SVGImageElement;
        };
        BITMAP_PROMISE: any;
        BITMAP: {
            new (): ImageBitmap;
            prototype: ImageBitmap;
        };
        VIDEO: {
            new (): HTMLVideoElement;
            prototype: HTMLVideoElement;
        };
        CANVAS: {
            new (): HTMLCanvasElement;
            prototype: HTMLCanvasElement;
        };
        OFFSCREEN_CANVAS: {
            new (width: number, height: number): OffscreenCanvas;
            prototype: OffscreenCanvas;
        };
    };
    static DYNAMIC_SOURCE_TYPES: {
        VIDEO: {
            new (): HTMLVideoElement;
            prototype: HTMLVideoElement;
        };
        CANVAS: {
            new (): HTMLCanvasElement;
            prototype: HTMLCanvasElement;
        };
        OFFSCREEN_CANVAS: {
            new (width: number, height: number): OffscreenCanvas;
            prototype: OffscreenCanvas;
        };
    };
    static RESOLUTIONS: {
        SD: number[];
        HD: number[];
        FULL_HD: number[];
        "4K": number[];
        FOURK: number[];
        MAX: number[];
    };
    static CAMERA_FACING_MODES: {
        USER: string;
        ENVIRONMENT: string;
    };
    static DEFAULT_FACING_MODE: string;
    static DEFAULT_CAMERA_RESOLUTION: number[];
    static DEFAULT_CAMERA_FRAME_RATE: number;
    static DEFAULT_CAMERA_SETTINGS: {
        type: string;
        settings: {
            width: {
                ideal: resolutionX;
            };
            height: {
                ideal: resolutionY;
            };
            facingMode: string | {
                USER: string;
                ENVIRONMENT: string;
            };
            frameRate: number;
        };
    };
    static DEFAULT_CAMERAS: {
        CAMERA_SD: {
            type: string;
            settings: {
                width: {
                    ideal: resolutionX;
                };
                height: {
                    ideal: resolutionY;
                };
                facingMode: string | {
                    USER: string;
                    ENVIRONMENT: string;
                };
                frameRate: number;
            };
        };
        CAMERA_HD: {
            type: string;
            settings: {
                width: {
                    ideal: resolutionX;
                };
                height: {
                    ideal: resolutionY;
                };
                facingMode: string | {
                    USER: string;
                    ENVIRONMENT: string;
                };
                frameRate: number;
            };
        };
        CAMERA_FULL_HD: {
            type: string;
            settings: {
                width: {
                    ideal: resolutionX;
                };
                height: {
                    ideal: resolutionY;
                };
                facingMode: string | {
                    USER: string;
                    ENVIRONMENT: string;
                };
                frameRate: number;
            };
        };
        CAMERA_4K: {
            type: string;
            settings: {
                width: {
                    ideal: resolutionX;
                };
                height: {
                    ideal: resolutionY;
                };
                facingMode: string | {
                    USER: string;
                    ENVIRONMENT: string;
                };
                frameRate: number;
            };
        };
        CAMERA: {
            type: string;
            settings: {
                width: {
                    ideal: resolutionX;
                };
                height: {
                    ideal: resolutionY;
                };
                facingMode: string | {
                    USER: string;
                    ENVIRONMENT: string;
                };
                frameRate: number;
            };
        };
    };
    static CAPTURE_MEDIA_SOURCES: {
        SCREEN: string;
        WINDOW: string;
        TAB: string;
    };
    static CAPTURE_CURSOR: {
        ALWAYS: string;
        MOTION: string;
        NONE: string;
    };
    static DEFAULT_CAPTURE_RESOLUTION: number[];
    static DEFAULT_CAPTURE_MEDIA_SOURCE: string;
    static DEFAULT_CAPTURE_FRAME_RATE: number;
    static DEFAULT_CAPTURE_CURSOR: string;
    static DEFAULT_CAPTURE_SETTINGS: {
        type: string;
        settings: {
            mediaSource: string | {
                SCREEN: string;
                WINDOW: string;
                TAB: string;
            };
            frameRate: number;
            cursor: string | {
                ALWAYS: string;
                MOTION: string;
                NONE: string;
            };
            width: {
                ideal: resolutionX;
            };
            height: {
                ideal: resolutionY;
            };
        };
    };
    static DEFAULT_CAPTURES: {
        CAPTURE_SD: {
            type: string;
            settings: {
                mediaSource: string | {
                    SCREEN: string;
                    WINDOW: string;
                    TAB: string;
                };
                frameRate: number;
                cursor: string | {
                    ALWAYS: string;
                    MOTION: string;
                    NONE: string;
                };
                width: {
                    ideal: resolutionX;
                };
                height: {
                    ideal: resolutionY;
                };
            };
        };
        CAPTURE_HD: {
            type: string;
            settings: {
                width: {
                    ideal: resolutionX;
                };
                height: {
                    ideal: resolutionY;
                };
                facingMode: string | {
                    USER: string;
                    ENVIRONMENT: string;
                };
                frameRate: number;
            };
        };
        CAPTURE_FULL_HD: {
            type: string;
            settings: {
                width: {
                    ideal: resolutionX;
                };
                height: {
                    ideal: resolutionY;
                };
                facingMode: string | {
                    USER: string;
                    ENVIRONMENT: string;
                };
                frameRate: number;
            };
        };
        CAPTURE_4k: {
            type: string;
            settings: {
                width: {
                    ideal: resolutionX;
                };
                height: {
                    ideal: resolutionY;
                };
                facingMode: string | {
                    USER: string;
                    ENVIRONMENT: string;
                };
                frameRate: number;
            };
        };
        CAPTURE: {
            type: string;
            settings: {
                mediaSource: string | {
                    SCREEN: string;
                    WINDOW: string;
                    TAB: string;
                };
                frameRate: number;
                cursor: string | {
                    ALWAYS: string;
                    MOTION: string;
                    NONE: string;
                };
                width: {
                    ideal: resolutionX;
                };
                height: {
                    ideal: resolutionY;
                };
            };
        };
    };
    static ERROR_TYPES: {
        NO_PERMISSION: number;
        DEVICE_IN_USE: number;
        SOURCE_DISCONNECTED: number;
        FILE_NOT_FOUND: number;
        NOT_AVAILABLE: number;
        NOT_SUPPORTED: number;
    };
    static IS_CAMERA_SUPPORTED: () => boolean;
    static IS_SCREEN_RECORD_SUPPORTED: () => boolean;
    static DEFAULT_MEDIA_ERROR_CALLBACK: (errorCode: any, media: any) => void;
    /**
     * Initializes a ImageDisplay data source
     * @param {ImageDisplay.SOURCE_TYPES} dataSrc: the source of the media
     * @param {Function?} loadCallback: a function called upon source load (mediaElement, size)=>
     * @param {Function?} errorCB: a function called if there is an error with the source (errorType, dataSrc, e?)=>
     */
    static initializeDataSource(dataSrc: {
        FILE_PATH: string;
        DYNAMIC: string;
        CAMERA: string;
        CAPTURE: string;
        IMAGE: {
            new (): HTMLImageElement;
            prototype: HTMLImageElement;
        };
        SVG: {
            new (): SVGImageElement;
            prototype: SVGImageElement;
        };
        BITMAP_PROMISE: any;
        BITMAP: {
            new (): ImageBitmap;
            prototype: ImageBitmap;
        };
        VIDEO: {
            new (): HTMLVideoElement;
            prototype: HTMLVideoElement;
        };
        CANVAS: {
            new (): HTMLCanvasElement;
            prototype: HTMLCanvasElement;
        };
        OFFSCREEN_CANVAS: {
            new (width: number, height: number): OffscreenCanvas;
            prototype: OffscreenCanvas;
        };
    }, loadCallback: Function | null, errorCB: Function | null): void;
    static #initData(dataSource: any, loadCallback: any, width?: any, height?: any): void;
    static #initVideoDataSource(dataSource: any, loadCallback: any, errorCB: any): void;
    static #initMediaStream(stream: any, loadCallback: any, errorCB: any): void;
    static #initCameraDataSource(settings: boolean, loadCallback: any, errorCB: any): void;
    static #initCaptureDataSource(settings: boolean, loadCallback: any, errorCB: any): void;
    /**
     * Create a usable image source
     * @param {String} path: the source path
     * @param {Function?} errorCB: function called upon any error loading the media
     * @param {Boolean?} forceLoad: whether to force the reloading of the image if the image is being reused
     * @returns an HTML image element
     */
    static loadImage(src: any, errorCB?: Function | null, forceLoad?: boolean | null): HTMLImageElement;
    /**
     * Returns a usable video source
     * @param {String | File} src: the source of the video, either a path or a File
     * @param {Boolean?} looping: whether the video loops
     * @param {Boolean?} autoPlay: whether the video autoplays
     * @returns a HTML video element
     */
    static loadVideo(src: string | File, looping?: boolean | null, autoPlay?: boolean | null): HTMLVideoElement;
    /**
     * Returns a usable camera capture source
     * @param {[resolutionX, resolutionY]?} resolution: the camera resolution
     * @param {ImageDisplay.CAMERA_FACING_MODES?} facingMode: which camera to use
     * @param {Number?} frameRate: how many times the camera feed updates per seconds
     * @returns an object containing camera settings, usable as a source
     */
    static loadCamera(resolution?: [resolutionX, resolutionY] | null, facingMode?: {
        USER: string;
        ENVIRONMENT: string;
    } | null, frameRate?: number | null): {
        type: string;
        settings: {
            width: {
                ideal: resolutionX;
            };
            height: {
                ideal: resolutionY;
            };
            facingMode: string | {
                USER: string;
                ENVIRONMENT: string;
            };
            frameRate: number;
        };
    };
    /**
     * Returns a usable screen capture source
     * @param {[resolutionX, resolutionY]?} resolution: the screen capture resolution
     * @param {ImageDisplay.CAPTURE_CURSOR?} cursor: how the cursor is captured
     * @param {Number?} frameRate: how many times the screen capture feed updates per seconds
     * @param {ImageDisplay.CAPTURE_MEDIA_SOURCES?} mediaSource: the default screen source to capture
     * @returns an object containing screen capture settings, usable as a source
     */
    static loadCapture(resolution?: [resolutionX, resolutionY] | null, cursor?: {
        ALWAYS: string;
        MOTION: string;
        NONE: string;
    } | null, frameRate?: number | null, mediaSource?: {
        SCREEN: string;
        WINDOW: string;
        TAB: string;
    } | null): {
        type: string;
        settings: {
            mediaSource: string | {
                SCREEN: string;
                WINDOW: string;
                TAB: string;
            };
            frameRate: number;
            cursor: string | {
                ALWAYS: string;
                MOTION: string;
                NONE: string;
            };
            width: {
                ideal: resolutionX;
            };
            height: {
                ideal: resolutionY;
            };
        };
    };
    /**
     * Returns the name of the errors
     * @param {ImageDisplay.ERROR_TYPES} errorCode: The error code contained in ERROR_TYPES
     * @returns the name of the error based on the error code
     */
    static getErrorFromCode(errorCode: {
        NO_PERMISSION: number;
        DEVICE_IN_USE: number;
        SOURCE_DISCONNECTED: number;
        FILE_NOT_FOUND: number;
        NOT_AVAILABLE: number;
        NOT_SUPPORTED: number;
    }): any;
    /**
     * Plays the provided video source
     * @param {HTMLAudioElement | HTMLVideoElement} source: a video source
     * @param {Function?} errorCB: a function called if there is an error with the source (errorType, dataSrc, e?)=>
     */
    static playMedia(source: HTMLAudioElement | HTMLVideoElement, errorCB: Function | null): void;
    /**
     * Returns the natural size of the source
     * @param {HTMLElement} source: a usable source
     * @returns the size
     */
    static getNaturalSize(source: HTMLElement): any[];
    /**
     * Returns whether the provided file type is supported
     * @param {String | File} file: the file or filename
     * @returns Whether the file is supported or not
     */
    static isFormatSupported(file: string | File): boolean;
    /**
     * Returns whether the provided image file type is supported
     * @param {String | File} file: the file or filename
     * @returns Whether the image file is supported or not
     */
    static isImageFormatSupported(file: string | File): boolean;
    /**
     * Returns whether the provided video file type is supported
     * @param {String | File} file: the file or filename
     * @returns Whether the video file is supported or not
     */
    static isVideoFormatSupported(file: string | File): boolean;
    /**
     * @returns Returns all the supported file formats in a string usable in a HTML file input
     */
    static getSupportedHTMLAcceptValue(): string;
    /**
     * Displays an image or a video as an object
     * @param {CanvasImageSource} source: a media source, such as an image or a video
     * @param {[x,y]?} pos: the [x,y] pos of the top left of the object
     * @param {[width, height]?} size: the width and height of the display. Either as pixels or as pourcentiles (ex: ["50%", 200])
     * @param {Function?} errorCB: function called upon any error loading the media (errorType, source, e?)=>
     * @param {Function?} setupCB: function called on object's initialization (this, parent)=>{...}
     * @param {Function?} loopCB: function called each frame for this object (this)=>{...}
     * @param {[x,y] | Function | _BaseObj ?} anchorPos: reference point from which the object's pos will be set. Either a pos array, a callback (this, parent)=>{return [x,y] | _baseObj} or a _BaseObj inheritor
     * @param {Number | Boolean ?} activationMargin: the pixel margin amount from where the object remains active when outside the canvas visual bounds. If "true", the object will always remain active.
     */
    constructor(source: CanvasImageSource, pos: [x, y] | null, size: [width, height] | null, errorCB: Function | null, setupCB: Function | null, loopCB: Function | null, anchorPos: [x, y] | Function | (_BaseObj | null), activationMargin: number | (boolean | null));
    _source: CanvasImageSource;
    _size: [] | [width, height];
    _errorCB: Function;
    _sourceCroppingPositions: any;
    set size(size: [] | [width, height]);
    get size(): [] | [width, height];
    draw(render: any, time: any, deltaTime: any): void;
    /**
     * Plays the source, if it's a video
     */
    playVideo(): void;
    /**
     * Pauses the source, if it's a video
     */
    pauseVideo(): void;
    /**
     * @returns a separate copy of this ImageDisplay instance (only if initialized)
     */
    duplicate(source?: CanvasImageSource, pos?: any[], size?: any[], setupCB?: Function, loopCB?: Function, anchorPos?: Function | [x, y] | _BaseObj, activationMargin?: number | boolean): ImageDisplay;
    /**
     * Returns whether the provided pos is inside the display
     * @param {[x,y]} pos: the pos to check
     * @param {Number | [paddingTop, paddingRight?, paddingBottom?, paddingLeft?] ?} padding: the padding added to the validity area
     * @param {Number?} rotation: the rotation in degrees of the area
     * @param {[scaleX, scaleY]?} scale: the scale of the area
     * @returns whether the provided pos is inside the display
     */
    isWithin(pos: [x, y], padding: number | ([paddingTop, paddingRight?, paddingBottom?, paddingLeft?] | null), rotation: number | null, scale: [scaleX, scaleY] | null): boolean;
    /**
     * Returns whether the provided pos is inside the display very accurately
     * @param {[x,y]} pos: the pos to check
     * @param {Number | [paddingTop, paddingRight?, paddingBottom?, paddingLeft?] ?} padding: the padding added to the validity area
     * @param {Number?} rotation: the rotation in degrees of the area
     * @param {[scaleX, scaleY]?} scale: the scale of the area
     * @returns whether the provided pos is inside the display
     */
    isWithinAccurate(pos: [x, y], padding: number | ([paddingTop, paddingRight?, paddingBottom?, paddingLeft?] | null), rotation: number | null, scale: [scaleX, scaleY] | null): any;
    /**
     * Returns the accurate area containing all of the display
     * @param {Number | [paddingTop, paddingRight?, paddingBottom?, paddingLeft?] ?} padding: the padding added to the validity area
     * @param {Number?} rotation: the rotation in degrees of the area
     * @param {[scaleX, scaleY]?} scale: the scale of the area
     * @returns a Path2D
     */
    getBoundsAccurate(padding: number | ([paddingTop, paddingRight?, paddingBottom?, paddingLeft?] | null), rotation?: number | null, scale?: [scaleX, scaleY] | null): Path2D;
    /**
     * @returns the center pos of the image
     */
    getCenter(): number[];
    /**
     * Returns the minimal rectangular area containing all of the display
     * @param {Number | [paddingTop, paddingRight?, paddingBottom?, paddingLeft?] ?} padding: the padding added to the validity area
     * @param {Number?} rotation: the rotation in degrees of the area
     * @param {[scaleX, scaleY]?} scale: the scale of the area
     * @returns the area positions [[x1,y1], [x2,y2]]
     */
    getBounds(padding: number | ([paddingTop, paddingRight?, paddingBottom?, paddingLeft?] | null), rotation?: number | null, scale?: [scaleX, scaleY] | null): any[][];
    /**
     * Resizes the image's width keeping the original aspect ratio
     * @param {Number | String} width: The width in px, or the width in % based on the natural size
     */
    aspectRatioWidthResize(width: number | string): void;
    /**
     * Resizes the image's height keeping the original aspect ratio
     * @param {Number | String} height: The height in px, or the height in % based on the natural size
     */
    aspectRatioHeightResize(height: number | string): void;
    get ctx(): any;
    get size_(): any[];
    set width(width: any);
    get width(): any;
    set height(height: any);
    get height(): any;
    get trueSize(): number[];
    set naturalSize(naturalSize: any);
    get naturalSize(): any;
    get centerX(): number;
    get centerY(): number;
    get centerPos(): number[];
    set source(source: CanvasImageSource);
    get source(): CanvasImageSource;
    set sourceCroppingPositions(sourceCroppingPositions: any);
    get sourceCroppingPositions(): any;
    set errorCB(errorCB: Function);
    get errorCB(): Function;
    set paused(paused: any);
    get paused(): any;
    set playbackRate(playbackRate: any);
    get playbackRate(): any;
    set speed(speed: any);
    get speed(): any;
    set currentTime(currentTime: any);
    get currentTime(): any;
    set isLooping(isLooping: any);
    get isLooping(): any;
    get isDynamic(): boolean;
    loop: any;
    #private;
}
export class TextDisplay extends _BaseObj {
    [x: number]: string | (() => {});
    static MEASUREMENT_CTX: OffscreenCanvasRenderingContext2D;
    static DEFAULT_LINE_HEIGHT_PADDING: number;
    /**
     * Returns the width and height of the given text, according to the textStyles, including potential scaling
     * @param {TextStyles} textStyles: the text profile to use
     * @param {String} text: the text to calculate
     * @param {Number?} lineHeightPadding: the line height padding
     * @param {Number?} maxWidth: maximal width of the displayed text, in pixels
     * @param {[scaleX, scaleY]?} scale: the horizontal and vertical scale factors
     * @returns
     */
    static getSize(textStyles: TextStyles, text: string, lineHeightPadding: number | null, maxWidth: number | null, scale?: [scaleX, scaleY] | null): number[];
    /**
     * Loads a custom font by file or url. Direct font files are loaded using the FontFace api, while non direct font source are loaded via an HTML <link> element.
     * @param {String | ArrayBuffer | TypedArray} src: The source of the font, either a file or a url
     * @param {String?} fontFaceName: The font family name of the custom font (Only applicable for FontFace load)
     * @param {Object?} fontFaceDescriptors: Object defining the font properties (Only applicable for FontFace load)
     * @param {Function?} readyCB: Callback called upon custom font loading completed. (fontFace, fontFamily)=>{...} (Only applicable for FontFace load)
     * @param {Function?} errorCB: Callback called upon custom font loading errors. (error)=>{...} (Only applicable for FontFace load)
     * @returns The loaded font via a FontFace instance or a <link> element
     */
    static loadCustomFont(src: string | ArrayBuffer | TypedArray, fontFaceName?: string | null, fontFaceDescriptors?: any | null, readyCB?: Function | null, errorCB?: Function | null): void;
    /**
     * Displays text as an object
     * @param {String} text: the text to display
     * @param {Color | [r,g,b,a] ?} color: the color of the object
     * @param {TextStyles | Function} textStyles: the text styles profile to use. Either a TextStyles instance or a function (render, this)=>{return TextStyles()}
     * @param {Render.DRAW_METHODS?} drawMethod: the draw method
     * @param {Number?} maxWidth: maximal width of the displayed text, in pixels
     * @param {Function?} setupCB: function called on object's initialization (this, parent)=>{...}
     * @param {Function?} loopCB: function called each frame for this object (this)=>{...}
     * @param {[x,y] | Function | _BaseObj ?} anchorPos: reference point from which the object's pos will be set. Either a pos array, a callback (this, parent)=>{return [x,y] | _baseObj} or a _BaseObj inheritor
     * @param {Number | Boolean ?} activationMargin: the pixel margin amount from where the object remains active when outside the canvas visual bounds. If "true", the object will always remain active.
     */
    constructor(text: string, pos: any, color: Color | ([r, g, b, a] | null), textStyles: TextStyles | Function, drawMethod: {
        FILL: string;
        STROKE: string;
    } | null, maxWidth: number | null, setupCB: Function | null, loopCB: Function | null, anchorPos: [x, y] | Function | (_BaseObj | null), activationMargin: number | (boolean | null));
    _text: string;
    _textStyles: Function | TextStyles;
    _drawMethod: any;
    _maxWidth: number;
    _lineHeight: any;
    _size: number[];
    draw(render: any, time: any, deltaTime: any): void;
    /**
     * Returns the width and height of the text, according to the textStyles, excluding the scale or rotation
     * @param {TextStyles?} textStyles: the text profile to use
     * @param {String?} text: the text to calculate
     * @param {Number?} lineHeightPadding: the line height padding
     * @returns the size
     */
    getSize(textStyles: TextStyles | null, text: string | null, lineHeightPadding: number | null): number[];
    /**
     * @returns the current text value
     */
    getTextValue(): any;
    /**
     * @returns a separate copy of this textDisplay instance (only if initialized)
     */
    duplicate(text?: string, pos?: any[], color?: string | Function | [r, g, b, a] | Color, textStyles?: Function | TextStyles, drawMethod?: any, maxWidth?: number, setupCB?: Function, loopCB?: Function, anchorPos?: Function | [x, y] | _BaseObj, activationMargin?: number | boolean): TextDisplay;
    /**
     * Returns whether the provided pos is inside the text display
     * @param {[x,y]} pos: the pos to check
     * @param {Number | [paddingTop, paddingRight?, paddingBottom?, paddingLeft?] ?} padding: the padding added to the validity area
     * @param {Number?} rotation: the rotation in degrees of the area
     * @param {[scaleX, scaleY]?} scale: the scale of the area
     * @returns whether the provided pos is inside the text display
     */
    isWithin(pos: [x, y], padding: number | ([paddingTop, paddingRight?, paddingBottom?, paddingLeft?] | null), rotation: number | null, scale: [scaleX, scaleY] | null): boolean;
    /**
     * Returns whether the provided pos is in the text
     * @param {[x,y]} pos: the pos to check
     * @param {Number?} paddingX: the horizontal padding added to the validity area
     * @param {Number?} rotation: the rotation in degrees of the area
     * @param {[scaleX, scaleY]?} scale: the scale of the area
     * @returns whether the provided pos is inside the display
     */
    isWithinAccurate(pos: [x, y], paddingX: number | null, rotation: number | null, scale: [scaleX, scaleY] | null): any;
    /**
     * Returns the accurate area containing all of the text
     * @param {Number?} paddingX: the horizontal padding added to the validity area
     * @param {Number?} rotation: the rotation in degrees of the area
     * @param {[scaleX, scaleY]?} scale: the scale of the area
     * @param {Number?} lineHeightPadding: the line height padding to add
     * @param {Number?} lineWidthOffset: the amount in pixels to substract from the line width
     * @returns a Path2D
     */
    getBoundsAccurate(paddingX: number | null, rotation?: number | null, scale?: [scaleX, scaleY] | null, lineHeightPadding?: number | null, lineWidthOffset?: number | null): Path2D;
    /**
     * @returns the center of the text
     */
    getCenter(): number[];
    /**
     * Returns the minimal rectangular area containing the text according to default text placements/parameters
    * @param {Number | [paddingTop, paddingRight?, paddingBottom?, paddingLeft?] ?} padding: the padding added to the validity area
     * @param {Number?} rotation: the rotation in degrees of the area
     * @param {[scaleX, scaleY]?} scale: the scale of the area
     * @returns the area positions [[x1,y1], [x2,y2]]
     */
    getBounds(padding: number | ([paddingTop, paddingRight?, paddingBottom?, paddingLeft?] | null), rotation?: number | null, scale?: [scaleX, scaleY] | null): any[][];
    get ctx(): any;
    get render(): any;
    set text(text: string);
    get text(): string;
    set textStyles(_textStyles: Function | TextStyles);
    get textStyles(): Function | TextStyles;
    set drawMethod(_drawMethod: any);
    get drawMethod(): any;
    set maxWidth(_maxWidth: number);
    get maxWidth(): number;
    get size(): number[];
    set lineHeight(lineHeight: any);
    get lineHeight(): any;
    get trueSize(): number[];
    get lineCount(): any;
    get width(): number;
    get height(): number;
    #private;
}
export class _DynamicColor {
    static PLACEHOLDER: string;
    static PLACEHOLDER_COLOR: string;
    /**
     * Abstract dynamic color class
     * @param {[[x1,y1], [x2,y2]]} positions: the rectangular area defined by two corners
     * @param {Number?} rotation: the rotation in degrees
     */
    constructor(positions: [[x1, y1], [x2, y2]], rotation: number | null);
    _initPositions: [[x1, y1], [x2, y2]];
    _positions: [[x1, y1], [x2, y2]];
    _rotation: number;
    _lastChangeValue: any;
    _value: any;
    get instanceOf(): string;
    set initPositions(initPositions: [[x1, y1], [x2, y2]]);
    get initPositions(): [[x1, y1], [x2, y2]];
    set positions(_positions: [[x1, y1], [x2, y2]]);
    get positions(): [[x1, y1], [x2, y2]];
    set rotation(deg: number);
    get rotation(): number;
    get isDynamic(): boolean;
    get value(): any;
}
export class Pattern extends _DynamicColor {
    [x: number]: string | (() => any);
    static #ID_GIVER: number;
    static #CROPPING_CTX: OffscreenCanvasRenderingContext2D;
    static #MATRIX: DOMMatrixReadOnly;
    static LOADED_PATTERN_SOURCES: any[];
    static REPETITION_MODES: {
        REPEAT: string;
        REPEAT_X: string;
        REPEAT_Y: string;
        NO_REPEAT: string;
    };
    static DEFAULT_REPETITION_MODE: string;
    static DEFAULT_FRAME_RATE: number;
    static SERIALIZATION_SEPARATOR: string;
    static FORCE_UPDATE_LEVELS: {
        DISABLED: any;
        RESPECT_FRAME_RATE: boolean;
        OVERRIDE: number;
    };
    static DEFAULT_FORCE_UPDATE_LEVEL: any;
    /**
     * Create a usable image source
     * @param {String} path: the source path
     * @param {Function?} errorCB: function called upon any error loading the media
     * @param {Boolean?} forceLoad: whether to force the reloading of the image if the image is being reused
     * @returns an HTML image element
     */
    static loadImage(path: string, errorCB?: Function | null, forceLoad?: boolean | null): HTMLImageElement;
    /**
     * Returns a usable video source
     * @param {String | File} src: the source of the video, either a path or a File
     * @param {Boolean?} looping: whether the video loops
     * @param {Boolean?} autoPlay: whether the video autoplays
     * @returns a HTML video element
     */
    static loadVideo(src: string | File, looping?: boolean | null, autoPlay?: boolean | null): HTMLVideoElement;
    /**
     * Returns a usable camera capture source
     * @param {[resolutionX, resolutionY]?} resolution: the camera resolution
     * @param {ImageDisplay.CAMERA_FACING_MODES?} facingMode: which camera to use
     * @param {Number?} frameRate: how many times the camera feed updates per seconds
     * @returns an object containing camera settings, usable as a source
     */
    static loadCamera(resolution?: [resolutionX, resolutionY] | null, facingMode?: {
        USER: string;
        ENVIRONMENT: string;
    } | null, frameRate?: number | null): {
        type: string;
        settings: {
            width: {
                ideal: resolutionX;
            };
            height: {
                ideal: resolutionY;
            };
            facingMode: string | {
                USER: string;
                ENVIRONMENT: string;
            };
            frameRate: number;
        };
    };
    /**
     * Returns a usable screen capture source
     * @param {[resolutionX, resolutionY]?} resolution: the screen capture resolution
     * @param {ImageDisplay.CAPTURE_CURSOR?} cursor: how the cursor is captured
     * @param {Number?} frameRate: how many times the screen capture feed updates per seconds
     * @param {ImageDisplay.CAPTURE_MEDIA_SOURCES?} mediaSource: the default screen source to capture
     * @returns an object containing screen capture settings, usable as a source
     */
    static loadCapture(resolution?: [resolutionX, resolutionY] | null, cursor?: {
        ALWAYS: string;
        MOTION: string;
        NONE: string;
    } | null, frameRate?: number | null, mediaSource?: {
        SCREEN: string;
        WINDOW: string;
        TAB: string;
    } | null): {
        type: string;
        settings: {
            mediaSource: string | {
                SCREEN: string;
                WINDOW: string;
                TAB: string;
            };
            frameRate: number;
            cursor: string | {
                ALWAYS: string;
                MOTION: string;
                NONE: string;
            };
            width: {
                ideal: resolutionX;
            };
            height: {
                ideal: resolutionY;
            };
        };
    };
    /**
     * Allows the creation of custom gradients
     * @param {Render} render: a render instance
     * @param {CanvasImageSource} source: a media source, such as an image or a video
     * @param {[[x1,y1], [x2,y2]]} positions: the rectangular area defined by two corners containing the pattern
     * @param {[[startX, startY], [endX, endY]]?} sourceCroppingPositions: source cropping positions delimiting a rectangle, cropping everything outside of it. (Defaults to no cropping)
     * @param {Boolean?} keepAspectRatio: Whether the media should resize by keeping the original aspect ratio
     * @param {Pattern.FORCE_UPDATE_LEVELS?} forcedUpdates: whether/how the pattern forces updates
     * @param {Number?} rotation: the rotation in degrees
     * @param {Function?} errorCB: function called upon any error loading the media. (errorType, source, e?)=>
     * @param {Function?} readyCB: function called when the media is loaded
     * @param {Number?} frameRate: how many times per seconds should the media update (mostly used for videos)
     * @param {Pattern.REPETITION_MODES} repeatMode: the repetition mode used for displaying the media at a larger size than what it's covering
     */
    constructor(render: Render, source: CanvasImageSource, positions: [[x1, y1], [x2, y2]], sourceCroppingPositions: [[startX, startY], [endX, endY]] | null, keepAspectRatio: boolean | null, forcedUpdates: {
        DISABLED: any;
        RESPECT_FRAME_RATE: boolean;
        OVERRIDE: number;
    } | null, rotation: number | null, errorCB: Function | null, readyCB: Function | null, frameRate: number | null, repeatMode: {
        REPEAT: string;
        REPEAT_X: string;
        REPEAT_Y: string;
        NO_REPEAT: string;
    });
    _id: number;
    _render: Render;
    _source: CanvasImageSource;
    _sourceCroppingPositions: [[startX, startY], [endX, endY]];
    _keepAspectRatio: boolean;
    _forcedUpdates: any;
    _frameRate: number;
    _errorCB: Function;
    _readyCB: Function;
    _repeatMode: string | {
        REPEAT: string;
        REPEAT_X: string;
        REPEAT_Y: string;
        NO_REPEAT: string;
    };
    set sourceCroppingPositions(sourceCroppingPositions: [[startX, startY], [endX, endY]]);
    get sourceCroppingPositions(): [[startX, startY], [endX, endY]];
    /**
     * Given an canvas object, returns automatic positions values for the minimal area containing all of the provided object
     * @param {Shape|Dot|TextDisplay} obj: Inheritor of _Obj
     * @returns the new calculated positions or the current value of this._positions if the parameter 'obj' isn't an instance of a canvas object
     */
    getAutomaticPositions(obj?: Shape | Dot | TextDisplay): any;
    /**
     * Tries to update the curent pattern. Succeeds if forced, or if the last update's elapsed time corresponds to the frame rate
     * @param {Pattern.FORCE_UPDATE_LEVELS} forceLevel: the force level used
     */
    update(forceLevel?: {
        DISABLED: any;
        RESPECT_FRAME_RATE: boolean;
        OVERRIDE: number;
    }): void;
    /**
     * Plays the source, if it's a video
     */
    playVideo(): void;
    /**
     * Pauses the source, if it's a video
     */
    pauseVideo(): void;
    /**
     * Returns a separate copy of this Pattern instance
     */
    duplicate(positions?: [[x1, y1], [x2, y2]], render?: Render, source?: CanvasImageSource, sourceCroppingPositions?: [[startX, startY], [endX, endY]], keepAspectRatio?: boolean, forcedUpdates?: any, rotation?: number, errorCB?: Function, frameRate?: number, repeatMode?: string | {
        REPEAT: string;
        REPEAT_X: string;
        REPEAT_Y: string;
        NO_REPEAT: string;
    }): Pattern;
    get id(): number;
    get render(): Render;
    set source(source: CanvasImageSource);
    get source(): CanvasImageSource;
    set keepAspectRatio(_keepAspectRatio: boolean);
    get keepAspectRatio(): boolean;
    set forcedUpdates(_forcedUpdates: any);
    get forcedUpdates(): any;
    set repeatMode(_repeatMode: string | {
        REPEAT: string;
        REPEAT_X: string;
        REPEAT_Y: string;
        NO_REPEAT: string;
    });
    get repeatMode(): string | {
        REPEAT: string;
        REPEAT_X: string;
        REPEAT_Y: string;
        NO_REPEAT: string;
    };
    set frameRate(frameRate: number);
    get frameRate(): number;
    get naturalSize(): any[];
    get video(): CanvasImageSource;
    get image(): CanvasImageSource;
    set paused(paused: any);
    get paused(): any;
    set isPaused(isPaused: any);
    get isPaused(): any;
    set playbackRate(playbackRate: any);
    get playbackRate(): any;
    set speed(speed: any);
    get speed(): any;
    set currentTime(currentTime: any);
    get currentTime(): any;
    set loop(loop: any);
    get loop(): any;
    set isLooping(isLooping: any);
    get isLooping(): any;
    set rotation(deg: any);
    #private;
}
export class _Obj extends _BaseObj {
    static DEFAULT_RADIUS: number;
    static RADIUS_PRECISION: number;
    /**
     * Abstract canvas obj class, with radius
     * @param {[x,y]?} pos: the [x,y] pos of the object
     * @param {Number?} radius: the radius of the object
     * @param {Color | [r,g,b,a] ?} color: the color of the object
     * @param {Function?} setupCB: function called on object's initialization (this, parent)=>{...}
     * @param {Function?} loopCB: function called each frame for this object (this)=>{...}
     * @param {[x,y] | Function | _BaseObj ?} anchorPos: reference point from which the object's pos will be set. Either a pos array, a callback (this, parent)=>{return [x,y] | _baseObj} or a _BaseObj inheritor
     * @param {Number | Boolean ?} activationMargin: the pixel margin amount from where the object remains active when outside the canvas visual bounds. If "true", the object will always remain active.
     */
    constructor(pos: [x, y] | null, radius: number | null, color: Color | ([r, g, b, a] | null), setupCB: Function | null, loopCB: Function | null, anchorPos: [x, y] | Function | (_BaseObj | null), activationMargin: number | (boolean | null));
    _initRadius: number;
    _radius: number;
    /**
     * @returns the value of the inital radius declaration
     */
    getInitRadius(): any;
    /**
     * Returns the minimal rectangular area defined by the provided positions
     * @param {[[x1,y1], [x2,y2]]} positions: the two pos represencting the recangular area
     * @param {Number | [paddingTop, paddingRight?, paddingBottom?, paddingLeft?] ?} padding: the padding applied to the results
     * @param {Number?} rotation: the rotation in degrees of the area
     * @param {[scaleX, scaleY]?} scale: the scale of the area
     * @param {[x,y]?} centerPos: the center pos used for rotation/scale
     * @returns the area positions [[x1,y1], [x2,y2]]
     */
    getBounds(positions: [[x1, y1], [x2, y2]], padding: number | ([paddingTop, paddingRight?, paddingBottom?, paddingLeft?] | null), rotation: number | null, scale: [scaleX, scaleY] | null, centerPos: [x, y] | null): any[][];
    set radius(radius: number);
    get radius(): number;
    set initRadius(initRadius: number);
    get initRadius(): number;
}
export class Shape extends _Obj {
    [x: number]: string | (() => {});
    static DEFAULT_LIMIT: number;
    static DEFAULT_RATIO_POS: number[];
    /**
     * The generate() function allows the generation of custom formations of dot
     * @param {Function} yFn: a function providing a Y value depanding on a given X value. (x)=>{... return y}
     * @param {Number} startOffset: pos array representing the starting position offset
     * @param {Number} length: the width in pixels of the generation result
     * @param {Number} gapX: the gap in pixel skipped between each generation
     * @param {[Number, Number]} yModifier: a range allowing random Y offsets
     * @param {Function?} generationCallback: custom callback called on each generation (dot, lastDot?)=>
     * @returns The generated Dots
     */
    static generate(yFn: Function, startOffset: number, length: number, gapX: number, yModifier: [number, number], generationCallback: Function | null): Dot[];
    /**
     * Contains and controls a group of dots
     * @param {[x,y]?} pos: the pos of the object
     * @param {Dot | Dot[] ?} dots: array containing current dots in the shape
     * @param {Number?} radius: the radius of the dots
     * @param {Color | String | [r,g,b,a]?} color: the color of the dots
     * @param {Number?} limit: the delimiter radius within which the drawEffectCB can take effect
     * @param {Function?} drawEffectCB: a function called every frame for each dot of the shape, used to create effects. (render, dot, ratio, setupResults, mouse, distance, parent, isActive, rawRatio)=>
     * @param {Function?} ratioPosCB: a function that returns a ratio pos target for calculating the dots ratio attribute. (this, dots)=>{return [x,y]}
     * @param {Function?} setupCB: function called on object's initialization (this, parent)=>{...}
     * @param {Function?} loopCB: function called each frame for this object (this)=>{...}
     * @param {[x,y] | Function | _BaseObj ?} anchorPos: reference point from which the object's pos will be set. Either a pos array, a callback (this, parent)=>{return [x,y] | _baseObj} or a _BaseObj inheritor
     * @param {Number | Boolean ?} activationMargin: the pixel margin amount from where the object remains active when outside the canvas visual bounds. If "true", the object will always remain active.
     * @param {Boolean?} fragile: (DEPRECATED) whether the shape resets on document visibility change
     */
    constructor(pos: [x, y] | null, dots: Dot | (Dot[] | null), radius: number | null, color: Color | string | ([r, g, b, a] | null), limit: number | null, drawEffectCB: Function | null, ratioPosCB: Function | null, setupCB: Function | null, loopCB: Function | null, anchorPos: [x, y] | Function | (_BaseObj | null), activationMargin: number | (boolean | null), fragile: boolean | null);
    _limit: number;
    _initDots: Dot | Dot[];
    _dots: any[];
    _ratioPos: number[];
    _drawEffectCB: Function;
    _ratioPosCB: Function;
    _fragile: boolean;
    draw(render: any, time: any, deltaTime: any): void;
    /**
     * Adds one or many dots to the shape
     * @param {Dot | Dot[]} dots: one or many dots to add
     */
    add(dots: Dot | Dot[]): void;
    /**
     * Remove the shape and all its dots, or a single dot if id is specified
     * @param {Dot | Number?} dotId: the dot to delete
     */
    remove(dotId?: Dot | (number | null)): void;
    /**
     * Can be used as a primitive/fast way to create a formation of dots, using text drawing
     * @param {String} str: ex: "oo o o \n ooo \n ooo"
     * @param {pos[x,y]} topLeftPos: starting pos of the formation
     * @param {[gapX, gapY]} gaps: the x and y distance between each dot
     * @param {Character} dotChar: the character used in the creation string other than the spaces
     * @returns the created dots formation
     */
    createFromString(str: string, topLeftPos?: number[], gaps?: [gapX, gapY], dotChar?: Character): any[];
    /**
     * Updates the radius of all the shape's dots
     * @param {Number?} radius: the new radius
     * @param {Boolean?} onlyReplaceDefaults: if true, only sets the dots' radius if it was not initialy set
     */
    setRadius(radius: number | null, onlyReplaceDefaults: boolean | null): void;
    /**
     * Updates the color of all the shape's dots
     * @param {Color | String | [r,g,b,a] ?} color: the new color
     * @param {Boolean?} onlyReplaceDefaults: if true, only sets the dots' color if it was not initialy set
     */
    setColor(color: Color | string | ([r, g, b, a] | null), onlyReplaceDefaults: boolean | null): void;
    /**
     * Updates the visualEffects of all the shape's dots
     * @param {[filter, compositeOperation, opacity]?} visualEffects: the filter, composite operation and opacity effects to use
     * @param {Boolean?} onlyReplaceDefaults: is true, it only sets the dots' visualEffects if it was not initialy set
     */
    setVisualEffects(visualEffects: [filter, compositeOperation, opacity] | null, onlyReplaceDefaults: boolean | null): void;
    /**
     * Updates the activationMargin of all the shape's dots
     * @param {Number | Boolean ?} activationMargin: the pixel margin amount from where the object remains active when outside the canvas visual bounds. If "true", the object will always remain active.
     * @param {Boolean?} onlyReplaceDefaults: is true, it only sets the dots' activationMargin if it was not initialy set
     */
    setActivationMargin(activationMargin: number | (boolean | null), onlyReplaceDefaults: boolean | null): void;
    /**
     * Rotates the dots by a specified degree increment around a specified center point,clock-wise, from the top
     * @param {Number} deg: the degrees to rotate by
     * @param {[x,y]?} centerPos: the center pos of the rotation
     */
    rotateBy(deg: number, centerPos?: [x, y] | null): void;
    /**
     * Rotates the dots to a specified degree around a specified center point
     * @param {Number} deg: the degrees to rotate to
     * @param {[x,y]?} centerPos: the center pos of the rotation
     */
    rotateAt(deg: number, centerPos?: [x, y] | null): void;
    /**
     * Smoothly rotates the dots to a specified degree around a specified center point
     * @param {Number} deg: the degrees to rotate to
     * @param {Number?} time: the rotate time in miliseconds
     * @param {Function?} easing: the easing function used. (x)=>{return y}
     * @param {[x,y]?} centerPos: the center pos of the rotation
     * @param {Boolean?} isUnique: if true, the animation gets queue in the object's animation backlog.
     * @param {Boolean?} force: if true, terminates the current backlog animation and replaces it with this animation
     * @returns the created Anim instance
     */
    rotateTo(deg: number, time?: number | null, easing?: Function | null, centerPos?: [x, y] | null, isUnique?: boolean | null, force?: boolean | null): Anim;
    /**
     * Scales the dots distances by a specified amount [scaleX, scaleY], from a specified center point
     * @param {[scaleX, scaleY]} scale: the x/y values to scale the distances by
     * @param {[x,y]?} centerPos: the center pos of the scaling
     */
    scaleBy(scale: any, centerPos?: [x, y] | null): void;
    /**
     * Scales the dots distances to a specified amount [scaleX, scaleY] from a specified center point
     * @param {[scaleX, scaleY]} scale: the x/y values to scale the distances to
     * @param {[x,y]?} centerPos: the center pos of the scaling
     */
    scaleAt(scale: [scaleX, scaleY], centerPos?: [x, y] | null): void;
    /**
     * Returns whether the provided pos is inside the minimal rectangular area containing all of the shape's dots
     * @param {[x,y]} pos: the pos to check
     * @param {Number | [paddingTop, paddingRight?, paddingBottom?, paddingLeft?] ?} padding: the padding added to the validity area
     * @returns whether the provided pos is inside the Shape
     */
    isWithin(pos: [x, y], padding: number | ([paddingTop, paddingRight?, paddingBottom?, paddingLeft?] | null)): boolean;
    /**
     * Returns whether the provided pos is inside the area delimited by the dots perimeter
     * @param {[x,y]} pos: the pos to check
     * @returns whether the provided pos is inside the Shape
     */
    isWithinAccurate(pos: [x, y]): any;
    /**
     * @returns the accurate area delimited by the dots perimeter
     */
    getBoundsAccurate(): Path2D;
    /**
     * @returns the center pos of the shape
     */
    getCenter(): number[];
    /**
     * Returns the minimal rectangular area containing all of the shape
     * @param {Number | [paddingTop, paddingRight?, paddingBottom?, paddingLeft?] ?} padding: the padding added to the validity area
     * @param {Number?} rotation: the rotation in degrees of the area
     * @param {[scaleX, scaleY]?} scale: the scale of the area
     * @param {[x,y]} centerPos: the center pos of the scaling
     * @returns the area positions [[x1,y1], [x2,y2]]
     */
    getBounds(padding: number | ([paddingTop, paddingRight?, paddingBottom?, paddingLeft?] | null), rotation: number | null, scale: [scaleX, scaleY] | null, centerPos: [x, y]): any[][];
    /**
     * Empties the shapes of all its dots
     */
    clear(): void;
    /**
     * (DEPRECATED) Rerenders the shape to its original form
     */
    reset(): void;
    /**
     * Enables path caching for all dots of this shape
     */
    enableDotsPathCaching(): void;
    /**
     * Disables path caching for all dots of this shape
     */
    disableDotsPathCaching(): void;
    /**
     * @returns a separate copy of this Shape (only if initialized)
     */
    duplicate(pos?: any[], dots?: any[], radius?: number, color?: string | Function | [r, g, b, a] | Color, limit?: number, drawEffectCB?: Function, ratioPosCB?: Function, setupCB?: Function, loopCB?: Function, anchorPos?: Function | [x, y] | _BaseObj, activationMargin?: number | boolean, fragile?: boolean): Shape;
    get cvs(): any;
    get ctx(): any;
    get render(): any;
    set dots(ratioPos: any[]);
    get dots(): any[];
    set limit(limit: number);
    get limit(): number;
    get initDots(): Dot | Dot[];
    set drawEffectCB(cb: Function);
    get drawEffectCB(): Function;
    set ratioPos(ratioPos: number[]);
    get ratioPos(): number[];
    set ratioPosCB(cb: Function);
    get ratioPosCB(): Function;
    set lastDotsPos(ldp: any);
    get lastDotsPos(): any;
    get dotsPositions(): string;
    get firstDot(): any;
    get secondDot(): any;
    get thirdDot(): any;
    get lastDot(): any;
    get asSource(): any[];
    _lastDotsPos: any;
    #private;
}
export class Gradient extends _DynamicColor {
    [x: number]: string | (() => {});
    static TYPES: {
        LINEAR: string;
        RADIAL: string;
        CONIC: string;
    };
    static DEFAULT_TYPE: string;
    static SERIALIZATION_SEPARATOR: string;
    static SERIALIZATION_COLOR_STOPS_SEPARATOR: string;
    static getCanvasGradient(ctx: any, positions: any, colorStops: any, type: any, rotation: any): any;
    static getCanvasGradientFromString(ctx: any, str: any): any;
    /**
     * Allows the creation of custom gradients
     * @param {CanvasRenderingContext2D} ctx: canvas context to use
     * @param {[[x1,y1], [x2,y2]]} positions: the rectangular area defined by two corners containing the gradient
     * @param {Array[[0..1, Color]]} colorStops: an array containing all colors stop. The 1st index of a color stop is a number between 0 and 1 representing the pourcentile and the 2nd is the color. ex: [0.5, Color]
     * @param {Gradient.TYPES?} type: the type of gradient
     * @param {Number?} rotation: the rotation in degrees
     */
    constructor(ctx: CanvasRenderingContext2D, positions: [[x1, y1], [x2, y2]], colorStops: any, type: {
        LINEAR: string;
        RADIAL: string;
        CONIC: string;
    } | null, rotation: number | null);
    _ctx: any;
    _type: string | {
        LINEAR: string;
        RADIAL: string;
        CONIC: string;
    };
    _colorStops: any;
    /**
     * Given an canvas object, returns automatic positions values for linear, radial or conic gradients
     * @param {_BaseObj} obj: Inheritor of _BaseObj
     * @returns the new calculated positions or the current value of this._positions if the parameter 'obj' isn't an instance of a canvas object
     */
    getAutomaticPositions(obj?: _BaseObj): any[];
    /**
     * Creates and returns the gradient. Updates it if the initPositions is a _BaseObj inheritor
     * @param {Boolean} force: whether to force the update even if the positions haven't changed
     * @returns the gradient or null
     */
    update(force: boolean): any;
    /**
     * @returns a separate copy of the Gradient
     */
    duplicate(positions?: [[x1, y1], [x2, y2]], ctx?: any, colorStops?: any, type?: string | {
        LINEAR: string;
        RADIAL: string;
        CONIC: string;
    }, rotation?: number): Gradient;
    get ctx(): any;
    set type(type: string | {
        LINEAR: string;
        RADIAL: string;
        CONIC: string;
    });
    get type(): string | {
        LINEAR: string;
        RADIAL: string;
        CONIC: string;
    };
    set colorStops(_colorStops: any);
    get colorStops(): any;
    #private;
}
export class FilledShape extends Shape {
    [x: number]: string | (() => number);
    /**
     * Regular shape with a filled area defined by its dots
     * @param {Color | String | [r,g,b,a]?} fillColor: the color of the area's filling
     * @param {Boolean?} dynamicUpdates: whether the shape's filling checks for updates every frame
     * @param {[x,y]?} pos: the pos of the object
     * @param {Dot | Dot[] ?} dots: array containing current dots in the shape
     * @param {Number?} radius: the radius of the dots
     * @param {Color | String | [r,g,b,a]?} color: the color of the dots
     * @param {Number?} limit: the delimiter radius within which the drawEffectCB can take effect
     * @param {Function?} drawEffectCB: a function called every frame for each dot of the shape, used to create effects. (render, dot, ratio, setupResults, mouse, distance, parent, isActive, rawRatio)=>
     * @param {Function?} ratioPosCB: a function that returns a ratio pos target for calculating the dots ratio attribute. (this, dots)=>{return [x,y]}
     * @param {Function?} setupCB: function called on object's initialization (this, parent)=>{...}
     * @param {Function?} loopCB: function called each frame for this object (this)=>{...}
     * @param {[x,y] | Function | _BaseObj ?} anchorPos: reference point from which the object's pos will be set. Either a pos array, a callback (this, parent)=>{return [x,y] | _baseObj} or a _BaseObj inheritor
     * @param {Number | Boolean ?} activationMargin: the pixel margin amount from where the object remains active when outside the canvas visual bounds. If "true", the object will always remain active.
     * @param {Boolean?} fragile: (DEPRECATED) whether the shape resets on document visibility change
     */
    constructor(fillColor: Color | string | ([r, g, b, a] | null), dynamicUpdates: boolean | null, pos: [x, y] | null, dots: Dot | (Dot[] | null), radius: number | null, color: Color | string | ([r, g, b, a] | null), limit: number | null, drawEffectCB: Function | null, ratioPosCB: Function | null, setupCB: Function | null, loopCB: Function | null, anchorPos: [x, y] | Function | (_BaseObj | null), activationMargin: number | (boolean | null), fragile: boolean | null);
    _initFillColor: string | [r, g, b, a] | Color;
    _fillColor: string | [r, g, b, a] | Color;
    _dynamicUpdates: boolean;
    _path: Path2D;
    set fillColor(fillColor: any);
    get fillColor(): any;
    /**
     * Updates the path perimeter if the dots pos have changed
     */
    updatePath(): void;
    /**
     * @returns a separate copy of this FilledShape (only if initialized)
     */
    duplicate(fillColor?: string | [r, g, b, a] | Color, dynamicUpdates?: boolean, pos?: any[], dots?: any[], radius?: number, color?: string | Function | [r, g, b, a] | Color, limit?: number, drawEffectCB?: Function, ratioPosCB?: Function, setupCB?: Function, loopCB?: Function, anchorPos?: Function | [x, y] | _BaseObj, activationMargin?: number | boolean, fragile?: boolean): FilledShape;
    get fillColorObject(): string | [r, g, b, a] | Color;
    get fillColorRaw(): any;
    get initFillColor(): string | [r, g, b, a] | Color;
    get path(): Path2D;
    set dynamicUpdates(_dynamicUpdates: boolean);
    get dynamicUpdates(): boolean;
    #private;
}
export class Grid extends Shape {
    [x: number]: string | (() => number);
    static DEFAULT_KEYS: string;
    static DEFAULT_GAPS: number[];
    static DEFAULT_SOURCE: {
        width: number;
        height: number;
        A: any[][];
        B: any[][];
        C: any[][];
        D: any[][];
        E: any[][];
        F: any[][];
        G: any[][];
        H: any[][];
        I: any[][];
        J: any[][];
        K: any[][];
        L: any[][];
        M: any[][];
        N: any[][];
        O: any[][];
        P: any[][];
        Q: any[][];
        R: any[][];
        S: any[][];
        T: any[][];
        U: any[][];
        V: any[][];
        W: any[][];
        X: any[][];
        Y: any[][];
        Z: any[][];
        a: any[][];
        b: any[][];
        c: any[][];
        d: any[][];
        e: any[][];
        f: any[][];
        g: any[][];
        h: any[][];
        i: any[][];
        j: any[][];
        k: any[][];
        l: any[][];
        m: any[][];
        n: any[][];
        o: any[][];
        p: any[][];
        q: any[][];
        r: any[][];
        s: any[][];
        t: any[][];
        u: any[][];
        v: any[][];
        w: any[][];
        x: any[][];
        y: any[][];
        z: any[][];
        "!": any[][];
        "?": any[][];
        "@": any[][];
        "#": any[][];
        $: any[][];
        "%": any[][];
        "^": any[][];
        "&": any[][];
        "*": any[][];
        "(": any[][];
        ")": any[][];
        "{": any[][];
        "}": any[][];
        ",": any[][];
        ".": any[][];
        "+": any[][];
        _: any[][];
        "-": any[][];
        "=": any[][];
        ";": any[][];
        ":": any[][];
        "[": any[][];
        "]": any[][];
        "'": any[][];
        "|": any[][];
        "/": any[][];
        "\\": any[][];
        "0": any[][];
        "1": any[][];
        "2": any[][];
        "3": any[][];
        "4": any[][];
        "5": any[][];
        "6": any[][];
        "7": any[][];
        "8": any[][];
        "9": any[][];
    };
    static DEFAULT_SPACING: (grid: any) => any;
    static DELETION_VALUE: any;
    static SAME_VALUE: any;
    /**
     * Allows the creation of symbols/text using dots
     * @param {String} keys: keys to convert to source's values as a string
     * @param {[gapX, gapY]?} gaps: horizontal and vertical gaps within the dots, in pixels
     * @param {Number?} spacing: gap size between symbols, in pixels
     * @param {Object?} source: the source of the symbols
     * @param {[x,y]?} pos: the pos of the object
     * @param {Number?} radius: the radius of the dots
     * @param {Color | String | [r,g,b,a]?} color: the color of the dots
     * @param {Number?} limit: the delimiter radius within which the drawEffectCB can take effect
     * @param {Function?} drawEffectCB: a function called every frame for each dot of the shape, used to create effects. (render, dot, ratio, setupResults, mouse, distance, parent, isActive, rawRatio)=>
     * @param {Function?} ratioPosCB: a function that returns a ratio pos target for calculating the dots ratio attribute. (this, dots)=>{return [x,y]}
     * @param {Function?} setupCB: function called on object's initialization (this, parent)=>{...}
     * @param {Function?} loopCB: function called each frame for this object (this)=>{...}
     * @param {[x,y] | Function | _BaseObj ?} anchorPos: reference point from which the object's pos will be set. Either a pos array, a callback (this, parent)=>{return [x,y] | _baseObj} or a _BaseObj inheritor
     * @param {Number | Boolean ?} activationMargin: the pixel margin amount from where the object remains active when outside the canvas visual bounds. If "true", the object will always remain active.
     * @param {Boolean?} fragile: (DEPRECATED) whether the shape resets on document visibility change
     */
    constructor(keys: string, gaps: [gapX, gapY] | null, spacing: number | null, source: any | null, pos: [x, y] | null, radius: number | null, color: Color | string | ([r, g, b, a] | null), limit: number | null, drawEffectCB: Function | null, ratioPosCB: Function | null, setupCB: Function | null, loopCB: Function | null, anchorPos: [x, y] | Function | (_BaseObj | null), activationMargin: number | (boolean | null), fragile: boolean | null);
    _keys: string;
    _gaps: number[] | [gapX, gapY];
    _spacing: any;
    _source: any;
    /**
     * Creates a formation of symbols
     * @param {String?} keys: keys to convert to source's values as a string
     * @param {[x,y]?} pos: the pos of the object
     * @param {[gapX, gapY]?} gaps: horizontal and vertical gaps within the dots, in pixels
     * @param {Number?} spacing: gap size between symbols, in pixels
     * @param {Object?} source: the source of the symbols
     * @returns an array with all the symbols
     */
    createGrid(keys?: string | null, pos?: [x, y] | null, gaps?: [gapX, gapY] | null, spacing?: number | null, source?: any | null): (string | any[])[];
    /**
     * Creates the dot based symbol at given pos, based on given source
     * @param {String} key: a single character to convert
     * @param {[x,y]?} pos: the pos of the symbol
     * @param {Object?} source: the source of the symbol
     * @returns an array of dots
     */
    createSymbol(key: string, pos?: [x, y] | null, source?: any | null): string | any[];
    /**
     * Deletes the symbol at the provided index
     * @param {Number} i: the index of the key
     */
    deleteKey(i: number): void;
    /**
     * Returns the dots composing the symbol at the provided index
     * @param {Number} i: the index of the key
     * @returns the dots group
     */
    getKey(i: number): any[];
    /**
     *  @returns a separate copy of this Grid (only if initialized)
     */
    duplicate(keys?: string, gaps?: any[], spacing?: any, source?: any, pos?: any[], radius?: number, color?: string | Function | [r, g, b, a] | Color, limit?: number, drawEffectCB?: Function, ratioPosCB?: Function, setupCB?: Function, loopCB?: Function, anchorPos?: Function | [x, y] | _BaseObj, activationMargin?: number | boolean, fragile?: boolean): Grid;
    set keys(keys: string);
    get keys(): string;
    set gaps(gaps: number[] | [gapX, gapY]);
    get gaps(): number[] | [gapX, gapY];
    set spacing(spacing: any);
    get spacing(): any;
    set source(source: any);
    get source(): any;
    #private;
}
export class Dot extends _Obj {
    [x: number]: string | (() => {});
    /**
     * Important object component to create effects, can be used on it's own, but designed to be contained by a Shape instance
     * @param {[x,y]?} pos: the [x,y] pos of the object
     * @param {Number?} radius: the radius of the object
     * @param {Color | [r,g,b,a] ?} color: the color of the object
     * @param {Function?} setupCB: function called on object's initialization (this, parent)=>{...}
     * @param {[x,y] | Function | _BaseObj ?} anchorPos: reference point from which the object's pos will be set. Either a pos array, a callback (this, parent)=>{return [x,y] | _baseObj} or a _BaseObj inheritor
     * @param {Number | Boolean ?} activationMargin: the pixel margin amount from where the object remains active when outside the canvas visual bounds. If "true", the object will always remain active.
     * @param {Boolean?} disablePathCaching: if true, disables path caching. Could be more performant if the Dot is highly dynamic
     */
    constructor(pos: [x, y] | null, radius: number | null, color: Color | ([r, g, b, a] | null), setupCB: Function | null, anchorPos: [x, y] | Function | (_BaseObj | null), activationMargin: number | (boolean | null), disablePathCaching?: boolean | null);
    _connections: any[];
    _cachedPath: boolean;
    draw(render: any, time: any, deltaTime: any): void;
    /**
     * Returns pythagorian distance between the dot and another pos. (Defaults to the ratio defining pos)
     * @param {[x,y]?} pos: the pos to get the distance between
     * @returns the distance
     */
    getDistance(pos?: [x, y] | null): number;
    /**
     * Calculates the ratio based on distance and parent's limit
     * @param {Number} dist: the distance
     * @returns the ratio
     */
    getRatio(dist: number): number;
    /**
     * Adds a dot to the connection array
     * @param {Dot} dot: the Dot instance to add
     */
    addConnection(dot: Dot): void;
    /**
     * Removes a dot from the connection array
     * @param {Dot | id} dotOrId: the Dot instance or id of, to remove from the connection array
     */
    removeConnection(dotOrId: Dot | id): void;
    /**
     * Calculates the 4 intersection points between two dots and a direct line going through them.
     * @param {Dot | pos} target: a Dot or a pos [x,y] (Defaults to the first Dot in this object's connections list)
     * @param {Number} targetPadding: the padding radius of the target (Defaults to the target radius if it's a Dot, or 5)
     * @param {Dot | pos} source: a Dot or a pos [x,y] (Defaults to this object)
     * @param {Number} sourcePadding: the padding radius of the source (Defaults to the source radius if it's a Dot, or 5)
     * @returns {
    *      source: [ [x, y], [x, y] ]
    *      target: [ [x, y], [x, y] ]
    * } The 2 intersection points for the target and for the source
    */
    getLinearIntersectPoints(target?: Dot | pos, targetPadding?: number, source?: Dot | pos, sourcePadding?: number): any;
    /**
     * Activates path caching and updates the cached path
     */
    updateCachedPath(): void;
    /**
     * Disables path caching
     */
    disablePathCaching(): void;
    /**
     * Returns a separate copy of this Dot
     */
    duplicate(pos?: any[], radius?: number, color?: string | Function | [r, g, b, a] | Color, setupCB?: Function, anchorPos?: Function | [x, y] | _BaseObj, activationMargin?: number | boolean, disablePathCaching?: boolean): Dot;
    /**
     * Returns whether the provided pos is in the dot
     * @param {[x,y]} pos: the pos to check
     * @param {Number | [paddingTop, paddingRight?, paddingBottom?, paddingLeft?] ?} padding: the padding added to the validity area
     * @param {Number?} rotation: the rotation in degrees of the area
     * @param {[scaleX, scaleY]?} scale: the scale of the area
     * @returns whether the provided pos is inside the Dot
     */
    isWithin(pos: [x, y], padding: number | ([paddingTop, paddingRight?, paddingBottom?, paddingLeft?] | null), rotation: number | null, scale: [scaleX, scaleY] | null): boolean;
    /**
     * Returns whether the provided pos is inside the Dot very accurately
     * @param {[x,y]} pos: the pos to check
     * @param {Number | [paddingX, paddingY?] ?} axisPadding: the padding added to the validity area
     * @param {Number?} rotation: the rotation in degrees of the area
     * @param {[scaleX, scaleY]?} scale: the scale of the area
     * @returns whether the provided pos is inside the Dot
     */
    isWithinAccurate(pos: [x, y], axisPadding: number | ([paddingX, paddingY?] | null), rotation: number | null, scale: [scaleX, scaleY] | null): any;
    /**
     * Returns the accurate area containing all of the Dot
     * @param {Number | [paddingX, paddingY?] ?} axisPadding: the padding added to the validity area
     * @param {Number?} rotation: the rotation in degrees of the area
     * @param {[scaleX, scaleY]?} scale: the scale of the area
     * @returns a Path2D
     */
    getBoundsAccurate(axisPadding: number | ([paddingX, paddingY?] | null), rotation?: number | null, scale?: [scaleX, scaleY] | null): Path2D;
    /**
     * @returns the center pos of the Dot
     */
    getCenter(): number[];
    /**
     * Returns the minimal rectangular area containing all of the Dot
     * @param {Number | [paddingTop, paddingRight?, paddingBottom?, paddingLeft?] ?} padding: the padding added to the validity area
     * @param {Number?} rotation: the rotation in degrees of the area
     * @param {[scaleX, scaleY]?} scale: the scale of the area
     * @returns the area positions [[x1,y1], [x2,y2]]
     */
    getBounds(padding: number | ([paddingTop, paddingRight?, paddingBottom?, paddingLeft?] | null), rotation?: number | null, scale?: [scaleX, scaleY] | null): any[][];
    get ctx(): any;
    get cvs(): any;
    get render(): any;
    set limit(limit: any);
    get limit(): any;
    get drawEffectCB(): any;
    get mouse(): any;
    get ratioPos(): any;
    set connections(c: any[]);
    get connections(): any[];
    get parentSetupResults(): any;
    get top(): number;
    get bottom(): number;
    get right(): number;
    get left(): number;
    get width(): number;
    get height(): number;
    set cachedPath(path: boolean);
    get cachedPath(): boolean;
    #private;
}
