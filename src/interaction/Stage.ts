import {MouseData} from "../interaction/mouseData"
import Point from "../geometry/point"
import InteractiveDisplayObject from "./interactiveDisplayObject"

export default class Stage extends InteractiveDisplayObject{

	public stageCanvas:HTMLCanvasElement;
	private _selectedChild:InteractiveDisplayObject;

	constructor(parentID:string, size:Point){
		super(new Point(0,0), size);

		InteractiveDisplayObject.stage = this;

		this.cacheAsCanvas = true;
		this.stageCanvas = this._canvas;

		var parentElement:HTMLElement = document.getElementById(parentID);
		parentElement.appendChild(this._canvas);

		this._redraw = true;
	}

	
	public get drawingContext():CanvasRenderingContext2D{
		return this.stageCanvas.getContext("2d");
	}
	public draw(){
		var ctx:CanvasRenderingContext2D = this.cachedContext;
		this.clear(ctx);
		super.draw(ctx);
		this.drawChildren(ctx);
	}

	public contains(pt:Point):boolean{
		return true;
	}

	public get localPosition():Point{
		return new Point(0,0);
	}

	public get globalPosition():Point{
		return new Point(0,0);
	}

	public stageMouseClick = (button:number, mouseData:MouseData) => {
		var clicked:InteractiveDisplayObject = this.getChildAtPoint(mouseData.position);
		if(clicked && clicked != this)
			clicked.click(mouseData);
	}

	public stageMousePress = (button:number, mouseData:MouseData) => {
		var tempSel:InteractiveDisplayObject = this.getChildAtPoint(mouseData.position);

		if(tempSel != null && tempSel != this){
			this._selectedChild = tempSel;
			this._selectedChild.select();
			this._selectedChild.mousePressed(mouseData);
		}
	}

	public stageMouseRelease = (mouseData:MouseData) => {
		if(this._selectedChild != null){
			this._selectedChild.mouseReleased(mouseData);
			this._selectedChild.deselect();
			this._selectedChild = null;
		}
	}

	public stageMouseMove = (mouseData:MouseData) => {		
		for(var i = 0; i < this._children.length; ++i){ 
			this._children[i].updateMouse(mouseData);
		}
	}

	public stageMouseDrag = (mouseData:MouseData) => {
		if(this._selectedChild != null){
			this._selectedChild.mouseDragged(mouseData);
		}
	}


}