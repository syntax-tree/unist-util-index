'use strict';

var Map = require('es6-map'),
    is = require('unist-util-is');


var IndexPrototype = {
  get: function (key) {
    return this.index.get(key) || [];
  },

  add: function (node) {
    var key = this.keyfn(node);

    if (!this.index.has(key)) {
      this.index.set(key, []);
    }

    var nodes = this.index.get(key);

    if (nodes.indexOf(node) < 0) {
      nodes.push(node);
    }

    return this;
  },

  remove: function (node) {
    var key = this.keyfn(node);
    var nodes = this.index.get(key);
    var nodeIndex;

    if (nodes && (nodeIndex = nodes.indexOf(node)) >= 0) {
      nodes.splice(nodeIndex, 1);
    }

    return this;
  }
};


module.exports = function Index (ast, filter, keyfn) {
  if (arguments.length == 1) {
    return Index(null, trueConst, arguments[0]);
  }
  if (arguments.length == 2) {
    return Index(arguments[0], trueConst, arguments[1]);
  }
  if (typeof keyfn == 'string') {
    keyfn = (function (prop) {
      return function (node) { return node[prop] };
    }(keyfn));
  }

  var index = Object.create(IndexPrototype, {
    index: {
      value: new Map
    },
    keyfn: {
      value: keyfn
    }
  });

  if (!ast) {
    return index;
  }

  // Initialize in preorder traversal.
  (function preorder (node, nodeIndex, parent) {
    if (is(filter, node, nodeIndex, parent)) {
      index.add(node);
    }

    node.children && node.children.forEach(function (child, childIndex) {
      preorder(child, childIndex, node);
    });
  }(ast, null, null));

  return index;
};


function trueConst () {
  return true;
}
