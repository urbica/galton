const Router = require('koa-router');

const debug = require('./routes/debug');
const tiles = require('./routes/tiles');
const isochrones = require('./routes/isochrones');

const router = new Router();

router.get('/', isochrones);
router.get('/debug', debug);
router.get('/tiles/:z(\\d+)/:x(\\d+)/:y(\\d+).pbf', tiles);

module.exports = router;
