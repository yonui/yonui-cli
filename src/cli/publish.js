const fs = require('fs')
const path = require('path')
const FormData = require('form-data')
const fetch = require('node-fetch')
const { getPackageJson } = require('../utils/index')
const { getRc } = require('./set')
const { CONFIG_FILE_NAME, YNPM_PUBLISH_URL } = require('../utils/globalConfig')

const publish = () => {
  const { email = '', privateKey = '' } = getRc(CONFIG_FILE_NAME)
  const form = new FormData()
  form.append('file', fs.createReadStream(path.resolve('./dist/index.js')))
  form.append('email', email)
  form.append('privateKey', privateKey)
  form.append('packageJson', JSON.stringify(getPackageJson()))
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

module.exports = publish
