// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

class CDEUtils {
    static DEFAULT_ACCEPTABLE_DIFFERENCE = 0.0000001
    static CIRC = 2*Math.PI
    static TO_DEGREES = Math.PI/180

    // Returns the element at the specified index, starting from the end of the array
    static getLast(arr, index=0) {
        return arr[arr.length-1-index]
    }

    // Adds an element to the specified index of the array
    static addAt(arr, el, index=0) {
        return arr.slice(0, index).concat(el, arr.slice(index))
    }

    // returns a random number within the min and max range. Can generate decimals
    static random(min, max, decimals=0) {
        return +(Math.random()*(max-min)+min).toFixed(decimals)
    }

    // clamps a numeric value between the min and max 
    static clamp(value, min=Infinity, max=Infinity) {
        return value < min ? min : value > max ? max : value
    }

    // returns whether a value is defined
    static isDefined(v) {
        return v != null
    }

    // returns whether a value is a function
    static isFunction(v) {
        return typeof v == "function"
    }

    // rounds a number to a specific decimal point
    static round(num, decimals=1) {
        const factor = 10**decimals
        return Math.round(num*factor)/factor
    }

    // creates a copy of the provided array. (only for length 2)
    static unlinkArr2(arr) {
        return [arr[0], arr[1]]
    }

    // creates a copy of the provided array. (only for length 3)
    static unlinkArr3(arr) {
        return [arr[0], arr[1], arr[2]]
    }

    // creates a copy of the provided array. (input format: [ [x, y], [x, y] ], or [x, y])
    static unlinkArr22(arr) {
        const isArray = Array.isArray, unlinkArr2 = CDEUtils.unlinkArr2,  o1 = arr?.[0], o2 = arr?.[1]
        return isArray(arr) ? [isArray(o1)?unlinkArr2(o1):o1, isArray(o2)?unlinkArr2(o2):o2] : arr
    }

    // returns the rotated position 
    static rotatePos(pos=[0,0], deg=0, centerPos=[0,0]) {
        const rad = CDEUtils.toRad(deg), cos=Math.cos(rad), sin=Math.sin(rad), sx = pos[0]-centerPos[0], sy = pos[1]-centerPos[1]
        return [sx*cos-sy*sin+centerPos[0], sx*sin+sy*cos+centerPos[1]]
    }

    // returns the rotated position 
    static scalePos(pos=[0,0], scale=[1,1], centerPos=[0,0]) {
        const sx = pos[0]-centerPos[0], sy = pos[1]-centerPos[1]
        return [sx*scale[0]+centerPos[0], sy*scale[1]+centerPos[1]]
    }

    // returns the center pos of the provided positions
    static getPositionsCenter(positions) {
        return [(positions[0][0]+positions[1][0])/2, (positions[0][1]+positions[1][1])/2]
    }

    // Returns the pythagorian distance between 2 points
    static getDist(x1, y1, x2, y2) {
        return Math.sqrt((x1-x2)**2 + (y1-y2)**2)
    }

    // Returns the "a", "b" and "function" values formed by a line between 2 positions
    static getLinearFn(pos1, pos2) {
        const a = (pos2[1]-pos1[1])/(pos2[0]-pos1[0]), b = -a*pos1[0]+pos1[1]
        return [a, b, (x)=>a*x+b, pos1]
    }

    // Returns the "a", "b" and "function" values of the perpendicular line. 
    static getPerpendicularLinearFn(linearFnResult) {
        const a = -1/linearFnResult[0], pos = linearFnResult[3], b = -a*pos[0]+pos[1]
        return [a, b, (x)=>a*x+b, pos]
    }

    // Returns a random value in a randomArray
    static getValueFromRange(minMax) {
        return Array.isArray(minMax) ? CDEUtils.random(minMax[0], minMax[1]) : minMax 
    }

    // Shallow array equals
    static arrayEquals(arr1, arr2) {
        if (arr1.length !== arr2.length) return false
        return arr1.every((v, i)=>v==arr2[i])
    }
    
    // pos array equals
    static arr2Equals(arr1, arr2) {
        return arr1 && arr2 && arr1[0]==arr2[0] && arr1[1]==arr2[1]
    }

    // positions array equals
    static arr22Equals(arr1, arr2) {
        return arr1 && arr2 && arr1[0][0]==arr2[0][0] && arr1[0][1]==arr2[0][1] && arr1[1][0]==arr2[1][0] && arr1[1][1]==arr2[1][1]
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

    // returns converted given degrees into radians 
    static toRad(deg) {
        return deg*CDEUtils.TO_DEGREES
    }

    // returns converted given radians into degrees 
    static toDeg(rad) {
        return rad/CDEUtils.TO_DEGREES
    }

    /**
    * Rounds the specied decimal number if it's close enough to its rounded value 
    * @param {Number} n: a decimal number 
    * @param {Number} acceptableDiff: the minimal difference between the given decimal number and it's rounded conterpart, for them be considered the same 
    * @returns The potentially adjusted number
    */
    static getAcceptableDiff(n, acceptableDiff=CDEUtils.DEFAULT_ACCEPTABLE_DIFFERENCE) {
        return Math.round(n)-n <= acceptableDiff ? Math.round(n) : n
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