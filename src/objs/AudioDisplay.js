// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// todo doc
class AudioDisplay extends _BaseObj {
    static SUPPORTED_FORMATS = ["mp4","webm","ogv","mov","avi","mkv","flv","wmv","3gp","m4v", "mp3", "wav", "ogg", "aac", "m4a", "opus", "flac"]
    static SOURCE_TYPES = {FILE_PATH:"string", DYNAMIC:"[object Object]", MICROPHONE:"MICROPHONE", SCREEN_AUDIO:"SCREEN_AUDIO", VIDEO:HTMLVideoElement, AUDIO:HTMLAudioElement}

    /**
     TODO

    - initialize, draw
    - get waveForm bins
    - different types of display (waveForm sineWave, etc?)
    - rotation/scale
    - custom sample count
    - auto spacing given a max width
    - make offset work

    - good camera/capture default audio settings

    - some utility functions: play, stop, volume, etc & maybe some audio modifiers

     documentation

     */

    #buffer_ll = null
    #dataStep = null
    #data = null
    #fft = null
    constructor(source, pos, color, sampleCount, spacing, maxHeight, barWidth, offsetPourcent, type, setupCB, loopCB, anchorPos, alwaysActive) {
        super(pos, color, setupCB, loopCB, anchorPos, alwaysActive)
        this._source = source??""            // the initial source of the displayed audio
        this._sampleCount = sampleCount
        this._spacing = spacing
        this._maxHeight = maxHeight
        this._barWidth = barWidth??2
        this._offsetPourcent = offsetPourcent??0


        this._audioCtx = new AudioContext()
        this._audioAnalyser = this._audioCtx.createAnalyser()
        this.#fft = this._audioAnalyser.fftSize = sampleCount<32?32:2**Math.round(Math.log2(sampleCount))
        this.#buffer_ll = this._audioAnalyser.frequencyBinCount
        this.#data = new Uint8Array(this.#buffer_ll)
        this.#dataStep = Math.round(this.#buffer_ll/sampleCount)
    }

    initialize() {
        // load if file
        // load if url
        // load if video/audio html el
        // load if desktop audio
        // lodd if camera audio
        AudioDisplay.initializeDataSource(this._source, (audio)=>{
            this._source = audio

            this._audioCtx.createMediaElementSource(audio).connect(this._audioAnalyser)
            this._audioAnalyser.connect(this._audioCtx.destination)





            this._initialized = true
            if (CDEUtils.isFunction(this._setupCB)) this._setupResults = this._setupCB(this, this._parent, this._source)
        })

        this._pos = this.getInitPos()||_BaseObj.DEFAULT_POS
        this.setAnchoredPos()
    }

    draw(render, time, deltaTime) {
        if (this.initialized) {
            const ctx = render.ctx, x = this.x, y = this.y, hasScaling = this._scale[0]!==1||this._scale[1]!==1, hasTransforms = this._rotation||hasScaling
            if (hasTransforms) {
                ctx.translate(x, y)
                if (this._rotation) ctx.rotate(CDEUtils.toRad(this._rotation))
                if (hasScaling) ctx.scale(this._scale[0], this._scale[1])
                ctx.translate(-x, -y)
            }


            let atX = x
            this._audioAnalyser.getByteFrequencyData(this.#data)
            const spacing = this._spacing, barHeight = this._maxHeight, offset = this._offsetPourcent*this.#fft, adjusted_ll = this._sampleCount-offset
            for (let ii=-offset,i=offset>>0;ii<adjusted_ll;ii++,i=(i+1)%this.#fft) {
                const v = this.#data[i*this.#dataStep]/128, y2 = (v*barHeight)/2
                //if (!v) break;
                render.fill(Render.getRect([atX, y], this._barWidth, y2), this._color)
                atX += spacing
            }
            console.log(atX, adjusted_ll)
            


            if (hasTransforms) ctx.setTransform(1,0,0,1,0,0)
        }
        super.draw(time, deltaTime)
    }

    static initializeDataSource(dataSrc, loadCallback) {
        const types = AudioDisplay.SOURCE_TYPES
        if (typeof dataSrc===types.FILE_PATH && AudioDisplay.SUPPORTED_FORMATS.includes(dataSrc.split(".")[dataSrc.split(".").length-1])) AudioDisplay.#initVideoAudioDataSource(AudioDisplay.loadAudio(dataSrc), loadCallback)
        else if (dataSrc.toString()===types.DYNAMIC) {
            if (dataSrc.type===types.MICROPHONE) AudioDisplay.#initMicrophoneDataSource(dataSrc.settings, loadCallback)
            else if (dataSrc.type===types.SCREEN_AUDIO) AudioDisplay.#initScreenAudioDataSource(dataSrc.settings, loadCallback)
        } else if (dataSrc instanceof types.VIDEO) AudioDisplay.#initVideoAudioDataSource(dataSrc, loadCallback)
    }

    // Initializes a video data source
    static #initVideoAudioDataSource(dataSource, loadCallback) {
        const initLoad=()=>{if (CDEUtils.isFunction(loadCallback)) loadCallback(dataSource)}
        if (dataSource.readyState) initLoad()
        else dataSource.onloadeddata=initLoad
    }

    // Initializes a camera audio capture data source
    static #initMicrophoneDataSource(settings=true, loadCallback) {
        navigator.mediaDevices.getUserMedia({audio:settings}).then(src=>{
            const audio = new Audio()
            audio.srcObject = src
            audio.autoplay = true
            audio.setAttribute("permaLoad", "1")
            audio.oncanplay=()=>{if (CDEUtils.isFunction(loadCallback)) loadCallback(audio)}
        })
    }

    // Initializes a screen audio capture data source
    static #initScreenAudioDataSource(settings=true, loadCallback) {
        navigator.mediaDevices.getDisplayMedia({audio:settings}).then(src=>{
            const audio = new Audio()
            audio.srcObject = src
            audio.autoplay = true
            audio.setAttribute("permaLoad", "1")
            audio.oncanplay=()=>{if (CDEUtils.isFunction(loadCallback)) loadCallback(audio)}
        })
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
    static loadMircophone(resolution, facingMode, frameRate) {
        resolution??=ImageDisplay.DEFAULT_CAMERA_RESOLUTION
        return {
            type:ImageDisplay.SOURCE_TYPES.CAMERA,
            settings:{
                width:{ideal:resolution?.[0]},
                height:{ideal:resolution?.[1]},
                facingMode:facingMode??ImageDisplay.DEFAULT_FACING_MODE,
                frameRate:frameRate??ImageDisplay.DEFAULT_CAMERA_FRAME_RATE,
            }
        }
    }

    // Returns a usable screen capture source TODO
    static loadScreenAudio(resolution, cursor, frameRate, mediaSource) {
        resolution??=ImageDisplay.DEFAULT_CAPTURE_RESOLUTION
        return {
            type:ImageDisplay.SOURCE_TYPES.CAPTURE,
            settings:{
                mediaSource:mediaSource??ImageDisplay.DEFAULT_CAPTURE_MEDIA_SOURCE,
                frameRate:frameRate??ImageDisplay.DEFAULT_CAPTURE_FRAME_RATE,
                cursor:cursor??ImageDisplay.DEFAULT_CAPTURE_CURSOR,
                width:{ideal:resolution?.[0]},
                height:{ideal:resolution?.[1]}
            }
        }
    }


    update() {
        // todo
    }




    // TODO GET/SET
    //get isWorking() {return this._source.canPlayType("audio/")}

}

/* EXAMPLE

const audioContext = new AudioContext();
const audio = new Audio();
audio.src = './img/song.mp3';
audio.volume = 0.01;

const sourceNode = audioContext.createMediaElementSource(audio);
const analyser = audioContext.createAnalyser();
sourceNode.connect(analyser);
analyser.connect(audioContext.destination);

analyser.fftSize = 1024;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function drawWaveform() {
    requestAnimationFrame(drawWaveform);
    analyser.getByteFrequencyData(dataArray);

    CVS.clear();
    let x = 0;
    const barWidth = CVS.width / bufferLength;

    for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * CVS.height) / 2;
        CVS.render.fill(Render.getRect([x, 150], 2, y), [0, 255, 0, 1]);
        x += barWidth;
    }
}

document.addEventListener("click", () => {
    audioContext.resume().then(() => {
        audio.play();
    });
});

audio.onplay = drawWaveform;


*/