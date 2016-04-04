/**
 * Houses a map component.
 */
System.register(['angular2/core', 'angular2/http', '../models/RouteReceipt'], function(exports_1, context_1) {
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
    var core_1, http_1, RouteReceipt_1;
    var Map;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (RouteReceipt_1_1) {
                RouteReceipt_1 = RouteReceipt_1_1;
            }],
        execute: function() {
            Map = (function () {
                function Map(http) {
                    // The current map style object
                    this._mapStyle = {};
                    // This is used for
                    this.routeReceipt = null;
                    this._httpService = http;
                }
                Map.prototype.ngOnChanges = function (changes) {
                    var _this = this;
                    if (changes['routeReceipt']) {
                        if (this.routeReceipt != null) {
                            this._googleMap.cleanRoute();
                            this._googleMap.removeMarkers();
                            var start = this.routeReceipt.first;
                            var end = this.routeReceipt.last;
                            var options = {
                                origin: [start.lat, start.long],
                                destination: [end.lat, end.long],
                                waypoints: this._toWaypoints(this.routeReceipt.waypoints),
                                travelMode: 'driving',
                                strokeColor: '#131540',
                                strokeOpacity: 0.6,
                                strokeWeight: 6
                            };
                            this._googleMap.drawRoute(options);
                            this.routeReceipt.waypoints.forEach(function (waypoint) {
                                _this._googleMap.addMarker({
                                    lat: waypoint.lat,
                                    lng: waypoint.long,
                                    icon: 'img/marker.png',
                                    title: 'Charging Station'
                                });
                            });
                            // Special start and end
                            var x = [start, end].forEach(function (point) {
                                _this._googleMap.addMarker({
                                    lat: point.lat,
                                    lng: point.long,
                                    title: 'Location'
                                });
                            });
                            // Center the map on where we're going
                            this._googleMap.setCenter(start.lat, start.long);
                            var results = [];
                            this.routeReceipt.all.forEach(function (point) {
                                results.push(new window['google'].maps.LatLng(point.lat, point.long));
                            });
                            this._googleMap.fitLatLngBounds(results);
                        }
                    }
                };
                Map.prototype._toWaypoints = function (points) {
                    var results = [];
                    var x = 0;
                    var shortEnough = points.length < 9;
                    points.forEach(function (point) {
                        if (shortEnough || x % 2 == 0) {
                            var result = {
                                stopover: true,
                                location: new window['google'].maps.LatLng(point.lat, point.long),
                            };
                            results.push(result);
                        }
                        x++;
                    });
                    return results;
                };
                Map.prototype.ngAfterViewInit = function () {
                    var _this = this;
                    this._httpService.get('assets/styles.json')
                        .map(function (res) { return res.json(); })
                        .subscribe(function (error) { return _this._mapStyle = error; }, function (data) { return _this._mapStyle = data; }, function () {
                        _this._setupMap();
                    });
                };
                // MARK: Encapsulates the GMaps.js functionality
                Map.prototype._setupMap = function () {
                    var map = new window["GMaps"]({
                        div: '#map',
                        lat: 0,
                        lng: 0
                    });
                    // Save a reference to this map
                    this._googleMap = map;
                    map.addStyle({
                        styledMapName: "Styled Map",
                        styles: this._mapStyle['styles'],
                        mapTypeId: "default"
                    });
                    map.setStyle("default");
                    window['GMaps'].geolocate({
                        success: function (position) {
                            map.setCenter(position.coords.latitude, position.coords.longitude);
                        },
                        error: function (error) {
                            map.setCenter(-12.043333, -77.028333);
                        },
                        not_supported: function () {
                        },
                        always: function () {
                        }
                    });
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', RouteReceipt_1.RouteReceipt)
                ], Map.prototype, "routeReceipt", void 0);
                Map = __decorate([
                    core_1.Component({
                        selector: 'map',
                        providers: [http_1.HTTP_BINDINGS],
                        template: "\n    <div class=\"map-wrapper grey darken-2\">\n      <div id=\"map\">\n        <b>Your browser does not support Javascript.</b>\n      </div>\n    </div>\n  "
                    }), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], Map);
                return Map;
            }());
            exports_1("Map", Map);
        }
    }
});
//# sourceMappingURL=MapComponent.js.map