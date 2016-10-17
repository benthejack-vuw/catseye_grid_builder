import "../util/mathUtils"
import {MouseData} from "../interaction/mouseData"
import * as DrawingUtils from "../util/drawingUtils"
import InteractiveDisplayObject from "../interaction/interactiveDisplayObject"
import Point from "../geometry/point"

export default class DisplayTree extends InteractiveDisplayObject{

	private _radius:number;
	private _depth:number;
	private _treeChildren:Array<DisplayTree> = [];
	private _activated:boolean = false;
	private _press:boolean = false;

	constructor(position:Point, size:Point, radius:number, depth:number){
		super(position, size);

		this._depth = depth;
		this._radius = radius;
			
		var theta = Math.TWO_PI/3.0;

		if(depth < 4){
			for(var i =  0; i < 3; ++i){
				var x:number = 2*this._radius/3 + Math.cos(i*theta) * this._radius/2.0;
				var y:number = 2*this._radius/3 + Math.sin(i*theta) * this._radius/2.0;
				var pt:Point = new Point(x, y);

				var chd:DisplayTree = new DisplayTree(pt, new Point(2*this._radius/3, 2*this._radius/3),  this._radius/3.0, depth+1);
				this._treeChildren.push(chd);
			}
		}

	}

	protected addedToStage():void{
		for(var i = 0; i < this._treeChildren.length; ++i){
			this.addChild(this._treeChildren[i]);
		}
	}


	public contains(pt:Point):boolean{
		return Math.dist(this._radius, this._radius, pt.x, pt.y) < this._radius;
	}

	public draw(context:CanvasRenderingContext2D){	

		if(this._isMouseOver)	
			context.fillStyle = DrawingUtils.rgba(0,(this._depth+1)*(50),0,255);
		else
			context.fillStyle = DrawingUtils.rgba((this._depth+1)*(50),0,0,255);

		if(this._activated)
			context.fillStyle = DrawingUtils.rgba(0,0,(this._depth+1)*(50),255);

		if(this._press)
			context.fillStyle = DrawingUtils.grey(255);
		
		//context.fillRect(0, 0, this._radius, this._radius);
		context.beginPath();
		context.arc(this._radius, this._radius, this._radius, 0, 2*Math.PI);
		context.fill();


	}

	public mouseDragged(mouseData:MouseData){
		var newPos = this.globalPosition.copy();
		newPos.translate(mouseData.position.x - mouseData.lastPosition.x, mouseData.position.y - mouseData.lastPosition.y);
		this.globalPosition = newPos;
	}

	
	public mouseEnter(mouseData:MouseData){
		console.log("ENTER");
	};
	
	public mouseExit(mouseData:MouseData){
		console.log("EXIT");
	};

	public click(mouseData:MouseData){
		this._activated = !this._activated;
	};

	public mousePressed(mouseData:MouseData){
		this._press = true;
	};

	public mouseReleased(mouseData:MouseData){
		this._press = false;
	};


}