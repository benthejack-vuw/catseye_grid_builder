import CatseyeController from "./CatseyeController";
import * as DrawingUtils from "./util/DrawingUtils";

addEventListener("load", (): void => {

	let canvas = null;
	let context = null;
	let controller = null;

	setup();
	window.requestAnimationFrame(draw);

	function createCanvas(width, height, canvas_id, parent){
		var new_canvas = document.createElement("canvas");
		new_canvas.setAttribute("width", String(window.innerWidth) );
		new_canvas.setAttribute("height", String(window.innerHeight) );
		new_canvas.setAttribute("id", canvas_id);
		var parent_elem = document.getElementById(parent);
		parent_elem.appendChild(new_canvas);
		return new_canvas;
	}

	function setup() {
		canvas = createCanvas(window.innerWidth, window.innerHeight, "grid_builder", "canvas_container");
		context = canvas.getContext("2d");
		controller = new CatseyeController(canvas);
	}

	function draw() {
		context.fillStyle = DrawingUtils.grey(180);
		context.fillRect(0, 0, canvas.width, canvas.height);
		controller.draw(context);
		window.requestAnimationFrame(draw);
	}
	
	

});