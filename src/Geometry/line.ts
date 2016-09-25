import Point from "./point";
import "../util/MathUtils"

//InteractiveLine is a line geometry class that has some helpful math functions included

export default class Line{

	public 0: Point;
	public 1: Point;

	constructor(pt1:Point, pt2:Point){ 
		this[0] = pt1;
		this[1] = pt2;
	}

	protected sqr(x:number):number { return x * x; }
	protected dist2(v:Point, w:Point):number { return this.sqr(v.x - w.x) + this.sqr(v.y - w.y); }
	
	protected distToSegmentSquared(p:Point):number {
	  var l2 = this.dist2(this[0], this[1]);
	  if (l2 === 0){return this.dist2(p, this[0]);}
	  var t = ((p.x - this[0].x) * (this[1].x - this[0].x) + (p.y - this[0].y) * (this[1].y - this[0].y)) / l2;
	  t = Math.max(0, Math.min(1, t));
	  return this.dist2(p, new Point(this[0].x + t * (this[1].x - this[0].x),
	                    this[0].y + t * (this[1].y - this[0].y)));
	}

	public distanceToPoint(p:Point):number { return Math.sqrt(this.distToSegmentSquared(p)); };

	public angle(reverse:boolean):number{
		var one = reverse ? this[0] : this[1];
		var two = reverse ? this[1] : this[0];
		return Math.atan2(one.y - two.y, one.x - two.x);
	}

	public get length(){
		return Math.dist(this[1].x, this[1].y, this[0].x, this[0].y);
	}

	public draw(context:CanvasRenderingContext2D, close?:boolean): void{
		if(close){context.beginPath();}
		context.moveTo(this[0].x, this[0].y);
		context.lineTo(this[1].x, this[1].y);
		if(close){context.stroke();}
	}

	// isLeft(): tests if a point is Left|On|Right of an infinite line.
	//    Input:  three points P0, l2, and P2
	//    Return: >0 for P2 left of the line through P0 and P1
	//            =0 for P2  on the line
	//            <0 for P2  right of the line
	//   taken from http://geomalgorithms.com/a03-_inclusion.html
	public isLeft(pt:Point):number{
	    return ( (this[1].x - this[0].x) * (pt.y - this[0].y) - (pt.x -  this[0].x) * (this[1].y - this[0].y) );
	};

}