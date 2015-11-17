'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('maxcdn', 'Interact with the MaxCDN API', function() {

    var done = this.async();
    var options = this.options();

    if (!options.zone_id) {
      grunt.fail.fatal('options.zone_id is mandatory');
      return done();
    }

    if (options.method !== 'delete') {
      grunt.fail.fatal('Sorry! Only delete method is supported.');
      return done();
    }

    var MaxCDN = require('maxcdn');
    var maxcdn = new MaxCDN(
      options.companyAlias,
      options.consumerKey,
      options.consumerSecret
    );

    grunt.log.writeln('Purging cache...');

    if (this.files) {

      var files = [];
      this.files.forEach(function(f) {
        grunt.log.writeln('\t' + f.dest);
        files.push(f.dest);
      });

      maxcdn.delete(
        'zones/pull.json/' + options.zone_id + '/cache',
        {
          files: files
        },
        function(err, response) {
          if (err) {
            grunt.log.error(JSON.stringify(err));
            return done();
          }

          console.log(JSON.stringify(response));
          done(true);
        });
    } else {
      maxcdn.delete(
        'zones/pull.json/' + options.zone_id + '/cache',
        function(err, response) {
          if (err) {
            grunt.log.error(JSON.stringify(err));
            return done();
          }

          console.log(JSON.stringify(response));
          done(true);
        });
    }
  });

};
