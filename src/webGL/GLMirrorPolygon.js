import {BJMath} from  "bj-utils"
import {Point} from "bj-utils"
import {Polygon} from "quick-canvas"


export default class GLMirrorPolygon extends Polygon{

	constructor(vertex_array){

		let interpVerts = [];
		vertex_array.forEach((v, i, verts) => {
			const nxt = verts[(i+1)%verts.length];
			mid = new Point(BJMath.lerp(v.x, nxt.x, 0.5), BJMath.lerp(v.y, nxt.y, 0.5));
			interpVerts.push(current);
			interpVerts.push(midPoint);
		});

		super(interpVerts);
	}

	GLPoints(){
		const cent = this.centroid.as3DArray();

		const verts = this._vertices.reduce((total, v)=>(
			[...total, ...(v.as3DArray()) ]
		), []); //generate flat vertex array

		const first = this._vertices[0].as3DArray(); //add first vert to end

		return [...cent, ...verts, ...first];
	}

	//return a flat array of UV coordinates, the selection should have 3 points the first gets set to the centroid
	//then the outer layer gets alternating uvs 
	GLTexCoords(selection){
		
		const first = [selection[0].x, selection[0].y];

		const vertUVs = this._vertices.reduce( (total, v, i) => (
			 [...total, selection[(i%2)+1].x, selection[(i%2)+1].y] 
		) , []); //generate flat array of UVs

		const last = [selection[1].x, selection[1].y];

		return [...first, ...vertUVs, ...last];
	}
}
