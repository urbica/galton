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
const parseQuery = require('./utils');

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
    const query = parseQuery(ctx.request.query);
    const options = Object.assign({}, query, { osrm });
    ctx.body = await isochrone([options.lng, options.lat], options);
  });

  return app;
};

module.exports = galton;
