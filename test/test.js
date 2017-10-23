'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var yaml = require('js-yaml');
var sections = require('..');
var fixtures = path.join.bind(path, __dirname, 'fixtures');

function read(name) {
  return fs.readFileSync(fixtures(name), 'utf8');
}

describe('section-matter', function() {
  it('should export a function', function() {
    assert.equal(typeof sections, 'function');
  });

  it('should throw an error when invalid args are passed', function() {
    assert.throws(function() {
      sections();
    });
  });

  it('should return a file object', function() {
    assert.deepEqual(sections(''), {content: '', sections: []});
    assert.deepEqual(sections('foo'), {content: 'foo', sections: []});
  });

  it('should not try to parse non-sections', function() {
    assert.deepEqual(sections('foo\n---\nbar'), {
      content: 'foo\n---\nbar',
      sections: []
    });
    assert.deepEqual(sections('---\nfoo\n---\nbar'), {
      content: '---\nfoo\n---\nbar',
      sections: []
    });
    assert.deepEqual(sections('foo\n---\nbar\n---'), {
      content: 'foo\n---\nbar\n---',
      sections: []
    });
  });

  it('should not parse front-matter by default', function() {
    var input = '---\ntitle: bar\n---\n\nfoo';
    assert.deepEqual(sections(input), {content: input, sections: []});
  });

  it('should parse front-matter with language', function() {
    var input = '---json\n{"title": "bar"}\n---\n\nfoo';
    assert.deepEqual(sections(input), {
      content: '',
      sections: [ { key: 'json', data: '{"title": "bar"}', content: '\nfoo' } ]
    });
  });

  it('should parse a section', function() {
    var input = '---\ntitle: bar\n---\n\nfoo\n---one\ntitle: One\n---\nThis is one';
    assert.deepEqual(sections(input), {
      content: '---\ntitle: bar\n---\n\nfoo',
      sections: [ { key: 'one', data: 'title: One', content: 'This is one' } ]
    });
  });

  it('should use a custom parser on sections', function() {
    var input = '---\ntitle: bar\n---\n\nfoo\n---one\ntitle: One\n---\nThis is one';
    function parse(section) {
      section.data = yaml.safeLoad(section.data);
    }
    assert.deepEqual(sections(input, parse), {
      content: '---\ntitle: bar\n---\n\nfoo',
      sections: [
        {
          key: 'one',
          data: {title: 'One'},
          content: 'This is one'
        }
      ]
    });
  });

  it('should parse multiple sections', function() {
    var input = [
      '---',
      'title: bar',
      '---',
      '',
      'foo',
      '',
      '---one',
      'title: One',
      '---',
      'This is one',
      '',
      '---two',
      'title: Two',
      '---',
      'This is two',
      ''
    ].join('\n');

    assert.deepEqual(sections(input), {
      content: '---\ntitle: bar\n---\n\nfoo\n',
      sections: [
        { key: 'one', data: 'title: One', content: 'This is one\n' },
        { key: 'two', data: 'title: Two', content: 'This is two\n' }
      ]
    });
  });

  it('should not parse non-sections', function() {
    var input = read('hr.md');
    // console.log(sections(input))
    assert.deepEqual(sections(input), {
      content: '',
      sections: [
        {
          key: 'yaml',
          data: 'title: I\'m front matter',
          content: '\nThis page has front matter that should be parsed before the sections.\n'
        },
        {
          key: 'aaa',
          data: 'title: First section',
          content: '\nSection one.\n'
        },
        {
          key: 'bbb',
          data: 'title: Non-section horizontal rules',
          content: '\nPart 1.\n\n---\n\nPart 2.\n\n---\n\nPart 3.\n'
        },
        {
          key: 'ccc',
          data: 'title: Third section',
          content: '\nSection three.\n'
        }
      ]
    });
  });
});
