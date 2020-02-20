const path = require('path')
const fse = require('fs-extra')

const copyFile = (src, dest) => {
  fse.copyFileSync(path.resolve(src), path.resolve(dest))
}

module.exports = copyFile
