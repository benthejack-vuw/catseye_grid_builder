var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DomUtils } from "bj-utils";
import { BJMath } from "bj-utils";
import { Point } from "bj-utils";
import { Storage as LocalStore } from "bj-utils";
import { Stage } from "quick-canvas";
import { DisplayObject } from "quick-canvas";
import { GridStorage } from "../grids/gridStorage";
import { GLPolyTile } from "../webGL/GLPolyTile";
import { ImageAreaSelector } from "../interactive/imageAreaSelector";
export class PatternBuilder extends DisplayObject {
    constructor() {
        super(new Point(0, 0), new Point(window.innerWidth, window.innerHeight));
        this._tileScale = 1;
        this._dirty = true;
        this._pause = true;
        this._dirtyScaleHack = -1;
        this.reset = (skipConfirm) => {
            if (skipConfirm || confirm("This will revert the image and texture co-ordinates back to their defaults. Are you SURE you want to do this?")) {
                let img = document.getElementById("defaultImage");
                this.setImage(img);
                LocalStore.remove("selectionImage");
                this.changeScale(0.5, null);
                this.setGrid(null);
                this.updateTextureCoordinates(this._imageSelector.selection);
                this._dirty = true;
                var imgUrl = DomUtils.dataURLfromImage(img);
                LocalStore.store("selectionImage", imgUrl);
                location.reload();
            }
        };
        this.loadImage = () => __awaiter(this, void 0, void 0, function* () {
            const file = yield DomUtils.selectImage();
            console.log("file selected");
            const url = yield DomUtils.readImageAsURL(file);
            const image = yield DomUtils.buildImageFromURL(url);
            this.setImage(image);
            LocalStore.store("selectionImage", url);
            this._imageSelector.forceUpdate();
        });
        this.loadGrid = (val, obj) => {
            DomUtils.selectFile().then((file) => {
                return DomUtils.readFileAsJSON(file);
            }).then((grid) => {
                this.setGrid(grid);
                GridStorage.saveGrid(grid);
                GridStorage.createCustomGridSelectors("custom-grids", this);
                this.showCustomGrids();
            });
        };
        this.saveImage = (val, obj) => {
            var canvas = document.createElement("canvas");
            canvas.width = this._saveSize.x;
            canvas.height = this._saveSize.y;
            this._glTile.redraw();
            this._glTile.patternRect(canvas.getContext("2d"), new Point(0, 0), this._saveSize, this._tileScale);
            var sel = document.getElementById('save-format');
            DomUtils.downloadCanvasImage(canvas, "catseyePattern", sel.value);
        };
        this.saveTile = (val, obj) => {
            this._glTile.redraw();
            var sel = document.getElementById('save-format');
            DomUtils.downloadCanvasImage(this._glTile.renderCanvas, "catseyePattern", sel.value);
        };
        this.saveWidth = (val) => {
            this._saveSize.x = val;
        };
        this.saveHeight = (val) => {
            this._saveSize.y = val;
        };
        this.toggleGridDisplay = (val, obj) => {
            this._showGrid = !this._showGrid;
            this._glTile.showGrid(this._showGrid);
            obj.innerHTML = this._showGrid ? "Hide Grid" : "Show Grid";
            this._dirty = true;
        };
        this.changeScale = (val, obj) => {
            val = BJMath.clamp(val, 0.005, 1);
            const box = document.getElementById("tile-scale-box");
            const slider = document.getElementById("tile-scale-slider");
            if (obj === box) {
                slider.value = val;
            }
            else if (obj == slider) {
                box.value = val;
            }
            else {
                slider.value = val;
                box.value = val;
            }
            this._glTile.scale = val * .25;
            LocalStore.store("scale", val);
            this._dirty = true;
        };
        this.clearLocalStore = () => {
            if (confirm("WARNING: This wil delete ALL your settings and custom grids from the browsers localStore. Are you SURE you want to do this?")) {
                LocalStore.clearAll();
                this.reset(true);
            }
        };
        this.updateTextureCoordinates = (pts) => {
            this._textureCoordinates = pts;
            this._glTile.setSelection(this._textureCoordinates);
            LocalStore.storeJSON("texCoords", this._textureCoordinates);
            this._dirty = true;
        };
        this.showDefaultGrids = () => {
            var defaultGrids = document.getElementById("default-grids");
            var customGrids = document.getElementById("custom-grids");
            customGrids.setAttribute("style", "display:none");
            defaultGrids.setAttribute("style", "");
            document.getElementById("showCustomGrids").setAttribute("class", "");
            document.getElementById("showDefaultGrids").setAttribute("class", "selected");
        };
        this.showCustomGrids = () => {
            var defaultGrids = document.getElementById("default-grids");
            var customGrids = document.getElementById("custom-grids");
            defaultGrids.setAttribute("style", "display:none");
            customGrids.setAttribute("style", "");
            document.getElementById("showDefaultGrids").setAttribute("class", "");
            document.getElementById("showCustomGrids").setAttribute("class", "selected");
        };
        this._saveSize = new Point(parseInt(document.getElementById("save-width").value), parseInt(document.getElementById("save-height").value));
        this.setCacheAsCanvas(true);
        this._textureCoordinates = [new Point(0, 0), new Point(1, 1), new Point(0, 1)];
        this._selectionStage = new Stage("image-selection", new Point(280, 280));
        this._texture = document.getElementById("defaultImage");
        this.setupTile();
        if (LocalStore.contains("selectionImage") || LocalStore.contains("currentGrid") || LocalStore.contains("scale")) {
            this.loadLastSession();
        }
        GridStorage.createDefaultGridSelectors("default-grids", this);
        GridStorage.createCustomGridSelectors("custom-grids", this);
        this.showDefaultGrids();
    }
    set dirty(dirty) {
        this._dirty = true;
    }
    loadLastSession() {
        try {
            const self = this;
            if (LocalStore.contains("selectionImage")) {
                DomUtils.buildImageFromURL(LocalStore.get("selectionImage")).then((image) => {
                    self.setImage(image);
                    this._imageSelector.setTextureCoords(LocalStore.getJSON("texCoords"));
                    this._imageSelector.forceUpdate();
                });
            }
            if (LocalStore.contains("currentGrid")) {
                self.setGrid(LocalStore.getJSON("currentGrid"));
            }
            if (LocalStore.contains("scale")) {
                const val = LocalStore.get("scale");
                self.changeScale(val, null);
                this._dirtyScaleHack = val;
                this._dirty = true;
            }
        }
        catch (e) {
            alert("your local data has been corrupted, your workspace has been reset");
            this.clearLocalStore();
        }
    }
    addedToStage() {
    }
    draw(context) {
        if (this._dirtyScaleHack >= 0) {
            this.changeScale(this._dirtyScaleHack, null);
            this._dirtyScaleHack = -1;
        }
        if (this._dirty) {
            this.clear(context, true);
            this._glTile.redraw();
            this._dirty = false;
            if (context.canvas.width > 0 && context.canvas.height > 0)
                this._glTile.patternRect(context, new Point(0, 0), this._size, this._tileScale);
        }
    }
    setImage(image) {
        this._texture = image;
        if (this._imageSelector)
            this._selectionStage.removeChild(this._imageSelector);
        this._imageSelector = new ImageAreaSelector(this._texture, this._selectionStage.size.x, this.updateTextureCoordinates);
        this._selectionStage.addChild(this._imageSelector);
        this._glTile.updateTexture(image);
        this._dirty = true;
    }
    setGrid(grid) {
        this._grid = grid;
        this._glTile.updateGrid(grid);
        LocalStore.storeJSON("currentGrid", this._grid);
        this._dirty = true;
    }
    setupTile() {
        if (this._glTile)
            this._glTile.destroy();
        this._glTile = new GLPolyTile(new Point(0, 0), new Point(1024, 1024), this._texture, this._grid);
        this.setImage(this._texture);
        if (this._imageSelector)
            this._textureCoordinates = this._imageSelector.selection;
        this._glTile.setSelection(this._textureCoordinates);
        this._glTile.updateGrid(this._grid);
        this._glTile.redraw();
    }
    contains(pt) {
        return true;
    }
}
//# sourceMappingURL=patternBuilder.js.map