const init = require('./init')
const { set, getRc } = require('./set')
const build = require('./build')
const start = require('./start')
const create = require('./create')
const compress = require('./compress')
const publish = require('./publish')
const login = require('./login')
const zip = require('./zip')
module.exports = {
  init,
  build,
  start,
  create,
  set,
  getRc,
  publish,
  compress,
  login,
  zip
}
