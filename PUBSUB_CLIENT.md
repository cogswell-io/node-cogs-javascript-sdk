# Cogs Pub/Sub Connection API
This is a summary of all functions exposed by the pubsub connection object, and examples of each being used.

## connection.getSessionUuid()
Fetch the session UUID from the server, which will trigger caching to be enabled if it is enabled on the project. The result, if successful, is the UUID associated with this connection's session.

```javascript
connection.getSessionUuid()
.then(uuid => {
  //this UUID can be used to restore the session
});
```

## connection.subscribe(channelName, messageHandler)
Subscribe to a channel, supplying a handler which will be called with each message received from this channel. The result, if successful, contains a list of the channels to which this connection is subscribed.

The connection will need read permissions to be able to subscribe to a channel.

```javascript
var messageHandler = (message) => {
  //do things with message received
}

connection.subscribe('channel', messageHandler)
.then(subscribedChannels => {
  console.log(subscribedChannels); //In this case would output ['channel']
});
```
## connection.unsubscribe(channelName)
The connection will need read permissions to be able to subscribe to a channel.

```javascript
connection.unsubscribe('example-channel')
.then(subscribedChannels => {
  console.log(subscribedChannels); //This list will not include the example-channel channel
});
```

## connection.listSubscriptions()
The result, if successful, contains an array of the channels to which this connection is still subscribed.

```javascript
connection.listSubscriptions()
.then(subscribedChannels => {
  //Interact with subscribed channels.
})
```

## connection.publish(channelName, message, [errorHandler])
Publishes a message to a channel. The result, if successful, contains the sequence number of the publish directive. The connection must have write permissions to successfully publish a message.
The message string is limited to 64KiB. Messages that exceed this limit will result in the termination of the websocket connection.

```javascript
var errorHandler = (err) => {
  //handle errors
}

connection.publish('channel', 'Hello World!', errorHandler)
.then((sequence) => {
  //message publish request sent
})
```

## connection.publishWithAck(channelName, message)
Publishes a message to a channel. The result, if successful, contains the UUID of the message published.

```javascript
var errorHandler = (err) => {
  //handle errors
}

connection.publish('channel', 'Hello World!')
.then((sequence) => {
  //message successfully published
})
.catch(errorHandler);
```

## connection.close()
Closes the pub/sub client handle by first requesting an unsubscribe from all channels, then closing the WebSocket. The result, if successful, contains a list of the channels to which the connection was subscribed for close was called.

```javascript
connection.close()
.then(unsubscribedChannels => {

})
```
## Events Emitted for Pub/Sub Connection

### connection.on('raw-record', handler)
Register a handler for any raw record received from the server, whether a response to a request or a message. This is mostly useful for debugging issues with server communication.

### connection.on('message', handler)
Register a handler for messages from any channel.

### connection.on('error', handler)
Register a handler for connection errors, failed publishes, etc.

### connection.on('reconnect', handler)
Register a handler for reconnect events.

### connection.on('close', handler)
Register a handler for close events.

### connection.on('new-session', handler)
Register a handler for new session events. This indicates that the session associated with this connection is not a resumed session, therefore there are no subscriptions associated with this session. If there had been a previous session and the connection was replaced by an auto-reconnect, the previous session was not restored resulting in all subscriptions being lost.