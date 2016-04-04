/**
 * Implements a material dropdown which enables us to be able to have elements
 * selected and changed at will.
 */

import {Component, Output, Input, EventEmitter, ElementRef, Renderer} from 'angular2/core';
import {RouteReceipt} from '../models/RouteReceipt'

@Component({
    selector: 'route-results',
    providers: [],
    template: `
    <div class="content-wrapper center-align">
      <h4 style="center">Stops</h4>
      <div id="route-results">
        <div class="content-wrapper">
        <ul class="collection grey darken-3" style="border: none !important;">
          <li *ngFor="#result of routeReceipt?.waypointNames" class="collection-item avatar grey darken-3" style="border-bottom: 1px dashed lightgray !important;">
            <img src="img/marker.png" alt="" class="circle">
            <span class="title">{{result[1]}}</span>
            <p>{{result[0]}}<br>
            </p>
          </li>
          <a style="margin-top: 8px" *ngIf="routeReceipt != null" (click)="exportResults()" class="waves-effect waves-light btn center">Export Route</a>
        </ul>
        </div>
      </div>
    </div>
    `
})

export class RouteResultsComponent {

  @Input() routeReceipt : RouteReceipt = null

  constructor(public elementRef: ElementRef, public renderer: Renderer) {

  }

  exportResults() {
    var BASE_URL = "https://www.google.ca/maps/dir/";
    var sBuffer = ""
    this.routeReceipt.all.forEach((point) => {
      sBuffer += point.toString()
    })

    // Open the results
    window.open(BASE_URL + sBuffer.substring(1, sBuffer.length))
  }

}
