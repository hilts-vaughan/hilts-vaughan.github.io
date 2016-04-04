/**
 * This file is the main component which houses our two basic views on a high
 * level for getting things done. This will house mostly the InfoComponent
 * and the actual MapComponent for ourselves.
 */

import {Component, Output, Input, EventEmitter, ElementRef, Renderer} from 'angular2/core';

@Component({
    selector: 'places-input',
    providers: [],
    template: `
    <div class="input-field col s12">
      <input [ngModel]="_raw" placeholder="" type="text">
      <label for="src">{{labelText}}</label>
    </div>
    `
})

export class MaterialPlacesAutocomplete {
  // Private implementation details
  private _scope : Object;

  @Output() placeChanged: EventEmitter<String> = new EventEmitter();
  @Input() labelText : String = ""

  constructor(public elementRef: ElementRef, public renderer: Renderer) {

  }

  // Private rendering methods down below
  ngAfterViewInit() {
    var rawElement : Element = this.elementRef.nativeElement
    var element : any = window['$'](rawElement).find('input')

    this._scope = new window['google'].maps.places.Autocomplete(element.get(0), {});
    window['google'].maps.event.addListener(this._scope, 'place_changed', () => {
      // Send the update to the listener
      var place = this._scope['getPlace']();
      this.sendUpdate(place.formatted_address)
    });
  }

  // Notifies the user when an update is available
  private sendUpdate(value : String) {
    this.placeChanged.emit(value)
  }

  // Internal handling of events, isolated from the world
  set _raw(value : String) {
    this.sendUpdate(value)
  }

}
