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
    *   [`KeyFunction`](#keyfunction)
    *   [`Test`](#test)
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
In Node.js (version 16+), install with [npm][]:

```sh
npm install unist-util-index
```

In Deno with [`esm.sh`][esmsh]:

```js
import {Index} from 'https://esm.sh/unist-util-index@4'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {Index} from 'https://esm.sh/unist-util-index@4?bundle'
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

console.log(
  indexOnDepth.get(2).map(function (d) {
    return toString(d)
  })
)

// Index on definition identifier:
const indexOnIdentifier = new Index('identifier', tree, 'definition')

console.log(
  indexOnIdentifier.get('unist').map(function (node) {
    return node.url
  })
)
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

This package exports the identifier [`Index`][index].
There is no default export.

### `Index(prop|keyFunction[, tree[, test]])`

Create a mutable index data structure, that maps property values or computed
keys, to nodes.

If `tree` is given, the index is initialized with all nodes, optionally
filtered by `test`.

###### Parameters

*   `prop` (`string`)
    — field to look up in each node to find keys
*   `keyFunction` ([`KeyFunction`][keyfunction])
    — function called with each node to calculate keys
*   `tree` ([`Node`][node], optional)
    — tree to index
*   `test` ([`Test`][test], optional)
    — `unist-util-is` compatible test

###### Returns

Instance (`Index`).

#### `Index#get(key)`

Get nodes by `key`.

###### Parameters

*   `key` (`unknown`)
    — key to retrieve, can be anything that can be used as a key in a
    [`Map`][map]

###### Returns

List of zero or more nodes ([`Array<Node>`][node]).

#### `Index#add(node)`

Add `node` to the index (if not already present).

###### Parameters

*   `node` ([`Node`][node])
    — node to index

###### Returns

Current instance (`Index`).

#### `Index#remove(node)`

Remove `node` from the index (if present).

###### Parameters

*   `node` ([`Node`][node])
    — node to remove

###### Returns

Current instance (`Index`).

### `KeyFunction`

Function called with every added node to calculate the key to index on
(TypeScript type).

###### Parameters

*   `node` ([`Node`][node])
    — node to calculate a key for

###### Returns

Key to index on (`unknown`).

Can be anything that can be used as a key in a [`Map`][map].

### `Test`

[`unist-util-is`][unist-util-is] compatible test (TypeScript type).

## Types

This package is fully typed with [TypeScript][].
It exports the additional types [`KeyFunction`][keyfunction] and
[`Test`][test].

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line, `unist-util-index@^4`,
compatible with Node.js 16.

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

[size-badge]: https://img.shields.io/badge/dynamic/json?label=minzipped%20size&query=$.size.compressedSize&url=https://deno.bundlejs.com/?q=unist-util-index

[size]: https://bundlejs.com/?q=unist-util-index

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

[map]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map

[unist-util-is]: https://github.com/syntax-tree/unist-util-is

[index]: #indexpropkeyfunction-tree-test

[keyfunction]: #keyfunction

[test]: #test
