const { buildDist, buildDemo, buildDistAndDemo } = require('../webpack/runWebpack')
const runGulp = require('../gulp/index')
const writeResources = require('../utils/writeResources')
const writeBuildEntry = require('../utils/writeBuildEntry')
const build = (arg) => {
  switch (arg) {
    case 'entry': {
      writeBuildEntry()
      writeResources() // write demo entry
      break
    }
    case 'lib': {
      runGulp('lib')
      break
    }
    case 'dist': {
      writeBuildEntry()
      buildDist()
      break
    }
    case 'demo': {
      writeResources()
      buildDemo('build')
      break
    }
    case 'manifest': {
      runGulp('manifest')
      break
    }
    case 'all': {
      writeBuildEntry()
      writeResources()
      buildDistAndDemo('build')
      break
    }
    default: {
      runGulp('lib')
      writeBuildEntry()
      buildDist()
    }
  }
}

module.exports = build
