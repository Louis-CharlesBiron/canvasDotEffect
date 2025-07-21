// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

class AudioDisplay extends _BaseObj {
    static LOADED_IR_BUFFERS = []
    static SUPPORTED_AUDIO_FORMATS = ["mp3", "wav", "ogg", "aac", "m4a", "opus", "flac"]
    static SOURCE_TYPES = {FILE_PATH:"string", DYNAMIC:"[object Object]", MICROPHONE:"MICROPHONE", SCREEN_AUDIO:"SCREEN_AUDIO", VIDEO:HTMLVideoElement, AUDIO:HTMLAudioElement}
    static MINIMAL_FFT = 1
    static MAXIMAL_FFT = 32768
    static DEFAULT_SAMPLE_COUNT = 64
    static DEFAULT_BINCB = (render, bin, pos, audioDisplay)=>{
        const barWidth = 2, barHeight = 100*bin, spacing = 5
        render.batchFill(Render.getRect(pos, barWidth, barHeight), audioDisplay._color, audioDisplay.visualEffects)
        pos[0] += spacing
        return [pos]
    }
    static DEFAULT_BINCB_TRANSFORMABLE = (render, bin, pos, audioDisplay)=>{
        const barWidth = 2, barHeight = 100*bin, spacing = 5
        render.fill(Render.getRect(pos, barWidth, barHeight), audioDisplay._color, audioDisplay.visualEffects)
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
    static DEFAULT_MICROPHONE_SETTINGS = AudioDisplay.loadMicrophone()
    static DEFAULT_SCREEN_AUDIO_SETTINGS = AudioDisplay.loadScreenAudio()
    static MAX_NORMALISED_DATA_VALUE = 255/128
    static MAX_DELAY_TIME = 179
    static ERROR_TYPES = {NO_PERMISSION:0, DEVICE_IN_USE:1, SOURCE_DISCONNECTED:2, FILE_NOT_FOUND:3, NOT_AVAILABLE:4, NOT_SUPPORTED:5}
    static BIQUAD_FILTER_TYPES = {DEFAULT:"allpass", ALLPASS:"allpass", BANDPASS:"bandpass", HIGHPASS:"highpass", HIGHSHELF:"highshelf", LOWPASS:"lowpass", LOWSHELF:"lowshelf", NOTCH:"notch", PEAKING:"peaking"}
    static IS_MICROPHONE_SUPPORTED = ()=>!!navigator?.mediaDevices?.getUserMedia
    static IS_SCREEN_ADUIO_SUPPORTED = ()=>!!navigator?.mediaDevices?.getDisplayMedia

    #buffer_ll = null // the length of data
    #data = null      // the fft data values (raw bins)
    #fft = null       // the fftSize

    /**
     * Displays audio as an object
     * @param {AudioDisplay.SOURCE_TYPES?} source: the source of the audio 
     * @param {[x,y]?} pos: the pos of the object 
     * @param {Color | String | [r,g,b,a]?} color: the color of the object
     * @param {Function?} binCB: a function called for each bin of the audio, used to create the display. (render, bin, atPos, audioDisplay, accumulator, i, sampleCount, rawBin)=>{... return? [ [newX, newY], newAccumulatorValue ]}
     * @param {Number?} sampleCount: the max count of bins, (fftSize is calculated by the nearest valid value). Ex: if sampleCount is "32" and the display style is "BARS", 32 bars will be displayed
     * @param {Boolean?} disableAudio: whether the audio output is disabled or not (does not affect the visual display)
     * @param {Number?} offsetPourcent: the offset pourcent (0..1) in the bins order when calling binCB
     * @param {Function?} errorCB: a function called if there is an error with the source (errorType, e?)=>
     * @param {Function?} setupCB: function called on object's initialization (this, parent)=>{...}
     * @param {Function?} loopCB: function called each frame for this object (this)=>{...}
     * @param {[x,y] | Function | _BaseObj ?} anchorPos: reference point from which the object's pos will be set. Either a pos array, a callback (this, parent)=>{return [x,y] | _baseObj} or a _BaseObj inheritor
     * @param {Number | Boolean ?} activationMargin: the pixel margin amount from where the object remains active when outside the canvas visual bounds. If "true", the object will always remain active.
     */
    constructor(source, pos, color, binCB, sampleCount, disableAudio, offsetPourcent, errorCB, setupCB, loopCB, anchorPos, activationMargin) {
        super(pos, color, setupCB, loopCB, anchorPos, activationMargin)
        this._source = source??""                                         // the source of the audio
        this._binCB = binCB??AudioDisplay.DEFAULT_BINCB                   // callback called for each bin of the audio, use this to create the display (render, bin, atPos, audioDisplay, accumulator, i, sampleCount, rawBin)=>{... return? [ [newX, newY], newAccumulatorValue ]}
        this._sampleCount = sampleCount??AudioDisplay.DEFAULT_SAMPLE_COUNT// the max count of bins, (fftSize is calculated by the nearest valid value). Ex: if sampleCount is "32" and the display style is "BARS", 32 bars will be displayed
        this._disableAudio = disableAudio??false                          // whether the audio output is disabled or not (does not affect the visual display) 
        this._offsetPourcent = offsetPourcent??0                          // the offset pourcent (0..1) in the bins when calling binCB. 
        this._errorCB = errorCB                                           // a callback called if there is an error with the source (errorType, e?)=>
        this._transformable = 0                                           // if above 0, allows transformations with non batched canvas operations

        // audio stuff
        this._audioCtx = new AudioContext()
        Canvas.addOnFirstInteractCallback(()=>this._audioCtx.resume())
        this._audioAnalyser = this._audioCtx.createAnalyser()
        this._gainNode = this._audioCtx.createGain()
        this._biquadFilterNode = this._audioCtx.createBiquadFilter()
        this._biquadFilterNode.type = AudioDisplay.BIQUAD_FILTER_TYPES.DEFAULT
        this._convolverNode = this._audioCtx.createConvolver()
        this._waveShaperNode = this._audioCtx.createWaveShaper()
        this._dynamicsCompressorNode = this._audioCtx.createDynamicsCompressor()
        this._pannerNode = this._audioCtx.createPanner()
        this._delayNode = this._audioCtx.createDelay(AudioDisplay.MAX_DELAY_TIME)
        this.#fft = this._audioAnalyser.fftSize = Math.max(32, 2**Math.round(Math.log2(this._sampleCount*2)))
        this.#buffer_ll = this._audioAnalyser.frequencyBinCount
        this.#data = new Uint8Array(this.#buffer_ll)
    }

    initialize() {
        this.initializeSource()
        this._pos = this.getInitPos()||_BaseObj.DEFAULT_POS
        this.setAnchoredPos()
        super.initialize()
    }

    draw(render, time, deltaTime) {
        if (this.initialized) {
            const ctx = render.ctx, hasScaling = this._scale[0]!==1||this._scale[1]!==1, hasTransforms = this._rotation||hasScaling, data = this.#data

            let viewPos
            if (this._transformable) {
                if (hasTransforms) {
                    const cx = this._pos[0], cy = this._pos[1]
                    viewPos = this.parent.viewPos
                    ctx.translate(cx, cy)
                    if (this._rotation) ctx.rotate(CDEUtils.toRad(this._rotation))
                    if (hasScaling) ctx.scale(this._scale[0], this._scale[1])
                    ctx.translate(-cx, -cy)
                }
            }
   
            this._audioAnalyser.getByteFrequencyData(data)
            let atPos = this.pos_, accumulator = null, smapleCount = this._sampleCount, offset = (this._offsetPourcent%1)*(this.#fft/2), adjusted_ll = Math.round(0.49+smapleCount)-offset, ii=-offset, i=offset>>0
            for (;ii<adjusted_ll;ii++,i=(i+1)%smapleCount) {
                const bin = data[i], res = this._binCB(render, bin/128, atPos, this, accumulator, i, smapleCount, bin), newPos = res?.[0], newAcc = res?.[1]
                if (newPos) atPos = newPos
                if (newAcc) accumulator = newAcc
            }

            if (this._transformable && hasTransforms) ctx.setTransform(1,0,0,1,viewPos[0],viewPos[1])
        }
        super.draw(time, deltaTime)
    }

    // updates the "transformable" attribute according to whether any rotation/scale are set
    #updateTransformable() {
        const hasTransforms = this._rotation || this._scale[0]!=1 || this._scale[1]!=1
        if (hasTransforms && this._transformable < 2) this._transformable = 2
        else if (!hasTransforms && this._transformable) this._transformable--
    }

    /**
     * (UNRELIABLE WITH AudioDisplay) Returns whether the provided pos is in the audio display
     * @param {[x,y]} pos: the pos to check 
     * @param {Number | [paddingTop, paddingRight?, paddingBottom?, paddingLeft?] ?} padding: the padding added to the validity area
     * @param {Number?} rotation: the rotation in degrees of the area
     * @param {[scaleX, scaleY]?} scale: the scale of the area
     * @returns whether the provided pos is in the audio display
     */
    isWithin(pos, padding, rotation, scale) {
        return super.isWithin(pos, this.getBounds(padding, rotation, scale), padding)
    }

    // (UNRELIABLE WITH AudioDisplay) returns the raw a minimal rectangular area containing all of the audio display (no scale/rotation)
    #getRectBounds(binWidth=2, binHeight=100, binSpacing=5) {
        const pos = this._pos, sizeX = this._sampleCount*(binWidth*binSpacing)/2
        return [[pos[0],pos[1]], [pos[0]+sizeX,pos[1]+binHeight*2]]
    }

    /**
     * (UNRELIABLE WITH AudioDisplay) returns the center pos of the audio display
     */
    getCenter() {
        return super.getCenter(this.#getRectBounds())
    }

    /**
     * (UNRELIABLE WITH AudioDisplay) returns the minimal rectangular area containing all of the audio display
     * @param {Number | [paddingTop, paddingRight?, paddingBottom?, paddingLeft?] ?} padding: the padding added to the validity area
     * @param {Number?} rotation: the rotation in degrees of the area
     * @param {[scaleX, scaleY]?} scale: the scale of the area
     * @returns the area positions [[x1,y1], [x2,y2]]
     */
    getBounds(padding, rotation=this._rotation, scale=this._scale) {
        const positions = this.#getRectBounds()
        return super.getBounds(positions, padding, rotation, scale, this._pos)
    }

    // Final source initializes step
    initializeSource(source=this._source) {
        AudioDisplay.initializeDataSource(source, (audio, isStream)=>{
            this._source = audio

            if (isStream) {
                audio.oninactive=e=>{if (CDEUtils.isFunction(this._errorCB)) this._errorCB(AudioDisplay.ERROR_TYPES.SOURCE_DISCONNECTED, source, e)}
                this._source = this._audioCtx.createMediaStreamSource(audio)
                this._source.connect(this._gainNode)
            } else this._audioCtx.createMediaElementSource(audio).connect(this._gainNode)
            
            this._gainNode.connect(this._biquadFilterNode)
            this._biquadFilterNode.connect(this._waveShaperNode)
            this._waveShaperNode.connect(this._dynamicsCompressorNode)
            this._dynamicsCompressorNode.connect(this._pannerNode)
            this._pannerNode.connect(this._delayNode)
            this._delayNode.connect(this._audioAnalyser)
            if (!this._disableAudio) this._audioAnalyser.connect(this._audioCtx.destination)

            this._initialized = true
            if (CDEUtils.isFunction(this._setupCB)) this._setupResults = this._setupCB(this, this._parent, this._source)
        }, this._errorCB)
    }

    /**
     * Initializes a AudioDisplay data source
     * @param {AudioDisplay.SOURCE_TYPES} dataSrc: the source of the audio 
     * @param {Function?} loadCallback: a function called upon source load (audioElement, isStream)=>
     * @param {Function?} errorCB: a function called if there is an error with the source (errorType, dataSrc, e?)=>
     */
    static initializeDataSource(dataSrc, loadCallback, errorCB) {
        const types = AudioDisplay.SOURCE_TYPES
        if (typeof dataSrc==types.FILE_PATH) {
            if (AudioDisplay.isAudioFormatSupported(dataSrc)) AudioDisplay.#initAudioDataSource(AudioDisplay.loadAudio(dataSrc), loadCallback, errorCB)
            else if (ImageDisplay.isVideoFormatSupported(dataSrc)) AudioDisplay.#initAudioDataSource(ImageDisplay.loadVideo(dataSrc), loadCallback, errorCB)
            else if (CDEUtils.isFunction(errorCB)) errorCB(AudioDisplay.ERROR_TYPES.NOT_SUPPORTED, dataSrc) 
        } else if (dataSrc.toString()==types.DYNAMIC) {
            if (dataSrc.type==types.MICROPHONE) AudioDisplay.#initMicrophoneDataSource(dataSrc.settings, loadCallback, errorCB)
            else if (dataSrc.type==types.SCREEN_AUDIO) AudioDisplay.#initScreenAudioDataSource(dataSrc.settings, loadCallback, errorCB)
        } else if (dataSrc instanceof types.VIDEO || dataSrc instanceof types.AUDIO) AudioDisplay.#initAudioDataSource(dataSrc, loadCallback, errorCB)
        else if (dataSrc instanceof MediaStream) {
            if (dataSrc.getAudioTracks().length && CDEUtils.isFunction(loadCallback)) loadCallback(dataSrc, true)
            else if (CDEUtils.isFunction(errorCB)) errorCB(AudioDisplay.ERROR_TYPES.NO_AUDIO_TRACK, dataSrc)
        }
    }

    // Initializes a audio data source
    static #initAudioDataSource(dataSource, loadCallback, errorCB) {
        const initLoad=()=>{if (CDEUtils.isFunction(loadCallback)) loadCallback(dataSource)}
        dataSource.onerror=e=>{if (CDEUtils.isFunction(errorCB)) errorCB(AudioDisplay.ERROR_TYPES.FILE_NOT_FOUND, dataSource, e)}
        if (dataSource.readyState) initLoad()
        else dataSource.onloadeddata=initLoad
    }

    // Initializes a camera audio capture data source
    static #initMicrophoneDataSource(settings=true, loadCallback, errorCB) {
        if (AudioDisplay.IS_MICROPHONE_SUPPORTED()) navigator.mediaDevices.getUserMedia({audio:settings}).then(src=>{
            if (src.getAudioTracks().length && CDEUtils.isFunction(loadCallback)) loadCallback(src, true)
            else if (CDEUtils.isFunction(errorCB)) errorCB(AudioDisplay.ERROR_TYPES.NO_AUDIO_TRACK, settings)
        }).catch(e=>{if (CDEUtils.isFunction(errorCB)) errorCB(AudioDisplay.ERROR_TYPES.NO_PERMISSION, settings, e)})
        else if (CDEUtils.isFunction(errorCB)) errorCB(AudioDisplay.ERROR_TYPES.NOT_AVAILABLE, settings)
    }

    // Initializes a screen audio capture data source
    static #initScreenAudioDataSource(settings=true, loadCallback, errorCB) {
        if (AudioDisplay.IS_MICROPHONE_SUPPORTED()) navigator.mediaDevices.getDisplayMedia({audio:settings}).then(src=>{
            if (src.getAudioTracks().length && CDEUtils.isFunction(loadCallback)) loadCallback(src, true)
            else if (CDEUtils.isFunction(errorCB)) errorCB(AudioDisplay.ERROR_TYPES.NO_AUDIO_TRACK, settings)
        }).catch(e=>{if (CDEUtils.isFunction(errorCB)) errorCB(AudioDisplay.ERROR_TYPES.NO_PERMISSION, settings, e)})
        else if (CDEUtils.isFunction(errorCB)) errorCB(AudioDisplay.ERROR_TYPES.NOT_AVAILABLE, settings)
    }

    /**
     * Returns a usable audio source
     * @param {String} src: the source of the audio
     * @param {Boolean?} looping: whether the audio loops
     * @param {Boolean?} autoPlay: whether the audio autoplays
     * @returns a Audio instance
     */
    static loadAudio(path, looping=true, autoPlay=true) {
        const audio = new Audio(path)
        audio.preload = "auto"
        audio.loop = looping
        if (autoPlay) {
            audio.autoplay = autoPlay
            ImageDisplay.playMedia(audio)
        }
        return audio
    }

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
    static loadMicrophone(autoGainControl, echoCancellation, noiseSuppression, isStereo, delay, sampleRate, sampleSize) {
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

    /**
     * Provides a generic customizable distortion curve to use with the waveShaperNode.curve (based on https://stackoverflow.com/questions/22312841/waveshaper-node-in-webaudio-how-to-emulate-distortion)
     * @param {Number} intensity: the intensity of the distortion curve
     * @param {Number?} sampleCount: the distortion curve size
     * @returns the generated distortion curve 
     */
    static getDistortionCurve(intensity, sampleCount=44100) {
        if (!intensity) return null

        let curve = new Float32Array(sampleCount), i=0, PI = Math.PI, abs = Math.abs, TO_DEGREES = CDEUtils.TO_DEGREES
        for (;i<sampleCount;i++) {
            const x = i*2/sampleCount-1
            curve[i] = (3+intensity)*x*20*TO_DEGREES/(PI+intensity*abs(x))
        }
        return curve
    }

    /**
     * Connects the convolverNode to the audio chain
     */
    connectConvolver() {
        this._biquadFilterNode.disconnect(0)
        this._biquadFilterNode.connect(this._convolverNode)
        this._convolverNode.connect(this._dynamicsCompressorNode)
    }

    /**
     * Disconnects the convolverNode from the audio chain
     */
    disconnectConvolver() {
        this._biquadFilterNode.disconnect(0)
        this._biquadFilterNode.connect(this._dynamicsCompressorNode)
    }

    /**
     * Loads a impulse response file into a usable buffer
     * @param {String} src: the source of the impulse response file 
     * @param {Function?} readyCallback: a function called once the file is loaded
     */
    loadImpulseResponse(src, readyCallback=buffer=>{this.setReverb(buffer);this.connectConvolver()}) {
        fetch(src).then(res=>res.arrayBuffer()).then(data=>this._audioCtx.decodeAudioData(data)).then(buffer=>{
            AudioDisplay.LOADED_IR_BUFFERS.push(buffer)
            if (CDEUtils.isFunction(readyCallback)) readyCallback(buffer)
        })
    }

    /**
     * Sets the volume of the audio 
     * @param {Number?} gain: the gain value
     */
    setVolume(gain=1) {
        this._gainNode.gain.value = gain
    }

    /**
     * Sets the filter type of the biquadFilterNode
     * @param {AudioDisplay.BIQUAD_FILTER_TYPES} filterType: the type of filter to use
     */
    setBiquadFilterType(filterType=AudioDisplay.BIQUAD_FILTER_TYPES.DEFAULT) {
        this._biquadFilterNode.type = filterType
    }

    /**
     * Sets the distortion curve of the waveShaperNode
     * @param {Number?} intensity: the intensity of the distortion curve. Defaults to no distortion
     */
    setDistortionCurve(intensity=null) {
        this._waveShaperNode.curve = typeof intensity=="number" ? AudioDisplay.getDistortionCurve(intensity) : intensity
    }

    /**
     * Sets the 3D position of the audio's origin
     * @param {Number?} x: the x position
     * @param {Number?} y: the y position
     * @param {Number?} z: the z position
     * @param {Number?} secondsOffset: the time offset in seconds
     */
    setOriginPos(x=0, y=0, z=0, secondsOffset=0) {
        const time = this._audioCtx.currentTime
        if (x!=null) this._pannerNode.positionX.setValueAtTime(x, time+secondsOffset)
        if (y!=null) this._pannerNode.positionY.setValueAtTime(y, time+secondsOffset)
        if (z!=null) this._pannerNode.positionZ.setValueAtTime(z, time+secondsOffset)
    }

    /**
     * Sets the audio feedback delay
     * @param {Number?} seconds: the delay value
     */
    setDelay(seconds=0) {
        this._delayNode.delayTime.value = seconds > AudioDisplay.MAX_DELAY_TIME ? AudioDisplay.MAX_DELAY_TIME : seconds
    }

    /**
     * Sets the convolverNode impulse response buffer
     * @param {AudioBuffer} buffer: the impulse response buffer to use
     */
    setReverb(buffer=null) {
        if (buffer) this._convolverNode.buffer = buffer
        else this.disconnectConvolver()
    }
    
    /**
     * resets all audio modifiers to their default values (no audio changes)
     */
    resetAudioModifiers() {
        this.setVolume()
        this.setBiquadFilterType()
        this.setDistortionCurve()
        this.setOriginPos()
        this.setDelay()
        this.setReverb()
    }

    /**
     * Returns whether the provided audio file type is supported
     * @param {String | File} file: the file or filename 
     * @returns Whether the audio file is supported or not
     */
    static isAudioFormatSupported(file) {
        const name = (file?.name||file).toLowerCase()
        return AudioDisplay.SUPPORTED_AUDIO_FORMATS.some(ext=>name.endsWith("."+ext))
    }

    /**
     * @returns Returns all the supported file formats in a string usable in a HTML file input
     */
    static getSupportedHTMLAcceptValue() {
        return "."+AudioDisplay.SUPPORTED_AUDIO_FORMATS.join(", .")
    }

    /**
     * Returns the name of the errors
     * @param {AudioDisplay.ERROR_TYPES} errorCode: The error code contained in ERROR_TYPES
     * @returns the name of the error based on the error code
     */
    static getErrorFromCode(errorCode) {
        return Object.keys(AudioDisplay.ERROR_TYPES)[errorCode]
    }

    /**
     * @returns a separate copy of this AudioDisplay instance (only if initialized)
     */
    duplicate(source=this._source, pos=this.pos_, color=this._color, binCB=this._binCB, sampleCount=this._sampleCount, disableAudio=this._disableAudio, offsetPourcent=this._offsetPourcent, errorCB=this._errorCB, setupCB=this._setupCB, loopCB=this._loopCB, anchorPos=this._anchorPos, activationMargin=this._activationMargin) {
        const colorObject = color, colorRaw = colorObject.colorRaw, audioDisplay = new AudioDisplay(
            source instanceof MediaStreamAudioSourceNode ? source.mediaStream.clone() : source.cloneNode(), 
            pos,
            (_,audioDisplay)=>(colorRaw instanceof Gradient||colorRaw instanceof Pattern)?colorRaw.duplicate(Array.isArray(colorRaw.initPositions)?null:audioDisplay):colorObject.duplicate(),
            binCB,
            sampleCount,
            disableAudio,
            offsetPourcent,
            errorCB,
            setupCB,
            loopCB,
            anchorPos,
            activationMargin
        )
        audioDisplay._scale = CDEUtils.unlinkArr2(this._scale)
        audioDisplay._rotation = this._rotation
        audioDisplay._visualEffects = this.visualEffects_
        
        return this.initialized ? audioDisplay : null
    }

    /**
     * Generic binCB for a waveform display
     * @param {Number?} maxHeight: the maximal height in pixels of the bars
     * @param {Number?} minHeight: the minimal height in pixels of the bars
     * @param {Number?} spacing: the horizontal space in pixels between each bar
     * @param {Number?} barWidth: the width in pixels of each bar
     * @param {Boolean?} transformable: whether the binCB accpets visual effects
     * @returns a usable binCB
     */
    static BARS(maxHeight, minHeight, spacing, barWidth, transformable) {
        maxHeight??=100
        minHeight??=0
        spacing??=1
        barWidth??=2
        
        maxHeight = maxHeight/AudioDisplay.MAX_NORMALISED_DATA_VALUE
        minHeight = minHeight/AudioDisplay.MAX_NORMALISED_DATA_VALUE

        if (transformable) {
            return (render, bin, pos, audioDisplay)=>{
                const barHeight = minHeight+maxHeight*bin
                render.fill(Render.getRect(pos, barWidth, barHeight), audioDisplay._color, audioDisplay.visualEffects)
                pos[0] += spacing
                return [pos]
            }
        } else {
            return (render, bin, pos, audioDisplay)=>{
                const barHeight = minHeight+maxHeight*bin
                render.batchFill(Render.getRect(pos, barWidth, barHeight), audioDisplay._color, audioDisplay.visualEffects)
                pos[0] += spacing
                return [pos]
            }
        }
    }

    /**
     * Generic binCB for a circular display
     * @param {Number?} maxRadius: the maximal radius in pixels
     * @param {Number?} minRadius: the minimal radius in pixels
     * @param {Boolean?} transformable: whether the binCB accpets visual effects
     * @param {Number?} precision: how many bins to skip before drawing a bin. The lower, the prettier, the higher, the most performant.
     * @returns a usable binCB
     */
    static CIRCLE(maxRadius, minRadius, transformable, precision) {
        maxRadius??=100
        minRadius??=0
        precision??=2

        maxRadius = maxRadius/AudioDisplay.MAX_NORMALISED_DATA_VALUE
        minRadius = minRadius/AudioDisplay.MAX_NORMALISED_DATA_VALUE

        if (transformable) {
            return (render, bin, pos, audioDisplay, accumulator, i)=>{
                if (i%precision==0) render.stroke(Render.getArc(pos, minRadius+maxRadius*bin), audioDisplay._color, audioDisplay.visualEffects)
            }
        } else {
            return (render, bin, pos, audioDisplay, accumulator, i)=>{
                if (i%precision==0) render.batchStroke(Render.getArc(pos, minRadius+maxRadius*bin), audioDisplay._color, audioDisplay.visualEffects)
            }
        }
    }

    /**
     * Generic binCB for sin-ish wave display
     * @param {Number?} maxHeight: the maximal height in pixels of the bina
     * @param {Number?} minHeight: the minimal height in pixels of the bina
     * @param {Number?} spacing: the horizontal space in pixels between each bin
     * @param {Boolean?} transformable: whether the binCB accpets visual effects
     * @param {Number?} precision: how many bins to skip before drawing a bin. The lower, the prettier, the higher, the most performant.
     * @returns a usable binCB
     */
    static TOP_WAVE(maxHeight, minHeight, spacing, transformable, precision) {
        maxHeight??=100
        minHeight??=0
        spacing??=1
        precision??=2

        maxHeight = maxHeight/AudioDisplay.MAX_NORMALISED_DATA_VALUE
        minHeight = minHeight/AudioDisplay.MAX_NORMALISED_DATA_VALUE

        if (transformable) {
            return (render, bin, pos, audioDisplay, accumulator, i, sampleCount)=>{
                const barHeight = minHeight+maxHeight*bin
                if (!i) {
                    accumulator = new Path2D()
                    accumulator.moveTo(pos[0], pos[1]+barHeight)
                } else if (i%precision==0) accumulator.lineTo(pos[0], pos[1]+barHeight)
                
                if (i==sampleCount-1) render.stroke(accumulator, audioDisplay._color, audioDisplay.visualEffects)
                pos[0] += spacing
                    
                return [pos, accumulator]
            }
        } else {
            return (render, bin, pos, audioDisplay, accumulator, i, sampleCount)=>{
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
    }

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
    static CLOUD(maxRadius, minRadius, particleRadius, transformable, precision, angleStep) {
        maxRadius??=100
        minRadius??=0
        particleRadius??=2
        precision??=2
        angleStep??=0.1
    
        maxRadius = maxRadius/AudioDisplay.MAX_NORMALISED_DATA_VALUE
        minRadius = minRadius/AudioDisplay.MAX_NORMALISED_DATA_VALUE

        if (transformable) {
            return (render, bin, pos, audioDisplay, accumulator, i) => {
                const radius = minRadius+maxRadius*bin, angle = angleStep*i
                if (!(i%precision)) render.fill(Render.getArc([pos[0]+radius*Math.cos(angle), pos[1]+radius*Math.sin(angle)], particleRadius), audioDisplay._color, audioDisplay.visualEffects)
                return [pos]
            }
        } else {
            return (render, bin, pos, audioDisplay, accumulator, i) => {
                const radius = minRadius+maxRadius*bin, angle = angleStep*i
                if (!(i%precision)) render.batchFill(Render.getArc([pos[0]+radius*Math.cos(angle), pos[1]+radius*Math.sin(angle)], particleRadius), audioDisplay._color, audioDisplay.visualEffects)
                return [pos]
            }
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
    get gainNode() {return this._gainNode}
	get biquadFilterNode() {return this._biquadFilterNode}
	get convolverNode() {return this._convolverNode}
	get waveShaperNode() {return this._waveShaperNode}
	get dynamicsCompressorNode() {return this._dynamicsCompressorNode}
	get pannerNode() {return this._pannerNode}
	get delayNode() {return this._delayNode}
    get data() {return this.#data}
    get fft() {return this.#fft}
    get bufferLength() {return this.#buffer_ll}
    get transformableRaw() {return this._transformable}
    get transformable() {return Boolean(this._transformable)}
    get instanceOf() {return "AudioDisplay"}

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
            else ImageDisplay.playMedia(this._source)
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
    set transformable(transformable) {this._transformable = +transformable}
    set rotation(rotation) {
        super.rotation = rotation
        this.#updateTransformable()
    }
    set scale(scale) {
        super.scale = scale
        this.#updateTransformable()
    }
}