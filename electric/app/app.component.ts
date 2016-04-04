/**
 * This file is the main component which houses our two basic views on a high
 * level for getting things done. This will house mostly the InfoComponent
 * and the actual MapComponent for ourselves.
 */

import {Component} from 'angular2/core';
import {Map} from './components/MapComponent'
import {Pane} from './components/RoutePaneComponent';
import {SearchService} from './services/SearchService'
import {RouteResultsComponent} from './components/RouteResultsComponent'
import {RouteRequest} from './models/RouteRequest';
import {RouteReceipt} from './models/RouteReceipt';
import {Point} from './models/Point'

@Component({
    selector: 'my-app',
    directives: [Map, Pane, RouteResultsComponent],
    providers: [SearchService],
    template: `
    <!-- Page Layout here -->
    <div class="row grey darken-3">
      <div class="col s12 m5 l3 grey darken-3">
        <pane [search]="_search" (searchInvoked)="beginSearch($event)"></pane>
        <route-results [routeReceipt]="_receipt"></route-results>
      </div>
      <div class="full-height col s12 m7 l9 grey darken-3" style="overflow-y: hidden">
        <map [routeReceipt]="_receipt">
        </map>
      </div>
    </div>

    <!-- Modal Structure -->
    <div id="modal1" class="modal">
      <div class="modal-content">
        <h4 id="modal-title">Modal Header</h4>
        <p id="modal-text">A bunch of text</p>
      </div>
      <div class="modal-footer">
        <a href="#!" class=" modal-action modal-close waves-effect waves-grey btn-flat">OK</a>
      </div>
    </div>
    `
})

export class AppComponent {
  // Can probably feed some waypoint data into it and force a change, but for now...
  private _receipt : RouteReceipt
  private _search : boolean = false

  constructor(public searchService : SearchService) {

  }

  showModal(title : string, text : string) {
    var $ = window['$']
    $('#modal-title').text(title)
    $('#modal-text').text(text)
    $('#modal1').openModal();
  }

  beginSearch(request : RouteRequest) {

    var isValid = request.validate()
    // TODO: Spawn a proper modal to make things look less shitty
    if(!isValid) {
      this.showModal("Error", "Please be sure to fill in all the fields.")
      return
    }

    this._search = true
    this.searchService.performSearchWithRequest(request, (receipt) => {
      if(receipt != null) {
        this._receipt = receipt
      } else {
        this.showModal("Error", "No route could be found. It's likely your range is too far or there are not enough charging stations.")
      }
      this._search = false
    })
  }
}
