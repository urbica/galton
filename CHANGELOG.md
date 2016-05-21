## galton changelog

### 1.2.1

 - Updated `osrm` to v5.1.1 release

### 1.2.0

 - Updated `osrm` to v5.1.0 release
 - Use separate turf modules instead of the whole package
 - OSRM data path is now positional argument in CLI
 - Rename `cellSize` argument to `cellWidth`
 - Set default `concavity` value to 2
 - Concave polygons are now processed with Bezier spline algorithm
 - New arguments - `resolution` and `sharpness` used in building Bezier spline
 - Galton now accepts isochrone parameters on query

### 1.1.0

 - Updated `osrm` to v5.0.2 release

### 1.0.0

 - Initial release