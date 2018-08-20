'use strict'

var test = require('tape')
var u = require('unist-builder')
var select = require('unist-util-select')
var Index = require('.')

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

test('index.get', function(t) {
  t.test('get', function(st) {
    var ast = u('node', {color: 'black', id: 0}, [
      u('node', {color: 'black', id: 1}, [
        u('node', {color: 'red', id: 2}, [
          u('node', {color: 'black', id: 3}),
          u('node', {color: 'black', id: 4})
        ]),
        u('node', {color: 'black', id: 5})
      ]),
      u('node', {color: 'red', id: 6}, [
        u('node', {color: 'black', id: 7}, [
          u('node', {color: 'black', id: 8}),
          u('node', {color: 'black', id: 9})
        ]),
        u('node', {color: 'black', id: 10}, [
          u('node', {color: 'red', id: 11}, [
            u('node', {color: 'black', id: 12}),
            u('node', {color: 'black', id: 13})
          ]),
          u('node', {color: 'black', id: 14})
        ])
      ])
    ])
    var $ = select.one(ast)

    var index = new Index(ast, 'color')

    st.deepEqual(index.get('black'), [
      $('[id=0]'),
      $('[id=1]'),
      $('[id=3]'),
      $('[id=4]'),
      $('[id=5]'),
      $('[id=7]'),
      $('[id=8]'),
      $('[id=9]'),
      $('[id=10]'),
      $('[id=12]'),
      $('[id=13]'),
      $('[id=14]')
    ])

    st.deepEqual(index.get('red'), [$('[id=2]'), $('[id=6]'), $('[id=11]')])

    st.deepEqual(index.get('yellow'), [])

    st.end()
  })

  t.test('degenerate keys', function(st) {
    st.test('Object.prototype keys', function(sst) {
      var ast = u('node', {word: '__proto__', id: 0}, [
        u('node', {word: 'constructor', id: 1}),
        u('node', {word: 'toString', id: 2})
      ])
      var $$ = select(ast)
      var index = new Index(ast, 'word')

      sst.deepEqual(index.get('__proto__'), $$('[id=0]'))
      sst.deepEqual(index.get('constructor'), $$('[id=1]'))
      sst.deepEqual(index.get('toString'), $$('[id=2]'))
      sst.end()
    })

    st.test('identity keys', function(sst) {
      var id1 = {foo: 'bar'}
      var id2 = {foo: 'bar'}
      var ast = u('root', [
        u('node', {word: false, id: 0}),
        u('node', {word: 'false', id: 1}),
        u('node', {word: 1, id: 2}),
        u('node', {word: '1', id: 3}),
        u('node', {word: id1, id: 4}),
        u('node', {word: id2, id: 5})
      ])
      var $$ = select(ast)
      var index = new Index(ast, 'word')

      sst.deepEqual(index.get(false), $$('[id=0]'))
      sst.deepEqual(index.get('false'), $$('[id=1]'))
      sst.deepEqual(index.get(1), $$('[id=2]'))
      sst.deepEqual(index.get('1'), $$('[id=3]'))
      sst.deepEqual(index.get(id1), $$('[id=4]'))
      sst.deepEqual(index.get(id2), $$('[id=5]'))
      sst.deepEqual(index.get({foo: 'bar'}), [])
      sst.end()
    })

    st.end()
  })

  t.test('empty index', function(st) {
    st.deepEqual(new Index(null, 'foo').get('bar'), [])
    st.deepEqual(new Index('foo').get('bar'), [])
    st.end()
  })

  t.test('Index filter', function(st) {
    var ast = u('root', [
      u('node', {word: 'foo'}),
      u('node', {word: 'bar'}),
      u('skip', {word: 'foo'}),
      u('skip', {word: 'bar'})
    ])
    var $$ = select(ast)

    st.test('type test', function(sst) {
      var index = new Index(ast, 'node', 'word')
      sst.deepEqual(index.get('foo'), $$('node[word="foo"]'))
      sst.deepEqual(index.get('bar'), $$('node[word="bar"]'))
      sst.end()
    })

    st.test('function test', function(sst) {
      var index = new Index(ast, filter, 'word')
      sst.deepEqual(index.get('foo'), $$('node[word="foo"]'))
      sst.deepEqual(index.get('bar'), $$('node[word="bar"]'))
      sst.end()

      function filter(node, index, parent) {
        return 'word' in node && index < 2 && parent.type === 'root'
      }
    })

    st.end()
  })

  t.test('computed keys', function(st) {
    var ast = u('root', {x: 0, y: 4, id: 0}, [
      u('node', {x: 3, y: 2, id: 1}),
      u('node', {x: 2, y: 2, id: 2}),
      u('node', {x: 3, y: 1, id: 3}),
      u('node', {x: 4, y: 1, id: 4})
    ])
    var $ = select.one(ast)
    var index

    index = new Index(ast, xPlusY)
    st.deepEqual(index.get(4), [$('[id=0]'), $('[id=2]'), $('[id=3]')])
    st.deepEqual(index.get(0), [])
    st.deepEqual(index.get(5), [$('[id=1]'), $('[id=4]')])

    st.deepEqual(new Index(ast, 'node', xPlusY).get(4), [
      $('[id=2]'),
      $('[id=3]')
    ])

    st.end()

    function xPlusY(node) {
      return node.x + node.y
    }
  })

  t.end()
})

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
