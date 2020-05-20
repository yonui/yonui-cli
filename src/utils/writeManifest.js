const { getManifestJson, getLibraConfig } = require('./index')
const path = require('path')
const fse = require('fs-extra')

function customJsonStringify (key, value) {
  if (typeof value === 'function') {
    return `/Function(${value.toString()})/`
  }
  return value
}

const writeManifest = () => {
  const { output } = getLibraConfig()
  require('ignore-styles').default(['.sass', '.scss', '.png', '.jpg', '.jpeg', '.gif', '.css', '.less', '.svg'])
  const library = require(path.resolve(output.dist, 'index.js'))
  const manifestComponents = []
  Object.keys(library).forEach(compName => {
    const Comp = library[compName]
    // console.log(object)
    if (typeof Comp !== 'function') {
      console.warn(`${compName} is not a Class`)
      return
    }
    const componentManifest = Comp.manifest
    if (componentManifest) {
      const outputManifest = { ...componentManifest, name: componentManifest.name.toLowerCase() }
      manifestComponents.push(outputManifest)
    }
  })
  for (const compName in library) {
    console.log(compName)
    const Comp = library[compName]
    if (typeof Comp !== 'function') {
      console.warn(`${compName} is not a Class`)
      continue
    }
    const componentManifest = Comp.manifest || new Comp().manifest
    componentManifest && manifestComponents.push(componentManifest)
  }
  // console.log(object)
  const manifestJson = getManifestJson()
  // const manifestComponents = []
  // require('ignore-styles').default(['.sass', '.scss', '.png', '.jpg', '.jpeg', '.gif', '.css', '.less', '.svg'])
  // const loop = (obj, prefix = '') => {
  //   for (const key in obj) {
  //     const item = obj[key]
  //     if (typeof item === 'string') {
  //       const libPath = item.replace(sourcePath, 'lib')
  //       const manifestPath = path.resolve(libPath, 'manifest.js')
  //       if (fse.existsSync(manifestPath)) {
  //         const compManifest = require(manifestPath).default
  //         if (compManifest) {
  //           compManifest.name = prefix + key
  //           manifestComponents.push(compManifest)
  //         }
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
  process.exit(0)
}
module.exports = writeManifest
