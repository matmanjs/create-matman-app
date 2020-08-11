#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import yargs from 'yargs';
import { execCommands } from './commands';

(() => {
  // 验证 Node 版本信息
  const currentNodeVersion = process.versions.node;
  const semver = currentNodeVersion.split('.');
  const major = +semver[0];

  if (major < 10) {
    console.error(`You are running Node ${currentNodeVersion}.`);
    console.error('Create Matman App requires Node 10 or higher.');
    console.error('Please update your version of Node.');

    process.exit(1);
  }

  const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8'),
  );

  // 解析命令行参数
  const program = yargs
    .scriptName(packageJson.name)
    .version(packageJson.version)
    .usage(`$0 ${chalk.green('<command>')} [project-name|options]`)
    .command('new <project-name> [options]', '新建一个 matman 模板', (y) => {
      return y
        .positional('project-name', {
          describe: '指定的文件夹名称',
          type: 'string',
        })
        .option('template', {
          describe: '指定需要的模板',
          type: 'string',
        })
        .option('use-yarn', { describe: '强制使用 YARN', type: 'boolean' });
    })
    .command('info', '打印环境信息')
    .option('verbose', {
      describe: '打印额外的 logs',
      type: 'boolean',
    });

  // 得到参数
  const params = program.parse();

  execCommands(params, packageJson).catch((e) => {
    console.error(chalk.red('发生错误请参考:\n'));

    if (params.verbose) {
      console.error(e);
    } else {
      program.showHelp();
    }
  });
})();
