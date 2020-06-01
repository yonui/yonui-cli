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
    console.error(chalk.red('Error: Can not Find User, Please Use `yonui set email=xxx && yonui set privateKey=xxx` !'))
    process.exit(0)
  }
  const { email, privateKey } = userConfig
  if (!email || !privateKey) {
    console.error(chalk.red('Error: Can not Find User, Please Use `yonui set email=xxx && yonui set privateKey=xxx` !'))
    process.exit(0)
  }
  const packageJson = replacePackageName(getPackageJson(), getManifestJson())
  const form = new FormData()
  form.append('file', fs.createReadStream(path.resolve('./dist/index.js')))
  form.append('readme', fs.createReadStream(path.resolve('./README.md')))
  form.append('api', fs.createReadStream(path.resolve('./api.md')))
  form.append('packageJson', JSON.stringify(packageJson))
  form.append('email', email)
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

module.exports = publish
