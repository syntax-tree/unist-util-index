'use strict';

var Map = require('es6-map'),
    is = require('unist-util-is');


module.exports = function Index (ast, filter, prop) {
  if (prop === undefined) {
    return Index(ast, function () { return true }, filter);
  }

  var index = new Map;

  (function preorder (node, nodeIndex, parent) {
    if (is(filter, node, nodeIndex, parent)) {
      var key = node[prop];

      if (!index.has(key)) {
        index.set(key, []);
      }

      index.get(key).push(node);
    }

    node.children && node.children.forEach(function (child, childIndex) {
      preorder(child, childIndex, node);
    });
  }(ast, null, null));

  return {
    get: function (key) {
      return index.get(key) || [];
    }
  };
};
