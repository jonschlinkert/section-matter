'use strict';

var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var sections = require('..');
var str = fs.readFileSync(path.join(__dirname, 'fixtures', 'sections.md'));

var opts = {
  parse: function(section, file) {
    if (typeof section.data === 'string' && section.data.trim() !== '') {
      section.data = yaml.safeLoad(section.data.trim());
    }
    section.content = section.content.trim();
    console.log(section);
    console.log();
    console.log();
  }
};

var res = sections(str, opts);
console.log(res);
