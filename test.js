/**
 * @typedef {import('unist').Node} Node
 */

/**
 * @typedef {Node & {id: number}} IdNode
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {u} from 'unist-builder'
import {select} from 'unist-util-select'
import {Index} from './index.js'

test('core', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('./index.js')).sort(), ['Index'])
  })

  const node = {type: 'a', id: 1}
  const alt = {type: 'b', id: 1}
  const tree = {type: 'root', children: [node, alt]}

  await t.test('should create an index from a prop field', async function () {
    const instance = new Index('id')
    instance.add(node)

    assert.deepEqual(
      [instance instanceof Index, instance.get(1)],
      [true, [node]],
      'new Index(prop)'
    )
  })

  await t.test('should create an index from a key function', async function () {
    const instance = new Index(function (node) {
      const idNode = /** @type {IdNode} */ (node)
      return idNode.id
    })
    instance.add(node)

    assert.deepEqual(
      [instance instanceof Index, instance.get(1)],
      [true, [node]],
      'new Index(keyFn)'
    )
  })

  await t.test(
    'should create an index from a prop and initialize with a tree',
    async function () {
      const instance = new Index('id', tree)

      assert.deepEqual(
        [instance instanceof Index, instance.get(1)],
        [true, [node, alt]],
        'new Index(prop, tree)'
      )
    }
  )

  await t.test(
    'should create an index from a prop, initialize with a tree, and filter',
    async function () {
      const instance = new Index('id', tree, function (node) {
        return node.type === 'a'
      })

      assert.deepEqual(
        [instance instanceof Index, instance.get(1)],
        [true, [node]],
        'new Index(prop, tree, filter)'
      )
    }
  )
})

test('add', async function (t) {
  const foo = u('node', {word: 'foo'})
  const otherFoo = u('node', {word: 'foo'})
  const tree = u('root', [foo, u('node', {word: 'bar'})])
  const index = new Index('word', tree)

  await t.test('should index on the initialize tree', async function () {
    assert.deepEqual(index.get('foo'), [foo])
  })

  const result = index.add(otherFoo)

  await t.test('should add other nodes', async function () {
    assert.deepEqual(index.get('foo'), [foo, otherFoo])
  })

  await t.test('should return `this`', async function () {
    assert.equal(result, index)
  })

  index.add(foo)

  await t.test(
    'should not index existing nodes in tree again',
    async function () {
      assert.deepEqual(index.get('foo'), [foo, otherFoo])
    }
  )

  index.add(otherFoo)

  await t.test('should not index extra nodes again', async function () {
    assert.deepEqual(index.get('foo'), [foo, otherFoo])
  })
})

test('get', async function (t) {
  const tree = u('node', {color: 'black', id: 0}, [
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

  const index = new Index('color', tree)

  await t.test('should index (#1)', async function () {
    assert.deepEqual(index.get('black'), [
      select('[id=0]', tree),
      select('[id=1]', tree),
      select('[id=3]', tree),
      select('[id=4]', tree),
      select('[id=5]', tree),
      select('[id=7]', tree),
      select('[id=8]', tree),
      select('[id=9]', tree),
      select('[id=10]', tree),
      select('[id=12]', tree),
      select('[id=13]', tree),
      select('[id=14]', tree)
    ])
  })

  await t.test('should index (#2)', async function () {
    assert.deepEqual(index.get('red'), [
      select('[id=2]', tree),
      select('[id=6]', tree),
      select('[id=11]', tree)
    ])
  })

  await t.test('should index (#3)', async function () {
    assert.deepEqual(index.get('yellow'), [])
  })
})

test('get: degenerate keys (Object.prototype keys)', async function (t) {
  const tree = u('node', {word: '__proto__', id: 0}, [
    u('node', {word: 'constructor', id: 1}),
    u('node', {word: 'toString', id: 2})
  ])
  const index = new Index('word', tree)

  await t.test('should work on `__proto__`', async function () {
    assert.deepEqual(index.get('__proto__'), [select('[id=0]', tree)])
  })

  await t.test('should work on `constructor`', async function () {
    assert.deepEqual(index.get('constructor'), [select('[id=1]', tree)])
  })

  await t.test('should work on `toString`', async function () {
    assert.deepEqual(index.get('toString'), [select('[id=2]', tree)])
  })
})

test('get: identity keys', async function (t) {
  const id1 = {foo: 'bar'}
  const id2 = {foo: 'bar'}
  const tree = u('root', [
    u('node', {word: false, id: 0}),
    u('node', {word: 'false', id: 1}),
    u('node', {word: 1, id: 2}),
    u('node', {word: '1', id: 3}),
    u('node', {word: id1, id: 4}),
    u('node', {word: id2, id: 5})
  ])
  const index = new Index('word', tree)

  await t.test('should index on booleans', async function () {
    assert.deepEqual(index.get(false), [select('[id=0]', tree)])
  })

  await t.test('should index on strings of booleans', async function () {
    assert.deepEqual(index.get('false'), [select('[id=1]', tree)])
  })

  await t.test('should index on numbers', async function () {
    assert.deepEqual(index.get(1), [select('[id=2]', tree)])
  })

  await t.test('should index on strings of numbers', async function () {
    assert.deepEqual(index.get('1'), [select('[id=3]', tree)])
  })

  await t.test('should index on objects by reference (#1)', async function () {
    assert.deepEqual(index.get(id1), [select('[id=4]', tree)])
  })

  await t.test('should index on objects by reference (#2)', async function () {
    assert.deepEqual(index.get(id2), [select('[id=5]', tree)])
  })

  await t.test('should not index on object equivalence', async function () {
    assert.deepEqual(index.get({foo: 'bar'}), [])
  })
})

test('get: empty index', async function (t) {
  await t.test('should work on a missing tree', async function () {
    assert.deepEqual(new Index('foo', null).get('bar'), [])
  })

  await t.test('should work on no tree', async function () {
    assert.deepEqual(new Index('foo').get('bar'), [])
  })
})

test('get: filter: type test', async function (t) {
  const tree = u('root', [
    u('node', {word: 'foo'}),
    u('node', {word: 'bar'}),
    u('skip', {word: 'foo'}),
    u('skip', {word: 'bar'})
  ])
  const index = new Index('word', tree, 'node')

  await t.test('should support filter as a string (#1)', async function () {
    assert.deepEqual(index.get('foo'), [select('node[word="foo"]', tree)])
  })

  await t.test('should support filter as a string (#2)', async function () {
    assert.deepEqual(index.get('bar'), [select('node[word="bar"]', tree)])
  })
})

test('get: filter: function test', async function (t) {
  const tree = u('root', [
    u('node', {word: 'foo'}),
    u('node', {word: 'bar'}),
    u('skip', {word: 'foo'}),
    u('skip', {word: 'bar'})
  ])
  const index = new Index('word', tree, function (node, index, parent) {
    return Boolean(
      typeof index === 'number' &&
        parent &&
        'word' in node &&
        index < 2 &&
        parent.type === 'root'
    )
  })

  await t.test('should support a filter function (#1)', async function () {
    assert.deepEqual(index.get('foo'), [select('node[word="foo"]', tree)])
  })

  await t.test('should support a filter function (#2)', async function () {
    assert.deepEqual(index.get('bar'), [select('node[word="bar"]', tree)])
  })
})

test('get: computed keys', async function (t) {
  const tree = u('root', {x: 0, y: 4, id: 0}, [
    u('node', {x: 3, y: 2, id: 1}),
    u('node', {x: 2, y: 2, id: 2}),
    u('node', {x: 3, y: 1, id: 3}),
    u('node', {x: 4, y: 1, id: 4})
  ])
  const index = new Index(xPlusY, tree)

  await t.test('should index with a key function (#1)', async function () {
    assert.deepEqual(index.get(4), [
      select('[id=0]', tree),
      select('[id=2]', tree),
      select('[id=3]', tree)
    ])
  })

  await t.test('should index with a key function (#2)', async function () {
    assert.deepEqual(index.get(0), [])
  })

  await t.test('should index with a key function (#3)', async function () {
    assert.deepEqual(index.get(5), [
      select('[id=1]', tree),
      select('[id=4]', tree)
    ])
  })

  await t.test('should index with a key function (#4)', async function () {
    assert.deepEqual(new Index(xPlusY, tree, 'node').get(4), [
      select('[id=2]', tree),
      select('[id=3]', tree)
    ])
  })

  /**
   * @param {Node} node
   */
  function xPlusY(node) {
    const funky = /** @type {{type: string, x: number, y: number}} */ (node)
    return funky.x + funky.y
  }
})

test('index.remove', async function (t) {
  const badFoo = u('bad', {word: 'foo'})
  const nodeFoo = u('node', {word: 'foo'})
  const tree = u('root', [badFoo, nodeFoo, u('node', {word: 'bar'})])

  const index = new Index('word', tree)
  await t.test('shoulds work (baseline)', async function () {
    assert.deepEqual(index.get('foo'), [badFoo, nodeFoo])
  })

  const result = index.remove(badFoo)

  await t.test('should remove', async function () {
    assert.deepEqual(index.get('foo'), [nodeFoo])
  })

  await t.test('should yield `this`', async function () {
    assert.equal(result, index)
  })

  index.remove(badFoo)

  await t.test('should do nothing when removing again', async function () {
    assert.deepEqual(index.get('foo'), [nodeFoo])
  })

  index.remove(u('terrible', {word: 'baz'}))

  await t.test(
    'should do nothing when removing nodes that aren’t indexed',
    async function () {
      assert.deepEqual(index.get('foo'), [nodeFoo])
    }
  )

  index.remove(nodeFoo)

  await t.test('should support removing the last node', async function () {
    assert.deepEqual(index.get('foo'), [])
  })
})
