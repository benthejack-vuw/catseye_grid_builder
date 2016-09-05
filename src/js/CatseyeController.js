System.register("geometry/point", ["../error/data"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var data_1;
    var Point;
    return {
        setters:[
            function (data_1_1) {
                data_1 = data_1_1;
            }],
        execute: function() {
            // Mutable point objects.
            Point = (function () {
                function Point(x, y) {
                    this.x = x;
                    this.y = y;
                }
                // Construct a point from an object containing x and y coordinates.
                Point.fromData = function (data) {
                    if (typeof data.x !== "number" || typeof data.y !== "number") {
                        throw new data_1["default"]("Point", "x and y must be numbers");
                    }
                    return new Point(data.x, data.y);
                };
                // Create a copy of this point.
                Point.prototype.copy = function () {
                    return new Point(this.x, this.y);
                };
                // Translate the position of this point in both directions by an amount.
                Point.prototype.move = function (amount) {
                    this.translate(amount, amount);
                };
                // Move this point to the given point.
                Point.prototype.moveTo = function (point) {
                    this.x = point.x;
                    this.y = point.y;
                };
                // Translate the position of this point by an x and y amount.
                Point.prototype.translate = function (x, y) {
                    this.x += x;
                    this.y += y;
                };
                // Scale the position of this point by an amount.
                Point.prototype.scale = function (amount) {
                    this.x *= amount;
                    this.y *= amount;
                };
                // Calculate the distance to another point.
                Point.prototype.distanceTo = function (point) {
                    return Math.sqrt(Math.pow(this.x - point.x, 2) +
                        Math.pow(this.y - point.y, 2));
                };
                // Calculate the offset from this point to another point as a vector.
                Point.prototype.offsetFrom = function (point) {
                    return new Point(this.x - point.x, this.y - point.y);
                };
                // Convert this point to a JSON string.
                Point.prototype.toData = function () {
                    return "{\"x\":" + this.x + ",\"y\":" + this.y + "}";
                };
                Point.prototype.toString = function () {
                    return "(" + this.x + ", " + this.y + ")";
                };
                return Point;
            }());
            exports_1("default", Point);
        }
    }
});
System.register("CatseyeController", ["geometry/point"], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var point_1;
    var CatseyeController;
    return {
        setters:[
            function (point_1_1) {
                point_1 = point_1_1;
            }],
        execute: function() {
            CatseyeController = (function () {
                function CatseyeController(canvas) {
                    this.canvas = canvas;
                    this._drawing_context = canvas.getContext("2d");
                    this._polyGridBuilder = new _PolyGridBuilder({ x: 0, y: 0 }, 60);
                    this._transformMatrix = new Transform();
                    this._interaction_manager = new InteractionManager(this._polyGridBuilder, canvas, "min/catseye_grid_interaction_definitions_file-min.json");
                    this._interaction_manager.start();
                    this._scale = 1.0;
                    this._rotation = 0;
                    this._position = new point_1["default"](canvas.width / 2, canvas.height / 2);
                    //this.addSlider(0.2, 2.0, 1.0, 0.1, this.setScale, "scale_slider");
                    //this.addSlider(0, Math.TWO_PI, 0, Math.TWO_PI/12.0, this.setRotation, "rotate_slider");
                    //this.addButton("save grid JSON", this.generateJSON, "save_json");
                    this.updateTransforms();
                }
                CatseyeController.prototype.updateTransforms = function () {
                    this._transformMatrix.reset();
                    this._transformMatrix.translate(this.position.x, this.position.y);
                    this._transformMatrix.scale(this.scale, this.scale);
                    this._transformMatrix.rotate(this.rotation);
                    this._transformMatrix.invert();
                    this._interaction_manager.set_TransformMatrix(this._transformMatrix);
                };
                Object.defineProperty(CatseyeController.prototype, "scale", {
                    set: function (i_scale) {
                        this.scale = i_scale;
                        this.updateTransforms();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CatseyeController.prototype, "rotation", {
                    set: function (i_rotation) {
                        this._rotation = i_rotation;
                        this.updateTransforms();
                    },
                    enumerable: true,
                    configurable: true
                });
                CatseyeController.prototype.draw = function () {
                    this._drawing_context.save();
                    this._drawing_context.translate(this._position.x, this._position.y);
                    this._drawing_context.scale(this._scale, this._scale);
                    this._drawing_context.rotate(this._rotation);
                    this._polyGridBuilder.draw(this._drawing_context);
                    this._drawing_context.restore();
                };
                CatseyeController.prototype.downloadJSON = function () {
                    this._polyGridBuilder.grid.normalize(this._polyGridBuilder.grid_repeat_selector.bounding_box());
                    var dataStr = "data:text/json;charset=utf-8," + this._polyGridBuilder.grid.to_JSON();
                    var dlAnchorElem = document.getElementById('downloadAnchorElem');
                    dlAnchorElem.setAttribute("href", dataStr);
                    dlAnchorElem.setAttribute("download", "scene.json");
                    dlAnchorElem.click();
                };
                CatseyeController.prototype.addSlider = function (min, max, value, step, callback, id) {
                    var newSlider = document.createElement("INPUT");
                    newSlider.setAttribute("id", id);
                    newSlider.setAttribute("type", "range");
                    newSlider.setAttribute("min", String(min));
                    newSlider.setAttribute("max", String(max));
                    newSlider.setAttribute("step", String(step));
                    newSlider.setAttribute("value", String(value));
                    newSlider.addEventListener("change", callback);
                    newSlider.addEventListener("input", callback);
                    document.getElementById("controls").appendChild(newSlider);
                };
                CatseyeController.prototype.addButton = function (text, callback, id) {
                    var newSlider = document.createElement("button");
                    newSlider.setAttribute("id", id);
                    newSlider.setAttribute("type", "button");
                    newSlider.innerHTML = text;
                    newSlider.addEventListener("click", callback);
                    document.getElementById("controls").appendChild(newSlider);
                };
                return CatseyeController;
            }());
            exports_2("default", CatseyeController);
        }
    }
});
