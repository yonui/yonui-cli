const creatNewProject = require('./init')
const buildProject = require('./build')
const developProject = require('./start')
const createNewComponent = require('./new')
const compress = require('./compress')
module.exports = {
  create: creatNewProject,
  build: buildProject,
  start: developProject,
  createNewComponent,
  compress
}
