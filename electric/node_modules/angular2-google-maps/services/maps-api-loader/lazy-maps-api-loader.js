/**
 * angular2-google-maps - Angular 2 components for Google Maps
 * @version v0.9.0
 * @link https://github.com/SebastianM/angular2-google-maps#readme
 * @license MIT
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var core_1 = require('angular2/core');
var maps_api_loader_1 = require('./maps-api-loader');
(function (GoogleMapsScriptProtocol) {
    GoogleMapsScriptProtocol[GoogleMapsScriptProtocol["HTTP"] = 0] = "HTTP";
    GoogleMapsScriptProtocol[GoogleMapsScriptProtocol["HTTPS"] = 1] = "HTTPS";
    GoogleMapsScriptProtocol[GoogleMapsScriptProtocol["AUTO"] = 2] = "AUTO";
})(exports.GoogleMapsScriptProtocol || (exports.GoogleMapsScriptProtocol = {}));
var GoogleMapsScriptProtocol = exports.GoogleMapsScriptProtocol;
var LazyMapsAPILoaderConfig = (function () {
    function LazyMapsAPILoaderConfig() {
        /**
         * The Google Maps API Key (see:
         * https://developers.google.com/maps/documentation/javascript/get-api-key)
         */
        this.apiKey = null;
        /**
         * The Google Maps client ID (for premium plans).
         * When you have a Google Maps APIs Premium Plan license, you must authenticate
         * your application with either an API key or a client ID.
         * The Google Maps API will fail to load if both a client ID and an API key are included.
         */
        this.clientId = null;
        /**
         * Google Maps API version.
         */
        this.apiVersion = '3';
        /**
         * Host and Path used for the `<script>` tag.
         */
        this.hostAndPath = 'maps.googleapis.com/maps/api/js';
        /**
         * Protocol used for the `<script>` tag.
         */
        this.protocol = GoogleMapsScriptProtocol.HTTPS;
        /**
         * Defines which Google Maps libraries should get loaded.
         */
        this.libraries = [];
        /**
         * The default bias for the map behavior is US.
         * If you wish to alter your application to serve different map tiles or bias the
         * application, you can overwrite the default behavior (US) by defining a `region`.
         * See https://developers.google.com/maps/documentation/javascript/basics#Region
         */
        this.region = null;
        /**
         * The Google Maps API uses the browser's preferred language when displaying
         * textual information. If you wish to overwrite this behavior and force the API
         * to use a given language, you can use this setting.
         * See https://developers.google.com/maps/documentation/javascript/basics#Language
         */
        this.language = null;
    }
    return LazyMapsAPILoaderConfig;
}());
exports.LazyMapsAPILoaderConfig = LazyMapsAPILoaderConfig;
var DEFAULT_CONFIGURATION = new LazyMapsAPILoaderConfig();
var LazyMapsAPILoader = (function (_super) {
    __extends(LazyMapsAPILoader, _super);
    function LazyMapsAPILoader(_config) {
        _super.call(this);
        this._config = _config;
        if (this._config === null || this._config === undefined) {
            this._config = DEFAULT_CONFIGURATION;
        }
    }
    LazyMapsAPILoader.prototype.load = function () {
        if (this._scriptLoadingPromise) {
            return this._scriptLoadingPromise;
        }
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.defer = true;
        var callbackName = "angular2googlemaps" + new Date().getMilliseconds();
        script.src = this._getScriptSrc(callbackName);
        this._scriptLoadingPromise = new Promise(function (resolve, reject) {
            window[callbackName] = function () { resolve(); };
            script.onerror = function (error) { reject(error); };
        });
        document.body.appendChild(script);
        return this._scriptLoadingPromise;
    };
    LazyMapsAPILoader.prototype._getScriptSrc = function (callbackName) {
        var protocolType = (this._config && this._config.protocol) || DEFAULT_CONFIGURATION.protocol;
        var protocol;
        switch (protocolType) {
            case GoogleMapsScriptProtocol.AUTO:
                protocol = '';
                break;
            case GoogleMapsScriptProtocol.HTTP:
                protocol = 'http:';
                break;
            case GoogleMapsScriptProtocol.HTTPS:
                protocol = 'https:';
                break;
        }
        var hostAndPath = this._config.hostAndPath || DEFAULT_CONFIGURATION.hostAndPath;
        var apiKey = this._config.apiKey || DEFAULT_CONFIGURATION.apiKey;
        var clientId = this._config.clientId || DEFAULT_CONFIGURATION.clientId;
        var libraries = this._config.libraries || DEFAULT_CONFIGURATION.libraries;
        var region = this._config.region || DEFAULT_CONFIGURATION.region;
        var language = this._config.language || DEFAULT_CONFIGURATION.language;
        var queryParams = {
            v: this._config.apiVersion || DEFAULT_CONFIGURATION.apiVersion,
            callback: callbackName
        };
        if (apiKey) {
            queryParams['key'] = apiKey;
        }
        if (clientId) {
            queryParams['client'] = clientId;
        }
        if (libraries != null && libraries.length > 0) {
            queryParams['libraries'] = libraries.join(',');
        }
        if (region != null && region.length > 0) {
            queryParams['region'] = region;
        }
        if (language != null && language.length > 0) {
            queryParams['language'] = language;
        }
        var params = Object.keys(queryParams)
            .map(function (k, i) {
            var param = (i === 0) ? '?' : '&';
            return param += k + "=" + queryParams[k];
        })
            .join('');
        return protocol + "//" + hostAndPath + params;
    };
    LazyMapsAPILoader = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Optional()), 
        __metadata('design:paramtypes', [LazyMapsAPILoaderConfig])
    ], LazyMapsAPILoader);
    return LazyMapsAPILoader;
}(maps_api_loader_1.MapsAPILoader));
exports.LazyMapsAPILoader = LazyMapsAPILoader;

//# sourceMappingURL=lazy-maps-api-loader.js.map
