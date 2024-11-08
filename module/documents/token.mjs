/**
 * The Token document subclass in the COG system which extends the behavior of the base Token class.
 */
export default class COGToken extends TokenDocument {

  /** @override */
  static getTrackedAttributes(_data, _path = []) {
    return {
      bar: [["health", "hitPoints"]],
      value: [],
    };
  }
}
