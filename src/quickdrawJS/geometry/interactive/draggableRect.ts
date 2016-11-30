/*
*	A constructor for DraggablePolygon that creates a Draggable rectangle
*
*	Copyright Ben Jack 2016
*/


import Point from "../point"
import DraggablePoint from "./draggablePoint"
import DraggablePolygon from "./draggablePolygon"

export default class DraggableRect extends DraggablePolygon{

	constructor(position:Point, size:Point){
		super(new Point(0,0), new Point(0,0));

		var tl:DraggablePoint = DraggablePoint.fromData(position.copy());
		var tr:DraggablePoint = DraggablePoint.fromData(position.offsetCopy(size.x, 0));
		var br:DraggablePoint = DraggablePoint.fromData(position.offsetCopy(size.x, size.y));
		var bl:DraggablePoint = DraggablePoint.fromData(position.offsetCopy(0, size.y));

		this.addCorner(tl);
		this.addCorner(tr);
		this.addCorner(br);
		this.addCorner(bl);
	}

}