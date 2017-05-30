/* eslint-disable import/no-extraneous-dependencies */

import json from 'rollup-plugin-json';
import async from 'rollup-plugin-async';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'src/server.js',
  dest: 'dist/bundle.js',
  external: [
    'koa-compress',
    'kcors',
    'koa-etag',
    'koa-conditional-get',
    'koa',
    'koa-logger',
    'osrm'
  ],
  plugins: [
    json(),
    resolve({ jsnext: true, main: true }),
    commonjs(),
    async()
  ],
  format: 'cjs'
};
