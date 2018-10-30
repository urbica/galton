/**
 * Server configuration
 *
 * @typedef {Object} serverConfig
 * @param {Object} options object
 * @param {string} options.osrmPath - path to *.osrm file [OSRM](https://github.com/Project-OSRM/osrm-backend)
 * @param {number} options.radius - distance to draw the buffer as in
 * [@turf/buffer](https://github.com/Turfjs/turf/tree/master/packages/turf-buffer)
 * @param {number} options.cellSize - the distance across each cell as in
 * [@turf/point-grid](https://github.com/Turfjs/turf/tree/master/packages/turf-point-grid)
 * @param {Array.<number>} options.intervals - intervals for isochrones in minutes
 * @param {number} [options.concavity=2] - relative measure of concavity as in [concaveman](https://github.com/mapbox/concaveman)
 * @param {boolean} [options.deintersect=true] - whether or not to deintersect the final isochrones
 * @param {number} [options.lengthThreshold=0] - length threshold as in [concaveman](https://github.com/mapbox/concaveman)
 * @param {string} [options.units='kilometers'] - any of the options supported by turf units
 */
const defaults = {
  radius: 6,
  cellSize: 0.2,
  concavity: 2,
  deintersect: true,
  intervals: [10, 20, 30],
  lengthThreshold: 0,
  units: 'kilometers',
  algorithm: 'CH',
  sharedMemory: false
};

module.exports = defaults;
