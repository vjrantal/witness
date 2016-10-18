'use strict';

var crypto = require('crypto');

var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

var CONTRACT_ABI = JSON.parse('[{"constant":false,"inputs":[{"name":"hash","type":"bytes32"}],"name":"store","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"bytes32"}],"name":"retrieve","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"bytes32"}],"name":"Stored","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"hash","type":"bytes32"}],"name":"Retrieved","type":"event"}]');
var CONTRACT_ADDRESS = '0x40821b9d7ca4080600a6bf57a535b0c7b1da7cb9';
var URL_PREFIX = 'https://testnet.etherscan.io/tx/'; // TODO: Currently testnet only

module.exports.store = function (value, callback) {
  if (!web3.isConnected()) {
    return callback(new Error('Not connected to an Ethereum node'));
  }
  web3.eth.defaultAccount = web3.eth.accounts[0];

  var witnessContract = web3.eth.contract(CONTRACT_ABI);
  var witness = witnessContract.at(CONTRACT_ADDRESS);

  var hash = '0x' + crypto.createHash('sha256').update(
    value
  ).digest().toString('hex');

  var storedEvent = witness.Stored();
  storedEvent.watch(function (error, event) {
    storedEvent.stopWatching();
    if (error) {
      return callback(new Error(error));
    }
    var url = URL_PREFIX + event.transactionHash;
    callback(null, event.args.id, url);
  });
  witness.store(hash);
};

module.exports.isConnected = function () {
  return web3.isConnected();
};