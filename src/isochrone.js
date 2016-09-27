/* @flow */

import bezier from 'turf-bezier';
import concaveman from 'concaveman';
import destination from 'turf-destination';
import featureCollection from 'turf-featurecollection';
import pointGrid from 'turf-point-grid';
import type { IsochroneOptionsType } from './types';

/**
 * Build isochrone using source point and options
 *
 * @name isochrone
 * @param {Array.<float>} point source point [lng, lat]
 * @param {isochroneOptions} options object
 * @returns {Promise} promise with GeoJSON when resolved
 */
export default ([lng, lat]: [number, number], options: IsochroneOptionsType) => {
  const point = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [lng, lat]
    }
  };
  const sw = destination(point, options.bufferSize / 2, 225, options.units);
  const ne = destination(point, options.bufferSize / 2, 45, options.units);
  const extent = sw.geometry.coordinates.concat(ne.geometry.coordinates);
  const grid = pointGrid(extent, options.cellWidth, options.units);

  const points = grid.features.map(({ geometry: { coordinates } }) => coordinates);

  const intervalGroups = options.intervals.reduce((acc, interval) =>
    Object.assign({}, acc, { [interval]: [] })
  , {});

  const coordinates = [[lng, lat]].concat(points);

  return new Promise((resolve, reject) => {
    options.osrm.table({ sources: [0], coordinates }, (error, table) => {
      if (error) reject(error);
      const travelTime = table.durations[0] || [];

      const pointsByInterval = travelTime.reduce((acc, time, index) => {
        const timem = Math.round(time / 60);
        const ceil = options.intervals.find(interval => timem <= interval);
        if (ceil) {
          acc[ceil].push(table.destinations[index].location);
        }
        return acc;
      }, intervalGroups);

      const features = Object.keys(pointsByInterval).map((interval) => {
        let polygon;
        try {
          if (pointsByInterval[interval].length >= 3) {
            const concave = concaveman(pointsByInterval[interval],
              options.concavity, options.lengthThreshold);

            const curved = bezier({
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: concave
              }
            }, options.resolution, options.sharpness);

            const ring = curved.geometry.coordinates.concat([
              curved.geometry.coordinates[0]
            ]);

            polygon = {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [ring]
              },
              properties: {
                time: parseFloat(interval)
              }
            };
          }
        } catch (e) {
          reject(e);
        }
        return polygon;
      }).filter(feature => !!feature);

      return resolve(featureCollection(features));
    });
  });
};
