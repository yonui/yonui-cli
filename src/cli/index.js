const init = require('./init')
const { set } = require('./set')
const build = require('./build')
const start = require('./start')
const create = require('./create')
const compress = require('./compress')
const publish = require('./publish')
module.exports = {
  init,
  build,
  start,
  create,
  set,
  publish,
  compress
}
