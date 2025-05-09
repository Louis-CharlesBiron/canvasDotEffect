// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don"t use or credit this code as your own.
//

// Represents the user"s keyboard
class TypingDevice {
    static KEYS = {
        A:"A", B:"B", C:"C", D:"D", E:"E", F:"F", G:"G", H:"H", I:"I", J:"J", K:"K", L:"L", M:"M", N:"N", O:"O", P:"P", Q:"Q", R:"R", S:"S", T:"T", U:"U", V:"V", W:"W", X:"X", Y:"Y", Z:"Z",
        "0":"0", "1":"1", "2":"2", "3":"3", "4":"4", "5":"5", "6":"6", "7":"7", "8":"8", "9":"9",
      
        SPACE: " ",
        ENTER: "ENTER",
        TAB: "TAB",
        BACKSPACE: "BACKSPACE",
        ESCAPE: "ESCAPE",
        SHIFT: "SHIFT",
        CONTROL: "CONTROL",
        ALT: "ALT",
        ALTGRAPH: "ALTGRAPH",
        META: "META",
        CAPSLOCK: "CAPSLOCK",
        CONTEXTMENU: "CONTEXTMENU",
      
        ARROWUP:"ARROWUP", ARROWDOWN:"ARROWDOWN", ARROWLEFT:"ARROWLEFT", ARROWRIGHT:"ARROWRIGHT",
      
        HOME: "HOME",
        END: "END",
        PAGEUP: "PAGEUP",
        PAGEDOWN: "PAGEDOWN",
        INSERT: "INSERT",
        DELETE: "DELETE",
      
        F1:"F1", F2:"F2", F3:"F3", F4:"F4", F5:"F5", F6:"F6", F7:"F7", F8:"F8", F9:"F9", F10:"F10", F11:"F11", F12:"F12",
      
        NUMPAD0:"NUMPAD0", NUMPAD1:"NUMPAD1", NUMPAD2:"NUMPAD2", NUMPAD3:"NUMPAD3", NUMPAD4:"NUMPAD4", NUMPAD5:"NUMPAD5", NUMPAD6:"NUMPAD6", NUMPAD7:"NUMPAD7", NUMPAD8:"NUMPAD8", NUMPAD9:"NUMPAD9",
        NUMPADADD:"NUMPADADD",
        NUMPADSUBTRACT:"NUMPADSUBTRACT",
        NUMPADMULTIPLY:"NUMPADMULTIPLY",
        NUMPADDIVIDE:"NUMPADDIVIDE",
        NUMPADDECIMAL:"NUMPADDECIMAL",
        NUMPADENTER:"NUMPADENTER",
      
        PAUSE: "PAUSE",
        PRINTSCREEN: "PRINTSCREEN",
        SCROLLLOCK: "SCROLLLOCK",
        NUMLOCK: "NUMLOCK",
        LAUNCHAPPLICATION2: "LAUNCHAPPLICATION2",
      }

    constructor() {
        this._keysPressed = [] // Current keys pressed (down)
    }

    setDown(e) {
        const key = e.key?.toUpperCase()
        if (key && !this.isDown(key)) this._keysPressed.push({key, keyCode:e.keyCode})
    }

    setUp(e) {
        const key = e.key?.toUpperCase()
        if (key && this.isDown(key)) this._keysPressed = this._keysPressed.filter(v=>v.key!==key)
    }

    isDown(keys) {
        const isMultipleKeys = Array.isArray(keys), keysPressed = this.keysPressed

        if (!isMultipleKeys) return keysPressed.includes(keys?.toUpperCase())
        else {
            const k_ll = keys.length

            for (let i=0;i<k_ll;i++) {
                const key = keys[i]?.toUpperCase()
                if (keysPressed.includes(key)) return true
            }
        }

        return false
    }

    hasKeysDown() {
        return Boolean(this._keysPressed.length)
    }

    get keysPressedRaw() {return this._keysPressed}
    get keysPressed() {return this._keysPressed.map(v=>v.key)}
    get keyCodesPressed() {return this._keysPressed.map(v=>v.keyCode)}

	set keysPressed(keysPressed) {this._keysPressed = keysPressed}
}