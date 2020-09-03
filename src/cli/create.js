const path = require('path')
const fs = require('fs')
const fse = require('fs-extra')
const { getLibraConfig, getManifestJson } = require('../utils')
const indexFile = require('../../templates/Component/indexTemplate')
const compFile = require('../../templates/Component/compTemplate')
const { paramCase, pascalCase } = require('change-case')
// const upper = (str) => str.replace(str[0], str[0].toUpperCase())
const createComponent = (name) => {
  const componentName = pascalCase(name)
  const libraConfig = getLibraConfig()
  const { sourcePath, suffixType } = libraConfig
  const relativePath = `${sourcePath}/${paramCase(componentName)}`
  const target = path.resolve(relativePath)
  const exists = fse.existsSync(target)
  if (exists) {
    console.log('The component already exists, please rename it.')
  } else {
    fse.copySync(path.join(__dirname, `../../templates/Component/${suffixType === 'tsx' ? 'TS' : 'JS'}`), target)
    fse.outputFileSync(path.resolve(target, `${componentName}.${suffixType}`), compFile.replace(/MyComponent/g, componentName))
    fse.outputFileSync(path.resolve(target, `index.${suffixType}`), indexFile.replace(/MyComponent/g, componentName))
    writeManifestJson(componentName, relativePath)
    console.log(`Component ${componentName} was successfully created.`)
  }
}

function writeManifestJson (name, path) {
  const manifestJson = getManifestJson()
  if (manifestJson) {
    const components = manifestJson.components
    components[name] = path
    const str = JSON.stringify(manifestJson, null, '\t')
    fs.writeFile('./manifest.json', str, function (err) {
      if (err) {
        console.error(err)
      }
    })
  }
  // 更改当前组件的name和lable为当前控件名称
  if (name) {
    const compPath = `components/${paramCase(name)}/manifest.js`;
    fs.readFile(compPath, 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      var result = data.replace(/name: 'name'/, `name: ${name}`);
      result = result.replace(/label: 'label'/, `label: ${name}`);
      fs.writeFile(compPath, result, 'utf8', function (err) {
        if (err) return console.log(err);
      });
    });
  }
}

module.exports = createComponent
