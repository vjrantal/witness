'use strict';

var test = require('tape');
var url = require('url');
var querystring = require('querystring')

var proof = require('../proof.js');

test('proof can be stored', function (t) {
  proof.store(JSON.stringify({ foo: 'bar' }), function (error, urlString) {
    t.equal(error, null, 'should not return an error');
    t.equal(typeof urlString, 'string', 'should return a url as string');
    var parsedUrl = url.parse(urlString);
    var parsedQuery = querystring.parse(parsedUrl.query);
    t.ok(parsedQuery.hash, 'should return a hash in query string');
    t.ok(parsedQuery.id, 'should return an id in query string');
    t.end();
  });
});
