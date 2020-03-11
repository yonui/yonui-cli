const init = require('./init')
const buildProject = require('./build')
const developProject = require('./start')
const create = require('./create')
const compress = require('./compress')
module.exports = {
  init: init,
  build: buildProject,
  start: developProject,
  create,
  compress
}
