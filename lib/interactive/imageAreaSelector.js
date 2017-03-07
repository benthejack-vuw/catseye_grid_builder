import { Point } from "bj-utils";
import { DisplayObject } from "quick-canvas";
import { DraggableTriangle } from "quick-canvas";
export class ImageAreaSelector extends DisplayObject {
    constructor(image, displaySize, changeCallback) {
        let size;
        let scale;
        if (image.width > image.height) {
            scale = displaySize / image.width;
            size = new Point(displaySize, image.height * scale);
        }
        else {
            scale = displaySize / image.height;
            size = new Point(image.width * scale, displaySize);
        }
        super(new Point(displaySize / 2 - size.x / 2, displaySize / 2 - size.y / 2), size);
        this._changeCallback = changeCallback;
        this._unscaledImage = image;
    }
    addedToStage() {
        this._selector = new DraggableTriangle(new Point(0, 0), this._size);
        this.addChild(this._selector);
    }
    setTextureCoords(pts) {
        var out = [];
        for (var i = 0; i < pts.length; ++i) {
            const pt = new Point(pts[i].x, pts[i].y);
            var pt2 = pt.copy();
            pt2.x *= this.size.x;
            pt2.y *= this.size.y;
            this._selector.setPoint(i, pt2);
            out.push(pt);
        }
        this._changeCallback(out);
    }
    draw(context) {
        this.clear(context, true);
        context.drawImage(this._unscaledImage, 0, 0, this.size.x, this.size.y);
    }
    get selection() {
        let pts = [];
        for (var i = 0; i < this._selector.points.length; ++i) {
            pts.push(new Point(this._selector.points[i].x / this.size.x, this._selector.points[i].y / this.size.y));
        }
        return pts;
    }
    mouseDragged(data) {
        this._changeCallback(this.selection);
    }
    contains(pt) {
        return this.inBounds(pt);
    }
    forceUpdate() {
        this._changeCallback(this.selection);
    }
}
//# sourceMappingURL=imageAreaSelector.js.map