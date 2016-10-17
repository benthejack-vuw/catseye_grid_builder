import PolyGridBuilder from "./geometry/polyGridBuilder"
import Transform from "./util/transform"
import Point from "./geometry/point"


export default class CatseyeController{

	protected _drawing_context: CanvasRenderingContext2D;
	protected _polyGridBuilder: PolyGridBuilder;
	protected _transformMatrix: Transform;

	protected _scale: number;
	protected _rotation: number;
	protected _position: Point;


	constructor(parentID:string, size:Point){
	
		this._polyGridBuilder = new PolyGridBuilder(60);
		
		this._transformMatrix = new Transform();

		this._interaction_manager = new InteractionManager(this._polyGridBuilder, canvas, "catseye_grid_interaction_definitions_file.json");

		this._scale = 1.0;
		this._rotation = 0;
		this._position = new Point(canvas.width/2, canvas.height/2);

		this.addSlider(0.2, 2.0, 1.0, 0.1, this.setScale, "scale_slider");
		this.addSlider(0, Math.TWO_PI, 0, Math.TWO_PI/12.0, this.setRotation, "rotate_slider");
		this.addButton("save grid JSON", this.generateJSON, "save_json");
		this.updateTransforms();
	}

	public updateTransforms(): void{
		this._transformMatrix.reset();
		this._transformMatrix.translate(this._position.x, this._position.y);
		this._transformMatrix.scale(this._scale, this._scale);
		this._transformMatrix.rotate(this._rotation);
		this._transformMatrix.invert();
		this._interaction_manager.setTransformMatrix(this._transformMatrix);
	}

	public set scale(i_scale: number){
		this.scale = i_scale;
		this.updateTransforms();
	}

	public set rotation(i_rotation: number){
		this._rotation = i_rotation;
		this.updateTransforms();
	}

	public draw(): void{
		this._drawing_context.save();
			this._drawing_context.translate(this._position.x, this._position.y);
			this._drawing_context.scale(this._scale, this._scale);
			this._drawing_context.rotate(this._rotation);
			this._polyGridBuilder.draw(this._drawing_context);
		this._drawing_context.restore();
	}

	/*public downloadJSON(): void{
		this._polyGridBuilder.grid.normalize(this._polyGridBuilder.grid_repeat_selector.bounding_box());
		let dataStr = "data:text/json;charset=utf-8," + this._polyGridBuilder.grid.to_JSON();
		let dlAnchorElem = document.getElementById('downloadAnchorElem');
		dlAnchorElem.setAttribute("href",     dataStr     );
		dlAnchorElem.setAttribute("download", "scene.json");
		dlAnchorElem.click();
	}*/

	protected addSlider(min: number, max: number, value: number, step: number, callback:(event:Event)=>void, id: string): void{
		let newSlider = document.createElement("INPUT");
		newSlider.setAttribute("id", id);
		newSlider.setAttribute("type", "range");
		newSlider.setAttribute("min", String(min));
		newSlider.setAttribute("max", String(max));
		newSlider.setAttribute("step", String(step));
		newSlider.setAttribute("value", String(value));
		newSlider.addEventListener("change", callback);
		newSlider.addEventListener("input", callback);
		document.getElementById("controls").appendChild(newSlider);
	}

	protected addButton(text:string, callback:(event:Event)=>void, id:string): void{
		let newSlider = document.createElement("button");
		newSlider.setAttribute("id", id);
		newSlider.setAttribute("type", "button");
		newSlider.innerHTML = text;
		newSlider.addEventListener("click", callback);
		document.getElementById("controls").appendChild(newSlider);
	}



}