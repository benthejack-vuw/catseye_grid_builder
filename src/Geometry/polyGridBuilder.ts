import Point from "./point"
import Line from "./line"
import PolygonGrid from "./PolygonGrid"
import Polygon from "./Polygon"
import RegularPolygon from "./regularPolygon"
import SnapGrid from "./snapGrid"
import {MouseData} from "../Interaction/mouseData";
import {MouseButton} from "../Interaction/mouseData";
import * as DrawingUtils from "../util/drawingUtils"

export default class PolyGridBuilder{

	private _grid:PolygonGrid;
	private _selected_edge:Line;
	private _mouseData:MouseData;
	private _start_radius:number;
	private _next_poly_sides:number;
	private _polygon_ghost:RegularPolygon;
	private _polygons:Array<Polygon>
	private _snapGrid:SnapGrid;
	//private _bounds_selector:DragablePolygon;

	constructor(radius:number){
		this._grid = new PolygonGrid();
		this._selected_edge = null;
		this._mouseData = null;
		this._start_radius = radius;
		this._next_poly_sides = 6;
		this._polygon_ghost = new RegularPolygon();
		this._polygon_ghost.initialize_regular_polygon(this._next_poly_sides, new Point(0,0), this._start_radius);
	}

	public generate_snap_grid(resolution:number):SnapGrid{
		var snap_points:Array<Point> = [];
		for (var i = 0; i < this._polygons.length; ++i) {
			var poly_pts = this._polygons[i].generate_inner_grid(resolution);
			snap_points = snap_points.concat(poly_pts);			
		}
		return new SnapGrid(snap_points);
	}

	public draw(context:CanvasRenderingContext2D):void{

		this._grid.draw(context);

		if(this._polygon_ghost){
			context.strokeStyle = DrawingUtils.grey(200);
			context.fillStyle = DrawingUtils.rgba(255, 255, 255, 50);
			this._polygon_ghost.draw(context, true);
		}

		if(this._snapGrid){
			this._snapGrid.draw(context);
		}

	/*	if(this._bounds_selector){
			this._bounds_selector.draw();
		} */
	}

	public mouse_move = (i_mouseData:MouseData) => {

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

	public mouse_drag = (i_mouseData:MouseData):void =>{
		this._mouseData = i_mouseData;
		/*if(this._bounds_selector){
			this._bounds_selector.drag(this.mouseData.position);
		}*/
	}

	public mouse_down = (i_mouse_button:MouseButton, i_mouseData:MouseData):void =>{
		this._mouseData = i_mouseData;
		/*if(this._bounds_selector){
			this._bounds_selector.select_corner(this.mouseData.position);
		}*/
	}

	// public generate_snap_grid(){
	// 	this._snapGrid = this._grid.generate_snap_grid(2);
	// 	this._bounds_selector = new DragablePolygon(this._snapGrid.bounding_box(), this._snapGrid);
	// }

	public place_polygon = () =>{
		
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

	public delete_poly = ()=>{
		this._grid.deletePolyUnderPoint(this._mouseData.position);
		if(this._grid.isEmpty()){
			this._polygon_ghost.initialize_regular_polygon(this._next_poly_sides, new Point(0,0), this._start_radius);
		}
	}

}