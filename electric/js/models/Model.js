System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Model;
    return {
        setters:[],
        execute: function() {
            Model = (function () {
                function Model(id, name, year) {
                    this._id = id;
                    this._name = name;
                    this._year = year;
                }
                Object.defineProperty(Model.prototype, "id", {
                    /**
                     * returns the id of the model
                     * @return {number}
                     */
                    get: function () {
                        return this._id;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Model.prototype, "name", {
                    /**
                     * returns the name of the model
                     * @return {string}
                     */
                    get: function () {
                        return this._name;
                    },
                    enumerable: true,
                    configurable: true
                });
                Model.prototype.toString = function () {
                    return this._name + " (" + this._year + ")";
                };
                return Model;
            }());
            exports_1("Model", Model);
        }
    }
});
//# sourceMappingURL=Model.js.map