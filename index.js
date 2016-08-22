#!/usr/bin/env node

var fs = require('fs');
var App = require('./lib/server');
var npid = require('npid');
var minimist = require('minimist');
var packagejson = require('./package.json');

var defaults = App.defaults;
var config = minimist(process.argv.slice(2), {
  string: [
    'bufferSize',
    'cellWidth',
    'concavity',
    'intervals',
    'lengthThreshold',
    'pid',
    'port',
    'resolution',
    'sharpness',
    'socket',
    'units'
  ],
  boolean: ['cors', 'sharedMemory'],
  alias: {
    h: 'help',
    v: 'version'
  },
  default: {
    bufferSize: defaults.bufferSize,
    cellWidth: defaults.cellWidth,
    concavity: defaults.concavity,
    cors: true,
    intervals: '5 10 15 20 25 30',
    lengthThreshold: defaults.lengthThreshold,
    port: 4000,
    resolution: defaults.resolution,
    sharedMemory: false,
    sharpness: defaults.sharpness,
    units: defaults.units
  }
});

if (config.version) {
  console.log(packagejson.version);
  process.exit(0);
};

if (config.help) {
  var usage = [
      ''
    , '  Usage: galton [filename] [options]'
    , ''
    , '  where [filename] is path to OSRM data and [options] is any of:'
    , '    --bufferSize - buffer size (default: ' + config.bufferSize + ')'
    , '    --cellWidth - turf-point-grid distance across each cell (default: ' + config.cellWidth + ')'
    , '    --concavity - concaveman relative measure of concavity (default: ' + config.concavity + ')'
    , '    --intervals - isochrones intervals in minutes (default: ' + config.intervals + ')'
    , '    --lengthThreshold - concaveman length threshold (default: ' + config.lengthThreshold + ')'
    , '    --pid - save PID to file'
    , '    --port - port to run on (default: ' + config.port + ')'
    , '    --resolution - turf-bezier time in milliseconds between points (default: ' + config.resolution + ')'
    , '    --sharedMemory - use shared memory (default: ' + config.sharedMemory + ')'
    , '    --sharpness - turf-bezier measure of how curvy the path should be between splines (default: ' + config.sharpness + ')'
    , '    --socket - use Unix socket instead of port'
    , '    --units - either `kilometers` or `miles` (default: ' + config.units + ')'
    , '    --version - returns running version then exits'
    , ''
    , 'galton@' + packagejson.version
    , 'node@' + process.versions.node
  ].join('\n')
  console.log(usage);
  process.exit(0);
};

try {
  config.osrmPath = config['_'][0];
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

config.bufferSize = parseFloat(config.bufferSize)
config.cellWidth = parseFloat(config.cellWidth)
config.concavity = parseFloat(config.concavity)
config.lengthThreshold = parseFloat(config.lengthThreshold)
config.resolution = parseFloat(config.resolution)
config.sharpness = parseFloat(config.sharpness)

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
