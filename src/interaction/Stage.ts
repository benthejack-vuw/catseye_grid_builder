import {MouseData} from "../interaction/mouseData"
import Point from "../geometry/point"
import InteractiveDisplayObject from "./interactiveDisplayObject"

export default class Stage extends InteractiveDisplayObject{

	public static stageCanvas:HTMLCanvasElement;

	private _dragging:boolean;
	private _selectedChild:InteractiveDisplayObject;

	constructor(parentID:string, size:Point){
		super(new Point(0,0), size);

		InteractiveDisplayObject.stage = this;

		this.cacheAsCanvas = true;
		Stage.stageCanvas = this._canvas;

		var parentElement:HTMLElement = document.getElementById("parentID");
		parentElement.appendChild(this._canvas);

		this._redraw = true;
	}

	public static get drawingContext():CanvasRenderingContext2D{
		return Stage.stageCanvas.getContext("2d");
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

	public stageMouseClick = (mouseData:MouseData) => {
		var clicked:InteractiveDisplayObject = this.getChildAtPoint(mouseData.position);
		
		if(clicked != null && clicked != this)
			clicked.click(mouseData);
	}

	public stageMousePress = (mouseData:MouseData) => {
		var tempSel:InteractiveDisplayObject = this.getChildAtPoint(mouseData.position);
		
		if(tempSel != null && tempSel != this){
			this._selectedChild = tempSel;
			this._selectedChild.select();
			this._selectedChild.mousePressed(mouseData);
			this._dragging = true;
		}
	}

	public stageMouseRelease = (mouseData:MouseData) => {
		if(this._selectedChild != null){
			this._selectedChild.mouseReleased(mouseData);
			this._selectedChild.deselect();
			this._dragging = false;
			this._selectedChild = null;
		}
	}

	public stageUpdateMouse = (mouseData:MouseData) => {
		if(this._selectedChild != null && this._dragging){
			this._selectedChild.mouseDragged(mouseData);
		}
		
		for(var i = 0; i < this._children.length; ++i){ 
			this._children[i].updateMouse(mouseData);
		}
	}


}