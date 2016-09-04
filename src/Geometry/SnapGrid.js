var SnapGrid = function(i_points){
	
	this.points = i_points;

	this.closest = function(pt){
		var closest = null;
		var min_dist = Number.MAX_SAFE_INTEGER;

		for (var i = 0; i < this.points.length; i++) {
			var d = dist(this.points[i].x, this.points[i].y, pt.x, pt.y);
			if(d < min_dist){
				closest = this.points[i];
				min_dist = d;
			}
		}

		return {x:closest.x, y:closest.y};
	};

	this.draw = function(){
		for (var i = 0; i < this.points.length; i++) {
			fill(255,0,0);
			ellipse(this.points[i].x, this.points[i].y, 5, 5);
		}
	};

	this.bounding_box = function(){
		return new BoundingBox(this.points);
	};

};