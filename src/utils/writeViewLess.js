const fse = require('fs-extra')
const path = require('path')
const templateLess = require('../../templates/templateLess')
const writeViewLess = () => {
  const outputFile = path.resolve('./.libraui/temp/view/index.less')
  fse.outputFileSync(outputFile, templateLess)
  console.log('write less file at', outputFile)
}

module.exports = writeViewLess
