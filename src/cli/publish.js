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
  form.append('file', checkFileExist('./dist/index.js', true, 'Please execute `npm run build` first'))
  form.append('readme', checkFileExist('./README.md', true, 'Error: readme file is required'))
  form.append('api', checkFileExist('./api.md', false))
  form.append('changelog', checkFileExist('./changelog.md', false))
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
  let libraryName, controlTypes
  if (manifestJson) {
    libraryName = manifestJson.name
    controlTypes = manifestJson.components
  }
  packageJson.name = `${libraryName}`
  packageJson.components = getControlTypes(controlTypes)
  return packageJson
}

function getControlTypes (comps) {
  const results = []
  for (const key in comps) {
    const obj = {}
    obj.name = key
    obj.path = comps[key]
    results.push(obj)
  }
  return results
}

/**
 * 检查待上传的文件是否存在
 * @param {*} filePath 文件路径
 * @param {*} isRequired 是否必需
 * @param {*} message 提示信息
 */
function checkFileExist (filePath, isRequired, message = '') {
  try {
    fs.accessSync(path.resolve(filePath), fs.F_OK)
  } catch (e) {
    if (isRequired) {
      console.error(chalk.red(message))
      process.exit(0)
    }
    return ''
  }
  return fs.createReadStream(filePath)
}

module.exports = publish
