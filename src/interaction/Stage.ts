import InteractionManager from "./interactionHandler/interactionManager"
import Transform from "../util/transform" 
import {MutableMouseData} from "../interaction/mouseData"
import {MouseData} from "../interaction/mouseData"
import Point from "../geometry/point"
import InteractiveDisplayObject from "./interactiveDisplayObject"

var stageInteractions = {
	"mouse":{
		
		"click":{
			"left" : "stageMouseClick"
		},

		"press":{
			"left" : "stageMousePress"
		},

		"release":{
			"left" : "stageMouseRelease"
		},

		"move":"stageMouseMove",
		"drag":"stageMouseDrag"
	}

};

export default class Stage extends InteractiveDisplayObject{

	public stageCanvas:HTMLCanvasElement;
	private _selectedChild:InteractiveDisplayObject;
	private _interactionManager:InteractionManager;

	private   _modifiedMatrix:boolean;
	protected _matrix: Transform;
	protected _clearMatrix: Transform;


	constructor(parentID:string, size:Point){
		super(new Point(0,0), size);

		InteractiveDisplayObject.stage = this;
		this.setCacheAsCanvas(true);
		this.stageCanvas = this._canvas;

		var parentElement:HTMLElement = document.getElementById(parentID);
		parentElement.appendChild(this._canvas);

		this._redraw = true;

		this._modifiedMatrix = false;
		this._matrix = new Transform();

		this._interactionManager = new InteractionManager(this, this._canvas, stageInteractions);
		this._interactionManager.setTransformMatrix(this._matrix);
	}

	
	public get drawingContext():CanvasRenderingContext2D{
		return this.stageCanvas.getContext("2d");
	}
	public draw(){
		var ctx:CanvasRenderingContext2D = this.cachedContext;

		if(this._modifiedMatrix)		
			ctx.setTransform(1, 0, 0, 1, 0, 0);
		
		this.clear(ctx);

		if(this._modifiedMatrix)
			this._matrix.apply(ctx);

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

	public get matrix():Transform{
		return this._matrix;
	}

	public resetMatrix(){
		this._modifiedMatrix = false;
		this._matrix.reset();
	}

	public multiplyMatrix(matrix:Transform){
		this._modifiedMatrix = true;
		this._matrix.multiply(matrix);
	}

	public translate(x:number, y:number){
		this._modifiedMatrix = true;
		this._matrix.translate(x, y);
	}

	public rotate(rad:number){
		this._modifiedMatrix = true;
		this._matrix.rotate(rad);
	}

	public scale(sx:number, sy:number){
		this._modifiedMatrix = true;
		this._matrix.scale(sx, sy);
	}

	public stageMouseClick = (button:number, mouseData:MouseData) => {

		var clicked:InteractiveDisplayObject = this.getChildAtPoint(mouseData.position);
		if(clicked && clicked != this)
			clicked.mouseClicked(mouseData);
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



