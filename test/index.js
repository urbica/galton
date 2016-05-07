import test from 'tape';
import request from 'supertest-koa-agent';
import galton from '../src/index';

test('galton', (t) => {
  t.plan(1);

  const point = [52.517037, 13.388860];
  const app = galton({
    bufferSize: 1,
    cellSize: 0.1,
    osrmPath: './node_modules/osrm/test/data/berlin-latest.osrm',
    units: 'kilometers'
  });

  request(app)
    .get(`/?lng=${point[0]}&lat=${point[1]}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((error) => {
      t.error(error, 'No error');
      t.end();
    });
});
