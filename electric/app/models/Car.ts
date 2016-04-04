export class Car {
  private _id : number
  private _name : string
  constructor(id : number, name : string) {
    this._id = id
    this._name = name
  }

  /**
   * returns the id of the car
   * @return {number}
   */
  get id() : number {
    return this._id
  }

  /**
   * returns the name of the car
   * @return {string}
   */
  get name() : string {
    return this._name
  }

  toString() : string {
    return this._name
  }

}
