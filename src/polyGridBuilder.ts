import InteractiveDisplayObject from "./interaction/InteractiveDisplayObject"
import Point from "./geometry/point"
import Line from "./geometry/line"
import PolygonGrid from "./geometry/polygonGrid"
import Polygon from "./geometry/polygon"
import RegularPolygon from "./geometry/regularPolygon"
import SnapGrid from "./geometry/snapGrid"
import {MouseData} from "./interaction/mouseData"
import {MouseButton} from "./interaction/mouseData"
import * as DrawingUtils from "./util/drawingUtils"
import {DragableRect} from "./geometry/interactive/dragablePolygon"
import BoundingBox from "./geometry/BoundingBox"

export default class PolyGridBuilder extends InteractiveDisplayObject{

	private _grid:PolygonGrid;
	private _selected_edge:Line;
	private _mouseData:MouseData;
	private _start_radius:number;
	private _next_poly_sides:number;
	private _polygon_ghost:RegularPolygon;
	private _snapGrid:SnapGrid;
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
		this.translate(this._size.x/2, this.size.y/2);
		this.clearsEachFrame = true;
	}

	public contains(pt:Point):boolean{
		return true;
	}

	public draw(context:CanvasRenderingContext2D):void{

		this._grid.draw(context);

		if(this._polygon_ghost){
			context.strokeStyle = DrawingUtils.grey(200);
			context.fillStyle = DrawingUtils.rgba(255, 255, 255, 50);
			this._polygon_ghost.draw(context, true);
		}
	}

	public mouseMoved(i_mouseData:MouseData){

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

		// if(this._grid.size() == 1){
		// 	DomUtils.editDomElementAttr("rotate_slider", "step", Math.TWO_PI/(this._grid.first().vertex_count*2));
		// }
	}

	public change_current_poly = (last_pressed:string) =>{		
		this._next_poly_sides = parseInt(last_pressed);

		this._polygon_ghost = new RegularPolygon();
		if(this._grid.isEmpty()){
			this._polygon_ghost.initialize_regular_polygon(this._next_poly_sides, new Point(0,0), this._start_radius);
		}else if(this._selected_edge){
			this._polygon_ghost.initialize_from_line(this._next_poly_sides, this._selected_edge);
		}
	}

	public generate_snap_grid = ():void => {
		this.addChild(this._grid.generateSnapGrid(2));
		var box:BoundingBox = this._snapGrid.boundingBox;
		this.addChild(new DragableRect(new Point(box.x, box.y), new Point(box.width, box.height)));
	}

	public delete_poly = ()=>{
		this._grid.deletePolyUnderPoint(this._mouseData.position);
		if(this._grid.isEmpty()){
			this._polygon_ghost.initialize_regular_polygon(this._next_poly_sides, new Point(0,0), this._start_radius);
		}
	}

}