var crypto = require('crypto');

contract('Witness', function (accounts) {

  it('should be able to store and retrieve a document hash', function (done) {
    var witness = Witness.deployed();

    var hash = crypto.createHash('sha256').update(
      JSON.stringify(
        {
          foo: 'bar'
        }
      )
    ).digest().toString('hex');
    hash = '0x' + hash;

    var storedEvent = witness.Stored();
    var retrievedEvent = witness.Retrieved();

    storedEvent.watch(function (error, event) {
      storedEvent.stopWatching();

      assert.isOk(event.args.id, 'Stored-event should have the generated id as argument');

      witness.retrieve(event.args.id);
    });

    retrievedEvent.watch(function (error, event) {
      retrievedEvent.stopWatching();

      assert.equal(event.args.hash, hash, 'Retrieved-event should have the right hash value');

      done();
    });

    witness.store(hash);
  });

});
