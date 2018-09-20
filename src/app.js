const OSRM = require('osrm');
const Koa = require('koa');
const router = require('./router');

const createApp = (config) => {
  const app = new Koa();

  app.context.osrm = new OSRM({
    algorithm: config.algorithm,
    path: config.osrmPath,
    shared_memory: config.sharedMemory
  });

  app.use(router.routes()).use(router.allowedMethods());

  return app.callback();
};

module.exports = createApp;
