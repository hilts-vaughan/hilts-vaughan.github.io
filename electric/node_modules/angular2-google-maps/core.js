/**
 * angular2-google-maps - Angular 2 components for Google Maps
 * @version v0.9.0
 * @link https://github.com/SebastianM/angular2-google-maps#readme
 * @license MIT
 */
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var core_1 = require('angular2/core');
var maps_api_loader_1 = require('./services/maps-api-loader/maps-api-loader');
var lazy_maps_api_loader_1 = require('./services/maps-api-loader/lazy-maps-api-loader');
// main modules
__export(require('./directives'));
__export(require('./services'));
exports.ANGULAR2_GOOGLE_MAPS_PROVIDERS = [
    new core_1.Provider(maps_api_loader_1.MapsAPILoader, { useClass: lazy_maps_api_loader_1.LazyMapsAPILoader }),
];

//# sourceMappingURL=core.js.map
