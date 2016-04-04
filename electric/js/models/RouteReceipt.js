System.register(['./Point'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Point_1;
    var RouteReceipt;
    return {
        setters:[
            function (Point_1_1) {
                Point_1 = Point_1_1;
            }],
        execute: function() {
            RouteReceipt = (function () {
                function RouteReceipt(results) {
                    var _this = this;
                    this._points = [];
                    this._info = [];
                    results.forEach(function (result) {
                        _this._points.push(new Point_1.Point(result[1], result[0]));
                        _this._info.push([result[2], result[3]]);
                    });
                }
                Object.defineProperty(RouteReceipt.prototype, "waypoints", {
                    get: function () {
                        return this._points.slice(1, this._points.length - 1);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RouteReceipt.prototype, "first", {
                    get: function () {
                        return this._points[0];
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RouteReceipt.prototype, "last", {
                    get: function () {
                        return this._points[this._points.length - 1];
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RouteReceipt.prototype, "all", {
                    get: function () {
                        return this._points;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RouteReceipt.prototype, "waypointNames", {
                    /*
                      Slices the way point names
                     */
                    get: function () {
                        return this._info.slice(1, this._points.length - 1);
                    },
                    enumerable: true,
                    configurable: true
                });
                return RouteReceipt;
            }());
            exports_1("RouteReceipt", RouteReceipt);
        }
    }
});
//# sourceMappingURL=RouteReceipt.js.map