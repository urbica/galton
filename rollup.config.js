/* eslint-disable import/no-extraneous-dependencies */
import json from 'rollup-plugin-json';
import async from 'rollup-plugin-async';
// import uglify from 'rollup-plugin-uglify';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
// import { minify } from 'uglify-js';

export default {
  entry: 'src/server.js',
  dest: 'dist/bundle.js',
  plugins: [
    json(),
    nodeResolve({
      main: true,
      jsnext: true,
      skip: ['osrm', 'concaveman', 'graceful-fs']
    }),
    commonjs(),
    async()
    // uglify({}, minify)
  ],
  format: 'cjs'
};
