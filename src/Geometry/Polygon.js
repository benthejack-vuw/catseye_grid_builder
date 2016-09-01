function Polygon(vertex_array){
	if(vertex_array !== undefined){
		this.initialize_from_array(vertex_array);
	}
}

Polygon.prototype = {
	vertex_count: 0,
	vertices: [],
	edges: [],
	centroid_position: null
};

Polygon.prototype.initialize_from_array = function(points){
	this.empty();

	//vertex function to be passed into create_edges
	var verts_from_array = function(ngon, i){
		var x = points[i].x;
		var y = points[i].y;
		return createVector(x, y);
	};

	this.vertex_count = points.length;
	this.create_edges(verts_from_array);

	this.centroid_position = this.calculate_centroid();
	this.radius = dist(points[0].x, points[0].y, this.centroid_position.x, this.centroid_position.y);
};

//---------------------------HELPER FUNCTIONS------------------------------------------------
Polygon.prototype.empty = function(){
	this.vertices = [];
	this.edges = [];
	this.centroid_position = null;
};

//vertex_from_index takes the index of the point (zero indexed) 
//it returns the P5js Vector at that index or creates it if it doesn't yet exist
Polygon.prototype.vertex_at_index = function(i, vertex_function){
	if(this.vertices[i%this.vertex_count]){
		return this.vertices[i%this.vertex_count];
	}
	else{
		var pt = vertex_function(this, i);
		this.vertices[i%this.vertex_count] = pt;
		return pt;
	}
};

//function that creates the edges, it takes a vertex function as an argument
//the vertex function should take an index and return a point by calling vertex_at_index(i, x, y)
Polygon.prototype.create_edges = function(vertex_function){

	for(var i = 0; i < this.vertex_count; ++i){
		var pt1 = this.vertex_at_index(i, vertex_function);
		var pt2 = this.vertex_at_index(i+1, vertex_function);
		this.edges[i] = new InteractiveLine(pt1, pt2);
	}
	
};

//-----------------------------------------------METHODS----------------------------------------------

//windng number algorithm taken from http://geomalgorithms.com/a03-_inclusion.html
Polygon.prototype.is_under = function(pt)
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

Polygon.prototype.contains_point = function(pt, tolerance){
	tolerance = tolerance === undefined ? 0 : tolerance;
	return dist(pt.x, pt.y, this.centroid_position.x, this.centroid_position.y) < (this.radius + tolerance);
};

Polygon.prototype.closest_edge = function(pt){
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

Polygon.prototype.draw = function(){
	beginShape();
	for(var i = 0; i < this.edges.length; ++i){
		var pt = this.edges[i][0];
		vertex(pt.x, pt.y);
	}
	endShape(CLOSE);
};

//this strips out all the p5JS Vector data and returns an array of objects with x and y properties
Polygon.prototype.to_vertex_position_array = function(){
	var out = [];
	for(var i = 0; i < this.vertices.length; ++i){
		out.push({
			x: +this.vertices[i].x.toFixed(3),
			y: +this.vertices[i].y.toFixed(3)
		});
	}
	return out;
};

Polygon.prototype.generate_inner_grid = function(resolution){
	
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

Polygon.prototype.calculate_centroid = function(){
	
	var x_total = 0;
	var y_total = 0;

	for(var i = 0; i < this.vertices.length; ++i){
		x_total += this.vertices[i].x;
		y_total += this.vertices[i].y;
	}

	return {x:x_total/this.vertex_count, y:y_total/this.vertex_count};
};

Polygon.prototype.inside = function(bounding_box){
	for (var i = 0; i < this.vertices.length; i++) {
		if(bounding_box.contains_point(this.vertices[i])){
			return true;
		}
	}
	return false;
};

Polygon.prototype.normalized_points = function(bounding_box){
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

Polygon.prototype.completely_inside = function(bounding_box){
	for (var i = 0; i < this.vertices.length; i++) {
		if(!bounding_box.contains_point(this.vertices[i])){
			return false;
		}
	}
	return true;
};