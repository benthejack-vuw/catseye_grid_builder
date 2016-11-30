import Transform from "../../util/transform"
import GUIInteractionHandler from "./guiInteractionHandler"
import KeyboardInteractionHandler from "./keyboardInteractionHandler"
import MouseInteractionHandler from "./mouseInteractionHandler"
import * as DomUtils from "../../util/domUtils"


/*
*	The interaction manager class deals with mouse,
*	keyboard, and [eventually] touch interactions (not yet implemented)
*
*	It uses a json file to set up key and mouse combinations in the interaction_definitions_url`. 
*
*	The constructor takes a callback object whose methods are linked to by key 
*	and mouse combinations in the interaction_definitions_url`. 
* 	See example definitions file for how the links work.
*
*	all rights reserved Ben Jack
*/

export default class InteractionManager{
 	
 	private _keyboardManager:KeyboardInteractionHandler;
	private _mouseManager:MouseInteractionHandler;
	private _guiManager:GUIInteractionHandler;
	private _domListenerElement:HTMLElement;
	private _callbackObject:any;

 	constructor(callbackObject:any, domListenerElement:HTMLElement, interactionDefinitions:any){
		this._domListenerElement = domListenerElement;
		this._callbackObject = callbackObject;

		if(typeof(interactionDefinitions) === "string")
			DomUtils.fetchJSONFile(interactionDefinitions, this.setupInteractions);
		else
			this.setupInteractions(interactionDefinitions);
	}
	
	private setupInteractions = (JSON_data:any) => {
		if(JSON_data.keyboard){
			this._keyboardManager = new KeyboardInteractionHandler(this._callbackObject, this._domListenerElement, JSON_data.keyboard);
		}
		if(JSON_data.mouse){
			this._mouseManager = new MouseInteractionHandler(this._callbackObject, this._domListenerElement, JSON_data.mouse);
		}
		if(JSON_data.gui){
			this._guiManager = new GUIInteractionHandler(this._callbackObject, JSON_data.gui);
		}

		this.stop();
		this.start();
	};

	//------------------------------------------------SETUP-------------------------------------------------------

	public start(){
		if(this._keyboardManager){this._keyboardManager.start();}
		if(this._mouseManager){this._mouseManager.start();}
		if(this._guiManager){this._guiManager.start();}
	}

	public stop(){
		if(this._keyboardManager){this._keyboardManager.stop();}
		if(this._mouseManager){this._mouseManager.stop();}
		if(this._guiManager){this._guiManager.stop();}
	}

	public setTransformMatrix(transform:Transform):void{
		this._mouseManager.setTransformMatrix(transform);
	}

}


