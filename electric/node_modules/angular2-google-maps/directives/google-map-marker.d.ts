/**
 * angular2-google-maps - Angular 2 components for Google Maps
 * @version v0.9.0
 * @link https://github.com/SebastianM/angular2-google-maps#readme
 * @license MIT
 */
import { SimpleChange, OnDestroy, OnChanges, EventEmitter, AfterContentInit } from 'angular2/core';
import { MarkerManager } from '../services/marker-manager';
import { MouseEvent } from '../events';
/**
 * SebmGoogleMapMarker renders a map marker inside a {@link SebmGoogleMap}.
 *
 * ### Example
 * ```typescript
 * import {Component} from 'angular2/core';
 * import {SebmGoogleMap, SebmGoogleMapMarker} from 'angular2-google-maps/core';
 *
 * @Component({
 *  selector: 'my-map-cmp',
 *  directives: [SebmGoogleMap, SebmGoogleMapMarker],
 *  styles: [`
 *    .sebm-google-map-container {
 *      height: 300px;
 *    }
 * `],
 *  template: `
 *    <sebm-google-map [latitude]="lat" [longitude]="lng" [zoom]="zoom">
 *      <sebm-google-map-marker [latitude]="lat" [longitude]="lng" [label]="'M'">
 *      </sebm-google-map-marker>
 *    </sebm-google-map>
 *  `
 * })
 * ```
 */
export declare class SebmGoogleMapMarker implements OnDestroy, OnChanges, AfterContentInit {
    private _markerManager;
    /**
     * The latitude position of the marker.
     */
    latitude: number;
    /**
     * The longitude position of the marker.
     */
    longitude: number;
    /**
     * The title of the marker.
     */
    title: string;
    /**
     * The label (a single uppercase character) for the marker.
     */
    label: string;
    /**
     * If true, the marker can be dragged. Default value is false.
     */
    draggable: boolean;
    /**
     * Icon (the URL of the image) for the foreground.
     */
    iconUrl: string;
    /**
     * This event emitter gets emitted when the user clicks on the marker.
     */
    markerClick: EventEmitter<void>;
    /**
     * This event is fired when the user stops dragging the marker.
     */
    dragEnd: EventEmitter<MouseEvent>;
    private _infoWindow;
    private _markerAddedToManger;
    private _id;
    constructor(_markerManager: MarkerManager);
    ngAfterContentInit(): void;
    /** @internal */
    ngOnChanges(changes: {
        [key: string]: SimpleChange;
    }): void;
    private _addEventListeners();
    /** @internal */
    id(): string;
    /** @internal */
    toString(): string;
    /** @internal */
    ngOnDestroy(): void;
}
