import InteractionManager from "../quickdrawJS/interaction/interactionHandler/interactionManager"
import PolyGridBuilder from "./polyGridBuilder"
import PatternBuilder from "./patternBuilder"
import Stage from "../quickdrawJS/canvas/stage";
import Point from "../quickdrawJS/geometry/point"
import * as DrawingUtils from "../quickdrawJS/util/drawingUtils";

(<any>window).catseye = {
	
	patternBuilder:():void=>{
		window.addEventListener("load", ()=>{
			initializeCatseye();
			(<any>window).catseye.initializePatternBuilder();
		});
	},

	gridBuilder:():void=>{
		window.addEventListener("load", ()=>{
			initializeCatseye();
			(<any>window).catseye.initializeGridBuilder();
		});
	}
};

function initializeCatseye(){
	let stage:Stage = new Stage("catseye-main", new Point(window.innerWidth, window.innerHeight));
	stage.clearColor(180);

	(<any>window).catseye.initializePatternBuilder = ()=>{
		var pattern_builder:PatternBuilder = new PatternBuilder();
		var patternBuilderInteractions = new InteractionManager(pattern_builder, stage.stageCanvas, "./assets/json/pattern_builder_interactions.json");
		stage.addChild(pattern_builder);

		var fitGridSelector = ()=>{
			var totalHeight = document.getElementById("interface").clientHeight;
			var gridBox = document.getElementById("grid-selection");
			gridBox.style.height = (totalHeight - gridBox.offsetTop - 15)+"px";
		}

		fitGridSelector();

		window.addEventListener("resize", ()=>{
			stage.size = new Point(window.innerWidth, window.innerHeight);
			pattern_builder.size = new Point(window.innerWidth, window.innerHeight);
			pattern_builder.dirty = true;
			pattern_builder.redraw();
			fitGridSelector();
		});

	};

	(<any>window).catseye.initializeGridBuilder = ()=>{
		var grid_builder:PolyGridBuilder = new PolyGridBuilder(60);
		var gridbuilderInteractions = new InteractionManager(grid_builder, stage.stageCanvas, "./assets/json/grid_builder_interactions.json");
		stage.addChild(grid_builder);	

		window.addEventListener("resize", ()=>{
			stage.size = new Point(window.innerWidth, window.innerHeight);
			grid_builder.size = new Point(window.innerWidth, window.innerHeight);
			grid_builder.redraw();
		});
	};
}
