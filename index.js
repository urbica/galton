#!/usr/bin/env node

require('babel-register');
require('babel-polyfill');

var fs = require('fs');
var App = require('./src/index');
var npid = require('npid');
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
    bufferSize: 6,
    cors: true,
    cellSize: 0.2,
    concavity: 10,
    intervals: '5 10 15 20 25 30',
    lengthThreshold: 0,
    port: 4000,
    units: 'kilometers'
  }
});

if (config.version) {
  console.log(packagejson.version);
  process.exit(0);
};

if (config.help) {
  var usage = [
      ''
    , '  Usage: galton [options]'
    , ''
    , '  where [options] is any of:'
    , '    --bufferSize - turf-point-grid bufferSize (default: ' + config.bufferSize + ')'
    , '    --cellSize - turf-point-grid cellSize (default: ' + config.cellSize + ')'
    , '    --concavity - concaveman concavity (default: ' + config.concavity + ')'
    , '    --intervals - isochrones intervals in minutes (default: ' + config.intervals + ')'
    , '    --lengthThreshold - concaveman lengthThreshold (default: ' + config.lengthThreshold + ')'
    , '    --osrmPath - osrm data path'
    , '    --pid - PID file'
    , '    --port - Port to run on (default: ' + config.port + ')'
    , '    --socket - Unix socket'
    , '    --units - either `kilometers` or `miles` (default: ' + config.units + ')'
    , '    --version - Returns running version then exits'
    , ''
    , 'galton@' + packagejson.version
    , 'node@' + process.versions.node
  ].join('\n')
  console.log(usage);
  process.exit(0);
};

try {
  fs.accessSync(config.osrmPath, fs.F_OK);
} catch (error) {
  console.error(error);
  process.exit(-1);
}

if (config.pid) {
  try {
    var pid = npid.create(config.pid);
    pid.removeOnExit()
  } catch (error) {
    console.error(error.message);
    process.exit(-1);
  }
}

try {
  config.intervals = config.intervals.split(' ')
                                     .map(parseFloat)
                                     .sort(function(a, b) {
                                       return a - b;
                                      });
} catch (error) {
  console.error(error);
  process.exit(-1);
}

var app = App.default(config);
var handler = config.socket || config.port;

var server = app.listen(handler, function () {
  var endpoint;
  if (config.socket) {
    endpoint = config.socket;
    fs.chmodSync(config.socket, '1766');
  } else {
    endpoint = server.address().address + ':' + server.address().port;
  }
  console.log('🚀  ON AIR @ %s', endpoint);
});

// Catch SIGINT (Ctrl+C) to exit process
process.on('SIGINT', function () {
  console.warn('Caught SIGINT, terminating');
  server.close();
  process.exit();
});
