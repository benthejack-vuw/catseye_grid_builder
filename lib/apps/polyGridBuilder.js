import * as DomUtils from "bj-utils/lib/util/domUtils";
import { DrawingUtils } from "bj-utils";
import { BJMath } from "bj-utils";
import { Transform } from "bj-utils";
import { Point } from "bj-utils";
import { DisplayObject } from "quick-canvas";
import { PolygonGrid } from "quick-canvas";
import { RegularPolygon } from "quick-canvas";
import { DraggableRect } from "quick-canvas";
import { BoundingBox } from "quick-canvas";
import { PolygonTile } from "../geometry/polygonTile";
import { GridStorage } from "../grids/gridStorage";
var GridMode;
(function (GridMode) {
    GridMode[GridMode["create"] = 0] = "create";
    GridMode[GridMode["tile"] = 1] = "tile";
})(GridMode || (GridMode = {}));
export class PolyGridBuilder extends DisplayObject {
    constructor(radius) {
        super(new Point(0, 0), new Point(window.innerWidth, window.innerHeight));
        this.loadGrid = (val, obj) => {
            console.log("HERE");
            DomUtils.selectFile().then((file) => {
                return DomUtils.readFileAsJSON(file);
            }).then((grid) => {
                this._grid.setPolygonData(grid.polygons);
                this.setRotationSlider();
                this._tileSelector = undefined;
                this._snapGrid = undefined;
                this._polyTile = undefined;
            });
        };
        this.change_current_poly = (last_pressed) => {
            this._next_poly_sides = parseInt(last_pressed);
            this._polygon_ghost = new RegularPolygon();
            if (this._grid.isEmpty()) {
                this._polygon_ghost.initialize_regular_polygon(this._next_poly_sides, new Point(0, 0), this._start_radius);
            }
            else if (this._selected_edge) {
                this._polygon_ghost.initialize_from_line(this._next_poly_sides, this._selected_edge);
            }
            if (this._grid.size <= 1) {
                this.setRotationSlider();
            }
        };
        this.generate_snap_grid = () => {
            this.removeChild(this._snapGrid);
            this._snapGrid = this._grid.generateSnapGrid(2);
            this.addChild(this._snapGrid);
            if (!this._tileSelector) {
                var box = this._snapGrid.boundingBox;
                this._tileSelector = new DraggableRect(new Point(box.x, box.y), new Point(box.width, box.height));
            }
            this._tileSelector.snapToGrid(this._snapGrid);
            this._snapGrid.addChild(this._tileSelector);
        };
        this.delete_poly = () => {
            this._grid.deletePolyUnderPoint(this._mouseData.position);
            if (this._grid.isEmpty()) {
                this._polygon_ghost.initialize_regular_polygon(this._next_poly_sides, new Point(0, 0), this._start_radius);
            }
        };
        this.changeRotation = (value) => {
            this._rotate = value;
            this.applyTransformations();
        };
        this.changeScale = (value) => {
            this._scale = value;
            this.applyTransformations();
        };
        this.toggleMode = (value) => {
            if (this._mode == GridMode.create) {
                this.generate_snap_grid();
                this._mode = GridMode.tile;
            }
            else if (this._mode = GridMode.tile) {
                this._mode = GridMode.create;
                this.removeChild(this._snapGrid);
                this._snapGrid = null;
            }
        };
        this.cropTiles = () => {
            if (this._tileSelector) {
                var bounds = new BoundingBox(this._tileSelector.points);
                this._grid.crop(bounds);
                this.generate_snap_grid();
            }
        };
        this.previewTile = () => {
            this.generateTile();
        };
        this.saveTile = () => {
            if (this._mode == GridMode.tile) {
                this.generateTile();
                var name = document.getElementById("fileName").value;
                name = name.length > 0 ? name + ".json" : "tilegrid.json";
                DomUtils.downloadTextAsFile(name, JSON.stringify(this._grid.toJSON()));
                GridStorage.saveGrid(this._grid.toJSON());
            }
        };
        this.saveTileImage = () => {
            if (this._mode == GridMode.tile) {
                this.generateTile();
                var name = document.getElementById("fileName").value;
                name = name.length > 0 ? name : "catseyeGrid";
                this._polyTile.saveImage(name);
            }
        };
        this._grid = new PolygonGrid();
        this._selected_edge = null;
        this._mouseData = null;
        this._start_radius = radius;
        this._next_poly_sides = 6;
        this._polygon_ghost = new RegularPolygon();
        this._polygon_ghost.initialize_regular_polygon(this._next_poly_sides, new Point(0, 0), this._start_radius);
        this.clearColor(180);
        this._mode = GridMode.create;
        this._translate = new Point(window.innerWidth / 2, window.innerHeight / 2);
        this._rotate = 0;
        this._scale = 1;
    }
    set size(newSize) {
        super.size = newSize;
        this._translate = new Point(window.innerWidth / 2, window.innerHeight / 2);
        this.applyTransformations();
    }
    addedToStage() {
        this.applyTransformations();
    }
    contains(local_pt) {
        return true;
    }
    draw(context) {
        context.save();
        context.translate(-this._size.x / 2, -this._size.y / 2);
        this.clear(context, true);
        context.restore();
        if (this._polyTile) {
            context.save();
            context.rotate(-this._rotate);
            context.scale(1.0 / this._scale, 1.0 / this._scale);
            this._polyTile.patternRect(context, new Point(-this._size.x / 2, -this._size.y / 2), this._size, true);
            context.rect(-this._size.x / 2, -this._size.y / 2, this._size.x, this._size.y);
            context.fillStyle = DrawingUtils.greyA(0, 130);
            context.fill();
            context.restore();
        }
        this._grid.draw(context);
        if (this._mode == GridMode.create && this._polygon_ghost) {
            context.strokeStyle = DrawingUtils.grey(100);
            context.fillStyle = DrawingUtils.rgba(255, 255, 255, 50);
            this._polygon_ghost.draw(context, true);
        }
        if (this._mode == GridMode.tile && this._tileSelector) {
            var pts = [];
            var rotate = new Transform();
            rotate.rotate(this._rotate);
            for (let i = 0; i < this._tileSelector.points.length; ++i) {
                pts.push(rotate.transformPoint(this._tileSelector.points[i]));
            }
            var bounds = new BoundingBox(pts);
            context.save();
            context.rotate(-this._rotate);
            context.strokeStyle = "#FF0000";
            bounds.draw(context);
            context.restore();
        }
    }
    mouseMoved(i_mouseData) {
        if (this._mode == GridMode.create) {
            this._mouseData = i_mouseData;
            var new_edge = this._grid.closestEdge(this._mouseData.position);
            if (!this._grid.isEmpty()) {
                if (new_edge === null) {
                    this._polygon_ghost.empty();
                }
                else if (this._selected_edge !== new_edge) {
                    this._selected_edge = new_edge;
                    this._polygon_ghost.initialize_from_line(this._next_poly_sides, this._selected_edge);
                }
            }
        }
    }
    mouseDragged(i_mouseData) {
        this._mouseData = i_mouseData;
    }
    mousePressed(i_mouseData) {
        this._mouseData = i_mouseData;
    }
    mouseClicked() {
        this._grid.addPolygon(this._polygon_ghost);
        this._polygon_ghost = new RegularPolygon();
        this._selected_edge = this._grid.closestEdge(this._mouseData.position);
        this._polygon_ghost.initialize_from_line(this._next_poly_sides, this._selected_edge);
        if (this._grid.size <= 1) {
            this.setRotationSlider();
        }
    }
    setRotationSlider() {
        DomUtils.editDomElementAttr("rotationSlider", "max", BJMath.TWO_PI);
        DomUtils.editDomElementAttr("rotationSlider", "step", BJMath.TWO_PI / (this._grid.first.length * 2));
    }
    applyTransformations() {
        this.parent.stage.resetMatrix();
        this.parent.stage.translate(this._translate.x, this._translate.y);
        this.parent.stage.rotate(this._rotate);
        this.parent.stage.scale(this._scale, this._scale);
    }
    generateTile() {
        if (this._mode == GridMode.tile) {
            var bounds = this._tileSelector.toPolygon();
            this._grid.normalize(bounds, this._rotate, this._start_radius);
            this._polyTile = new PolygonTile(new Point(-window.innerWidth / 2 + 100, window.innerHeight / 2 - 300), new Point(100, 100), this._grid.toJSON());
            this._polyTile.redraw();
        }
    }
}
//# sourceMappingURL=polyGridBuilder.js.map