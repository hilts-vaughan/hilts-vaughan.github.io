System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Car;
    return {
        setters:[],
        execute: function() {
            Car = (function () {
                function Car(id, name) {
                    this._id = id;
                    this._name = name;
                }
                Object.defineProperty(Car.prototype, "id", {
                    /**
                     * returns the id of the car
                     * @return {number}
                     */
                    get: function () {
                        return this._id;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Car.prototype, "name", {
                    /**
                     * returns the name of the car
                     * @return {string}
                     */
                    get: function () {
                        return this._name;
                    },
                    enumerable: true,
                    configurable: true
                });
                Car.prototype.toString = function () {
                    return this._name;
                };
                return Car;
            }());
            exports_1("Car", Car);
        }
    }
});
//# sourceMappingURL=Car.js.map