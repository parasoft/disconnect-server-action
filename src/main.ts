/// <reference path="typings/parasoft-em-api.d.ts" />

import * as core from '@actions/core'
import * as service from './service';

export async function run(): Promise<void> {
  var ctpEndpoint = core.getInput('ctpUrl', { required: true });
  var ctpUsername = core.getInput('ctpUsername', { required: true });
  var ctpPassword = core.getInput('ctpPassword', { required: true });
  var serverType = core.getInput('serverMatch', { required: true });
  var serverValue =  core.getInput('server', { required: true });
  var ctpService = new service.WebService(ctpEndpoint, 'em', serverType, { username: ctpUsername, password: ctpPassword });

  ctpService.findServerInEM<EMSystem>('/api/v2/servers', 'servers', serverValue).then((server: VirtServer) => {
      core.debug('Found server ' + serverValue + 'by matching ' + serverType);
      return ctpService.deleteFromEM<VirtServer>('/api/v2/servers/' + server.id);
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
