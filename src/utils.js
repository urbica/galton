const defaults = require('./defaults.js');

const parseBoolean = boolean => boolean === 'true';

const parseIntervals = (intervals) => {
  if (Array.isArray(intervals)) {
    return intervals
      .filter(i => !isNaN(i))
      .map(parseFloat)
      .sort((a, b) => a - b);
  }
  const interval = parseFloat(intervals);
  return interval ? [interval] : defaults.intervals;
};

const parseUnits = (units) => {
  if (units === 'kilometers' || units === 'miles') {
    return units;
  }
  return defaults.units;
};

const parsers = {
  lng: parseFloat,
  lat: parseFloat,
  radius: parseFloat,
  cellSize: parseFloat,
  concavity: parseFloat,
  lengthThreshold: parseFloat,
  deintersect: parseBoolean,
  intervals: parseIntervals,
  units: parseUnits
};

const parseQuery = query =>
  Object.keys(parsers).reduce((acc, paramKey) => {
    if (query[paramKey]) {
      const parser = parsers[paramKey];
      acc[paramKey] = parser(query[paramKey]);
    }
    return acc;
  }, Object.assign({}, defaults));

module.exports = parseQuery;
