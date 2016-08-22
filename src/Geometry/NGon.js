
let InteractiveLine = function(pt1, pt2){

	this[0] = pt1;
	this[1] = pt2;

	this.distance_from = function(pt){

		let enume = (this[1].y-this[0].y)*pt.x - (this[1].x-this[0].x)*pt.y + this[1].x*this[0].y - this[0].x*this[1].y 
		enume = abs(enume);
		let denom = this[0].dist(this[1]);

		return enume/denom;
	}

	this.angle = function(){
		return atan2(this[1].y - this[0].y, this[1].x - this[0].x);
	}

	this.length = function(){
		return this[0].dist(this[1]);
	}

	this.draw = function(strokeColour){
		stroke(strokeColour === undefined ? 0 : strokeColour);
		line(this[0].x, this[0].y, this[1].x, this[1].y)
	}

}

//NGon is an interactive polygon object composed of InteractiveLines
let NGon = function (sides){

	this.sides = sides;
	this.vertices = [];
	this.edges = [];
	this.theta = 6.28318/sides;

	this.empty = function(){
		this.vertices = [];
		this.edges = [];
	}

	//this function sets up an un-rotated plain polygon
	this.initialize = function(x, y, radius){
		this.empty();

		this.radius = radius === undefined ? 1 : radius;

		//vertex function to be passed into create_edges
		let verts_from_radius = function(i){
			vertex_at_index(i, x + Math.cos(i*theta)*this.radius, y + Math.sin(i*theta)*this.radius);
		}

		create_edges(verts_from_radius);
		console.log(this.vertices);
	}

	//Set up an NGon with the given side already defined.
	//This is used to create two polygons that share an edge
	this.initialize_from_line = function(interactive_line){

		this.empty();

		let half_inner_poly_angle = (((this.sides-2)*PI)/this.sides)/2.0;
		let angle_to_centre_point = half_inner_poly_angle + interactive_line.angle();
		this.radius = interactive_line.length/sin(this.theta/2);

		let centre_point_x = interactive_line[0].x + cos(angle_to_centre_point)*this.radius
		let centre_point_y = interactive_line[0].y + sin(angle_to_centre_point)*this.radius

		//vertex function to be passed into create_edges
		let verts_from_line = function(i){
			let x = centre_point_x + cos(this.theta*i + this.theta/2.0 - PI/2.0 + interactive_line.angle()) * radius;
			let y = centre_point_y + sin(this.theta*i + this.theta/2.0 - PI/2.0 + interactive_line.angle()) * radius;
			vertex_at_index(i, x, y);
		}

		create_edges(verts_from_line);
	}

	this.draw = function(){
		fill(0);
	//eginShape();

		for(i = 0; i < this.vertices.length; ++i){
			console.log(i);
			ellipse(this.vertices[i].x, this.vertices[i].y, 100,100);
		}
	//	endShape(CLOSE);		
	}

	//private functions

	//vertex_from_index takes the index of the point (zero indexed) 
	//it returns the P5js Vector at that index or creates it if it doesn't yet exist
	function vertex_at_index(i, x, y){
		if(this.vertices[i%this.sides])
			return vertices[i];
		else{
			let pt = createVector(x, y);
			vertices[i%this.sides] = pt;
			return pt;
		}
	}	

	//function that creates the edges, it takes a vertex function as an argument
	//the vertex function should take an index and return a point by calling vertex_at_index(i, x, y)
	function create_edges(vertex_function){

			console.log("pt1, pt2");

		for(i = 0; i < this.sides; ++i){
			let pt1 = vertex_function(i);
			let pt2 = vertex_function(i+1);
			console.log(pt1, pt2);
			this.edges[i] = new InteractiveLine(pt1, pt2);
		}
		
	}




}
