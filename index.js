#!/usr/bin/env node

/* eslint-disable max-len */
const fs = require('fs');
const path = require('path');
const { docopt } = require('docopt');
const commands = require('./src/commands');
const defaults = require('./src/defaults.js');
const packagejson = require('./package.json');

const doc = `
Galton. Lightweight Node.js isochrone server.

Usage:
  galton extract [--useBestMatch] <name>
  galton build [--profile=<profileName>] <filename>
  galton run [options] (--sharedMemory | <filename>)
  galton extract build run [--useBestMatch --profile=<profileName>] [options] <name>
  galton -h | --help
  galton --version

Options:
  --cellSize=<cellSize>               Distance across each cell [default: ${defaults.cellSize}].
  --concavity=<concavity>             Concaveman relative measure of concavity [default: ${
    defaults.concavity
  }].
  --deintersect                       Whether or not to deintersect the final isochrones [default: ${
    defaults.deintersect
  }].
  --intervals=<intervals>             Isochrones intervals in minutes [default: ${
    defaults.intervals
  }].
  --lengthThreshold=<lengthThreshold> Concaveman length threshold [default: ${
    defaults.lengthThreshold
  }].
  --port=<port>                       Port to run on [default: 3000].
  --algorithm=<algorithm>             Algorithm used by OSRM (CH or MLD) [default: ${
    defaults.algorithm
  }].
  --radius=<radius>                   Isochrone buffer radius [default: ${defaults.radius}].
  --sharedMemory                      Use shared memory [default: ${defaults.sharedMemory}].
  --units=<units>                     Either 'kilometers' or 'miles' [default: ${defaults.units}].
  --useBestMatch                      Geocoder will use the best match for the query
  -p --profile=<profileName>          OSRM profile name that will be used for graph building
  -h --help                           Show this screen.
  --version                           Show version.
`;

const args = docopt(doc, { version: packagejson.version });

const main = async () => {
  let extractPath;
  if (args.extract) {
    try {
      const name = args['<name>'];
      const useBestMatch = args['--useBestMatch'];
      extractPath = await commands.extract(name, useBestMatch);
    } catch (error) {
      process.stderr.write(`${error.message}\n`);
      process.exit(-1);
    }
  }

  let graphPath;
  if (args.build) {
    try {
      extractPath = args['<filename>'] || extractPath;
      extractPath = path.isAbsolute(extractPath)
        ? extractPath
        : path.join(process.cwd(), extractPath);

      fs.accessSync(extractPath, fs.R_OK);

      const profileName = args['--profile'];
      graphPath = await commands.build(extractPath, profileName);
    } catch (error) {
      process.stderr.write(`${error.message}\n`);
      process.exit(-1);
    }
  }

  if (args.run) {
    const sharedMemory = args['--sharedMemory'] || defaults.sharedMemory;

    if (!sharedMemory) {
      graphPath = args['<filename>'] || graphPath;
      graphPath = path.isAbsolute(graphPath) ? graphPath : path.join(process.cwd(), graphPath);
      fs.accessSync(graphPath, fs.R_OK);
    }

    const options = {
      osrmPath: graphPath,
      algorithm: args['--algorithm'] || defaults.algorithm,
      sharedMemory,
      port: parseInt(args['--port'], 10),
      radius: parseFloat(args['--radius']),
      cellSize: parseFloat(args['--cellSize']),
      concavity: parseFloat(args['--concavity']),
      lengthThreshold: parseFloat(args['--lengthThreshold']) || defaults.lengthThreshold,
      deintersect: args['--deintersect'],
      intervals: args['--intervals']
        .split(',')
        .map(parseFloat)
        .sort((a, b) => a - b)
    };
    try {
      commands.run(options);
    } catch (error) {
      process.stderr.write(`\n${error.message}\n`);
      process.exit(-1);
    }
  }
};

process.on('SIGINT', () => process.exit());
process.on('SIGTERM', () => process.exit());

main();
