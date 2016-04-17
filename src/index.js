import Koa from 'koa';
import OSRM from 'osrm';
import turf from 'turf';
import cors from 'kcors';
import morgan from 'koa-morgan';
import concaveman from 'concaveman';

/**
 * Options
 * @typedef {Object} Options
 * @property {number} sourceId - source point id from original points array
 * @property {Object} osrm - node-osrm instance
 * @property {number} bufferSize - bufferSize as in
 * [turf-point-grid](https://github.com/Turfjs/turf-point-grid)
 * @property {number} cellSize - cellSize as in
 * [turf-point-grid](https://github.com/Turfjs/turf-point-grid)
 * @property {string} units - either `kilometers` or `miles` as in
 * [turf-point-grid](https://github.com/Turfjs/turf-point-grid)
 * @property {Array.<number>} intervals - intervals for isochrones in 10th of a second
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
 * @returns {Promise} promise with isochrone GeoJSON when resolved
 */
export const isochrone = ([lng, lat], { bufferSize, cellSize, concavity, intervals,
  lengthThreshold, osrm, units }) => {
  const point = turf.point([lng, lat]);
  const sw = turf.destination(point, bufferSize / 2, 225, units);
  const ne = turf.destination(point, bufferSize / 2, 45, units);
  const extent = sw.geometry.coordinates.concat(ne.geometry.coordinates);
  const grid = turf.pointGrid(extent, cellSize, units);

  const points = grid.features.map(({ geometry: { coordinates } }) =>
    [coordinates[1], coordinates[0]]
  );

  const intervalGroups = intervals.reduce((acc, interval) => {
    acc[interval] = [];
    return acc;
  }, {});

  return new Promise((resolve, reject) => {
    osrm.table({ sources: [[lat, lng]], destinations: points }, (error, table) => {
      if (error) reject(error);

      const travelTime = table.distance_table[0] || [];
      const pointsByInterval = travelTime.reduce((acc, time, index) => {
        const ceil = intervals.find(interval => time <= interval);
        if (ceil) {
          const coordinates = table.destination_coordinates[index];
          acc[ceil].push([coordinates[1], coordinates[0]]);
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
    bufferSize: parseFloat(config.bufferSize) || 2,
    cellSize: parseFloat(config.cellSize) || 0.1,
    concavity: parseFloat(config.concavity) || 10,
    intervals: config.intervals || [1000, 2000, 3000, 4000, 5000, 6000],
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
    ctx.body = await isochrone([lng, lat], options);
  });

  return app;
}
