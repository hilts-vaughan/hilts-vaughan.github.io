System.register(['angular2/core', '../models/RouteRequest', './MaterialPlacesAutocomplete', './DropdownComponent', '../services/CarService', '../services/GoogleService'], function(exports_1, context_1) {
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
    var core_1, RouteRequest_1, MaterialPlacesAutocomplete_1, DropdownComponent_1, CarService_1, GoogleService_1;
    var Pane;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (RouteRequest_1_1) {
                RouteRequest_1 = RouteRequest_1_1;
            },
            function (MaterialPlacesAutocomplete_1_1) {
                MaterialPlacesAutocomplete_1 = MaterialPlacesAutocomplete_1_1;
            },
            function (DropdownComponent_1_1) {
                DropdownComponent_1 = DropdownComponent_1_1;
            },
            function (CarService_1_1) {
                CarService_1 = CarService_1_1;
            },
            function (GoogleService_1_1) {
                GoogleService_1 = GoogleService_1_1;
            }],
        execute: function() {
            Pane = (function () {
                function Pane(carService, googleService) {
                    var _this = this;
                    this.carService = carService;
                    this.googleService = googleService;
                    this.searchRequest = new RouteRequest_1.RouteRequest();
                    this.carCollection = [];
                    this.modelCollection = [];
                    // A handler for invoked search handlers
                    this.searchInvoked = new core_1.EventEmitter();
                    // Fetch the cars
                    carService.fetchAllCars(function (cars) {
                        _this.carCollection = cars;
                    });
                }
                Pane.prototype.makeSelected = function (index) {
                    var _this = this;
                    var carMake = this.carCollection[index];
                    // Now, populate the make service with the new items
                    this.carService.fetchAllCarModelsForCar(carMake, function (models) {
                        _this.modelCollection = models;
                    });
                };
                Pane.prototype.modelSelected = function (index) {
                    this.searchRequest.selectedModel = this.modelCollection[index];
                };
                Pane.prototype.placeChanged = function (place) {
                    var _this = this;
                    this.googleService.getPointFromAddressString(place, function (point) {
                        _this.searchRequest.startingLocation = point;
                    });
                };
                Pane.prototype.placeChangedEnd = function (place) {
                    var _this = this;
                    this.googleService.getPointFromAddressString(place, function (point) {
                        _this.searchRequest.endingLocation = point;
                    });
                };
                // ngAfterContentInit is used to initialize the component inside
                // for the fancy selections
                Pane.prototype.ngAfterContentInit = function () {
                    window['$']('select').material_select();
                };
                Pane.prototype.beginSearch = function () {
                    this.searchInvoked.emit(this.searchRequest);
                };
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], Pane.prototype, "searchInvoked", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], Pane.prototype, "search", void 0);
                Pane = __decorate([
                    core_1.Component({
                        selector: 'pane',
                        directives: [MaterialPlacesAutocomplete_1.MaterialPlacesAutocomplete, DropdownComponent_1.DropdownComponent],
                        providers: [CarService_1.CarService, GoogleService_1.GoogleService],
                        template: "\n    <div id=\"info-pane\">\n    <div class=\"content-wrapper center-align\">\n      <h4 style=\"center\">Plan Route</h4>\n      <form>\n      <div class=\"row center-align\">\n         <form class=\"col s12\">\n           <div class=\"row\">\n             <places-input labelText=\"Start\" (placeChanged)=\"placeChanged($event)\" ></places-input>\n             <places-input labelText=\"Destination\" (placeChanged)=\"placeChangedEnd($event)\" ></places-input>\n             <dropdown [collection]=\"carCollection\" labelText=\"Car Make\" (optionSelected)=\"makeSelected($event)\"></dropdown>\n             <dropdown [collection]=\"modelCollection\" labelText=\"Car Model\" (optionSelected)=\"modelSelected($event)\"></dropdown>\n           </div>\n         </form>\n         <a *ngIf=\"!search\" (click)=\"beginSearch()\" class=\"waves-effect waves-light btn center\">Search</a>\n         <div *ngIf=\"search\">\n           <div class=\"progress\">\n                <div class=\"indeterminate\"></div>\n            </div>\n         </div>\n       </div>\n      </form>\n    </div>\n    </div>\n  "
                    }), 
                    __metadata('design:paramtypes', [CarService_1.CarService, GoogleService_1.GoogleService])
                ], Pane);
                return Pane;
            }());
            exports_1("Pane", Pane);
        }
    }
});
//# sourceMappingURL=RoutePaneComponent.js.map