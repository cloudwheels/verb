/**
 * phaser <https://github.com/jonschlinkert/phaser>
 * The most deadly markdown documentation generator in the Alpha Quadrant.
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('lodash');

module.exports = function(phaser) {
  var phaserOpts = _.extend({}, phaser.options);

  exports.shortname = function (name, options) {
    var opts = _.extend({}, phaserOpts, options);
    return phaser.utils.safename(name, opts);
  };

  return exports;
};