# unist-util-index [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Create mutable index mapping property values or computed keys back to
[**unist**][unist] nodes.

## Installation

[npm][]:

```bash
npm install unist-util-index
```

## Usage

```javascript
var fs = require('fs')
var remark = require('remark')
var toString = require('mdast-util-to-string')
var Index = require('unist-util-index')

// Read this readme:
var tree = remark.parse(fs.readFileSync('readme.md'))

// Index on heading depth:
var index = new Index(tree, 'heading', 'depth')

console.log(index.get(1).map(toString))
console.log(index.get(2).map(toString))

// Index on definition identifier:
index = new Index(tree, 'definition', 'identifier')

console.log(index.get('unist').map(node => node.url))
console.log(index.get('travis').map(node => node.url))
```

Yields:

```js
[ 'unist-util-index Build Status Coverage Status' ]
[ 'Installation',
  'Usage',
  'API',
  'Related',
  'Contribute',
  'License' ]
[ 'https://github.com/syntax-tree/unist' ]
[ 'https://travis-ci.org/syntax-tree/unist-util-index' ]
```

## API

### `Index([tree, [filter, ]]prop|keyFn)`

Create an index data structure that maps keys (calculated by `keyFn` function
or the values at `prop` in each node) to a list of nodes.

If `tree` is given, the index is initialised with all nodes, optionally
filtered by `filter`.

###### Signatures

*   `Index(prop|keyFn)`
*   `Index(tree, prop|keyFn)`
*   `Index(tree, filter, prop|keyFn)`

###### Parameters

*   `tree` ([`Node`][node])
*   `filter` (`*`) — [`is`][is]-compatible test
*   `prop` (`string`) — Property to look up in each node to find keys
*   `keyFn` ([`Function`][keyfn]) — Function called with each node to calculate
    keys

###### Returns

`Index` — an index instance.

#### `function keyFn(node)`

Function called with every added [node][] to return the value to index on.

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

See [`contributing.md` in `syntax-tree/unist`][contributing] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © Eugene Sharygin

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/syntax-tree/unist-util-index.svg

[travis]: https://travis-ci.org/syntax-tree/unist-util-index

[codecov-badge]: https://img.shields.io/codecov/c/github/syntax-tree/unist-util-index.svg

[codecov]: https://codecov.io/github/syntax-tree/unist-util-indexs

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[contributing]: https://github.com/syntax-tree/unist/blob/master/contributing.md

[coc]: https://github.com/syntax-tree/unist/blob/master/code-of-conduct.md

[unist]: https://github.com/syntax-tree/unist

[node]: https://github.com/syntax-tree/unist#node

[is]: https://github.com/syntax-tree/unist-util-is

[keyfn]: #function-keyfnnode
