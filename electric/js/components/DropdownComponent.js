/**
 * Implements a material dropdown which enables us to be able to have elements
 * selected and changed at will.
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
    var DropdownComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            DropdownComponent = (function () {
                function DropdownComponent(elementRef, renderer) {
                    this.elementRef = elementRef;
                    this.renderer = renderer;
                    this.optionSelected = new core_1.EventEmitter();
                    this.labelText = "";
                    this.collection = [];
                }
                // Private rendering methods down below, trying to avoid anything crazy
                DropdownComponent.prototype.ngAfterViewInit = function () {
                    // Invoke the material select life on it
                    this._bind();
                };
                DropdownComponent.prototype.ngOnChanges = function () {
                    this._bind();
                };
                DropdownComponent.prototype._bind = function () {
                    var _this = this;
                    var rawElement = this.elementRef.nativeElement;
                    var element = window['$'](rawElement).find('select');
                    // This hack is required since there's no guarentee that the options
                    // will have been updated in time for the list to be changed
                    window.setTimeout(function () {
                        element.material_select();
                        window['$'](rawElement).find("span").click(function (event) {
                            var index = window['$'](event.target).parent().index();
                            if (index > 0) {
                                _this.optionSelected.emit(index - 1); // don't keep the default option
                            }
                        });
                    }, 500);
                };
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], DropdownComponent.prototype, "optionSelected", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], DropdownComponent.prototype, "labelText", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], DropdownComponent.prototype, "collection", void 0);
                DropdownComponent = __decorate([
                    core_1.Component({
                        selector: 'dropdown',
                        providers: [],
                        template: "\n    <div class=\"input-field col s12\">\n      <select>\n        <option selected disabled value=\"-1\">Select an option</option>\n        <option *ngFor=\"#item of collection\">{{item}}</option>\n      </select>\n      <label>{{labelText}}</label>\n    </div>\n    "
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer])
                ], DropdownComponent);
                return DropdownComponent;
            }());
            exports_1("DropdownComponent", DropdownComponent);
        }
    }
});
//# sourceMappingURL=DropdownComponent.js.map