import DisplayObject from "../../canvas/displayObject"
import Point from "../point"
import Polygon from "../polygon"
import * as DomUtils from "../../util/domUtils"

export default class PolygonTile extends DisplayObject{
	
	private _polygons:Array<Polygon>;
	private once:boolean = true;

	//tiledata can either be a string containing a url to the tile file OR a straight JSON object
	constructor(position:Point, size:Point, tileData:any){
		super(position, size);
		if(typeof(tileData) === "string"){
			DomUtils.fetchJSONFile(tileData, this.setData);
		}else{
			this.setData(tileData);
		}

		this.setCacheAsCanvas(true);
	}

	public setData(jsonData:any){
		this.size.y *= jsonData.normalized_clipRect.height;
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

	public draw(context:CanvasRenderingContext2D){
		this.clear(context, true);
		context.fillStyle = "#FFFFFF";
		for (var i = 0; i < this._polygons.length; ++i) {
			this._polygons[i].draw(context, true);
		}
	}

	public patternRect(context:CanvasRenderingContext2D, position:Point, size:Point){
		const pattern = context.createPattern(this.canvas, "repeat");
    	context.rect(position.x, position.y, size.x, size.y);
    	context.fillStyle = pattern;
    	context.fill();
	}

}