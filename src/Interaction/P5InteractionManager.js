// @codekit-prepend "InteractionBindings.js"

var InteractionManager = function(callback_object, dom_listener_element, interaction_definitions_file){

	dom_listener_element.addEventListener( "keydown", this.keyPressed,  false );
	dom_listener_element.addEventListener( "keyup"  , this.keyReleased, false );

	loadJSON(interaction_definitions_file, this.setup_interactions);

	this.interactions = {};

	this.pressed_keys = [];
	this.pressed_mouse_buttons = [];
	this.touches = [];	

	this.keyPressed(){
		var key_name = p5_key_bindings[keyCode.toString()];
		if(key_name){ this.pressed_keys.push(key_name); }
	}

	this.keyReleased(){
		var key_name = p5_key_bindings[keyCode.toString()];
		if(key_name){
			var index = this.pressed_keys.indexOf(key_name);
			if (index > -1){ this.pressed_keys.splice(index, 1); }
		}
	}

	this.click(){
		this.pressed_mouse_buttons.push()
	}

	this.mousePressed(){

	}

	this.mouseReleased(){
		
	}


}