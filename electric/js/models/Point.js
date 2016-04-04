System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Point;
    return {
        setters:[],
        execute: function() {
            /**
             * A basic point that is used for longitude and latitude. Used to store the location
             * in such a way is sane.
             */
            Point = (function () {
                function Point(long, lat) {
                    this.long = long;
                    this.lat = lat;
                }
                Point.prototype.validate = function () {
                    return this.long != 0 && this.lat != 0;
                };
                Point.prototype.toJSON = function () {
                    return {
                        long: this.long,
                        lat: this.lat
                    };
                };
                Point.prototype.toString = function () {
                    return "/'" + this.lat + "," + this.long + "'";
                };
                return Point;
            }());
            exports_1("Point", Point);
        }
    }
});
//# sourceMappingURL=Point.js.map