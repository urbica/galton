# Galton

[![Build Status](https://travis-ci.org/stepankuzmin/galton.svg?branch=master)](https://travis-ci.org/stepankuzmin/galton)

Lightweight Node.js isochrone map server. Build isochrone map using [OSRM](http://project-osrm.org/), [Turf](http://turfjs.org/) and [concaveman](https://github.com/mapbox/concaveman).

[Francis Galton](https://en.wikipedia.org/wiki/Francis_Galton) is the author of the first known isochrone map.

## Installation

```
npm install galton
```

...or build from source

```shell
git clone https://github.com/stepankuzmin/galton.git
cd galton
npm install
```

## Usage

```shell
Usage: galton [options]

where [options] is any of:
  --bufferSize - turf-point-grid bufferSize (default: 2)
  --cellSize - turf-point-grid cellSize (default: 0.1)
  --concavity - concaveman concavity (default: 10)
  --intervals - intervals for isochrones in 10th of a second (default: 1000 2000 3000 4000 5000 6000)
  --lengthThreshold - concaveman lengthThreshold (default: 0)
  --osrmPath - osrm data path
  --pid - PID file
  --port - Port to run on (default: 4000)
  --socket - Unix socket
  --units - either `kilometers` or `miles` (default: kilometers)
  --version - Returns running version then exits
```

```
node index.js --osrmPath moscow_russia.osrm
open examples/index.html
```

See the [API](https://github.com/stepankuzmin/galton/blob/master/docs/API.md) and `test/index.js` for examples.