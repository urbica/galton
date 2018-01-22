#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const galton = require('./src');
const defaults = require('./src/defaults.js');
const minimist = require('minimist');
const packagejson = require('./package.json');

const config = minimist(process.argv.slice(2), {
  string: [
    'radius',
    'cellSize',
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
  boolean: ['cors', 'deintersect', 'sharedMemory'],
  alias: {
    h: 'help',
    v: 'version'
  },
  default: {
    radius: defaults.radius,
    cellSize: defaults.cellSize,
    concavity: defaults.concavity,
    cors: true,
    deintersect: 'true',
    intervals: '10 20 30',
    lengthThreshold: defaults.lengthThreshold,
    port: 4000,
    sharedMemory: false,
    units: defaults.units
  }
});

if (config.version) {
  process.stdout.write(`${packagejson.version}\n`);
  process.exit(0);
}

if (config.help) {
  const usage = `
  Usage: galton [filename] [options]

  where [filename] is path to OSRM data and [options] is any of:
    --radius - distance to draw the buffer (default: ${config.radius})
    --cellSize - the distance across each cell (default: ${config.cellSize})
    --concavity - concaveman relative measure of concavity (default: ${config.concavity})
    --deintersect - whether or not to deintersect the final isochrones (default: ${
  config.deintersect
})
    --intervals - isochrones intervals in minutes (default: ${config.intervals})
    --lengthThreshold - concaveman length threshold (default: ${config.lengthThreshold})
    --pid - save PID to file
    --port - port to run on (default: ${config.port})
    --sharedMemory - use shared memory (default: ${config.sharedMemory})
    --socket - use Unix socket instead of port
    --units - either 'kilometers' or 'miles' (default: '${config.units}')
    --version - returns running version then exits

  galton@${packagejson.version}
  node@${process.versions.node}
  `;
  process.stdout.write(`${usage}\n`);
  process.exit(0);
}

try {
  // eslint-disable-next-line
  config.osrmPath = config._[0];
  fs.accessSync(config.osrmPath, fs.F_OK);
} catch (error) {
  process.stderr.write(`${error}\n`);
  process.exit(-1);
}

try {
  config.intervals = config.intervals
    .split(' ')
    .map(parseFloat)
    .sort((a, b) => a - b);
} catch (error) {
  process.stderr.write(`${error}\n`);
  process.exit(-1);
}

config.radius = parseFloat(config.radius);
config.cellSize = parseFloat(config.cellSize);
config.concavity = parseFloat(config.concavity);
config.deintersect = config.deintersect === 'true';
config.lengthThreshold = parseFloat(config.lengthThreshold);

const app = galton(config);
const handler = config.socket || config.port;

const server = http.createServer(app);
server.listen(handler, () => {
  if (config.socket) {
    fs.chmodSync(config.socket, '1766');
    process.stdout.write(`🚀  ON AIR @ ${config.socket}\n`);
  } else {
    const address = server.address();
    process.stdout.write(`🚀  ON AIR @ ${address.address}:${address.port}\n`);
  }
});

const shutdown = (signal) => {
  process.stdout.write(`Caught ${signal}, terminating\n`);
  server.close();
  process.exit();
};

process.on('SIGINT', shutdown.bind(null, 'SIGINT'));
process.on('SIGTERM', shutdown.bind(null, 'SIGTERM'));
