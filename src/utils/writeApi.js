const fs = require('fs')

const writeApi = () => {
  fs.access('api.md', (err) => {
    if (err) {
      console.log('api.md 文件不存在')
    } else {
      fs.writeFile('api.md', '', function () { console.log('done') })
    }
  })
}

module.exports = writeApi
