import InteractiveDisplayObject from "../interaction/interactiveDisplayObject"
import Point from "./point"
import Polygon from "./polygon"
import * as DomUtils from "../util/domUtils"

export default class PolygonTile extends InteractiveDisplayObject{
	
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
			for(let i = 0; i < pts.length; ++i){
				pts[i].x *= this.size.x;
				pts[i].y *= this.size.x; //scale proportionally
			}
			return pts;
		}

		var polys = jsonData.normalized_polygons;
		for(var i = 0; i < polys.length; ++i){		
			this._polygons.push(new Polygon(transformPoly(polys[i])));
		}

	}

	public draw(context:CanvasRenderingContext2D){

		this.clear(context, true);
		context.fillStyle = "#FFFFFF";
		for (var i = 0; i < this._polygons.length; ++i) {
			this._polygons[i].draw(context, true);
		}
	}

}