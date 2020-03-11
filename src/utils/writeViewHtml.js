const fse = require('fs-extra')
const path = require('path')
const { getLib, getLibraConfig } = require('./index')
const templateHtml = require('../../templates/View/templateHtml')
const writeViewHtml = () => {
  const { extraImport } = getLibraConfig()
  let scriptInput = extraImport.js
  let cssInput = extraImport.css
  const lib = getLib()
  lib.map(item => {
    scriptInput += item.js ? `<script src="${item.js}"></script>\n` : ''
    cssInput += item.css ? `<link rel="stylesheet" href="${item.css}">` : ''
  })
  const outputFile = path.resolve('./.libraui/temp/view/index.html')
  const outputHtml = templateHtml.replace('@cssImport', cssInput).replace('@scriptImport', scriptInput)
  fse.outputFileSync(outputFile, outputHtml) // outputFileSync在无目录时会自动创建目录，而writeFileSync不会
}

module.exports = writeViewHtml
