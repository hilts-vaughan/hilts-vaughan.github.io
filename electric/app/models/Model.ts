export class Model {
  private _id : number;
  private _name : string;
  private _year : number;

  constructor(id : number, name : string, year : number) {
    this._id = id;
    this._name = name;
    this._year = year;
  }

  /**
   * returns the id of the model
   * @return {number}
   */
  get id() : number {
    return this._id
  }

  /**
   * returns the name of the model
   * @return {string}
   */
  get name() : string {
    return this._name;
  }

  toString() {
    return this._name + " (" + this._year + ")"
  }
}
