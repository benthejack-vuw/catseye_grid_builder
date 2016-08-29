var gon = null;
var initLine = null;
var pt1, pt2 = null;
var interaction_manager = null; 

function InteractionTester(){

	this.press_space = function(){
		console.log("InteractionTester -> PRESS_SPACE");		
	}

	this.press_a_b = function(){
		console.log("InteractionTester -> PRESS_A");		
	}

	this.press_e = function(){
		console.log("InteractionTester -> PRESS_E");		
	}

	this.press_shift_q_8 = function(){
		console.log("InteractionTester -> PRESS_SHIFT_Q_8");		
	}

	this.press_a_button = function(){
		console.log("InteractionTester -> PRESS_ANY_KEY");		
	}

	this.delete_released = function(){
		console.log("InteractionTester -> RELEASED_DELETE");		
	}

	this.q_released = function(){
		console.log("InteractionTester -> RELEASED_Q");		
	}

	this.release_any = function(){
		console.log("InteractionTester -> RELEASED_ANY");		
	}

	this.left_click = function(){
		console.log("InteractionTester -> LEFT_CLICK");		
	}

	this.right_click = function(){
		console.log("InteractionTester -> RIGHT_CLICK");	
	}

	this.left_press = function(){
		console.log("InteractionTester -> LEFT_PRESS");	
	}

	this.any_press = function(){
		console.log("InteractionTester -> ANY_PRESS");	
	}

	this.any_release = function(){
		console.log("InteractionTester -> ANY_RELEASE");	
	}

	this.any_click = function(){
		console.log("InteractionTester -> ANY_CLICK");		
	}

	this.right_release = function(){
		console.log("InteractionTester -> RIGHT_RELEASE");	
	}

	this.mouse_move = function(){
		console.log("InteractionTester -> MOUSE_MOVE");	
	}

	this.mouse_drag = function(){
		console.log("InteractionTester -> MOUSE_DRAG");	
	}

}

function setup() {
	createCanvas(800, 800);

	interaction_manager = new InteractionManager(new InteractionTester(), window, "min/catseye_grid_interaction_definitions_file-min.json");

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