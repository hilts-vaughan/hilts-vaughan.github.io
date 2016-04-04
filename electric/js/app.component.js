/**
 * This file is the main component which houses our two basic views on a high
 * level for getting things done. This will house mostly the InfoComponent
 * and the actual MapComponent for ourselves.
 */
System.register(['angular2/core', './components/MapComponent', './components/RoutePaneComponent', './services/SearchService', './components/RouteResultsComponent'], function(exports_1, context_1) {
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
    var core_1, MapComponent_1, RoutePaneComponent_1, SearchService_1, RouteResultsComponent_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (MapComponent_1_1) {
                MapComponent_1 = MapComponent_1_1;
            },
            function (RoutePaneComponent_1_1) {
                RoutePaneComponent_1 = RoutePaneComponent_1_1;
            },
            function (SearchService_1_1) {
                SearchService_1 = SearchService_1_1;
            },
            function (RouteResultsComponent_1_1) {
                RouteResultsComponent_1 = RouteResultsComponent_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(searchService) {
                    this.searchService = searchService;
                    this._search = false;
                }
                AppComponent.prototype.showModal = function (title, text) {
                    var $ = window['$'];
                    $('#modal-title').text(title);
                    $('#modal-text').text(text);
                    $('#modal1').openModal();
                };
                AppComponent.prototype.beginSearch = function (request) {
                    var _this = this;
                    var isValid = request.validate();
                    // TODO: Spawn a proper modal to make things look less shitty
                    if (!isValid) {
                        this.showModal("Error", "Please be sure to fill in all the fields.");
                        return;
                    }
                    this._search = true;
                    this.searchService.performSearchWithRequest(request, function (receipt) {
                        if (receipt != null) {
                            _this._receipt = receipt;
                        }
                        else {
                            _this.showModal("Error", "No route could be found. It's likely your range is too far or there are not enough charging stations.");
                        }
                        _this._search = false;
                    });
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        directives: [MapComponent_1.Map, RoutePaneComponent_1.Pane, RouteResultsComponent_1.RouteResultsComponent],
                        providers: [SearchService_1.SearchService],
                        template: "\n    <!-- Page Layout here -->\n    <div class=\"row grey darken-3\">\n      <div class=\"col s12 m5 l3 grey darken-3\">\n        <pane [search]=\"_search\" (searchInvoked)=\"beginSearch($event)\"></pane>\n        <route-results [routeReceipt]=\"_receipt\"></route-results>\n      </div>\n      <div class=\"full-height col s12 m7 l9 grey darken-3\" style=\"overflow-y: hidden\">\n        <map [routeReceipt]=\"_receipt\">\n        </map>\n      </div>\n    </div>\n\n    <!-- Modal Structure -->\n    <div id=\"modal1\" class=\"modal\">\n      <div class=\"modal-content\">\n        <h4 id=\"modal-title\">Modal Header</h4>\n        <p id=\"modal-text\">A bunch of text</p>\n      </div>\n      <div class=\"modal-footer\">\n        <a href=\"#!\" class=\" modal-action modal-close waves-effect waves-grey btn-flat\">OK</a>\n      </div>\n    </div>\n    "
                    }), 
                    __metadata('design:paramtypes', [SearchService_1.SearchService])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map