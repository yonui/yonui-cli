const compressing = require('compressing')
const fse = require('fs-extra')
const pump = require('pump')
const path = require('path')
const fileList = [
  'components', 'static', 'config.json', 'manifest.json', 'package.json',
  'README.md', 'tsconfig.json', '.eslintignore', '.eslintrc.js', 'commitlint.config.js',
  '.gitignore'
]
const join = (param) => path.join(__dirname, param)
const compress = () => {
  const tarStream = new compressing.tar.Stream()
  fileList.forEach(element => {
    tarStream.addEntry(join(`templates/Project/${element}`))
  })
  const destStream = fse.createWriteStream(join('templates/project.tgz'))
  pump(tarStream, new compressing.gzip.FileStream(), destStream, err => {
    if (err) {
      console.error(err)
    } else {
      console.log('Compress project file successfully')
    }
  })
}
compress()
// module.exports = compress
