const Router = require('koa-router');

const index = require('./routes/index');
const tiles = require('./routes/tiles');
const isochrones = require('./routes/isochrones');

const router = new Router();

router.get('/', index);
router.get('/isochrones', isochrones);
router.get('/tiles/:z(\\d+)/:x(\\d+)/:y(\\d+).pbf', tiles);

module.exports = router;
