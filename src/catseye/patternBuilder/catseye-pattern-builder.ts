import InteractionManager from "../../quickdrawJS/interaction/interactionHandler/interactionManager"
import PatternBuilder from "./patternBuilder"
import Stage from "../../quickdrawJS/canvas/stage";
import Point from "../../quickdrawJS/geometry/point"
import * as DrawingUtils from "../../quickdrawJS/util/drawingUtils";

addEventListener("load", (): void => {

	let stage:Stage = new Stage("preview", new Point(window.innerWidth, window.innerHeight));
	stage.clearColor(180);

	let patternBuilderInteractions:InteractionManager;

	setup();
	window.requestAnimationFrame(draw);

	function setup() {
		var grid_builder:PatternBuilder = new PatternBuilder();
		patternBuilderInteractions = new InteractionManager(grid_builder, stage.stageCanvas, "./assets/json/pattern_builder_interactions.json");
		stage.addChild(grid_builder);
	}

	function draw() {
		stage.draw();
		window.requestAnimationFrame(draw);
	}
	
	

});