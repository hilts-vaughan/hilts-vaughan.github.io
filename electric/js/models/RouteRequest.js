System.register(['./Point'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Point_1;
    var RouteRequest;
    return {
        setters:[
            function (Point_1_1) {
                Point_1 = Point_1_1;
            }],
        execute: function() {
            /**
             * A route request is something that ultimately is a transient control that
             * will eventually route requests to the server.
             */
            RouteRequest = (function () {
                function RouteRequest() {
                    this._start = new Point_1.Point(0, 0);
                    this._end = new Point_1.Point(0, 0);
                }
                Object.defineProperty(RouteRequest.prototype, "startingLocation", {
                    get: function () {
                        return this._start;
                    },
                    set: function (value) {
                        // Translate this into something usable
                        this._start = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RouteRequest.prototype, "endingLocation", {
                    get: function () {
                        return this._end;
                    },
                    set: function (value) {
                        // Translate this into something usable
                        this._end = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RouteRequest.prototype, "selectedModel", {
                    get: function () {
                        return this._model;
                    },
                    set: function (model) {
                        this._model = model;
                    },
                    enumerable: true,
                    configurable: true
                });
                RouteRequest.prototype.validate = function () {
                    return this._start.validate() && this._end.validate() && this._model != null;
                };
                // Because who wants to do real work :)
                RouteRequest.prototype.toJSON = function () {
                    return {
                        start: this._start.toJSON(),
                        end: this._end.toJSON(),
                        modelId: this._model.id
                    };
                };
                return RouteRequest;
            }());
            exports_1("RouteRequest", RouteRequest);
        }
    }
});
//# sourceMappingURL=RouteRequest.js.map