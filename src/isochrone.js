import bezier from '@turf/bezier';
import concaveman from 'concaveman';
import destination from '@turf/destination';
import pointGrid from '@turf/point-grid';

const makeGrid = (startPoint, options) => {
  const point = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: startPoint
    }
  };

  const sw = destination(point, options.bufferSize / 2, 225, options.units);
  const ne = destination(point, options.bufferSize / 2, 45, options.units);
  const extent = sw.geometry.coordinates.concat(ne.geometry.coordinates);
  const grid = pointGrid(extent, options.cellWidth, options.units);

  return grid.features.map(feature => feature.geometry.coordinates);
};

const groupByInterval = (destinations, intervals, travelTime) => {
  const intervalGroups = intervals.reduce((acc, interval) =>
    Object.assign({}, acc, { [interval]: [] })
  , {});

  const pointsByInterval = travelTime.reduce((acc, time, index) => {
    const timem = Math.round(time / 60);
    const ceil = intervals.find(interval => timem <= interval);
    if (ceil) {
      acc[ceil].push(destinations[index].location);
    }
    return acc;
  }, intervalGroups);

  return pointsByInterval;
};

const makePolygon = (points, interval, options) => {
  const concave = concaveman(points, options.concavity, options.lengthThreshold);

  const curved = bezier({
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: concave
    }
  }, options.resolution, options.sharpness);

  const ring = curved.geometry.coordinates.concat([curved.geometry.coordinates[0]]);

  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [ring]
    },
    properties: {
      time: parseFloat(interval)
    }
  };
};

const makeFeatures = (pointsByInterval, options) =>
  Object.keys(pointsByInterval).reduce((acc, interval) => {
    const points = pointsByInterval[interval];
    if (points.length >= 3) {
      acc.push(makePolygon(points, interval, options));
    }
    return acc;
  }, []);

/**
 * Isochrone options
 *
 * @typedef {Object} isochroneOptions
 * @property {Object} osrm - node-osrm instance
 * @property {number} bufferSize - buffer size
 * @property {number} cellWidth - cellWidth as in
 * [turf-point-grid](https://github.com/Turfjs/turf-point-grid)
 * @property {Array.<number>} intervals - intervals for isochrones in minutes
 * @property {number} concavity - relative measure of concavity as in
 * [concaveman](https://github.com/mapbox/concaveman)
 * @property {number} lengthThreshold - length threshold as in
 * [concaveman](https://github.com/mapbox/concaveman)
 * @property {number} resolution - turf-bezier time in milliseconds between points as in
 * [turf-bezier](https://github.com/Turfjs/turf-bezier)
 * @property {number} sharpness - a measure of how curvy the path should be between splines as in
 * [turf-bezier](https://github.com/Turfjs/turf-bezier)
 * @property {string} units - either `kilometers` or `miles` as in
 * [turf-point-grid](https://github.com/Turfjs/turf-point-grid)
 */

/**
 * Build isochrone using source point and options
 *
 * @name isochrone
 * @param {Array.<float>} point source point [lng, lat]
 * @param {isochroneOptions} options object
 * @returns {Promise} promise with GeoJSON when resolved
 */
export default (startPoint, options) => {
  const endPoints = makeGrid(startPoint, options);
  const coordinates = [startPoint].concat(endPoints);

  return new Promise((resolve, reject) => {
    options.osrm.table({ sources: [0], coordinates }, (error, table) => {
      if (error) {
        reject(error);
      }

      const travelTime = table.durations[0] || [];
      const pointsByInterval = groupByInterval(table.destinations, options.intervals, travelTime);

      let features;
      try {
        features = makeFeatures(pointsByInterval, options);
      } catch (e) {
        reject(e);
      }

      const featureCollection = { type: 'FeatureCollection', features };
      return resolve(featureCollection);
    });
  });
};
