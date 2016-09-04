(function(){

	var canvas = null;
	var context = null;
	var controller = null;

	function createCanvas(width, height, canvas_id, parent){
		var new_canvas = document.createElement("canvas");
		new_canvas.setAttribute("width", window.innerWidth);
		new_canvas.setAttribute("height", window.innerHeight);
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
	
	document.addEventListener("DOMContentLoaded", function(event) { 
		setup();
		window.requestAnimationFrame(draw);
	});

}());