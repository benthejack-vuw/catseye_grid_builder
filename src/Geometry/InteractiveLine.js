//InteractiveLine is a line geometry class that has some helpful math functions included
class InteractiveLine{ 

	constructor(pt1, pt2){
		this[0] = pt1;
		this[1] = pt2;
	}

	distance_from(pt){
		let enume = (this[1].y-this[0].y)*pt.x - (this[1].x-this[0].x)*pt.y + this[1].x*this[0].y - this[0].x*this[1].y 
		enume = abs(enume);
		let denom = this[0].dist(this[1]);

		return enume/denom;
	}

	get angle(){
		return atan2(this[1].y - this[0].y, this[1].x - this[0].x);
	}

	get length(){
		return this[0].dist(this[1]);
	}

	draw(strokeColour){
		stroke(strokeColour === undefined ? 0 : strokeColour);
		line(this[0].x, this[0].y, this[1].x, this[1].y)
	}

}