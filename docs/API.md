# isochrone

Build isochrone

**Parameters**

-   `point` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;float>** source point [lng, lat]
-   `options` **Options** object

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** promise with GeoJSON when resolved

# Options

Options

**Properties**

-   `osrm` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** node-osrm instance
-   `bufferSize` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** bufferSize as in
    [turf-point-grid](https://github.com/Turfjs/turf-point-grid)
-   `cellSize` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** cellSize as in
    [turf-point-grid](https://github.com/Turfjs/turf-point-grid)
-   `units` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** either `kilometers` or `miles` as in
    [turf-point-grid](https://github.com/Turfjs/turf-point-grid)
-   `intervals` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** intervals for isochrones in minutes
-   `concavity` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** concavity as in
    [concaveman](https://github.com/mapbox/concaveman)
-   `lengthThreshold` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** lengthThreshold as in
    [concaveman](https://github.com/mapbox/concaveman)
