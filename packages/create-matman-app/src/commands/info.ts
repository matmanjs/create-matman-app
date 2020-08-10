import path from 'path';
import chalk from 'chalk';
// @ts-ignore
import envinfo from 'envinfo';
import { Command } from './index';
import { ArgsParsered } from '../types';

export class Info implements Command {
  private context: ArgsParsered;

  private packageJson: any;

  constructor(context: ArgsParsered, packageJson: any) {
    this.context = context;
    this.packageJson = packageJson;
  }

  exec() {
    console.log(chalk.bold('\nEnvironment Info:'));
    console.log(`\n  current version of ${this.packageJson.name}: ${this.packageJson.version}`);
    console.log(`  running from ${path.resolve(__dirname, '../..')}`);
    return envinfo
      .run(
        {
          System: ['OS', 'CPU'],
          Binaries: ['Node', 'npm', 'Yarn'],
        },
        {
          duplicates: true,
          showNotFound: true,
        },
      )
      .then(console.log);
  }
}
