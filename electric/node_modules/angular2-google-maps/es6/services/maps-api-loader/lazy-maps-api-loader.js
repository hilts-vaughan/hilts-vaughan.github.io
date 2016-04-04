/**
 * angular2-google-maps - Angular 2 components for Google Maps
 * @version v0.9.0
 * @link https://github.com/SebastianM/angular2-google-maps#readme
 * @license MIT
 */
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
import { Injectable, Optional } from 'angular2/core';
import { MapsAPILoader } from './maps-api-loader';
export var GoogleMapsScriptProtocol;
(function (GoogleMapsScriptProtocol) {
    GoogleMapsScriptProtocol[GoogleMapsScriptProtocol["HTTP"] = 0] = "HTTP";
    GoogleMapsScriptProtocol[GoogleMapsScriptProtocol["HTTPS"] = 1] = "HTTPS";
    GoogleMapsScriptProtocol[GoogleMapsScriptProtocol["AUTO"] = 2] = "AUTO";
})(GoogleMapsScriptProtocol || (GoogleMapsScriptProtocol = {}));
export class LazyMapsAPILoaderConfig {
    constructor() {
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
}
const DEFAULT_CONFIGURATION = new LazyMapsAPILoaderConfig();
export let LazyMapsAPILoader = class LazyMapsAPILoader extends MapsAPILoader {
    constructor(_config) {
        super();
        this._config = _config;
        if (this._config === null || this._config === undefined) {
            this._config = DEFAULT_CONFIGURATION;
        }
    }
    load() {
        if (this._scriptLoadingPromise) {
            return this._scriptLoadingPromise;
        }
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.defer = true;
        const callbackName = `angular2googlemaps${new Date().getMilliseconds()}`;
        script.src = this._getScriptSrc(callbackName);
        this._scriptLoadingPromise = new Promise((resolve, reject) => {
            window[callbackName] = () => { resolve(); };
            script.onerror = (error) => { reject(error); };
        });
        document.body.appendChild(script);
        return this._scriptLoadingPromise;
    }
    _getScriptSrc(callbackName) {
        let protocolType = (this._config && this._config.protocol) || DEFAULT_CONFIGURATION.protocol;
        let protocol;
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
        const hostAndPath = this._config.hostAndPath || DEFAULT_CONFIGURATION.hostAndPath;
        const apiKey = this._config.apiKey || DEFAULT_CONFIGURATION.apiKey;
        const clientId = this._config.clientId || DEFAULT_CONFIGURATION.clientId;
        const libraries = this._config.libraries || DEFAULT_CONFIGURATION.libraries;
        const region = this._config.region || DEFAULT_CONFIGURATION.region;
        const language = this._config.language || DEFAULT_CONFIGURATION.language;
        const queryParams = {
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
        const params = Object.keys(queryParams)
            .map((k, i) => {
            let param = (i === 0) ? '?' : '&';
            return param += `${k}=${queryParams[k]}`;
        })
            .join('');
        return `${protocol}//${hostAndPath}${params}`;
    }
};
LazyMapsAPILoader = __decorate([
    Injectable(),
    __param(0, Optional()), 
    __metadata('design:paramtypes', [LazyMapsAPILoaderConfig])
], LazyMapsAPILoader);

//# sourceMappingURL=lazy-maps-api-loader.js.map
