const fs = require('fs')

const writeApi = () => {
  fs.access('api.md', (err) => {
    if (err) {
      if (err) throw err
    } else {
      fs.writeFile('api.md', '', function () { console.log('done') })
    }
  })
}

module.exports = writeApi
