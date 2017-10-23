'use strict';

module.exports = function(input, fn) {
  var file = { content: input, sections: [] };
  if (input && typeof input === 'object') {
    file = input;
    file.sections = file.sections || [];
  }

  if (typeof fn !== 'function') {
    fn = identity;
  }

  var lines = input.split(/\r?\n/);
  var obj = { key: '', data: {}, content: '' };
  var sections = false;
  var section = clone(obj);
  var content = [];
  var stack = [];
  var data = [];

  function closeSection() {
    if (stack.length) {
      section.key = stack[0].slice(3).trim();
      section.content = content.join('\n');
      file.sections.push(section);
      section = clone(obj);
      content = [];
      stack = [];
    }
  }

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var len = stack.length;
    var ln = line.trim();

    if (isDelimiter(ln)) {
      if (ln.length === 3) {
        if (len === 0 || len === 2) {
          content.push(line);
          continue;
        }
        stack.push(ln);
        section.data = fn(content.join('\n'));
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

function isDelimiter(line) {
  if (line.slice(0, 3) !== '---') {
    return false;
  }
  if (line.charAt(4) === '-') {
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
