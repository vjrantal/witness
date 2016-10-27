'use strict';

var restify = require('restify');
var builder = require('botbuilder');

var proof = require('./proof.js');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
  console.log('%s listening to %s', server.name, server.url);
});

var connector = new builder.ChatConnector({
  appId: process.env.CHAT_CONNECTOR_APP_ID,
  appPassword: process.env.CHAT_CONNECTOR_APP_PASSWORD
});

var bot = new builder.UniversalBot(connector, { persistConversationData: true });
server.post('/api/messages', connector.listen());

bot.dialog('/', new builder.IntentDialog()
  .matches(/.witness.*store$/i, function (session) {
    if (!proof.isConnected()) {
      session.send('Failed to store the proof');
      return;
    }
    if (!session.conversationData.conversation) {
      session.send('Haven\'t yet witnessed any conversation');
      return;
    }

    session.send('Started storing the proof...');
    session.sendBatch();

    var value = JSON.stringify(session.conversationData.conversation);

    // Clear the conversation that was collected so far
    delete session.conversationData.conversation;
    session.save();

    // Start indicating to the user that the bot is working on it
    session.sendTyping();
    var typingInterval = setInterval(function () {
      session.sendTyping();
    }, 2000);

    // Store the string value of the conversation
    proof.store(value, function (error, url) {
      // Stop the working indication
      clearInterval(typingInterval);

      var attachment = {
        contentUrl: 'data:text/plain;base64,' + new Buffer(value).toString('base64'),
        contentType: 'text/plain',
        name: 'conversation.txt'
      };

      var msg = new builder.Message()
        .address(session.message.address)
        .text('Please store the attached conversation to prove it later at ' + url)
        .addAttachment(attachment);

      bot.send(msg);
    });
  })
  .onDefault(function (session) {
    if (typeof session.conversationData.conversation === 'undefined') {
      session.conversationData.conversation = [];
      session.send('Started witnessing the conversation...');
    }
    session.conversationData.conversation.push(session.message);
    session.endDialog();
  })
);
