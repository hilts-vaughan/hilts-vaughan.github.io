/**
 * A basic point that is used for longitude and latitude. Used to store the location
 * in such a way is sane.
 */
export class Point {
  long : Number;
  lat : Number;

  constructor(long : Number, lat : Number) {
    this.long = long
    this.lat = lat
  }

  validate() : boolean {
    return this.long != 0 && this.lat != 0
  }

  toJSON() {
    return {
      long: this.long,
      lat: this.lat
    }
  }

  toString() {
    return "/'" + this.lat + "," + this.long + "'"
  }

}
