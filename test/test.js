'use strict';

var Index = require('..');

var test = require('tape'),
    u = require('unist-builder'),
    select = require('unist-util-select');


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
  var $ = select.one(ast);

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


test('degenerate keys', function (t) {
  t.test('Object.prototype keys', function (t) {
    var ast = u('node', { word: '__proto__', id: 0 }, [
      u('node', { word: 'constructor', id: 1 }),
      u('node', { word: 'toString', id: 2 })
    ]);
    var $$ = select(ast);

    var index = Index(ast, 'word');

    t.deepEqual(index.get('__proto__'), $$('[id=0]'));
    t.deepEqual(index.get('constructor'), $$('[id=1]'));
    t.deepEqual(index.get('toString'), $$('[id=2]'));
    t.end();
  });

  t.test('identity keys', function (t) {
    var id1 = { foo: 'bar' };
    var id2 = { foo: 'bar' };
    var ast = u('root', [
      u('node', { word: false, id: 0 }),
      u('node', { word: 'false', id: 1 }),
      u('node', { word: 1, id: 2 }),
      u('node', { word: '1', id: 3 }),
      u('node', { word: id1, id: 4 }),
      u('node', { word: id2, id: 5 })
    ]);
    var $$ = select(ast);

    var index = Index(ast, 'word');

    t.deepEqual(index.get(false), $$('[id=0]'));
    t.deepEqual(index.get('false'), $$('[id=1]'));
    t.deepEqual(index.get(1), $$('[id=2]'));
    t.deepEqual(index.get('1'), $$('[id=3]'));
    t.deepEqual(index.get(id1), $$('[id=4]'));
    t.deepEqual(index.get(id2), $$('[id=5]'));
    t.deepEqual(index.get({ foo: 'bar' }), []);
    t.end();
  });

  t.end();
});
