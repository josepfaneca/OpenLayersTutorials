import { Singleton } from 'vincijs';

export interface IKeyboardState {
    pressed(keyDesc)
    destroy()
}

/**
  * - NOTE: it would be quite easy to push event-driven too
  *   - microevent.js for events handling
  *   - in this._onkeyChange, generate a string from the DOM event
  *   - use this as event name
 */
export class KeyboardState {
    private keyCodes = {}
    private modifiers = {}
    public static MODIFIERS = ['shift', 'ctrl', 'alt', 'meta']
    private onKeyDownBind
    private onkeyupBind
    public static ALIAS = {
        'left': 37,
        'up': 38,
        'right': 39,
        'down': 40,
        'space': 32,
        'pageup': 33,
        'pagedown': 34,
        'tab': 9,
        'F1': 112,
        'F2': 113,
        'F3': 114,
        'F4': 115,
        'F5': 116,
        'F6': 117,
        'F7': 118,
        'F8': 119,
        'F9': 120,
        'F10': 121,
        'F11': 122,
        'F12': 123
    }
    private _onKeyDown(event) {
        this._onKeyChange(event, true);
    }
    private _onKeyUp(event) {
        this._onKeyChange(event, false);
    }
    constructor() {
        this.startListener();
    }
    private startListener() {
        document.addEventListener("keydown", this.onKeyDownBind = this._onKeyDown.bind(this), false);
        document.addEventListener("keyup", this.onkeyupBind = this._onKeyUp.bind(this), false);
    }
    /**
     * To stop listening of the keyboard events
    */
    public destroy() {
        document.removeEventListener("keydown", this.onKeyDownBind, false);
        document.removeEventListener("keyup", this.onkeyupBind, false);
    }
    /**
     * to process the keyboard dom event
    */
    private _onKeyChange(event, pressed) {
        var keyCode = event.keyCode;
        this.keyCodes[keyCode] = pressed;
        this.modifiers['shift'] = event.shiftKey;
        this.modifiers['ctrl'] = event.ctrlKey;
        this.modifiers['alt'] = event.altKey;
        this.modifiers['meta'] = event.metaKey;
    }

    /**
     * query keyboard state to know if a key is pressed of not
     *
     * @param {String} keyDesc the description of the key. format : modifiers+key e.g shift+A
     * @returns {Boolean} true if the key is pressed, false otherwise
    */
    public pressed(keyDesc) {
        var keys = keyDesc.split("+");
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var pressed;
            if (KeyboardState.MODIFIERS.indexOf(key) !== -1) {
                pressed = this.modifiers[key];
            } else if (Object.keys(KeyboardState.ALIAS).indexOf(key) != -1) {
                pressed = this.keyCodes[KeyboardState.ALIAS[key]];
            } else {
                pressed = this.keyCodes[key.toUpperCase().charCodeAt(0)]
            }
            if (!pressed) return false;
        };
        return true;
    }
}

export let GetKeyboardState: () => IKeyboardState = Singleton(KeyboardState, true)

