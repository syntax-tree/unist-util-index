import {visit} from 'unist-util-visit'

export class Index {
  constructor(prop, tree, filter) {
    if (filter === null || filter === undefined) {
      filter = trueConst
    }

    this.index = new Map()
    this.keyfn = typeof prop === 'string' ? (node) => node[prop] : prop

    if (tree) {
      visit(tree, filter, (node) => this.add(node))
    }
  }

  get(key) {
    return this.index.get(key) || []
  }

  add(node) {
    var key = this.keyfn(node)
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

  remove(node) {
    var key = this.keyfn(node)
    var nodes = this.index.get(key)
    var pos = nodes ? nodes.indexOf(node) : -1

    if (pos !== -1) {
      nodes.splice(pos, 1)
    }

    return this
  }
}

function trueConst() {
  return true
}
