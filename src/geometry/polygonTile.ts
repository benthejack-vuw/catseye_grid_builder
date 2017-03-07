import {DomUtils} from "bj-utils"
import {Point} from "bj-utils"

import {DisplayObject} from "quick-canvas"
import {Polygon} from "quick-canvas"


export class PolygonTile extends DisplayObject{

	private _polygons:Array<Polygon>;
	private _baseSize:Point;
	private once:boolean = true;

	//tiledata can either be a string containing a url to the tile file OR a straight JSON object
	constructor(position:Point, size:Point, tileData:any){
		super(position, size);
		this._baseSize = size.copy();
		if(typeof(tileData) === "string"){
			DomUtils.fetchJSONFile(tileData, this.setData);
		}else{
			this.setData(tileData);
		}

		this.setCacheAsCanvas(true);
	}

	public setData(jsonData:any){
		this.size.x = this._baseSize.x * jsonData.edge_normalized_clipRect.width;
		this.size.y = this._baseSize.y * jsonData.edge_normalized_clipRect.height;
		this._polygons = [];

		var transformPoly = (pts:Array<any>)=>{
			let ptsOut:Array<any> = [];
			for(let i = 0; i < pts.length; ++i){
				ptsOut[i] = new Point(pts[i].x * this.size.x, pts[i].y * this.size.x);//scale proportionally
			}
			return ptsOut;
		}

		var polys = jsonData.normalized_polygons;
		for(var i = 0; i < polys.length; ++i){
			var poly = new Polygon(transformPoly(polys[i]));
			this._polygons.push(poly);
		}

	}

	public draw(context:CanvasRenderingContext2D, fill?:boolean){
		this.clear(context, true);
		context.save();
		context.fillStyle = "#FFF"

		for (var i = 0; i < this._polygons.length; ++i) {
			context.beginPath();
			this._polygons[i].draw(context, false);
			if(fill)context.fill();
			context.stroke();
		}

		context.restore();
	}

	public patternRect(context:CanvasRenderingContext2D, position:Point, size:Point, fill?:boolean){
		this.draw(this.renderingContext, fill);
		const pattern = context.createPattern(this.canvas, "repeat");
    	context.rect(position.x, position.y, size.x, size.y);
    	context.fillStyle = pattern;
    	context.fill();
	}

	public saveImage(name:string){
		DomUtils.downloadCanvasImage(this.canvas, name, "png");
	}

}
