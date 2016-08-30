var CatseyeController = function(canvas){

	this.interaction_manager = new InteractionManager(this, canvas, "min/catseye_grid_interaction_definitions_file-min.json");
	this.interaction_manager.start();

	this.rotation_slider = createSlider(0, TWO_PI, 0, TWO_PI/12);
  	this.rotation_slider.position(10, 10);
  	this.rotation_slider.style('width', '100px');

  	this.scale_slider = createSlider(0.2, 2, 1, 0.1);
  	this.scale_slider.position(10, 20);
  	this.scale_slider.style('width', '100px');

	this.grid = new PolygonGrid();
	this.edge_highlight = null;
	
	this.next_poly_sides = 6;
	this.polygon_ghost = new NGon(this.next_poly_sides);
	this.polygon_ghost.initialize({x:width/2, y:height/2}, 60);

	this.scale = 1.0;
	this.rotation = 0;

	this.mouseData = null;

	this.draw = function(){
		
		this.rotation = this.rotation_slider.value();
		this.scale = this.scale_slider.value();


		push();
			translate(width/2, height/2);
			scale(this.scale);
			rotate(this.rotation);
			translate(-width/2, -height/2);

			this.grid.draw();

			if(this.polygon_ghost){
				stroke(200);
				fill(255,50);
				this.polygon_ghost.draw();
			}

			if(this.snapGrid){
				for (var i = 0; i < this.snapGrid.length; i++) {
					fill(255,0,0);
					ellipse(this.snapGrid[i].x, this.snapGrid[i].y, 5, 5);
				}
			}
		pop();
	};

	this.mouse_move = function(i_mouseData){

		this.mouseData = i_mouseData;
		this.mouseData.position = this.transform_point(i_mouseData.position);

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

	this.generate_snap_grid = function(){
		this.snapGrid = this.grid.generate_snap_grid(2);
//		console.log(this.snapGrid);

	}

	this.transform_point = function(pt){
		var point = {x:pt.x, y:pt.y};
		point = this.rotate_point(point);
		point =  this.scale_point(point);
		return point;
	}

	this.rotate_point = function(pt){
		var point = {x:pt.x, y:pt.y};

		var d = dist(point.x, point.y, width/2, height/2);
		var theta = atan2(point.y-height/2, point.x-width/2);
		theta -= this.rotation;

		point.x = width/2 + cos(theta) * d;
		point.y = height/2 + sin(theta) * d;

		return point;
	}

	this.scale_point = function(pt){
		var point = {x:pt.x, y:pt.y};		

		point.x = (point.x * 1.0/this.scale) - ((width/2)*(1.0/this.scale)) + (width/2);
		point.y = (point.y * 1.0/this.scale) - ((height/2)*(1.0/this.scale)) + (height/2);
		return point;
	}

	this.place_polygon = function(i_mouseButton, i_mouseData){
		this.grid.add_polygon(this.polygon_ghost);
		this.polygon_ghost = new NGon(this.next_poly_sides);
	};

	this.change_current_poly = function(last_pressed, keyboard_data){		
		this.next_poly_sides = parseInt(last_pressed);
		console.log("boip");
		this.rotation_slider.elt.setAttribute("step", TWO_PI/(this.next_poly_sides*2));

		this.polygon_ghost = new NGon(this.next_poly_sides);
		if(this.edge_highlight){
			this.polygon_ghost.initialize_from_line(this.edge_highlight);
		}else if(this.grid.empty()){
			this.polygon_ghost.initialize({x:width/2, y:height/2}, 60);
		}
	};

	this.delete_poly = function(){
		this.grid.delete_poly_under_point(this.mouseData.position);
		if(this.grid.empty()){
			this.polygon_ghost.initialize({x:width/2, y:height/2}, 60);
		}

	};


};