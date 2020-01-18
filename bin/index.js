#!/usr/bin/env node
const program = require('commander');
const cli = require('../src/cli');
const cfg = require('../package.json');
const libra = () => {
	program
		.version(cfg.version, '-v, --version')
		.option('-C, --chdir <path>', 'change the working directory')
		.option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
		.option('-T, --no-tests', 'ignore test hook');

	program
		.command('init')
		.description('create a new libra project')
		.action(() => {
			cli.create();
		});

	program
		.command('create [name]')
		.description('create a component')
		.action((env, options) => {
			const componentName = program.args[0];
			if (componentName) {
				cli.createNewComponent(componentName);
			}
			else {
				program.help();
			}
		})

	program
		.command('build')
		.description('build')
		.action((env, options) => {
			cli.build();
		});

	program
		.command('start')
		.description('start')
		.action((env, options) => {
			let port = 8090;
			let args = program.args;
			args.forEach( item => {
				
				if( /port=/.test(item)){
					port = item.match(/^port=(\d+)$/)[1];
				}
			})
			cli.start(port);
		});

	program
		.command('clg')
		// .option("--c", "cc")
		.description('test console.log')
		.action((env, options) => {
			console.log('test info')
		});
	program.parse(process.argv);
}

libra();