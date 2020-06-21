# unist-util-index

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**unist**][unist] utility to create a mutable index mapping property values or
computed keys back to nodes.

## Install

[npm][]:

```sh
npm install unist-util-index
```

## Use

```js
var fs = require('fs')
var remark = require('remark')
var toString = require('mdast-util-to-string')
var Index = require('unist-util-index')

// Parse and read this repo’s readme:
var tree = remark.parse(fs.readFileSync('readme.md'))

// Index on heading depth:
var index = new Index(tree, 'heading', 'depth')

console.log(index.get(2).map(toString))

// Index on definition identifier:
index = new Index(tree, 'definition', 'identifier')

console.log(index.get('unist').map(node => node.url))
```

Yields:

```js
[ 'Install', 'Use', 'API', 'Related', 'Contribute', 'License' ]
[ 'https://github.com/syntax-tree/unist' ]
```

## API

### `Index([tree[, test], ]prop|keyFn)`

Create an index data structure that maps keys (calculated by `keyFn` function or
the values at `prop` in each node) to a list of nodes.

If `tree` is given, the index is initialized with all nodes, optionally filtered
by `test`.

###### Signatures

*   `Index(prop|keyFn)`
*   `Index(tree, prop|keyFn)`
*   `Index(tree, test, prop|keyFn)`

###### Parameters

*   `tree` ([`Node?`][node]) — [Tree][] to index
*   `test` ([`Test`][is], optional) — [`is`][is]-compatible test (such as a
    [type][])
*   `prop` (`string`) — Property to look up in each node to find keys
*   `keyFn` ([`Function`][keyfn]) — Function called with each node to calculate
    keys

###### Returns

`Index` — an index instance.

#### `function keyFn(node)`

Function called with every added [node][] to return the key to index on.

#### `Index#get(key)`

Get nodes by `key` (`*`).
Returns a list of zero or more nodes ([`Array.<Node>`][node]).

#### `Index#add(node)`

Add [`node`][node] to the index (if not already present).

#### `Index#remove(node)`

Remove [`node`][node] from the index (if present).

## Related

*   [`unist-util-is`](https://github.com/syntax-tree/unist-util-is)
    — Utility to check if a node passes a test
*   [`unist-util-visit`](https://github.com/syntax-tree/unist-util-visit)
    — Utility to recursively walk over nodes
*   [`unist-util-map`](https://github.com/syntax-tree/unist-util-map)
    — Create a new tree by mapping by the provided function
*   [`unist-util-flatmap`](https://gitlab.com/staltz/unist-util-flatmap)
    — Create a new tree by mapping and then flattening
*   [`unist-util-select`](https://github.com/syntax-tree/unist-util-select)
    — Select nodes with CSS-like selectors

## Contribute

See [`contributing.md` in `syntax-tree/.github`][contributing] for ways to get
started.
See [`support.md`][support] for ways to get help.

This project has a [Code of Conduct][coc].
By interacting with this repository, organisation, or community you agree to
abide by its terms.

## License

[MIT][license] © Eugene Sharygin

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/syntax-tree/unist-util-index.svg

[build]: https://travis-ci.org/syntax-tree/unist-util-index

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/unist-util-index.svg

[coverage]: https://codecov.io/github/syntax-tree/unist-util-index

[downloads-badge]: https://img.shields.io/npm/dm/unist-util-index.svg

[downloads]: https://www.npmjs.com/package/unist-util-index

[size-badge]: https://img.shields.io/bundlephobia/minzip/unist-util-index.svg

[size]: https://bundlephobia.com/result?p=unist-util-index

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/syntax-tree

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[contributing]: https://github.com/syntax-tree/.github/blob/HEAD/contributing.md

[support]: https://github.com/syntax-tree/.github/blob/HEAD/support.md

[coc]: https://github.com/syntax-tree/.github/blob/HEAD/code-of-conduct.md

[unist]: https://github.com/syntax-tree/unist

[node]: https://github.com/syntax-tree/unist#node

[tree]: https://github.com/syntax-tree/unist#tree

[type]: https://github.com/syntax-tree/unist#type

[is]: https://github.com/syntax-tree/unist-util-is

[keyfn]: #function-keyfnnode
