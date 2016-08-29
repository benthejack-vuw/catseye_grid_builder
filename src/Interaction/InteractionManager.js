/*
*	The interaction manager class deals with mouse,
*	keyboard, and [eventually] touch interactions (not yet implemented)
*
*	It uses a json file to set up key and mouse combinations in the interaction_definitions_file. 
*
*	The constructor takes a callback object whose methods are linked to by key 
*	and mouse combinations in the interaction_definitions_file. 
* 	See example definitions file for how the links work.
*
*	all rights reserved Ben Jack
*/

var InteractionManager = function(callback_object, dom_listener_element, interaction_definitions_file){


	var interactionManager = this;

	this.dom_listener_element = dom_listener_element;
	this.callback_object = callback_object;
	this.pressed_keys = {};
	this.mouse_data = {};
	this.touches = [];

	var interaction_key_bindings = {
		"8" :"backspace",
		"13":"return",
		"16":"shift",
		"17":"control",
		"18":"alt",
		"32":"space",
		"46":"delete",
		"91":"meta",
		"93":"meta"
	};

	// 0 : No button
	// 1 : Left mouse button
	// 2 : Wheel button or middle button (if present)
	// 3 : Right mouse button
	var mouse_map = ["none", "left", "middle", "right"];

	this.keyDown = function(e){
		var pressed = interaction_key_bindings[e.keyCode];
		if(pressed){
			interactionManager.pressed_keys[pressed] = true;
		}
	};

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
	};

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
	};

	this.set_local_mouse_position = function(e){
		interactionManager.mouse_data["position"] = global_to_local(interactionManager.dom_listener_element, event.clientX, event.clientY);
	}

	this.mouseButtonAction = function(action, e, any){

		e.preventDefault();

		interactionManager.set_local_mouse_position(e);
		var mouse_button = mouse_map[e.which];
		interactionManager.mouse_data[mouse_button] = (action == "click" || action ==  "release" ? false : true);

		if(!(any === undefined))
			mouse_button = "any";

		var callback = interactionManager.interactions.mouse[action][mouse_button];
		if(callback)
			interactionManager.callback_object[callback](interactionManager.mouse_data, mouse_button);
	}

	this.mouseClicked = function(e){
		interactionManager.mouseButtonAction("click", e); //check regular bindings
		interactionManager.mouseButtonAction("click", e, true); //check for "any" mouseclick binding
	};

	this.mousePressed = function(e){
		interactionManager.mouseButtonAction("press", e); //check regular bindings
		interactionManager.mouseButtonAction("press", e, true); //check for "any" mousepress binding
	};

	this.mouseReleased = function(e){
		interactionManager.mouseButtonAction("release", e); //check regular bindings
		interactionManager.mouseButtonAction("release", e, true); //check for "any" mouserelease binding
	};

	this.stopContextMenu = function(e){
		e.preventDefault();
		return false;
	};

	this.isAnyMouseButtonPressed = function(){
		return interactionManager.mouse_data["left"] || interactionManager.mouse_data["middle"] || interactionManager.mouse_data["right"];
	};

	this.mouseMoved = function(e){

		interactionManager.mouse_data["position"] = global_to_local(interactionManager.dom_listener_element, event.clientX, event.clientY);
		
		var drag_callback = interactionManager.interactions.mouse.drag;
		var move_callback = interactionManager.interactions.mouse.move;

		if(move_callback || drag_callback){
			if(drag_callback && interactionManager.isAnyMouseButtonPressed())
				interactionManager.callback_object[drag_callback](interactionManager.mouse_data);
			else if(move_callback)
				interactionManager.callback_object[move_callback](interactionManager.mouse_data);
		}

	}

	this.setupInteractions = function(JSON_data){
		interactionManager.interactions = JSON_data;

		dom_listener_element.addEventListener( "keydown", interactionManager.keyDown,  false );
		dom_listener_element.addEventListener( "keypress", interactionManager.keyPressed,  false );
		dom_listener_element.addEventListener( "keyup"  , interactionManager.keyReleased, false );

		dom_listener_element.addEventListener( "mousedown", interactionManager.mousePressed,  false );
		dom_listener_element.addEventListener( "mouseup", interactionManager.mouseReleased,  false );

		dom_listener_element.addEventListener( "click"  , interactionManager.mouseClicked, false );
		dom_listener_element.addEventListener("contextmenu", interactionManager.stopContextMenu);

		if(interactionManager.interactions.mouse.drag || interactionManager.interactions.mouse.move){
			dom_listener_element.addEventListener( "mousemove"  , interactionManager.mouseMoved );
		}
	}

	loadJSON(interaction_definitions_file, this.setupInteractions);

}

function global_to_local(context, globalX, globalY){
    // Return the X/Y in the local context.
    return({
        x: Math.floor( globalX - context.offsetLeft ),
        y: Math.floor( globalY - context.offsetHeight )
    });

}