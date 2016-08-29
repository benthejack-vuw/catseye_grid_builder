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

	this.middle_click = function(){
		console.log("InteractionTester -> MIDDLE_CLICK");	
	}

	this.right_click = function(){
		console.log("InteractionTester -> RIGHT_CLICK");	
	}

	this.any_click = function(){
		console.log("InteractionTester -> ANY_CLICK");	
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

	this.mouse_move = function(mouseData){
		console.log("InteractionTester -> MOUSE_MOVE: " + mouseData.position.x, mouseData.position.y);	
	}

	this.mouse_drag = function(){
		console.log("InteractionTester -> MOUSE_DRAG");	
	}

}