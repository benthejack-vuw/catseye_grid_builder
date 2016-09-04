var CatseyeController = function(canvas){

	var controller = this;
 	var drawing_context = canvas.getContext("2d");
	var polyGridBuilder = new PolyGridBuilder({x:0, y:0}, 60);
	var transformMatrix = new Transform();
	var interaction_manager = new InteractionManager(polyGridBuilder, canvas, "min/catseye_grid_interaction_definitions_file-min.json");
	interaction_manager.start();

	this.scale = 1.0;
	this.rotation = 0;
	this.position = {x:canvas.width/2, y:canvas.height/2};

	this.setTransforms = function(){
		transformMatrix.reset();
		transformMatrix.translate(this.position.x, this.position.y);
		transformMatrix.scale(this.scale, this.scale);
		transformMatrix.rotate(this.rotation);
		transformMatrix.invert();
		interaction_manager.setTransformMatrix(transformMatrix);
	}

	this.setScale = function(e){
		controller.scale = e.target.value;
		controller.setTransforms();
	}

	this.setRotation = function(e){
		controller.rotation = e.target.value;
		controller.setTransforms();
	}

	this.draw = function(context){
		context.save();
			context.translate(this.position.x, this.position.y);
			context.scale(this.scale, this.scale);
			context.rotate(this.rotation);
			polyGridBuilder.draw(context);
		context.restore();
	}

	this.generateJSON = function(){
		polyGridBuilder.grid.normalize(polyGridBuilder.grid_repeat_selector.bounding_box());
		var dataStr = "data:text/json;charset=utf-8," + polyGridBuilder.grid.to_JSON();
		var dlAnchorElem = document.getElementById('downloadAnchorElem');
		dlAnchorElem.setAttribute("href",     dataStr     );
		dlAnchorElem.setAttribute("download", "scene.json");
		dlAnchorElem.click();
	};

	this.addSlider = function(min, max, value, step, callback, id){
		var newSlider = document.createElement("INPUT");
		newSlider.setAttribute("id", id);
		newSlider.setAttribute("type", "range");
		newSlider.setAttribute("min", min);
		newSlider.setAttribute("max", max);
		newSlider.setAttribute("step", step);
		newSlider.setAttribute("value", value);
		newSlider.addEventListener("change", callback);
		newSlider.addEventListener("input", callback);
		document.getElementById("controls").appendChild(newSlider);
	}

	this.addButton = function(text, callback, id){
		var newSlider = document.createElement("button");
		newSlider.setAttribute("id", id);
		newSlider.setAttribute("type", "button");
		newSlider.innerHTML = text;
		newSlider.addEventListener("click", callback);
		document.getElementById("controls").appendChild(newSlider);
	}

	this.addSlider(0.2, 2.0, 1.0, 0.1, this.setScale, "scale_slider");
	this.addSlider(0, Math.TWO_PI, 0, Math.TWO_PI/12.0, this.setRotation, "rotate_slider");
	this.addButton("save grid JSON", this.generateJSON, "save_json");
	this.setTransforms();

};