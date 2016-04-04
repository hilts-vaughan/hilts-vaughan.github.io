System.register(['angular2/core', './ServiceConfig', 'angular2/http', '../models/RouteReceipt'], function(exports_1, context_1) {
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
    var core_1, ServiceConfig_1, http_1, RouteReceipt_1;
    var SearchService;
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
            function (RouteReceipt_1_1) {
                RouteReceipt_1 = RouteReceipt_1_1;
            }],
        execute: function() {
            SearchService = (function () {
                function SearchService(http) {
                    this.http = http;
                    // empty on purpose, used soley for DI
                }
                SearchService.prototype.performSearchWithRequest = function (request, callback) {
                    var params = JSON.stringify(request.toJSON());
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    this.http.post(ServiceConfig_1.ServiceConfig.SERVER_URL + "/route/search", "", { headers: headers, body: params }).map(function (res) { return res.json(); }).subscribe(function (data) {
                        if (data.Waypoints != null) {
                            callback(new RouteReceipt_1.RouteReceipt(data.Waypoints));
                        }
                        else {
                            callback(null);
                        }
                    }, function (error) {
                        callback(null);
                    });
                };
                SearchService = __decorate([
                    __param(0, core_1.Inject(http_1.Http)), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], SearchService);
                return SearchService;
            }());
            exports_1("SearchService", SearchService);
        }
    }
});
//# sourceMappingURL=SearchService.js.map