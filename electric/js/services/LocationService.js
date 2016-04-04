System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var LocationService;
    return {
        setters:[],
        execute: function() {
            /**
             * Provides services for locations and getting their information.
             */
            LocationService = (function () {
                function LocationService() {
                    this.options = Object.freeze({
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0
                    });
                }
                /**
                 * Gets the users current position via callback from the location device API.
                 * If the user is not willing to give this information, then it falls back
                 * and just returns null in the callback.
                 * @param  {Function} callback [The callback that will be invoked once the
                 * function has finished running.
                 */
                LocationService.prototype.getCurrentPositionForUser = function (callback) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        callback(position);
                    }, function () {
                        callback(null);
                    }, this.options);
                };
                return LocationService;
            }());
            exports_1("LocationService", LocationService);
        }
    }
});
//# sourceMappingURL=LocationService.js.map