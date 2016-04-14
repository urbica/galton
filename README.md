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

```
node index.js --osrmPath moscow_russia.osrm
curl "http://localhost:4000/?lng=37.61701583862305&lat=55.750931611695684"
```

See the [API](https://github.com/stepankuzmin/galton/blob/master/docs/API.md) and `test/index.js` for examples.