import {Inject} from 'angular2/core';
import {ServiceConfig} from './ServiceConfig';
import {Http, HTTP_BINDINGS, Headers} from 'angular2/http';
import {Car} from '../models/Car'
import {Model} from '../models/Model'

export class CarService {
  constructor(@Inject(Http) public http : Http) {

  }

  /**
   * Fetches all cars from a remote server and then submits them.
   * A callback is returned either way, containing the error or cars.
   * @return {[type]} [description]
   */
  fetchAllCars(callback : Function) {
    this.http.get(ServiceConfig.SERVER_URL + "/cars").map(res => res.json()).subscribe(
      data => {
        var collection = []
        data.cars.forEach((car) => {
          collection.push(new Car(car.id, car.name))
        })
        callback(collection)
      },
      error => callback(null)
    )
  }

  fetchAllCarModelsForCar(car : Car, callback : Function) {
    var params = JSON.stringify({id: car.id})
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    this.http.post(ServiceConfig.SERVER_URL + "/cars/model", "", {headers: headers, body: params}).map(res => res.json()).subscribe(
      data => {
        var collection = []
        data.models.forEach((model) => {
          collection.push(new Model(model.model_id, model.name, model.year))
        })
        callback(collection)
      },
      error => callback(null)
    )
  }

  getConnectionsForModel(model : Model, callback : Function) {
    
  }

}
