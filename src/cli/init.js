/**
 *
 */
const inquirer = require('inquirer')
const path = require('path')
const fse = require('fs-extra')
const compressing = require('compressing')
// const shell = require('shelljs')
const codeMode = ['js', 'ts']
const deviceType = ['mobile', 'PC']
// const url = 'https://github.com/iuap-design/libraui-template.git'
const init = async () => {
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
      type: 'list',
      name: 'device',
      message: 'What devices will your components be used on?',
      choices: deviceType
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

  await create(ans)
}

const create = async (ans = { codeMode: 'ts', device: 'PC', author: 'Hyj', project: 'xx' }) => {
  const filepath = path.resolve(ans.project)
  // const filepath = '.'
  const libraConfigPath = path.resolve(filepath, 'libra.config.json')
  const packagePath = path.resolve(filepath, 'package.json')
  const manifestPath = path.resolve(filepath, 'manifest.json')
  compressing.tgz.uncompress(path.join(__dirname, '../../templates/project.tgz'), filepath).then(() => {
    const packageJson = require(packagePath)
    const libraConfig = require(libraConfigPath)
    const manifestJson = require(manifestPath)
    fse.outputJSONSync(libraConfigPath, { ...libraConfig, type: ans.codeMode, device: ans.device }, { replacer: null, spaces: 2 })
    fse.outputJSONSync(packagePath, { ...packageJson, author: ans.author, name: ans.project }, { replacer: null, spaces: 2 })
    fse.outputJSONSync(manifestPath, { ...manifestJson, name: ans.project }, { replacer: null, spaces: 2 })
  })
}

module.exports = init
