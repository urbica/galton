const path = require('path');
const request = require('supertest');
const geojsonhint = require('@mapbox/geojsonhint');
const createApp = require('../src/app');

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

const app = createApp(options);

const points = [[7.41337, 43.72956], [7.41546, 43.73077], [7.41862, 43.73216]];

test.each(points)('isochrone(%f, %f)', async (lng, lat) => {
  try {
    const response = await request(app)
      .get(`/api?lng=${lng}&lat=${lat}`)
      .expect(200)
      .expect('Content-Type', /json/);
    const errors = geojsonhint.hint(response.text);
    expect(errors).toHaveLength(0);
  } catch (error) {
    expect(error).toBeFalsy();
  }
});
