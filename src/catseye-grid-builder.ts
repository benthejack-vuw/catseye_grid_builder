import InteractionManager from "./interaction/interactionHandler/interactionManager"
import PolyGridBuilder from "./polyGridBuilder"
import Stage from "./interaction/stage";
import Point from "./geometry/point"
import * as DrawingUtils from "./util/drawingUtils";

addEventListener("load", (): void => {

	let stage:Stage = new Stage("canvas_container", new Point(window.innerWidth, window.innerHeight));
	stage.clearColor(180);

	let gridbuilderInteractions:InteractionManager;

	setup();
	window.requestAnimationFrame(draw);

	function setup() {
		var grid_builder:PolyGridBuilder = new PolyGridBuilder(60);
		gridbuilderInteractions = new InteractionManager(grid_builder, stage.stageCanvas, "grid_builder_keyboard_interactions.json");
		stage.addChild(grid_builder);
	}

	function draw() {
		stage.draw();
		window.requestAnimationFrame(draw);
	}
	
	

});