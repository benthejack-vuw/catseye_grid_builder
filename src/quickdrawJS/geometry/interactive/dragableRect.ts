/*
*	A constructor for DragablePolygon that creates a dragable rectangle
*
*	Copyright Ben Jack 2016
*/


import Point from "../point"
import DragablePoint from "./dragablePoint"
import DragablePolygon from "./dragablePolygon"

export default class DragableRect extends DragablePolygon{

	constructor(position:Point, size:Point){
		super(new Point(0,0), new Point(0,0));

		var tl:DragablePoint = DragablePoint.fromData(position.copy());
		var tr:DragablePoint = DragablePoint.fromData(position.offsetCopy(size.x, 0));
		var br:DragablePoint = DragablePoint.fromData(position.offsetCopy(size.x, size.y));
		var bl:DragablePoint = DragablePoint.fromData(position.offsetCopy(0, size.y));

		this.addCorner(tl);
		this.addCorner(tr);
		this.addCorner(br);
		this.addCorner(bl);
	}

}