const rp = require('request-promise')
const path = require('path')
const fse = require('fs-extra')
const os = require('os')
const chalk = require('chalk')
const FormData = require('form-data')
const HOST_MAIN = ''
const defaultLib = [{
  key: 'react',
  value: {
    commonjs: 'react',
    amd: 'react',
    commonjs2: 'react',
    root: 'React' // 指向全局变量
  },
  js: './react/react.development.js',
  css: ''
},
{
  key: 'react-dom',
  value: {
    commonjs: 'react-dom',
    amd: 'react-dom',
    commonjs2: 'react-dom',
    root: 'ReactDOM' // 指向全局变量
  },
  js: './react-dom/react-dom.development.js',
  css: ''
}]

const getJson = (_path) => {
  let res = null
  try {
    res = require(path.resolve(_path))
  } catch (err) {
    res = null
  };

  return res
}
const configJson = getJson('config.json')
const configOverrideJson = getJson('config.override.json')
const libraConfigJson = getJson('libra.config.json')
const libraConfigOverrideJson = getJson('libra.config.override.json')
const manifestJson = getJson('manifest.json')
const manifestOverrideJson = getJson('manifest.override.json')
const packageJson = getJson('package.json')
const getIp = () => {
  const interfaces = os.networkInterfaces()
  for (const devName in interfaces) {
    const iface = interfaces[devName]
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i]
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address
      }
    }
  }
}
const download = async (options, filename, cb) => {
  let opts = {
    method: 'get',
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
      Connection: 'keep-alive',
      'Upgrade-Insecure-Requests': 1
    }
  }
  opts = { ...opts, ...options }
  // 获得文件夹路径
  const fileFolder = path.dirname(filename)
  // 创建文件夹
  fse.ensureDirSync(fileFolder)
  // 开始下载无需返回
  rp(opts).pipe(fse.createWriteStream(filename)).on('close', cb)
}

const getDir = (_path = '.', type = 'dir', config = {}) => {
  const arr = fse.readdirSync(path.resolve(_path))
  const isNeed = (item) => (!config.include || config.include.test(item)) && (!config.exclude || !config.exclude.test(item))
  switch (type) {
    case 'file': return arr.filter(item => {
      return item.includes('.') && isNeed(item)
    })
    case 'dir': return arr.filter(item => {
      return !item.includes('.') && isNeed(item)
    })
    case 'all': default: return arr
  }
}

const getLib = () => {
  const libraConfig = getLibraConfig()
  const { lib } = libraConfig
  return [...defaultLib, ...lib]
}

const getLibraConfig = () => {
  const isDev = process.env.NODE_ENV === 'development'
  let res = {}
  if (isDev && (configOverrideJson || libraConfigOverrideJson)) {
    console.log('use override file')
    res = configOverrideJson || libraConfigOverrideJson
  } else if (configJson || libraConfigJson) {
    console.log('use file')
    res = configJson || libraConfigJson
  } else {
    console.log('Missing file: config.json ')
    process.exit(0)
  }

  const { type, output = {} } = res
  const outputObj = {
    dist: 'dist',
    lib: 'lib',
    demo: `${getTempDir()}/demo`,
    result: 'result',
    ...output
  }
  const suffixType = type === 'ts' ? 'tsx' : 'js'
  return { ...res, suffixType, output: outputObj }
}

const getManifestJson = () => {
  const isDev = process.env.NODE_ENV === 'development'
  if (isDev && manifestOverrideJson) {
    return manifestOverrideJson
  } else if (manifestJson) {
    return manifestJson
  } else {
    console.log('Missing file: manifest.json ')
    process.exit(0)
  }
}

const getPackageJson = () => packageJson

const getEntryArr = () => {
  const { components } = getManifestJson()
  const res = []
  const foo = (obj) => {
    Object.keys(obj).forEach(item => {
      if (typeof obj[item] === 'string') {
        res.push(obj[item])
      } else {
        foo(obj[item])
      }
    })
  }
  foo(components)
  console.log('Entry Array: ', res)
  return res
}

const getEntryObj = () => {
  const { components } = getManifestJson()
  const res = {}
  const foo = (obj) => {
    Object.keys(obj).forEach(item => {
      if (typeof obj[item] === 'string') {
        res[item] = (obj[item])
      } else {
        foo(obj[item])
      }
    })
  }
  foo(components)
  console.log('Entry Obj: ', res)
  return res
}

// 使用path时windows下的分隔符是 '\'，写入模板文件需要转成 '/'
const formatPath = (path) => {
  return path.replace(/\\/g, '/')
}

const copyFile = (src, dest) => {
  fse.copyFileSync(path.resolve(src), path.resolve(dest))
}
function uploadCDN (name, fileName, path) { // name 包名字， fileName，文件名， path要上传的地址
  try {
    const form = new FormData()
    if (fse.existsSync(path)) {
      form.append('file', fse.readFileSync(path, 'utf-8'))
      form.append('name', name)
      form.append('fileName', fileName)
      return fetch(HOST_MAIN + '/other/upload', { method: 'post', body: form })
        .then(res => res.json())
        .then((res) => {
          if (res.success) {
            console.log('\n')
            console.log(chalk.green('CDN file upload success!'))
          } else {
            console.log('\n')
            console.log(res.msg)
          }
        }).catch(err => {
          console.log('\n')
          console.log(err)
        })
    } else {
      console.log('\n')
      console.log(chalk.red('[ERROR]:Static file path exception, Please check!'))
      return new Promise((resolve) => resolve())
    }
  } catch (err) {
    console.log(chalk.dim(err))
    return new Promise()
  }
}
const getTempDir = () => '.yonui'
module.exports = {
  uploadCDN,
  download,
  getDir,
  getLib,
  getLibraConfig,
  getManifestJson,
  getEntryArr,
  getEntryObj,
  formatPath,
  getIp,
  copyFile,
  getTempDir,
  getPackageJson
}
