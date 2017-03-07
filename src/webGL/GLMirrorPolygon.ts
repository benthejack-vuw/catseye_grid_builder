import {BJMath} from  "bj-utils"
import {Point} from "bj-utils"

import {Polygon} from "quick-canvas"
import {Line} from "quick-canvas"


export default class GLMirrorPolygon extends Polygon{

	constructor(vertex_array:Array<any>){

		let interpVerts:Array<Point> = [];
		for (var i = 0; i < vertex_array.length; ++i) {
			let current:any = vertex_array[i%vertex_array.length];
			let next:any = vertex_array[(i+1)%vertex_array.length];
			let midPoint = new Point(BJMath.lerp(current.x, next.x, 0.5), BJMath.lerp(current.y, next.y, 0.5));
			interpVerts.push(current);
			interpVerts.push(midPoint);
		}

		super(interpVerts);
	}

	public GLPoints():Array<number>{
		var out:Array<number> = this.centroid.as3DArray();

		for (var i = 0; i < this._vertices.length; ++i) {
			out = out.concat(this._vertices[i].as3DArray());
		}

		out = out.concat(this._vertices[0].as3DArray())

		return out;
	}

	public GLTexCoords(selection:Array<Point>):Array<number>{
		var out:Array<number> = selection[0].asArray();

		for (var i = 0; i < this._vertices.length; ++i) {
			out = out.concat(selection[(i%2)+1].asArray());
		}

		out = out.concat(selection[1].asArray());

		return out;
	}
}
