//InteractiveLine is a line geometry class that has some helpful math functions included

var InteractiveLine = function(pt1, pt2){ 

	this[0] = pt1;
	this[1] = pt2;

	function sqr(x) { return x * x; }
	function dist2(v, w) { return sqr(v.x - w.x) + sqr(v.y - w.y); }
	
	this.distToSegmentSquared = function(p) {
	  var l2 = dist2(this[0], this[1]);
	  if (l2 === 0){return dist2(p, this[0]);}
	  var t = ((p.x - this[0].x) * (this[1].x - this[0].x) + (p.y - this[0].y) * (this[1].y - this[0].y)) / l2;
	  t = Math.max(0, Math.min(1, t));
	  return dist2(p, { x: this[0].x + t * (this[1].x - this[0].x),
	                    y: this[0].y + t * (this[1].y - this[0].y) });
	};

	this.distance_from = function(p) { return Math.sqrt(this.distToSegmentSquared(p)); };

	this.angle = function(reverse){
		var one = reverse ? this[0] : this[1];
		var two = reverse ? this[1] : this[0];
		return Math.atan2(one.y - two.y, one.x - two.x);
	};

	this.length = function(){
		return Math.dist(this[1].x, this[1].y, this[0].x, this[0].y);
	};

	this.draw = function(context, close){
		if(close){context.beginPath();}
		context.lineTo(this[0].x, this[0].y, this[1].x, this[1].y);
		if(close){context.ctx.stroke();}
	};

	// isLeft(): tests if a point is Left|On|Right of an infinite line.
	//    Input:  three points P0, l2, and P2
	//    Return: >0 for P2 left of the line through P0 and P1
	//            =0 for P2  on the line
	//            <0 for P2  right of the line
	//   taken from http://geomalgorithms.com/a03-_inclusion.html
	this.isLeft = function(pt){
	    return ( (this[1].x - this[0].x) * (pt.y - this[0].y) - (pt.x -  this[0].x) * (this[1].y - this[0].y) );
	};

};