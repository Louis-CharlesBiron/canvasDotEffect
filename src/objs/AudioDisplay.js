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
    static ERROR_TYPES = {NO_PERMISSION:0, NO_AUDIO_TRACK:1, SOURCE_DISCONNECTED:2}
    static BIQUAD_FILTER_TYPES = {DEFAULT:"allpass", ALLPASS:"allpass", BANDPASS:"bandpass", HIGHPASS:"highpass", HIGHSHELF:"highshelf", LOWPASS:"lowpass", LOWSHELF:"lowshelf", NOTCH:"notch", PEAKING:"peaking"}


    /*************
     TODO

    - fix in index.js initialisation
    - some utility functions: play, stop, volume, etc
    - maybe some audio modifiers (see https://mdn.github.io/voice-change-o-matic/)
    - pattern/gradient auto positions

    SEE THIS -> if (this._audioCtx.state === 'suspended') {this._audioCtx.resume().then(() => {console.log('Audio context resumed');});
}
    
    -optimization!
    -documentation

    /*************

let aud = new AudioDisplay("./img/song.mp3", [200,50], "lime", (render, bin, pos, audioDisplay, i)=>{
    const barWidth = 2, barHeight = 100*bin+5, spacing = 5
    render.fill(Render.getRect(pos, barWidth, barHeight), audioDisplay._color)
    pos[0] += spacing
    return pos
}, 64)

CVS.add(aud, true)
*/

    #buffer_ll = null
    #data = null
    #fft = null
    #emptyBuffer = null
    // DOC TODO
    constructor(source, pos, color, binCB, sampleCount, disableAudio, offsetPourcent, errorCB, setupCB, loopCB, anchorPos, alwaysActive) {
        super(pos, color, setupCB, loopCB, anchorPos, alwaysActive)
        this._source = source??""            // the initial source of the displayed audio
        this._binCB = binCB??AudioDisplay.DEFAULT_BINCB // (render, bin, atPos, accumulator audioDisplay, i, sampleCount, rawBin)=>{... return? [ [newX, newY], newAccumulatorValue ]}
        this._sampleCount = sampleCount??AudioDisplay.DEFAULT_SAMPLE_COUNT
        this._disableAudio = disableAudio??false
        this._offsetPourcent = offsetPourcent??0
        this._errorCB = errorCB

        this._audioCtx = new AudioContext()
        this._audioAnalyser = this._audioCtx.createAnalyser()
        this._gainNode = this._audioCtx.createGain()
        this._biquadFilterNode = this._audioCtx.createBiquadFilter()
        this._biquadFilterNode.type = AudioDisplay.BIQUAD_FILTER_TYPES.DEFAULT
        //this._convolverNode = this._audioCtx.createConvolver()
        this._waveShaperNode = this._audioCtx.createWaveShaper()
        this._pannerNode = this._audioCtx.createPanner()
        this._delayNode = this._audioCtx.createDelay()
        this.#fft = this._audioAnalyser.fftSize = Math.max(32, 2**Math.round(Math.log2(this._sampleCount*2)))
        this.#buffer_ll = this._audioAnalyser.frequencyBinCount
        this.#data = new Uint8Array(this.#buffer_ll)
    }

    initialize() {
        this.initializeSource()
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
                const bin = data[i], res = this._binCB(render, bin/128, atPos, accumulator, this, i, this._sampleCount, bin), newPos = res?.[0], newAcc = res?.[1]
                if (newPos) atPos = newPos
                if (newAcc) accumulator = newAcc
            }

            if (hasTransforms) ctx.setTransform(1,0,0,1,0,0)
        }
        super.draw(time, deltaTime)
    }

    // todo doc
    initializeSource(source=this._source) {
        AudioDisplay.initializeDataSource(source, (audio, isStream)=>{
            this._source = audio

            if (isStream) {
                audio.oninactive=e=>{if (CDEUtils.isFunction(this._errorCB)) this._errorCB(AudioDisplay.ERROR_TYPES.SOURCE_DISCONNECTED, e)}
                this._source = this._audioCtx.createMediaStreamSource(audio)
                this._source.connect(this._gainNode)
            } else this._audioCtx.createMediaElementSource(audio).connect(this._gainNode)//
            
            this._gainNode.connect(this._biquadFilterNode)
            this._biquadFilterNode.connect(this._waveShaperNode)
            //this._convolverNode.connect(this._waveShaperNode)
            this._waveShaperNode.connect(this._pannerNode)
            this._pannerNode.connect(this._delayNode)
            this._delayNode.connect(this._audioAnalyser)
            if (!this._disableAudio) this._audioAnalyser.connect(this._audioCtx.destination)

            this._initialized = true
            if (CDEUtils.isFunction(this._setupCB)) this._setupResults = this._setupCB(this, this._parent, this._source)
        }, this._errorCB)
    }

    // Initializes a AudioDisplay data source
    static initializeDataSource(dataSrc, loadCallback, errorCB) {
        const types = AudioDisplay.SOURCE_TYPES
        if (typeof dataSrc==types.FILE_PATH) {
            const extension = dataSrc.split(".")[dataSrc.split(".").length-1]
            if (AudioDisplay.SUPPORTED_AUDIO_FORMATS.includes(extension)) AudioDisplay.#initAudioDataSource(AudioDisplay.loadAudio(dataSrc), loadCallback)
            else if (ImageDisplay.SUPPORTED_VIDEO_FORMATS.includes(extension)) AudioDisplay.#initAudioDataSource(ImageDisplay.loadVideo(dataSrc), loadCallback)
        } else if (dataSrc.toString()==types.DYNAMIC) {
            if (dataSrc.type==types.MICROPHONE) AudioDisplay.#initMicrophoneDataSource(dataSrc.settings, loadCallback, errorCB)
            else if (dataSrc.type==types.SCREEN_AUDIO) AudioDisplay.#initScreenAudioDataSource(dataSrc.settings, loadCallback, errorCB)
        } else if (dataSrc instanceof types.VIDEO) AudioDisplay.#initAudioDataSource(dataSrc, loadCallback)
    }

    // Initializes a audio data source
    static #initAudioDataSource(dataSource, loadCallback) {
        const initLoad=()=>{if (CDEUtils.isFunction(loadCallback)) loadCallback(dataSource)}
        if (dataSource.readyState) initLoad()
        else dataSource.onloadeddata=initLoad
    }

    // Initializes a camera audio capture data source
    static #initMicrophoneDataSource(settings=true, loadCallback, errorCB) {
        navigator.mediaDevices.getUserMedia({audio:settings}).then(src=>{
            if (src.getAudioTracks().length && CDEUtils.isFunction(loadCallback)) loadCallback(src, true)
            else if (CDEUtils.isFunction(errorCB)) errorCB(AudioDisplay.ERROR_TYPES.NO_AUDIO_TRACK)
        }).catch(e=>{if (CDEUtils.isFunction(errorCB)) errorCB(AudioDisplay.ERROR_TYPES.NO_PERMISSION, e)})
    }

    // Initializes a screen audio capture data source
    static #initScreenAudioDataSource(settings=true, loadCallback, errorCB) {
        navigator.mediaDevices.getDisplayMedia({audio:settings}).then(src=>{
            if (src.getAudioTracks().length && CDEUtils.isFunction(loadCallback)) loadCallback(src, true)
            else if (CDEUtils.isFunction(errorCB)) errorCB(AudioDisplay.ERROR_TYPES.NO_AUDIO_TRACK)
        }).catch(e=>{if (CDEUtils.isFunction(errorCB)) errorCB(AudioDisplay.ERROR_TYPES.NO_PERMISSION, e)})
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

    // Returns a usable microphone capture source
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

    // Returns a usable screen audio capture source 
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

    // doc todo
    getEmptyBuffer() {
        return this.#emptyBuffer ? this.#emptyBuffer : this.#emptyBuffer = this._audioCtx.createBuffer(2, 1, this._audioCtx.sampleRate)
    }

    // Returns the likeliness of an audio format/extension to work (ex: "mp3" -> "probably") 
    static isAudioFormatSupported(extension) {return new Audio().canPlayType("audio/"+extension.replaceAll(".",""))||"No"}

    // DOC TODO
    static BARS(maxHeight, minHeight, spacing, barWidth) {
        maxHeight??=100
        minHeight??=0
        spacing??=1
        barWidth??=2
        
        maxHeight = maxHeight/AudioDisplay.MAX_NORMALISED_DATA_VALUE
        minHeight = minHeight/AudioDisplay.MAX_NORMALISED_DATA_VALUE
        return (render, bin, pos, accumulator, audioDisplay)=>{
            const barHeight = minHeight+maxHeight*bin
            render.batchFill(Render.getRect(pos, barWidth, barHeight), audioDisplay._color, audioDisplay.visualEffects)
            pos[0] += spacing
            return [pos]
        }
    }

    static CIRCLE(maxRadius, minRadius, precision) {
        maxRadius??=100
        minRadius??=0
        precision??=2

        maxRadius = maxRadius/AudioDisplay.MAX_NORMALISED_DATA_VALUE
        minRadius = minRadius/AudioDisplay.MAX_NORMALISED_DATA_VALUE
        return (render, bin, pos, accumulator, audioDisplay, i)=>{
            if (i%precision==0) render.batchStroke(Render.getArc(pos, minRadius+maxRadius*bin), audioDisplay._color, audioDisplay.visualEffects)
        }
    }

    static TOP_WAVE(maxHeight, minHeight, spacing, precision) {
        maxHeight??=100
        minHeight??=0
        spacing??=1
        precision??=2

        maxHeight = maxHeight/AudioDisplay.MAX_NORMALISED_DATA_VALUE
        minHeight = minHeight/AudioDisplay.MAX_NORMALISED_DATA_VALUE
        return (render, bin, pos, accumulator, audioDisplay, i, sampleCount)=>{
            const barHeight = minHeight+maxHeight*bin
            if (!i) {
                accumulator = new Path2D()
                accumulator.moveTo(pos[0], pos[1]+barHeight)
            } else if (i%precision==0) accumulator.lineTo(pos[0], pos[1]+barHeight)
            
            if (i==sampleCount-1) render.batchStroke(accumulator, audioDisplay._color, audioDisplay.visualEffects)
            pos[0] += spacing
                
            return [pos, accumulator]
        }
    }

    get source() {return this._source}
	get binCB() {return this._binCB}
	get sampleCount() {return this._sampleCount}
	get disableAudio() {return this._disableAudio}
	get offsetPourcent() {return this._offsetPourcent}
	get errorCB() {return this._errorCB}
	get audioCtx() {return this._audioCtx}
	get audioAnalyser() {return this._audioAnalyser}
    get data() {return this.#data}
    get fft() {return this.#fft}
    get bufferLength() {return this.#buffer_ll}

    get video() {return this._source}
    get image() {return this._source}
    get paused() {return this._source?.paused}
    get isPaused() {return this.paused}
    get playbackRate() {return this._source?.playbackRate}
    get speed() {return this.playbackRate}
    get currentTime() {return this._source?.currentTime}
    get loop() {return this._source?.loop}
    get isLooping() {return this.loop}

    set paused(paused) {
        try {
            if (paused) this._source.pause()
            else this._source.play()
        }catch(e){}
    }
    set isPaused(isPaused) {this.paused = isPaused}
    set playbackRate(playbackRate) {this._source.playbackRate = playbackRate}
    set speed(speed) {this.playbackRate = speed}
    set currentTime(currentTime) {this._source.currentTime = currentTime}
    set loop(loop) {this._source.loop = loop}
    set isLooping(isLooping) {this.loop = isLooping}

	set binCB(_binCB) {this._binCB = _binCB}
	set sampleCount(_sampleCount) {
        this._sampleCount = _sampleCount
        this.#fft = this._audioAnalyser.fftSize = Math.max(32, 2**Math.round(Math.log2(this._sampleCount*2)))
        this.#buffer_ll = this._audioAnalyser.frequencyBinCount
        this.#data = new Uint8Array(this.#buffer_ll)
    }
	set disableAudio(_disableAudio) {
        this._disableAudio = _disableAudio
        if (_disableAudio) this._audioAnalyser.disconnect(this._audioCtx.destination)
        else this._audioAnalyser.connect(this._audioCtx.destination)
    }
	set offsetPourcent(_offsetPourcent) {this._offsetPourcent = _offsetPourcent}
	set errorCB(_errorCB) {this._errorCB = _errorCB}
}