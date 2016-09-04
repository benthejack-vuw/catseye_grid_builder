function PolygonGrid(){
	this.polygons = [];
	this.bounds = [];
	this.normalized_polygons = [];
	this.normalized_bounds = [];
}

PolygonGrid.prototype.add_polygon = function(poly){
	this.polygons.push(poly);
};

PolygonGrid.prototype.size = function(){
	return this.polygons.length;
}

PolygonGrid.prototype.delete_poly_under_point = function(point){
	var poly = this.polygon_under(point);
	if(poly){
		var index = this.polygons.indexOf(poly);
		if(index > -1){this.polygons.splice(index, 1);}
	}
};

PolygonGrid.prototype.first = function(){
	return this.polygons[0];
};

PolygonGrid.prototype.closest_edge = function(pt, tolerance){
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

PolygonGrid.prototype.polygon_under = function(pt){
	for(var i = 0; i < this.polygons.length; ++i){
		if(this.polygons[i].is_under(pt)){
			return this.polygons[i];
		}
	}
	return null;
};

PolygonGrid.prototype.set_bounds = function(pts){
	this.bounds = pts;
};

PolygonGrid.prototype.empty = function(){
	return this.polygons.length <= 0;
};

PolygonGrid.prototype.draw = function(context){
	
	context.strokeStyle = DrawingUtils.grey(0);
	context.fillStyle = DrawingUtils.grey(255);
	for(var i = 0; i < this.polygons.length; ++i){
		this.polygons[i].draw(context, true);
	}
	
};

PolygonGrid.prototype.normalize = function(bounding_box){
	
	this.bounds = new BoundingBox();
	this.bounds.from_points(bounding_box);
	this.normalized_bounds = this.bounds.normalized();

	this.normalized_polygons = [];
	for(var i = 0; i < this.polygons.length; ++i){
		if(this.polygons[i].inside(this.bounds)){
			this.normalized_polygons.push(this.polygons[i].normalized_points(this.bounds));
		}
	}
};

PolygonGrid.prototype.to_JSON = function(){

	var polygons_out = [];
	for(var i = 0; i < this.polygons.length; ++i){
		polygons_out.push(this.polygons[i].to_vertex_position_array());
	}

	var norm_polygons_out = [];
	for(i = 0; i < this.normalized_polygons.length; ++i){
		norm_polygons_out.push(this.normalized_polygons[i]);
	}

	var out = {
		polygons: polygons_out,
		bounds: this.bounds,
		normalized_bounds: this.normalized_bounds,
		normalized_polygons: norm_polygons_out
	};

	return JSON.stringify(out);
};
