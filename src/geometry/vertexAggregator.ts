import * as BJMath from "bj-utils/lib/util/mathUtils"

import {Point} from "bj-utils/lib/geometry/point"
import {Polygon} from "quick-canvas/lib/geometry/polygon"

export class VertexAggregator{
	
	private _offset:Point;
	private _grid_resolution:number = 5;
	private _snap:number = 2;

	private _drawPoints:Point[];

	private _vertices: GridVertex[][];

	constructor(offset:Point){
		this._offset = offset;
		this._vertices = [];
		this._drawPoints = [];

		for (var i = 0; i < (this._offset.x*2)/this._grid_resolution; ++i) {
			
			this._vertices[i] = new Array<GridVertex>();
			for (var j = 0; j < (this._offset.y*2)/this._grid_resolution; ++j) {
				this._vertices[i][j] = null;
			}
		}
	}

	public addPoly(poly:Polygon){
		for (var i = 0; i < poly.points.length ; ++i) {
			this.placeVertex(poly.points[i], poly);
		}
	}

	private placeVertex(pt:Point, poly:Polygon){
		let grid_x = Math.round((Math.round(pt.x)+this._offset.x)/this._grid_resolution);
		let grid_y = Math.round((Math.round(pt.y)+this._offset.y)/this._grid_resolution);

		if(!this._vertices[grid_x][grid_y]){
			this._vertices[grid_x][grid_y] = new GridVertex(pt, poly);
		}
		else{
			if(this._vertices[grid_x][grid_y].snaps(pt, this._snap)){
				this._vertices[grid_x][grid_y].add(poly)
				this._drawPoints.push(pt);
			}else{
				alert("GRID CLASH!!  " + pt +"  :  " +this._vertices[grid_x][grid_y].point);
			}
		}
	}

	public dump():any{
		let output = {"data":[]};

		for (var i = 0; i < this._vertices.length; ++i) {
			output.data[i] = [];
			for (var j = 0; j < this._vertices[i].length; ++j) {
				if(this._vertices[i][j]){
					output.data[i][j] = this._vertices[i][j].hash;	
				}
			}
		}
		return output;
	}

	// private search_grid_x(pt:Point):number{
	// 	//naieve approach for now
	// 	for(let i = 0; i < this._vertices.length-1; ++i){
	// 		if(Math.abs(this._vertices[i][0].point.x - pt.x) < this._snap){
	// 			return i;
	// 		}
	// 		else if(this._vertices[i+1][0].point.x > pt.x && this._vertices[i][0].point.x < pt.x){
	// 			this._vertices.splice(i, 0, new Array<GridVertex>);
	// 			return i;
	// 		}
	// 	}
	// 	return this._vertices.length;

	// }

	// private search_grid_y(pt:Point){
		
	// }

	public draw(context:CanvasRenderingContext2D){
		
		for (var i = 0; i < this._vertices.length; ++i) {
			for (var j = 0; j < this._vertices[i].length; ++j) {
				//if(this._vertices[i][j])
					//this._vertices[i][j].draw(context);
			}
		}


	}



}

class GridVertex{
	private _point:Point;
	private _polygons: Polygon[];

	constructor(point:Point, poly:Polygon){
		this._polygons = new Array<Polygon>();
		this._polygons.push(poly);
		this._point = point.copy();
	}

	public draw(context:CanvasRenderingContext2D){
		if(this._polygons.length > 1){
			for (var i = 0; i < this._polygons.length; ++i) {
				context.moveTo(this._point.x, this._point.y);
				context.lineTo(this._polygons[i].centroid.x, this._polygons[i].centroid.y);
			}
		}
		context.strokeStyle = "#00FF00";
		context.stroke();
		context.strokeStyle = "#000000";
	}

	public get point():Point{
		return this._point;
	}

	public get hash():string{
		let result = "";
		for(let i = 0; i < this._polygons.length; ++i){
			result += this._polygons[i].length;
		}
		return result;
	}

	public snaps(pt:Point, snap_dist:number){
		return BJMath.dist(this._point.x, this._point.y, pt.x, pt.y) < snap_dist;
	}

	public add(polygon:Polygon){
//		if(this._polygons.length = 0){
			this._polygons.push(polygon);
		// 	return;
		// }

		// else{
		// 	let angle = Math.atan2(this._point.y - polygon.centroid.y, this._point.x - polygon.centroid.x)
		// 	for(let i = 0; i < this._polygons.length; ++i){
		// 		let angle2 = Math.atan2(this._point.y - this._polygons[i].centroid.y, this._point.x - this._polygons[i].centroid.x)
		// 		if(angle < angle2){
		// 			this._polygons.splice(i,0,polygon);
		// 			return;
		// 		}
		// 	}
		// }

		// this._polygons.push(polygon);
	}

}