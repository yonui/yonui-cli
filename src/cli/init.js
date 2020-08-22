/**
 *
 */
const inquirer = require('inquirer')
const path = require('path')
const rp = require('request-promise');
const fse = require('fs-extra')
const { pascalCase } = require('change-case')
const compressing = require('compressing')
const chalk = require('chalk')
// const shell = require('shelljs')
const codeMode = ['js', 'ts']
const deviceType = ['mobile', 'PC']

const templateTempFile = 'yonui-template-temp.tgz'
const init = async () => {
  // 输入相关的配置参数
  const ans = await inquirer.prompt([
    {
      type: 'input',
      name: 'project',
      message: 'Project Name:',
      default: function () {
        return 'my-project'
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
  const libraryName = pascalCase(ans.project)
  console.log();
  console.log(chalk.green('\t\t⏳  yonui cloud transfer to local machine ⏳'));
  console.log();
  // console.log(chalk.green(`⏳🔊📢⚠️🇺🇿🌍☁️`));
  console.log(chalk.cyan.bold('[Info] :    🚀 Start downloading yonui project to the current directory 🎁'));
  console.log(chalk.cyan.bold(`Path:${filepath}  🏠`));
  console.log();

  // const filepath = '.'
  const libraConfigPath = path.resolve(filepath, 'config.json')
  const packagePath = path.resolve(filepath, 'package.json')
  const manifestPath = path.resolve(filepath, 'manifest.json')
  await getRemoteTemplate(filepath)
  compressing.tgz.uncompress(path.resolve(filepath, templateTempFile), filepath).then(() => {
    const packageJson = require(packagePath)
    const libraConfig = require(libraConfigPath)
    const manifestJson = require(manifestPath)
    const outputConfig = Object.assign(libraConfig.output, { library: libraryName })
    fse.outputJSONSync(libraConfigPath, { ...libraConfig, type: ans.codeMode, device: ans.device, output: outputConfig }, { replacer: null, spaces: 2 })
    fse.outputJSONSync(packagePath, { ...packageJson, author: ans.author, name: ans.project }, { replacer: null, spaces: 2 })
    fse.outputJSONSync(manifestPath, { ...manifestJson, name: libraryName }, { replacer: null, spaces: 2 })
    fse.remove(path.resolve(filepath, templateTempFile));
    console.log(chalk.cyan(`[Tips] : Project has inited ! 🏆  cd ${ans.project} && ynpm install`));
  })
}

const download = async function (options, filename, cb) {
  let opts = {
    method: 'get',
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
      Connection: 'keep-alive',
      'Upgrade-Insecure-Requests': 1
    }
  }
  opts = { ...opts, ...options };
  // 获得文件夹路径
  const fileFolder = path.dirname(filename);
  // 创建文件夹
  fse.ensureDirSync(fileFolder);
  // 开始下载无需返回
  rp(opts).pipe(fse.createWriteStream(filename)).on('close', cb);
}

/**
* 下载zip压缩包包含路径文件名
*/
const getRemoteTemplate = (filepath) => {
  const url = 'http://iuap-design-cdn.oss-cn-beijing.aliyuncs.com/static/yonui/templates/project.tgz'
  return new Promise((resolve, reject) => {
    download({ url }, path.resolve(filepath, templateTempFile), () => {
      resolve({ success: true });
    });
  });
}

module.exports = init
