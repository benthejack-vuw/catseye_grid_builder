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


// Return the X/Y in a local context.
function global_to_local(context, event){
    var rect = context.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

}

function fetchJSONFile(path, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                var data = JSON.parse(httpRequest.responseText);
                if (callback){callback(data);}
            }
        }
    };
    httpRequest.open('GET', path);  
    httpRequest.send(); 
}

var InteractionManager = function(callback_object, dom_listener_element, interaction_definitions_file){

	var interactionManager = this;

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
	
	var mouse_map = ["none", "left", "middle", "right"];

	this.dom_listener_element = dom_listener_element;
	this.callback_object = callback_object;
	this.pressed_keys = {};
	this.mouse_data = {};
	this.touches = [];


	//----------------------------------------------KEYBOARD------------------------------------------------

	//checks json file for an "any" callback. event_type should be press or release
	this.checkAnyKeyBinding = function(event_type, button){
		var any_key_binding = interactionManager.interactions.keyboard[event_type].any;
		if(any_key_binding){
			console.log(any_key_binding);
			interactionManager.callback_object[any_key_binding](button, interactionManager.pressed_keys);
		}
	};

	//returns the json key name from an event
	this.keyNameFromEvent = function(e){
		return interaction_key_bindings[e.keyCode] || String.fromCharCode(e.keyCode || e.charCode);
	};

	//checks for any completed key combos, and call their respective callbacks
	this.checkKeyCombos = function(){
		 var interaction_keys = Object.keys(interactionManager.interactions.keyboard.press);
		 
		 for(var i = 0; i < interaction_keys.length; ++i){
		 	
		 	var current_key_combo = interaction_keys[i];
		 	var key_combo = interaction_keys[i].split("+");
		 	var activated = true;

		 	for(var j = 0; j < key_combo.length; ++j){
		 		if(!interactionManager.pressed_keys[key_combo[j]]){
		 			activated = false;
		 		}
		 	}
		 	if(activated){
		 		var callback = interactionManager.interactions.keyboard.press[interaction_keys[i]];
		 		interactionManager.callback_object[callback](current_key_combo, interactionManager.pressed_keys);
		 	}
		 }
	};

	//unset the key (this is called on key release)
	this.unsetKey = function(e){
		if(interaction_key_bindings[e.keyCode.toString()]){
			interactionManager.pressed_keys = {};
		}
		else{
			var key_name = interactionManager.keyNameFromEvent(e);
			if(key_name){
				interactionManager.pressed_keys[key_name] = false;
			}
		}
	};


	this.keyDown = function(e){
		var pressed = interaction_key_bindings[e.keyCode];
		if(pressed){
			interactionManager.pressed_keys[pressed] = true;
		}
	};

	this.keyPressed = function(e){		
		e.preventDefault();

		e = e || event;
		var pressed = interactionManager.keyNameFromEvent(e);
		interactionManager.checkAnyKeyBinding("press", pressed);
		
		if(pressed){
			interactionManager.pressed_keys[pressed] = true;
			interactionManager.checkKeyCombos();
		}
	};

	this.keyReleased = function(e){

		e.preventDefault();

		var released = interactionManager.keyNameFromEvent(e);

		interactionManager.checkAnyKeyBinding("release", released);
		interactionManager.unsetKey(e);

	 	var released_interaction = interactionManager.interactions.keyboard.release[released];
	 	if(released_interaction){
	 		interactionManager.callback_object[released_interaction](released, interactionManager.pressed_keys);
	 	}
	};


//--------------------------------------------------MOUSE-----------------------------------------------------------


	this.set_local_mouse_position = function(e){
		interactionManager.mouse_data.position = global_to_local(interactionManager.dom_listener_element, e);
	};

	this.mouseButtonAction = function(action, e, any){

		e.preventDefault();

		interactionManager.set_local_mouse_position(e);
		var mouse_button = mouse_map[e.which];
		interactionManager.mouse_data[mouse_button] = (action === "click" || action ===  "release" ? false : true);

		if(any !== undefined){
			mouse_button = "any";
		}

		if(interactionManager.interactions.mouse[action]){
			var callback = interactionManager.interactions.mouse[action][mouse_button];
			if(callback){
				interactionManager.callback_object[callback](mouse_button, interactionManager.mouse_data);
			}
		}
	};

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
		return interactionManager.mouse_data.left || interactionManager.mouse_data.middle || interactionManager.mouse_data.right;
	};

	this.mouseMoved = function(e){

		interactionManager.set_local_mouse_position(e);
		
		var drag_callback = interactionManager.interactions.mouse.drag;
		var move_callback = interactionManager.interactions.mouse.move;

		if(move_callback || drag_callback){
			if(drag_callback && interactionManager.isAnyMouseButtonPressed()){
				interactionManager.callback_object[drag_callback](interactionManager.mouse_data);
			}
			else if(move_callback){
				interactionManager.callback_object[move_callback](interactionManager.mouse_data);
			}
		}

	};

	this.focus = function(){
		interactionManager.dom_listener_element.focus();
	};

	//------------------------------------------------SETUP-------------------------------------------------------

	this.start = function(){
		fetchJSONFile(interaction_definitions_file, this.setupInteractions);
	};

	this.stop = function(){
		dom_listener_element.removeEventListener( "keydown", interactionManager.keyDown,  false );
		dom_listener_element.removeEventListener( "keypress", interactionManager.keyPressed,  false );
		dom_listener_element.removeEventListener( "keyup"  , interactionManager.keyReleased, false );
		dom_listener_element.removeEventListener( "mousedown", interactionManager.mousePressed,  false );
		window.removeEventListener( "mouseup", interactionManager.mouseReleased,  false );
		dom_listener_element.removeEventListener( "click"  , interactionManager.mouseClicked, false );
		dom_listener_element.removeEventListener("contextmenu", interactionManager.stopContextMenu);
		dom_listener_element.removeEventListener( "mousemove"  , interactionManager.mouseMoved );
		dom_listener_element.removeEventListener( "mouseenter", interactionManager.focus,  false );
		dom_listener_element.removeEventListener( "mousedown", interactionManager.focus,  false );		
	};

	this.setupInteractions = function(JSON_data){
		interactionManager.interactions = JSON_data;

		if(interactionManager.interactions.keyboard){
			dom_listener_element.setAttribute("tabindex", 1);//in case element is a canvas or other non-focusable object.
			dom_listener_element.addEventListener( "mouseenter", interactionManager.focus,  false );
			dom_listener_element.addEventListener( "mousedown", interactionManager.focus,  false );

			dom_listener_element.addEventListener( "keydown", interactionManager.keyDown,  false );
			dom_listener_element.addEventListener( "keypress", interactionManager.keyPressed,  false );
			dom_listener_element.addEventListener( "keyup"  , interactionManager.keyReleased, false );
		}
		if(interactionManager.interactions.mouse){
			dom_listener_element.addEventListener( "mousedown", interactionManager.mousePressed,  false );
			window.addEventListener( "mouseup", interactionManager.mouseReleased,  false );

			dom_listener_element.addEventListener( "click"  , interactionManager.mouseClicked, false );
			dom_listener_element.addEventListener("contextmenu", interactionManager.stopContextMenu);

			if(interactionManager.interactions.mouse.drag || interactionManager.interactions.mouse.move){
				dom_listener_element.addEventListener( "mousemove"  , interactionManager.mouseMoved );
			}
		}

		interactionManager.focus();

	};

};