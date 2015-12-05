'use strict';

var path = require('path');
var utils = require('./lib/utils');
var argv = require('minimist')(process.argv.slice(2), {
  alias: {v: 'verbose'}
});

module.exports = function(verb, base, env) {
  if (argv.init) {
    app.questions.options.forceAll = true;
  }

  var tasks = ['readme'];

  function handle(stage) {
    return utils.through.obj(function(file, enc, next) {
      if (file.isNull()) return next();
      app.handle(stage, file, next);
    });
  }

  verb.task('readme', function(cb) {
    verb.ask(function(err, answers) {
      if (err) return cb(err);

      verb.toStream('docs', function(key) {
        return key === '.verb';
      })
        .on('error', cb)
        .pipe(verb.renderFile('text', answers))
        .pipe(handle('onStream'))
        .on('error', cb)
        .pipe(app.pipeline(plugins))
        .pipe(handle('preWrite'))
        .on('error', cb)
        .pipe(verb.dest(dest('readme.md')))
        .pipe(utils.exhaust(handle('postWrite')))
        .on('error', cb)
        .on('finish', cb);
    });
  });

  verb.task('readme', function(cb) {
    verb.ask(function(err, answers) {
      if (err) return cb(err);

      verb.toStream('docs', function(key) {
          return key === '.verb';
        })
        .pipe(verb.renderFile('text', answers))
        .pipe(verb.dest(dest('readme.md')))
        .on('finish', cb);
    });
  });

  verb.task('docs', function(cb) {
    verb.ask(function(err, answers) {
      if (err) return cb(err);

      verb.toStream('docs')
        .on('error', cb)
        .pipe(verb.renderFile('text', answers))
        .on('error', cb)
        .pipe(verb.dest(dest('readme.md')))
        .on('finish', cb);
    });
  });

  verb.register('store', function(app, base) {
    app.task('del', function(cb) {
      verb.store.del({force: true});
      console.log('deleted store.');
      cb();
    });
  });

  verb.task('default', tasks);
};

/**
 * Rename template files
 */

function dest(dest) {
  return function(file) {
    file.base = path.dirname(dest);
    file.path = dest;
    file.basename = file.basename.replace(/^_/, '.');
    file.basename = file.basename.replace(/^\$/, '');
    return file.base;
  };
}
