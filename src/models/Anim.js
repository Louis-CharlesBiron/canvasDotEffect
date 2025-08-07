// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

class Anim {
    static #ANIM_ID_GIVER = 0
    static DEFAULT_DURATION = 1000

    /**
     * Allows the creation of smooth progress based animations 
     * @param {Function} animationCB: a function called each frame containing the animation code. (clampedProgress, playCount, progress)=>{...}
     * @param {Number?} duration: the animation duration in miliseconds. Negative numbers make the animation loop infinitely
     * @param {Function?} easing: the easing function used. (x)=>{return y} 
     * @param {Function?} endCB: a function called upon the anim end
     */
    constructor(animationCB, duration, easing, endCB) {
        this._id = Anim.#ANIM_ID_GIVER++                 // animation id
        this._animation = animationCB                    // the main animation (clampedProgress, playCount, progress)=>
        this._duration = duration??Anim.DEFAULT_DURATION // duration in ms, negative values make the animation repeat infinitly
        this._easing = easing||Anim.linear               // easing function (x)=>
        this._endCB = endCB                              // function called when animation is over

        this._startTime = null // start time
        this._progress = 0     // animation progress
        this._playCount = 0    // how many time the animation has played
        this._isReversed = false
    }
    
    // progresses the animation 1 frame (loops each frame) 
    getFrame(time, deltaTime) {
        const isInfinite = this._duration<0, duration = isInfinite?-this._duration:this._duration, startTime = this._startTime, reversed = this._isReversed
        if (!this._playCount || isInfinite) {
            if (!startTime) this._startTime = time
            else if (deltaTime >= 0 && time < startTime+duration) {
                let elapsed = time-startTime, prog = this._easing((Math.abs(elapsed))/duration)
                this._progress = reversed ? 1-prog : prog
                this._animation(this._progress, this._playCount, deltaTime, this.progress)
                if (reversed && elapsed > 0) {
                    this._isReversed = false
                    this._playCount++
                }
            } 
            else if (deltaTime < 0 && time > startTime-duration) {
                let reversedElapsed = startTime-time, prog = this._easing((Math.abs(reversedElapsed))/duration)
                if (!reversed && reversedElapsed > 0) {
                    this._isReversed = true
                    this._playCount++
                } 
                if (this._easing((Math.abs(startTime-(time+deltaTime*1000)))/duration) > 1) {
                    this._startTime=null
                    this._animation(0, this._playCount++, deltaTime, 0)
                } else {
                    this._progress = this._isReversed ? 1-prog : prog
                    this._animation(this._progress, this._playCount, deltaTime, this.progress)
                }
            }
            else if (isInfinite) {
                if (!this._isReversed) this.reset(true, deltaTime)
                else {
                    this._startTime=null
                    this._playCount++
                }
            }
            else this.end(deltaTime)
        }
    }

    // ends the animation
    end(deltaTime) {
        this._animation(1, this._playCount++, deltaTime, 1)
        if (CDEUtils.isFunction(this._endCB)) this._endCB(this)
    }

    // resets the animation
    reset(isInfiniteReset, deltaTime) {
        if (isInfiniteReset) this._animation(1, this._playCount++, deltaTime, 1)
        else this._playCount = 0
        this._progress = 0
        this._startTime = null
    }

    [Symbol.toPrimitive](type) {
        if (type=="number") return this.id
        else if (type=="string") return this.id
        return this.id
    }

    get [Symbol.toStringTag]() {return this.instanceOf}
    get instanceOf() {return "Anim"}
    get id() {return this._id}
    get animation() {return this._animation}
	get duration() {return this._duration}
	get easing() {return this._easing}
	get endCB() {return this._endCB}
	get startTime() {return this._startTime}
	get progress() {return CDEUtils.clamp(this._progress, 0, 1)}
	get progressRaw() {return this._progress}
	get playCount() {return this._playCount}

	set animation(_animation) {return this._animation = _animation}
	set duration(_duration) {return this._duration = _duration}
	set easing(_easing) {return this._easing = _easing}
	set endCB(_endCB) {return this._endCB = _endCB}

    // Easings from: https://easings.net/
    static easeInSine=x=>1-Math.cos(x*Math.PI/2)
    static easeOutSine=x=>Math.sin(x*Math.PI/2)
    static easeInOutSine=x=>-(Math.cos(Math.PI*x)-1)/2

    static easeInCubic=x=>x*x*x
    static easeOutCubic=x=>1-Math.pow(1-x,3)
    static easeInOutCubic=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2

    static easeInQuint=x=>x*x*x*x*x
    static easeOutQuint=x=>1-Math.pow(1-x,5)
    static easeInOutQuint=x=>x<.5?16*x*x*x*x*x:1-Math.pow(-2*x+2,5)/2

    static easeInCirc=x=>1-Math.sqrt(1-Math.pow(x,2))
    static easeOutCirc=x=>Math.sqrt(1-Math.pow(x-1,2))
    static easeInOutCirc=x=>x<.5?(1-Math.sqrt(1-Math.pow(2*x,2)))/2:(Math.sqrt(1-Math.pow(-2*x+2,2))+1)/2

    static easeInElastic=x=>0==x?0:1==x?1:-Math.pow(2,10*x-10)*Math.sin((10*x-10.75)*(2*Math.PI/3))
    static easeOutElastic=x=>0==x?0:1==x?1:Math.pow(2,-10*x)*Math.sin((10*x-.75)*(2*Math.PI/3))+1
    static easeInOutElastic=x=>0==x?0:1==x?1:x<.5?-Math.pow(2,20*x-10)*Math.sin((20*x-11.125)*(2*Math.PI)/4.5)/2:Math.pow(2,-20*x+10)*Math.sin((20*x-11.125)*(2*Math.PI)/4.5)/2+1

    static easeInQuad=x=>x*x
    static easeOutQuad=x=>1-(1-x)*(1-x)
    static easeInOutQuad=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2

    static easeInQuart=x=>x*x*x*x
    static easeOutQuart=x=>1-Math.pow(1-x,4)
    static easeInOutQuart=x=>x<.5?8*x*x*x*x:1-Math.pow(-2*x+2,4)/2

    static easeInExpo=x=>0==x?0:Math.pow(2,10*x-10)
    static easeOutExpo=x=>1==x?1:1-Math.pow(2,-10*x)
    static easeInOutExpo=x=>0==x?0:1==x?1:x<.5?Math.pow(2,20*x-10)/2:(2-Math.pow(2,-20*x+10))/2

    static easeInBack=x=>2.70158*x*x*x-1.70158*x*x
    static easeOutBack=x=>1+2.70158*Math.pow(x-1,3)+1.70158*Math.pow(x-1,2)
    static easeInOutBack=x=>x<.5?Math.pow(2*x,2)*(7.189819*x-2.5949095)/2:(Math.pow(2*x-2,2)*(3.5949095*(2*x-2)+2.5949095)+2)/2

    static easeInBounce=x=>1-Anim.easeOutBounce(1-x)
    static easeOutBounce=x=>x<1/2.75?7.5625*x*x:x<2/2.75?7.5625*(x-=1.5/2.75)*x+.75:x<2.5/2.75?7.5625*(x-=2.25/2.75)*x+.9375:7.5625*(x-=2.625/2.75)*x+.984375
    static easeInOutBounce=x=>x<.5?(1-Anim.easeOutBounce(1-2*x))/2:(1+Anim.easeOutBounce(2*x-1))/2

    static linear=x=>x
}