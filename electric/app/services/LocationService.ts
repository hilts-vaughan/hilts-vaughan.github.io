/**
 * Provides services for locations and getting their information.
 */
export class LocationService {
  private options : Object = Object.freeze({
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  })

  /**
   * Gets the users current position via callback from the location device API.
   * If the user is not willing to give this information, then it falls back
   * and just returns null in the callback.
   * @param  {Function} callback [The callback that will be invoked once the
   * function has finished running.
   */
  getCurrentPositionForUser(callback : Function) {
    navigator.geolocation.getCurrentPosition((position) => {
      callback(position)
    }, () => {
      callback(null)
    }, this.options)
  }
}
