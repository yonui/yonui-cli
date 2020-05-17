/**
 *
 */
const fs = require('fs')
const propertiesParser = require('properties-parser')
const objectAssign = require('object-assign')
const userPath = process.env.HOME || process.env.USERPROFILE
function getCommands (fileName) {
  let config = {}
  const argvs = process.argv
  try {
    let attr
    if (argvs[2] === 'set') {
      const data = propertiesParser.read(getRcFile(fileName))
      attr = argvs[3].split('=')
      data[attr[0]] = attr[1]
      config = data
    } else {
      return null
    }
    return config
  } catch (e) {
    return null
  }
}
function set (fileName) {
  const path = getRcFile(fileName)
  try {
    const valida = getValidateRc(fileName)
    if (!valida) {
      const comm = getCommands(fileName)
      const editor = propertiesParser.createEditor()
      for (const item in comm) {
        editor.set(item, comm[item])
      }
      fs.writeFileSync(path, editor.toString())
      // comm?fs.writeFileSync(path,JSON.stringify(comm)):"";
    } else {
      const comm = getCommands(fileName)
      let config = propertiesParser.read(path)
      if (comm) {
        config = config || {}
        config = objectAssign(config, comm)
        const editor = propertiesParser.createEditor()
        for (const item in config) {
          editor.set(item, config[item])
        }
        fs.writeFileSync(path, editor.toString())
      };
    }
  } catch (e) {

  }
}

/**
 * 获取文件
 * @param {any} fileName
 * @returns
 */
function getRc (fileName) {
  if (getValidateRc(fileName)) {
    return propertiesParser.read(getRcFile(fileName))
  } else {
    return null
  }
}
/**
 * 判断是否有Rc文件
 * @param {any} fileName
 * @returns  true、false
 */
function getValidateRc (fileName) {
  try {
    fs.accessSync(getRcFile(fileName), fs.F_OK)
  } catch (e) {
    return false
  }
  return true
}

function getRcFile (fileName) {
  const filePath = fileName ? userPath + '/.' + fileName + 'rc' : ''
  return filePath
}

module.exports = {
  set,
  getRc
}
