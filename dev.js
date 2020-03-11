const compressing = require('compressing')
const fse = require('fs-extra')
const pump = require('pump')
const path = require('path')
const join = (param) => path.join(__dirname, param)
const compress = () => {
  const tarStream = new compressing.tar.Stream()
  tarStream.addEntry(join('templates/Project/components'))
  tarStream.addEntry(join('templates/Project/static'))
  tarStream.addEntry(join('templates/Project/libra.config.json'))
  tarStream.addEntry(join('templates/Project/manifest.json'))
  tarStream.addEntry(join('templates/Project/package.json'))
  tarStream.addEntry(join('templates/Project/README.md'))
  tarStream.addEntry(join('templates/Project/tsconfig.json'))
  const destStream = fse.createWriteStream(join('templates/project.tgz'))
  pump(tarStream, new compressing.gzip.FileStream(), destStream, err => {
    if (err) {
      console.error(err)
    } else {
      console.log('success')
    }
  })
}
compress()
// module.exports = compress
