import InteractionHandler from "./interactionHandler"


var interaction_key_bindings = {	
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

enum KeyEventType{
	press = 0,
	release
}

export default class KeyboardInteractionHandler extends InteractionHandler{

	private _pressedKeys:Object;
	private _pressCombos:Array<KeyComboBinding>;
	private _releaseCombos:Array<KeyComboBinding>;

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
		this._domListenerElement.addEventListener( "mousedown", this.focus, false );

		this._domListenerElement.addEventListener( "keydown", this.keyDown, false );
		this._domListenerElement.addEventListener( "keypress", this.keyPressed, false );
		this._domListenerElement.addEventListener( "keyup"  , this.keyReleased, false );

		this.focus();
	}

	public stop(){
		//remove the event listeners
		this._domListenerElement.removeEventListener( "mouseenter", this.focus, false );
		this._domListenerElement.removeEventListener( "mousedown", this.focus, false );

		this._domListenerElement.removeEventListener( "keydown", this.keyDown, false );
		this._domListenerElement.removeEventListener( "keypress", this.keyPressed, false );
		this._domListenerElement.removeEventListener( "keyup"  , this.keyReleased, false );
	}

	private createKeyComboBindings(interactions:any):void{

		var generateBindings = (type:KeyEventType) => {
			
			var typeString = type == KeyEventType.press ? "press" : "release";

			if(interactions[typeString]){
				var keys = Object.keys(interactions[typeString]);
				for (var combo in keys) {
					let keyCombo = new KeyComboBinding(combo, interactions.press[combo], this._callbackObject);
					this.addKeyCodeBinding(keyCombo, type);
				}
			}
		}

		generateBindings(KeyEventType.press);
		generateBindings(KeyEventType.release);
	}

	private comboArray(keyEventType:KeyEventType):Array<KeyComboBinding>{
		return keyEventType === KeyEventType.press ? this._pressCombos : this._releaseCombos;
	}

	//add new keycode binding, keyEventType should be KeyEventType.press or KeyEventType.release
	private addKeyCodeBinding(binding:KeyComboBinding, keyEventType:KeyEventType):void{
		this.comboArray(keyEventType).push(binding);
	}

	//returns the json key name from an event
	private keyNameFromCode(code:number):string{
		return interaction_key_bindings[code.toString()] || String.fromCharCode(code);
	}

	private isSpecialKey(code:number):boolean{
		return interaction_key_bindings[code.toString()] !== undefined;
	}

	//checks for any completed key combos, and call their respective callbacks
	private checkCombos(key:string, keyEventType:KeyEventType):void{
		var combos:Array<KeyComboBinding> = this.comboArray(keyEventType);
		
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
			this.checkCombos(pressed, KeyEventType.press);
		}
	}

	//runs on key pressed event, detects key after it is modified by special keys
	private keyPressed = (e:KeyboardEvent):void => {		
		e.preventDefault();

		e = e || event;
		var pressed = this.keyNameFromCode(e.keyCode || e.charCode);
		
		if(pressed){
			this._pressedKeys[pressed] = true;
			this.checkCombos(pressed, KeyEventType.press);
		}
	}

	//key release callback
	private keyReleased = (e:KeyboardEvent):void => {
		e.preventDefault();

		var released = this.keyNameFromCode(e.keyCode || e.charCode);
		this.unsetKey(e);
		this.checkCombos(released, KeyEventType.release);
	}

	private focus = (e?:MouseEvent):void => {
		this._domListenerElement.focus();
	}

}


class KeyComboBinding{

	private _callback:(string?, any?)=>void;
	private _combo:Array<string>; 

	constructor(comboString:string, callbackFunctionName:string, callbackObject:any){
		this._combo = comboString.split("+");
		this._callback = callbackObject[callbackFunctionName];
	}

	//this method runs the callback if the combo is contained within lastKey and pressedKeys
	public runIfActivated(lastKey:string, pressedKeys:Object):void{

		if(this._combo[0] !== "any"){//if this key combo is any it skips the check and runs the callback
	
			//run through the combo keys and check if they are activated
			//if they are not, then this combo is not complete so return;
			for (var key in this._combo) {
				if(!(key === lastKey || pressedKeys[key]){return;}
			}
		}

		this._callback(lastKey, pressedKeys);
	}

}


