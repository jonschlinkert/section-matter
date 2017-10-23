'use strict';

var isObject = require('isobject');

module.exports = function(file, fn) {
  if (file == null) {
    throw new TypeError('expected file to be a string, buffer, or object');
  }
  if (!isObject(file)) {
    file = { content: file.toString() };
  }

  var orig = file.content;
  file.sections = [];
  file.text = [];

  function parseSections(file) {
    var m = /(?=^)(---)(([\w]+?)(?:[ \t]*\r?\n))/m.exec(file.content);
    var idx = m ? m.index : -1;

    if (idx === -1 || (idx !== 0 && file.content[idx - 1] !== '\n')) {
      return file;
    }

    var key = m[3];
    var len = m[0].length;
    var rest = file.content.slice(idx + len);
    var content = file.content.slice(0, idx);

    if (file.sections.length === 0) {
      file.text.push(content);
    } else {
      file.section.content = content;
      if (typeof fn === 'function') {
        fn(file.section, file);
      }
    }

    var end = rest.indexOf('\n---');
    if (end === -1) {
      return file;
    }

    file.section = { key: key, data: rest.slice(0, end) };
    file.sections.push(file.section);
    file.content = rest.slice(file.section.data.length + 4);
    return parseSections(file);
  }

  parseSections(file);

  if (file.sections.length === 0) {
    file.content = orig;
  } else {
    file.section.content = file.content;
    if (typeof fn === 'function') {
      fn(file.section, file);
    }
    file.content = file.text.join('\n');
  }

  delete file.section;
  delete file.text;
  return file;
};
