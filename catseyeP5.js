let gon = null;

function setup() {
	createCanvas(800, 800);

	gon = new NGon(6);
	gon.initialize(400, 400, 200);
}

function draw() {
  gon.draw();
}

	
function mousePressed(){
}