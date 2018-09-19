const isochrone = require('isochrone');
const { parseQuery } = require('../utils');

module.exports = async (ctx) => {
  const options = Object.assign({}, parseQuery(ctx.query), { osrm: ctx.osrm });
  ctx.assert(options.lng && options.lat, 500, 'request "lng" or "lat" is undefined');
  ctx.body = await isochrone([options.lng, options.lat], options);
};
