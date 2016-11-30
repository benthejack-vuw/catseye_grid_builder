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

	constructor(image:HTMLImageElement, displaySize:number, changeCallback:(pts:Array<Point>)=>void){
		let size:Point;
		let scale:number;

		if(image.width > image.height){
			scale =  displaySize/image.width;
			size = new Point(displaySize, image.height * scale);
		}else{
		    scale = displaySize/image.height
		    size = new Point(image.width * scale, displaySize);
		}

		super(new Point(displaySize/2 - size.x/2, displaySize/2 - size.y/2), size);
		this._changeCallback = changeCallback;
		this._unscaledImage = image;
	}

	public addedToStage(){
		this._selector = new DraggableTriangle(new Point(0,0), this._size);
		this.addChild(this._selector);
	}

	public setTextureCoords(pts:any){
		var out:Array<Point> = [];
		for (var i = 0; i < pts.length; ++i) {
			const pt = new Point(pts[i].x, pts[i].y);
			var pt2 = pt.copy();
			pt2.x *= this.size.x;
			pt2.y *= this.size.y;
			this._selector.setPoint(i, pt2);
			out.push(pt);
		}
		this._changeCallback(out);
	}

	public draw(context:CanvasRenderingContext2D):void{
		this.clear(context, true);
		context.drawImage(this._unscaledImage, 0,0, this.size.x, this.size.y);
	}

	public get selection():Array<Point>{
		let pts:Array<Point> = [];

		for (var i = 0; i < this._selector.points.length; ++i) {
			pts.push(new Point(this._selector.points[i].x/this.size.x, this._selector.points[i].y/this.size.y));
		}

		return pts;
	}

	//propogates down from DraggablePolygon (this._imageSelector)
	public mouseDragged(data:MouseData){
		this._changeCallback(this.selection);
	}

	public contains(pt:Point){
		return this.inBounds(pt);
	}

	public forceUpdate(){
		this._changeCallback(this.selection);
	}

}