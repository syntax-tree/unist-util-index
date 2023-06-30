/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist-util-visit').Test} Test
 */

/**
 * @callback KeyFunction
 *   Function called with every added node (`Node`) to calculate the key to
 *   index on.
 * @param {Node} node
 *   Node to calculate a key for.
 * @returns {unknown}
 *   Key to index on.
 *
 *   Can be anything that can be used as a key in a `Map`.
 */

import {visit} from 'unist-util-visit'

export class Index {
  /**
   * Create a mutable index data structure, that maps property values or
   * computed keys, to nodes.
   *
   * If `tree` is given, the index is initialized with all nodes, optionally
   * filtered by `test`.
   *
   * @param {KeyFunction | string} prop
   *   Field (`string`) to look up in each node to find keys or function called
   *   with each node to calculate keys.
   * @param {Node | null | undefined} [tree]
   *   Tree to index (optional).
   * @param {Test | null | undefined} [test]
   *   `is`-compatible test (optional).
   */
  constructor(prop, tree, test) {
    /** @type {Map<unknown, Array<Node>>} */
    this.index = new Map()
    /** @type {KeyFunction} */
    this.key = typeof prop === 'string' ? createKeyFunction(prop) : prop

    if (tree) {
      visit(tree, test, (node) => {
        this.add(node)
      })
    }
  }

  /**
   * Get nodes by `key`.
   *
   * @param {unknown} key
   *   Key to retrieve.
   *
   *   Can be anything that can be used as a key in a `Map`.
   * @returns {Array<Node>}
   *   List of zero or more nodes.
   */
  get(key) {
    return this.index.get(key) || []
  }

  /**
   * Add `node` to the index (if not already present).
   *
   * @param {Node} node
   *   Node to index.
   * @returns
   *   Current instance.
   */
  add(node) {
    const key = this.key(node)
    let nodes = this.index.get(key)

    if (!nodes) {
      nodes = []
      this.index.set(key, nodes)
    }

    if (!nodes.includes(node)) {
      nodes.push(node)
    }

    return this
  }

  /**
   * Remove `node` from the index (if present).
   *
   * @param {Node} node
   *   Node to remove.
   * @returns
   *   Current instance.
   */
  remove(node) {
    const key = this.key(node)
    const nodes = this.index.get(key)

    if (nodes) {
      const pos = nodes.indexOf(node)
      if (pos !== -1) {
        nodes.splice(pos, 1)
      }
    }

    return this
  }
}

/**
 * @param {string} field
 * @returns {KeyFunction}
 */
function createKeyFunction(field) {
  return keyFunction

  /** @type {KeyFunction} */
  function keyFunction(node) {
    // @ts-expect-error: all nodes are plain objects and so indexable.
    const result = /** @type {unknown} */ (node[field])
    return result
  }
}
