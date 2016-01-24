'use strict';


module.exports = function (ast, prop) {
  var index = Object.create(null);

  (function preorder (node) {
    var key = node[prop];
    index[key] = index[key] || [];
    index[key].push(node);

    node.children && node.children.forEach(preorder);
  }(ast));

  return {
    get: function (key) {
      return index[key] || [];
    }
  };
};
