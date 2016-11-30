/*
*	DisplayObject is a display class that operates as an interactive display stack.
*	any object that inherits this object can be added as a child of another DisplayObject
*	automatically rendering (if you override the draw function) and also gaining mouse
*   interactions if the contains method is overridden.
*
*	Copyright Ben Jack 2016
*/

import OverrideError from "../error/override" 
import OrderError from "../error/order"
import Stage from "./stage"
import Point from "../geometry/point"
import Transform from "../util/transform"
import * as DrawingUtils from "../util/drawingUtils"
import {MouseData} from "../interaction/mouseData"
import {MutableMouseData} from "../interaction/mouseData"


export default class DisplayObject{
	
	//stage is the lowest level of the display tree and contains the global transform matrix
	public static stage:Stage;

	protected _parent: DisplayObject;
	protected _children: Array<DisplayObject>;

	protected _cacheAsCanvas: boolean;
	protected _canvas: HTMLCanvasElement;
	protected _clearColor: string = DrawingUtils.grey(255);

	protected _localPosition: Point;
	protected _globalPosition: Point;
	protected _localTransformReferencePoint:Point;

	protected _size: Point;
	protected _sizeIsProportional: boolean;
	protected _isMouseOver: boolean;
	protected _redraw: boolean;
	protected _onlyRedrawIfActive:boolean;
	protected _selected:boolean;


	//Positions in the draw and contains functions of DisplayObject are local to this object
	//the local position is relative to the position of the parent making it easy to 
	//build complex reusable components.
	//
	//the size parameter is mainly used if this object is cached as its own canvas see setCacheAsCanvas() function
	constructor(localPosition: Point, size: Point){
		this._children = new Array<DisplayObject>();
		this._localPosition = localPosition;
		this._size = size;
		this._sizeIsProportional = size.x < 1 || size.y < 1;
		this._redraw = true;
		this._isMouseOver = false;
		this._onlyRedrawIfActive = false;
		this._cacheAsCanvas = false;
		this._selected = false;
	}


	//--------------------------------METHODS TO OVERRIDE IN CHILD CLASSES-------------------------------------------
	
	//THIS METHOD [contains(pt)] MUST BE OVERRIDDEN IN CHILD CLASSES
	//it will throw an error telling you so if you don't.
	//this method should be implemented to return true if the point (in local coordinates) lies within 
	//the object. the simplest implementation is:
	//public contains(local_pt:Point):boolean{
	//	return this.inBounds(local_pt);
	//}
	//this will return true if the point lies within the objects bounding box
	public contains(local_pt:Point):boolean{throw new OverrideError("DisplayObject", this, "contains")};

	//this function is called when this DisplayObject is added to another using addChild()
	//before it is added to another display object, local positions and rendering contexts won't work
	//anything code that you want to put in the constructor but uses those features should instead
	//be put in here
	protected addedToStage():void{}

	//this is called before draw, any per-frame logic should be put in here
	public update(){};
	
	//drawing code. All co-ordinates within draw are LOCAL to this DisplayObject
	public draw(context:CanvasRenderingContext2D):void{}
	
	//if you want anything to be drawn on top of the children of this object put the drawing code here
	public drawOverChildren(context:CanvasRenderingContext2D):void{}
	
	//called once when the mouse enters this object
	public mouseEnter(mouseData:MouseData){};
	
	//called once when the mouse exits this object
	public mouseExit(mouseData:MouseData){};
	
	//called once when the mouse is clicked on this object
	public mouseClicked(mouseData:MouseData){};

	//called once when the mouse is pressed on this object
	public mousePressed(mouseData:MouseData){};

	//called once when the mouse is released on this object
	public mouseReleased(mouseData:MouseData){};

	//called repeatedly while the mouse is moved on this object
	public mouseMoved(mouseData:MouseData){};

	//called repeatedly while the mouse is dragging on this object
	public mouseDragged(mouseData:MouseData){};
	
	//NOT YET IMPLEMENTED
	public keyPressed(lastButton:string){};
	

	//---------------------------------------GETTERS------------------------------------------

	public get size():Point{
		return this._size;
	}

	public get localPosition():Point{
		return this._localPosition;
	}

	public get parent():DisplayObject{
		return this._parent;
	}

	public get globalPosition():Point{
		return this._globalPosition;
	}

	public get stage():Stage{
		return DisplayObject.stage;
	}

	//this returns the rendering context of this object it will be:
	//1) If this.setCacheAsCanvas(true) has been called, this will return its own canvas context
	//2) If it has been added to child
	public get canvas():HTMLCanvasElement{
		if(this._cacheAsCanvas)
			return this._canvas;
		else if(this._parent)
			return this._parent.canvas;
		else
			throw(new OrderError("DisplayObject", "canvasContext or renderingContext", "setCacheAsCanvas(true) on this DisplayObject AND/OR call addChild() on a parent DisplayObject. \
				\n in short this DisplayObject doesn't yet have a rendering context!"));
	}

	//the CanvasRenderingContext2D context of this object
	public get renderingContext():CanvasRenderingContext2D{
		return this.canvas.getContext("2d");
	}

	public get isMouseOver():boolean{
		return this._isMouseOver;
	}

	public get cacheAsCanvas():boolean{
		return this._cacheAsCanvas;
	}

	//---------------------------------------SETTERS------------------------------------------

	public set size(size:Point){
		this._size = size;
		this.canvas.width = size.x;
		this.canvas.height = size.y;
	}

	//Set the position relative to the position of its parent DisplayObject
	public set localPosition(local:Point){

		this._localPosition = local.copy();
		this._globalPosition = local.copy(); //global position gets translated below

		if(this._parent)
			this._globalPosition.translate(this._parent.globalPosition.x, this._parent.globalPosition.y);

		this.updateChildPositions();
	}

	//set the position using global coordinates 
	public set globalPosition(global:Point){
		
		this._localPosition = global.copy();
		this._globalPosition = global.copy();
		
		if(this._parent){
			this._localPosition.translate(-this._parent.globalPosition.x, -this._parent.globalPosition.y);
		}

		this.updateChildPositions();
	}

	//set whether the draw function should be called every frame. APPLIES TO ALL PARENT OBJECTS
	public set redrawsEveryFrame(do_redraw:boolean){
		this._redraw = do_redraw;
		if(this._redraw){
			var currObject:DisplayObject = this;
			while(currObject != null){
				currObject.redrawsEveryFrame = true;
				currObject = currObject.parent;
			}
		}
	}

	//set the background colour to clear the canvas with (use the clear() function in draw)
	//if you want to clear transparently
	public clearColor(r:number, g?:number, b?:number){
		if(b === undefined || g == undefined){
			this._clearColor = DrawingUtils.grey(r);
		}else{
			this._clearColor = DrawingUtils.rgb(r, g, b);
		}
	}

	//This function sets whether this display object should create it's own canvas rendering context
	//if this isn't set to be true, the DisplayObject will be drawn on the next highest rendering context 
	//in this DisplayObjects heirarchy
	public setCacheAsCanvas(cache:boolean){
		this._cacheAsCanvas = cache;
		
		if(cache){
			this._canvas = document.createElement("canvas");
			this._canvas.width = this._size.x;
			this._canvas.height = this._size.y;
		}
	}
	
	//if this is set to false, this object will only refresh/redraw if the mouse is over the object
	public set onlyRedrawIfActive(redraw:boolean){
		this._onlyRedrawIfActive = redraw;
	}

	public select():void{
		this._selected = true;
	}
	
	public deselect():void{
		this._selected = false;
	}

	//returns whether this is the parent of the given DisplayObject
	public containsChild(child:DisplayObject):boolean{
		return this._children.indexOf(child) > -1;
	}

	//Add a child DisplayObject to this one, will be added to the TOP of the display stack of this
	//DisplayObject
	public addChild(child:DisplayObject):void{
		this._children.push(child);
		child.setParent(this);
		child.addedToStage();
	}
	

	//Add a child DisplayObject to this one, will be added to the the display stack of this
	//DisplayObject at the index provided
	public addChildAt(index:number, child:DisplayObject):void{
		this._children.splice(index, 0, child);
		child.setParent(this);
		child.addedToStage();
	}
	
	//remove a child display object. Does nothing if it isn't a child
	public removeChild(child:DisplayObject):void{
		var index:number = this._children.indexOf(child);
		if(index > -1)
			this._children.splice(index, 1);
	}
	
	//refresh child positions relative to this one
	public updateChildPositions():void{
		for(var i = 0; i < this._children.length; ++i){
			var child:DisplayObject = this._children[i];
			child.localPosition = child.localPosition;
			this._children[i].updateChildPositions();
		}
	}

	public localToGlobal(local:Point):Point{
		return new Point(local.x + this.globalPosition.x, local.y + this.globalPosition.y);
	}
	
	public globalToLocal(global:Point):Point{
		let localPoint:Point = new Point(global.x - this.globalPosition.x, global.y - this.globalPosition.y);
		return localPoint;
	}

	//immediately force a redraw this object
	public redraw():void{
		var context:CanvasRenderingContext2D = this.preDraw();
		this.draw(context);
		this.drawChildren(context);
		this.drawOverChildren(context);
		this.postDraw(context);
	}	

	//this is a very way to implement the contains method, returns whether the global point provided
	//sits within the bounding box of this DisplayObject using this object's size
	public inBounds(global_point:Point):boolean{
		var localPos = this.globalToLocal(global_point);
		return localPos.x > 0 && localPos.x < this._size.x && localPos.y > 0 && localPos.y < this._size.y;
	}

	//updates the mouse state of this DisplayObject and propogates to all children
	//IT IS VERY IMPORTANT to implement and override the contains() function of any class
	//that extends DisplayObject if you want the interactivity to work.
	public updateMouse(mouseData:MouseData):void{
		
		var updateChildren = () => {
			for(var i = 0; i < this._children.length; ++i){
				this._children[i].updateMouse(mouseData);
			}
		}

		var localLastPosition:Point = this.globalToLocal(mouseData.lastPosition);
		var localPosition:Point = this.globalToLocal(mouseData.position);

		var localMouseData:MutableMouseData = mouseData.mutableCopy();
		localMouseData.update(localLastPosition);
		localMouseData.update(localPosition);

		if(this.contains(localPosition)){
			if(!this._isMouseOver){
				this._isMouseOver = true;
				this.mouseEnter(localMouseData);
			}
		}else{
			if(this._isMouseOver){
				this.mouseExit(localMouseData);
			}
			this._isMouseOver = false;
		}
		
		if(this._isMouseOver)
			this.mouseMoved(localMouseData);

		updateChildren();
		
	}

	//Clear the canvas using the canvas' clearColour --see clearColor(r,g,b)-- 
	//OR if transparent is set to true it will clear and leave the context transparent.
	protected clear(context:CanvasRenderingContext2D, transparent?:boolean){
		
		if(transparent){
			context.clearRect(0,0,this._size.x, this._size.y);
		}
		else{
			context.fillStyle = this._clearColor;
			context.fillRect(0, 0, this._size.x, this._size.y);
		}
	}

	public needsRedraw():boolean{
		return this._redraw && (!this._onlyRedrawIfActive || (this._onlyRedrawIfActive && this._isMouseOver));
	}
	
	//sets up the rendering context and local positioning
	protected preDraw():CanvasRenderingContext2D{				
		
		let context = this.renderingContext;
		context.save();

		if(!this._cacheAsCanvas){
			context.translate(this._localPosition.x, this._localPosition.y);
		}
		
		return context;
	}

	
	//pops the rendering stack pack to what it was before this DisplayObject was called
	protected postDraw(context:CanvasRenderingContext2D):void{
		this.drawChildren(context);
		context.restore();		
	}

	//renders all children
	protected drawChildren(context:CanvasRenderingContext2D){

		for(var i = 0; i < this._children.length; ++i){
			var child:DisplayObject = this._children[i];
			if(child.needsRedraw){
				child.update();
				var childContext:CanvasRenderingContext2D = child.preDraw();
				child.draw(childContext);
				child.drawOverChildren(childContext);
				child.postDraw(childContext);
			}
			
			if(child.cacheAsCanvas){
				context.drawImage(child.canvas, child.localPosition.x, child.localPosition.y);
			}
		}
		
	}
	
	//return the child under the given point, traverses the tree to get uppermost child
	protected getChildAtPoint(position:Point):DisplayObject{
		for(var i = this._children.length-1; i >= 0; --i){
			
			let selected:DisplayObject = this._children[i].getChildAtPoint(position);
			
			if(selected)
				return selected;	
		}
		
		if(this.contains(this.globalToLocal(position))){
			return this;
		}
		
		return null;
	}
	
	//sets parent object, ignore this it is only used in addChild()
	private setParent(parent:DisplayObject){
		this._parent = parent;
		this.localPosition = this._localPosition;
	}
}