import { DomUtils } from "bj-utils";
import { Point } from "bj-utils";
import { DisplayObject } from "quick-canvas";
import { Polygon } from "quick-canvas";
export class PolygonTile extends DisplayObject {
    constructor(position, size, tileData) {
        super(position, size);
        this.once = true;
        this._baseSize = size.copy();
        if (typeof (tileData) === "string") {
            DomUtils.fetchJSONFile(tileData, this.setData);
        }
        else {
            this.setData(tileData);
        }
        this.setCacheAsCanvas(true);
    }
    setData(jsonData) {
        this.size.x = this._baseSize.x * jsonData.edge_normalized_clipRect.width;
        this.size.y = this._baseSize.y * jsonData.edge_normalized_clipRect.height;
        this._polygons = [];
        var transformPoly = (pts) => {
            let ptsOut = [];
            for (let i = 0; i < pts.length; ++i) {
                ptsOut[i] = new Point(pts[i].x * this.size.x, pts[i].y * this.size.x);
            }
            return ptsOut;
        };
        var polys = jsonData.normalized_polygons;
        for (var i = 0; i < polys.length; ++i) {
            var poly = new Polygon(transformPoly(polys[i]));
            this._polygons.push(poly);
        }
    }
    draw(context, fill) {
        this.clear(context, true);
        context.save();
        context.fillStyle = "#FFF";
        for (var i = 0; i < this._polygons.length; ++i) {
            context.beginPath();
            this._polygons[i].draw(context, false);
            if (fill)
                context.fill();
            context.stroke();
        }
        context.restore();
    }
    patternRect(context, position, size, fill) {
        this.draw(this.renderingContext, fill);
        const pattern = context.createPattern(this.canvas, "repeat");
        context.rect(position.x, position.y, size.x, size.y);
        context.fillStyle = pattern;
        context.fill();
    }
    saveImage(name) {
        DomUtils.downloadCanvasImage(this.canvas, name, "png");
    }
}
//# sourceMappingURL=polygonTile.js.map