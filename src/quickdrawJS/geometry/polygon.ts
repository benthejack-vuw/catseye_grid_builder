import Point from "./point";
import Line from "./line";
import Rectangle from "./rectangle";
import Transform from "../util/transform"
import "../util/mathUtils";


export default class Polygon{

	protected _vertices: Array<Point>;
	protected _edges: Array<Line>;
	protected _radius: number;

	constructor(vertex_array?:Array<any>){
		
		this._vertices = [];
		this._edges = [];
		this._radius = 0;

		if(vertex_array){
			this.initialize_from_array(vertex_array);
		}
	}

	public copy():Polygon{
		return new Polygon(this._vertices);
	}

	public get length():number{
		return this._vertices.length;
	}

	public get radius():number{
		return this._radius;
	}

	public get points():Array<Point>{
		return this._vertices;
	}


 	public initialize_from_array(points: Array<any>): void{
		this.empty();

		//vertex function to be passed into create_edges
		let verts_from_array = (i:number)=>{
			let x_pos = points[i].x;
			let y_pos = points[i].y;
			return new Point(x_pos, y_pos);
		};

		this.create_edges(verts_from_array, points.length);
		this._radius = Math.dist(points[0].x, points[0].y, this.centroid.x, this.centroid.y);
	}

	//---------------------------HELPER FUNCTIONS------------------------------------------------
	public empty(): void{
		this._vertices = [];
		this._edges = [];
	}

	//vertex_from_index takes the index of the point (zero indexed) 
	//it returns the P5js Vector at that index or creates it if it doesn't yet exist
	public vertex_at_index(i: number, totalVerts:number, vertex_function: (i:number)=>Point): Point{
		if(this._vertices[i%totalVerts]){
			return this._vertices[i%totalVerts];
		}
		else{
			let pt = vertex_function(i);
			this._vertices[i%totalVerts] = pt;
			return pt;
		}
	}

	//function that creates the edges, it takes a vertex function as an argument
	//the vertex function should take an index and return a point by calling vertex_at_index(i, x, y)
	protected create_edges(vertex_function: (i:number)=>Point, vertices:number):void{

		for(let i = 0; i < vertices; ++i){
			let pt1 = this.vertex_at_index(i, vertices, vertex_function);
			let pt2 = this.vertex_at_index(i+1, vertices, vertex_function);

			this._edges[i] = new Line(pt1, pt2);
		}
		
	}

	//-----------------------------------------------METHODS----------------------------------------------


	public rotate(rotation:number){
		var mat:Transform = new Transform();
		mat.rotate(rotation);
		for (var i = this._vertices.length - 1; i >= 0; i--) {
			this._vertices[i] = mat.transformPoint(this._vertices[i]);
		}
	}


	//windng number algorithm taken from http://geomalgorithms.com/a03-_inclusion.html
	public contains(pt: Point) : boolean{
	    let wn = 0;    
	    // loop through all edges of the ptolygon
	    for (let i=0; i < this._edges.length; ++i) {   // edge from V[i] to  V[i+1]
	        if (this._edges[i][0].y <= pt.y) {          // start y <= pt.y
	            if (this._edges[i][1].y  > pt.y){      // an upward crossing
	                 if (this._edges[i].isLeft(pt) > 0){  // pt left of  edge
	                     ++wn;
	                 }
	            }            // have  a valid up intersect
	        }
	        else {                        // start y > pt.y (no test needed)
	            if (this._edges[i][1].y  <= pt.y){     // a downward crossing
	                if (this._edges[i].isLeft(pt) < 0){  // P right of  edge
	                     --wn;            // have  a valid down intersect
	                }
	            }
	        }
	    }

	    return wn > 0;
	}

	public closest_edge(pt: Point) : Line{
		let min_dist = Number.MAX_SAFE_INTEGER;
		let closest:Line = null;
		for(let i = 0; i < this._edges.length; ++i){
			let dist = this._edges[i].distanceToPoint(pt);
			if(dist < min_dist){
				closest = this._edges[i];
				min_dist = dist;
			}
		}
		return closest;
	}

	public draw(context: CanvasRenderingContext2D, close: boolean, scale?:number): void{

		scale = scale === undefined ? 1 : scale;

		let verts = this._vertices.length;
		
		if(close){
			context.beginPath();
		}
		
		context.moveTo(this._vertices[0].x*scale, this._vertices[0].y*scale);
		for(let i = 1; i <= verts; ++i){
			context.lineTo(this._vertices[i%verts].x*scale, this._vertices[i%verts].y*scale);
		}

		if(close){
			context.closePath();
			context.fill();
			context.stroke();
		}

	}

	public drawFan(context: CanvasRenderingContext2D, scale?:number): void{

		scale = scale === undefined ? 1 : scale;

		let verts = this._vertices.length;
		var centroid = this.centroid;

		for(let i = 0; i < verts; ++i){
			context.moveTo(centroid.x*scale, centroid.y*scale);
			context.lineTo(this._vertices[i].x*scale, this._vertices[i].y*scale);
		}

	}

	public toJSON(){
		let data:Array<any> = [];
		for(let i = 0; i < this._vertices.length; ++i){
			data.push(this._vertices[i].toJSON());
		}
		return data;
	}

	public generate_inner_grid(resolution:number): Array<Point>{
		
		let center = this.centroid;
		let pts = [center];
		pts = pts.concat(this._vertices);

		for (let i = 0; i < this._vertices.length; i++) {
			let curr = this._vertices[i];
			let next = this._vertices[(i+1)%this._vertices.length];
			for (let j = 1; j < resolution; j++) {
				let t = j*(1/(resolution));
				pts.push(new Point(Math.lerp(curr.x, center.x, t), Math.lerp(curr.y, center.y, t)));
				pts.push(new Point(Math.lerp(curr.x, next.x, t), Math.lerp(curr.y, next.y, t)));
			}	
		}
		return pts;
	};

	public get centroid(): Point{
		
		let x_total = 0;
		let y_total = 0;

		for(let i = 0; i < this._vertices.length; ++i){
			x_total += this._vertices[i].x;
			y_total += this._vertices[i].y;
		}

		return new Point(x_total/this.length, y_total/this.length);
	}

	public inside(bounding_box:any):boolean{
		for (let i = 0; i < this._vertices.length; i++) {
			if(bounding_box.contains(this._vertices[i])){
				return true;
			}
		}
		return false;
	}

	public normalizedPointArray(bounding_box:Rectangle, rotation?:number):Array<Point>{
		let pts:Array<Point> = [];
		let bug:any;
		let pt:Point = new Point(bounding_box.x, bounding_box.y);
		let sz:Point = new Point(bounding_box.width, bounding_box.height);
		var rotationMatrix:Transform = new Transform();
		
		if(rotation){
			rotationMatrix.rotate(rotation);
		}

		for (let i = 0; i < this._vertices.length; i++) {
			
			let v:Point = this._vertices[i];
			
			if(rotation){
				v = rotationMatrix.transformPoint(v);
			}

			let xOut = ((v.x - pt.x)/sz.x);
			let yOut = ((v.y - pt.y)/sz.x);
			
			pts.push(new Point(xOut, yOut));
		}
		return pts;

	}

	public completely_inside(bounding_box:any):boolean{
		for (let i = 0; i < this._vertices.length; i++) {
			if(!bounding_box.contains(this._vertices[i])){
				return false;
			}
		}
		return true;
	}
}