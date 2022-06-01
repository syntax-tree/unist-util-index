# unist-util-index

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[unist][] utility to create an index from certain nodes.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`Index(prop|keyFunction[, tree[, test]])`](#indexpropkeyfunction-tree-test)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This utility creates a mutable index data structure, that maps property values
or computed keys, to nodes.
For example, you can use this to index all (footnote) definitions in a tree,
or all headings of a certain rank, to later retrieve them without having to walk
the tree each time.

## When should I use this?

This is a utility that helps you deal with indexing the tree.
It’s pretty small, and you can definitely do it yourself, but this little
wrapper makes it all a bit easier.

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, 16.0+, 18.0+), install with [npm][]:

```sh
npm install unist-util-index
```

In Deno with [`esm.sh`][esmsh]:

```js
import {Index} from "https://esm.sh/unist-util-index@3"
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {Index} from "https://esm.sh/unist-util-index@3?bundle"
</script>
```

## Use

```js
import fs from 'node:fs/promises'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {toString} from 'mdast-util-to-string'
import {Index} from 'unist-util-index'

// Parse and read this repo’s readme:
const tree = fromMarkdown(await fs.readFile('readme.md'))

// Index on heading depth:
const indexOnDepth = new Index('depth', tree, 'heading')

console.log(indexOnDepth.get(2).map(toString))

// Index on definition identifier:
const indexOnIdentifier = new Index('identifier', tree, 'definition')

console.log(indexOnIdentifier.get('unist').map(node => node.url))
```

Yields:

```js
[
  'Contents',
  'What is this?',
  'When should I use this?',
  'Install',
  'Use',
  'API',
  'Types',
  'Compatibility',
  'Related',
  'Contribute',
  'License'
]
[ 'https://github.com/syntax-tree/unist' ]
```

## API

This package exports the identifier `Index`.
There is no default export.

### `Index(prop|keyFunction[, tree[, test]])`

Create a mutable index data structure, that maps property values or computed
keys, to nodes.

If `tree` is given, the index is initialized with all nodes, optionally filtered
by `test`.

###### Parameters

*   `prop` (`string`)
    — property to look up in each node to find keys
*   `keyFunction` ([`KeyFunction`][key-function])
    — function called with each node to calculate keys
*   `tree` ([`Node`][node], optional)
    — tree to index
*   `test` ([`Test`][is], optional)
    — [`is`][is]-compatible test

###### Returns

Instance (`Index`).

#### `function keyFunction(node)`

Function called with every added node ([`Node`][node]) to calculate the key to
index on.

###### Returns

Key to index on (`unknown`).
Can be anything that can be used as a key in a [`Map`][map].

#### `Index#get(key)`

Get nodes by `key` (`unknown`).

###### Returns

List of zero or more nodes ([`Array<Node>`][node]).

#### `Index#add(node)`

Add `node` ([`Node`][node]) to the index (if not already present).

###### Returns

Nothing (`void`).

#### `Index#remove(node)`

Remove `node` ([`Node`][node]) from the index (if present).

###### Returns

Nothing (`void`).

## Types

This package is fully typed with [TypeScript][].
It exports the additional types `KeyFunction` and `Test`.

## Compatibility

Projects maintained by the unified collective are compatible with all maintained
versions of Node.js.
As of now, that is Node.js 12.20+, 14.14+, 16.0+, and 18.0+.
Our projects sometimes work with older versions, but this is not guaranteed.

## Related

*   [`unist-util-is`](https://github.com/syntax-tree/unist-util-is)
    — utility to check if a node passes a test
*   [`unist-util-visit`](https://github.com/syntax-tree/unist-util-visit)
    — utility to recursively walk over nodes
*   [`unist-util-select`](https://github.com/syntax-tree/unist-util-select)
    — select nodes with CSS-like selectors

## Contribute

See [`contributing.md`][contributing] in [`syntax-tree/.github`][health] for
ways to get started.
See [`support.md`][support] for ways to get help.

This project has a [Code of Conduct][coc].
By interacting with this repository, organisation, or community you agree to
abide by its terms.

## License

[MIT][license] © Eugene Sharygin

<!-- Definitions -->

[build-badge]: https://github.com/syntax-tree/unist-util-index/workflows/main/badge.svg

[build]: https://github.com/syntax-tree/unist-util-index/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/unist-util-index.svg

[coverage]: https://codecov.io/github/syntax-tree/unist-util-index

[downloads-badge]: https://img.shields.io/npm/dm/unist-util-index.svg

[downloads]: https://www.npmjs.com/package/unist-util-index

[size-badge]: https://img.shields.io/bundlephobia/minzip/unist-util-index.svg

[size]: https://bundlephobia.com/result?p=unist-util-index

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/syntax-tree/unist/discussions

[npm]: https://docs.npmjs.com/cli/install

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[typescript]: https://www.typescriptlang.org

[license]: license

[health]: https://github.com/syntax-tree/.github

[contributing]: https://github.com/syntax-tree/.github/blob/main/contributing.md

[support]: https://github.com/syntax-tree/.github/blob/main/support.md

[coc]: https://github.com/syntax-tree/.github/blob/main/code-of-conduct.md

[unist]: https://github.com/syntax-tree/unist

[node]: https://github.com/syntax-tree/unist#node

[is]: https://github.com/syntax-tree/unist-util-is

[map]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map

[key-function]: #function-keyfunctionnode
