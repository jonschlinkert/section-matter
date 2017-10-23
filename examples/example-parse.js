var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var sections = require('..');

var str = fs.readFileSync(path.join(__dirname, 'fixtures/parse.md'));
var options = {
  section_parse: function(section) {
    console.log(section)
    section.key = 'section-' + section.key;
    section.data = yaml.safeLoad(section.data);
  }
};

var result = sections(str, options);
console.log(result);
