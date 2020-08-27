const { getManifestJson, getLibraConfig, getTempDir, getPackageJson } = require('./index')
const fs = require('fs')
const path = require('path')
const fse = require('fs-extra')
const { formatPath, getDir } = require('./index')
const chalk = require('chalk')
const writeBuildEntry = () => {
  const manifestJson = getManifestJson()
  if (JSON.stringify(manifestJson.components) === '{}') {
    console.log(chalk.red('[ERROR] The components field is not configured in the manifest.json file!'))
    process.exit(0)
  }
  const {
    buildImport = {},
    errorBoundary = false,
    excludeNidAndUiType = true,
    useManifest = true,
    useModel2Props = true,
    excludeNidAndUiTypeComp = [],
    excludeManifestComp = [],
    staticPropsMap = {},
    setExtendComp = false,
    iconMap = {},
    outputApi = true
  } = getLibraConfig()
  let imp = ''
  let impLess = ''
  let expStr = ''
  if (useManifest) {
    imp += 'import { ReactWrapper } from \'yonui-extension\'\n'
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
  const writeApi = (basePath) => {
    const content = fs.readFileSync(path.join(basePath, 'README.md'), 'utf-8')
    fs.appendFile('api.md', content + '\n\n', (err) => {
      if (err) throw err
    })
  }
  const exp = {}
  const foo = (obj, res = {}) => {
    Object.keys(obj).map(item => {
      if (typeof obj[item] === 'string') {
        const _path = formatPath(path.join('../../../', obj[item])) // path.resolve(obj[item]);
        const fileArr = getDir(obj[item], 'file')
        const _manifestExists = fileArr.some(item => item.match(/^manifest\.(j|t)sx?$/))
        const _readmeExists = fileArr.some(item => item.match(/^README\.md$/))
        // const _manifestExists = fse.existsSync(`${_path}/manifest.tsx`) || fse.existsSync(`${_path}/manifest.ts`) || fse.existsSync(`${_path}/manifest.jsx`) || fse.existsSync(`${_path}/manifest.js`)
        if (useManifest && !excludeManifestComp.includes(item)) {
          if (_manifestExists) {
            // 导入组件，包裹ReactWrapper
            const excludeNidAndUiTypeStr = excludeNidAndUiType || excludeNidAndUiTypeComp.includes(item) ? 'excludeNidAndUiType: true,' : ''
            const errorBoundaryStr = errorBoundary ? 'errorBoundary: true, ' : ''
            const iconStr = iconMap[item] ? `icon: '${iconMap[item]}',` : ''
            imp += `import ${item}Comp from '${_path}';\n`
            imp += `import ${item}Manifest from '${_path}/manifest';\n`
            imp += `const ${item} = ReactWrapper(${item}Comp, ${item}Manifest, { ${excludeNidAndUiTypeStr}${errorBoundaryStr}${iconStr}});\n`
            // 挂载model2Props
            useModel2Props && (imp += `${item}.model2Props = ${item}Comp.model2Props || undefined;\n`)
            // 根据staticPropsMap给组件挂载方法、子组件等
            // staticPropsMap[item] && (imp += `${item}.${staticPropsMap[item]} = ${item}Comp.${staticPropsMap[item]};\n`)
            if (staticPropsMap[item]) {
              if (typeof staticPropsMap[item] === 'string') {
                imp += `${item}.${staticPropsMap[item]} = ${item}Comp.${staticPropsMap[item]};\n`
              } else {
                staticPropsMap[item].forEach(mapItem => {
                  imp += `${item}.${mapItem} = ${item}Comp.${mapItem};\n`
                })
              }
            }
          } else {
            imp += `import ${item} from '${_path}'\n`
            console.log(`Component ${item} misses manifest file.`)
          }
          if (_readmeExists && outputApi) writeApi(obj[item])
        } else {
          imp += `import ${item} from '${_path}'\n`
        }
        // impLess += `@import '${_path}/style/index.less';\n`
        res[item] = item
      } else {
        res[item] = {}
        foo(obj[item], res[item])
      }
    })
  }
  if (process.env.componentName) {
    const compJson = {}
    compJson[process.env.componentName] = process.env.componentPath
    foo(compJson, exp)
  } else {
    foo(manifestJson.components, exp)
  }
  if (buildImport.export) {
    buildImport.export.forEach(item => {
      expStr += `...${item},`
    })
  }

  const __Library = `const __Library = ${JSON.stringify(exp).replace(/'|"/g, '')}\n`
  // 运行态注册扩展组件

  const extendComp = setExtendComp ? "if (typeof window !== 'undefined' && window.cb && window.cb.setExtendComp) {  const extendLibray = {}; const extendToolbar = {};\n" +
  'for(let com in __Library) {\n' +
    'const key = com.toLocaleLowerCase();\n' +
    'const comManifest =  __Library[com].manifest;\n' +
    'if(comManifest.type == "button") {\n' +
    'extendToolbar[key] = __Library[com];\n' +
    '}else {\n' +
    'extendLibray[key] = __Library[com];\n' +
    '}\n' +
  '}\n' +
  "window.cb.setExtendComp({'other': Object.assign({}, extendLibray)})\n" +
  "window.cb.setExtendComp({'toolbar': Object.assign({}, extendToolbar)})}\n"
    : ''
  imp += `import './index.less';\n${__Library}\n${extendComp}export default {${expStr}...__Library, _${manifestJson.name}_version: '${getPackageJson().version}'}`
  fse.outputFile(path.resolve(`${getTempDir()}/temp/build/index.js`), imp)
  fse.outputFile(path.resolve(`${getTempDir()}/temp/build/index.less`), impLess)
}
module.exports = writeBuildEntry
