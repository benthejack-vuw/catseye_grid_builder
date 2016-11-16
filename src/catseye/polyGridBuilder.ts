import DisplayObject from "../quickdrawJS/canvas/displayObject"
import Point from "../quickdrawJS/geometry/point"
import Line from "../quickdrawJS/geometry/line"
import PolygonGrid from "../quickdrawJS/geometry/polygonGrid"
import PolygonTile from "../quickdrawJS/geometry/interactive/polygonTile"
import Polygon from "../quickdrawJS/geometry/polygon"
import RegularPolygon from "../quickdrawJS/geometry/regularPolygon"
import SnapGrid from "../quickdrawJS/geometry/interactive/snapGrid"
import {MouseData} from "../quickdrawJS/interaction/mouseData"
import {MouseButton} from "../quickdrawJS/interaction/mouseData"
import * as DrawingUtils from "../quickdrawJS/util/drawingUtils"
import * as DomUtils from "../quickdrawJS/util/domUtils"
import DraggableRect from "../quickdrawJS/geometry/interactive/DraggableRect"
import BoundingBox from "../quickdrawJS/geometry/boundingBox"
import Transform from "../quickdrawJS/util/transform"
import * as LocalStore from "../quickdrawJS/storage/localStore"

enum GridMode{
	create,
	tile
}

export default class PolyGridBuilder extends DisplayObject{

	private _grid:PolygonGrid;
	private _selected_edge:Line;
	private _mouseData:MouseData;
	private _start_radius:number;
	private _next_poly_sides:number;
	private _polygon_ghost:RegularPolygon;
	private _snapGrid:SnapGrid;
	private _mode:GridMode;
	private _tileSelector:DraggableRect;

	private _translate:Point;
	private _rotate:number;
	private _scale:number;

	private _polyTile:PolygonTile;
	//private _bounds_selector:DraggablePolygon;

	constructor(radius:number){
		super(new Point(0,0), new Point(window.innerWidth,window.innerHeight));
		this._grid = new PolygonGrid();
		this._selected_edge = null;
		this._mouseData = null;
		this._start_radius = radius;
		this._next_poly_sides = 6;
		this._polygon_ghost = new RegularPolygon();
		this._polygon_ghost.initialize_regular_polygon(this._next_poly_sides, new Point(0,0), this._start_radius);
		this.clearColor(180);
		this._mode = GridMode.create;
		this._translate = new Point(window.innerWidth/2, window.innerHeight/2);
		this._rotate = 0;
		this._scale = 1;
	}

	public loadFile = (val:any, obj:any)=>{
	  	
	  	this._mode = GridMode.create;
	  	this.removeChild(this._snapGrid);

	  	var reader = new FileReader();

		reader.onload = (e) => {
		  var tileObj = JSON.parse(reader.result);
		  this._grid.setPolygonData(tileObj.polygons);
		  this.setRotationSlider();
		  this._tileSelector = undefined;
		  this._snapGrid = undefined;
		  this._polyTile = undefined;
		}

		reader.readAsText(obj.files[0]);
	}

	public addedToStage():void{
		this.applyTransformations();
	}

	public contains(local_pt:Point):boolean{
		return true;
	}

	public draw(context:CanvasRenderingContext2D):void{

		this.clear(context);

		if(this._polyTile){
        	context.save();
        	context.rotate(-this._rotate);
        	context.scale(1.0/this._scale, 1.0/this._scale);
        	this._polyTile.patternRect(context, new Point(-this._size.x / 2, -this._size.y / 2), this._size);
			context.rect(-this._size.x / 2, -this._size.y / 2, this._size.x, this._size.y);
			context.fillStyle = DrawingUtils.greyA(0, 130);
    		context.fill();
        	context.restore();
		}

		this._grid.draw(context);

		if(this._mode == GridMode.create && this._polygon_ghost){
			context.strokeStyle = DrawingUtils.grey(200);
			context.fillStyle = DrawingUtils.rgba(255, 255, 255, 50);
			this._polygon_ghost.draw(context, true);
		}

		if(this._mode == GridMode.tile && this._tileSelector){
			var pts:Array<Point> = []
			var rotate:Transform = new Transform();
			rotate.rotate(this._rotate);
			for(let i = 0; i < this._tileSelector.points.length; ++i){
				pts.push(rotate.transformPoint(this._tileSelector.points[i]));
			}
			var bounds = new BoundingBox(pts);
			context.save();
			context.rotate(-this._rotate);
			context.strokeStyle = "#FF0000";
			bounds.draw(context);
			context.restore();
		}


	}

	public mouseMoved(i_mouseData:MouseData){

		if(this._mode == GridMode.create){
			this._mouseData = i_mouseData;
			
			var new_edge = this._grid.closestEdge(this._mouseData.position);
			
			if(!this._grid.isEmpty()){
				if(new_edge === null){
					this._polygon_ghost.empty();
				}
				else if(this._selected_edge !== new_edge){
					this._selected_edge = new_edge;
					this._polygon_ghost.initialize_from_line(this._next_poly_sides, this._selected_edge);
				}
			}
		}
	}

	public mouseDragged(i_mouseData:MouseData):void{
		this._mouseData = i_mouseData;
	}

	public mousePressed(i_mouseData:MouseData):void{
		this._mouseData = i_mouseData;
	}

	public mouseClicked(){
		
 		//if(this._bounds_selector === null || this._bounds_selector === undefined){
			this._grid.addPolygon(this._polygon_ghost);
			this._polygon_ghost = new RegularPolygon();
			this._selected_edge = this._grid.closestEdge(this._mouseData.position);
			this._polygon_ghost.initialize_from_line(this._next_poly_sides, this._selected_edge);

		//}
		if(this._grid.size <= 1){
			this.setRotationSlider();
		}

	}

	public setRotationSlider(){
	 	DomUtils.editDomElementAttr("rotationSlider", "max", Math.TWO_PI);
	 	DomUtils.editDomElementAttr("rotationSlider", "step", Math.TWO_PI/(this._grid.first.length*2));
	}

	public applyTransformations(){
		this.parent.stage.resetMatrix();
		this.parent.stage.translate(this._translate.x, this._translate.y);
		this.parent.stage.rotate(this._rotate);
		this.parent.stage.scale(this._scale, this._scale);
	}

	public change_current_poly = (last_pressed:string) =>{		
		this._next_poly_sides = parseInt(last_pressed);

		this._polygon_ghost = new RegularPolygon();
		if(this._grid.isEmpty()){
			this._polygon_ghost.initialize_regular_polygon(this._next_poly_sides, new Point(0,0), this._start_radius);
		}else if(this._selected_edge){
			this._polygon_ghost.initialize_from_line(this._next_poly_sides, this._selected_edge);
		}

		if(this._grid.size <= 1){
			this.setRotationSlider();
		}
	}

	public generate_snap_grid = ():void => {
		this.removeChild(this._snapGrid);
		this._snapGrid = this._grid.generateSnapGrid(2)
		this.addChild(this._snapGrid);
		if(!this._tileSelector){
			var box:BoundingBox = this._snapGrid.boundingBox;
			this._tileSelector = new DraggableRect(new Point(box.x, box.y), new Point(box.width, box.height));
			this._tileSelector.snapToGrid(this._snapGrid);
		}
		this._snapGrid.addChild(this._tileSelector);

	}

	public delete_poly = ()=>{
		this._grid.deletePolyUnderPoint(this._mouseData.position);
		if(this._grid.isEmpty()){
			this._polygon_ghost.initialize_regular_polygon(this._next_poly_sides, new Point(0,0), this._start_radius);
		}
	}

	public changeRotation = (value:number)=>{
		this._rotate = value;
		this.applyTransformations();
	}

	public changeScale = (value:number)=>{
		this._scale = value;
		this.applyTransformations();
	}

	public toggleMode = (value:number)=>{
		if(this._mode == GridMode.create){
			this.generate_snap_grid();
			this._mode = GridMode.tile;
		}else if(this._mode = GridMode.tile){
			this._mode = GridMode.create;
			this.removeChild(this._snapGrid);
		}
	}

	public generateTile(){
		if(this._mode == GridMode.tile){
			var bounds = this._tileSelector.toPolygon();	
			this._grid.normalize(bounds, this._rotate);
			this._polyTile = new PolygonTile(new Point(-window.innerWidth/2+100, window.innerHeight/2-300), new Point(100,100), this._grid.toJSON());
			this._polyTile.redraw();			
		}
	}

	public cropTiles = ()=>{
		if(this._tileSelector){
			var bounds = new BoundingBox(this._tileSelector.points);	
			this._grid.crop(bounds);
			this.generate_snap_grid();
		}
	}

	public previewTile = ()=>{
		this.generateTile();
	}

	public saveTile = ()=>{
		this.generateTile();
		var name:string = (document.getElementById("fileName") as HTMLInputElement).value;
		name = name.length > 0 ? name+".json" : "tilegrid.json"
		DomUtils.downloadTextAsFile(name, JSON.stringify(this._grid.toJSON()));

		if(LocalStore.contains("customGrids")){
			var grids = LocalStore.getJSON("customGrids");
			grids.push(this._grid.toJSON());
			LocalStore.storeJSON("customGrids", grids);
		}else{
			LocalStore.storeJSON("customGrids", [this._grid.toJSON()]);
		}
	}

	

}