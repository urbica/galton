/* @flow */

import OSRM from 'osrm';

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
export type IsochroneOptionsType = {
  bufferSize: number,
  cellWidth: number,
  concavity: number,
  intervals: Array<number>,
  lengthThreshold: number,
  osrm: OSRM,
  resolution: number,
  sharpness: number,
  units: string
};

/**
 * Server configuration
 *
 * @typedef {Object} serverConfig
 * @property {string} osrmPath - path to *.osrm file
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
export type ServerConfigType = {
  bufferSize: number,
  cellWidth: number,
  concavity: number,
  intervals: Array<number>,
  lengthThreshold: number,
  osrmPath: string,
  resolution: number,
  sharedMemory: boolean,
  sharpness: number,
  units: string
};
