const fs = require('fs')
const path = require('path')
const FormData = require('form-data')
const fetch = require('node-fetch')
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
  fetch(YNPM_PUBLISH_URL, {
    method: 'post',
    body: form
  })
    .then(function (response) {
      console.log(response)
    }).catch(function (error) {
      console.log(error)
    })
}

function replacePackageName (packageJson, manifestJson) {
  const libraryName = manifestJson && manifestJson.name
  packageJson.name = `__${libraryName}__`
  return packageJson
}

module.exports = publish
