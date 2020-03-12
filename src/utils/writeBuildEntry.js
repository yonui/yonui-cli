const { getManifestJson, getLibraConfig } = require('./index')
const path = require('path')
const fse = require('fs-extra')
const { formatPath } = require('./index')
const writeBuildEntry = () => {
  const manifestJson = getManifestJson()
  const { buildImport = {}, excludeNidAndUiType, useManifest = true } = getLibraConfig()
  let imp = ''
  let impLess = ''
  let expStr = ''
  if (useManifest) {
    imp += 'import { ReactWrapper } from \'libraui-extension\'\n'
  }
  if (buildImport.js) {
    buildImport.js.forEach(item => {
      imp += `${item}\n`
    })
  }
  if (buildImport.css) {
    buildImport.css.forEach(item => {
      impLess += `${item}\n`
    })
  }

  const exp = {}
  const foo = (obj, res = {}) => {
    Object.keys(obj).map(item => {
      if (typeof obj[item] === 'string') {
        const _path = formatPath(path.join('../../../', obj[item])) // path.resolve(obj[item]);
        if (useManifest) {
          imp += `import ${item}Comp from '${_path}'\nimport ${item}Manifest from '${_path}/manifest'\nconst ${item} = ReactWrapper(${item}Comp, ${item}Manifest${excludeNidAndUiType ? ', { excludeNidAndUiType: true }' : ''})\n`
        } else {
          imp += `import ${item} from '${_path}'\n`
        }
        impLess += `@import '${_path}/style/index.less';\n`
        res[item] = item
      } else {
        res[item] = {}
        foo(obj[item], res[item])
      }
    })
  }
  foo(manifestJson.components, exp)
  if (buildImport.export) {
    buildImport.export.forEach(item => {
      expStr += `...${item},`
    })
  }
  const __Library = `const __Library = ${JSON.stringify(exp).replace(/'|"/g, '')}\n`
  imp += `import './index.less';\n${__Library}export default {${expStr}...__Library}`
  fse.outputFile(path.resolve('./.libraui/temp/build/index.js'), imp)
  fse.outputFile(path.resolve('./.libraui/temp/build/index.less'), impLess)
}
module.exports = writeBuildEntry
