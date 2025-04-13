// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// Represents the user's keyboard
class TypingDevice {
    constructor() {
        this._keysPressed = [] // Current keys pressed (down)
    }

    setDown(e) {
        let key = e.key
        if (key) {
            key = key.toUpperCase()
            if (!this.isDown(key)) this._keysPressed.push({key, keyCode:e.keyCode})
        }
    }

    setUp(e) {
        let key = e.key
        if (key) {
            key = key.toUpperCase()
            if (this.isDown(key)) this._keysPressed = this._keysPressed.filter(v=>v.key!==key)
        }
    }

    isDown(key) {
        return Boolean(this._keysPressed.find(v=>v.key==key.toUpperCase()))
    }

    hasKeysDown() {
        return Boolean(this._keysPressed.length)
    }

    get keysPressedRaw() {return this._keysPressed}
    get keysPressed() {return this._keysPressed.map(v=>v.key)}
    get keyCodesPressed() {return this._keysPressed.map(v=>v.keyCode)}

	set keysPressed(keysPressed) {this._keysPressed = keysPressed}
}