# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="5.19.0-beta.1"></a>
# [5.19.0-beta.1](https://github.com/urbica/galton/compare/v5.19.0-beta.0...v5.19.0-beta.1) (2018-10-30)


### Bug Fixes

* added support for different OSRM routing algorithms (@MichielDeMey) ([6fa22bc](https://github.com/urbica/galton/commit/6fa22bc))
* close process on SIGINT and SIGTERM ([93f8813](https://github.com/urbica/galton/commit/93f8813))
* fix docker image ([7dbb3b7](https://github.com/urbica/galton/commit/7dbb3b7))
* use node:8-slim as baseimage ([69e1393](https://github.com/urbica/galton/commit/69e1393))



## Changelog

### 5.16.4

* Update to `osrm` [v5.16.6](https://github.com/Project-OSRM/osrm-backend/releases/tag/v5.16.4)

### 5.15.1

* Rewrite using plain NodeJS
* Update to `osrm` [v5.15.1](https://github.com/Project-OSRM/osrm-backend/releases/tag/v5.15.1)

### 5.10.0

* Update to `osrm` [v5.10.0](https://github.com/Project-OSRM/osrm-backend/releases/tag/v5.10.0)

### 5.9.2

* Update to `osrm` v5.9.2

### 5.9.1

* Update to `osrm` v5.9.1

### 5.9.0-rc.2

* Update to `osrm` v5.9.0-rc.2
* Omit unroutable points from isochrones (by [@glifchits](https://github.com/glifchits))

### 5.9.0-rc.1

* Update to `osrm` v5.9.0-rc.1
* Implement deintersect as a configurable option (by [@glifchits](https://github.com/glifchits))

### 5.7.3

* Update to `osrm` v5.7.3

### 5.7.0

* Update to `osrm` v5.7.0

### 5.6.5

* Update to `osrm` v5.6.5

### 5.6.4

* Update to `osrm` v5.6.4
* Simplify Docker image

### 5.6.3

* Update to `osrm` v5.6.3

### 5.6.2

* Update to `osrm` v5.6.2

### 5.6.1

* Update to `osrm` v5.6.1

### 5.6.0

* Update to `osrm` v5.6.0

### 5.5.4

* Update to `osrm` v5.5.4
* Simplify docker image

### 5.5.3

* Update to `osrm` v5.5.3

### 5.5.2

* Switch to version 5.5.2 to match `node-osrm` version
* Update to `osrm` v5.5.2

### 1.3.10

* Update to `osrm` v5.4.3

### 1.3.9

* Update to `osrm` v5.4.2

### 1.3.8

* ETag support
* GZIP compression support

### 1.3.7

* Update to `osrm` v5.4.1

### 1.3.6

* Update to `osrm` v5.4.0

### 1.3.5

* Update `concaveman` to v1.1.1

### 1.3.4

* Update to `osrm` v5.3.3

### 1.3.3

* Fix npm postinstall build issue

### 1.3.2

* Fix npm postinstall build issue

### 1.3.0

* Prebuild galton on publish
* Strict node usage to version 4

### 1.2.10

* Update to `osrm` v5.3.2

### 1.2.9

* Update to `osrm` v5.3.1

### 1.2.8

* Update to `osrm` v5.3.0

### 1.2.7

* Add cURL examples

### 1.2.6

* Updated `osrm` to v5.2.6 release

### 1.2.5

* Update dependencies

### 1.2.4

* Update example
* Fix default settings bug

### 1.2.3

* Improve documentation
* Support flow type annotations

### 1.2.2

* Galton moved to Urbica Design organization

### 1.2.1

* Updated `osrm` to v5.1.1 release

### 1.2.0

* Updated `osrm` to v5.1.0 release
* Use separate turf modules instead of the whole package
* OSRM data path is now positional argument in CLI
* Rename `cellSize` argument to `cellWidth`
* Set default `concavity` value to 2
* Concave polygons are now processed with Bezier spline algorithm
* New arguments - `resolution` and `sharpness` used in building Bezier spline
* Galton now accepts isochrone parameters on query

### 1.1.0

* Updated `osrm` to v5.0.2 release

### 1.0.0

* Initial release
