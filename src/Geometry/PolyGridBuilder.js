PolyGridBuilder.prototype = Object.create(Polygon.prototype);
PolyGridBuilder.prototype.constructor = PolyGridBuilder;

function PolyGridBuilder(centre_point, starting_radius){
	this.grid = new PolygonGrid();
	this.selected_edge = null;
	this.mouseData = null;
	this.centre_point = centre_point;
	this.starting_radius = starting_radius;
	this.next_poly_sides = 6;
	this.polygon_ghost = new RegularPolygon();
	this.polygon_ghost.initialize_regular_polygon(this.next_poly_sides, centre_point, starting_radius);
}

PolyGridBuilder.prototype.generate_snap_grid = function(resolution){
	var snap_points = [];
	for (var i = 0; i < this.polygons.length; ++i) {
		var poly_pts = this.polygons[i].generate_inner_grid(resolution);
		snap_points = snap_points.concat(poly_pts);			
	}
	return new SnapGrid(snap_points);
};


PolyGridBuilder.prototype.draw = function(context){

	this.grid.draw(context);

	if(this.polygon_ghost){
		context.strokeStyle = DrawingUtils.grey(200);
		context.fillStyle = DrawingUtils.rgba(255, 255, 255, 50);
		this.polygon_ghost.draw(context, true);
	}

	if(this.snapGrid){
		this.snapGrid.draw();
	}

	if(this.grid_repeat_selector){
		this.grid_repeat_selector.draw();
	}
};

PolyGridBuilder.prototype.mouse_move = function(i_mouseData){

	this.mouseData = i_mouseData;
	
	var new_edge = this.grid.closest_edge(this.mouseData.position, 15);
	
	if(!this.grid.empty()){
		if(new_edge === null){
			this.polygon_ghost.empty();
		}
		else if(this.selected_edge !== new_edge){
			this.selected_edge = new_edge;
			this.polygon_ghost.initialize_from_line(this.next_poly_sides, this.selected_edge);
		}
	}
};

PolyGridBuilder.prototype.mouse_drag = function(i_mouseData){
	this.mouseData = i_mouseData;
	if(this.grid_repeat_selector){
		this.grid_repeat_selector.drag(this.mouseData.position);
	}
};

PolyGridBuilder.prototype.mouse_down = function(i_mouse_button, i_mouseData){
	this.mouseData = i_mouseData;
	if(this.grid_repeat_selector){
		this.grid_repeat_selector.select_corner(this.mouseData.position);
	}
};

PolyGridBuilder.prototype.generate_snap_grid = function(){
	this.snapGrid = this.grid.generate_snap_grid(2);
	this.grid_repeat_selector = new DragablePolygon(this.snapGrid.bounding_box(), this.snapGrid);
};

PolyGridBuilder.prototype.place_polygon = function(){
	
	if(this.grid_repeat_selector === null || this.grid_repeat_selector === undefined){
		this.grid.add_polygon(this.polygon_ghost);
		this.polygon_ghost = new RegularPolygon(this.next_poly_sides);
		this.selected_edge = this.grid.closest_edge(this.mouseData.position);
		this.polygon_ghost.initialize_from_line(this.next_poly_sides, this.selected_edge);
	}

	if(this.grid.size() == 1){
		DomUtils.editDomElementAttr("rotate_slider", "step", Math.TWO_PI/(this.grid.first().vertex_count*2));
	}
};

PolyGridBuilder.prototype.change_current_poly = function(last_pressed){		
	this.next_poly_sides = parseInt(last_pressed);

	this.polygon_ghost = new RegularPolygon();
	if(this.grid.empty()){
		this.polygon_ghost.initialize_regular_polygon(this.next_poly_sides, this.centre_point, this.starting_radius);
	}else if(this.selected_edge){
		this.polygon_ghost.initialize_from_line(this.next_poly_sides, this.selected_edge);
	}
};

PolyGridBuilder.prototype.delete_poly = function(){
	this.grid.delete_poly_under_point(this.mouseData.position);
	if(this.grid.empty()){
		this.polygon_ghost.initialize_regular_polygon(this.next_poly_sides, this.centre_point, this.starting_radius);
	}
};
