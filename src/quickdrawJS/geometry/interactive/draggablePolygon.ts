/*
*	A collection of draggable Points, can be used as a "selector"
*
*	Copyright Ben Jack 2016
*
*/

import Point from "../point"
import BoundingBox from "../boundingBox"
import Polygon from "../polygon"
import SnapGrid from "./snapGrid"
import DraggablePoint from "./DraggablePoint"
import {Direction} from "./DraggablePoint"
import * as DrawingUtils from "../../util/drawingUtils"
import {MouseData} from "../../interaction/mouseData"
import DisplayObject from "../../canvas/displayObject"

export default class DraggablePolygon extends DisplayObject{

	private _points:Array<DraggablePoint>;
	private _snapGrid:SnapGrid;

	constructor(position:Point, size:Point){
		super(position, size);
		this._points = [];
	}

	public get points():Array<Point>{
		var pts:Array<Point> = [];
		
		for (var i = this._points.length - 1; i >= 0; i--) {
			pts.push(this._points[i].localPosition);
		}

		return pts;
	}

	protected addedToStage():void{
		
		this.localPosition = new Point(0,0);
		for(var i = 0; i < this._points.length; ++i){
			this.addChild(this._points[i]);
		}
	}

	public draw(context:CanvasRenderingContext2D):void{		
		context.save();
		context.strokeStyle = "#000000";
		context.setLineDash([5, 5]);

		context.beginPath();
		context.moveTo(this._points[0].localPosition.x, this._points[0].localPosition.y);
		for(var i = 1; i <= this._points.length; ++i){
			context.lineTo(this._points[i%this._points.length].localPosition.x, this._points[i%this._points.length].localPosition.y);
		}
		context.stroke();
		context.restore();

	}

	public addCorner(pt:DraggablePoint):void{
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

	public contains():boolean{
		return true;
	}

	public toPolygon():Polygon{
		return new Polygon(this.points);
	}

	public mouseDragged(data:MouseData){
		if(this._parent.mouseDragged){
			this._parent.mouseDragged(data);
		}
	}

};