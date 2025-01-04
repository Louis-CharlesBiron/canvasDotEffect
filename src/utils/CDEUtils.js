// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Sketchy array utils :)
// Returns the element at the specified index, starting from the end of the array
Array.prototype.last=function(index=0){return this[this.length-1-index]}
// Adds an element to the specified index of the array
Array.prototype.addAt=function(el, index=0){return this.slice(0,index).concat(...[el, this.slice(index, this.length)])}

class CDEUtils {
    static ACCEPTABLE_DIF = 0.0000001
    static CIRC = 2*Math.PI

    // returns a random number within the min and max range. Can generate decimals
    static random(min, max, decimals=0) {
        return +(Math.random()*(max-min)+min).toFixed(decimals)
    }

     // Create an instance of the FPSCounter and run every frame: either getFpsRaw for raw fps AND/OR getFps for averaged fps
    static FPSCounter = class {
        constructor(avgSampleSize) {
            this._t = []
            this._maxFps=0
            this._avgSampleSize = avgSampleSize||10
            this._avg = []
        }
    
        getFpsRaw() {//run in the loop
            let n=performance.now(), fps
            while (this._t.length>0 && this._t[0]<=n-1000) this._t.shift()
            fps = this._t.push(n)
            if (this._maxFps < fps) this._maxFps = fps
            return fps
        }
    
        getFps() {//or run in the loop
            this._avg.push(this.getFpsRaw())
            if (this._avg.length > this._avgSampleSize) this._avg.shift()
            return Math.floor(Math.min(this._avg.reduce((a, b)=>a+b,0)/this._avgSampleSize, this._maxFps))
        }
    
        get maxFps() {return this._maxFps-1}
        get avgSample() {return this._avgSampleSize}
        get fpsRaw() {return this._t.length}
        
        set avgSample(s) {this._avgSampleSize = s}
    }

    // Returns the pythagorian distance between 2 points
    static getDist(x1, y1, x2, y2) {
        return Math.sqrt((x1-x2)**2 + (y1-y2)**2)
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
    static mod(max, ratio, range) {
        range??=max
        return max-ratio*range+max*((range>=0)-1)
    }

    // returns converted given degrees into radians 
    static toRad(deg) {
        return deg*(Math.PI/180)
    }

    // returns converted given radians into degrees 
    static toDeg(rad) {
        return rad/(Math.PI/180)
    }

    /**
    * Rounds the specied decimal number if it's close enough to its rounded value 
    * @param {Number} n: a decimal number 
    * @param {Number} okDif: the minimal difference between the given decimal number and it's rounded conterpart, for them be considered the same 
    * @returns The potentially adjusted number
    */
    static getAcceptableDif(n, okDif=CDEUtils.ACCEPTABLE_DIF) {
        return Math.round(n)-n <= okDif ? Math.round(n) : n
    }

    /**
    * @param {[Number|Object]} arr: array containing numbers or objects a numberic property 
    * @param {String?} propPath: the path of the compared value if the array is containing objects 
    * @returns the [min, max] values of the array
    */
    static getMinMax(arr, propPath=null) {
       let min = Infinity, max = -Infinity, ll = arr.length
       for (let i=0;i<ll;i++) {
           let v = propPath ? +arr[i][propPath] : arr[i]
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

}




