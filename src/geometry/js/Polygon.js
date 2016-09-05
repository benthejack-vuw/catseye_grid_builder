System.register("Polygon", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Polygon;
    return {
        setters:[],
        execute: function() {
            Polygon = (function () {
                function Polygon(vertex_array) {
                    this.create_edges = function (vertex_function) {
                        for (var i = 0; i < this.length; ++i) {
                            var pt1 = this.vertex_at_index(i, vertex_function);
                            var pt2 = this.vertex_at_index(i + 1, vertex_function);
                            this._edges[i] = new InteractiveLine(pt1, pt2);
                        }
                    };
                    this.is_under = function (pt) {
                        var wn = 0;
                        // loop through all edges of the ptolygon
                        for (var i = 0; i < this._edges.length; ++i) {
                            if (this._edges[i][0].y <= pt.y) {
                                if (this._edges[i][1].y > pt.y) {
                                    if (this._edges[i].isLeft(pt) > 0) {
                                        ++wn;
                                    }
                                } // have  a valid up intersect
                            }
                            else {
                                if (this._edges[i][1].y <= pt.y) {
                                    if (this._edges[i].isLeft(pt) < 0) {
                                        --wn; // have  a valid down intersect
                                    }
                                }
                            }
                        }
                        return wn > 0;
                    };
                    this.contains_point = function (pt, tolerance) {
                        tolerance = tolerance === undefined ? 0 : tolerance;
                        return Math.dist(pt.x, pt.y, this._centroid.x, this._centroid.y) < (this.radius + tolerance);
                    };
                    this.closest_edge = function (pt) {
                        var min_dist = Number.MAX_SAFE_INTEGER;
                        var closest = null;
                        for (var i = 0; i < this._edges.length; ++i) {
                            var dist = this._edges[i].distance_from(pt);
                            if (dist < min_dist) {
                                closest = this._edges[i];
                                min_dist = dist;
                            }
                        }
                        return closest;
                    };
                    this.draw = function (context, close) {
                        var verts = this._vertices.length;
                        if (close) {
                            context.beginPath();
                        }
                        context.moveTo(this._vertices[0].x, this._vertices[0].y);
                        for (var i = 1; i <= verts; ++i) {
                            context.lineTo(this._vertices[i % verts].x, this._vertices[i % verts].y);
                        }
                        if (close) {
                            context.closePath();
                            context.fill();
                            context.stroke();
                        }
                    };
                    this.to_vertex_position_array = function () {
                        var out = [];
                        for (var i = 0; i < this._vertices.length; ++i) {
                            out.push({
                                x: +this._vertices[i].x.toFixed(3),
                                y: +this._vertices[i].y.toFixed(3)
                            });
                        }
                        return out;
                    };
                    this.generate_inner_grid = function (resolution) {
                        var center = this.calculate_centroid();
                        var pts = [center];
                        pts = pts.concat(this._vertices);
                        for (var i = 0; i < this._vertices.length; i++) {
                            var curr = this._vertices[i];
                            var next = this._vertices[(i + 1) % this._vertices.length];
                            for (var j = 1; j < resolution; j++) {
                                var t = j * (1 / (resolution));
                                pts.push({ x: Math.lerp(curr.x, center.x, t), y: Math.lerp(curr.y, center.y, t) });
                                pts.push({ x: Math.lerp(curr.x, next.x, t), y: Math.lerp(curr.y, next.y, t) });
                            }
                        }
                        return pts;
                    };
                    this.calculate_centroid = function () {
                        var x_total = 0;
                        var y_total = 0;
                        for (var i = 0; i < this._vertices.length; ++i) {
                            x_total += this._vertices[i].x;
                            y_total += this._vertices[i].y;
                        }
                        return { x: x_total / this.length, y: y_total / this.length };
                    };
                    this.inside = function (bounding_box) {
                        for (var i = 0; i < this._vertices.length; i++) {
                            if (bounding_box.contains_point(this._vertices[i])) {
                                return true;
                            }
                        }
                        return false;
                    };
                    this.normalized_points = function (bounding_box) {
                        var pts = [];
                        for (var i = 0; i < this._vertices.length; i++) {
                            var x_out = +((this._vertices[i].x - bounding_box[0].x) / bounding_box.width()).toFixed(6);
                            var y_out = +((this._vertices[i].y - bounding_box[0].y) / bounding_box.width()).toFixed(6);
                            pts.push({ x: x_out,
                                y: y_out
                            });
                        }
                        return pts;
                    };
                    this.completely_inside = function (bounding_box) {
                        for (var i = 0; i < this._vertices.length; i++) {
                            if (!bounding_box.contains_point(this._vertices[i])) {
                                return false;
                            }
                        }
                        return true;
                    };
                    this._vertices = [];
                    this._edges = [];
                    this._centroid = null;
                    this._radius = 0;
                    if (vertex_array !== undefined) {
                        this.initialize_from_array(vertex_array);
                    }
                }
                Object.defineProperty(Polygon.prototype, "length", {
                    get: function () {
                        return this._length;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Polygon.prototype, "radius", {
                    get: function () {
                        return this._radius;
                    },
                    enumerable: true,
                    configurable: true
                });
                Polygon.prototype.initialize_from_array = function (points) {
                    this.empty();
                    //vertex function to be passed into create_edges
                    var verts_from_array = function (i) {
                        var x_pos = points[i].x;
                        var y_pos = points[i].y;
                        return new Point(x_pos, y_pos);
                    };
                    this._length = points.length;
                    this.create_edges(verts_from_array);
                    this._centroid = this.calculate_centroid();
                    this._radius = Math.dist(points[0].x, points[0].y, this._centroid.x, this._centroid.y);
                };
                ;
                //---------------------------HELPER FUNCTIONS------------------------------------------------
                Polygon.prototype.empty = function () {
                    this._vertices = [];
                    this._edges = [];
                    this._centroid = null;
                };
                ;
                //vertex_from_index takes the index of the point (zero indexed) 
                //it returns the P5js Vector at that index or creates it if it doesn't yet exist
                Polygon.prototype.vertex_at_index = function (i, vertex_function) {
                    if (this._vertices[i % this.length]) {
                        return this._vertices[i % this.length];
                    }
                    else {
                        var pt = vertex_function(this, i);
                        this._vertices[i % this.length] = pt;
                        return pt;
                    }
                };
                ;
                return Polygon;
            }());
            exports_1("default", Polygon);
        }
    }
});
