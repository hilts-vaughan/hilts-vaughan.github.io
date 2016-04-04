System.register(['angular2/core', './ServiceConfig', 'angular2/http', '../models/Car', '../models/Model'], function(exports_1, context_1) {
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
    var core_1, ServiceConfig_1, http_1, Car_1, Model_1;
    var CarService;
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
            function (Car_1_1) {
                Car_1 = Car_1_1;
            },
            function (Model_1_1) {
                Model_1 = Model_1_1;
            }],
        execute: function() {
            CarService = (function () {
                function CarService(http) {
                    this.http = http;
                }
                /**
                 * Fetches all cars from a remote server and then submits them.
                 * A callback is returned either way, containing the error or cars.
                 * @return {[type]} [description]
                 */
                CarService.prototype.fetchAllCars = function (callback) {
                    this.http.get(ServiceConfig_1.ServiceConfig.SERVER_URL + "/cars").map(function (res) { return res.json(); }).subscribe(function (data) {
                        var collection = [];
                        data.cars.forEach(function (car) {
                            collection.push(new Car_1.Car(car.id, car.name));
                        });
                        callback(collection);
                    }, function (error) { return callback(null); });
                };
                CarService.prototype.fetchAllCarModelsForCar = function (car, callback) {
                    var params = JSON.stringify({ id: car.id });
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    this.http.post(ServiceConfig_1.ServiceConfig.SERVER_URL + "/cars/model", "", { headers: headers, body: params }).map(function (res) { return res.json(); }).subscribe(function (data) {
                        var collection = [];
                        data.models.forEach(function (model) {
                            collection.push(new Model_1.Model(model.model_id, model.name, model.year));
                        });
                        callback(collection);
                    }, function (error) { return callback(null); });
                };
                CarService.prototype.getConnectionsForModel = function (model, callback) {
                };
                CarService = __decorate([
                    __param(0, core_1.Inject(http_1.Http)), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], CarService);
                return CarService;
            }());
            exports_1("CarService", CarService);
        }
    }
});
//# sourceMappingURL=CarService.js.map