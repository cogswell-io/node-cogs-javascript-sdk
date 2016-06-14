#!/usr/bin/env node

var _ = require('lodash');
var Q = require('q');
var fs = require('fs');
var program = require('commander');

var cogs = require('../lib/index');

var homedir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

var configPaths = [
  `${homedir}/.cogswell/cogs.json`,
  `${homedir}/cogswell.json`,
  `${homedir}/cogs.json`,
  `./cogswell.json`,
  `./cogs.json`
];

function jsonify(obj) {
  return JSON.stringify(obj, null, 2);
}

function beautify(json) {
  return jsonify(JSON.parse(json))
}

function findConfig(paths) {
  if (!paths || paths.length < 1)
    return Q(undefined);
  else {
    var configFile = paths[0];
    var rest = paths.length > 1 ? paths.slice(1) : undefined;

    var d = Q.defer();
    fs.exists(configFile, (e) => d.resolve(e));
    return d.promise.then((e) => e ? configFile : findConfig(rest));
  }
}

function clientKey(client) {
  return client.newClientKey()
  .then((clientKey) => {
    var clientFile = `cogs-client-${clientKey.client_salt.substr(0, 16)}.json`;
    var clientConfig = {
      api_key: {
        access: client.accessKey()
      },
      client_key: {
        salt: clientKey.client_salt,
        secret: clientKey.client_secret
      },
      http_request_timeout: 30000,
      websocket_connect_timeout: 30000,
      websocket_auto_reconnect: true
    };

    Q.nfcall(fs.writeFile, clientFile, jsonify(clientConfig) + '\n')
    .then(() => console.log(`Wrote new client config to ${clientFile}`));
  });
}

function buildInfo(client) {
  return client.getBuildInfo().then((result) => console.log(jsonify(result)));
}

function randomUuid(client) {
  return client.newRandomUuid().then((result) => console.log(result.uuid));
}

function namespaceSchema(client, namespace) {
  return client.getNamespaceSchema(namespace)
  .then((schema) => console.log(jsonify(schema)));
}

function runInfoCommand(command, args, configFile) {
  return cogs.info.getClient(configFile)
  .then((client) => {
    switch(command) {
      case 'build-info': return buildInfo(client);
      default: console.log("runInfoCommand: unrecognized.");
    }
  });
}

function runToolsCommand(command, args, configFile) {
  return cogs.tools.getClient(configFile)
  .then((client) => {
    switch(command) {
      case 'client-key': return clientKey(client);
      case 'random-uuid': return randomUuid(client);
      case 'namespace-schema': return namespaceSchema(client, args[0]);
      default: console.log("runToolsCommand: unrecognized.");
    }
  });
}

function run(command, args, configFilePath) {
  if (configFilePath)
    configPaths.unshift(configFilePath);

  findConfig(configPaths)
  .then((configFile) => {
    if (!configFile) {
      console.log(`Config file not found. Expected in one of the following locations:\n  ${_(configPaths).join('\n  ')}`);
      process.exit(1);
    }

    return configFile;
  }).then((configFile) => {
    switch(command) {
      case 'build-info': return runInfoCommand(command, args, configFile);
      default: return runToolsCommand(command, args, configFile);
    }
  })
  .catch((error) => console.log(`Unexpected error: ${error}\n${error.stack}`));
}

program.command('key [config]').action((config) => run('client-key', [], config));
program.command('client-key [config]').action((config) => run('client-key', [], config));

program.command('uuid [config]').action((config) => run('random-uuid', [], config));
program.command('random-uuid [config]').action((config) => run('random-uuid', [], config));

program.command('schema <namespace> [config]')
.action((namespace, config) => run('namespace-schema', [namespace], config));
program.command('namespace-schema <namespace> [config]')
.action((namespace, config) => run('namespace-schema', [namespace], config));

program.command('build').action(() => run('build-info'));
program.command('build-info').action(() => run('build-info'));

program.parse(process.argv);
