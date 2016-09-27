import Transform from "../../util/transform"
import KeyboardInteractionHandler from "./keyboardInteractionHandler"
import MouseInteractionHandler from "./mouseInteractionHandler"


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
	private _domListenerElement:HTMLElement;
	private _callbackObject:any;

 	constructor(callbackObject:any, domListenerElement:HTMLElement, interactionDefinitionsURL:string){
		this._domListenerElement = domListenerElement;
		this._callbackObject = callbackObject;
		this.fetchJSONFile(interactionDefinitionsURL, this.setupInteractions);
	}
	
	private setupInteractions = (JSON_data:any) => {
		console.log(JSON_data);
		if(JSON_data.keyboard){
			this._keyboardManager = new KeyboardInteractionHandler(this._callbackObject, this._domListenerElement, JSON_data.keyboard);
		}
		if(JSON_data.mouse){
			this._mouseManager = new MouseInteractionHandler(this._callbackObject, this._domListenerElement, JSON_data.mouse);
		}
		this.stop();
		this.start();
	};

	//------------------------------------------------SETUP-------------------------------------------------------

	public start(){
		if(this._keyboardManager){this._keyboardManager.start();}
		if(this._mouseManager){this._mouseManager.start();}
	}

	public stop(){
		if(this._keyboardManager){this._keyboardManager.stop();}
		if(this._mouseManager){this._mouseManager.stop();}
	}

	public setTransformMatrix(transform:Transform):void{
		this._mouseManager.setTransformMatrix(transform);
	}

	private fetchJSONFile(path:string, callback:Function) {
	    var httpRequest = new XMLHttpRequest();
	    httpRequest.onreadystatechange = function() {
	        if (httpRequest.readyState === 4) {
	            if (httpRequest.status === 200) {
	                var data = JSON.parse(httpRequest.responseText);
	                if (callback){callback(data);}
	            }
	        }
	    };
	    httpRequest.open('GET', path, false);  
	    httpRequest.send(); 
	}

}


