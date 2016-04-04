import {Inject} from 'angular2/core';
import {ServiceConfig} from './ServiceConfig';
import {Http, HTTP_BINDINGS, Headers} from 'angular2/http';
import {Model} from '../models/Model'

import {RouteRequest} from '../models/RouteRequest'
import {RouteReceipt} from '../models/RouteReceipt';


export class SearchService {
    constructor(@Inject(Http) public http : Http) {
      // empty on purpose, used soley for DI
    }

    performSearchWithRequest(request : RouteRequest, callback : Function) {
      var params = JSON.stringify(request.toJSON())
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.http.post(ServiceConfig.SERVER_URL + "/route/search", "", {headers: headers, body: params}).map(res => res.json()).subscribe(
        data => {
            if(data.Waypoints != null) {
              callback(new RouteReceipt(data.Waypoints))
            } else {
              callback(null)
            }
        },
        error => {
          callback(null)
        }
      )
    }

}
