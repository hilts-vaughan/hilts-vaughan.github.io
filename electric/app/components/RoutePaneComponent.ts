import {Component, EventEmitter, Output, Input} from 'angular2/core';
import {RouteRequest} from '../models/RouteRequest'
import {MaterialPlacesAutocomplete} from './MaterialPlacesAutocomplete';
import {DropdownComponent} from './DropdownComponent';

import {CarService} from '../services/CarService';
import {GoogleService} from '../services/GoogleService'


import {Car} from '../models/Car'
import {Model} from '../models/Model'

@Component({
  selector: 'pane',
  directives: [MaterialPlacesAutocomplete, DropdownComponent],
  providers: [CarService, GoogleService],
  template: `
    <div id="info-pane">
    <div class="content-wrapper center-align">
      <h4 style="center">Plan Route</h4>
      <form>
      <div class="row center-align">
         <form class="col s12">
           <div class="row">
             <places-input labelText="Start" (placeChanged)="placeChanged($event)" ></places-input>
             <places-input labelText="Destination" (placeChanged)="placeChangedEnd($event)" ></places-input>
             <dropdown [collection]="carCollection" labelText="Car Make" (optionSelected)="makeSelected($event)"></dropdown>
             <dropdown [collection]="modelCollection" labelText="Car Model" (optionSelected)="modelSelected($event)"></dropdown>
           </div>
         </form>
         <a *ngIf="!search" (click)="beginSearch()" class="waves-effect waves-light btn center">Search</a>
         <div *ngIf="search">
           <div class="progress">
                <div class="indeterminate"></div>
            </div>
         </div>
       </div>
      </form>
    </div>
    </div>
  `
})

export class Pane {

  searchRequest : RouteRequest = new RouteRequest();
  carCollection : Array<Car> = []
  modelCollection : Array<Model> = []

  // A handler for invoked search handlers
  @Output() searchInvoked : EventEmitter<RouteRequest> = new EventEmitter()
  @Input() search : boolean

  constructor(public carService : CarService, public googleService : GoogleService) {
    // Fetch the cars
    carService.fetchAllCars((cars) => {
      this.carCollection = cars
    })
  }

  makeSelected(index) {
    var carMake : Car = this.carCollection[index]

    // Now, populate the make service with the new items
    this.carService.fetchAllCarModelsForCar(carMake, (models) => {
      this.modelCollection = models
    })
  }

  modelSelected(index) {
    this.searchRequest.selectedModel = this.modelCollection[index]
  }

  placeChanged(place) {
    this.googleService.getPointFromAddressString(place, (point) => {
      this.searchRequest.startingLocation = point
    })
  }

  placeChangedEnd(place) {
    this.googleService.getPointFromAddressString(place, (point) => {
      this.searchRequest.endingLocation = point
    })
  }

  // ngAfterContentInit is used to initialize the component inside
  // for the fancy selections
  ngAfterContentInit() {
    window['$']('select').material_select();
  }

  beginSearch() {
    this.searchInvoked.emit(this.searchRequest)
  }

}
