// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// todo doc
class AudioDisplay extends _BaseObj {
    static SUPPORTED_AUDIO_FORMATS = ["TODO"]
    static SOURCE_TYPES = {FILE_PATH:"string", DYNAMIC:"[object Object]", CAMERA:"CAMERA", CAPTURE:"CAPTURE", VIDEO:HTMLVideoElement, AUDIO:HTMLAudioElement}

    /**
     TODO

    - initialize, draw
    - get waveForm bins
    - different types of display (waveForm sineWave, etc?)

    - some utility functions: play, stop, volume, etc & maybe some audio modifiers

     documentation

     */

    constructor(source, pos, sampleCount, size, type, setupCB, anchorPos, alwaysActive) {
        super(pos, null, setupCB, anchorPos, alwaysActive)
        this._source = source??""            // the initial source of the displayed audio
        this._size = size                   
        this._data = null                    // the usable data source

        this._parent = null  // the parent object (Canvas)
        this._rotation = 0   // the audio display's rotation in degrees 
        this._scale = [1,1]  // the audio display's scale factors: [scaleX, scaleY]
    }

    initialize() {
        // load if file
        // load if url
        // load if video/audio html el
        // load if desktop audio
        // laod if camera audio
    }

    draw(render, time, deltaTime) {
        if (this.initialized) {
            const ctx = render.ctx, x = this.centerX, y = this.centerY, hasScaling = this._scale[0]!==1||this._scale[1]!==1, hasTransforms = this._rotation||hasScaling

            if (hasTransforms) {
                ctx.translate(x, y)
                if (this._rotation) ctx.rotate(CDEUtils.toRad(this._rotation))
                if (hasScaling) ctx.scale(this._scale[0], this._scale[1])
                ctx.translate(-x, -y)
            }

            //render.drawImage(this._data, this._pos, this._size, this._sourceCroppingPositions)

            if (hasTransforms) ctx.setTransform(1,0,0,1,0,0)
        }
        super.draw(time, deltaTime)
    }

    // Rotates the audio display clock-wise by a specified degree increment around its center pos
    rotateBy(deg) {
        this._rotation = (this._rotation+deg)%360
    }

    // Rotates the audio display to a specified degree around its center pos
    rotateAt(deg) {
        this._rotation = deg%360
    }

    // Smoothly rotates the audio display to a specified degree around its center pos
    rotateTo(deg, time=1000, easing=Anim.easeInOutQuad, isUnique=false, force=false) {
        const ir = this._rotation, dr = deg-this._rotation
        return this.playAnim(new Anim((prog)=>this.rotateAt(ir+dr*prog), time, easing), isUnique, force)
    }

    // Scales the audio display by a specified amount [scaleX, scaleY] from its center pos
    scaleBy(scale) {
        let [scaleX, scaleY] = scale
        if (!CDEUtils.isDefined(scaleX)) scaleX = this._scale[0]
        if (!CDEUtils.isDefined(scaleY)) scaleY = this._scale[1]
        this._scale[0] *= scaleX
        this._scale[1] *= scaleY
    }

    // Scales the audio display to a specified amount [scaleX, scaleY] from its pos
    scaleAt(scale) {
        this.scale = scale
    }

    // Smoothly scales the audio display to a specified amount [scaleX, scaleY] from its center pos
    scaleTo(scale, time=1000, easing=Anim.easeInOutQuad, centerPos=this.pos, isUnique=false, force=false) {
        const is = CDEUtils.unlinkArr2(this._scale), dsX = scale[0]-is[0], dsY = scale[1]-is[1]

        return this.playAnim(new Anim(prog=>this.scaleAt([is[0]+dsX*prog, is[1]+dsY*prog], centerPos), time, easing), isUnique, force)
    }

    // returns a separate copy of this AudioDisplay instance
    //duplicate(source=this._source, pos=this.pos_, size=this._size, setupCB=this._setupCB, anchorPos=this._anchorPos, alwaysActive=this._alwaysActive) {
    //    return this.initialized ? new ImageDisplay(source, pos, size, setupCB, anchorPos, alwaysActive) : null
    //}
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