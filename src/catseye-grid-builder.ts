import InteractionManager from "./interaction/interactionHandler/interactionManager"
import DisplayTree from "./testObjects/displayTree"
import Stage from "./interaction/stage";
import Point from "./geometry/point"
import * as DrawingUtils from "./util/drawingUtils";

addEventListener("load", (): void => {

	let stage:Stage = new Stage("canvas_container", new Point(window.innerWidth, window.innerHeight));
	let interactionManager:InteractionManager = new InteractionManager(stage, Stage.stageCanvas, "stage_interactions.json");


	setup();
	window.requestAnimationFrame(draw);

	// function createCanvas(width:number, height:number, canvas_id:string, parentID:string){
	// 	var new_canvas = document.createElement("canvas");
	// 	new_canvas.setAttribute("width", String(window.innerWidth) );
	// 	new_canvas.setAttribute("height", String(window.innerHeight) );
	// 	new_canvas.setAttribute("id", canvas_id);
	// 	var parent_elem = document.getElementById(parentID);
	// 	parent_elem.appendChild(new_canvas);
	// 	return new_canvas;
	// }

	function setup() {

		var pos:Point = new Point(window.innerWidth/2, window.innerHeight/2);
		var size:Point = new Point(window.innerWidth, window.innerHeight)
		var tree:DisplayTree = new DisplayTree(pos, size, window.innerHeight/2, 0);
		stage.addChild(tree);


		//canvas = createCanvas(window.innerWidth, window.innerHeight, "grid_builder", "canvas_container");
		//context = canvas.getContext("2d");
		//controller = new CatseyeController(canvas);
	}

	function draw() {
		stage.draw();
		window.requestAnimationFrame(draw);
	}
	
	

});