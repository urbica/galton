const Router = require('koa-router');
const api = require('./routes/api');
const tiles = require('./routes/tiles');
const index = require('./routes/index');

const router = new Router();

router.get('/', index);
router.get('/api', api);
router.get('/tiles/:z(\\d+)/:x(\\d+)/:y(\\d+).pbf', tiles);

module.exports = router;
