import {InteractionHandler} from "./interactionHandler"


export default class GUIInteractionHandler extends InteractionHandler{

	protected _GUICallbacks:Array<GUICallback>;

	constructor(callbackObject:any, interactions:any){
		super(callbackObject, null);
		this._GUICallbacks = [];
		this.createGUIBindings(interactions);
	}

	createGUIBindings(interactions:any):void{

		let setInputAttributes = (id:string, attributes:any) => {
			let item:HTMLInputElement = document.getElementById(id) as HTMLInputElement;
			let keys = Object.keys(attributes);

			for(let i = 0; i < keys.length; ++i){
				let key = keys[i];
				item.setAttribute(key, attributes[key]);
			}
		}

		let createCallbackBindings = (id:string, callbacks:any)=>{
			
			let keys = Object.keys(callbacks);
			for(let i = 0; i < keys.length; ++i){
				let key = keys[i];
				let guiCallback:GUICallback = new GUICallback(id, key, this._callbackObject[callbacks[key]]);
				this._GUICallbacks.push(guiCallback);
			}

		}


		let GUIKeys = Object.keys(interactions);
		for(let i = 0; i < GUIKeys.length; ++i){
			let key = GUIKeys[i];
			if(interactions[key].attributes){
				setInputAttributes(key, interactions[key].attributes)
			}
			if(interactions[key].callbacks){
				createCallbackBindings(key, interactions[key].callbacks)
			}
		}
	}

	start(){
		for (var i = this._GUICallbacks.length - 1; i >= 0; i--) {
			this._GUICallbacks[i].start();
		}
	}

	stop(){
		for (var i = this._GUICallbacks.length - 1; i >= 0; i--) {
			this._GUICallbacks[i].stop();
		}
	}

}

class GUICallback{

	private _callbackWrapper: (ev:UIEvent)=>any;

	protected _object:HTMLElement;
	protected _id:string;
	protected _callback:Function;
	protected _action:string;

	constructor(itemID:string, listenerAction:string, callback:(value?:any, element?:HTMLInputElement, event?:Event)=>void){
		this._object = document.getElementById(itemID);
		this._action = listenerAction;
		this._callbackWrapper = function(ev:UIEvent){
			var input:HTMLInputElement = ev.currentTarget as HTMLInputElement;
			callback(input.value, input, ev);
		}
	}

	start(){
		this._object.addEventListener(this._action, this._callbackWrapper);
	}

	stop(){
		this._object.removeEventListener(this._action, this._callbackWrapper);	
	}
}