#!/usr/bin/env node

const fs = require('fs');
const galton = require('./src/server.js');
const minimist = require('minimist');
const packagejson = require('./package.json');

var defaults = galton.defaults;
const config = minimist(process.argv.slice(2), {
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
    intervals: '10 20 30',
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
  const usage = [
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

try {
  config.intervals = config.intervals
    .split(' ')
    .map(parseFloat)
    .sort((a, b) => a - b);
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

const app = galton.app(config);
const handler = config.socket || config.port;

const server = app.listen(handler, () => {
  if (config.socket) {
    fs.chmodSync(config.socket, '1766');
    console.log('🚀  ON AIR @ %s', config.socket);
  } else {
    const endpoint = server.address().address + ':' + server.address().port;
    console.log('🚀  ON AIR @ %s', endpoint);
  }
});

const shutdown = (server, signal) => {
  console.warn(`Caught ${signal}, terminating`);
  server.close();
  process.exit();
}

process.on('SIGINT', shutdown.bind(null, server, 'SIGINT'));
process.on('SIGTERM', shutdown.bind(null, server, 'SIGTERM'));
