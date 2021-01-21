/// <reference path="typings/parasoft-em-api.d.ts" />

import * as core from '@actions/core'
import http = require('http');
import https = require('https');
import q = require('q');
import url = require('url');

// Get Environment Manager configuration

var emBaseURL = url.parse(core.getInput('ctpUrl'));
if (emBaseURL.path === '/') {
    emBaseURL.path = '/em';
} else if (emBaseURL.path === '/em/') {
    emBaseURL.path = '/em';
}
var protocol : any = emBaseURL.protocol === 'https:' ? https : http;
var protocolLabel = emBaseURL.protocol || 'http:';
var username = core.getInput('ctpUsername');
var serverType = core.getInput('serverType');
var serverValue =  core.getInput('server');

var deleteFromEM = function<T>(path: string) : q.Promise<T>{
    var def = q.defer<T>();
    var options = {
        host: emBaseURL.hostname,
        port: emBaseURL.port,
        path: emBaseURL.path + path,
        method: 'DELETE',
        headers: {
            'Accept': 'application/json'
        }
    }
    if (protocolLabel === 'https:') {
        options['rejectUnauthorized'] = false;
        options['agent'] = false;
    }
    if (username) {
      options['auth'] = username + ':' +  core.getInput('ctpPassword');
    }
    console.log('DELETE ' + protocolLabel + '//' + options.host + ':' + options.port + options.path);
    var responseString = "";
    protocol.get(options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            responseString += chunk;
        });
        res.on('end', () => {
            console.log('    response ' + res.statusCode + ':  ' + responseString);
            var responseObject = JSON.parse(responseString);
            def.resolve(responseObject);
        });
    }).on('error', (e) => {
        def.reject(e);
    });
    return def.promise;
};

var findServerInEM = function<T>(path: string, property: string, name: string) : q.Promise<T>{
    var def = q.defer<T>();
    var options = {
        host: emBaseURL.hostname,
        port: emBaseURL.port,
        path: emBaseURL.path + path,
        headers: {
            'Accept': 'application/json'
        }
    }
    if (protocolLabel === 'https:') {
        options['rejectUnauthorized'] = false;
        options['agent'] = false;
    }
    if (username) {
      options['auth'] = username + ':' +  core.getInput('ctpPassword');
    }
    console.log('GET ' + protocolLabel + '//' + options.host + ':' + options.port + options.path);
    var responseString = "";
    protocol.get(options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            responseString += chunk;
        });
        res.on('end', () => {
            console.log('    response ' + res.statusCode + ':  ' + responseString);
            var responseObject = JSON.parse(responseString);
            if (typeof responseObject[property] === 'undefined') {
                def.reject(property + ' does not exist in response object from ' + path);
                return;
            }
            for (var i = 0; i < responseObject[property].length; i++) {
				var match: string;
				if (serverType == 'host') {
					match = responseObject[property][i].host;
				} else {
					match = responseObject[property][i].name;
				}
                if ( match === name) {
                    def.resolve(responseObject[property][i]);
                    return;
                }
            }
            def.reject('Could not find server by matching "' + name + '" in ' + property + ' from ' + path);
            return;
        });
    }).on('error', (e) => {
        def.reject(e);
    });
    return def.promise;
};

async function run(): Promise<void> {
  findServerInEM<EMSystem>('/api/v2/servers', 'servers', serverValue).then((server: VirtServer) => {
      core.debug('Found server ' + serverValue + 'by matching ' + serverType);
      return deleteFromEM<VirtServer>('/api/v2/servers/' + server.id);
  }).then((res: VirtServer) => {
      if (res.name) {
          core.debug('Successfully disconnected server ' + res.name);
      } else {
          core.debug('Error deleting server');
          core.setFailed('Error deleting server');
      }
  }).catch((e) => {
      core.error(e);
      core.setFailed(e);
  });
}

run();
