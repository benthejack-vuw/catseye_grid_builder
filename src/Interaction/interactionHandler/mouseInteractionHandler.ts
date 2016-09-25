import Point from "../../Geometry/point"
import InteractionHandler from "./interactionHandler"
import {MutableMouseData} from "../mouseData"
import Transform from "../../util/Transform"

var mouse_map = ["none", "left", "middle", "right"];

export default class MouseInteractionHandler extends InteractionHandler{

	private _mouseData:MutableMouseData;
	private _transformMatrix:Transform;
	private _interactions:any;

	constructor(callbackObject:any, domListenerElement:HTMLElement, interactions:any){
		super(callbackObject, domListenerElement);
		this._interactions = interactions;
		this._transformMatrix = new Transform();
		this.createMouseBindings(interactions);
	}

	private createMouseBindings(interactions:Object):void{

	}

	public start(){
		this._domListenerElement.addEventListener( "mousedown", this.mousePressed,  false );
		window.addEventListener( "mouseup", this.mouseReleased,  false );
		this._domListenerElement.addEventListener( "click"  , this.mouseClicked, false );
		this._domListenerElement.addEventListener("contextmenu", this.stopContextMenu);
		
		if(this._interactions.mouse.drag || this._interactions.mouse.move){
			this._domListenerElement.addEventListener( "mousemove"  , this.mouseMoved );
		}
	}

	public stop(){
		this._domListenerElement.removeEventListener( "mousedown", this.mousePressed,  false );
		window.removeEventListener( "mouseup", this.mouseReleased,  false );
		this._domListenerElement.removeEventListener( "click"  , this.mouseClicked, false );
		this._domListenerElement.removeEventListener("contextmenu", this.stopContextMenu);
		if(this._interactions.mouse.drag || this._interactions.mouse.move){
			this._domListenerElement.removeEventListener( "mousemove"  , this.mouseMoved );
		}
	}

	private set_local_mouse_position(e:MouseEvent):void{
		var pt = global_to_local(this._domListenerElement, e);
		if(this._transformMatrix){
			pt = this._transformMatrix.transformPoint(pt);
		}
		this._mouseData.update(pt); 
	}

	private mouseButtonAction(action, e, any){

		if(action === "release"){this.focus();}

		this.set_local_mouse_position(e);
		var mouse_button = mouse_map[e.which];
		this._mouseData[mouse_button] = (action === "click" || action ===  "release" ? false : true);

		if(any !== undefined){
			mouse_button = "any";
		}

		if(this._interactions.mouse[action]){
			var callback = this._interactions.mouse[action][mouse_button];
			if(callback){
				this.callback_object[callback](mouse_button, this._mouseData);
			}
		}
	};

	this.mouseClicked = function(e){
		this.mouseButtonAction("click", e); //check regular bindings
		this.mouseButtonAction("click", e, true); //check for "any" mouseclick binding
	};

	this.mousePressed = function(e){
		this.mouseButtonAction("press", e); //check regular bindings
		this.mouseButtonAction("press", e, true); //check for "any" mousepress binding
	};

	this.mouseReleased = function(e){
		this.mouseButtonAction("release", e); //check regular bindings
		this.mouseButtonAction("release", e, true); //check for "any" mouserelease binding
	};

	this.stopContextMenu = function(e){
		e.preventDefault();
		return false;
	};

	this.isAnyMouseButtonPressed = function(){
		return this._mouseData.left || this._mouseData.middle || this._mouseData.right;
	};

	this.mouseMoved = function(e){

		this.set_local_mouse_position(e);
		
		var drag_callback = this.interactions.mouse.drag;
		var move_callback = this.interactions.mouse.move;

		if(move_callback || drag_callback){
			if(drag_callback && this.isAnyMouseButtonPressed()){
				this.callback_object[drag_callback](this._mouseData);
			}
			else if(move_callback){
				this.callback_object[move_callback](this._mouseData);
			}
		}

	};

	this.setTransformMatrix = function(transform){
		this.transformMatrix = transform;
	}

	// Return the X/Y in a local context.
	function global_to_local(context, event):Point{
	    var rect = context.getBoundingClientRect();

	    return new Point(
	     event.clientX - rect.left,
	     event.clientY - rect.top
	    );

	}
}

