import bezier from 'turf-bezier';
import concaveman from 'concaveman';
import cors from 'kcors';
import destination from 'turf-destination';
import featureCollection from 'turf-featurecollection';
import Koa from 'koa';
import morgan from 'koa-morgan';
import OSRM from 'osrm';
import pointGrid from 'turf-point-grid';

/**
 * Options
 * @typedef {Object} Options
 * @property {Object} osrm - node-osrm instance
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
 * @property {string} units - either `kilometers` or `miles` as in
 * [turf-point-grid](https://github.com/Turfjs/turf-point-grid)
 */

export const defaults = {
  bufferSize: 6,
  cellWidth: 0.2,
  concavity: 2,
  intervals: [5, 10, 15, 20, 25, 30],
  lengthThreshold: 0,
  resolution: 10000,
  sharpness: 0.85,
  units: 'kilometers'
};

/**
 * Build isochrone
 *
 * @param {Array.<float>} point source point [lng, lat]
 * @param {Options} options object
 * @returns {Promise} promise with GeoJSON when resolved
 */
export const isochrone = ([lng, lat], options) => {
  const point = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [lng, lat]
    }
  };
  const sw = destination(point, options.bufferSize / 2, 225, options.units);
  const ne = destination(point, options.bufferSize / 2, 45, options.units);
  const extent = sw.geometry.coordinates.concat(ne.geometry.coordinates);
  const grid = pointGrid(extent, options.cellWidth, options.units);

  const points = grid.features.map(({ geometry: { coordinates } }) => coordinates);

  const intervalGroups = options.intervals.reduce((acc, interval) =>
    Object.assign({}, acc, { [interval]: [] })
  , {});

  const coordinates = [[lng, lat]].concat(points);

  return new Promise((resolve, reject) => {
    options.osrm.table({ sources: [0], coordinates }, (error, table) => {
      if (error) reject(error);
      const travelTime = table.durations[0] || [];

      const pointsByInterval = travelTime.reduce((acc, time, index) => {
        const timem = Math.round(time / 60);
        const ceil = options.intervals.find(interval => timem <= interval);
        if (ceil) {
          acc[ceil].push(table.destinations[index].location);
        }
        return acc;
      }, intervalGroups);

      const features = Object.keys(pointsByInterval).map((interval) => {
        let polygon;
        try {
          if (pointsByInterval[interval].length >= 3) {
            const concave = concaveman(pointsByInterval[interval],
              options.concavity, options.lengthThreshold);

            const curved = bezier({
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: concave
              }
            }, options.resolution, options.sharpness);

            const ring = curved.geometry.coordinates.concat([
              curved.geometry.coordinates[0]
            ]);

            polygon = {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [ring]
              },
              properties: {
                time: parseFloat(interval)
              }
            };
          }
        } catch (e) {
          reject(e);
        }
        return polygon;
      }).filter(feature => !!feature);

      return resolve(featureCollection(features));
    });
  });
};

export default function (config = {}) {
  const app = new Koa();

  const osrm = new OSRM({
    path: config.osrmPath,
    shared_memory: !!config.sharedMemory
  });

  app.use(morgan('dev'));
  if (config.cors) app.use(cors());

  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      ctx.body = { message: error.message };
      ctx.status = error.status || 500;
    }
  });

  app.use(async (ctx) => {
    const query = ctx.request.query;
    const intervals = Array.isArray(query['intervals[]']) ?
      query['intervals[]'].map(parseFloat).sort((a, b) => a - b) :
      config.intervals || defaults.intervals;

    const options = {
      osrm,
      intervals,
      bufferSize: parseFloat(query.bufferSize) ||
                  parseFloat(config.bufferSize) ||
                  defaults.bufferSize,
      cellWidth: parseFloat(query.cellWidth) ||
                 parseFloat(config.cellWidth) ||
                 defaults.cellWidth,
      concavity: parseFloat(query.concavity) ||
                 parseFloat(config.concavity) ||
                 defaults.concavity,
      lengthThreshold: parseFloat(query.lengthThreshold) ||
                       parseFloat(config.lengthThreshold) ||
                       defaults.lengthThreshold,
      resolution: parseFloat(query.resolution) ||
                  parseFloat(config.resolution) ||
                  defaults.resolution,
      sharpness: parseFloat(query.sharpness) ||
                 parseFloat(config.sharpness) ||
                 defaults.sharpness,
      units: query.units || config.units || defaults.units
    };

    const { lng, lat } = ctx.request.query;
    ctx.body = await isochrone([parseFloat(lng), parseFloat(lat)], options);
  });

  return app;
}
