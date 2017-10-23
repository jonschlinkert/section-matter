var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var sections = require('..');

var str = fs.readFileSync(path.join(__dirname, 'fixtures/basic.md'));
var result = sections(str);
console.log(result);
