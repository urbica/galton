const compress = require('koa-compress');
const conditional = require('koa-conditional-get');
const cors = require('kcors');
const etag = require('koa-etag');
const Koa = require('koa');
const logger = require('koa-logger');
const OSRM = require('osrm');
const isochrone = require('isochrone');
const checkError = require('./middlewares/check-error');
const checkHealth = require('./middlewares/check-health');
const queryToOptions = require('./utils');

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
 * @param {number} [options.concavity=2] - relative measure of concavity as in
 * [concaveman](https://github.com/mapbox/concaveman)
 * @param {number} [options.lengthThreshold=0] - length threshold as in
 * [concaveman](https://github.com/mapbox/concaveman)
 * @param {string} [options.units='kilometers'] - any of the options supported by turf units
 */
const defaults = {
  radius: 6,
  cellSize: 0.2,
  concavity: 2,
  intervals: [10, 20, 30],
  lengthThreshold: 0,
  units: 'kilometers'
};

/**
 * Isochrone server
 *
 * @name galton
 * @param {serverConfig} config default isochrone options
 * @returns {Koa} Koa instance
 */
const galton = (config) => {
  const app = new Koa();

  const osrm = new OSRM({
    path: config.osrmPath,
    shared_memory: config.sharedMemory
  });

  const defaultOptions = Object.assign({ osrm }, defaults, config);

  if (config.cors) {
    app.use(cors());
  }

  app.use(compress());
  app.use(conditional());
  app.use(etag());
  app.use(logger());
  app.use(checkError());
  app.use(checkHealth('/ping'));

  app.use(async (ctx) => {
    const query = ctx.request.query;
    const lng = parseFloat(query.lng);
    const lat = parseFloat(query.lat);
    const options = queryToOptions(defaultOptions, query);

    /* eslint-disable no-param-reassign */
    ctx.body = await isochrone([lng, lat], options);
    /* eslint-enable no-param-reassign */
  });

  return app;
};

module.exports = {
  app: galton,
  defaults
};

