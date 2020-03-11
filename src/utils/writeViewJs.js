const fse = require('fs-extra')
const path = require('path')
const templateJs = require('../../templates/templateJs')
const { getLibraConfig } = require('./index')
const writeViewJs = () => {
  const outputFilePath = path.resolve('./.libraui/temp/view/index.js')
  const { previewUrl, device } = getLibraConfig()
  const { devPort, devIp } = process.env
  const url = previewUrl || `http://${devIp}:${devPort}`
  const outputFile = `const previewUrl = '${url}'` + templateJs.replace('@device-class', `content-demo-${device}`)
  fse.outputFileSync(outputFilePath, outputFile)
}

module.exports = writeViewJs
