import Polygon from "./polygon"
import Line from "./line"
import Point from "./point"
import "../util/mathUtils"

export default class GLMirrorPolygon extends Polygon{

	constructor(vertex_array:Array<any>){
		
		let interpVerts:Array<Point> = [];
		for (var i = 0; i < vertex_array.length; ++i) {
			
			let current:Point = vertex_array[i].copy();
			let next:Point = vertex_array[(i+1)%vertex_array.length];
			let midPoint = new Point(Math.lerp(current.x, next.x, 0.5), Math.lerp(current.x, next.x, 0.5));
			interpVerts.push(current);
			interpVerts.push(midPoint);
		}

		super(interpVerts);
	}
	
}