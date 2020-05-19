const fs = require('fs')
const path = require('path')
const FormData = require('form-data')
const fetch = require('node-fetch')
const chalk = require('chalk')
const { getPackageJson, getManifestJson } = require('../utils/index')
const { getRc } = require('./set')
const { CONFIG_FILE_NAME, YNPM_PUBLISH_URL } = require('../utils/globalConfig')

const publish = () => {
  const { email = '', privateKey = '' } = getRc(CONFIG_FILE_NAME)
  const packageJson = replacePackageName(getPackageJson(), getManifestJson())
  const form = new FormData()
  form.append('file', fs.createReadStream(path.resolve('./dist/index.js')))
  form.append('readme', fs.createReadStream(path.resolve('./README.md')))
  form.append('packageJson', JSON.stringify(packageJson))
  form.append('email', email)
  form.append('privateKey', privateKey)
  if (!email || !privateKey) {
    console.error('Error: Cant Find User, Please Use `yonui set email=xxx && npm set privateKey=xxx` !')
  }
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
  packageJson.name = `__${libraryName}__`
  return packageJson
}

module.exports = publish
