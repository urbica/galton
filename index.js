require('babel-register');
require('babel-polyfill');

var fs = require('fs');
var App = require('./src/index');
var minimist = require('minimist');
var packagejson = require('./package.json');

var config = minimist(process.argv.slice(2), {
  string: [
    'bufferSize',
    'cellSize',
    'concavity',
    'intervals',
    'lengthThreshold',
    'osrmPath',
    'pid',
    'port',
    'socket',
    'units'
  ],
  boolean: ['cors'],
  alias: {
    h: 'help',
    v: 'version'
  },
  default: {
    bufferSize: 2,
    cors: true,
    cellSize: 0.1,
    concavity: 6,
    intervals: '1000 2000 3000 4000 5000 6000',
    lengthThreshold: 0,
    port: 4000,
    units: 'kilometers'
  }
});

try {
  config.intervals = config.intervals.split(' ').map(parseFloat).sort();
} catch (error) {
  console.error(error);
  process.exit(-1);
}

if (config.version) {
  console.log(packagejson.version);
  process.exit(0);
};

try {
  fs.accessSync(config.osrmPath, fs.F_OK);
} catch (error) {
  console.error(error);
  process.exit(-1);
}

var app = App.default(config);

var server = app.listen(config.port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('🚀  ON AIR @ %s:%s', host, port);
});

// Catch SIGINT (Ctrl+C) to exit process
process.on('SIGINT', function () {
  console.warn('Caught SIGINT, terminating');
  server.close();
  process.exit();
});
