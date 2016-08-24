var PolygonGrid = function(){

	this.polygons = [];
	this.bounds = [];

	this.add_polygon = function(poly){
		this.polygons.push(poly);
	};

	this.new_polygon_on_edge = function(edge, sides){
		var poly = new NGon(sides);
		poly.initialize_from_line(edge);
		this.polygons.push(poly);
	};	

	this.closest_edge = function(pt_x, pt_y){
		var closest = null;
		var min_dist = Number.MAX_SAFE_INTEGER;
		for(var i = 0; i < this.polygons.length; ++i){
			var dist = this.polygons[i].distance_to_edge_boundary(pt_x, pt_y);
			if(dist && dist < min_dist){
				closest = this.polygons[i].closest_edge(pt_x, pt_y);
				min_dist = dist;
			}
		}
	};

	this.polygon_under = function(pt_x, pt_y){
		for(var i = 0; i < this.polygons.length; ++i){
			if(this.polygons[i].is_under(pt_x, pt_y)){
				return this.polygons[i];
			}
		}

		return null;
	};

	this.set_bounds = function(pts){
		this.bounds = pts;
	};

	this.draw = function(){
		for(var i = 0; i < this.polygons.length; ++i){
			this.polygons[i].draw();
		}
	};

	this.to_JSON = function(){

		var polygons_out = [];
		for(var i = 0; i < this.polygons.length; ++i){
			polygons_out.push(this.polygons[i].to_vertex_position_array);
		}

		var out = {
			boundary: this.bounds,
			polygons: polygons_out
		};

		return JSON.stringify(out);
	};

};