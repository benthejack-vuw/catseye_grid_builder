import {InteractionHandler} from "./interactionHandler"
import {InteractionEventType} from "./interactionHandler"

var interaction_key_bindings:any = {	
	"8" :"backspace",
	"13":"return",
	"16":"shift",
	"17":"control",
	"18":"alt",
	"32":"space",
	"46":"delete",
	"91":"meta",
	"93":"meta"
};

export default class KeyboardInteractionHandler extends InteractionHandler{

	private _pressedKeys:any;
	private _pressCombos:Array<KeyComboBinding> = [];
	private _releaseCombos:Array<KeyComboBinding> = [];

	constructor(callbackObject:any, domListenerElement:HTMLElement, interactions:Object){
		super(callbackObject, domListenerElement);
		this._pressedKeys = {};
		this.createKeyComboBindings(interactions);
	}

	public start(){
		//in case element is a canvas or other non-focusable object.
		this._domListenerElement.setAttribute("tabindex", 1);
	
		//add all the necessary event listeners
		this._domListenerElement.addEventListener( "mouseenter", this.focus, false );
	//	this._domListenerElement.addEventListener( "mousedown", this.focus, false );

		this._domListenerElement.addEventListener( "keydown", this.keyDown, false );
		this._domListenerElement.addEventListener( "keypress", this.keyPressed, false );
		this._domListenerElement.addEventListener( "keyup"  , this.keyReleased, false );

		this.focus();
	}

	public stop(){
		//remove the event listeners
		this._domListenerElement.removeEventListener( "mouseenter", this.focus, false );
		//this._domListenerElement.removeEventListener( "mousedown", this.focus, false );

		this._domListenerElement.removeEventListener( "keydown", this.keyDown, false );
		this._domListenerElement.removeEventListener( "keypress", this.keyPressed, false );
		this._domListenerElement.removeEventListener( "keyup"  , this.keyReleased, false );
	}

	private createKeyComboBindings(interactions:any):void{

		var generateBindings = (type:InteractionEventType) => {
			
			var typeString = InteractionEventType[type];

			if(interactions[typeString]){
				var keys = Object.keys(interactions[typeString]);
				for (var i = 0; i < keys.length; ++i) {
					let combo:string = keys[i];
					let keyCombo = new KeyComboBinding(combo, interactions[typeString][combo], this._callbackObject);
					this.addKeyCodeBinding(keyCombo, type);
				}
			}
		}

		generateBindings(InteractionEventType.press);
		generateBindings(InteractionEventType.release);

		this.stop();
		this.start();
	}

	private comboArray(iet:InteractionEventType):Array<KeyComboBinding>{
		return iet === InteractionEventType.press ? this._pressCombos : this._releaseCombos;
	}

	//add new keycode binding, InteractionEventType should be InteractionEventType.press or InteractionEventType.release
	private addKeyCodeBinding(binding:KeyComboBinding, iet:InteractionEventType):void{
		this.comboArray(iet).push(binding);
	}

	//returns the json key name from an event
	private keyNameFromCode(code:number):string{
		return interaction_key_bindings[code.toString()] || String.fromCharCode(code);
	}

	private isSpecialKey(code:number):boolean{
		return interaction_key_bindings[code.toString()] !== undefined;
	}

	//checks for any completed key combos, and call their respective callbacks
	private checkCombos(key:string, iet:InteractionEventType):void{
		var combos:Array<KeyComboBinding> = this.comboArray(iet);
		
		for (var i = 0; i < combos.length; ++i){
			combos[i].runIfActivated(key, this._pressedKeys);
		}
	}

	//unset the key (this is called on key release)
	private unsetKey(e:KeyboardEvent):void{
		if(this.isSpecialKey(e.keyCode)){
			this._pressedKeys = {};
		}
		else{
			var key_name = this.keyNameFromCode(e.keyCode || e.charCode);
			if(key_name){
				this._pressedKeys[key_name] = false;
				key_name = key_name.toLowerCase();
				this._pressedKeys[key_name] = false;
			}
		}
	}

	//detects special key presses (control, alt, meta, shift etc..)
	private keyDown = (e:KeyboardEvent):void => {
		var pressed = interaction_key_bindings[e.keyCode];

		if(pressed){
			this._pressedKeys[pressed] = true;
			this.checkCombos(pressed, InteractionEventType.press);
		}
	}

	//runs on key pressed event, detects key after it is modified by special keys
	private keyPressed = (e:KeyboardEvent):void => {		
		e.preventDefault();

		//e = e || event;
		var pressed = this.keyNameFromCode(e.keyCode || e.charCode);
		
		if(pressed){
			this._pressedKeys[pressed] = true;
			this.checkCombos(pressed, InteractionEventType.press);
		}
	}

	//key release callback
	private keyReleased = (e:KeyboardEvent):void => {
		e.preventDefault();

		var released = this.keyNameFromCode(e.keyCode || e.charCode);
		this.unsetKey(e);
		this.checkCombos(released, InteractionEventType.release);
	}

	private focus = (e?:MouseEvent):void => {
		this._domListenerElement.focus();
	}

}


class KeyComboBinding{

	private _callback:(s?:string, a?:any)=>void;
	private _combo:Array<string>; 

	constructor(comboString:string, callbackFunctionName:string, callbackObject:any){
		this._combo = comboString.split("+");
		this._callback = callbackObject[callbackFunctionName];
	}

	//this method runs the callback if the combo is contained within lastKey and pressedKeys
	public runIfActivated(lastKey:string, pressedKeys:any):void{

		if(this._combo[0] !== "any"){//if this key combo is any it skips the check and runs the callback
			//run through the combo keys and check if they are activated
			//if they are not, then this combo is not complete so return;
			for (var i = 0; i < this._combo.length; ++i) {
				if(!(lastKey == this._combo[i] || pressedKeys[this._combo[i]])){return;}
			}
		}

		this._callback(lastKey, pressedKeys);
	}

}


