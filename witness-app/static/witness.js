// Check if we are running in a context where the web3
// is already available and only not, initialize it
// by connecting it to a node over HTTP
if (typeof web3 !== 'undefined') {
  window.web3 = new Web3(web3.currentProvider);
} else {
  window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

(function () {
  // Query string parsing taken from the comments to:
  // http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
  var qs = (function (a) {
    if (a === '') return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
      var p = a[i].split('=', 2);
      if (p.length == 1)
        b[p[0]] = '';
      else
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, ' '));
    }
    return b;
  })(window.location.search.substr(1).split('&'));

  window.witness = {
    abi: JSON.parse('[{"constant":false,"inputs":[{"name":"hash","type":"bytes32"}],"name":"store","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"bytes32"}],"name":"retrieve","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"bytes32"}],"name":"Stored","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"hash","type":"bytes32"}],"name":"Retrieved","type":"event"}]'),
    validateProof: function (content, callback) {
      web3.eth.getTransaction(qs.hash, function (error, transaction) {
        if (error) {
          console.log('With ' + qs.hash + ' getTransaction returned error:');
          console.log(error);
          callback(false);
          return;
        }

        var contractAddress = transaction.to;
        var witnessContract = web3.eth.contract(window.witness.abi);
        var witnessInstance = witnessContract.at(contractAddress);

        witnessInstance.retrieve.call(qs.id, function (error, storedChecksum) {
          var contentChecksum = '0x' + sha256(content);
          var valid = contentChecksum === storedChecksum;
          console.log(contentChecksum);
          console.log(storedChecksum);
          callback(valid);
        });
      });
    }
  };
})();
