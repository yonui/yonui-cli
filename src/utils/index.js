const rp = require('request-promise')
const path = require('path')
const fse = require('fs-extra')
const os = require('os')
const defaultLib = [{
  key: 'react',
  value: {
    commonjs: 'react',
    amd: 'react',
    commonjs2: 'react',
    root: 'React' // 指向全局变量
  },
  js: '//design.yonyoucloud.com/static/react/16.8.4/umd/react.production.min.js',
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
  js: '//design.yonyoucloud.com/static/react/16.8.4/umd/react-dom.production.min.js',
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

const libraConfigJson = getJson('libra.config.json')
const libraConfigOverrideJson = getJson('libra.config.override.json')
const manifestJson = getJson('manifest.json')
const manifestOverrideJson = getJson('manifest.override.json')

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
  let configJson = {}
  if (isDev && libraConfigOverrideJson) {
    console.log('use override file')
    configJson = libraConfigOverrideJson
  } else if (libraConfigJson) {
    console.log('use file')
    configJson = libraConfigJson
  } else {
    console.log('Missing file: libra.config.json ')
    process.exit(0)
  }

  const { type } = configJson
  const suffixType = type === 'ts' ? 'tsx' : 'js'
  return { ...configJson, suffixType }
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

module.exports = {
  download,
  getDir,
  getLib,
  getLibraConfig,
  getManifestJson,
  getEntryArr,
  getEntryObj,
  formatPath,
  getIp,
  copyFile
}
