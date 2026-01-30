// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

class TypingDevice {
    static #LISTENER_ID_GIVER = 0
    static #ID_INDEX = 3
    static KEYS = {A:"A", B:"B", C:"C", D:"D", E:"E", F:"F", G:"G", H:"H", I:"I", J:"J", K:"K", L:"L", M:"M", N:"N", O:"O", P:"P", Q:"Q", R:"R", S:"S", T:"T", U:"U", V:"V", W:"W", X:"X", Y:"Y", Z:"Z", DIGIT_0:"0", DIGIT_1:"1", DIGIT_2:"2", DIGIT_3:"3", DIGIT_4:"4", DIGIT_5:"5", DIGIT_6:"6", DIGIT_7:"7", DIGIT_8:"8", DIGIT_9:"9", SPACE:" ", ENTER:"ENTER", TAB:"TAB", BACKSPACE:"BACKSPACE", ESCAPE:"ESCAPE", SHIFT:"SHIFT", CONTROL:"CONTROL", ALT:"ALT", ALT_GRAPH:"ALTGRAPH", META:"META", CAPS_LOCK:"CAPSLOCK", CONTEXT_MENU:"CONTEXTMENU", ARROW_UP:"ARROWUP", ARROW_DOWN:"ARROWDOWN", ARROW_LEFT:"ARROWLEFT", ARROW_RIGHT:"ARROWRIGHT", HOME:"HOME", END:"END", PAGE_UP:"PAGEUP", PAGE_DOWN:"PAGEDOWN", INSERT:"INSERT", DELETE:"DELETE", F1:"F1", F2:"F2", F3:"F3", F4:"F4", F5:"F5", F6:"F6", F7:"F7", F8:"F8", F9:"F9", F10:"F10", F11:"F11", F12:"F12", F13:"F13", F14:"F14", F15:"F15", F16:"F16", F17:"F17", F18:"F18", F19:"F19", F20:"F20", F21:"F21", F22:"F22", F23:"F23", F24:"F24", NUMPAD_0:"NUMPAD0", NUMPAD_1:"NUMPAD1", NUMPAD_2:"NUMPAD2", NUMPAD_3:"NUMPAD3", NUMPAD_4:"NUMPAD4", NUMPAD_5:"NUMPAD5", NUMPAD_6:"NUMPAD6", NUMPAD_7:"NUMPAD7", NUMPAD_8:"NUMPAD8", NUMPAD_9:"NUMPAD9", NUMPAD_ADD:"NUMPADADD", NUMPAD_SUBTRACT:"NUMPADSUBTRACT", NUMPAD_MULTIPLY:"NUMPADMULTIPLY", NUMPAD_DIVIDE:"NUMPADDIVIDE", NUMPAD_DECIMAL:"NUMPADDECIMAL", NUMPAD_ENTER:"NUMPADENTER", PAUSE:"PAUSE", PRINT_SCREEN:"PRINTSCREEN", SCROLL_LOCK:"SCROLLLOCK", NUM_LOCK:"NUMLOCK", LAUNCH_APPLICATION_1:"LAUNCHAPPLICATION1", LAUNCH_APPLICATION_2:"LAUNCHAPPLICATION2", BRACKET_LEFT:"BRACKETLEFT", BRACKET_RIGHT:"BRACKETRIGHT", SEMICOLON:"SEMICOLON", QUOTE:"QUOTE", COMMA:"COMMA", PERIOD:"PERIOD", SLASH:"SLASH", BACKSLASH:"BACKSLASH", EQUAL:"EQUAL", MINUS:"MINUS", BACKQUOTE:"BACKQUOTE", AUDIO_VOLUME_UP:"AUDIOVOLUMEUP", AUDIO_VOLUME_DOWN:"AUDIOVOLUMEDOWN", AUDIO_VOLUME_MUTE:"AUDIOVOLUMEMUTE", MEDIA_PLAY_PAUSE:"MEDIAPLAYPAUSE", MEDIA_NEXT_TRACK:"MEDIANEXTTRACK", MEDIA_PREVIOUS_TRACK:"MEDIAPREVIOUSTRACK", MEDIA_STOP:"MEDIASTOP", BROWSER_BACK:"BROWSERBACK", BROWSER_FORWARD:"BROWSERFORWARD", BROWSER_REFRESH:"BROWSERREFRESH", BROWSER_STOP:"BROWSERSTOP", BROWSER_SEARCH:"BROWSERSEARCH", BROWSER_FAVORITES:"BROWSERFAVORITES", BROWSER_HOME:"BROWSERHOME"}
    static KEY_GROUPS = {NATIVE_ZOOM_KEYS: ["-","+","="]}
    static LISTENER_TYPES = {DOWN:0, UP:1}
    static TRIGGER_TYPES = {DEFAULT_REPEATING:0, ONCE:1<<0, SLOW_REPEATING:1<<1, MEDIUM_REPEATING:1<<2, FAST_REPEATING:1<<4}
    static #MOD_REPEATING = TypingDevice.TRIGGER_TYPES.SLOW_REPEATING|TypingDevice.TRIGGER_TYPES.MEDIUM_REPEATING|TypingDevice.TRIGGER_TYPES.FAST_REPEATING
    static #REPEATING_DELAYS = []
    static {
        TypingDevice.#REPEATING_DELAYS[TypingDevice.TRIGGER_TYPES.SLOW_REPEATING] = 1000/10
        TypingDevice.#REPEATING_DELAYS[TypingDevice.TRIGGER_TYPES.MEDIUM_REPEATING] = 1000/30
        TypingDevice.#REPEATING_DELAYS[TypingDevice.TRIGGER_TYPES.FAST_REPEATING] = 1000/60
    }

    #triggerStates = []
    #lastPressedKey = null

    /**
     * Represents the user's keyboard. Automatically instantiated by a Canvas instance
     */
    constructor() {
        this._keysPressed = [] // Current keys pressed (down)
        this._listeners = []   // List of all current listeners
    }

    /**
     * Adds a custom keyboard event listener
     * @param {TypingDevice.LISTENER_TYPES} type: One of TypingDevice.LISTENER_TYPES
     * @param {String | Array} keys: One or multiple keys to listen to
     * @param {Function} callback: a custom function called upon event trigger. (typingDevice, keyPressed)=>
     * @param {TypingDevice.TRIGGER_TYPE?} triggerType: Defines the trigger frequency (only for DOWN)
     * @returns The listener id
     */
    addListener(type, keys, callback, triggerType=TypingDevice.TRIGGER_TYPES.DEFAULT_REPEATING) {
        const listener = [keys, callback, triggerType, TypingDevice.#LISTENER_ID_GIVER++]
        if (!this._listeners[type]) this._listeners[type] = []
        this._listeners[type].push(listener)
        return listener[TypingDevice.#ID_INDEX]
    }

    /**
     * Updates an existing listener
     * @param {TypingDevice.LISTENER_TYPES} type: One of TypingDevice.LISTENER_TYPES
     * @param {Number} id: listener's id 
     * @param {String? | Array?} newKeys: if provided, updates the listeners's keys to this value
     * @param {Function?} newCallback: if provided, updates the listeners's callback to this value. (typingDevice, keyPressed)=>
     * @param {TypingDevice.TRIGGER_TYPE?} triggerType: if provided, updates the listeners's trigger type to this value (only for DOWN)
     */
    updateListener(type, id, newKeys, newCallback, newTriggerType) {
        const listener = this._listeners[type][this._listeners[type].findIndex(l=>l[TypingDevice.#ID_INDEX]==(id?.[TypingDevice.#ID_INDEX]??id))]
        if (newKeys) listener[0] = newKeys
        if (newCallback) listener[1] = newCallback
        if (CDEUtils.isDefined(newTriggerType)) listener[2] = newTriggerType
    }

    // checks conditions for every listeners of a certain type, if valid, calls the listeners callback as such: (typingDevice, keyPressed)=>
    checkListeners(type) {
        const typedListeners = this._listeners[type], typedListeners_ll = typedListeners?.length
        if (typedListeners_ll) {
            const TYPES = TypingDevice.LISTENER_TYPES
            for (let i=0;i<typedListeners_ll;i++) {
                const [keys, callback, triggerType, id] = typedListeners[i]
                if (type===TYPES.DOWN && this.isDown(keys)) {
                    if (!this.#triggerStates[type]) this.#triggerStates[type] = []
                    const downStates = this.#triggerStates[type], alreadyActivated = this.#triggerStates[type]?.[triggerType]?.[id]?.[1]
                    
                    if (triggerType === TypingDevice.TRIGGER_TYPES.ONCE && !alreadyActivated) {
                        if (!downStates[triggerType]) downStates[triggerType] = []
                        downStates[triggerType][id] = [keys, true]
                        callback(this, this.keysPressed)
                    } else if (triggerType & TypingDevice.#MOD_REPEATING && !alreadyActivated) {
                        if (!downStates[triggerType]) downStates[triggerType] = []
                        downStates[triggerType][id] = [
                            keys, 
                            CDEUtils.noDelayInterval(TypingDevice.#REPEATING_DELAYS[triggerType], ()=>callback(this, this.keysPressed))
                        ]
                    } else if (triggerType === TypingDevice.TRIGGER_TYPES.DEFAULT_REPEATING) callback(this, this.keysPressed)
                }
                else if (type===TYPES.UP && keys.includes(this.#lastPressedKey) && !this.isDown(this.#lastPressedKey)) callback(this, this.#lastPressedKey)
            }
        }
    }

    /**
     * Removes one or all exisiting listeners of a certain type 
     * @param {TypingDevice.LISTENER_TYPES} type: One of TypingDevice.LISTENER_TYPES
     * @param {Number | String} id: Either the listener's id or * to remove all listeners of this type 
     */
    removeListener(type, id) {
        const isAll = id === "*"
        this._listeners[type] = isAll ? [] : this._listeners[type].filter(l=>l[TypingDevice.#ID_INDEX]!==(id?.[TypingDevice.#ID_INDEX]??id))
        if (isAll) this.#triggerStates[type] = []
        else this.#triggerStates[type].forEach(x=>{
            if (x[id]) delete x[id]
        })
    }

    /**
     * Removes all existing listeners
     */
    removeAllListeners() {
        this._listeners = []
        this.#triggerStates = []
    }

    // sets a key as down based on a keydown event
    setDown(e) {
        const key = e.key?.toUpperCase()
        if (key && !this.isDown(key)) this._keysPressed.push({key, keyCode:e.keyCode})
        this.checkListeners(TypingDevice.LISTENER_TYPES.DOWN)
    }

    // sets a key as up based on a keyup event
    setUp(e) {
        const key = e.key?.toUpperCase()
        if (key && this.isDown(key)) {
            this.#lastPressedKey = key
            this._keysPressed = this._keysPressed.filter(v=>v.key!==key)
        }

        if (this.#triggerStates.length) {
            const downStates = this.#triggerStates[TypingDevice.LISTENER_TYPES.DOWN], s_ll = Object.values(TypingDevice.TRIGGER_TYPES).length
            for (let i=1;i<(1<<s_ll);i*=2) {
                const triggerStates = downStates[i]
                if (triggerStates?.length) {
                    if (i === TypingDevice.TRIGGER_TYPES.ONCE) {
                        triggerStates.forEach(x=>{
                            if (!this.isDown(x[0])) x[1] = false
                        })
                    }
                    else if (i & TypingDevice.#MOD_REPEATING) {
                        triggerStates.forEach(x=>{
                            if (!this.isDown(x[0])) {
                                clearInterval(x[1])
                                x[1] = null
                            }
                        })
                    }
                }
            }
        }

        this.checkListeners(TypingDevice.LISTENER_TYPES.UP)
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

    *[Symbol.iterator]() {
        const keyPressed = this._keysPressed, k_ll = keyPressed.length
        for (let i=0;i<k_ll;i++) yield keyPressed[i]
    }

    get [Symbol.toStringTag]() {return this.instanceOf}
    get instanceOf() {return "TypingDevice"}
    get keysPressedRaw() {return this._keysPressed}
    get keysPressed() {return this._keysPressed.map(v=>v.key)}
    get keyCodesPressed() {return this._keysPressed.map(v=>v.keyCode)}

	set keysPressed(keysPressed) {this._keysPressed = keysPressed}
}