
var controller = null;

function setup() {
	var renderer = createCanvas(800, 800);
	renderer.canvas.setAttribute("tabindex", 1);
	controller = new CatseyeController(renderer.canvas);
}

function draw() {
	background(180);
	controller.draw();
}