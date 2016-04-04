/**
 * Implements a material dropdown which enables us to be able to have elements
 * selected and changed at will.
 */
System.register(['angular2/core', '../models/RouteReceipt'], function(exports_1, context_1) {
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
    var core_1, RouteReceipt_1;
    var RouteResultsComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (RouteReceipt_1_1) {
                RouteReceipt_1 = RouteReceipt_1_1;
            }],
        execute: function() {
            RouteResultsComponent = (function () {
                function RouteResultsComponent(elementRef, renderer) {
                    this.elementRef = elementRef;
                    this.renderer = renderer;
                    this.routeReceipt = null;
                }
                RouteResultsComponent.prototype.exportResults = function () {
                    var BASE_URL = "https://www.google.ca/maps/dir/";
                    var sBuffer = "";
                    this.routeReceipt.all.forEach(function (point) {
                        sBuffer += point.toString();
                    });
                    // Open the results
                    window.open(BASE_URL + sBuffer.substring(1, sBuffer.length));
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', RouteReceipt_1.RouteReceipt)
                ], RouteResultsComponent.prototype, "routeReceipt", void 0);
                RouteResultsComponent = __decorate([
                    core_1.Component({
                        selector: 'route-results',
                        providers: [],
                        template: "\n    <div class=\"content-wrapper center-align\">\n      <h4 style=\"center\">Stops</h4>\n      <div id=\"route-results\">\n        <div class=\"content-wrapper\">\n        <ul class=\"collection grey darken-3\" style=\"border: none !important;\">\n          <li *ngFor=\"#result of routeReceipt?.waypointNames\" class=\"collection-item avatar grey darken-3\" style=\"border-bottom: 1px dashed lightgray !important;\">\n            <img src=\"img/marker.png\" alt=\"\" class=\"circle\">\n            <span class=\"title\">{{result[1]}}</span>\n            <p>{{result[0]}}<br>\n            </p>\n          </li>\n          <a style=\"margin-top: 8px\" *ngIf=\"routeReceipt != null\" (click)=\"exportResults()\" class=\"waves-effect waves-light btn center\">Export Route</a>\n        </ul>\n        </div>\n      </div>\n    </div>\n    "
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer])
                ], RouteResultsComponent);
                return RouteResultsComponent;
            }());
            exports_1("RouteResultsComponent", RouteResultsComponent);
        }
    }
});
//# sourceMappingURL=RouteResultsComponent.js.map