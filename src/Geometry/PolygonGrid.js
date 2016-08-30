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

	this.delete_poly_under_point = function(point){
 		var poly = this.polygon_under(point);
 		console.log(poly, point);
 		if(poly){
			var index = this.polygons.indexOf(poly);
			if(index > -1){this.polygons.splice(index, 1)};
		}

	};

	this.closest_edge = function(pt, tolerance){
		tolerance = tolerance === undefined ? 0 : tolerance;

		var closest = null;
		var min_dist = Number.MAX_SAFE_INTEGER;
		for(var i = 0; i < this.polygons.length; ++i){
			var edge = this.polygons[i].closest_edge(pt);
			if(edge){
				var dist_from = edge.distance_from(pt);
				if(dist_from < min_dist){
					closest = edge;
					min_dist = dist_from;
				}
			}

		}
		return closest;
	};

	this.polygon_under = function(pt){
		for(var i = 0; i < this.polygons.length; ++i){
			if(this.polygons[i].is_under(pt)){
				return this.polygons[i];
			}
		}
		return null;
	};

	this.set_bounds = function(pts){
		this.bounds = pts;
	};

	this.empty = function(){
		return this.polygons.length <= 0;
	}

	this.draw = function(){
		
		stroke(0);
		fill(255);

		for(var i = 0; i < this.polygons.length; ++i){
			this.polygons[i].draw();
		}
	};

	this.generate_snap_points = function(){
		for (var i = 0; i < this.polygons.length; ++i) {
			this.polygons[i].
		}
	}

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