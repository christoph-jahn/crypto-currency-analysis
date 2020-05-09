'use strict';

module.exports = {
  diff: true,
  extension: ['js'],
  package: './package.json',
  reporter: 'spec',
  ui: 'bdd',
  require: 'esm',
  'watch-files': ['src/**/*.spec.js']
}
