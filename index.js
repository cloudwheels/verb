/**
 * phaser <https://github.com/jonschlinkert/phaser>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var util      = require('util');

// node_modules
var chalk     = require('chalk');
var file      = require('fs-utils');
var glob      = require('globule');
var _         = require('lodash');

var success   = chalk.green;
var error     = chalk.red;

// Internal libs
var utils     = require('./lib/utils');
var lib       = require('./lib');
var template  = lib.template;
var mixins    = lib.mixins;
var functions = lib.functions;
var matter    = lib.matter;


/**
 * Phaser
 */

var phaser = function(src, options) {
  var opts = _.extend({verbose: false}, options);

  // Initialize modules
  var config    = lib.config.init(opts.config);
  var data      = lib.data.init(opts);
  // var functions = lib.functions.init(opts);

  // Extract and parse front matter
  var page      = matter(src, opts);
  var content   = page.content;
  var metadata  = page.context;

  // Build up the context
  var context = _.extend({}, config, opts, data);
  delete context.config;

  // Add Table of Contents to templates with: {%= toc %}
  context.toc = utils.toc(content);

  // Initialize mixins
  mixins.init(config, opts, {
    context: _.cloneDeep(context),
    page: page
  });

  // Initialize functions
  var fn = functions.init(config, opts, {
    context: _.cloneDeep(context),
    page: page
  });

  // Extend context with custom functions and filters,
  // but we won't pass these back in the JSON result.
  var fnContext = _.defaults({}, metadata, fn, context);
  // console.log(util.inspect(fnContext, 10, 2));

  // Process templates and render content
  var settings = _.defaults({}, opts.settings);
  var rendered = template(content, fnContext, settings);
  var result = utils.headings(utils.postProcess(rendered, opts));

  return {
    context: context,
    content: result,
    original: src
  };
};

// Alias for phaser(src).content;
phaser.process = function(src, options) {
  return phaser(src, _.extend({}, options)).content;
};

phaser.read = function(src, options) {
  var content = file.readFileSync(src);
  return phaser.process(content, _.extend({}, options));
};

phaser.copy = function(src, dest, options) {
  var opts = _.extend({}, options);
  file.writeFileSync(dest, phaser.read(src, opts));
};

phaser.expand = function(src, dest, options) {
  var opts = _.extend({}, options);

  utils.expandMapping(src, dest, opts.glob).map(function(fp) {
    file.writeFileSync(fp.dest, phaser.read(fp.src, opts));
    console.log(success('>> Saved to:'), fp.dest);
  });
  console.log(success('\n>> Completed successfully.'));
};

module.exports = phaser;