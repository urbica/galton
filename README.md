# Galton

[![npm version](https://img.shields.io/npm/v/galton.svg)](https://www.npmjs.com/package/galton)
[![Build Status](https://travis-ci.org/urbica/galton.svg?branch=master)](https://travis-ci.org/urbica/galton)
[![npm downloads](https://img.shields.io/npm/dt/galton.svg)](https://www.npmjs.com/package/galton)

Lightweight Node.js isochrone server. Build isochrones using [OSRM](http://project-osrm.org/), [Turf](http://turfjs.org/) and [concaveman](https://github.com/mapbox/concaveman).

[Francis Galton](https://en.wikipedia.org/wiki/Francis_Galton) is the author of the first known isochrone map.

![Screenshot](https://raw.githubusercontent.com/urbica/galton/master/example.png)

## Installation

Galton requires node v7.6.0 or higher for ES2015 and async function support.

```
npm install -g galton
```

...or build from source

```shell
git clone https://github.com/urbica/galton.git
cd galton
npm install
npm run build
```

## Usage

```shell
Usage: galton [filename] [options]

where [filename] is path to OSRM data and [options] is any of:
  --radius - distance to draw the buffer (default: 6)
  --cellSize - the distance across each cell (default: 0.2)
  --concavity - concaveman relative measure of concavity (default: 2)
  --deintersect - whether or not to deintersect the final isochrones (default: true)
  --intervals - isochrones intervals in minutes (default: 10 20 30)
  --lengthThreshold - concaveman length threshold (default: 0)
  --pid - save PID to file
  --port - port to run on (default: 4000)
  --sharedMemory - use shared memory (default: false)
  --socket - use Unix socket instead of port
  --units - either `kilometers` or `miles` (default: kilometers)
  --version - returns running version then exits
```

```
galton moscow_russia.osrm
```

Open `examples/index.html?access_token=<token>`

## Example

```shell
cd galton
wget https://s3.amazonaws.com/metro-extracts.mapzen.com/moscow_russia.osm.pbf
./node_modules/osrm/lib/binding/osrm-extract -p ./node_modules/osrm/profiles/car.lua moscow_russia.osm.pbf
./node_modules/osrm/lib/binding/osrm-contract moscow_russia.osrm
npm start -- moscow_russia.osrm
```

Build isochrones from point

```shell
curl http://localhost:4000 --get --data 'lng=37.62&lat=55.75'
```

Build isochrones for 10, 20 and 30 minute intervals

```
curl http://localhost:4000 --get --data 'lng=37.62&lat=55.75&intervals=10&intervals=20&&intervals=30'
```

Using Galton in your Node.js application

```js
const galton = require('galton');

const config = {
  port: 4000,
  osrm: 'moscow_russia.osrm'
}

const app = galton(config);
app.listen(config.port, () => {
  console.log('Listening on %s', config.port);
});
```

See the [example](https://github.com/urbica/galton/blob/master/examples/index.html), [API](https://github.com/urbica/galton/blob/master/API.md) and `test/index.js` for more info.

## Using with Docker

```shell
docker run -d -p 4000:4000 urbica/galton <url> <profile>
```

Where `url` is osm.pbf url and `profile` is one of the default OSRM profiles (`foot` is default).

Examples:

This will create docker container with last version of galton using osrm with mapzen extract processed with default car profile

```shell
docker run -d -p 4000:4000 urbica/galton "https://s3.amazonaws.com/metro-extracts.mapzen.com/moscow_russia.osm.pbf" car
```

```shell
curl http://localhost:4000 --get --data 'lng=37.62&lat=55.75'
```

You can also set `sysctl` options for container with `--sysctl`

```shell
docker run \
  -d \
  -p 4000:4000 \
  --sysctl "kernel.shmmax=18446744073709551615"
  urbica/galton "https://s3.amazonaws.com/metro-extracts.mapzen.com/moscow_russia.osm.pbf" car
```
