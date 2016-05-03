import Koa from 'koa';
import OSRM from 'osrm';
import turf from 'turf';
import cors from 'kcors';
import morgan from 'koa-morgan';
import concaveman from 'concaveman';

/**
 * Options
 * @typedef {Object} Options
 * @property {Object} osrm - node-osrm instance
 * @property {number} bufferSize - bufferSize as in
 * [turf-point-grid](https://github.com/Turfjs/turf-point-grid)
 * @property {number} cellSize - cellSize as in
 * [turf-point-grid](https://github.com/Turfjs/turf-point-grid)
 * @property {string} units - either `kilometers` or `miles` as in
 * [turf-point-grid](https://github.com/Turfjs/turf-point-grid)
 * @property {Array.<number>} intervals - intervals for isochrones in minutes
 * @property {number} concavity - concavity as in
 * [concaveman](https://github.com/mapbox/concaveman)
 * @property {number} lengthThreshold - lengthThreshold as in
 * [concaveman](https://github.com/mapbox/concaveman)
 */

/**
 * Build isochrone
 *
 * @param {Array.<float>} point source point [lng, lat]
 * @param {Options} options object
 * @returns {Promise} promise with GeoJSON when resolved
 */
export const isochrone = ([lng, lat], { bufferSize, cellSize, concavity, intervals,
  lengthThreshold, osrm, units }) => {
  const point = turf.point([lng, lat]);
  const sw = turf.destination(point, bufferSize / 2, 225, units);
  const ne = turf.destination(point, bufferSize / 2, 45, units);
  const extent = sw.geometry.coordinates.concat(ne.geometry.coordinates);
  const grid = turf.pointGrid(extent, cellSize, units);

  const points = grid.features.map(({ geometry: { coordinates } }) => coordinates);

  const intervalGroups = intervals.reduce((acc, interval) =>
    Object.assign({}, acc, { [interval]: [] })
  , {});

  const coordinates = [[lng, lat]].concat(points);

  return new Promise((resolve, reject) => {
    osrm.table({ sources: [0], coordinates }, (error, table) => {
      if (error) reject(error);
      const travelTime = table.durations[0] || [];

      const pointsByInterval = travelTime.reduce((acc, time, index) => {
        const timem = Math.round(time / 60);
        const ceil = intervals.find(interval => timem <= interval);
        if (ceil) {
          acc[ceil].push(table.destinations[index].location);
        }
        return acc;
      }, intervalGroups);

      const features = Object.keys(pointsByInterval).map((time) => {
        let polygon;
        try {
          if (pointsByInterval[time].length >= 3) {
            const concave = concaveman(pointsByInterval[time], concavity, lengthThreshold);
            const ring = concave.concat([concave[0]]);
            polygon = turf.polygon([ring], { time: parseFloat(time) });
          }
        } catch (e) {
          reject(e);
        }
        return polygon;
      }).filter(feature => !!feature);

      return resolve(turf.featurecollection(features));
    });
  });
};

export default function (config = {}) {
  const app = new Koa();
  const osrm = new OSRM(config.osrmPath);
  const options = {
    osrm,
    bufferSize: parseFloat(config.bufferSize) || 6,
    cellSize: parseFloat(config.cellSize) || 0.2,
    concavity: parseFloat(config.concavity) || 10,
    intervals: config.intervals || [5, 10, 15, 20, 25, 30],
    lengthThreshold: parseFloat(config.lengthThreshold) || 0,
    units: config.units || 'kilometers'
  };

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
    const { lng, lat } = ctx.request.query;
    ctx.body = await isochrone([parseFloat(lng), parseFloat(lat)], options);
  });

  return app;
}
