import Point from "../../Geometry/point"
import {InteractionHandler} from "./interactionHandler"
import {InteractionEventType} from "./interactionHandler"
import {MutableMouseData} from "../mouseData"
import Transform from "../../util/Transform"
import {MouseButton} from "../mouseData"
import {MouseButtonConverter} from "../mouseData"
import {MouseData} from "../mouseData"

export default class MouseInteractionHandler extends InteractionHandler{

	private _mouseData:MutableMouseData;
	private _transformMatrix:Transform;
	private _interactions:any;
	private _pressCombos:Array<MouseButtonBinding> = [];
	private _releaseCombos:Array<MouseButtonBinding> = [];
	private _clickCombos:Array<MouseButtonBinding> = [];

	constructor(callbackObject:any, domListenerElement:HTMLElement, interactions:any){
		super(callbackObject, domListenerElement);
		this._transformMatrix = new Transform();
		this._mouseData = new MutableMouseData();
		this.createMouseBindings(interactions);
	}

	private createMouseBindings(interactions:any):void{

		this._interactions = interactions;
		
		var generateBindings = (type:InteractionEventType) => {	
			var typeString = InteractionEventType[type];

			if(interactions[typeString]){
				var keys = Object.keys(interactions[typeString]);
				for (var i = 0; i < keys.length; ++i) {
					console.log("MAKING BINDING", type, keys[i]);
					var btn:MouseButton = MouseButtonConverter.fromString(keys[i]);
					let keyCombo = new MouseButtonBinding(btn, interactions[InteractionEventType[type]][keys[i]], this._callbackObject);
					this.addMouseButtonBinding(keyCombo, type);
				}
			}
		}

		generateBindings(InteractionEventType.press);
		generateBindings(InteractionEventType.release);
		generateBindings(InteractionEventType.click);



		this.stop();
		this.start();
	}

	private comboArray(iet:InteractionEventType):Array<MouseButtonBinding>{
		switch (iet) {
			case InteractionEventType.click:
				return this._clickCombos;
			case InteractionEventType.press:
				return this._pressCombos;
			case InteractionEventType.release:
				return this._releaseCombos;
			default:
				return null;
		}
	}

	//add new keycode binding, InteractionEventType should be InteractionEventType.press or InteractionEventType.release
	private addMouseButtonBinding(binding:MouseButtonBinding, iet:InteractionEventType):void{
		this.comboArray(iet).push(binding);
	}

	public start(){
		this._domListenerElement.addEventListener( "mousedown", this.mousePressed,  false );
		window.addEventListener( "mouseup", this.mouseReleased,  false );
		this._domListenerElement.addEventListener( "click"  , this.mouseClicked, false );
		this._domListenerElement.addEventListener("contextmenu", this.stopContextMenu);
		
		if(this._interactions.drag || this._interactions.move){
			this._domListenerElement.addEventListener( "mousemove"  , this.mouseMoved );
		}
	}

	public stop(){
		this._domListenerElement.removeEventListener( "mousedown", this.mousePressed,  false );
		window.removeEventListener( "mouseup", this.mouseReleased,  false );
		this._domListenerElement.removeEventListener( "click"  , this.mouseClicked, false );
		this._domListenerElement.removeEventListener("contextmenu", this.stopContextMenu);
		if(this._interactions.drag || this._interactions.move){
			this._domListenerElement.removeEventListener( "mousemove"  , this.mouseMoved );
		}
	}

	private set_local_mouse_position(e:MouseEvent):void{
		var pt = this.global_to_local(this._domListenerElement, e);

		if(this._transformMatrix){
			pt = this._transformMatrix.transformPoint(pt);
		}

		this._mouseData.update(pt); 
	}

	private mouseButtonAction(action:InteractionEventType, e:MouseEvent):void{

		if(action === InteractionEventType.release){this._domListenerElement.focus();}

		var button:MouseButton = MouseButtonConverter.fromString(MouseButton[e.which]);
		this.set_local_mouse_position(e);
		this._mouseData.buttons[e.which] = action === InteractionEventType.click || action ===  InteractionEventType.release ? false : true;

		var bindings: Array<MouseButtonBinding> = this.comboArray(action);
		for (var i = 0; i < bindings.length; ++i) {
			bindings[i].runIfActivated(button, this._mouseData);
		}
	}

	private mouseClicked = (e:MouseEvent):void =>{
		this.mouseButtonAction(InteractionEventType.click, e);
	}

	private mousePressed = (e:MouseEvent):void =>{
		this.mouseButtonAction(InteractionEventType.press, e);
	}

	private mouseReleased = (e:MouseEvent):void =>{
		this.mouseButtonAction(InteractionEventType.release, e); 
	}

	private stopContextMenu = (e:MouseEvent):boolean =>{
		e.preventDefault();
		return false;
	}

	private isAnyMouseButtonPressed():boolean{
		return this._mouseData.buttons[MouseButton.left] || this._mouseData.buttons[MouseButton.middle] || this._mouseData.buttons[MouseButton.right];
	}

	private mouseMoved = (e:MouseEvent):void =>{
		this.set_local_mouse_position(e);
		
		var drag_callback = this._interactions.drag;
		var move_callback = this._interactions.move;

		if(move_callback || drag_callback){
			if(drag_callback && this.isAnyMouseButtonPressed()){
				this._callbackObject[drag_callback](this._mouseData);
			}
			else if(move_callback){
				this._callbackObject[move_callback](this._mouseData);
			}
		}

	}

	public setTransformMatrix(transform:Transform){
		this._transformMatrix = transform;
	}

	// Return the X/Y in a local context.
	private global_to_local(context:HTMLElement, event:MouseEvent):Point{
	    var rect = context.getBoundingClientRect();

	    return new Point(
	     event.clientX - rect.left,
	     event.clientY - rect.top
	    );
	}
}

class MouseButtonBinding{

	private _callback:(mb?:MouseButton, a?:any)=>void;
	private _button:MouseButton; 

	constructor(button:MouseButton, callbackFunctionName:string, callbackObject:any){
		this._button = button;
		this._callback = callbackObject[callbackFunctionName];
	}

	//this method runs the callback if the combo is contained within lastKey and pressedKeys
	public runIfActivated(button:MouseButton, mouseData:MouseData):void{
		
		if(this._button == MouseButton.any || button == this._button){
			this._callback(button, mouseData);
		}
	}

}