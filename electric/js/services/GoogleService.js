System.register(['angular2/core', './ServiceConfig', 'angular2/http', '../models/Point'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = (this && this.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };
    var core_1, ServiceConfig_1, http_1, Point_1;
    var GoogleService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (ServiceConfig_1_1) {
                ServiceConfig_1 = ServiceConfig_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (Point_1_1) {
                Point_1 = Point_1_1;
            }],
        execute: function() {
            GoogleService = (function () {
                function GoogleService(http) {
                    this.http = http;
                }
                /**
                 * Gets a point from the address string given
                 * @param  {String} address [description]
                 * @return {[type]}         [description]
                 */
                GoogleService.prototype.getPointFromAddressString = function (address, callback) {
                    var GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(address) + "+CA&key=" + ServiceConfig_1.ServiceConfig.API_KEY;
                    this.http.get(GEOCODE_URL).map(function (res) { return res.json(); }).subscribe(function (data) {
                        var point = data.results[0].geometry.location;
                        callback(new Point_1.Point(point.lng, point.lat));
                    });
                };
                // This may require implementing to get everything down to spec
                GoogleService.prototype._scrubPointFromGeometry = function () {
                };
                GoogleService = __decorate([
                    __param(0, core_1.Inject(http_1.Http)), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], GoogleService);
                return GoogleService;
            }());
            exports_1("GoogleService", GoogleService);
        }
    }
});
//# sourceMappingURL=GoogleService.js.map