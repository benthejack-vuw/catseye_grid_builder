import { Point } from "bj-utils";
import { InteractionManager } from "interaction-centre";
import { Stage } from "quick-canvas";
import { PolyGridBuilder } from "./apps/polyGridBuilder";
import { PatternBuilder } from "./apps/patternBuilder";
window.catseye = {
    patternBuilder: () => {
        window.addEventListener("load", () => {
            initializeCatseye();
            window.catseye.initializePatternBuilder();
        });
    },
    gridBuilder: () => {
        window.addEventListener("load", () => {
            initializeCatseye();
            window.catseye.initializeGridBuilder();
        });
    }
};
function initializeCatseye() {
    let stage = new Stage("catseye-main", new Point(window.innerWidth, window.innerHeight));
    stage.clearColor(180);
    window.catseye.initializePatternBuilder = () => {
        var pattern_builder = new PatternBuilder();
        var patternBuilderInteractions = new InteractionManager(pattern_builder, stage.stageCanvas, "./assets/json/pattern_builder_interactions.json");
        stage.addChild(pattern_builder);
        var fitGridSelector = () => {
            var totalHeight = document.getElementById("interface").clientHeight;
            var gridBox = document.getElementById("grid-selection");
            gridBox.style.height = (totalHeight - gridBox.offsetTop - 15) + "px";
        };
        fitGridSelector();
        window.addEventListener("resize", () => {
            stage.size = new Point(window.innerWidth, window.innerHeight);
            pattern_builder.size = new Point(window.innerWidth, window.innerHeight);
            pattern_builder.dirty = true;
            pattern_builder.redraw();
            fitGridSelector();
        });
    };
    window.catseye.initializeGridBuilder = () => {
        var grid_builder = new PolyGridBuilder(60);
        var gridbuilderInteractions = new InteractionManager(grid_builder, stage.stageCanvas, "./assets/json/grid_builder_interactions.json");
        stage.addChild(grid_builder);
        window.addEventListener("resize", () => {
            stage.size = new Point(window.innerWidth, window.innerHeight);
            grid_builder.size = new Point(window.innerWidth, window.innerHeight);
            grid_builder.redraw();
        });
    };
}
//# sourceMappingURL=catseye.js.map