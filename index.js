'use strict';

var isObject = require('isobject');

module.exports = function(file, options) {
  if (file == null) {
    throw new TypeError('expected file to be a string, buffer, or object');
  }
  if (!isObject(file)) {
    file = { content: file.toString() };
  }

  var orig = file.content;
  file.sections = [];
  file.text = [];

  function parseSections(file, options) {
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
      if (options && typeof options.sections === 'function') {
        options.sections(file.section, file);
      }
    }

    var end = rest.indexOf('\n---');
    if (end === -1) {
      return file;
    }

    var data = rest.slice(0, end);
    file.section = { key: key, data: data };
    file.sections.push(file.section);
    file.content = rest.slice(data.length + 4);
    return parseSections(file, options);
  }

  parseSections(file, options);

  if (file.sections.length === 0) {
    file.content = orig;
  } else {
    file.section.content = file.content;
    if (options && typeof options.sections === 'function') {
      options.sections(file.section, file);
    }
    file.content = file.text.join('\n');
  }

  delete file.section;
  delete file.text;
  return file;
};
