const numericParams = [
  'radius',
  'cellSize',
  'concavity',
  'lengthThreshold'
];

const booleanParams = [
  'deintersect'
];

const queryToOptions = (defaultOptions, query) => {
  const numericOptions = numericParams.reduce((acc, param) => {
    if (isNaN(query[param])) return acc;
    return Object.assign({}, acc, { [param]: parseFloat(query[param]) });
  }, defaultOptions);

  const booleanOptions = booleanParams.reduce((acc, param) => {
    if (typeof (query[param]) === 'undefined') return acc;
    return Object.assign({}, acc, { [param]: query[param] === 'true' });
  }, defaultOptions);

  let intervals;
  if (Array.isArray(query.intervals)) {
    intervals = query.intervals
      .filter(i => !isNaN(i))
      .map(parseFloat)
      .sort((a, b) => a - b);
  } else {
    const interval = parseFloat(query.intervals);
    intervals = interval ? [interval] : defaultOptions.intervals;
  }

  let units;
  if (query.units === 'kilometers' || query.units === 'miles') {
    units = query.units;
  } else {
    units = defaultOptions.units;
  }

  return Object.assign(
    {}, defaultOptions, numericOptions, booleanOptions, { intervals, units }
  );
};

module.exports = queryToOptions;
