/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import test from 'tape';
import request from 'supertest-koa-agent';
import galton from '../src/server.js';

test('galton', (t) => {
  t.plan(1);

  const point = [52.517037, 13.388860];
  const osrmPath = path.join(__dirname, '../node_modules/osrm/test/data/berlin-latest.osrm');

  const app = galton({
    osrmPath,
    bufferSize: 1,
    cellSize: 0.1,
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
