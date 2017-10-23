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

  it('should not parse front-matter', function() {
    var input = '---\ntitle: bar\n---\n\nfoo';
    assert.deepEqual(sections(input), {content: input, sections: []});
  });

  it('should parse a section', function() {
    var input = '---\ntitle: bar\n---\n\nfoo\n---one\ntitle: One\n---\nThis is one';
    assert.deepEqual(sections(input), {
      content: '---\ntitle: bar\n---\n\nfoo',
      sections: [ { key: 'one', data: 'title: One', content: 'This is one' } ]
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
});
