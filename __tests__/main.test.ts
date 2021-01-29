import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import * as core from '@actions/core';
import * as main from '../src/main';
import * as service from '../src/service';
import q from 'q';
import http from 'http';

describe('Test basic destroy environment action', () => {
  const serverResponse_SUCCESS = {"servers": [{"name": "fake-server","id": 10, "host": "string", "port": 0, "status": "ONLINE"}]};
  const deleteReponse_SUCCESS =  {"id": 10, "name": "fake-server", "host": "string", "port": 0, "status": "ONLINE"}

  test('test basic disconnect server', () => {
    jest.spyOn(core, 'getInput').mockImplementation((val) => {
      if (val === 'ctpUrl') {
        return 'https://fake-ctp-endpoint:8080/em/'
      } else if (val === 'ctpUsername' || val === 'ctpPassword') {
        return 'secret';
      } else if (val === 'serverMatch') {
        return 'host'
      } else if (val === 'server') {
        return 'localhost'
      }
    });
    jest.spyOn(service.WebService.prototype, 'findServerInEM').mockImplementation((path, property, name) => {
        let def = q.defer();
        let promise = new Promise((resolve, reject) => {
            def.resolve = resolve;
            def.reject = reject;
        });
        console.log('findServerInEM invoked');
        let res = new http.IncomingMessage(null);
        res.statusCode = 200;
        if (path === '/api/v2/servers') {
          def.resolve(serverResponse_SUCCESS);
        }
        return promise;
    });
    jest.spyOn(service.WebService.prototype, 'deleteFromEM').mockImplementation((path) => {
        let def = q.defer();
        let promise = new Promise((resolve, reject) => {
            def.resolve = resolve;
            def.reject = reject;
        });
        console.log('deleteFromEM invoked');
        let res = new http.IncomingMessage(null);
        res.statusCode = 200;
        if (path === '/api/v2/servers/10?recursive=true') {
          def.resolve(deleteReponse_SUCCESS);
        }
        return promise;
    });
    main.run();
  });
  // // shows how the runner will run a javascript action with env / stdout protocol
// test('test runs', () => {
//   process.env['INPUT_CTPURL'] = 'http://104.42.225.105/em'
//   process.env['INPUT_CTPUSERNAME'] = 'admin'
//   process.env['INPUT_CTPPASSWORD'] = 'admin'
//   process.env['INPUT_SERVERMATCH'] = 'host'
//   process.env['INPUT_SERVER'] = 'localhost'
//   const np = process.execPath
//   const ip = path.join(__dirname, '..', 'lib', 'main.js')
//   const options: cp.ExecFileSyncOptions = {
//     env: process.env
//   }
//   console.log(cp.execFileSync(np, [ip], options).toString())
// })
});
