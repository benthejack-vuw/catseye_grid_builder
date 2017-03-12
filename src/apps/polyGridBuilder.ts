import * as DomUtils from "bj-utils/lib/util/domUtils"
import * as DrawingUtils from "bj-utils/lib/util/drawingUtils"
import * as LocalStore from "bj-utils/lib/storage/localStore"
import * as BJMath from "bj-utils/lib/util/mathUtils"
import {Transform} from "bj-utils/lib/util/transform"
import {Point} from "bj-utils/lib/geometry/point"

import {MouseData} from "interaction-centre/lib/mouseData"
import {MouseButton} from "interaction-centre/lib/mouseData"

import {DisplayObject} from "quick-canvas"
import {Line} from "quick-canvas"
import {PolygonGrid} from "quick-canvas"
import {Polygon} from "quick-canvas"
import {RegularPolygon} from "quick-canvas"
import {SnapGrid} from "quick-canvas"
import {DraggableRect} from "quick-canvas"
import {BoundingBox} from "quick-canvas"

import {PolygonTile} from "../geometry/polygonTile"
import {GridStorage} from "../grids/gridStorage";

enum GridMode{
	create,
	tile
}

export class PolyGridBuilder extends DisplayObject{

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

	public set size(newSize:Point){
		super.size = newSize;
		this._translate = new Point(window.innerWidth/2, window.innerHeight/2);
		this.applyTransformations();
	}


	public loadGrid = (val:any, obj:any)=>{
		console.log("HERE");
        DomUtils.selectFile().then((file)=>{
        	return DomUtils.readFileAsJSON(file);
        }).then((grid:any)=>{
        	this._grid.setPolygonData(grid.polygons);
		  	this.setRotationSlider();
		  	this._tileSelector = undefined;
		  	this._snapGrid = undefined;
		  	this._polyTile = undefined;
        });

	}

	public addedToStage():void{
		this.applyTransformations();
	}

	public contains(local_pt:Point):boolean{
		return true;
	}

	public draw(context:CanvasRenderingContext2D):void{


		context.save();
		context.translate(-this._size.x / 2, -this._size.y / 2);
		this.clear(context, true);
		context.restore();

		if(this._polyTile){
        	context.save();
        	context.rotate(-this._rotate);
        	context.scale(1.0/this._scale, 1.0/this._scale);
        	this._polyTile.patternRect(context, new Point(-this._size.x / 2, -this._size.y / 2), this._size, true);
			context.rect(-this._size.x / 2, -this._size.y / 2, this._size.x, this._size.y);
			context.fillStyle = DrawingUtils.greyA(0, 130);
    		context.fill();
        	context.restore();
		}

		this._grid.draw(context);

		if(this._mode == GridMode.create && this._polygon_ghost){
			context.strokeStyle = DrawingUtils.grey(100);
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
	 	DomUtils.editDomElementAttr("rotationSlider", "max", BJMath.TWO_PI);
	 	if(this._grid._polygons.length > 0)
	 		DomUtils.editDomElementAttr("rotationSlider", "step", BJMath.TWO_PI/(this._grid.first.length*2));
		else
			DomUtils.editDomElementAttr("rotationSlider", "step", BJMath.TWO_PI/this._next_poly_sides);
	}

	public applyTransformations(){
		this.parent.stage.resetMatrix();
		this.parent.stage.translate(this._translate.x, this._translate.y);
		this.parent.stage.rotate(this._rotate);
		this.parent.stage.scale(this._scale, this._scale);
	}

	public change_current_poly = (sides:string, e:Event) =>{
		this._next_poly_sides = parseInt(sides);
		
		let guiControl = document.getElementById("polygonSides") as HTMLInputElement;
		if(e.target != guiControl){
			guiControl.value = sides;
		}

		
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
		}
		this._tileSelector.snapToGrid(this._snapGrid);
		this._snapGrid.addChild(this._tileSelector);
	}

	public key_release = (key)=>{
		console.log(key);
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

	public snapToSelection = ()=>{
		if(this._mode == GridMode.tile){
			let pt1 = this._tileSelector.points[0];
			let pt2 = this._tileSelector.points[1];
			this._rotate = -Math.atan2(pt2.y-pt1.y, pt2.x-pt1.x);
			this.applyTransformations();
		}
	}

	public changeScale = (value:number)=>{
		this._scale = value;
		this.applyTransformations();
	}

	public toggleMode = (value:number)=>{
		if(this._mode == GridMode.create){
			this.generate_snap_grid();
			this._mode = GridMode.tile;
		}else if(this._mode == GridMode.tile){
			this._mode = GridMode.create;
			this.removeChild(this._snapGrid);
			this._snapGrid = null;

		}
	}

	public generateTile(){
		if(this._mode == GridMode.tile){
			var bounds = this._tileSelector.toPolygon();
			this._grid.normalize(bounds, this._rotate, this._start_radius);
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
		if(this._mode == GridMode.tile){
			this.generateTile();
			var name:string = (document.getElementById("fileName") as HTMLInputElement).value;
			name = name.length > 0 ? name+".json" : "tilegrid.json"
			DomUtils.downloadTextAsFile(name, JSON.stringify(this._grid.toJSON()));
			GridStorage.saveGrid(this._grid.toJSON());
		}
	}


	public saveTileImage = ()=>{
		if(this._mode == GridMode.tile){
			this.generateTile();
			var name:string = (document.getElementById("fileName") as HTMLInputElement).value;
			name = name.length > 0 ? name : "catseyeGrid"
			this._polyTile.saveImage(name);
		}
	}



}
