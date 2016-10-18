'use strict';

global.window = global;
global.Web3 = require('web3');

var crypto = require('crypto');

global.sha256 = function (value) {
  return crypto.createHash('sha256').update(
    value
  ).digest().toString('hex');
};

global.location = {};
global.location.search = '?hash=0xa51a37a6463f03e9e0dede7fa6125122f63017ef55155be86f23ca08c17c55cf&id=0xc2d21870d9eaad9aa3199c1a11c87ec74d9453b384b4b0a1d9db38452ce07c12';

var test = require('tape');
var fs = require('fs');
var path = require('path');

var witness = require('../static/witness.js');

test('proof can be validated', function (t) {
  var filePath = path.join(__dirname, 'conversation.txt');
  fs.readFile(filePath, { encoding: 'utf-8' }, function (error, content) {
    global.witness.validateProof(content, function (valid) {
      t.equal(valid, true, 'should be valid');
      t.end();
    });
  });
});
