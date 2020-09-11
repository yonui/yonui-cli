const { getManifestJson, getLibraConfig } = require('./index')
const path = require('path')
const fse = require('fs-extra')
const chalk = require('chalk')
const { paramCase, pascalCase } = require('change-case')
function customJsonStringify (key, value) {
  if (typeof value === 'function') {
    return `/Function(${value.toString()})/`
  }
  return value
}

const writeManifest = () => {
  const libConfig = getLibraConfig()
  const output = libConfig.output
  const manifestComponents = []
  const manifestJson = getManifestJson()
  require('ignore-styles').default(['.sass', '.scss', '.png', '.jpg', '.jpeg', '.gif', '.css', '.less', '.svg'])
  if (libConfig.device === 'PC') {
    const components = manifestJson.components || {};
    Reflect.ownKeys(components).forEach(item => {
      let compManifest;
      const componentName = pascalCase(item)
      const cManifestPath = path.resolve(`components/${paramCase(componentName)}/manifest.js`)
      compManifest = fse.readFileSync(cManifestPath, 'utf-8');
      let type = compManifest.match(/TypeProps.[\w]+,/)
      if (type) {
        type = type[0].substring(10);
        type = type.substring(0, type.length - 1);
      } else {
        type = 'control'
      }
      compManifest = compManifest.replace(/import[\s\S]*'yonui-extension'/, '');
      compManifest = compManifest.replace(/uiObject:[\s]*UIObject.[\w]*,/, '');
      compManifest = compManifest.replace(/type: TypeProps.[\w]*,/, `type: '${type}',`);
      compManifest = compManifest.replace(/export default/, 'module.exports =');
      const tempMainfestPath = path.resolve(`components/${paramCase(componentName)}/tempmanifest.js`)
      fse.writeFileSync(tempMainfestPath, compManifest)
      const compManifestJson = require(tempMainfestPath);
      // console.log(compManifestJson)
      if (compManifestJson) {
        const outputManifest = { ...compManifestJson, name: compManifestJson.name.toLowerCase() }
        manifestComponents.push(outputManifest)
      }
      fse.removeSync(tempMainfestPath)
    })
  } else {
    const jsdom = require('jsdom');
    const { JSDOM } = jsdom;
    const { window } = new JSDOM('...');
    const { document } = (new JSDOM('...')).window;
    global.window = window;
    global.document = document;
    global.navigator = global.window.navigator
    const library = require(path.resolve(output.dist, 'index.js'))
    Object.keys(library).forEach(compName => {
      const Comp = library[compName]
      // console.log(object)
      if (typeof Comp !== 'function') {
        console.warn(`${compName} is not a Class`)
        // continue
        return
      }
      const componentManifest = Comp.manifest
      if (componentManifest) {
        const outputManifest = { ...componentManifest, name: componentManifest.name.toLowerCase() }
        manifestComponents.push(outputManifest)
      }
    })
  }

  // for (const compName in library) {
  //   if( )
  //   console.log(compName)
  //   const Comp = library[compName]
  //   if (typeof Comp !== 'function') {
  //     console.warn(`${compName} is not a Class`)
  //     continue
  //   }
  //   const componentManifest = Comp.manifest || new Comp().manifest
  //   componentManifest && manifestComponents.push(componentManifest)
  // }
  // console.log(object)
  // const manifestComponents = []
  // const loop = (obj, prefix = '') => {
  //   for (const key in obj) {
  //     const item = obj[key]
  //     if (typeof item === 'string') {
  //       const libPath = item.replace(sourcePath, 'lib')
  //       console.log(path.resolve(libPath))
  //       require('ignore-styles').default(['.sass', '.scss', '.png', '.jpg', '.jpeg', '.gif', '.css', '.less', '.svg'])
  //       const CLS = require(path.resolve(libPath)).default
  //       if (typeof CLS !== 'function') {
  //         // throw new Error(`${componentName} is not a Class`)
  //         console.warn(`${key} is not a Class`)
  //         continue
  //       }
  //       const componentManifest = CLS.manifest || new CLS().manifest
  //       if (componentManifest) {
  //         componentManifest.name = prefix + key
  //         manifestComponents.push(componentManifest)
  //       }
  //     } else {
  //       loop(item, `${key}.`)
  //     }
  //   }
  // }

  // loop(manifestJson.components)
  const outputFile = { ...manifestJson, components: manifestComponents }
  fse.outputFileSync(
    path.resolve(output.dist, 'manifest.json'),
    JSON.stringify(outputFile, customJsonStringify)
  )
  console.log(chalk.green('Output manifest.json successfully.'))
  process.exit(0)
}
module.exports = writeManifest
