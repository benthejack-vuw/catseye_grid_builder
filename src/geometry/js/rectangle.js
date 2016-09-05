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
System.register("geometry/rectangle", ["geometry/point", "error/data"], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var point_1, data_2;
    var Rectangle;
    return {
        setters:[
            function (point_1_1) {
                point_1 = point_1_1;
            },
            function (data_2_1) {
                data_2 = data_2_1;
            }],
        execute: function() {
            // Mutable rectangle objects.
            Rectangle = (function () {
                function Rectangle(x, y, width, height) {
                    this.width = width;
                    this.height = height;
                    this.topLeft = new point_1["default"](x, y);
                }
                Rectangle.fromData = function (data) {
                    if (!data.x || !data.y || !data.width || !data.height) {
                        throw new data_2["default"]("Rectangle", "must have x, y, width, and height as numbers");
                    }
                    return new Rectangle(data.x, data.y, data.width, data.height);
                };
                Object.defineProperty(Rectangle.prototype, "x", {
                    get: function () {
                        return this.topLeft.x;
                    },
                    set: function (x) {
                        this.topLeft.x = x;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Rectangle.prototype, "y", {
                    get: function () {
                        return this.topLeft.y;
                    },
                    set: function (y) {
                        this.topLeft.y = y;
                    },
                    enumerable: true,
                    configurable: true
                });
                // Create a copy of this rectangle.
                Rectangle.prototype.copy = function () {
                    return new Rectangle(this.x, this.y, this.width, this.height);
                };
                // Translate the position of this rectangle in both directions by an amount.
                Rectangle.prototype.move = function (amount) {
                    this.topLeft.move(amount);
                };
                // Translate the position of this rectangle by an x and y amount.
                Rectangle.prototype.translate = function (x, y) {
                    this.topLeft.translate(x, y);
                };
                // Scale the position and size of this rectangle by an amount.
                Rectangle.prototype.scale = function (amount) {
                    this.topLeft.scale(amount);
                    this.width *= amount;
                    this.height *= amount;
                };
                Object.defineProperty(Rectangle.prototype, "area", {
                    // Calculate the area of this rectangle.
                    get: function () {
                        return this.width * this.height;
                    },
                    enumerable: true,
                    configurable: true
                });
                // Determine if this rectangle contains a given point.
                Rectangle.prototype.contains = function (point) {
                    return point.x >= this.x &&
                        point.y >= this.y &&
                        point.x <= this.x + this.width &&
                        point.y <= this.y + this.height;
                };
                //normalize the bounding box so that it's width is 1 and its height maintains the correct proportion to it's width
                Rectangle.prototype.normalize = function () {
                    var ratio = this.height / this.width;
                    this.x = 0;
                    this.y = 0;
                    this.width = 1;
                    this.height = ratio;
                    return this;
                };
                ;
                // Convert this rectangle to a JSON string.
                Rectangle.prototype.toData = function () {
                    return ("{\"x\":" + this.x + ",\"y\":" + this.y) +
                        ("\"width\":" + this.width + ",\"height\":" + this.height + "}");
                };
                Rectangle.prototype.toString = function () {
                    return ("Rectangle{\"x\": " + this.x + ", \"y\": " + this.y) +
                        ("\"width\": " + this.width + ", \"height\": " + this.height + "}");
                };
                return Rectangle;
            }());
            exports_3("default", Rectangle);
        }
    }
});
