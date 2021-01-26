import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_CTPURL'] = 'http://104.42.225.105/em'
  process.env['INPUT_CTPUSERNAME'] = 'admin'
  process.env['INPUT_CTPPASSWORD'] = 'admin'
  process.env['INPUT_SERVERMATCH'] = 'host'
  process.env['INPUT_SERVER'] = 'localhost'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})
