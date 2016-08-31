//NGon is an interactive polygon object composed of InteractiveLines
//NGons are the building block for grids
var NGon = function(sides){

	this.sides = sides;
	this.vertices = [];
	this.edges = [];
	this.theta = 6.28318/sides;
	this.position = null;


	//---------------------------HELPER FUNCTIONS------------------------------------------------
	this.empty = function(){
		this.vertices = [];
		this.edges = [];
		this.position = null;
	};

	//vertex_from_index takes the index of the point (zero indexed) 
	//it returns the P5js Vector at that index or creates it if it doesn't yet exist
	this.vertex_at_index = function(i, vertex_function){
		if(this.vertices[i%this.sides]){
			return this.vertices[i%this.sides];
		}
		else{
			var pt = vertex_function(this, i);
			this.vertices[i%this.sides] = pt;
			return pt;
		}
	};

	//function that creates the edges, it takes a vertex function as an argument
	//the vertex function should take an index and return a point by calling vertex_at_index(i, x, y)
	this.create_edges = function(vertex_function){

		for(var i = 0; i < this.sides; ++i){
			var pt1 = this.vertex_at_index(i, vertex_function);
			var pt2 = this.vertex_at_index(i+1, vertex_function);
			this.edges[i] = new InteractiveLine(pt1, pt2);
		}
		
	};


	//-----------------------------------------INITIALIZERS------------------------------------------------

	//this function sets up an un-rotated plain polygon
	this.initialize = function(pt, radius){
		this.empty();
		this.position = pt;

		this.radius = radius === undefined ? 1 : radius;

		//vertex function to be passed into create_edges
		var verts_from_radius = function(ngon, i){
			return createVector(pt.x + Math.cos(i*ngon.theta)*ngon.radius, pt.y+Math.sin(i*ngon.theta)*ngon.radius);
		};

		this.create_edges(verts_from_radius);
	};

	//Set up an NGon with the given side already defined.
	//This is used to create two polygons that share an edge
	this.initialize_from_line = function(interactive_line){

		this.empty();

		var half_inner_poly_angle = (((this.sides-2)*PI)/this.sides)/2.0;
		var angle_to_centre_point = half_inner_poly_angle + interactive_line.angle(true);
		this.radius = (interactive_line.length()/2.0)/sin(this.theta/2);

		var centre_point_x = interactive_line[1].x + cos(angle_to_centre_point)*this.radius;
		var centre_point_y = interactive_line[1].y + sin(angle_to_centre_point)*this.radius;

		this.position = {x:centre_point_x, y:centre_point_y};

		//vertex function to be passed into create_edges
		var verts_from_line = function(ngon, i){
			var x = centre_point_x + cos(ngon.theta*i + ngon.theta/2.0 - PI/2.0 + interactive_line.angle(true)) * ngon.radius;
			var y = centre_point_y + sin(ngon.theta*i + ngon.theta/2.0 - PI/2.0 + interactive_line.angle(true)) * ngon.radius;
			return createVector(x, y);
		};

		this.create_edges(verts_from_line);
	};

	this.initialize_from_array = function(points){

		this.empty();

		//vertex function to be passed into create_edges
		var verts_from_array = function(ngon, i){
			var x = points[i].x;
			var y = points[i].y;
			return createVector(x, y);
		};

		this.create_edges(verts_from_array);

		this.position = this.calculate_centroid();
		this.radius = dist(points[0].x, points[0].y, this.position.x, this.position.y);
	};

	//-----------------------------------------------METHODS----------------------------------------------


	//windng number algorithm taken from http://geomalgorithms.com/a03-_inclusion.html
	this.is_under = function(pt)
	{
	    var wn = 0;    
	    // loop through all edges of the ptolygon
	    for (var i=0; i < this.edges.length; ++i) {   // edge from V[i] to  V[i+1]
	        if (this.edges[i][0].y <= pt.y) {          // start y <= pt.y
	            if (this.edges[i][1].y  > pt.y){      // an upward crossing
	                 if (this.edges[i].isLeft(pt) > 0){  // pt left of  edge
	                     ++wn;
	                 }
	            }            // have  a valid up intersect
	        }
	        else {                        // start y > pt.y (no test needed)
	            if (this.edges[i][1].y  <= pt.y){     // a downward crossing
	                if (this.edges[i].isLeft(pt) < 0){  // P right of  edge
	                     --wn;            // have  a valid down intersect
	                }
	            }
	        }
	    }

	    return wn > 0;
	};

	this.in_containing_circle = function(pt, tolerance){
		tolerance = tolerance === undefined ? 0 : tolerance;
		return dist(pt.x, pt.y, this.position.x, this.position.y) < (this.radius + tolerance);
	};

	this.closest_edge = function(pt){
		var min_dist = Number.MAX_SAFE_INTEGER;
		var closest = null;
		for(var i = 0; i < this.edges.length; ++i){
			var dist = this.edges[i].distance_from(pt);
			if(dist < min_dist){
				closest = this.edges[i];
				min_dist = dist;
			}
		}
		return closest;
	};

	this.draw = function(){
		beginShape();
		for(var i = 0; i < this.edges.length; ++i){
			var pt = this.edges[i][0];
			vertex(pt.x, pt.y);
		}
		endShape(CLOSE);
	};

	//this strips out all the p5JS Vector data and returns an array of objects with x and y properties
	this.to_vertex_position_array = function(){
		var out = [];
		for(var i = 0; i < this.vertices.length; ++i){
			out.push({
				x: +this.vertices[i].x.toFixed(3),
				y: +this.vertices[i].y.toFixed(3)
			});
		}
		return out;
	};

	this.generate_inner_grid = function(resolution){
		
		var center = this.calculate_centroid();
		var pts = [center];
		pts = pts.concat(this.vertices);

		for (var i = 0; i < this.vertices.length; i++) {
			var curr = this.vertices[i];
			var next = this.vertices[(i+1)%this.vertices.length];
			for (var j = 1; j < resolution; j++) {
				var t = j*(1/(resolution));
				pts.push({x:lerp(curr.x, center.x, t), y:lerp(curr.y, center.y, t)});
				pts.push({x:lerp(curr.x, next.x, t), y:lerp(curr.y, next.y, t)});
			}	
		}
		return pts;
	};

	this.calculate_centroid = function(){
		
		var x_total = 0;
		var y_total = 0;

		for(var i = 0; i < this.vertices.length; ++i){
			x_total += this.vertices[i].x;
			y_total += this.vertices[i].y;
		}

		return {x:x_total/this.sides, y:y_total/this.sides};
	};

	this.inside = function(bounding_box){
		for (var i = 0; i < this.vertices.length; i++) {
			if(bounding_box.contains_point(this.vertices[i])){
				return true;
			}
		}
		return false;
	};

	this.normalized_points = function(bounding_box){
		var pts = [];
		for (var i = 0; i < this.vertices.length; i++) {
			
			var x_out = +((this.vertices[i].x - bounding_box[0].x)/bounding_box.width()).toFixed(6);
			var y_out = +((this.vertices[i].y - bounding_box[0].y)/bounding_box.width()).toFixed(6);

			// x_out = +map(x_out, 0, width, 0, bounding_box.width()).toFixed(3);
			// y_out = +map(y_out, 0, width, 0, bounding_box.width()).toFixed(3);

			pts.push({x:x_out, 
					  y:y_out
					 });
		}
		return pts;
	};

	this.completely_inside = function(bounding_box){
		var contains = false;
		for (var i = 0; i < this.vertices.length; i++) {
			if(!bounding_box.contains_point(this.vertices[i])){
				return false;
			};
		}
		return true;
	}

};
