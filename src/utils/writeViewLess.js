const fse = require('fs-extra')
const path = require('path')
const templateLess = require('../../templates/View/templateLess')
const { getTempDir } = require('../utils')
const writeViewLess = () => {
  const outputFile = path.resolve(`${getTempDir()}/temp/view/index.less`)
  fse.outputFileSync(outputFile, templateLess)
  console.log('write less file at', outputFile)
}

module.exports = writeViewLess
