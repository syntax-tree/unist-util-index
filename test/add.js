'use strict'

var Index = require('..')

var test = require('tape')

var u = require('unist-builder')

var select = require('unist-util-select')

test('index.add', function(t) {
  var ast = u('root', [u('node', {word: 'foo'}), u('node', {word: 'bar'})])
  var extraNode = u('node', {word: 'foo'})
  var $ = select.one(ast)

  var index = new Index(ast, 'word')
  t.deepEqual(index.get('foo'), [$('[word=foo]')])

  var result = index.add(extraNode)
  t.deepEqual(index.get('foo'), [$('[word=foo]'), extraNode])

  t.equal(result, index, 'returns this')

  index.add($('[word=foo]'))
  t.deepEqual(index.get('foo'), [$('[word=foo]'), extraNode])

  index.add(extraNode)
  t.deepEqual(index.get('foo'), [$('[word=foo]'), extraNode])

  t.end()
})
