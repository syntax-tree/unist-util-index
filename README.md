[![npm](https://nodei.co/npm/unist-util-index.png)](https://npmjs.com/package/unist-util-index)

# unist-util-index

[![Build Status][travis-badge]][travis] [![Dependency Status][david-badge]][david]

Create mutable index mapping property values or computed keys back to [Unist] nodes.

[unist]: https://github.com/wooorm/unist

[travis]: https://travis-ci.org/eush77/unist-util-index
[travis-badge]: https://travis-ci.org/eush77/unist-util-index.svg?branch=master
[david]: https://david-dm.org/eush77/unist-util-index
[david-badge]: https://david-dm.org/eush77/unist-util-index.png

## Example

Headings by depth:

```js
var Index = require('unist-util-index'),
    remark = require('remark'),
    toString = require('mdast-util-to-string');

var ast = remark.parse(fs.readFileSync('README.md', 'utf8'));
var index = Index(ast, 'heading', 'depth');

index.get(1).map(toString)
//=> [ 'unist-util-index' ]

index.get(2).map(toString)
//=> [ 'Example', 'API', 'Install', 'License' ]
```

Definitions by identifier:

```js
var index = Index(ast, 'definition', 'identifier');

index.get('unist')
//=> [ { type: 'definition',
         identifier: 'unist',
         title: null,
         link: 'https://github.com/wooorm/unist',
         position: Position { start: [Object], end: [Object], indent: [] } } ]

index.get('travis')
//=> [ { type: 'definition',
         identifier: 'travis',
         title: null,
         link: 'https://travis-ci.org/eush77/unist-util-index',
         position: Position { start: [Object], end: [Object], indent: [] } } ]
```

## API

### `index = Index([ast, [filter]], key)`

- `ast` — [Unist] tree.

- `filter` — one of:
  - node type (string);
  - function invoked with arguments `(node, index?, parent?)`.

- `key` — one of:
  - property name (string);
  - function invoked with argument `(node)`.

Create index data structure that maps keys (returned by `key` function or property) to nodes.

If `ast` argument is given, initialize index with `ast` nodes (recursively), optionally filter by node type or predicate.

### `index.get(key)`

- `key` — index key.

Get nodes by `key`.

Returns array of nodes.

### `index.add(node)`

- `node` — [Unist] node.

Add `node` to index. No-op if `node` is already present in index.

Returns `index`.

### `index.remove(node)`

- `node` — [Unist] node.

Remove `node` from index. No-op if `node` is not present in index.

Returns `index`.

## Install

```
npm install unist-util-index
```

## License

MIT
