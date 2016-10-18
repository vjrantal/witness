window.onload = function () {
  var options = {
    readAsDefault: 'Text',
    on: {
      load: function (e, file) {
        window.witness.validateProof(e.target.result, function (valid) {
          document.getElementById('result').innerHTML = valid ? 'Conversation valid' : 'Conversation invalid';
        });
      }
    }
  };
  FileReaderJS.setupDrop(
    document.getElementById('drop-area'),
    options
  );
};
