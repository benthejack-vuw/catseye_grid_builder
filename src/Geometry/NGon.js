
//NGon is an interactive polygon object composed of InteractiveLines
class NGon{

 	constructor(sides){
		this.sides = sides;
		this.vertices = [];
		this.edges = [];
		this.theta = 6.28318/sides;
	}


	//---------------------------HELPER FUNCTIONS------------------------------------------------
	empty(){
		this.vertices = [];
		this.edges = [];
	}

	//vertex_from_index takes the index of the point (zero indexed) 
	//it returns the P5js Vector at that index or creates it if it doesn't yet exist
	vertex_at_index(i, vertex_function){
		if(this.vertices[i%this.sides]){
			return this.vertices[i%this.sides];
		}
		else{
			let pt = vertex_function(this, i);
			this.vertices[i%this.sides] = pt;
			return pt;
		}
	}	

	//function that creates the edges, it takes a vertex function as an argument
	//the vertex function should take an index and return a point by calling vertex_at_index(i, x, y)
	create_edges(vertex_function){

		for(let i = 0; i < this.sides; ++i){
			let pt1 = this.vertex_at_index(i, vertex_function);
			let pt2 = this.vertex_at_index(i+1, vertex_function);
			this.edges[i] = new InteractiveLine(pt1, pt2);
		}
		
	}


	//---------------------------CLASS METHODS------------------------------------------------

	//this function sets up an un-rotated plain polygon
	initialize(x, y, radius){
		this.empty();

		this.radius = radius === undefined ? 1 : radius;

		//vertex function to be passed into create_edges
		let verts_from_radius = function(ngon, i){
			return createVector(x + Math.cos(i*ngon.theta)*ngon.radius, y+Math.sin(i*ngon.theta)*ngon.radius);
		}

		this.create_edges(verts_from_radius);
	}

	//Set up an NGon with the given side already defined.
	//This is used to create two polygons that share an edge
	initialize_from_line(interactive_line){

		this.empty();

		let half_inner_poly_angle = (((this.sides-2)*PI)/this.sides)/2.0;
		let angle_to_centre_point = half_inner_poly_angle + interactive_line.angle;
		this.radius = (interactive_line.length/2.0)/sin(this.theta/2);

		let centre_point_x = interactive_line[0].x + cos(angle_to_centre_point)*this.radius
		let centre_point_y = interactive_line[0].y + sin(angle_to_centre_point)*this.radius

		//vertex function to be passed into create_edges
		let verts_from_line = function(ngon, i){
			let x = centre_point_x + cos(ngon.theta*i + ngon.theta/2.0 - PI/2.0 + interactive_line.angle) * ngon.radius;
			let y = centre_point_y + sin(ngon.theta*i + ngon.theta/2.0 - PI/2.0 + interactive_line.angle) * ngon.radius;
			return createVector(x, y);
		}

		this.create_edges(verts_from_line);
	}

	draw(){
		fill(255);
		stroke(0);

		for(let i = 0; i < this.edges.length; ++i){
			this.edges[i].draw();
		}
	}


}
