var expect = require('chai').expect;
var file = require('fs-utils');

// Local libs
var phaser = require('../');

// console.log(phaser.process('{%= name %}'));

describe('options.config', function () {

  describe('when the default config object is not overridden:', function () {
    it('should extend the context with data from package.json', function () {
      var actual = phaser.process();
      var expected = file.readJSONSync('test/expected/config-default.json');
      actual = JSON.parse(JSON.stringify(actual));
      expect(actual.name).to.eql(expected.name);
    });
  });

  describe('when a custom config object is defined:', function () {
    it('should extend that data into the context, but not data from package.json', function () {
      var actual = phaser.process('', {
        config: {
          name: 'Custom Config',
          repository: {
            "type": "git",
            "url": "https://github.com/assemble/phaser.git"
          },
        }
      });
      actual = JSON.parse(JSON.stringify(actual));
      expect(actual.context.name).to.eql('Custom Config');
    });
  });
});