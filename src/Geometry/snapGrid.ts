import Point from "./point";
import InteractiveDisplayObject from "../interaction/interactiveDisplayObject"
import BoundingBox from "./boundingBox";
import * as DrawingUtils from "../util/drawingUtils";

export default class SnapGrid extends InteractiveDisplayObject{
	
	private _points:Array<Point>; //these points are local to the parent object

	constructor(local_to_parent_points:Array<Point>){
		super(new Point(0, 0), new Point(0,0));
		
		this._points = local_to_parent_points;
		var bounds:BoundingBox = this.boundingBox;
	}

	public addedToStage():void{
		this._size = this._parent.size;
	}

	public closest(global_position:Point):Point{
		var closest:Point = null;
		var min_dist = Number.MAX_SAFE_INTEGER;

		var local_position:Point = this.globalToLocal(global_position);

		for (var i = 0; i < this._points.length; i++) {
			var d = Math.dist(this._points[i].x, this._points[i].y, local_position.x, local_position.y);
			if(d < min_dist){
				closest = this._points[i];
				min_dist = d;
			}
		}

		return this.localToGlobal(new Point(closest.x, closest.y));
	}

	public draw(context:CanvasRenderingContext2D):void{
		
		for (var i = 0; i < this._points.length; i++) {
			context.fillStyle = DrawingUtils.rgb(255,0,0);
			context.beginPath();
			context.arc(this._points[i].x, this._points[i].y, 5, 0, 2 * Math.PI);
			context.fill();
		}

	};

	public get boundingBox():BoundingBox{
		return new BoundingBox(this._points);
	};

};