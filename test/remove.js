'use strict'

var Index = require('..')

var test = require('tape')

var u = require('unist-builder')

var select = require('unist-util-select')

test('index.remove', function(t) {
  var ast = u('root', [
    u('bad', {word: 'foo'}),
    u('node', {word: 'foo'}),
    u('node', {word: 'bar'})
  ])
  var $ = select.one(ast)

  var index = new Index(ast, 'word')
  t.deepEqual(index.get('foo'), [$('bad[word=foo]'), $('node[word=foo]')])

  var result = index.remove($('bad'))
  t.deepEqual(index.get('foo'), [$('node[word=foo]')])

  t.equal(result, index, 'returns this')

  index.remove($('bad'))
  t.deepEqual(index.get('foo'), [$('node[word=foo]')])

  index.remove(u('terrible', {word: 'baz'}))
  t.deepEqual(index.get('foo'), [$('node[word=foo]')])

  index.remove($('node[word=foo]'))
  t.deepEqual(index.get('foo'), [])

  t.end()
})
