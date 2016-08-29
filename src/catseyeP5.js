
var controller = null;

function setup() {
	var renderer = createCanvas(800, 800);
	controller = new CatseyeController(renderer.canvas);
}

function draw() {
	background(180);
	controller.draw();
}