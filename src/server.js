import compress from 'koa-compress';
import conditional from 'koa-conditional-get';
import cors from 'kcors';
import etag from 'koa-etag';
import Koa from 'koa';
import logger from 'koa-logger';
import OSRM from 'osrm';
import isochrone from './isochrone';
import checkError from './middlewares/check-error';
import checkHealth from './middlewares/check-health';
import queryToOptions from './utils';

/**
 * Server configuration
 *
 * @typedef {Object} serverConfig
 * @property {string} osrmPath - path to *.osrm file
 * @property {number} bufferSize - buffer size
 * @property {number} cellWidth - cellWidth as in
 * [turf-point-grid](https://github.com/Turfjs/turf-point-grid)
 * @property {Array.<number>} intervals - intervals for isochrones in minutes
 * @property {number} concavity - relative measure of concavity as in
 * [concaveman](https://github.com/mapbox/concaveman)
 * @property {number} lengthThreshold - length threshold as in
 * [concaveman](https://github.com/mapbox/concaveman)
 * @property {number} resolution - turf-bezier time in milliseconds between points as in
 * [turf-bezier](https://github.com/Turfjs/turf-bezier)
 * @property {number} sharpness - a measure of how curvy the path should be between splines as in
 * [turf-bezier](https://github.com/Turfjs/turf-bezier)
 * @property {string} units - either 'kilometers' or 'miles' as in
 * [turf-point-grid](https://github.com/Turfjs/turf-point-grid)
 */
export const defaults = {
  bufferSize: 6,
  cellWidth: 0.2,
  concavity: 2,
  intervals: [10, 20, 30],
  lengthThreshold: 0,
  resolution: 10000,
  sharpness: 0.85,
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

export { galton as app, isochrone };
