const fse = require('fs-extra')
const path = require('path')
const templateJs = require('../../templates/templateJs')

const writeViewJs = () => {
  const outputFile = path.resolve('./.libraui/temp/view/index.js')
  fse.outputFileSync(outputFile, templateJs)
}

module.exports = writeViewJs
