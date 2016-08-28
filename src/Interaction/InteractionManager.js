var InteractionManager = function(callback_object, dom_listener_element, interaction_definitions_file){

	var interaction_key_bindings = {
		
		"8" :"backspace",
		"13":"return",
		"16":"shift",
		"17":"control",
		"18":"alt",
		"32":"space",
		"46":"delete",
		"91":"command",
		"93":"command"
	};

	this.interactions = loadJSON(interaction_definitions_file);
	var interactionManager = this;

	this.callback_object = callback_object;
	this.pressed_keys = {};
	this.pressed_mouse_buttons = {};
	this.touches = [];


	this.keyDown = function(e){
		var pressed = interaction_key_bindings[e.keyCode];
		if(pressed){
			interactionManager.pressed_keys[pressed] = true;
		}
	}

	this.keyPressed = function(e){
		
		e.preventDefault();

		e = e || event;

		var pressed = interaction_key_bindings[e.keyCode] || String.fromCharCode(e.keyCode || e.charCode);

		var any_key_binding = interactionManager.interactions.keyboard.press["any"];
		if(any_key_binding)
			interactionManager.callback_object[any_key_binding](pressed, interactionManager.pressed_keys);

		if(pressed){
		 interactionManager.pressed_keys[pressed] = true;

		 var interaction_keys = Object.keys(interactionManager.interactions.keyboard.press);
		 
		 for(var i = 0; i < interaction_keys.length; ++i){
		 	
		 	var key_combo = interaction_keys[i].split("+");
		 	var activated = true;

		 	for(var j = 0; j < key_combo.length; ++j){
		 		if(!interactionManager.pressed_keys[key_combo[j]])
		 			activated = false;
		 	}
		 	if(activated)
		 		interactionManager.callback_object[interactionManager.interactions.keyboard.press[interaction_keys[i]]](pressed, interactionManager.pressed_keys);
		 }

		}
	}

	this.keyReleased = function(e){

		e.preventDefault();

		var released = interaction_key_bindings[e.keyCode] || String.fromCharCode(e.keyCode || e.charCode).toLowerCase();

		var any_key_binding = interactionManager.interactions.keyboard.release["any"];
		if(any_key_binding)
			interactionManager.callback_object[any_key_binding](released, interactionManager.pressed_keys);

		if(interaction_key_bindings[e.keyCode.toString()]){
			interactionManager.pressed_keys = {}
		}
		else{
			var key_name = String.fromCharCode(e.keyCode || e.charCode).toLowerCase();
			if(key_name){
				interactionManager.pressed_keys[key_name] = false;
			}
		}

	 	var released_interaction = interactionManager.interactions.keyboard.release[released];
	 	if(released_interaction){
	 		interactionManager.callback_object[released_interaction](released, interactionManager.pressed_keys);
	 	}
	}

	this.mouseClicked = function(){

	}

	this.mousePressed = function(){

	}

	this.mouseReleased = function(){
		
	}

	dom_listener_element.addEventListener( "keydown", this.keyDown,  false );
	dom_listener_element.addEventListener( "keypress", this.keyPressed,  false );
	dom_listener_element.addEventListener( "keyup"  , this.keyReleased, false );

	dom_listener_element.addEventListener( "mousedown", this.mousePressed,  false );
	dom_listener_element.addEventListener( "mouseup", this.mouseReleased,  false );
	dom_listener_element.addEventListener( "click"  , this.mouseClicked, false );


}