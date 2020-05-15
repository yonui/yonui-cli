const { getManifestJson, getLibraConfig, getTempDir, getPackageJson } = require('./index')
const path = require('path')
const fse = require('fs-extra')
const { formatPath, getDir } = require('./index')
const writeBuildEntry = () => {
  const manifestJson = getManifestJson()
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
    iconMap = {}
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

  const exp = {}
  // let registerComps = ''
  const foo = (obj, res = {}) => {
    Object.keys(obj).map(item => {
      if (typeof obj[item] === 'string') {
        // registerComps += `{${item}},`
        const _path = formatPath(path.join('../../../', obj[item])) // path.resolve(obj[item]);
        const fileArr = getDir(obj[item], 'file')
        const _manifestExists = fileArr.some(item => item.match(/^manifest\.(j|t)sx?$/))
        // const _manifestExists = fse.existsSync(`${_path}/manifest.tsx`) || fse.existsSync(`${_path}/manifest.ts`) || fse.existsSync(`${_path}/manifest.jsx`) || fse.existsSync(`${_path}/manifest.js`)
        if (useManifest && !excludeManifestComp.includes(item)) {
          if (_manifestExists) {
            // 导入组件，包裹ReactWrapper
            const excludeNidAndUiTypeStr = excludeNidAndUiType || excludeNidAndUiTypeComp.includes(item) ? `excludeNidAndUiType: true,` : ''
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

  // imp += 'if(window.cb && cb.setExtendComp){\n'
  // imp += '  cb.setExtendComp({\n'
  // imp += `    'other':Object.assign({}, ${registerComps})\n`
  // imp += '  }) \n}\n'
  const __Library = `const __Library = ${JSON.stringify(exp).replace(/'|"/g, '')}\n`
  // 运行态注册扩展组件
  const extendComp = setExtendComp ? "if (window.cb && window.cb.setExtendComp) { window.cb.setExtendComp({'other': Object.assign({}, __Library)})}\n" : ''
  imp += `import './index.less';\n${__Library}\n${extendComp}export default {${expStr}...__Library, _${manifestJson.name}_version: '${getPackageJson().version}'}`
  fse.outputFile(path.resolve(`${getTempDir()}/temp/build/index.js`), imp)
  fse.outputFile(path.resolve(`${getTempDir()}/temp/build/index.less`), impLess)
}
module.exports = writeBuildEntry
