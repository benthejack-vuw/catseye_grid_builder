
import Point from "./point"
import Rectangle from "./rectangle"
import "../util/mathUtils"

export default class BoundingBox extends Rectangle{

	constructor(points?: Array<Point>){
		if(points){
			super(0,0,0,0);
			this.calculateBounds(points);
		}else{
			super(0,0,1,1);
		}
	}
	
	public calculateBounds(points: Array<Point>){
		var left = Number.MAX_SAFE_INTEGER;
		var right = -Number.MAX_SAFE_INTEGER;
		var top = Number.MAX_SAFE_INTEGER;
		var bottom = -Number.MAX_SAFE_INTEGER;

		for (var i = 0; i < points.length; i++) {
			left = Math.min(left, points[i].x);
			right = Math.max(right, points[i].x);
			top = Math.min(top, points[i].y);
			bottom = Math.max(bottom, points[i].y);
		}

		this.topLeft = new Point(left, top);
		this.width = right - left;
		this.height = bottom - top;
	};

}