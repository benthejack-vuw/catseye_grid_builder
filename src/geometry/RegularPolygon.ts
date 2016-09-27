import Polygon from "./polygon"
import Line from "./line"
import Point from "./point"

export default class RegularPolygon extends Polygon{

	constructor(){
		super();
	}
	//-----------------------------------------INITIALIZERS------------------------------------------------

	//this function sets up an un-rotated regular polygon by providing the number of sides,
	//the center point and the radius
	public initialize_regular_polygon(sides:number, position:Point, radius:number){
		
		this.empty();		
		//vertex function to be passed into create_edges -- theta baked in
		var theta = 6.28318/sides;

		var verts_from_radius = (i:number):Point => {
			return new Point(position.x + Math.cos(i*theta)*radius, position.y+Math.sin(i*theta)*radius);
		}

		this.create_edges(verts_from_radius, sides);
	};

	//Set up an NGon with the given side already defined.
	//This is used to create two polygons that share an edge
	public initialize_from_line(sides:number, line:Line){

		this.empty();

		var theta = 6.28318/sides;

		var half_inner_poly_angle = (((sides-2)*Math.PI)/sides)/2.0;
		var angle_to_centre_point = half_inner_poly_angle + line.angle(true);
		var radius = (line.length/2.0)/Math.sin(theta/2);

		var centre_point_x = line[1].x + Math.cos(angle_to_centre_point)*radius;
		var centre_point_y = line[1].y + Math.sin(angle_to_centre_point)*radius;

		//vertex function to be passed into create_edges
		var verts_from_line = (i:number):Point => {
			var x_pos = centre_point_x + Math.cos(theta*i + theta/2.0 - Math.PI/2.0 + line.angle(true)) * radius;
			var y_pos = centre_point_y + Math.sin(theta*i + theta/2.0 - Math.PI/2.0 + line.angle(true)) * radius;
			return new Point(x_pos, y_pos);
		};

		this.create_edges(verts_from_line, sides);
	};	

}