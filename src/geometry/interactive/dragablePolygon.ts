
export default class DragablePolygon{

	constructor(starting_points, snap_grid, point_generation_data){

		this.selector_radius = 15;
		this.snap_grid = snap_grid;
		this.selected_corner = null;

		var i = 0;
		if(starting_points){
			this.length = starting_points.length;
			for(i = 0; i < starting_points.length; ++i){
				this[i] = starting_points[i];
			}
		}else if(point_generation_data){
			this.length = point_generation_data.num_points;
			var theta = TWO_PI/point_generation_data.num_points;

			for(i = 0; i < point_generation_data.num_points; ++i){
				this[i] = {x: point_generation_data.mid_point.x + cos(theta*i) * point_generation_data.radius,
						   y: point_generation_data.mid_point.y + sin(theta*i) * point_generation_data.radius};
			}
		}
	}

	this.select_corner = function(pt){
		
		this.selected_corner = null;

		for (var i = 0; i < this.length; i++) {
			var d = dist(this[i].x, this[i].y, pt.x, pt.y);
			if(d < this.selector_radius){
				this.selected_corner = i;
				break;
			}
		}
		if(this.selected_corner){return this[this.selected_corner];}
		else{return null;}
	};

	this.drag = function(pt){
		if(this.selected_corner != null){
			if(this.snap_grid){this[this.selected_corner] = this.snap_grid.closest(pt);}
			else{this.selected_corner = {x:pt.x, y:pt.y};}
		}
	};

	this.points = function(){
		var out = [];
		for(var i = 0; i < this.length; ++i){
			out.push({x:this[i].x, y:this[i].y});
		}
		return out;
	};

	this.bounding_box = function(){
		return new BoundingBox(this);
	}

	this.normalized_points = function(bounding_box){
		var out = [];
		for(var i = 0; i < this.length; ++i){
			out.push({x:(this[i].x-bounding_box[0])/(abs(bounding_box[2].x-bounding_box[0].x)),
					  y:(this[i].y-bounding_box[0])/(abs(bounding_box[2].y-bounding_box[0].y))});
		}
		return out;
	};

	this.draw = function(stroke_color, stroke_weight){

		stroke_color = stroke_color === undefined ? 0 : stroke_color;
		stroke_weight = stroke_weight === undefined ? 2 : stroke_weight;

		for(var i = 0; i < this.length; ++i){
			strokeWeight(stroke_weight);
			stroke(stroke_color);
			line(this[i].x, this[i].y, this[(i+1)%this.length].x, this[(i+1)%this.length].y);
		}
		
		for(i = 0; i < this.length; ++i){
			if(this.selected_corner !== null && this.selected_corner == i){
				fill(0, 255, 0);
			}else{
				fill(255,0,0);
			}
			noStroke();
			ellipse(this[i].x, this[i].y, this.selector_radius*2, this.selector_radius*2);
		}
	};

};*/