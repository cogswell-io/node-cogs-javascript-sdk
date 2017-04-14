# A unified JavaScript SDK for the Cogs (cogswell.io) APIs

[![Version npm](https://img.shields.io/npm/v/cogs-sdk.svg?style=flat-square)](http://browsenpm.org/package/cogs-sdk)

<!-- toc -->
- [Cogs SDK](#cogs-sdk)
  - [cogs.info](#cogsinfo)
    - [`cogs.info.getApiDocs()`](#cogsinfogetapidocs)
    - [`cogs.info.getBuildInfo()`](#cogsinfogetbuildinfo)
  - [cogs.tools](#cogstools)
    - [cogs.tools.getNamespaceSchema(namespace)](#cogstoolsgetnamespaceschemanamespace)
    - [cogs.tools.getRandomUuid()](#cogstoolsgetrandomuuid)
    - [cogs.tools.newClientKey()](#cogstoolsnewclientkey)
  - [cogs.cep](#cogscep)
    - [cogs.cep.getClient(config)](#cogscepgetclientconfig)
  - [cogs.pubsub](#cogspubsub)
    - [cogs.pubsub.connect(keys, [options])](#cogspubsubconnectkeys-options)
  - [Cogs Command Line Utility](#cogs-command-line-utility)

<!-- tocstop -->

# Cogs SDK

There are different configurations for the client and tools SDKs. While it is possible to include all key components (both the api key and client key) required in order to use both at the same time (and this is fine for testing on your own equipment), the secret component of your Cogs API key should never be placed into an app, a consumer device, or field unit.

An example of each type of config are included in this repository in the `cogs-tools.json` and `cogs-client.json` for the tools and client APIs respectively.

The tools SDK requires that the `api_key.access` and `api_key.secret` fields be populated.

The client SDK requires that the `api_key.access`, `client_key.salt`, and `client_key.secret` fields be populated.

## cogs.info

### cogs.info.getApiDocs()
Provides the Swagger documentation for the Cogs APIs formatted as JSON.

```javascript
var cogs = require('cogs-sdk');

cogs.info.getClient('cogs-tools.json')
.then((client) => {
  return client.getApiDocs();
})
.then((docs) => {
  console.log(`Cogs API Docs:\n${JSON.stringify(docs, null, 2)}`);
})
.catch((error) => {
  console.error(`Error fetching the Cogs API docs: ${error}\n${error.stack}`);
});
```


### cogs.info.getBuildInfo()
Provides details regarding the currently deployed version Cogs. This information is useful when reporting issues with the service APIs.

```javascript
var cogs = require('cogs-sdk');

cogs.info.getClient('cogs-tools.json')
.then((client) => {
  return client.getBuildInfo();
})
.then((docs) => {
  console.log(`Cogs Build Info:\n${JSON.stringify(docs, null, 2)}`);
})
.catch((error) => {
  console.error(`Error fetching the Cogs build info: ${error}\n${error.stack}`);
});
```


## cogs.tools
All of these routes are authenticated using the access_key and secret_key.

### cogs.tools.getNamespaceSchema(namespace)
Use this endpoint to fetch the schema for one of your namespaces. This will include all attributes, indicate the type of each attribute, and indicate whether it is part of the primary key for that namespace.

```javascript
var cogs = require('cogs-sdk');
var namespace = 'my-namespace';

cogs.tools.getClient('cogs-tools.json')
.then((client) => {
  return client.getNamespaceSchema(namespace);
})
.then((schema) => {
  console.log(`Schema for namespace '${namespace}':\n${JSON.stringify(schema, null, 2)}`);
})
.catch((error) => {
  console.error(`Error fetching the schema for namespace ${namespace}: ${error}\n${error.stack}`);
});
```

### cogs.tools.getRandomUuid()
Use this endpoint to generate random (version 4) UUID for use by client devices from a solid entropy source.

```javascript
var cogs = require('cogs-sdk');

cogs.tools.getClient('cogs-tools.json')
.then((client) => {
  return client.newRandomUuid();
})
.then((uuid) => {
  console.log(`New Random UUID:\n${uuid}`);
})
.catch((error) => {
  console.error(`Error generatoring new random UUID: ${error}\n${error.stack}`);
});
```

### cogs.tools.newClientKey()
Use this endpoint to generate new client keys for your client devices/apps. The new salt/secret pair will be associated with the api key you use to authenticate this API operation. When you disable (revoke) an api key, all client keys generated using that api key are also disabled.

```javascript
var cogs = require('cogs-sdk');

cogs.tools.getClient('cogs-tools.json')
.then((client) => {
  return client.newClientKey();
})
.then((clientKey) => {
  console.log(`New Cogs Client Key:\n${JSON.stringify(clientKey, null, 2)}`);
})
.catch((error) => {
  console.error(`Error generating new Cogs client key: ${error}\n${error.stack}`);
});
```


## cogs.cep
All of these routes are authenticated using the access_key, client_salt and client_secert.

### cogs.cep.getClient(config)
Using a configuration json file, you can initialize a client to interact with Cogs CEP.

```javascript
var cogs = require('cogs-sdk');

cogs.cep.getClient('cogs-client.json')
.then((client) => {
  //interact with client here
});
```

See [full CEP client documentation](https://github.com/cogswell-io/node-cogs-javascript-sdk/blob/master/CEP_CLIENT.md) for more information.

## cogs.pubsub
All of these routes are authenticated using the pubsub project_key. These keys are generated in the pubsub portion of the admin panel on Cogswell. Every key has an associated read_key, write_key, and admin_key. 

### cogs.pubsub.connect(keys, [options])
This function will authenticate using the supplied project keys, and the connection will permit read (subscribe), write (publish), and admin operations based on the supplied keys. It returns a promise which will either be completed with a connection handle or failed with an error if the initial connection attempt failed.

```javascript
var cogs = require('cogs-sdk');

var readKey = 'R-deadbeefdeadbeef-deadbeefdeadbeef';
var writeKey = 'W-deadbeefdeadbeef-beefdeadbeefdead';
var adminKey = 'A-deadbeefdeadbeef-deadbeefdeadbeefdeadbeefdeadbeef'

//All of the default options
var options = {
  sessionUuid: undefined, //Provide a session ID string to restore an old connected session
  url: 'wss://api.cogswell.io/pubsub',
  connectTimeout: 5000,
  autoReconnect: true, //reconnect on failure
  pingInterval: 15000, //frequency at which websocket pings
  logLevel: 'error' //configurable logs for the SDK
}

//This connection will have read, write, and admin permissions since all keys were provided
cogs.pubsub.connect([readKey, writeKey, adminKey], options)
.then(pubsubConnection => {
  //Interact with the pubsub connection here
});
```
See [full pubsub connection API ](https://github.com/cogswell-io/node-cogs-javascript-sdk/blob/master/PUBSUB_CLIENT.md) for more information.

## Cogs Command Line Utility

There is also a [command line utility](https://github.com/cogswell-io/node-cogs-javascript-sdk/blob/master/COMMAND_LINE.md) to help you get started using this SDK
