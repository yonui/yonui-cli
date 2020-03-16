// const compressing = require('compressing')
// const fse = require('fs-extra')
// const pump = require('pump')
// const path = require('path')
// const resolve = (param) => path.join(__dirname, param)
const compress = () => {
  // const tarStream = new compressing.tar.Stream()
  // tarStream.addEntry(resolve('package.json'))
  // tarStream.addEntry(resolve('../../templates/Project'))
  // const destStream = fse.createWriteStream(resolve('result.tgz'))
  // pump(tarStream, new compressing.gzip.FileStream(), destStream, err => {
  //   if (err) {
  //     console.error(err)
  //   } else {
  //     console.log('success')
  //   }
  // })
  // console.log('success')
  // const zip = new JSZip()
  // const inp = fse.createReadStream(path.resolve('./index.tsx')) // 创建可读的流

  // const out = fse.createWriteStream('1.gz') // 创建可写的流
  // const gzlib = zlib.createGzip() // 创建一个空的压缩包
  // inp.pipe(gzlib).pipe(out)
}

module.exports = compress
