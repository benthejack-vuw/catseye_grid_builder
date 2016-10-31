import InteractiveDisplayObject from "./interaction/interactiveDisplayObject"
import Point from "./geometry/point"
import Line from "./geometry/line"
import PolygonGrid from "./geometry/polygonGrid"
import PolygonTile from "./geometry/polygonTile"
import Polygon from "./geometry/polygon"
import RegularPolygon from "./geometry/regularPolygon"
import SnapGrid from "./geometry/snapGrid"
import {MouseData} from "./interaction/mouseData"
import {MouseButton} from "./interaction/mouseData"
import * as DrawingUtils from "./util/drawingUtils"
import * as DomUtils from "./util/domUtils"
import {DragableRect} from "./geometry/interactive/dragablePolygon"
import BoundingBox from "./geometry/boundingBox"

enum GridMode{
	create,
	tile
}

export default class PolyGridBuilder extends InteractiveDisplayObject{

	private _grid:PolygonGrid;
	private _selected_edge:Line;
	private _mouseData:MouseData;
	private _start_radius:number;
	private _next_poly_sides:number;
	private _polygon_ghost:RegularPolygon;
	private _snapGrid:SnapGrid;
	private _mode:GridMode;
	private _tileSelector:DragableRect;

	private _translate:Point;
	private _rotate:number;
	private _scale:number;

	private _polyTile:PolygonTile;
	//private _bounds_selector:DragablePolygon;

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
		this.clearsEachFrame = true;
		this._mode = GridMode.create;
		this._translate = new Point(window.innerWidth/2, window.innerHeight/2);
		this._rotate = 0;
		this._scale = 1;
	}

	public addedToStage():void{
		this.applyTransformations();
	}

	public contains(pt:Point):boolean{
		return true;
	}

	public draw(context:CanvasRenderingContext2D):void{

		if(this._polyTile){
			const pattern = context.createPattern(this._polyTile.cachedCanvas, "repeat");
			const width = this._size.x;
        	const height = this._size.y;
        	context.rect(-width / 2, -height / 2, width, height);
        	context.fillStyle = pattern;
        	context.fill();
		}

		this._grid.draw(context);

		if(this._mode == GridMode.create && this._polygon_ghost){
			context.strokeStyle = DrawingUtils.grey(200);
			context.fillStyle = DrawingUtils.rgba(255, 255, 255, 50);
			this._polygon_ghost.draw(context, true);
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
		this._snapGrid = this._grid.generateSnapGrid(2)
		this.addChild(this._snapGrid);
		var box:BoundingBox = this._snapGrid.boundingBox;
		this._tileSelector = new DragableRect(new Point(box.x, box.y), new Point(box.width, box.height));
		this._tileSelector.snapToGrid(this._snapGrid);
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

	public saveTile = (value:number)=>{
		if(this._mode == GridMode.tile){
			var bounds = this._tileSelector.toPolygon();	
			this._grid.normalize(bounds, this._rotate);
			this._polyTile = new PolygonTile(new Point(-window.innerWidth/2+100, window.innerHeight/2-300), new Point(300,300), this._grid.toJSON());
			this._polyTile.redraw();			
			//this.addChild(this._polyTile);
		}
	}

}