export default class InteractionHandler{

	protected _callbackObject:any;
	protected _domListenerElement:any;

	constructor(callbackObject:any, domListenerElement:HTMLElement){
		this._callbackObject = callbackObject;
		this._domListenerElement = domListenerElement;
	}
}