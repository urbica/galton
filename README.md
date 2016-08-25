# Galton

[![Build Status](https://travis-ci.org/urbica/galton.svg?branch=master)](https://travis-ci.org/urbica/galton)

Lightweight Node.js isochrone server. Build isochrones using [OSRM](http://project-osrm.org/), [Turf](http://turfjs.org/) and [concaveman](https://github.com/mapbox/concaveman).

[Francis Galton](https://en.wikipedia.org/wiki/Francis_Galton) is the author of the first known isochrone map.

![Screenshot](https://raw.githubusercontent.com/urbica/galton/master/example.png)

## Installation

Galton depends on node version 4.

```
npm install galton
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
  --bufferSize - buffer size (default: 6)
  --cellWidth - turf-point-grid distance across each cell (default: 0.2)
  --concavity - concaveman relative measure of concavity (default: 2)
  --intervals - isochrones intervals in minutes (default: 5 10 15 20 25 30)
  --lengthThreshold - concaveman length threshold (default: 0)
  --pid - save PID to file
  --port - port to run on (default: 4000)
  --resolution - turf-bezier time in milliseconds between points (default: 10000)
  --sharedMemory - use shared memory (default: false)
  --sharpness - turf-bezier measure of how curvy the path should be between splines (default: 0.85)
  --socket - use Unix socket instead of port
  --units - either `kilometers` or `miles` (default: kilometers)
  --version - returns running version then exits
```

```
node index.js moscow_russia.osrm
open examples/index.html?access_token=<token>
```

## Examples

Build isochrones from point

```shell
curl http://localhost:4000 --get --data 'lng=37.62&lat=55.75'
```

Build isochrones for 10, 20 and 30 minute intervals

```
curl http://localhost:4000 --get --data 'lng=37.62&lat=55.75&intervals[]=10&intervals[]=20&&intervals[]=30'
```

See the [example](https://github.com/urbica/galton/blob/master/examples/index.html), [API](https://github.com/urbica/galton/blob/master/docs/API.md) and `test/index.js` for more info.