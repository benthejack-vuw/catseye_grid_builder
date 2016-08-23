let gon = null;
let initLine = null;
let pt1, pt2 = null;


function setup() {
	createCanvas(800, 800);

	gon = new NGon(5);
	pt1 = createVector(350,350);
	pt2 = createVector(400,400);
	initLine = new InteractiveLine(pt1, pt2);

	gon.initialize_from_line(initLine);
}

function draw() {
	background(255);

  	strokeWeight(1);
  	gon.draw();

  	strokeWeight(2);
  	initLine.draw(color(255,0,0));
}

	
function mousePressed(){
	pt1 = createVector(mouseX, mouseY);
}

function mouseReleased(){
	pt2 = createVector(mouseX, mouseY);
	initLine = new InteractiveLine(pt1, pt2);
	gon.initialize_from_line(initLine);
}