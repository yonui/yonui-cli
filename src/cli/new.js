const path = require('path')
const fse = require('fs-extra')
const { getLibraConfig } = require('../utils')
const createComponent = (componentName) => {
  const libraConfig = getLibraConfig()
  const { sourcePath, suffixType } = libraConfig
  const target = path.resolve(`${sourcePath}/${componentName}`)
  const exists = fse.existsSync(target)
  if (exists) {
    console.log('The component already exists, please rename it.')
  } else {
    fse.copySync(path.join(__dirname, `../../templates/${suffixType === 'tsx' ? 'TSComponent' : 'JSComponent'}`), target)
    console.log(`Component ${componentName} was successfully created.`)
  }
}

module.exports = createComponent
