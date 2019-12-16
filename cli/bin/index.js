#!/usr/bin/env node
const chalk = require('chalk');
const program = require('commander');
const semver = require('semver');
const fse = require('fs-extra');
const packageConfig = require('../package');
// const spawn = require('cross-spawn');
const ora = require('ora');
const path = require('path')
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;


//使用方括号声明，即传值不是必须的
//选项跟一个值（使用尖括号声明, 必须）

program.version(packageConfig.version).usage('<command> [options]');

// output help information on unknown commands
program.arguments('<command>').action((cmd) => {
    program.outputHelp();
    console.log(chalk.red(`Unknown command ${chalk.yellow(cmd)}`));
    console.log();
});

program
    .command('start [program]')
    .description('start a program')
    .option(
        '-p, --path <path>',
        'the program‘s path'
    )
    .on('--help', () => {
        console.log('');
        console.log('Examples:');
        console.log('  $ cool start');
        console.log('  $ cool start block');
        console.log('  $ cool start @icedesign/user-landing-block');
        console.log('  $ cool start @icedesign/user-landing-block -n CustomBlock');
    })
    .action(async (program, cmd) => {
        if (!program && !cmd.path) {
            const spinner = ora('Starting cool');
            // spinner.start();
            const app = spawn('node', ['app'], {
                cwd: path.resolve(process.cwd(), '../server')
            });

            app.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });
            console.log(path.resolve(process.cwd(), '../server'))
            exec('npm start', { stdio: 'inherit', cwd: path.resolve(process.cwd(), '..') })

            // spinner.stop();
        }
    });
program.parse(process.argv);

