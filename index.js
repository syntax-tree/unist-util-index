/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist-util-visit').Test} Test
 *
 * @typedef {(node: Node) => unknown} KeyFunction
 */

import {visit} from 'unist-util-visit'

export class Index {
  /**
   * @param {string|KeyFunction} prop
   * @param {Node} [tree]
   * @param {Test} [test]
   */
  constructor(prop, tree, test) {
    /** @type {Map<unknown, Array<Node>>} */
    this.index = new Map()
    /** @type {KeyFunction} */
    // @ts-expect-error: Looks indexable.
    this.key = typeof prop === 'string' ? (node) => node[prop] : prop

    if (tree) {
      visit(tree, test, (node) => {
        this.add(node)
      })
    }
  }

  /**
   * @param {unknown} key
   * @returns {Array<Node>}
   */
  get(key) {
    return this.index.get(key) || []
  }

  /**
   * @param {Node} node
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
   * @param {Node} node
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
