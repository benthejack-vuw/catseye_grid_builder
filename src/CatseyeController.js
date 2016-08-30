var CatseyeController = function(canvas){

	this.interaction_manager = new InteractionManager(this, canvas, "min/catseye_grid_interaction_definitions_file-min.json");
	this.interaction_manager.start();

	this.grid = new PolygonGrid();
	this.edge_highlight = null;
	
	this.next_poly_sides = 6;
	this.polygon_ghost = new NGon(this.next_poly_sides);
	this.polygon_ghost.initialize({x:400, y:400}, 60);

	this.mouseData = null;

	this.draw = function(){
		
		this.grid.draw();

		if(this.edge_highlight && !this.grid.empty()){
			strokeWeight(2);
			this.edge_highlight.draw(color(0,255,0));
		}
		if(this.polygon_ghost){
			stroke(200);
			fill(255,50);
			this.polygon_ghost.draw();
		}
	};

	this.mouse_move = function(i_mouseData){
		this.mouseData = i_mouseData;

		var new_edge = this.grid.closest_edge(this.mouseData.position, 15);
		
		if(!this.grid.empty()){
			if(new_edge === null){
				this.polygon_ghost.empty();
			}
			else if(this.edge_highlight !== new_edge){
				this.edge_highlight = new_edge;
				this.polygon_ghost.initialize_from_line(this.edge_highlight);
			}
		}
	};

	this.place_polygon = function(i_mouseButton, i_mouseData){
		this.grid.add_polygon(this.polygon_ghost);
		this.polygon_ghost = new NGon(this.next_poly_sides);
	};

	this.change_current_poly = function(last_pressed, keyboard_data){		
		this.next_poly_sides = parseInt(last_pressed);
		this.polygon_ghost = new NGon(this.next_poly_sides);
		if(this.edge_highlight){
			this.polygon_ghost.initialize_from_line(this.edge_highlight);
		}else if(this.grid.empty()){
			this.polygon_ghost.initialize({x:400, y:400}, 60);
		}
	};

	this.delete_poly = function(){
		this.grid.delete_poly_under_point(this.mouseData.position);
		if(this.grid.empty()){
			this.polygon_ghost.initialize({x:400, y:400}, 60);
		}

	};


};