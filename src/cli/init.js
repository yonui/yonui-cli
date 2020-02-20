/**
 *
 */
const inquirer = require('inquirer')
const path = require('path')
const fse = require('fs-extra')
const shell = require('shelljs')
const codeMode = ['js', 'ts']
const libraConfigTemplate = require('../../templates/templateConfig')
const url = 'https://github.com/iuap-design/libraui-template.git'
const creatNewProject = async () => {
  // 输入相关的配置参数
  const ans = await inquirer.prompt([
    {
      type: 'input',
      name: 'project',
      message: 'Project Name:',
      default: function () {
        return 'libra-project'
      }
    },
    {
      type: 'input',
      name: 'author',
      message: 'Author:'
    },
    {
      type: 'list',
      name: 'codeMode',
      message: 'Use JavaScript or TypeScript',
      choices: codeMode
    }
  ])

  await download(ans.project)
  const libraConfigJson = libraConfigTemplate.replace('@type', ans.codeMode)
  fse.outputFileSync(path.resolve(`./${ans.project}/libra.config.json`), libraConfigJson)
}

const download = async (folderName) => {
  const filepath = path.resolve('.')
  await shell.exec(`git clone ${url}`)
  await fse.remove(`${filepath}/libraui-template/.git`)
  await fse.renameSync(`${filepath}/libraui-template`, `${filepath}/${folderName}`)
}

module.exports = creatNewProject
