const creatNewProject = require('./init');
const buildProject = require('./build');
const developProject = require('./start');
const createNewComponent = require('./new');
// creatNewProject();
module.exports = {
    create: creatNewProject,
    build: buildProject,
    start: developProject,
    createNewComponent
}