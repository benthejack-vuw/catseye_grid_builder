var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
System.register("error/data", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var DataError;
    return {
        setters:[],
        execute: function() {
            // Errors for converting from object data to explicit class objects.
            DataError = (function (_super) {
                __extends(DataError, _super);
                function DataError(className, message) {
                    _super.call(this, "Cannot convert from object to " + className + ": " + message);
                }
                return DataError;
            }(Error));
            exports_1("default", DataError);
        }
    }
});
System.register("geometry/point", ["error/data"], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
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
            exports_2("default", Point);
        }
    }
});
// Last updated November 2011
// By Simon Sarris
// www.simonsarris.com
// sarris@acm.org
//
// Free to use and distribute at will
// So long as you are nice to people, etc
System.register("util/Transform", ["geometry/point"], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var point_1;
    var Transform;
    return {
        setters:[
            function (point_1_1) {
                point_1 = point_1_1;
            }],
        execute: function() {
            Transform = (function () {
                function Transform() {
                    this.reset();
                }
                Transform.prototype.reset = function () {
                    this.m = [1, 0, 0, 1, 0, 0];
                };
                Transform.prototype.multiply = function (matrix) {
                    var m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
                    var m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];
                    var m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
                    var m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];
                    var dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
                    var dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];
                    this.m[0] = m11;
                    this.m[1] = m12;
                    this.m[2] = m21;
                    this.m[3] = m22;
                    this.m[4] = dx;
                    this.m[5] = dy;
                };
                ;
                Transform.prototype.invert = function () {
                    var d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
                    var m0 = this.m[3] * d;
                    var m1 = -this.m[1] * d;
                    var m2 = -this.m[2] * d;
                    var m3 = this.m[0] * d;
                    var m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
                    var m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
                    this.m[0] = m0;
                    this.m[1] = m1;
                    this.m[2] = m2;
                    this.m[3] = m3;
                    this.m[4] = m4;
                    this.m[5] = m5;
                };
                Transform.prototype.rotate = function (rad) {
                    var c = Math.cos(rad);
                    var s = Math.sin(rad);
                    var m11 = this.m[0] * c + this.m[2] * s;
                    var m12 = this.m[1] * c + this.m[3] * s;
                    var m21 = this.m[0] * -s + this.m[2] * c;
                    var m22 = this.m[1] * -s + this.m[3] * c;
                    this.m[0] = m11;
                    this.m[1] = m12;
                    this.m[2] = m21;
                    this.m[3] = m22;
                };
                Transform.prototype.translate = function (x, y) {
                    this.m[4] += this.m[0] * x + this.m[2] * y;
                    this.m[5] += this.m[1] * x + this.m[3] * y;
                };
                Transform.prototype.scale = function (sx, sy) {
                    this.m[0] *= sx;
                    this.m[1] *= sx;
                    this.m[2] *= sy;
                    this.m[3] *= sy;
                };
                Transform.prototype.transformPoint = function (pt) {
                    var tx = pt.x;
                    var ty = pt.y;
                    var px = tx * this.m[0] + ty * this.m[2] + this.m[4];
                    var py = tx * this.m[1] + ty * this.m[3] + this.m[5];
                    return new point_1["default"](px, py);
                };
                return Transform;
            }());
            exports_3("default", Transform);
        }
    }
});
