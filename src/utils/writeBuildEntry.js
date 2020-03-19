const { getManifestJson, getLibraConfig, getTempDir } = require('./index')
const path = require('path')
const fse = require('fs-extra')
const { formatPath, getDir } = require('./index')
const writeBuildEntry = () => {
  const manifestJson = getManifestJson()
  const { buildImport = {}, excludeNidAndUiType = true, useManifest = true, useModel2Props = true } = getLibraConfig()
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
        const fileArr = getDir(obj[item], 'file')
        const _manifestExists = fileArr.some(item => item.match(/^manifest\.(j|t)sx?$/))
        // const _manifestExists = fse.existsSync(`${_path}/manifest.tsx`) || fse.existsSync(`${_path}/manifest.ts`) || fse.existsSync(`${_path}/manifest.jsx`) || fse.existsSync(`${_path}/manifest.js`)
        if (useManifest) {
          if (_manifestExists) {
            imp += `import ${item}Comp from '${_path}';\nimport ${item}Manifest from '${_path}/manifest';\nconst ${item} = ReactWrapper(${item}Comp, ${item}Manifest${excludeNidAndUiType ? ', { excludeNidAndUiType: true }' : ''});\n`
            useModel2Props && (imp += `${item}.model2Props = ${item}Comp.model2Props || undefined;\n`)
          } else {
            imp += `import ${item} from '${_path}'\n`
            console.log(`Component ${item} misses manifest file.`)
          }
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
  fse.outputFile(path.resolve(`${getTempDir()}/temp/build/index.js`), imp)
  fse.outputFile(path.resolve(`${getTempDir()}/temp/build/index.less`), impLess)
}
module.exports = writeBuildEntry
