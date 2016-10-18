import DataError from "../error/data"
import Point from "../point"
import SnapGrid from "../snapGrid"
import Circle from "../circle"
import {MouseData} from "../../interaction/mouseData"
import "../../util/mathUtils"
import * as DrawingUtils from "../../util/drawingUtils"
import InteractiveDisplayObject from "../../interaction/interactiveDisplayObject"

const DEFAULT_POINT_SIZE:number = 20;	

export default class DragablePoint extends InteractiveDisplayObject{

	private _constraints:Array<PointLink>
	private _snapGrid:SnapGrid;
	private _radius:number;

	constructor(position:Point, radius:number){
		super(position, new Point(radius*2, radius*2));
		this._radius = radius;
		this.clearsEachFrame = true;
	}

    public static fromData(data: any): DragablePoint {
        if (typeof data.x !== "number" || typeof data.y !== "number") {
            throw new DataError("Point", "x and y must be numbers");
        }

        return new DragablePoint(new Point(data.x, data.y), DEFAULT_POINT_SIZE);
    }

	public draw(context:CanvasRenderingContext2D):void{
		if(this._isMouseOver)
			context.fillStyle = DrawingUtils.rgb(255, 0, 0);
		else
			context.fillStyle = DrawingUtils.rgb(0, 255, 0);

		context.beginPath();
		context.arc(this._radius, this._radius, this._radius, 0, 2*Math.PI);
		context.fill();
	}

	public addConstraint(slave:DragablePoint, direction:Direction):void{
		this._constraints.push(new PointLink(this, slave, direction));
	}

	public contains(pt:Point):boolean{
		return Math.dist(pt.x, pt.y, this._radius, this._radius) < this._radius;
	}

	public mouseDragged(data:MouseData):void{
		this.moveTo(data.position);

		for(var i = 0; i < this._constraints.length; ++i){
			this._constraints[i].apply();
		}
	}

	public moveTo(pt:Point):void{
		if(this._snapGrid){
			this.globalPosition = this._snapGrid.closest(this.localToGlobal(pt));
		}else{
			this.localPosition = pt;
		}
	}

	public snapToGrid(snap:SnapGrid):void{
		this._snapGrid = snap;
	}
	

}

export enum Direction{
	x,
	y
}

class PointLink{

	public _master:DragablePoint;
	public _slave:DragablePoint;
	public _direction:Direction;

	constructor(master:DragablePoint, slave:DragablePoint, direction:Direction){
		this._master = master;
		this._slave  = slave;
		this._direction = direction;
	}

	public apply(){
		if(this._direction == Direction.x)
			this._slave.moveTo(new Point(this._master.localPosition.x, this._slave.localPosition.y));
		else
			this._slave.moveTo(new Point(this._slave.localPosition.x, this._master.localPosition.y));
	}

}