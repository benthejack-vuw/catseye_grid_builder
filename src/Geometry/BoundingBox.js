var BoundingBox = function(points){
	
	this.length = 4;

	this.initialize = function(){
		if(points === undefined){
			this[0] = {x:0, y:0};
			this[1] = {x:1, y:0};
			this[2] = {x:1, y:1};
			this[3] = {x:0, y:1};
		}else{
			this.from_points(points);
		}
	}
	
	this.from_points = function(points, num_points){
		var left = Number.MAX_SAFE_INTEGER;
		var right = -Number.MAX_SAFE_INTEGER;
		var top = Number.MAX_SAFE_INTEGER;
		var bottom = -Number.MAX_SAFE_INTEGER;
		
		num_points = num_points === undefined ? points.length : num_points;

		for (var i = 0; i < num_points; i++) {
			left = min(left, points[i].x);
			right = max(right, points[i].x);
			top = min(top, points[i].y);
			bottom = max(bottom, points[i].y);
		}

		this[0] = {x:left, y:top};
		this[1] = {x:right, y:top};
		this[2] = {x:right, y:bottom};
		this[3] = {x:left, y:bottom};
	};

	this.width = function(){
		return this[2].x - this[0].x;
	};

	this.height = function(){
		return this[2].y - this[0].y;
	};

	this.set = function(pt, value){
		this[pt] = value;
		this.from_points(this, 4);
	};

	this.contains_point = function(pt){
		var value = (pt.x > this[0].x && pt.x < this[2].x && pt.y > this[0].y && pt.y < this[2].y);
		return value;
	};

	this.normalized = function(){
		 var out = new BoundingBox(this);
		 var ratio = out.height()/out.width();

		 out[0] = {x:0, y:0};
		 out[1] = {x:1, y:0};
		 out[2] = {x:1, y:ratio};
		 out[3] = {x:0, y:ratio};

		 return out;
	};

	this.initialize();

};