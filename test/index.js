/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');
const test = require('tape');
const request = require('supertest-koa-agent');
const geojsonhint = require('@mapbox/geojsonhint');
const galton = require('../dist/bundle.js');

const points = [[7.41337, 43.72956],
                [7.41546, 43.73077],
                [7.41862, 43.73216]];

const osrmPath = path.join(__dirname, './data/monaco.osrm');

const options = {
  osrmPath,
  radius: 2,
  cellSize: 0.1,
  concavity: 2,
  intervals: [5, 10, 15],
  lengthThreshold: 0,
  units: 'kilometers'
};

const app = galton.app(options);

test('galton', (t) => {
  t.plan(6);

  points.forEach(point =>
    request(app)
      .get(`/?lng=${point[0]}&lat=${point[1]}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, res) => {
        t.error(error, 'No error');
        const errors = geojsonhint.hint(res.text);
        if (errors.length > 0) {
          errors.forEach(error => t.comment(error.message));
          t.fail('Invalid GeoJSON');
        } else {
          t.pass('Valid GeoJSON');
        }
      })
  );
});
