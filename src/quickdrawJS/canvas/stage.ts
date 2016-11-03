/*
*	Stage is the lowest object in the DisplayObject Tree. A stage is necessary
*   as it creates the initial canvas context and manages the interactions of 
*	higher up DisplayObjects.
*
*	Copyright Ben Jack 2016
*/

import InteractionManager from "../interaction/interactionHandler/interactionManager"
import Transform from "../util/transform" 
import {MutableMouseData} from "../interaction/mouseData"
import {MouseData} from "../interaction/mouseData"
import Point from "../geometry/point"
import DisplayObject from "./displayObject"


//interaction definitions for use in the InteractionManager of the stage
//defines the mouse interaction callbacks
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


export default class Stage extends DisplayObject{

	public stageCanvas:HTMLCanvasElement;
	private _selectedChild:DisplayObject;
	private _interactionManager:InteractionManager;

	private   _modifiedMatrix:boolean;
	protected _matrix: Transform;

	//requires the ID of the HTML parent container object that the stage canvas will be inserted into
	constructor(parentID:string, size:Point){
		super(new Point(0,0), size);

		DisplayObject.stage = this;
		this.setCacheAsCanvas(true);
		this.stageCanvas = this._canvas;

		var parentElement:HTMLElement = document.getElementById(parentID);
		parentElement.appendChild(this._canvas);
		this._canvas.setAttribute("id", parentID+"-canvas");

		this._redraw = true;

		this._modifiedMatrix = false;
		this._matrix = new Transform();

		this._interactionManager = new InteractionManager(this, this._canvas, stageInteractions);
		this._interactionManager.setTransformMatrix(this._matrix);

		window.requestAnimationFrame(this.drawStage);
	}

	
	public get drawingContext():CanvasRenderingContext2D{
		return this.stageCanvas.getContext("2d");
	}

	public drawStage = () => {
		var ctx:CanvasRenderingContext2D = this.renderingContext;

		if(this._modifiedMatrix)		
			ctx.setTransform(1, 0, 0, 1, 0, 0);
		
		this.clear(ctx);

		if(this._modifiedMatrix)
			this._matrix.apply(ctx);

		super.draw(ctx);
		this.drawChildren(ctx);

		window.requestAnimationFrame(this.drawStage);
	}

	public contains(pt:Point):boolean{
		return true; // the stage ALWAYS contains the point
	}

	public get localPosition():Point{
		return new Point(0,0);
	}

	public get globalPosition():Point{
		return new Point(0,0);
	}

	//this returns the stages current transformation matrix
	public get matrix():Transform{
		return this._matrix;
	}

	//reset the transformation matrix
	public resetMatrix(){
		this._modifiedMatrix = false;
		this._matrix.reset();
	}

	//multiply the current transformation Matrix with another one
	public multiplyMatrix(matrix:Transform){
		this._modifiedMatrix = true;
		this._matrix.multiply(matrix);
	}

	//translate the transformation matrix
	public translate(x:number, y:number){
		this._modifiedMatrix = true;
		this._matrix.translate(x, y);
	}

	//rotate the transformation matrix
	public rotate(rad:number){
		this._modifiedMatrix = true;
		this._matrix.rotate(rad);
	}

	//scale the transformation matrix
	public scale(sx:number, sy:number){
		this._modifiedMatrix = true;
		this._matrix.scale(sx, sy);
	}


	//------------------------INTERACTION MANAGER CALLBACKS--------------------------

	public stageMouseClick = (button:number, mouseData:MouseData) => {

		var clicked:DisplayObject = this.getChildAtPoint(mouseData.position);
		if(clicked && clicked != this)
			clicked.mouseClicked(mouseData);
	}

	public stageMousePress = (button:number, mouseData:MouseData) => {

		var tempSel:DisplayObject = this.getChildAtPoint(mouseData.position);

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



