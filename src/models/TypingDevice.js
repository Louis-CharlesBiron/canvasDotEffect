// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don"t use or credit this code as your own.
//

class TypingDevice {
    static KEYS = {A:"A", B:"B", C:"C", D:"D", E:"E", F:"F", G:"G", H:"H", I:"I", J:"J", K:"K", L:"L", M:"M", N:"N", O:"O", P:"P", Q:"Q", R:"R", S:"S", T:"T", U:"U", V:"V", W:"W", X:"X", Y:"Y", Z:"Z", DIGIT_0:"0", DIGIT_1:"1", DIGIT_2:"2", DIGIT_3:"3", DIGIT_4:"4", DIGIT_5:"5", DIGIT_6:"6", DIGIT_7:"7", DIGIT_8:"8", DIGIT_9:"9", SPACE:" ", ENTER:"ENTER", TAB:"TAB", BACKSPACE:"BACKSPACE", ESCAPE:"ESCAPE", SHIFT:"SHIFT", CONTROL:"CONTROL", ALT:"ALT", ALT_GRAPH:"ALTGRAPH", META:"META", CAPS_LOCK:"CAPSLOCK", CONTEXT_MENU:"CONTEXTMENU", ARROW_UP:"ARROWUP", ARROW_DOWN:"ARROWDOWN", ARROW_LEFT:"ARROWLEFT", ARROW_RIGHT:"ARROWRIGHT", HOME:"HOME", END:"END", PAGE_UP:"PAGEUP", PAGE_DOWN:"PAGEDOWN", INSERT:"INSERT", DELETE:"DELETE", F1:"F1", F2:"F2", F3:"F3", F4:"F4", F5:"F5", F6:"F6", F7:"F7", F8:"F8", F9:"F9", F10:"F10", F11:"F11", F12:"F12", F13:"F13", F14:"F14", F15:"F15", F16:"F16", F17:"F17", F18:"F18", F19:"F19", F20:"F20", F21:"F21", F22:"F22", F23:"F23", F24:"F24", NUMPAD_0:"NUMPAD0", NUMPAD_1:"NUMPAD1", NUMPAD_2:"NUMPAD2", NUMPAD_3:"NUMPAD3", NUMPAD_4:"NUMPAD4", NUMPAD_5:"NUMPAD5", NUMPAD_6:"NUMPAD6", NUMPAD_7:"NUMPAD7", NUMPAD_8:"NUMPAD8", NUMPAD_9:"NUMPAD9", NUMPAD_ADD:"NUMPADADD", NUMPAD_SUBTRACT:"NUMPADSUBTRACT", NUMPAD_MULTIPLY:"NUMPADMULTIPLY", NUMPAD_DIVIDE:"NUMPADDIVIDE", NUMPAD_DECIMAL:"NUMPADDECIMAL", NUMPAD_ENTER:"NUMPADENTER", PAUSE:"PAUSE", PRINT_SCREEN:"PRINTSCREEN", SCROLL_LOCK:"SCROLLLOCK", NUM_LOCK:"NUMLOCK", LAUNCH_APPLICATION_1:"LAUNCHAPPLICATION1", LAUNCH_APPLICATION_2:"LAUNCHAPPLICATION2", BRACKET_LEFT:"BRACKETLEFT", BRACKET_RIGHT:"BRACKETRIGHT", SEMICOLON:"SEMICOLON", QUOTE:"QUOTE", COMMA:"COMMA", PERIOD:"PERIOD", SLASH:"SLASH", BACKSLASH:"BACKSLASH", EQUAL:"EQUAL", MINUS:"MINUS", BACKQUOTE:"BACKQUOTE", AUDIO_VOLUME_UP:"AUDIOVOLUMEUP", AUDIO_VOLUME_DOWN:"AUDIOVOLUMEDOWN", AUDIO_VOLUME_MUTE:"AUDIOVOLUMEMUTE", MEDIA_PLAY_PAUSE:"MEDIAPLAYPAUSE", MEDIA_NEXT_TRACK:"MEDIANEXTTRACK", MEDIA_PREVIOUS_TRACK:"MEDIAPREVIOUSTRACK", MEDIA_STOP:"MEDIASTOP", BROWSER_BACK:"BROWSERBACK", BROWSER_FORWARD:"BROWSERFORWARD", BROWSER_REFRESH:"BROWSERREFRESH", BROWSER_STOP:"BROWSERSTOP", BROWSER_SEARCH:"BROWSERSEARCH", BROWSER_FAVORITES:"BROWSERFAVORITES", BROWSER_HOME:"BROWSERHOME"}
   
    /**
     * Represents the user's keyboard. Automatically instantiated by a Canvas instance
     */
    constructor() {
        this._keysPressed = [] // Current keys pressed (down)
    }

    // sets a key as down based on a keydown event
    setDown(e) {
        const key = e.key?.toUpperCase()
        if (key && !this.isDown(key)) this._keysPressed.push({key, keyCode:e.keyCode})
    }

    // sets a key as up based on a keyup event
    setUp(e) {
        const key = e.key?.toUpperCase()
        if (key && this.isDown(key)) this._keysPressed = this._keysPressed.filter(v=>v.key!==key)
    }

    /**
     * Checks if a key is pressed
     * @param {String | Array} keys: the key or key group 
     * @returns  whether (one of) the provided key(s) is down
     */
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

    /**
     * @returns whether any key is pressed
     */
    hasKeysDown() {
        return Boolean(this._keysPressed.length)
    }

    get [Symbol.toStringTag]() {return this.instanceOf}
    get instanceOf() {return "TypingDevice"}
    get keysPressedRaw() {return this._keysPressed}
    get keysPressed() {return this._keysPressed.map(v=>v.key)}
    get keyCodesPressed() {return this._keysPressed.map(v=>v.keyCode)}

	set keysPressed(keysPressed) {this._keysPressed = keysPressed}
}