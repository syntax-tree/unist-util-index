import Map from 'es6-map'
import {visit} from 'unist-util-visit'

Index.prototype.get = get
Index.prototype.add = add
Index.prototype.remove = remove

export function Index(tree, filter, prop) {
  var self

  if (!(this instanceof Index)) {
    return new Index(tree, filter, prop)
  }

  if (prop === null || prop === undefined) {
    if (filter === null || filter === undefined) {
      prop = tree
      tree = null
    } else {
      prop = filter
    }

    filter = trueConst
  }

  self = this

  this.index = new Map()
  this.keyfn = typeof prop === 'string' ? pluck : prop

  if (tree) {
    visit(tree, filter, add)
  }

  return this

  function pluck(node) {
    return node[prop]
  }

  function add(node) {
    self.add(node)
  }
}

function get(key) {
  return this.index.get(key) || []
}

function add(node) {
  var self = this
  var key = self.keyfn(node)
  var nodes

  if (!self.index.has(key)) {
    self.index.set(key, [])
  }

  nodes = self.index.get(key)

  if (nodes.indexOf(node) === -1) {
    nodes.push(node)
  }

  return self
}

function remove(node) {
  var self = this
  var key = self.keyfn(node)
  var nodes = self.index.get(key)
  var pos = nodes ? nodes.indexOf(node) : -1

  if (pos !== -1) {
    nodes.splice(pos, 1)
  }

  return self
}

function trueConst() {
  return true
}
