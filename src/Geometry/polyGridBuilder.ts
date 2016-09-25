import Point from "./point"
import PolygonGrid from "./PolygonGrid"
import MouseData from "../Interaction/mouseData";


export default class PolyGridBuilder{

	constructor(centre:Point, radius:number){
		this._grid = new PolygonGrid();
		this.selected_edge = null;
		this.mouseData = null;
		this.centre_point = centre_point;
		this.starting_radius = starting_radius;
		this.next_poly_sides = 6;
		this.polygon_ghost = new RegularPolygon();
		this.polygon_ghost.initialize_regular_polygon(this.next_poly_sides, centre_point, starting_radius);
	}

	public generate_snap_grid(resolution:number):SnapGrid{
		var snap_points = [];
		for (var i = 0; i < this.polygons.length; ++i) {
			var poly_pts = this.polygons[i].generate_inner_grid(resolution);
			snap_points = snap_points.concat(poly_pts);			
		}
		return new SnapGrid(snap_points);
	}

	public draw(context:CanvasRenderingContext2D):void{

		this._grid.draw(context);

		if(this.polygon_ghost){
			context.strokeStyle = DrawingUtils.grey(200);
			context.fillStyle = DrawingUtils.rgba(255, 255, 255, 50);
			this.polygon_ghost.draw(context, true);
		}

		if(this.snapGrid){
			this.snapGrid.draw();
		}

		if(this._grid_repeat_selector){
			this._grid_repeat_selector.draw();
		}
	}

	public mouse_move(i_mouseData:MouseData){

		this.mouseData = i_mouseData;
		
		var new_edge = this._grid.closest_edge(this.mouseData.position);
		
		if(!this._grid.empty()){
			if(new_edge === null){
				this.polygon_ghost.empty();
			}
			else if(this.selected_edge !== new_edge){
				this.selected_edge = new_edge;
				this.polygon_ghost.initialize_from_line(this.next_poly_sides, this.selected_edge);
			}
		}
	}

	public mouse_drag(i_mouseData){
		this.mouseData = i_mouseData;
		if(this._grid_repeat_selector){
			this._grid_repeat_selector.drag(this.mouseData.position);
		}
	}

	public mouse_down(i_mouse_button, i_mouseData){
		this.mouseData = i_mouseData;
		if(this._grid_repeat_selector){
			this._grid_repeat_selector.select_corner(this.mouseData.position);
		}
	}

	public generate_snap_grid(){
		this.snapGrid = this._grid.generate_snap_grid(2);
		this._grid_repeat_selector = new DragablePolygon(this.snapGrid.bounding_box(), this.snapGrid);
	}

	public place_polygon(){
		
		if(this._grid_repeat_selector === null || this._grid_repeat_selector === undefined){
			this._grid.add_polygon(this.polygon_ghost);
			this.polygon_ghost = new RegularPolygon(this.next_poly_sides);
			this.selected_edge = this._grid.closest_edge(this.mouseData.position);
			this.polygon_ghost.initialize_from_line(this.next_poly_sides, this.selected_edge);
		}

		if(this._grid.size() == 1){
			DomUtils.editDomElementAttr("rotate_slider", "step", Math.TWO_PI/(this._grid.first().vertex_count*2));
		}
	}

	public change_current_poly(last_pressed){		
		this.next_poly_sides = parseInt(last_pressed);

		this.polygon_ghost = new RegularPolygon();
		if(this._grid.empty()){
			this.polygon_ghost.initialize_regular_polygon(this.next_poly_sides, this.centre_point, this.starting_radius);
		}else if(this.selected_edge){
			this.polygon_ghost.initialize_from_line(this.next_poly_sides, this.selected_edge);
		}
	}

	public delete_poly(){
		this._grid.delete_poly_under_point(this.mouseData.position);
		if(this._grid.empty()){
			this.polygon_ghost.initialize_regular_polygon(this.next_poly_sides, this.centre_point, this.starting_radius);
		}
	}

}