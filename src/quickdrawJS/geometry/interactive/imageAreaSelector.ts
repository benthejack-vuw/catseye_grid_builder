import DisplayObject from "../../canvas/displayObject"
import DraggablePolygon from "./draggablePolygon"
import DraggableTriangle from "./draggableTriangle"
import Point from "../point"
import PolygonTile from "./polygonTile"
import {MouseData} from "../../interaction/mouseData"

export default class ImageAreaSelector extends DisplayObject{

	protected _changeCallback:(pts:Array<Point>)=>void
	protected _selector:DraggablePolygon;
	protected _unscaledImage:HTMLImageElement;
	protected _tile:PolygonTile;

	constructor(image:HTMLImageElement, displayWidth:number, changeCallback:(pts:Array<Point>)=>void){
		let scale = displayWidth/image.width;
		let size:Point = new Point(displayWidth, image.height*scale);
		super(new Point(0,0), size);
		this._changeCallback = changeCallback;
		this._unscaledImage = image;
		this.setCacheAsCanvas(true);
	}

	public addedToStage(){
		console.log("ADDED");
		this._selector = new DraggableTriangle(new Point(0,0), this._size);
		this.addChild(this._selector);
	}

	public draw(context:CanvasRenderingContext2D):void{
		this.clear(context, true);
		context.drawImage(this._unscaledImage, 0,0, this.size.x, this.size.y);
	}

	//propogates down from DraggablePolygon (this._imageSelector)
	public mouseDragged(data:MouseData){

		let pts:Array<Point> = [];

		for (var i = 0; i < this._selector.points.length; ++i) {
			pts.push(new Point(this._selector.points[i].x/this.size.x, this._selector.points[i].y/this.size.y));
		}

		this._changeCallback(pts);
	}

	public contains(pt:Point){
		return true;
	}

}