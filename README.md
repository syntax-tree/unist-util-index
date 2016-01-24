[![npm](https://nodei.co/npm/unist-util-index.png)](https://npmjs.com/package/unist-util-index)

# unist-util-index

[![Build Status][travis-badge]][travis] [![Dependency Status][david-badge]][david]

Create mutable index mapping property values or computed keys back to [Unist] nodes.

[unist]: https://github.com/wooorm/unist

[travis]: https://travis-ci.org/eush77/unist-util-index
[travis-badge]: https://travis-ci.org/eush77/unist-util-index.svg?branch=master
[david]: https://david-dm.org/eush77/unist-util-index
[david-badge]: https://david-dm.org/eush77/unist-util-index.png

## API

### `index = Index(ast, [filter], key)`

- `ast` — [Unist] tree.

- `filter` — one of:
  - node type (string);
  - function invoked with arguments `(node, index?, parent?)`.

- `key` — one of:
  - property name (string);
  - function invoked with argument `(node)`.

Create index data structure that maps keys (returned by `key` function or property) to `ast` nodes.

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
