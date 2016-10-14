import Stage from "./stage"
import Point from "../geometry/point"
import Transform from "../util/transform"
import * as DrawingUtils from "../util/drawingUtils"
import {MouseData} from "../interaction/mouseData"

export default class InteractiveDisplayObject{
	
	public static stage:Stage;
	
	protected _parent: InteractiveDisplayObject;
	protected _children: Array<InteractiveDisplayObject>;

	protected _cacheAsCanvas: boolean;
	protected _canvas: HTMLCanvasElement;
	protected _clearColor: string = DrawingUtils.grey(255);

	protected _matrix: Transform;
	protected _localPosition: Point;
	protected _globalPosition: Point;
	protected _localTransformReferencePoint:Point;

	protected _size: Point;
	protected _sizeIsProportional: boolean;
	protected _isMouseOver: boolean;
	protected _redraw: boolean;
	protected _onlyRedrawIfActive:boolean;
	protected _selected:boolean;

	constructor(localPosition: Point, size: Point){
		this._children = new Array<InteractiveDisplayObject>();
		this._localPosition = localPosition;
		this._size = size;
		this._sizeIsProportional = size.x < 1 || size.y < 1;
		this._matrix = new Transform();
		this._redraw = true;
		this._isMouseOver = false;
		this._onlyRedrawIfActive = false;
		this._cacheAsCanvas = false;
		this._selected = false;
	}

	public get size():Point{
		return this._size;
	}

	public get localPosition():Point{
		return this._localPosition;
	}

	public get parent():InteractiveDisplayObject{
		return this._parent;
	}

	public get globalPosition():Point{
		return this._globalPosition;
	}

	public get stage():Stage{
		return InteractiveDisplayObject.stage;
	}

	public get cachedContext():CanvasRenderingContext2D{
		return this._canvas.getContext("2d");
	}

	public get isMouseOver():boolean{
		return this._isMouseOver;
	}

	private setParent(parent:InteractiveDisplayObject){
		this._parent = parent;
		this.localPosition = this._localPosition;
	}

	public set size(size:Point){
		this._size = size;
		if(this._cacheAsCanvas){
			this._canvas.width = size.x;
			this._canvas.height = size.y;
		}
	}

	public set localPosition(local:Point){

		this._localPosition = local.copy();
		this._globalPosition = local.copy(); //global position gets translated below
		
		if(this.parent)
			this._globalPosition.translate(this._parent.globalPosition.x, this._parent.globalPosition.y);
		
		this.updateChildPositions();
	}

	public set globalPosition(global:Point){
		
		this._localPosition = global.copy();
		this._globalPosition = global.copy();
		
		if(parent)
			this._localPosition.translate(-this._parent.globalPosition.x, -this._parent.globalPosition.y);
		
		this.updateChildPositions();
	}

	public set redrawsEveryFrame(do_redraw:boolean){
		this._redraw = do_redraw;
		if(this._redraw){
			var currObject:InteractiveDisplayObject = this;
			while(currObject != null){
				currObject.redrawsEveryFrame = true;
				currObject = currObject.parent;
			}
		}
	}

	public clearColor(r:number, g?:number, b?:number){
		if(b === undefined || g == undefined){
			this._clearColor = DrawingUtils.grey(r);
		}else{
			this._clearColor = DrawingUtils.rgb(r, g, b);
		}
	}

	public set cacheAsCanvas(cache:boolean){
		this._cacheAsCanvas = cache;
		
		if(cache){
			this._canvas = document.createElement("canvas");
			this._canvas.width = this._size.x;
			this._canvas.height = this._size.y;
		}
	}

	public set onlyRedrawIfActive(redraw:boolean){
		this._onlyRedrawIfActive = redraw;
	}

	public select():void{
		this._selected = true;
	}
	
	public deselect():void{
		this._selected = false;
	}


	public containsChild(child:InteractiveDisplayObject):boolean{
		return this._children.indexOf(child) > -1;
	}

	public addChild(child:InteractiveDisplayObject):void{
		this._children.push(child);
		child.setParent(this);
		child.addedToStage();
	}
	
	public addChildAt(index:number, child:InteractiveDisplayObject):void{
		this._children.splice(index, 0, child);
		child.setParent(this);
		child.addedToStage();
	}
	
	public removeChild(child:InteractiveDisplayObject):void{
		var index:number = this._children.indexOf(child);
		if(index > -1)
			this._children.splice(index, 1);
	}
	
	public updateChildPositions():void{
		for(var i = 0; i < this._children.length; ++i){
			var child:InteractiveDisplayObject = this._children[i];
			child.localPosition = child.localPosition;
			this._children[i].updateChildPositions();
		}
	}
	
	public localToGlobal(local:Point):Point{
		return new Point(local.x + this._globalPosition.x, local.y + this._globalPosition.y);
	}
	
	public globalToLocal(global:Point):Point{
			return new Point(global.x - this._globalPosition.x, global.y - this._globalPosition.y);
	}

	public needsRedraw():boolean{
		return this._redraw && (!this._onlyRedrawIfActive || (this._onlyRedrawIfActive && this._isMouseOver));
	}

	public redraw():void{

		var context:CanvasRenderingContext2D = this._parent === this.stage || this as InteractiveDisplayObject === this.stage ? Stage.drawingContext : this._parent.cachedContext;
		var par:InteractiveDisplayObject = this._parent;
		
		while(!context){
			par = par.parent;
			context = par == this.stage ? Stage.drawingContext : this._parent.cachedContext;
		}		
		
		var currentContext = this.preDraw(context); 
		this.draw(context);
		this.drawChildren(context);
		this.drawOverChildren(context);
		this.postDraw(context);
	}
	
	public inBounds(point:Point):boolean{
		var localPos = this.globalToLocal(point);
		return localPos.x > 0 && localPos.x < this._size.x && localPos.y > 0 && localPos.y < this._size.y;
	}
	
	public updateMouse(mouseData:MouseData):void{
		
		var updateChildren = () => {
			for(var i = 0; i < this._children.length; ++i){
				this._children[i].updateMouse(mouseData);
			}
		}

		if(this.contains(this.globalToLocal(mouseData.position))){
			
			if(!this._isMouseOver){
				this.mouseEnter(mouseData);
			}
			
			this._isMouseOver = true;

		}else{
			
			if(this._isMouseOver){
				this.mouseExit(mouseData);
				updateChildren();
			}
			this._isMouseOver = false;
		}
		
		if(this.insideInteractionBounds(mouseData.position)){
			updateChildren();
		}
	}

	protected clear(context:CanvasRenderingContext2D, transparent?:boolean){
		
		if(transparent){
			context.clearRect(0,0,this._size.x, this._size.y);
		}
		else{
			context.fillStyle = this._clearColor;
			context.rect(0, 0, this._size.x, this._size.y);
		}
	}
	
	private preDraw(context:CanvasRenderingContext2D):CanvasRenderingContext2D{		
		var currContext:CanvasRenderingContext2D = this._cacheAsCanvas ? this._canvas.getContext("2d") : context;
		
		currContext.save();
		
		if(!this._cacheAsCanvas){
			currContext.translate(this._localPosition.x, this._localPosition.y);
		}
		
		return currContext;
	}

	
	private postDraw(context:CanvasRenderingContext2D):void{
		this.drawChildren(context);
		context.restore();		
	}
	
	protected drawChildren(context:CanvasRenderingContext2D){
				
		for(var i = 0; i < this._children.length; ++i){
			var child:InteractiveDisplayObject = this._children[i];
			if(child.needsRedraw){
				child.update();
				var context:CanvasRenderingContext2D = child.preDraw(context);
				child.draw(context);
				child.drawOverChildren(context);
				child.postDraw(context);
			}
			
			if(child.cacheAsCanvas){
				context.drawImage(child.cachedContext.canvas, child.localPosition.x, child.localPosition.y);
			}
		}
		
	}
	
	protected getChildAtPoint(position:Point):InteractiveDisplayObject{
		
		if(this.insideInteractionBounds(position)){
			
			for(var i = this._children.length-1; i >= 0; --i){
				
					var selected:InteractiveDisplayObject = this._children[i].getChildAtPoint(position);
				
					if(selected != null)
						return selected;	
			}
		}
		
		if(this.contains(position))
			return this;
		
		return null;
	}
	

	//--------------------------------METHODS TO OVERRIDE IN CHILD CLASSES-------------------------------------------
	
	protected addedToStage():void{}
	
	public update(){};
	
	public draw(context:CanvasRenderingContext2D):void{}
	
	public drawOverChildren(context:CanvasRenderingContext2D):void{}
	
	public contains(pt:Point):boolean{return false};
	
	public insideInteractionBounds(pt:Point):boolean{
		var localPos:Point = this.globalToLocal(pt);
		return localPos.x > 0 && localPos.x < this._size.x && localPos.y > 0 && localPos.y < this._size.y;
	}
	
	public mouseEnter(mouseData:MouseData){};
	
	public mouseExit(mouseData:MouseData){};
	
	public click(mouseData:MouseData){};

	public mousePressed(mouseData:MouseData){};

	public mouseReleased(mouseData:MouseData){};

	public mouseDragged(mouseData:MouseData){};
	
	public keyPressed(lastButton:string){};
	
	//public actionHook(InteractiveDisplayObject child, int i_action){}	
}