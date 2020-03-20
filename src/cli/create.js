const path = require('path')
const fse = require('fs-extra')
const { getLibraConfig } = require('../utils')
const indexFile = require('../../templates/Component/indexTemplate')
const compFile = require('../../templates/Component/compTemplate')
const { paramCase, pascalCase } = require('change-case')
// const upper = (str) => str.replace(str[0], str[0].toUpperCase())
const createComponent = (name) => {
  const componentName = pascalCase(name)
  const libraConfig = getLibraConfig()
  const { sourcePath, suffixType } = libraConfig
  const target = path.resolve(`${sourcePath}/${paramCase(componentName)}`)
  const exists = fse.existsSync(target)
  if (exists) {
    console.log('The component already exists, please rename it.')
  } else {
    fse.copySync(path.join(__dirname, `../../templates/Component/${suffixType === 'tsx' ? 'TS' : 'JS'}`), target)
    fse.outputFileSync(path.resolve(target, `${componentName}.${suffixType}`), compFile.replace(/MyComponent/g, componentName))
    fse.outputFileSync(path.resolve(target, `index.${suffixType}`), indexFile.replace(/MyComponent/g, componentName))
    console.log(`Component ${componentName} was successfully created.`)
  }
}

module.exports = createComponent
