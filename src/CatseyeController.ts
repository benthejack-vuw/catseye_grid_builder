import Point from "./geometry/point";


export default class CatseyeController{

	protected _drawing_context: CanvasRenderingContext2D;
	protected _polyGridBuilder: _PolyGridBuilder;
	protected _transformMatrix: Transform;
	protected _interaction_manager: InteractionManager;

	protected _scale: number;
	protected _rotation: number;
	protected _position: Point;


	constructor(protected canvas: HTMLCanvasElement){
	
		this._drawing_context = canvas.getContext("2d");
		this._polyGridBuilder = new _PolyGridBuilder({x:0, y:0}, 60);
		this._transformMatrix = new Transform();
		this._interaction_manager = new InteractionManager(this._polyGridBuilder, canvas, "min/catseye_grid_interaction_definitions_file-min.json");
		this._interaction_manager.start();

		this._scale = 1.0;
		this._rotation = 0;
		this._position = new Point(canvas.width/2, canvas.height/2);

		//this.addSlider(0.2, 2.0, 1.0, 0.1, this.setScale, "scale_slider");
		//this.addSlider(0, Math.TWO_PI, 0, Math.TWO_PI/12.0, this.setRotation, "rotate_slider");
		//this.addButton("save grid JSON", this.generateJSON, "save_json");
		this.updateTransforms();
	}

	public updateTransforms(): void{
		this._transformMatrix.reset();
		this._transformMatrix.translate(this.position.x, this.position.y);
		this._transformMatrix.scale(this.scale, this.scale);
		this._transformMatrix.rotate(this.rotation);
		this._transformMatrix.invert();
		this._interaction_manager.set_TransformMatrix(this._transformMatrix);
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

	public downloadJSON(): void{
		this._polyGridBuilder.grid.normalize(this._polyGridBuilder.grid_repeat_selector.bounding_box());
		let dataStr = "data:text/json;charset=utf-8," + this._polyGridBuilder.grid.to_JSON();
		let dlAnchorElem = document.getElementById('downloadAnchorElem');
		dlAnchorElem.setAttribute("href",     dataStr     );
		dlAnchorElem.setAttribute("download", "scene.json");
		dlAnchorElem.click();
	}

	protected addSlider(min: number, max: number, value: number, step: number, callback:(Event)=>void, id: string): void{
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

	protected addButton(text:string, callback:(Event)=>void, id:string): void{
		let newSlider = document.createElement("button");
		newSlider.setAttribute("id", id);
		newSlider.setAttribute("type", "button");
		newSlider.innerHTML = text;
		newSlider.addEventListener("click", callback);
		document.getElementById("controls").appendChild(newSlider);
	}



}