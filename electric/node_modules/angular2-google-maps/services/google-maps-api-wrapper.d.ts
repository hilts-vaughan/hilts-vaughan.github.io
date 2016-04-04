/**
 * angular2-google-maps - Angular 2 components for Google Maps
 * @version v0.9.0
 * @link https://github.com/SebastianM/angular2-google-maps#readme
 * @license MIT
 */
import { NgZone } from 'angular2/core';
import { Observable } from 'rxjs/Observable';
import { MapsAPILoader } from './maps-api-loader/maps-api-loader';
import * as mapTypes from './google-maps-types';
/**
 * Wrapper class that handles the communication with the Google Maps Javascript
 * API v3
 */
export declare class GoogleMapsAPIWrapper {
    private _loader;
    private _zone;
    private _map;
    private _mapResolver;
    constructor(_loader: MapsAPILoader, _zone: NgZone);
    createMap(el: HTMLElement, mapOptions: mapTypes.MapOptions): Promise<void>;
    setMapOptions(options: mapTypes.MapOptions): void;
    /**
     * Creates a google map marker with the map context
     */
    createMarker(options?: mapTypes.MarkerOptions): Promise<mapTypes.Marker>;
    createInfoWindow(options?: mapTypes.InfoWindowOptions): Promise<mapTypes.InfoWindow>;
    subscribeToMapEvent<E>(eventName: string): Observable<E>;
    setCenter(latLng: mapTypes.LatLngLiteral): Promise<void>;
    getZoom(): Promise<number>;
    setZoom(zoom: number): Promise<void>;
    getCenter(): Promise<mapTypes.LatLng>;
    getMap(): Promise<mapTypes.GoogleMap>;
    /**
     * Triggers the given event name on the map instance.
     */
    triggerMapEvent(eventName: string): Promise<void>;
}
