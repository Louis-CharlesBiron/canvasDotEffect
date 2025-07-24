// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

class CDEUtils {
    static DEFAULT_ACCEPTABLE_DIFFERENCE = 0.0000001
    static CIRC = 2*Math.PI
    static TO_DEGREES = Math.PI/180

    /**
     * Returns the element at the specified index, starting from the end of the array
     * @param {Array} arr: the array
     * @param {Number?} index: the index
     * @returns the element at index
     */
    static getLast(arr, index=0) {
        return arr[arr.length-1-index]
    }

    /**
     * Adds an element to the specified index of the array
     * @param {Array} arr: the array 
     * @param {*} el: the element to add
     * @param {Number?} index: the index
     * @returns the updated array
     */
    static addAt(arr, el, index=0) {
        return arr.slice(0, index).concat(el, arr.slice(index))
    }

    /**
     * Returns a random number within the min and max range
     * @param {Number} min: the minimal possible value (included)
     * @param {Number} max: the maximal possible value (included)
     * @param {Number?} decimals: the decimal point. (Defaults to integers)
     * @returns the generated number
     */
    static random(min, max, decimals=0) {
        max++
        if (decimals) {
            const precision = decimals**10
            return Math.round((Math.random()*(max-min)+min)*precision)/precision
        } else return (Math.random()*(max-min)+min)>>0
    }

    /**
     * Clamps a number between the min and max 
     * @param {Number} num: the number to clamp
     * @param {Number?} min: the minimal value 
     * @param {Number?} max: the maximal value
     * @returns 
     */
    static clamp(num, min=Infinity, max=Infinity) {
        return num < min ? min : num > max ? max : num
    }

    /**
     * Returns whether a value is defined
     * @param {*} value: the value to check
     * @returns whether the value is defined
     */
    static isDefined(value) {
        return value != null
    }

    /**
     * Returns whether a value is a function
     * @param {*} value: the value to check
     * @returns whether the value is a function
     */
    static isFunction(value) {
        return typeof value == "function"
    }

    /**
     * Rounds a number to a specific decimal point
     * @param {Number} num: the number to round
     * @param {Number?} decimals: the decimal rounding point
     * @returns 
     */
    static round(num, decimals=0) {
        const precision = 10**decimals
        return Math.round(num*precision)/precision
    }

    /**
     * Creates a copy of the provided array. (only length 2)
     * @param {*} arr 
     * @returns the array copy
     */
    static unlinkArr2(arr) {
        return [arr[0], arr[1]]
    }

    /**
     * Creates a copy of the provided array. (only length 3)
     * @param {*} arr 
     * @returns the array copy
     */
    static unlinkArr3(arr) {
        return [arr[0], arr[1], arr[2]]
    }

    /**
     * Creates a copy of the provided array.
     * @param {[ [x, y], [x2, y2] ] | [x,y]} arr 
     * @returns the array copy
     */
    static unlinkPositions(arr) {
        const isArray = Array.isArray, unlinkArr2 = CDEUtils.unlinkArr2,  o1 = arr?.[0], o2 = arr?.[1]
        return isArray(arr) ? [isArray(o1)?unlinkArr2(o1):o1, isArray(o2)?unlinkArr2(o2):o2] : arr
    }

    /**
     * Rotates the provided pos around a point
     * @param {[x,y]?} pos: the pos to rotate
     * @param {Number?} deg: the degrees to rotate
     * @param {[x,y]?} centerPos: the center pos of the rotation
     * @returns the rotated pos 
     */
    static rotatePos(pos=[0,0], deg=0, centerPos=[0,0]) {
        const rad = CDEUtils.toRad(deg), cos=Math.cos(rad), sin=Math.sin(rad), sx = pos[0]-centerPos[0], sy = pos[1]-centerPos[1]
        return [sx*cos-sy*sin+centerPos[0], sx*sin+sy*cos+centerPos[1]]
    }

    /**
     * Scales the provided pos from a center point
     * @param {[x,y]?} pos: the pos to scale
     * @param {[scaleX, scaleY]?} scale: the x/y scale factors 
     * @param {[x,y]?} centerPos: the center pos of the scaling
     * @returns the scaled pos 
     */
    static scalePos(pos=[0,0], scale=[1,1], centerPos=[0,0]) {
        const sx = pos[0]-centerPos[0], sy = pos[1]-centerPos[1]
        return [sx*scale[0]+centerPos[0], sy*scale[1]+centerPos[1]]
    }

    /**
     * Returns the center pos of the provided positions
     * @param {[[x1,y1], [x2,y2]]} positions: a rectangular area defined by two corners
     * @returns the center pos pos
     */
    static getPositionsCenter(positions) {
        return [(positions[0][0]+positions[1][0])/2, (positions[0][1]+positions[1][1])/2]
    }

    /**
     * Returns the pythagorian distance between 2 points
     * @param {Number} x1: the x value of the first point
     * @param {Number} y1: the y value of the first point
     * @param {Number} x2: the x value of the second point
     * @param {Number} y2: the y value of the second point
     * @returns 
     */
    static getDist(x1, y1, x2, y2) {
        return Math.sqrt((x1-x2)**2 + (y1-y2)**2)
    }

    /**
     * Returns the "a", "b" and "function" values formed by a line between 2 positions
     * @param {[x,y]} pos1: a point
     * @param {[x,y]} pos2: another point
     */
    static getLinearFn(pos1, pos2) {
        const a = (pos2[1]-pos1[1])/(pos2[0]-pos1[0]), b = -a*pos1[0]+pos1[1]
        return [a, b, (x)=>a*x+b, pos1]
    }

    /**
     * Returns the "a", "b" and "function" values of the perpendicular line
     * @param {Array} linearFnResult: the results of getLinearFn() 
     */
    static getPerpendicularLinearFn(linearFnResult) {
        const a = -1/linearFnResult[0], pos = linearFnResult[3], b = -a*pos[0]+pos[1]
        return [a, b, (x)=>a*x+b, pos]
    }

    /**
     * Returns a random value in a range
     * @param {[min, max]} minMax 
     * @returns the random clamped value
     */
    static getValueFromRange(minMax) {
        return Array.isArray(minMax) ? CDEUtils.random(minMax[0], minMax[1]) : minMax 
    }

    /**
     * Shallow array equals
     * @param {Array} arr1 
     * @param {Array} arr2 
     * @returns whether both array are equal
     */
    static arrayEquals(arr1, arr2) {
        if (arr1.length !== arr2.length) return false
        return arr1.every((v, i)=>v==arr2[i])
    }
    
    /**
     * Adds a pos to another
     * @param {[x,y]} arr1: a pos array
     * @param {[x,y]} arr2: another pos array
     * @returns the resulting pos array
     */
    static addPos(pos1, pos2) {
        return [pos1[0]+pos2[0], pos1[1]+pos2[1]]
    }
    
    /**
     * Substracts a pos to another
     * @param {[x,y]} arr1: a pos array
     * @param {[x,y]} arr2: another pos array
     * @returns the resulting pos array
     */
    static subPos(pos1, pos2) {
        return [pos1[0]-pos2[0], pos1[1]-pos2[1]]
    }

    /**
     * Multiplies a pos to another
     * @param {[x,y]} arr1: a pos array
     * @param {[x,y]} arr2: another pos array
     * @returns the resulting pos array
     */
    static mulPos(pos1, pos2) {
        return [pos1[0]*pos2[0], pos1[1]*pos2[1]]
    }

    /**
     * Divides a pos to another
     * @param {[x,y]} arr1: a pos array
     * @param {[x,y]} arr2: another pos array
     * @returns the resulting pos array
     */
    static divPos(pos1, pos2) {
        return [pos1[0]/pos2[0], pos1[1]/pos2[1]]
    }

    /**
     * Pos array equals (or arr[2])
     * @param {[x,y]} arr1: a pos array
     * @param {[x,y]} arr2: another pos array 
     * @returns whether both pos array are equal
     */
    static posEquals(arr1, arr2) {
        return arr2 && arr1 && arr1[0]==arr2[0] && arr1[1]==arr2[1]
    }

    /**
     * Positions array equals
     * @param {[[x1,y1], [x2,y2]]} positions1: a rectangular area defined by two corners
     * @param {[[x1,y1], [x2,y2]]} positions2: another rectangular area defined by two corners
     * @returns whether both positions array are equal
     */
    static positionsEquals(positions1, positions2) {
        return positions1 && positions2 && positions1[0][0]==positions2[0][0] && positions1[0][1]==positions2[0][1] && positions1[1][0]==positions2[1][0] && positions1[1][1]==positions2[1][1]
    }

    /**
    * Returns the interpolated number between (max) and (max - range) 
    * @param {Number} max: the max value to return
    * @param {Number} ratio: the linear interpolation progress (0 to 1)
    * @param {Number} range: defines the range of the max value to be used, inverts direction when negated
                            [if range=max, then (0 to max) will be used] or
                            [if range=max/2, only (max/2 to max) will be used] or
                            [if range=0, only (max to max) will be used]
    */
    static mod(max, ratio, range=max) {
        return max-ratio*range-(range<0)*max
    }

    /**
     * Returns converted given degrees into radians 
     * @param {Number} deg: the degrees
     * @returns the equivalent radians
     */
    static toRad(deg) {
        return deg*CDEUtils.TO_DEGREES
    }

    /**
     * Returns converted given radians into degrees 
     * @param {Number} rad: the radians
     * @returns the equivalent degrees
     */
    static toDeg(rad) {
        return rad/CDEUtils.TO_DEGREES
    }

    /**
    * Rounds the specied decimal number if it's close enough to its rounded value 
    * @param {Number} num: a decimal number 
    * @param {Number} acceptableDiff: the minimal difference between the given decimal number and it's rounded conterpart, for them be considered the same 
    * @returns The potentially adjusted number
    */
    static getAcceptableDiff(num, acceptableDiff=CDEUtils.DEFAULT_ACCEPTABLE_DIFFERENCE) {
        const rounded = Math.round(num)
        return rounded-num <= acceptableDiff ? rounded : num
    }

    /**
    * @param {[Number|Object]} arr: array containing numbers or objects a numberic property 
    * @param {String?} propPath: the path of the compared value if the array is containing objects 
    * @returns the [min, max] values of the array
    */
    static getMinMax(arr, propPath=null) {
       let min = Infinity, max = -Infinity, ll = arr.length
       for (let i=0;i<ll;i++) {
            const v = propPath ? +arr[i][propPath] : arr[i]
            if (v < min) min = v
            if (v > max) max = v
       }
       return [min, max]
    }

    /**
    * Calls a function repeatedly with a delay between calls
    * @param {Number} iterationCount: the number of time the callback is called
    * @param {Function} callback: the function to call (i)=>
    * @param {Number} delay: delay between each calls
    */
    static repeatedTimeout(iterationCount, callback, delay=5) {
        let at = 0
        for (let i=0;i<iterationCount;i++) {
            setTimeout(()=>callback(i),at+=delay)
        }
    }

    // console.log with the stack trace (DEBUG)
    static stackTraceLog(...logs) {
        try {
            throw new Error("stackTraceLog")
        } catch(e) {console.log(e, ...logs)}
    }
}