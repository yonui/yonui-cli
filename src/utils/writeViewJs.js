const fse = require('fs-extra')
const path = require('path')
const templateJs = require('../../templates/templateJs')
const writeViewJs = () => {
  const outputFilePath = path.resolve('./.libraui/temp/view/index.js')
  const { devPort, devIp } = process.env
  const outputFile = `const IP = '${devIp}';\nconst PORT = ${devPort}` + templateJs
  fse.outputFileSync(outputFilePath, outputFile)
}

module.exports = writeViewJs
