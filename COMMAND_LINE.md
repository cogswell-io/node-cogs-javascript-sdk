# The cogs command line utility
This module includes a command-line utility named named `cogs`. You can use it in order to run the tools commands. By default it will look for a configuration file in either the current directory or your home directory named either cogswell.json or cogs.json. You can also supply the location of the config file as the last argument to any command.

If you install locally, the `cogs` command will be available only within that project. Installing it globally makes it available from anywhere.

## List the available commands
```
$ cogs -h

  Usage: cogs [options] [command]


  Commands:

    key [config]                         
    client-key [config]                  
    uuid [config]                        
    random-uuid [config]                 
    schema <namespace> [config]          
    namespace-schema <namespace> [config]
    build [config]
    build-info [config]

  Options:

    -h, --help  output usage information

```

## Generate a client key config file
```
$ cogs key
Wrote new client config to cogs-client-abababababababab.json

$ cat cogs-client-abababababababab.json
{
  "api_key": {
    "access": "abababababababababababababababab"
  },
  "client_key": {
    "salt": "abababababababababababababababababababababababababababababababab",
    "secret": "abababababababababababababababababababababababababababababababab"
  },
  "http_request_timeout": 30000,
  "websocket_connect_timeout": 30000,
  "websocket_auto_reconnect": true
}
```

## Generate a random UUID
```
$ cogs uuid
7932ff8e-d454-4531-beac-3437c46d13fb
```

## Describe a namespace schema
```
$ cogs schema auto-monitor
{
  "attributes": [
    {
      "name": "driver-door-open",
      "data_type": "Boolean",
      "core": false,
      "ciid": false
    },
    {
      "name": "hood-open",
      "data_type": "Boolean",
      "core": false,
      "ciid": false
    },
    {
      "name": "vehicle-uuid",
      "data_type": "Text",
      "core": false,
      "ciid": true
    }
  ]
}
```

## Fetch the build info for the Cogs' API
```
$ cogs build-info
{
  "build_time": "2016-06-13T22:39:55+0000",
  "commit_hash": "da3d615485135b71873481282c13d30e52b16370"
}
```