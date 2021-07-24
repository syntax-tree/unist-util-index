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
    /** @type {Map.<unknown, Array.<Node>>} */
    this.index = new Map()
    /** @type {KeyFunction} */
    this.key = typeof prop === 'string' ? (node) => node[prop] : prop

    if (tree) {
      visit(tree, test, (node) => {
        this.add(node)
      })
    }
  }

  /**
   * @param {unknown} key
   * @returns {Array.<Node>}
   */
  get(key) {
    return this.index.get(key) || []
  }

  /**
   * @param {Node} node
   */
  add(node) {
    const key = this.key(node)

    if (!this.index.has(key)) {
      this.index.set(key, [])
    }

    const nodes = this.index.get(key)

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
    const pos = nodes ? nodes.indexOf(node) : -1

    if (pos !== -1) {
      nodes.splice(pos, 1)
    }

    return this
  }
}
