/**
 * 
 */
const inquirer = require('inquirer');
const path = require('path');
const fse = require('fs-extra');
const shell = require('shelljs');
const unzipper = require('unzipper');
const { getRemoteZip } = require('../utils');
const repositoryConfig = require('../../repository.config.json');
const codeMode = ['js','ts'];
const libraConfigTemplate = require('../../templates/libra.config.json')
const creatNewProject = async (_args) => {
    // 输入相关的配置参数
    const ans = await inquirer.prompt([
        {
            type: 'input',
            name: 'project',
            message: 'Project Name:',
            default: function () {
                return 'libra-project';
            }
        },
        {
            type: 'input',
            name: 'author',
            message: 'Author:',
        },
        {
            type: 'list',
            name: 'codeMode',
            message: 'Use JavaScript or TypeScript',
            choices: codeMode
        },
    ]);

    await download(repositoryConfig[ans.codeMode], ans.project);
    let libraConfigJson = {...libraConfigTemplate, type: ans.codeMode};
    fse.outputFileSync(path.resolve(`./${ans.project}/libra.config.json`),JSON.stringify(libraConfigJson));
    // packageJson.type = ans.codeMode;
    // console.log(packageJson);
    // fse.outputFileSync(path.resolve(`./${ans.project}/package.json')`),libraConfigJson);
    // shell.mkdir(ans.project);

}

const download = async( config, folderName ) => {
    const { type, url } = config;
    const filepath = path.resolve('.');
    switch(type){
        case 'git':{
            await shell.exec(`git clone ${url}`);
            await fse.remove(`${filepath}/libraui-template/.git`);
            await fse.renameSync(`${filepath}/libraui-template`,`${filepath}/${folderName}`);
            break;
        }
        case 'url':
        default:{
            const res = await getRemoteZip(url);
            
            if (res.success) {
                fse.createReadStream(`${filepath}/ucf-webapp-master.tmp`).pipe(unzipper.Extract({ path: filepath })).on('close', () => {
                    // 删除压缩包
                    fse.remove(`${filepath}/ucf-webapp-master.tmp`);
                    fse.renameSync(`${filepath}/ucf-webapp-master`,`${filepath}/${folderName}`);
                });
                console.log('Complete!')
            }
        }
    }
}

module.exports = creatNewProject;