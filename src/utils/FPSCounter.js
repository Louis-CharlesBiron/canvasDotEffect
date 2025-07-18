class FPSCounter {

    /**
     * Allows to get the current frames per second.
     * To use: either getFpsRaw for raw fps, AND/OR getFps for averaged fps
     * @param {Number?} avgSampleSize: the sample size used to calculate the current fps average
     */
    constructor(avgSampleSize) {
        this._avgSampleSize = avgSampleSize||10
        this._times = []
        this._avg = []
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
        this._avg.push(this.getFpsRaw())
        if (this._avg.length > this._avgSampleSize) this._avg.shift()
        return Math.floor(Math.min(this._avg.reduce((a, b)=>a+b,0)/this._avgSampleSize, this._maxFps))
    }

    get maxFps() {return this._maxFps-1}
    get avgSample() {return this._avgSampleSize}
    get fpsRaw() {return this._times.length}
    
    set avgSample(s) {this._avgSampleSize = s}
}