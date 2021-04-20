/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist-util-visit').Type} Type
 * @typedef {import('unist-util-visit').Props} Props
 * @typedef {import('unist-util-visit').TestFunctionAnything} TestFunctionAnything
 *
 * @typedef {(node: Node) => unknown} KeyFunction
 */

import {visit} from 'unist-util-visit'

export class Index {
  /**
   * @param {string|KeyFunction} prop
   * @param {Node} [tree]
   * @param {null|undefined|Type|Props|TestFunctionAnything|Array<Type|Props|TestFunctionAnything>} [test]
   */
  constructor(prop, tree, test) {
    /** @type {Map.<unknown, Array.<Node>>} */
    this.index = new Map()
    /** @type {KeyFunction} */
    this.key =
      typeof prop === 'string' ? (/** @type {Node} */ node) => node[prop] : prop

    if (tree) {
      visit(tree, test, (/** @type {Node} */ node) => {
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
    var key = this.key(node)
    /** @type {Array.<Node>} */
    var nodes

    if (!this.index.has(key)) {
      this.index.set(key, [])
    }

    nodes = this.index.get(key)

    if (!nodes.includes(node)) {
      nodes.push(node)
    }

    return this
  }

  /**
   * @param {Node} node
   */
  remove(node) {
    var key = this.key(node)
    var nodes = this.index.get(key)
    var pos = nodes ? nodes.indexOf(node) : -1

    if (pos !== -1) {
      nodes.splice(pos, 1)
    }

    return this
  }
}
