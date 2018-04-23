# Galton

[![npm version](https://img.shields.io/npm/v/galton.svg)](https://www.npmjs.com/package/galton)
[![npm downloads](https://img.shields.io/npm/dt/galton.svg)](https://www.npmjs.com/package/galton)
[![Build Status](https://travis-ci.org/urbica/galton.svg?branch=master)](https://travis-ci.org/urbica/galton)
[![Greenkeeper badge](https://badges.greenkeeper.io/urbica/galton.svg)](https://greenkeeper.io/)

Lightweight Node.js isochrone server. Build isochrones using [OSRM](http://project-osrm.org/), [Turf](http://turfjs.org/) and [concaveman](https://github.com/mapbox/concaveman).

[Francis Galton](https://en.wikipedia.org/wiki/Francis_Galton) is the author of the first known isochrone map.

![Screenshot](https://raw.githubusercontent.com/urbica/galton/master/example.png)

## Installation

Galton requires Node v8.

```
npm install -g galton
```

...or build from source

```shell
git clone https://github.com/urbica/galton.git
cd galton
npm install
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
galton berlin-latest.osrm
```

Open `examples/index.html?access_token=<token>`

## Example

```shell
cd galton
wget http://download.geofabrik.de/europe/germany/berlin-latest.osm.pbf
./node_modules/osrm/lib/binding/osrm-extract -p ./node_modules/osrm/profiles/car.lua berlin-latest.osm.pbf
./node_modules/osrm/lib/binding/osrm-contract berlin-latest.osrm
npm start berlin-latest.osrm
```

Build isochrones from point

```shell
curl http://localhost:4000 --get --data 'lng=13.38792&lat=52.51704'
```

Build isochrones for 10, 20 and 30 minute intervals

```
curl http://localhost:4000 --get --data 'lng=13.38792&lat=52.51704&intervals=10&intervals=20&&intervals=30'
```

See the [example](https://github.com/urbica/galton/blob/master/examples/index.html), [API](https://github.com/urbica/galton/blob/master/API.md) and `test/index.js` for more info.

## Using with Docker

```shell
docker run -p 4000:4000 urbica/galton <OSRM>
```

Where `OSRM` is a path to OSRM graph.

Examples:

This will download geofabrik extract, extract and build OSRM graph using [official OSRM Docker image](https://hub.docker.com/r/osrm/osrm-backend/), and run galton on that graph.

```shell
wget http://download.geofabrik.de/europe/germany/berlin-latest.osm.pbf
docker run -t -v $(pwd):/data osrm/osrm-backend:v5.17.2 osrm-extract -p /opt/car.lua /data/berlin-latest.osm.pbf
docker run -t -v $(pwd):/data osrm/osrm-backend:v5.17.2 osrm-contract /data/berlin-latest.osrm
docker run -t -i -p 4000:4000 -v $(pwd):/data urbica/galton:v5.17.2 galton /data/berlin-latest.osrm
```

```shell
curl http://localhost:4000 --get --data 'lng=13.38792&lat=52.51704'
```

## Running tests

```shell
make test
```
