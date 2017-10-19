'use strict';

require('mocha');
var assert = require('assert');
var sections = require('..');

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
    assert.deepEqual(sections('foo'), {content: 'foo', sections: []});
  });

  it('should not parse front-matter', function() {
    var input = '---\ntitle: bar\n---\n\nfoo';
    assert.deepEqual(sections(input), {content: input, sections: []});
  });

  it('should parse a section', function() {
    var input = '---\ntitle: bar\n---\n\nfoo\n---one\ntitle: One\n---\nThis is one';
    assert.deepEqual(sections(input), {
      content: '---\ntitle: bar\n---\n\nfoo\n',
      sections: [ { key: 'one', data: 'title: One', content: '\nThis is one' } ]
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
      content: '---\ntitle: bar\n---\n\nfoo\n\n',
      sections: [
        { key: 'one', data: 'title: One', content: '\nThis is one\n\n' },
        { key: 'two', data: 'title: Two', content: '\nThis is two\n' }
      ]
    });
  });
});
