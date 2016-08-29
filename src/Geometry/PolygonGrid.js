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

	this.add_polygon_at_point = function(point, sides, snap_to_nearest_edge){
		if(this.polygons.length === 0 || snap_to_nearest_edge === undefined){
			var poly = new NGon(sides);
			poly.initialize(point, 50);
			this.polygons.push(poly);
		}else{
			var edge = this.closest_edge(point);
			console.log(edge);
			if(edge){
				var poly = new NGon(sides);
				poly.initialize_from_line(edge);
				this.polygons.push(poly);
			}
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
			if(this.polygons[i].is_under(pt.x, pt.y)){
				return this.polygons[i];
			}
		}
		return null;
	};

	this.set_bounds = function(pts){
		this.bounds = pts;
	};

	this.draw = function(){
		
		stroke(0);
		fill(255);

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