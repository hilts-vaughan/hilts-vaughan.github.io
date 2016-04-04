import {Point} from './Point'

export class RouteReceipt {
  private _points : Array<Point> = []
  private _info : Array<[String]> = []

  constructor(results : any) {
    results.forEach((result) => {
      this._points.push(new Point(result[1], result[0]))
      this._info.push([result[2], result[3]])
    })
  }

  get waypoints() : Array<Point> {
    return this._points.slice(1, this._points.length - 1)
  }

  get first() : Point {
    return this._points[0]
  }

  get last() : Point {
    return this._points[this._points.length - 1]
  }

  get all() : Array<Point> {
    return this._points
  }

  /*
    Slices the way point names
   */
  get waypointNames() : Array<[String]> {
    return this._info.slice(1, this._points.length - 1)    
  }

}
