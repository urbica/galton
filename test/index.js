'use strict';

require('babel-register');
require('babel-polyfill');

var test = require('tape');
var request = require('supertest-koa-agent');
var galton = require('../src/index').default;

test('galton', function (t) {
  t.plan(1);

  var point = [52.517037, 13.388860];
  var app = galton({
    bufferSize: 1,
    cellSize: 0.1,
    osrmPath: 'test/data/berlin-latest.osrm',
    units: 'kilometers'
  });

  request(app)
    .get('/?lng=' + point[0] + '&lat=' + point[1])
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (error, data) {
      t.error(error, 'No error');
      t.end();
    });
});
