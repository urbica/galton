const url = require('url');
const OSRM = require('osrm');
const isochrone = require('isochrone');
const parseQuery = require('./utils');

/**
 * Isochrone server
 *
 * @name galton
 * @param {serverConfig} config default isochrone options
 * @returns {function} node http requestListener function
 */
const galton = (config) => {
  const osrm = new OSRM({
    algorithm: config.algorithm,
    path: config.osrmPath,
    shared_memory: config.sharedMemory
  });

  return (req, res) => {
    const { query } = url.parse(req.url, true);
    const options = Object.assign({}, parseQuery(query), { osrm });

    if (!options.lng || !options.lat) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: 'request "lng" or "lat" is undefined' }));
    }

    res.setHeader('Content-Type', 'application/json');
    if (config.cors) {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }

    return isochrone([options.lng, options.lat], options)
      .then(geojson => res.end(JSON.stringify(geojson)))
      .catch((error) => {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: error.message }));
      });
  };
};

module.exports = galton;
