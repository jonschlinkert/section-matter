'use strict';

var isObject = require('isobject');
var extend = require('extend-shallow');

module.exports = function(input, options) {
  if (typeof options === 'function') {
    options = { parse: options };
  }

  var opts = extend({section_separator: '---', parse: identity}, options);
  var file =  toObject(input);
  var lines = file.content.split(/\r?\n/);
  var sections = false;
  var section = { key: '', data: {}, content: '' };
  var content = [];
  var stack = [];
  var data = [];

  function closeSection() {
    if (stack.length) {
      section.key = stack[0].slice(3).trim();
      section.content = content.join('\n');
      opts.parse(section, file);
      file.sections.push(section);
      section = { key: '', data: {}, content: '' }
      content = [];
      stack = [];
    }
  }

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var len = stack.length;
    var ln = line.trim();

    if (isDelimiter(ln, opts.section_separator)) {
      if (ln.length === 3) {
        if (len === 0 || len === 2) {
          content.push(line);
          continue;
        }
        stack.push(ln);
        section.data = content.join('\n');
        content = [];
        continue;
      }

      if (sections === false) {
        sections = true;
        file.content = content.join('\n');
        content = [];
      }

      if (len === 2) {
        closeSection();
      }

      stack.push(ln);
      continue;
    }

    content.push(line);
  }

  closeSection();
  return file;
};

function toObject(input) {
  if (!isObject(input)) {
    return { content: input, sections: [] };
  }
  input.sections = [];
  return input;
}

function isDelimiter(line, delim) {
  if (line.slice(0, delim.length) !== delim) {
    return false;
  }
  if (line.charAt(delim.length + 1) === delim.slice(-1)) {
    return false;
  }
  return true;
}

function clone(obj) {
  return Object.assign({}, obj);
}

function identity(val) {
  return val;
}
