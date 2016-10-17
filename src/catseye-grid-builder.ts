import InteractionManager from "./interaction/interactionHandler/interactionManager"
import PolyGridBuilder from "./polyGridBuilder"
import Stage from "./interaction/stage";
import Point from "./geometry/point"
import * as DrawingUtils from "./util/drawingUtils";

addEventListener("load", (): void => {

	let stage:Stage = new Stage("canvas_container", new Point(window.innerWidth, window.innerHeight));
	let interactionManager:InteractionManager = new InteractionManager(stage, stage.stageCanvas, "stage_interactions.json");


	setup();
	window.requestAnimationFrame(draw);

	function setup() {
		var grid_builder:PolyGridBuilder = new PolyGridBuilder(60);
		stage.addChild(grid_builder);
		
	}

	function draw() {
		stage.draw();
		window.requestAnimationFrame(draw);
	}
	
	

});