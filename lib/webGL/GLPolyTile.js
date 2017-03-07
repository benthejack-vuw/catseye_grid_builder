import { Point } from "bj-utils";
import { DisplayObject } from "quick-canvas";
import { GridStorage } from "../grids/gridStorage";
import { QDOrthoGLCanvas } from "./qdOrthoGLCanvas";
import GLMirrorPoly from "./GLMirrorPolygon";
export class GLPolyTile extends DisplayObject {
    constructor(position, maxSize, texture, grid) {
        super(position, maxSize);
        this._maxSize = maxSize.copy();
        this._scale = 1;
        this._showGrid = false;
        this.clearColor(0);
        this.setCacheAsCanvas(true);
        this._textureSelection = [new Point(0, 0), new Point(1, 0), new Point(1, 1)];
        this._glCanvas = new QDOrthoGLCanvas(this._size, vertexShader, fragmentShader, "u_matrix");
        this.updateGrid(GridStorage.SquareGrid);
        this.updateTexture(texture);
    }
    get renderCanvas() {
        return this._glCanvas.canvas;
    }
    setSelection(coords) {
        this._textureSelection = coords;
    }
    showGrid(val) {
        this._showGrid = val;
    }
    updateTexture(image) {
        this._texture = image;
        this._glCanvas.setTexture("u_texture", image);
    }
    updateGrid(grid) {
        this._grid = grid === undefined || !grid ? GridStorage.SquareGrid : grid;
        this.size = new Point(this._maxSize.x * this._scale * this._grid.edge_normalized_clipRect.width, this._maxSize.y * this._scale * this._grid.edge_normalized_clipRect.height);
        var viewSize = new Point(this._maxSize.x, this._maxSize.y * this._grid.normalized_clipRect.height);
        viewSize.scale(2);
        var polygonViewBoundingBox = new Point(this._grid.edge_normalized_clipRect.width, this._grid.edge_normalized_clipRect.height);
        this._glCanvas.setView(viewSize, polygonViewBoundingBox);
        this._polygons = [];
        for (var i = 0; i < this._grid.edge_normalized_polygons.length; ++i) {
            this._polygons.push(new GLMirrorPoly(this._grid.edge_normalized_polygons[i]));
        }
    }
    draw(context) {
        this.clear(context, true);
        if (this._texture) {
            this.drawPolygons();
            context.drawImage(this._glCanvas.canvas, 0, 0, this.size.x, this.size.y);
        }
        if (this._showGrid) {
            this.drawGrid(context);
        }
    }
    drawGrid(context) {
        context.beginPath();
        for (var i = 0; i < this._polygons.length; ++i) {
            context.strokeStyle = "#FF0000";
            context.setLineDash([0]);
            this._polygons[i].draw(context, false, this.size.x / this._grid.edge_normalized_clipRect.width);
        }
        context.stroke();
        context.beginPath();
        for (var i = 0; i < this._polygons.length; ++i) {
            context.strokeStyle = "#0000FF";
            context.setLineDash([5, 5]);
            this._polygons[i].drawFan(context, this.size.x / this._grid.edge_normalized_clipRect.width);
        }
        context.stroke();
    }
    drawPolygons() {
        this._glCanvas.glContext.clear(this._glCanvas.glContext.COLOR_BUFFER_BIT);
        for (var i = 0; i < this._polygons.length; ++i) {
            this.drawPolygon(this._polygons[i]);
        }
    }
    drawPolygon(poly) {
        this._glCanvas.setbuffer("a_position", poly.GLPoints(), 3);
        this._glCanvas.setbuffer("a_texcoord", poly.GLTexCoords(this._textureSelection), 2);
        this._glCanvas.render(this._glCanvas.glContext.TRIANGLE_FAN, poly.length + 2);
    }
    set scale(scale) {
        this._scale = scale;
        this.size = new Point(this._maxSize.x * this._scale * this._grid.edge_normalized_clipRect.width, this._maxSize.y * this._scale * this._grid.edge_normalized_clipRect.height);
    }
    patternRect(context, position, size, scale) {
        var pattern = context.createPattern(this._canvas, "repeat");
        context.rect(position.x, position.y, size.x, size.y);
        context.fillStyle = pattern;
        context.fill();
    }
    contains(pt) {
        return this.inBounds(pt);
    }
    destroy() {
        this._glCanvas.destroy();
    }
}
var vertexShader = `
attribute vec2 a_texcoord;
attribute vec4 a_position;

uniform mat4 u_matrix;

varying vec2 v_texcoord;

void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;

  // Pass the texcoord to the fragment shader.
  v_texcoord = a_texcoord;
}`;
var fragmentShader = `
precision mediump float;

// Passed in from the vertex shader.
varying vec2 v_texcoord;

// The texture.
uniform sampler2D u_texture;

void main() {
   gl_FragColor = texture2D(u_texture, v_texcoord);
}`;
//# sourceMappingURL=GLPolyTile.js.map