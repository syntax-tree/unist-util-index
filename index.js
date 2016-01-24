'use strict';

var Map = require('es6-map');


module.exports = function (ast, prop) {
  var index = new Map;

  (function preorder (node) {
    var key = node[prop];

    if (!index.has(key)) {
      index.set(key, []);
    }
    index.get(key).push(node);

    node.children && node.children.forEach(preorder);
  }(ast));

  return {
    get: function (key) {
      return index.get(key) || [];
    }
  };
};
