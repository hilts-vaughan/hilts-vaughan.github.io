/**
 * This file is the main component which houses our two basic views on a high
 * level for getting things done. This will house mostly the InfoComponent
 * and the actual MapComponent for ourselves.
 */
System.register(['angular2/core'], function(exports_1, context_1) {
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
    var core_1;
    var MaterialPlacesAutocomplete;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            MaterialPlacesAutocomplete = (function () {
                function MaterialPlacesAutocomplete(elementRef, renderer) {
                    this.elementRef = elementRef;
                    this.renderer = renderer;
                    this.placeChanged = new core_1.EventEmitter();
                    this.labelText = "";
                }
                // Private rendering methods down below
                MaterialPlacesAutocomplete.prototype.ngAfterViewInit = function () {
                    var _this = this;
                    var rawElement = this.elementRef.nativeElement;
                    var element = window['$'](rawElement).find('input');
                    this._scope = new window['google'].maps.places.Autocomplete(element.get(0), {});
                    window['google'].maps.event.addListener(this._scope, 'place_changed', function () {
                        // Send the update to the listener
                        var place = _this._scope['getPlace']();
                        _this.sendUpdate(place.formatted_address);
                    });
                };
                // Notifies the user when an update is available
                MaterialPlacesAutocomplete.prototype.sendUpdate = function (value) {
                    this.placeChanged.emit(value);
                };
                Object.defineProperty(MaterialPlacesAutocomplete.prototype, "_raw", {
                    // Internal handling of events, isolated from the world
                    set: function (value) {
                        this.sendUpdate(value);
                    },
                    enumerable: true,
                    configurable: true
                });
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], MaterialPlacesAutocomplete.prototype, "placeChanged", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], MaterialPlacesAutocomplete.prototype, "labelText", void 0);
                MaterialPlacesAutocomplete = __decorate([
                    core_1.Component({
                        selector: 'places-input',
                        providers: [],
                        template: "\n    <div class=\"input-field col s12\">\n      <input [ngModel]=\"_raw\" placeholder=\"\" type=\"text\">\n      <label for=\"src\">{{labelText}}</label>\n    </div>\n    "
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer])
                ], MaterialPlacesAutocomplete);
                return MaterialPlacesAutocomplete;
            }());
            exports_1("MaterialPlacesAutocomplete", MaterialPlacesAutocomplete);
        }
    }
});
//# sourceMappingURL=MaterialPlacesAutocomplete.js.map