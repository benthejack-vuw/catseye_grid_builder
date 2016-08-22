
let InteractiveLine = function(pt1, pt2){

	this[0] = pt1;
	this[1] = pt2;

	this.distance_from(pt){

		let enume = (this[1].y-this[0].y)*pt.x - (this[1].x-this[0].x)*pt.y + this[1].x*this[0].y - this[0].x*this[1].y 
		enume = abs(enume);
		let denom = this[0].dist(this[1]);

		return enume/denom;
	}

	this.draw = function(strokeColour){
		stroke(strokeColour === undefined ? 0 : strokeColour);
		line(this[0].x, this[0].y, this[1].x, this[1].y)
	}

}

//NGon is an interactive polygon object composed of InteractiveLines
let Ngon = function (sides, radius){

	this.vertices = [];
	this.edges = [];
	this.radius = radius === undefined ? 1 : radius;
	this.theta = 6.28318/sides;

	for(i = 0; i < sides; ++i){
		let pt1 = vertex_from_index(i);
		let pt2 = vertex_from_index(i+1);
		this.edges[i] = new InteractiveLine(pt1, pt2);
	}

	//private functions

	//vertex_from_index takes the index of the point (zero indexed) 
	//it returns the P5js Vector at that index or creates it if it doesn't yet exist
	function vertex_from_index(i){
		if(this.vertices[i%this.sides])
			return vertices[i];
		else{
			let pt = createVector(Math.cos(i*theta)*this.radius, Math.sin(i*theta)*this.radius);
			vertices[i%this.sides] = pt;
			return pt;
		}
	}	


}
