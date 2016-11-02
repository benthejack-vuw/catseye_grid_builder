import InteractionManager from "../../quickdrawJS/interaction/interactionHandler/interactionManager"
import PolyGridBuilder from "./polyGridBuilder"
import Stage from "../../quickdrawJS/canvas/stage";
import Point from "../../quickdrawJS/geometry/point"
import * as DrawingUtils from "../../quickdrawJS/util/drawingUtils";

addEventListener("load", (): void => {

	let stage:Stage = new Stage("canvas_container", new Point(window.innerWidth, window.innerHeight));
	stage.clearColor(180);

	let gridbuilderInteractions:InteractionManager;

	setup();
	window.requestAnimationFrame(draw);

	function setup() {
		var grid_builder:PolyGridBuilder = new PolyGridBuilder(60);
		gridbuilderInteractions = new InteractionManager(grid_builder, stage.stageCanvas, "./assets/json/grid_builder_interactions.json");
		stage.addChild(grid_builder);
	}

	function draw() {
		stage.draw();
		window.requestAnimationFrame(draw);
	}
	
	

});