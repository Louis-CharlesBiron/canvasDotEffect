class FPSCounter {
    static COMMON_REFRESH_RATES = [30, 60, 75, 90, 120, 144, 165, 240, 360, 480, 500]
    static ABNORMAL_FLUCTUATION_THRESHOLD = 20

    /**
     * Allows to get the current frames per second.
     * To use: either getFpsRaw for raw fps, AND/OR getFps for a smoother fps display
     * @param {Number?} averageSampleSize: the sample size used to calculate the current fps average
     */
    constructor(averageSampleSize) {
        this._averageSampleSize = averageSampleSize||10
        this._times = []
        this._averageSample = []
        this._maxFps=0
    }

    /**
     * Run in a loop to get how many times per seconds it runs
     * @returns the current amount of times ran in a second
     */
    getFpsRaw() {
        let now=performance.now(), fps
        while (this._times.length && this._times[0]<=now-1000) this._times.shift()
        fps = this._times.push(now)
        if (this._maxFps < fps) this._maxFps = fps
        return fps
    }

    /**
     * Run in a loop to get how many times per seconds it runs
     * @returns the current averaged amount of times ran in a second
     */
    getFps() {
        const avgSample = this._averageSample
        avgSample.push(this.getFpsRaw())
        if (avgSample.length > this._averageSampleSize) avgSample.shift()
        return Math.min(CDEUtils.avg(avgSample), this._maxFps)|0
    }

    /**
     * Compares the max acheive fps and a chart of common refresh rates. (This function only works while either 'getFpsRaw()' or 'getFps' is running in a loop)
     * @param {Number?} forceFPS: if defined, returns the probable refresh rate for this fps value. Defaults to the user's max fps.
     * @returns the probable refresh rate of the user or null if not enough time has passed
     */
    getApproximatedUserRefreshRate(forceFPS=this.maxFps) {
        return performance.now() > 1000 ? FPSCounter.COMMON_REFRESH_RATES.reduce((a,b)=>a<(forceFPS-1)?b:a,null) : null
    }

    /**
     * Tries to calculate the most stable fps based on the current amount of lag, device performance / capabilities. Results will fluctuate over time. (This function only works while 'getFps()' is running in a loop)
     * @param {Boolean?} prioritizeStability: whether the recommended value prioritizes a lower but, more stable fps value over a higher, but less stable fps value 
     * @param {Number?} stabilityThreshold: the stability threshold used when prioritizeStability is enabled. The higher this is, the more inclined it is to return a higher fps value when close to the next fps threshold
     * @returns the recommended fps value
     */
    getRecommendedFPS(prioritizeStability=true, stabilityThreshold=8) {
        if (performance.now() > 1000) {
            const refreshRates = FPSCounter.COMMON_REFRESH_RATES, avgFps = this._averageSample.reduce((a,b)=>a+b,0)/this._averageSampleSize

            if (avgFps && prioritizeStability) return refreshRates[refreshRates.indexOf(refreshRates.reduce((a,b)=>a<(avgFps+stabilityThreshold)?b:a,null))-1]||refreshRates[0]
            else return this.getApproximatedUserRefreshRate(avgFps)
        } else return null
    }

    /**
     * Runs getRecommendedFPS multiple times over a period of time to figure out what is the recommended fps value in a specific environment.
     * @param {Function} resultCB: a function called once the evaluation ends, containing the recommended value and statistics. (results)=>
     * @param {Number?} duration: the evalution duration in miliseconds. (The evaluation will last exactly 1 second longer than this value)
     * @param {Number?} sampleCount: how many getRecommendedFPS samples to take in order to recommend a fps value
     * @param {Boolean?} prioritizeStability: whether the recommended value prioritizes a lower but, more stable fps value over a higher, but less stable fps value 
     * @param {Number?} stabilityThreshold: the stability threshold used when prioritizeStability is enabled. The higher this is, the more inclined it is to return a higher fps value when close to the next fps threshold
     */
    runRecommendedFPSEvaluation(resultCB, duration=10000, sampleCount=10, prioritizeStability=true, stabilityThreshold=8) {
        sampleCount = sampleCount ? sampleCount|=0 : 10
        if (duration < sampleCount) duration = sampleCount
        const delay = duration/sampleCount, rawResults = []
        for (let i=delay;i<=duration;i+=delay) {
            const time = 1000+i
            setTimeout(()=>{
                rawResults.push(this.getRecommendedFPS(prioritizeStability, stabilityThreshold))
                if (i>=duration && CDEUtils.isFunction(resultCB)) {
                    const [min, max] = CDEUtils.getMinMax(rawResults), avg = CDEUtils.avg(rawResults), recommendedValue = this.getApproximatedUserRefreshRate(avg-stabilityThreshold)
                    resultCB({recommendedValue, stats:{rawResults, min, max, avg}})
                }
            }, time)
        }
    }

    [Symbol.toPrimitive]() {
        return this.getFps()
    }

    *[Symbol.iterator]() {
        const times = this._times, t_ll = times.length
        for (let i=0;i<t_ll;i++) yield times[i]
    }

    get [Symbol.toStringTag]() {return this.instanceOf}
    get instanceOf() {return "FPSCounter"}
    get maxFps() {return this._maxFps-1}
    get averageSampleSize() {return this._averageSampleSize}
    get fpsRaw() {return this._times.length}
    
    set averageSampleSize(averageSampleSize) {this._averageSampleSize = averageSampleSize}
}