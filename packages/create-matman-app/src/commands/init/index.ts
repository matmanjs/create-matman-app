import path from 'path';
import semver from 'semver';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { InitUtil } from './utils';
import { Command, collectCommands } from '../index';
import { ArgsParsered } from '../../types';

@collectCommands('new')
export class Init implements Command {
  private context: ArgsParsered;

  private packageJson: any;

  constructor(context: ArgsParsered, packageJson: any) {
    this.context = context;
    this.packageJson = packageJson;
  }

  /**
   * 实现接口
   */
  async exec() {
    // 检查版本
    const latest = await InitUtil.checkForLatestVersion().catch(() => {
      try {
        return execSync('npm view create-matman-app version').toString().trim();
      } catch (e) {
        return null;
      }
    });

    // 检查失败或者版本过低
    if (latest && semver.lt(this.packageJson.version, latest as string)) {
      console.log();
      console.error(
        chalk.yellow(
          `你正在使用 \`create-matman-app\` ${this.packageJson.version}, 最新版本为 (${latest}).\n\n` +
            '我们不推荐将 create-matman-app 作为全局依赖',
        ),
      );
      console.log();
      console.log(
        '请通过下面的命令移除全局依赖:\n' +
          '- npm uninstall -g create-matman-app\n' +
          '- yarn global remove create-matman-app',
      );
      console.log();
      process.exit(1);
    }

    this.createApp();
  }

  /**
   * 创建 app 的主要方法
   */
  createApp() {
    const root = path.resolve(this.context['project-name'] as string);
    const appName = path.basename(root);

    // 检查名称合法性
    InitUtil.checkAppName(appName);
  }
}
