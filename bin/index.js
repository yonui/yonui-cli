#!/usr/bin/env node
const program = require('commander')
const cli = require('../src/cli')
const cfg = require('../package.json')
const libra = () => {
  program
    .version(cfg.version, '-v, --version')
    .option('-C, --chdir <path>', 'change the working directory')
    .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
    .option('-T, --no-tests', 'ignore test hook')

  program
    .command('init')
    .description('create a new libra project')
    .action(() => {
      cli.init()
    })

  program
    .command('create [name]')
    .description('create a component')
    .action(() => {
      const componentName = program.args[0]
      if (componentName) {
        cli.create(componentName)
      } else {
        program.help()
      }
    })

  program
    .command('build')
    .description('build')
    .option('-p,--prod')
    .action((env) => {
      let compName = ''
      process.env.NODE_ENV = env.prod ? 'production' : 'development'
      program.args.forEach(item => {
        if (/name=/.test(item)) {
          compName = item.split('=')[1]
        }
      })
      const args = program.args[0]
      cli.build(args, compName)
    })
  program
    .command('set')
    .description('build')
    .option('-p,--prod')
    .action((env) => {
      process.env.NODE_ENV = env.prod ? 'production' : 'development'
      cli.set('yonui-cli')
    })

  program
    .command('config')
    .description('show config')
    .option('-l')
    .action((env) => {
      if (env.L || /^ls$/.test(program.args[0])) {
        const config = cli.getRc('yonui-cli')
        console.log(config)
      }
    })

  program
    .command('login')
    .description('Log in to YonBuilder')
    .action(() => {
      cli.login()
    })

  program
    .command('publish')
    .description('publish')
    .action(() => {
      cli.publish()
    })

  program
    .command('start')
    .description('start')
    .option('-p,--prod')
    .action((env) => {
      let port
      const args = program.args
      process.env.NODE_ENV = env.prod ? 'production' : 'development'
      args.forEach(item => {
        if (/port=/.test(item)) {
          port = item.match(/^port=(\d+)$/)[1]
        }
      })
      const openBrowser = !env.prod
      cli.start(port, openBrowser)
    })

  program.command('compress')
    .description('compress file')
    .action(() => {
      console.log('compress file:')
      cli.compress()
    })

  program
    .command('clg')
  // .option("--c", "cc")
    .description('test console.log')
    .action(() => {
      console.log('test info')
    })

  program.parse(process.argv)
}

libra()
