<!-- toc -->
- [Cogs Pub/Sub Connection API](#cogs-pubsub-connection-api)
  - [connection.getSessionUuid()](#connectiongetsessionuuid)
  - [connection.subscribe(channelName, messageHandler)](#connectionsubscribechannelname-messagehandler)
  - [connection.unsubscribe(channelName)](#connectionunsubscribechannelname)
  - [connection.unsubscribeAll()(#connectionunsubscribeall)
  - [connection.listSubscriptions()](#connectionlistsubscriptions)
  - [connection.publish(channelName, message, [errorHandler])](#connectionpublishchannelname-message-errorhandler)
  - [connection.publishWithAck(channelName, message)](#connectionpublishwithackchannelname-message)
  - [connection.close()](#connectionclose)
  - [Connection Events](#events-emitted-for-pubsub-connection)
    - [Event: 'raw-record'](#event-raw-record)
    - [Event: 'message'](#event-message)
    - [Event: 'error'](#event-error)
    - [Event: 'reconnect'](#event-reconnect)
    - [Event: 'close'](#event-close)
    - [Event: 'new-session'](#event-new-session)
<!-- tocstop -->

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

The connection will need read permissions in order to subscribe to a channel.

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
The connection will need read permissions in order to unsubscribe from a channel.

```javascript
connection.unsubscribe('example-channel')
.then(subscribedChannels => {
  console.log(subscribedChannels); // This list will not include the example-channel channel
});
```
## connection.unsubscribeAll()
The connection will need read permission in order to unsubscribe from all channels.

```javascript
connection.unsubscribeAll()
.then(previousChannels => {
  console.log(previousChannels); // This is the list of channels to which we were subscribed prior to running this operation
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

connection.publishWithAck('channel', 'Hello World!')
.then((messageUuid) => {
  //message successfully published
})
.catch(errorHandler);
```

## connection.close()
Closes the pub/sub client handle by closing the WebSocket.

```javascript
connection.close()
.then(() => {

})
```
## Connection Events

### Event: 'raw-record'
The 'raw-record' event is emitted for every raw record received from the server, whether a response to a request or a message. This is mostly useful for debugging issues with server communication.

### Event: 'message'
The 'message' event is emitted whenever the socket receives messages from any channel.

### Event: 'error'
The 'error' event is emitted on any connection errors, failed publishes, or when any exception is thrown.

### Event: 'error-response'
The 'error-response' event is emitted whenever a message is sent to the user with an error status code.

### Event: 'reconnect'
The 'reconnect' event is emitted on socket reconnection if it disconnected for any reason.

### Event: 'close'
The 'close' event is emitted whenever the socket conenction closes.

### Event: 'new-session'
The 'new-session' event indicates that the session associated with this connection is not a resumed session, therefore there are no subscriptions associated with this session. If there had been a previous session and the connection was replaced by an auto-reconnect, the previous session was not restored resulting in all subscriptions being lost.
