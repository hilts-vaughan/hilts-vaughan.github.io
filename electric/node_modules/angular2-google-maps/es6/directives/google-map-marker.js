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
import { Directive, EventEmitter, ContentChild } from 'angular2/core';
import { MarkerManager } from '../services/marker-manager';
import { SebmGoogleMapInfoWindow } from './google-map-info-window';
let markerId = 0;
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
export let SebmGoogleMapMarker = class SebmGoogleMapMarker {
    constructor(_markerManager) {
        this._markerManager = _markerManager;
        /**
         * If true, the marker can be dragged. Default value is false.
         */
        this.draggable = false;
        /**
         * This event emitter gets emitted when the user clicks on the marker.
         */
        this.markerClick = new EventEmitter();
        /**
         * This event is fired when the user stops dragging the marker.
         */
        this.dragEnd = new EventEmitter();
        this._markerAddedToManger = false;
        this._id = (markerId++).toString();
    }
    /* @internal */
    ngAfterContentInit() {
        if (this._infoWindow != null) {
            this._infoWindow.hostMarker = this;
        }
    }
    /** @internal */
    ngOnChanges(changes) {
        if (typeof this.latitude !== 'number' || typeof this.longitude !== 'number') {
            return;
        }
        if (!this._markerAddedToManger) {
            this._markerManager.addMarker(this);
            this._markerAddedToManger = true;
            this._addEventListeners();
            return;
        }
        if (changes['latitude'] || changes['longitude']) {
            this._markerManager.updateMarkerPosition(this);
        }
        if (changes['title']) {
            this._markerManager.updateTitle(this);
        }
        if (changes['label']) {
            this._markerManager.updateLabel(this);
        }
        if (changes['draggable']) {
            this._markerManager.updateDraggable(this);
        }
        if (changes['iconUrl']) {
            this._markerManager.updateIcon(this);
        }
    }
    _addEventListeners() {
        this._markerManager.createEventObservable('click', this).subscribe(() => {
            if (this._infoWindow != null) {
                this._infoWindow.open();
            }
            this.markerClick.next(null);
        });
        this._markerManager.createEventObservable('dragend', this)
            .subscribe((e) => {
            this.dragEnd.next({ coords: { lat: e.latLng.lat(), lng: e.latLng.lng() } });
        });
    }
    /** @internal */
    id() { return this._id; }
    /** @internal */
    toString() { return 'SebmGoogleMapMarker-' + this._id.toString(); }
    /** @internal */
    ngOnDestroy() { this._markerManager.deleteMarker(this); }
};
__decorate([
    ContentChild(SebmGoogleMapInfoWindow), 
    __metadata('design:type', SebmGoogleMapInfoWindow)
], SebmGoogleMapMarker.prototype, "_infoWindow", void 0);
SebmGoogleMapMarker = __decorate([
    Directive({
        selector: 'sebm-google-map-marker',
        inputs: ['latitude', 'longitude', 'title', 'label', 'draggable: markerDraggable', 'iconUrl'],
        outputs: ['markerClick', 'dragEnd']
    }), 
    __metadata('design:paramtypes', [MarkerManager])
], SebmGoogleMapMarker);

//# sourceMappingURL=google-map-marker.js.map
