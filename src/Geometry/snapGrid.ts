import Point from "./point";
import BoundingBox from "./boundingBox";
import * as DrawingUtils from "../util/DrawingUtils";

export default class SnapGrid{
	
	private _points:Array<Point>;

	constructor(points:Array<Point>){
		this._points = points;
	}

	public closest(pt:Point):Point{
		var closest:Point = null;
		var min_dist = Number.MAX_SAFE_INTEGER;

		for (var i = 0; i < this._points.length; i++) {
			var d = Math.dist(this._points[i].x, this._points[i].y, pt.x, pt.y);
			if(d < min_dist){
				closest = this._points[i];
				min_dist = d;
			}
		}

		return new Point(closest.x, closest.y);
	}

	public draw(context:CanvasRenderingContext2D):void{
		for (var i = 0; i < this._points.length; i++) {
			context.fillStyle = DrawingUtils.rgb(255,0,0);
			context.arc(this._points[i].x, this._points[i].y, 5, 0, 2 * Math.PI);
		}
	};

	public get boundingBox():BoundingBox{
		return new BoundingBox(this._points);
	};

};