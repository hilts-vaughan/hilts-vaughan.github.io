import {Point} from './Point'
import {Model} from './Model'

/**
 * A route request is something that ultimately is a transient control that
 * will eventually route requests to the server.
 */
export class RouteRequest {
  private _start : Point = new Point(0, 0);
  private _startRaw : String;

  private _end : Point = new Point(0, 0);
  private _endRaw : String;

  // The internal model of this route
  private _model : Model

  get startingLocation() : Point  {
      return this._start;
  }

  set startingLocation(value) {
    // Translate this into something usable
    this._start = value
  }

  get endingLocation() : Point  {
      return this._end;
  }

  set endingLocation(value) {
    // Translate this into something usable
    this._end = value
  }

  get selectedModel() : Model {
    return this._model
  }

  set selectedModel(model) {
    this._model = model
  }

  validate() : boolean {
    return this._start.validate() && this._end.validate() && this._model != null
  }

  // Because who wants to do real work :)
  toJSON() {
    return {
      start: this._start.toJSON(),
      end: this._end.toJSON(),
      modelId: this._model.id
    }
  }

}
