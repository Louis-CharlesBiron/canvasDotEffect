// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// todo doc
class AudioDisplay extends _BaseObj {
    static SUPPORTED_AUDIO_FORMATS = ["mp3", "wav", "ogg", "aac", "m4a", "opus", "flac"]
    static SOURCE_TYPES = {FILE_PATH:"string", DYNAMIC:"[object Object]", MICROPHONE:"MICROPHONE", SCREEN_AUDIO:"SCREEN_AUDIO", VIDEO:HTMLVideoElement, AUDIO:HTMLAudioElement}
    static MINIMAL_FFT = 1
    static MAXIMAL_FFT = 32768
    static DEFAULT_SAMPLE_COUNT = 64
    static DEFAULT_BINCB = (render, bin, pos, accumulator, audioDisplay)=>{
        const barWidth = 2, barHeight = 100*bin, spacing = 5
        render.batchFill(Render.getRect(pos, barWidth, barHeight), audioDisplay._color, audioDisplay.visualEffects)
        pos[0] += spacing
        return [pos]
    }
    static BIN_CALLBACKS = {DEFAULT:AudioDisplay.DEFAULT_BINCB, CIRCLE:AudioDisplay.CIRCLE(), BARS:AudioDisplay.BARS(), TOP_WAVE:AudioDisplay.TOP_WAVE()}
    static MICROPHONE_CHANNELS = {MONO:1, STEREO:2}
    static DEFAULT_MICROPHONE_DELAY = 1
    static DEFAULT_MICROPHONE_AUTO_GAIN_CONTROL = false
    static DEFAULT_MICROPHONE_ECHO_CANCELLATION = false
    static DEFAULT_MICROPHONE_NOISE_SUPPRESSION = false
    static DEFAULT_MICROPHONE_CHANNEL_COUNT = AudioDisplay.MICROPHONE_CHANNELS.STEREO
    static DEFAULT_MICROPHONE_SAMPLE_RATE = 48000
    static DEFAULT_MICROPHONE_SAMPLE_SIZE = 16
    static DEFAULT_MICROPHONE_SETTINGS = AudioDisplay.loadMircophone()
    static DEFAULT_SCREEN_AUDIO_SETTINGS = AudioDisplay.loadScreenAudio()
    static MAX_NORMALISED_DATA_VALUE = 255/128


    /*************
     TODO

    - fix in index.js initialisation
    - some utility functions: play, stop, volume, etc
    - maybe some audio modifiers (see https://mdn.github.io/voice-change-o-matic/)
    - good camera/screen error management (like if I just refuse, what happens to the object)
    - optimization!
    - pattern/gradient auto positions

    - auto spacing given a max width (width -> barWidth, spacing, sampleCount)

    
    -documentation


    /*************



let aud = new AudioDisplay("./img/song.mp3", [200,50], "lime", (render, bin, pos, audioDisplay, i)=>{
    const barWidth = 2, barHeight = 100*bin+5, spacing = 5

    render.fill(Render.getRect(pos, barWidth, barHeight), audioDisplay._color)

    pos[0] += spacing
    return pos
}, 64)

CVS.add(aud, true)

///////////////////////////////////////////////////////////

let data = [92, 88, 71, 67, 72, 64, 66, 68, 59, 46, 55, 53, 51, 51, 51, 53, 44, 41, 50, 54, 54, 47, 45, 54, 45, 38, 40, 36, 33, 31, 32, 29, 30, 30, 28, 29, 18, 23, 32, 32, 24, 27, 24, 24, 25, 21, 19, 22, 24, 28, 34, 33, 22, 14, 19, 21, 20, 16, 14, 20, 19, 13, 8, 0], atPos = [300, 50], offset = (0%1)*(128/2), adjusted_ll = Math.round(0.49+64)-offset, accumulator, binCB = (render, bin, pos, aud, accumulator, i, rawbin)=>{
        const barWidth = 2, barHeight = 100*bin, spacing = 5
        render.batchFill(Render.getRect(pos, barWidth, barHeight), [0,255,0,1])
        pos[0] += spacing
        return [pos]
}

let loop = CanvasUtils.SHAPES.DEBUG_SHAPE()
loop.loopingCB=()=>{
    atPos = [300, 50]
    for (let ii=-offset,i=offset>>0;ii<adjusted_ll;ii++,i=(i+1)%(64)) {
    const bin = data[i], res = binCB(CVS.render, bin/128, atPos, accumulator, null, i, bin)
    if (res[0]) atPos = res[0]
    if (res[1]) accumulator = res[1]}}
CVS.add(loop)

////////////////////////////////////////////////////////////////////

function time(cb, name="test", iterations=10000) {
    console.time(name)
    for (let i=0;i<iterations;i++) cb(i)
    console.timeEnd(name)
}


     */

    #buffer_ll = null
    #data = null
    #fft = null
    // DOC TODO
    constructor(source, pos, color, binCB, sampleCount, disableAudio, offsetPourcent, setupCB, loopCB, anchorPos, alwaysActive) {
        super(pos, color, setupCB, loopCB, anchorPos, alwaysActive)
        this._source = source??""            // the initial source of the displayed audio
        this._binCB = binCB??AudioDisplay.DEFAULT_BINCB // (render, bin, atPos, accumulator audioDisplay, i, sampleCount, rawBin)=>{... return? [ [newX, newY], newAccumulatorValue ]}
        this._sampleCount = sampleCount??AudioDisplay.DEFAULT_SAMPLE_COUNT
        this._disableAudio = disableAudio??false
        this._offsetPourcent = offsetPourcent??0

        this._audioCtx = new AudioContext()
        this._audioAnalyser = this._audioCtx.createAnalyser()
        this.#fft = this._audioAnalyser.fftSize = Math.max(32, 2**Math.round(Math.log2(this._sampleCount*2)))
        this.#buffer_ll = this._audioAnalyser.frequencyBinCount
        this.#data = new Uint8Array(this.#buffer_ll)
    }

    initialize() {
        AudioDisplay.initializeDataSource(this._source, (audio, isStream)=>{
            this._source = audio

            if (isStream) {
                //this._gainNode = audioCtx.createGain()
                this._source = this._audioCtx.createMediaStreamSource(audio)
                this._source.connect(this._audioAnalyser)
            } else this._audioCtx.createMediaElementSource(audio).connect(this._audioAnalyser)
            
            if (!this._disableAudio) this._audioAnalyser.connect(this._audioCtx.destination) // TODO togglable

            this._initialized = true
            if (CDEUtils.isFunction(this._setupCB)) this._setupResults = this._setupCB(this, this._parent, this._source)
        })

        this._pos = this.getInitPos()||_BaseObj.DEFAULT_POS
        this.setAnchoredPos()
    }

    draw(render, time, deltaTime) {
        if (this.initialized) {
            const ctx = render.ctx, x = this.x, y = this.y, hasScaling = this._scale[0]!==1||this._scale[1]!==1, hasTransforms = this._rotation||hasScaling, data = this.#data
            if (hasTransforms) {
                ctx.translate(x, y)
                if (this._rotation) ctx.rotate(CDEUtils.toRad(this._rotation))
                if (hasScaling) ctx.scale(this._scale[0], this._scale[1])
                ctx.translate(-x, -y)
            }

            this._audioAnalyser.getByteFrequencyData(data)
            
            let atPos = this.pos_, accumulator = null, offset = (this._offsetPourcent%1)*(this.#fft/2), adjusted_ll = Math.round(0.49+this._sampleCount)-offset
            for (let ii=-offset,i=offset>>0;ii<adjusted_ll;ii++,i=(i+1)%(this._sampleCount)) {
                const bin = data[i], res = this._binCB(render, bin/128, atPos, accumulator, this, i, this._sampleCount, bin), newPos = res[0], newAcc = res[1]
                if (newPos) atPos = newPos
                if (newAcc) accumulator = newAcc
            }

            if (hasTransforms) ctx.setTransform(1,0,0,1,0,0)
        }
        super.draw(time, deltaTime)
    }

    // Initializes a AudioDisplay data source
    static initializeDataSource(dataSrc, loadCallback) {
        const types = AudioDisplay.SOURCE_TYPES
        if (typeof dataSrc==types.FILE_PATH) {
            const extension = dataSrc.split(".")[dataSrc.split(".").length-1]
            if (AudioDisplay.SUPPORTED_AUDIO_FORMATS.includes(extension)) AudioDisplay.#initAudioDataSource(AudioDisplay.loadAudio(dataSrc), loadCallback)
            else if (ImageDisplay.SUPPORTED_VIDEO_FORMATS.includes(extension)) AudioDisplay.#initAudioDataSource(ImageDisplay.loadVideo(dataSrc), loadCallback)
        } else if (dataSrc.toString()==types.DYNAMIC) {
            if (dataSrc.type==types.MICROPHONE) AudioDisplay.#initMicrophoneDataSource(dataSrc.settings, loadCallback)
            else if (dataSrc.type==types.SCREEN_AUDIO) AudioDisplay.#initScreenAudioDataSource(dataSrc.settings, loadCallback)
        } else if (dataSrc instanceof types.VIDEO) AudioDisplay.#initAudioDataSource(dataSrc, loadCallback)
    }

    // Initializes a audio data source
    static #initAudioDataSource(dataSource, loadCallback) {
        const initLoad=()=>{if (CDEUtils.isFunction(loadCallback)) loadCallback(dataSource)}
        if (dataSource.readyState) initLoad()
        else dataSource.onloadeddata=initLoad
    }

    // Initializes a camera audio capture data source
    static #initMicrophoneDataSource(settings=true, loadCallback) {
        navigator.mediaDevices.getUserMedia({audio:settings}).then(src=>{
            if (src.getAudioTracks().length && CDEUtils.isFunction(loadCallback)) loadCallback(src, true)
            else console.log("TODO, no audio tracks")
        }).catch(e=>console.log("TODO, no perm", e))
    }

    // Initializes a screen audio capture data source
    static #initScreenAudioDataSource(settings=true, loadCallback) {
        navigator.mediaDevices.getDisplayMedia({audio:settings}).then(src=>{
            if (src.getAudioTracks().length && CDEUtils.isFunction(loadCallback)) loadCallback(src, true)
            else console.log("TODO, no audio tracks")
        }).catch((e)=>console.log("TODO, no perm", e))
    }

    // Returns a usable video source
    static loadAudio(path, looping=true, autoPlay=true) {
        const audio = new Audio(path)
        audio.preload = "auto"
        audio.loop = looping
        if (autoPlay) {
            audio.autoplay = autoPlay
            audio.play().catch(()=>Canvas.addOnFirstInteractCallback(()=>audio.play()))
        }
        return audio
    }

    // Returns a usable camera capture source TODO
    static loadMircophone(autoGainControl, echoCancellation, noiseSuppression, isStereo, delay, sampleRate, sampleSize) {
        autoGainControl??=AudioDisplay.DEFAULT_MICROPHONE_AUTO_GAIN_CONTROL
        echoCancellation??=AudioDisplay.DEFAULT_MICROPHONE_ECHO_CANCELLATION
        noiseSuppression??=AudioDisplay.DEFAULT_MICROPHONE_NOISE_SUPPRESSION
        isStereo??=true
        delay??=AudioDisplay.DEFAULT_MICROPHONE_DELAY
        sampleRate??=AudioDisplay.DEFAULT_MICROPHONE_SAMPLE_RATE
        sampleSize??=AudioDisplay.DEFAULT_MICROPHONE_SAMPLE_SIZE
        return {
            type:AudioDisplay.SOURCE_TYPES.MICROPHONE,
            settings:{
                autoGainControl,
                channelCount: isStereo?2:1,
                echoCancellation,
                latency: delay,
                noiseSuppression,
                sampleRate,
                sampleSize,
            }
        }
    }

    // Returns a usable screen capture source TODO
    static loadScreenAudio(autoGainControl, echoCancellation, noiseSuppression, isStereo, delay, sampleRate, sampleSize) {
        autoGainControl??=AudioDisplay.DEFAULT_MICROPHONE_AUTO_GAIN_CONTROL
        echoCancellation??=AudioDisplay.DEFAULT_MICROPHONE_ECHO_CANCELLATION
        noiseSuppression??=AudioDisplay.DEFAULT_MICROPHONE_NOISE_SUPPRESSION
        isStereo??=true
        delay??=AudioDisplay.DEFAULT_MICROPHONE_DELAY
        sampleRate??=AudioDisplay.DEFAULT_MICROPHONE_SAMPLE_RATE
        sampleSize??=AudioDisplay.DEFAULT_MICROPHONE_SAMPLE_SIZE
        return {
            type:AudioDisplay.SOURCE_TYPES.SCREEN_AUDIO,
            settings:{
                autoGainControl,
                channelCount: isStereo?2:1,
                echoCancellation,
                latency: delay,
                noiseSuppression,
                sampleRate,
                sampleSize,
            }
        }
    }


    update() {
        // todo
    }


    // DOC TODO
    static BARS(maxHeight, minHeight, spacing, barWidth) {
        maxHeight??=100
        minHeight??=0
        spacing??=1
        barWidth??=2
        
        maxHeight = maxHeight/AudioDisplay.MAX_NORMALISED_DATA_VALUE
        return (render, bin, pos, accumulator, audioDisplay)=>{
            const barHeight = minHeight+maxHeight*bin
            render.batchFill(Render.getRect(pos, barWidth, barHeight), audioDisplay._color, audioDisplay.visualEffects)
            pos[0] += spacing
            return [pos]
        }
    }

    static CIRCLE(maxRadius, minRadius) {
        maxRadius??=100
        minRadius??=0

        maxRadius = maxRadius/AudioDisplay.MAX_NORMALISED_DATA_VALUE
        return (render, bin, pos, accumulator, audioDisplay, i, sampleCount)=>{
            let maxValue = accumulator??0
            if (bin > maxValue) maxValue = bin
            if (i==sampleCount-1) render.batchStroke(Render.getArc(pos, minRadius+maxRadius*maxValue), audioDisplay._color, audioDisplay.visualEffects)
            return [,maxValue]
        }
    }

    static TOP_WAVE(maxHeight, minHeight, spacing, precision) {
        maxHeight??=100
        minHeight??=0
        spacing??=1
        precision??=2

        maxHeight = maxHeight/AudioDisplay.MAX_NORMALISED_DATA_VALUE
        return (render, bin, pos, accumulator, audioDisplay, i, sampleCount)=>{
            const barHeight = minHeight+maxHeight*bin
            if (!i) {
                accumulator = new Path2D()
                accumulator.moveTo(pos[0], pos[1]+barHeight)
            } else if (i%precision==0) accumulator.lineTo(pos[0], pos[1]+barHeight)
            
            if (i==sampleCount-1) render.stroke(accumulator, audioDisplay._color, audioDisplay.visualEffects)
            pos[0] += spacing
                
            return [pos, accumulator]
        }
    }

    // TODO GET/SET
    //get isWorking() {return this._source.canPlayType("audio/")} lol maybe
    static TEST(maxSize) {
        maxSize ??= 100;
        let a = 100
    
        return (render, bin, pos, accumulator, audioDisplay, i) => {
            const size = bin * maxSize;
            const path = Render.getArc(pos, size);
            if (i%a==0) render.batchStroke(path, audioDisplay._color, audioDisplay.visualEffects);
    
            return [pos];
        };
    }
    
}