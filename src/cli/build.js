const { buildDemo } = require('../webpack/runWebpack')
const runGulp = require('../gulp/index')
const writeResources = require('../utils/writeResources')
const writeBuildEntry = require('../utils/writeBuildEntry')
const { getLibraConfig } = require('../utils')
const { paramCase, pascalCase } = require('change-case')
const build = (arg, compName) => {
  if (compName) {
    const name = pascalCase(compName)
    const libraConfig = getLibraConfig()
    const { sourcePath } = libraConfig
    const path = `${sourcePath}/${paramCase(compName)}`
    process.env.componentName = name
    process.env.componentPath = path
  }
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
      runGulp('build-dist')
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
      runGulp('build-all')
      break
    }
    default: {
      runGulp('build')
    }
  }
}

module.exports = build
