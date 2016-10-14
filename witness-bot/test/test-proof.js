var test = require('tape');
var proof = require('../proof.js');

test('proof can be stored', function (t) {
  proof.store(JSON.stringify({ foo: 'bar' }), function (error, id, url) {
    t.equal(error, null, 'should not return an error');
    t.ok(id, 'should return an id');
    t.ok(url, 'should return a url');
    t.end();
  });
});
