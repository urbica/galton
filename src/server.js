import Koa from 'koa';
import OSRM from 'osrm';
import compress from 'koa-compress';
import conditional from 'koa-conditional-get';
import cors from 'kcors';
import etag from 'koa-etag';
import logger from 'koa-logger';
import isochrone from './isochrone';

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
 * Isochrone server
 *
 * @name server
 * @param {serverConfig} config default isochrone options
 * @returns {Koa} Koa instance
 */
export default function (config) {
  const app = new Koa();

  const osrm = new OSRM({
    path: config.osrmPath,
    shared_memory: !!config.sharedMemory
  });

  const defaultOptions = {
    osrm,
    bufferSize: config.bufferSize || defaults.bufferSize,
    cellWidth: config.cellWidth || defaults.cellWidth,
    concavity: config.concavity || defaults.concavity,
    intervals: config.intervals || defaults.intervals,
    lengthThreshold: config.lengthThreshold || defaults.lengthThreshold,
    resolution: config.resolution || defaults.resolution,
    sharpness: config.sharpness || defaults.sharpness,
    units: config.units || defaults.units
  };

  if (config.cors) app.use(cors());
  app.use(compress());
  app.use(conditional());
  app.use(etag());
  app.use(logger());

  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      ctx.body = { message: error.message };
      ctx.status = error.status || 500;
    }
  });

  app.use(async (ctx) => {
    const { query } = ctx.request;
    const { lng, lat } = ctx.request.query;

    let intervals;
    if (Array.isArray(query['intervals[]'])) {
      intervals = query['intervals[]'].map(parseFloat).sort((a, b) => a - b);
    } else {
      const interval = parseFloat(query['intervals[]']);
      intervals = interval ? [interval] : config.intervals || defaults.intervals;
    }

    const options = {
      osrm,
      intervals,
      bufferSize: query.bufferSize ?
        parseFloat(query.bufferSize) : defaultOptions.bufferSize,
      cellWidth: query.cellWidth ?
        parseFloat(query.cellWidth) : defaultOptions.cellWidth,
      concavity: query.concavity ?
        parseFloat(query.concavity) : defaultOptions.concavity,
      lengthThreshold: query.lengthThreshold ?
        parseFloat(query.lengthThreshold) : defaultOptions.lengthThreshold,
      resolution: query.resolution ?
        parseFloat(query.resolution) : defaultOptions.resolution,
      sharpness: query.sharpness ?
        parseFloat(query.sharpness) : defaultOptions.sharpness,
      units: query.units ?
        query.units : defaultOptions.units
    };

    ctx.body = await isochrone([parseFloat(lng), parseFloat(lat)], options);
  });

  return app;
}
