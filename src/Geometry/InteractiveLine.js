//InteractiveLine is a line geometry class that has some helpful math functions included

var InteractiveLine = function(pt1, pt2){ 

	this[0] = pt1;
	this[1] = pt2;

	this.distance_from = function(pt){

		var enume = (this[1].y-this[0].y)*pt.x - (this[1].x-this[0].x)*pt.y + this[1].x*this[0].y - this[0].x*this[1].y; 
		enume = abs(enume);
		var denom = this[0].dist(this[1]);

		return enume/denom;
	};

	this.angle = function(){
		return atan2(this[1].y - this[0].y, this[1].x - this[0].x);
	};

	this.length = function(){
		return this[0].dist(this[1]);
	};

	this.draw = function(strokeColour){
		stroke(strokeColour === undefined ? 0 : strokeColour);
		line(this[0].x, this[0].y, this[1].x, this[1].y);
	};

	// isLeft(): tests if a point is Left|On|Right of an infinite line.
	//    Input:  three points P0, l2, and P2
	//    Return: >0 for P2 left of the line through P0 and P1
	//            =0 for P2  on the line
	//            <0 for P2  right of the line
	//   taken from http://geomalgorithms.com/a03-_inclusion.html
	this.isLeft = function(pt)
	{
	    return ( (this[1].x - this[0].x) * (pt.y - this[0].y) - (pt.x -  this[0].x) * (this[1].y - this[0].y) );
	}

};