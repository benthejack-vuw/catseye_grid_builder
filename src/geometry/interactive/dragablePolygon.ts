import Point from "../point"
import SnapGrid from "../snapGrid"
import DragablePoint from "./dragablePoint"
import {Direction} from "./dragablePoint"
import * as DrawingUtils from "../../util/drawingUtils"
import InteractiveDisplayObject from "../../interaction/interactiveDisplayObject"

export class DragablePolygon extends InteractiveDisplayObject{

	private _points:Array<DragablePoint>;
	private _snapGrid:SnapGrid;

	constructor(position:Point, size:Point){
		super(position, size);
		this._points = [];
	};

	protected addedToStage():void{
		for(var i = 0; i < this._points.length; ++i){
			this.addChild(this._points[i]);
		}
	}

	public addCorner(pt:DragablePoint):void{
		if(this._snapGrid)
			pt.snapToGrid(this._snapGrid)

		this._points.push(pt);
	}

	public snapToGrid(snap:SnapGrid):void{
		this._snapGrid = snap;
		
		if(this._points.length > 0){
			for(var i = 0; i < this._points.length; ++i){
				this._points[i].snapToGrid(snap);
			}
		}
	}

};


export class DragableRect extends DragablePolygon{

	constructor(position:Point, size:Point){
		super(position, size);

		var tl:DragablePoint = DragablePoint.fromData(position.copy());
		var tr:DragablePoint = DragablePoint.fromData(position.offsetCopy(size.x, 0));
		var br:DragablePoint = DragablePoint.fromData(position.offsetCopy(size.x, size.y));
		var bl:DragablePoint = DragablePoint.fromData(position.offsetCopy(0, size.y));
		
		tl.addConstraint(tr, Direction.y);
		tl.addConstraint(bl, Direction.x);

		tr.addConstraint(tl, Direction.y);
		tr.addConstraint(br, Direction.x);

		bl.addConstraint(br, Direction.y);
		bl.addConstraint(tl, Direction.x);

		br.addConstraint(bl, Direction.y);
		br.addConstraint(tr, Direction.x);

		this.addCorner(tl);
		this.addCorner(tr);
		this.addCorner(br);
		this.addCorner(bl);
	}

}