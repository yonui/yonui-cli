const fs = require('fs')
const path = require('path')
const FormData = require('form-data')
const fetch = require('node-fetch')
const chalk = require('chalk')
const { getPackageJson, getManifestJson } = require('../utils/index')
const { getRc } = require('./set')
const { CONFIG_FILE_NAME, YNPM_PUBLISH_URL } = require('../utils/globalConfig')

const publish = () => {
  const userConfig = getRc(CONFIG_FILE_NAME)
  if (userConfig === null) {
    console.error(chalk.red('Error: Can not Find User, Please Use `yonui login` !'))
    process.exit(0)
  }
  const { username, privateKey, userId } = userConfig
  if (!(userId || username) && !privateKey) {
    console.error(chalk.red('Error: Can not Find User, Please Use `yonui login` !'))
    process.exit(0)
  }
  const packageJson = replacePackageName(getPackageJson(), getManifestJson())
  const form = new FormData()
  form.append('file', getValidateFile(path.resolve('./dist/index.js'))) // file必须
  form.append('readme', getValidateFile(path.resolve('./README.md'))) // readme必须
  form.append('api', getValidateFile(path.resolve('./api.md')))// 需要api文件。没有可以不传
  form.append('changelog', getValidateFile(path.resolve('./changelog.md'))) // 需要changelog文件。没有可以不传
  form.append('packageJson', JSON.stringify(packageJson))
  userId && form.append('userId', userId)
  username && form.append('username', username)
  form.append('privateKey', privateKey)
  fetch(YNPM_PUBLISH_URL, {
    method: 'post',
    body: form
  })
    .then(async function (response) {
      const res = await response.json()
      if (res.status === 200) {
        console.log(`+ ${packageJson.name}@${packageJson.version}`)
        console.log(chalk.green(`your resources have been uploaded to CDN at ${res.data}`))
      } else {
        console.log(chalk.red(`Error: ${res.message}`))
      }
    }).catch(function (error) {
      console.error(error)
    })
}

function replacePackageName (packageJson, manifestJson) {
  const libraryName = manifestJson && manifestJson.name
  packageJson.name = `${libraryName}`
  return packageJson
}

function getValidateFile (path) {
  try {
    fs.accessSync(path, fs.F_OK)
  } catch (e) {
    return ''
  }
  return fs.createReadStream(path)
}

module.exports = publish
