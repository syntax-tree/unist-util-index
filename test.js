/**
 * @typedef {import('unist').Node} Node
 * @typedef {Node & {id: number}} IdNode
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {u} from 'unist-builder'
import {select} from 'unist-util-select'
import {Index} from './index.js'
import * as mod from './index.js'

test('core', () => {
  assert.deepEqual(
    Object.keys(mod).sort(),
    ['Index'],
    'should expose the public api'
  )

  const node = {type: 'a', id: 1}
  const alt = {type: 'b', id: 1}
  const tree = {type: 'root', children: [node, alt]}
  let instance = new Index('id')
  instance.add(node)

  assert.deepEqual(
    [instance instanceof Index, instance.get(1)],
    [true, [node]],
    'new Index(prop)'
  )

  // @ts-expect-error: Look for nodes with an `id`.
  instance = new Index((/** @type {IdNode} */ node) => node.id)
  instance.add(node)

  assert.deepEqual(
    [instance instanceof Index, instance.get(1)],
    [true, [node]],
    'new Index(keyFn)'
  )

  instance = new Index('id', tree)

  assert.deepEqual(
    [instance instanceof Index, instance.get(1)],
    [true, [node, alt]],
    'new Index(prop, tree)'
  )

  instance = new Index('id', tree, (node) => node.type === 'a')

  assert.deepEqual(
    [instance instanceof Index, instance.get(1)],
    [true, [node]],
    'new Index(prop, tree, filter)'
  )
})

test('add', () => {
  const ast = u('root', [u('node', {word: 'foo'}), u('node', {word: 'bar'})])
  const extraNode = u('node', {word: 'foo'})

  const index = new Index('word', ast)
  assert.deepEqual(index.get('foo'), [select('[word=foo]', ast)])

  const result = index.add(extraNode)
  assert.deepEqual(index.get('foo'), [select('[word=foo]', ast), extraNode])

  assert.equal(result, index, 'returns this')

  const node = select('[word=foo]', ast)
  if (node) index.add(node)
  assert.deepEqual(index.get('foo'), [select('[word=foo]', ast), extraNode])

  index.add(extraNode)
  assert.deepEqual(index.get('foo'), [select('[word=foo]', ast), extraNode])
})

test('get', () => {
  const ast = u('node', {color: 'black', id: 0}, [
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

  const index = new Index('color', ast)

  assert.deepEqual(index.get('black'), [
    select('[id=0]', ast),
    select('[id=1]', ast),
    select('[id=3]', ast),
    select('[id=4]', ast),
    select('[id=5]', ast),
    select('[id=7]', ast),
    select('[id=8]', ast),
    select('[id=9]', ast),
    select('[id=10]', ast),
    select('[id=12]', ast),
    select('[id=13]', ast),
    select('[id=14]', ast)
  ])

  assert.deepEqual(index.get('red'), [
    select('[id=2]', ast),
    select('[id=6]', ast),
    select('[id=11]', ast)
  ])

  assert.deepEqual(index.get('yellow'), [])
})

test('get: degenerate keys (Object.prototype keys)', () => {
  const ast = u('node', {word: '__proto__', id: 0}, [
    u('node', {word: 'constructor', id: 1}),
    u('node', {word: 'toString', id: 2})
  ])
  const index = new Index('word', ast)

  assert.deepEqual(index.get('__proto__'), [select('[id=0]', ast)])
  assert.deepEqual(index.get('constructor'), [select('[id=1]', ast)])
  assert.deepEqual(index.get('toString'), [select('[id=2]', ast)])
})

test('get: identity keys', () => {
  const id1 = {foo: 'bar'}
  const id2 = {foo: 'bar'}
  const ast = u('root', [
    u('node', {word: false, id: 0}),
    u('node', {word: 'false', id: 1}),
    u('node', {word: 1, id: 2}),
    u('node', {word: '1', id: 3}),
    u('node', {word: id1, id: 4}),
    u('node', {word: id2, id: 5})
  ])
  const index = new Index('word', ast)

  assert.deepEqual(index.get(false), [select('[id=0]', ast)])
  assert.deepEqual(index.get('false'), [select('[id=1]', ast)])
  assert.deepEqual(index.get(1), [select('[id=2]', ast)])
  assert.deepEqual(index.get('1'), [select('[id=3]', ast)])
  assert.deepEqual(index.get(id1), [select('[id=4]', ast)])
  assert.deepEqual(index.get(id2), [select('[id=5]', ast)])
  assert.deepEqual(index.get({foo: 'bar'}), [])
})

test('get: empty index', () => {
  assert.deepEqual(new Index('foo', null).get('bar'), [])
  assert.deepEqual(new Index('foo').get('bar'), [])
})

test('get: filter: type test', () => {
  const ast = u('root', [
    u('node', {word: 'foo'}),
    u('node', {word: 'bar'}),
    u('skip', {word: 'foo'}),
    u('skip', {word: 'bar'})
  ])
  const index = new Index('word', ast, 'node')
  assert.deepEqual(index.get('foo'), [select('node[word="foo"]', ast)])
  assert.deepEqual(index.get('bar'), [select('node[word="bar"]', ast)])
})

test('get: filter: function test', () => {
  const ast = u('root', [
    u('node', {word: 'foo'}),
    u('node', {word: 'bar'}),
    u('skip', {word: 'foo'}),
    u('skip', {word: 'bar'})
  ])
  const index = new Index('word', ast, (node, index, parent) =>
    Boolean(
      typeof index === 'number' &&
        parent &&
        'word' in node &&
        index < 2 &&
        parent.type === 'root'
    )
  )
  assert.deepEqual(index.get('foo'), [select('node[word="foo"]', ast)])
  assert.deepEqual(index.get('bar'), [select('node[word="bar"]', ast)])
})

test('get: computed keys', () => {
  /**
   * @typedef {{x: number, y: number, z: number}} FunkyNode
   */

  const ast = u('root', {x: 0, y: 4, id: 0}, [
    u('node', {x: 3, y: 2, id: 1}),
    u('node', {x: 2, y: 2, id: 2}),
    u('node', {x: 3, y: 1, id: 3}),
    u('node', {x: 4, y: 1, id: 4})
  ])
  // @ts-ignore it’s fine
  const index = new Index(xPlusY, ast)
  assert.deepEqual(index.get(4), [
    select('[id=0]', ast),
    select('[id=2]', ast),
    select('[id=3]', ast)
  ])
  assert.deepEqual(index.get(0), [])
  assert.deepEqual(index.get(5), [select('[id=1]', ast), select('[id=4]', ast)])

  // @ts-ignore it’s fine
  assert.deepEqual(new Index(xPlusY, ast, 'node').get(4), [
    select('[id=2]', ast),
    select('[id=3]', ast)
  ])

  /**
   * @param {FunkyNode} node
   */
  function xPlusY(node) {
    return node.x + node.y
  }
})

test('index.remove', () => {
  const ast = u('root', [
    u('bad', {word: 'foo'}),
    u('node', {word: 'foo'}),
    u('node', {word: 'bar'})
  ])

  const index = new Index('word', ast)
  assert.deepEqual(index.get('foo'), [
    select('bad[word=foo]', ast),
    select('node[word=foo]', ast)
  ])

  let node = select('bad', ast)
  if (!node) throw new Error('Expected `node`')
  const result = index.remove(node)
  assert.deepEqual(index.get('foo'), [select('node[word=foo]', ast)])

  assert.equal(result, index, 'returns this')

  node = select('bad', ast)
  if (!node) throw new Error('Expected `node`')
  index.remove(node)
  assert.deepEqual(index.get('foo'), [select('node[word=foo]', ast)])

  index.remove(u('terrible', {word: 'baz'}))
  assert.deepEqual(index.get('foo'), [select('node[word=foo]', ast)])

  node = select('node[word=foo]', ast)
  if (!node) throw new Error('Expected `node`')
  index.remove(node)
  assert.deepEqual(index.get('foo'), [])
})
