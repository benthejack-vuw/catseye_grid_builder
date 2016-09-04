function RegularPolygon(){
	Polygon.call(this);
}

RegularPolygon.prototype = Object.create(Polygon.prototype);
RegularPolygon.prototype.constructor=RegularPolygon;      

//-----------------------------------------INITIALIZERS------------------------------------------------

//this function sets up an un-rotated regular polygon by providing the number of sides,
//the center point and the radius
RegularPolygon.prototype.initialize_regular_polygon = function(sides, pt, radius){
	
	this.empty();
	this.centroid_position = pt;
	this.vertex_count = sides;
	this.theta = 6.28318/this.vertex_count;

	this.radius = radius === undefined ? 1 : radius;

	//vertex function to be passed into create_edges
	var verts_from_radius = function(ngon, i){
		return {x:pt.x + Math.cos(i*ngon.theta)*ngon.radius, y:pt.y+Math.sin(i*ngon.theta)*ngon.radius};
	};

	this.create_edges(verts_from_radius);
};

//Set up an NGon with the given side already defined.
//This is used to create two polygons that share an edge
RegularPolygon.prototype.initialize_from_line = function(sides, interactive_line){

	this.empty();

	this.vertex_count = sides;
	this.theta = 6.28318/this.vertex_count;

	var half_inner_poly_angle = (((this.vertex_count-2)*Math.PI)/this.vertex_count)/2.0;
	var angle_to_centre_point = half_inner_poly_angle + interactive_line.angle(true);
	this.radius = (interactive_line.length()/2.0)/Math.sin(this.theta/2);

	var centre_point_x = interactive_line[1].x + Math.cos(angle_to_centre_point)*this.radius;
	var centre_point_y = interactive_line[1].y + Math.sin(angle_to_centre_point)*this.radius;

	this.centroid_position = {x:centre_point_x, y:centre_point_y};

	//vertex function to be passed into create_edges
	var verts_from_line = function(ngon, i){
		var x_pos = centre_point_x + Math.cos(ngon.theta*i + ngon.theta/2.0 - Math.PI/2.0 + interactive_line.angle(true)) * ngon.radius;
		var y_pos = centre_point_y + Math.sin(ngon.theta*i + ngon.theta/2.0 - Math.PI/2.0 + interactive_line.angle(true)) * ngon.radius;
		return {x:x_pos, y:y_pos};
	};

	this.create_edges(verts_from_line);
};	