'use strict';

var Index = require('..');

var test = require('tape'),
    u = require('unist-builder'),
    select = require('unist-util-select').one;


test('index.get', function (t) {
  var ast = u('node', { color: 'black', id: 0 }, [
    u('node', { color: 'black', id: 1 }, [
      u('node', { color: 'red', id: 2 }, [
        u('node', { color: 'black', id: 3 }),
        u('node', { color: 'black', id: 4 })
      ]),
      u('node', { color: 'black', id: 5 })
    ]),
    u('node', { color: 'red', id: 6 }, [
      u('node', { color: 'black', id: 7 }, [
        u('node', { color: 'black', id: 8 }),
        u('node', { color: 'black', id: 9 })
      ]),
      u('node', { color: 'black', id: 10 }, [
        u('node', { color: 'red', id: 11 }, [
          u('node', { color: 'black', id: 12 }),
          u('node', { color: 'black', id: 13 })
        ]),
        u('node', { color: 'black', id: 14 })
      ])
    ])
  ]);
  var $ = select.bind(null, ast);

  var index = Index(ast, 'color');

  t.deepEqual(index.get('black'), [
    $('[id=0]'),
    $('[id=1]'),
    $('[id=3]'),
    $('[id=4]'),
    $('[id=5]'),
    $('[id=7]'),
    $('[id=8]'),
    $('[id=9]'),
    $('[id=10]'),
    $('[id=12]'),
    $('[id=13]'),
    $('[id=14]')
  ]);

  t.deepEqual(index.get('red'), [
    $('[id=2]'),
    $('[id=6]'),
    $('[id=11]')
  ]);

  t.deepEqual(index.get('yellow'), []);

  t.end();
});
