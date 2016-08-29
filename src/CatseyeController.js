var CatseyeController = function(canvas){

	var interaction_manager = new InteractionManager(this, canvas, "min/catseye_grid_interaction_definitions_file-min.json");

	var gon = new NGon(5);
	var pt1 = createVector(350,350);
	var pt2 = createVector(400,400);
	var initLine = new InteractiveLine(pt1, pt2);

	gon.initialize_from_line(initLine);

	var mouseData = null;

	this.draw = function(){
		strokeWeight(1);

		if(mouseData && gon.is_under(mouseData.position)){
			fill(0,255,0);
		}else{
			fill(255);
		}
		stroke(255);

  		gon.draw();

  		strokeWeight(2);
  		initLine.draw(color(255,0,0));
	};

	this.mouse_move = function(i_mouseData){
		console.log("MOVE");
		mouseData = i_mouseData;
	}


};