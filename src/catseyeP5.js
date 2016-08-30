var controller = null;

function setup() {
	var renderer = createCanvas(window.innerWidth/2, window.innerHeight/2);
	controller = new CatseyeController(renderer.canvas);
}

function draw() {
	background(180);
	controller.draw();
}