import path from 'path';
import os from 'os';
import fs from 'fs-extra';
import semver from 'semver';
import chalk from 'chalk';
import spawn from 'cross-spawn';
import glob from 'glob';
import { execSync } from 'child_process';
import { InitUtil } from './utils';
import { collectCommands, Command } from '../index';
import { ArgsParsered } from '../../types';

@collectCommands('new')
export class Init implements Command {
  private context: ArgsParsered;

  private packageJson: any;

  private originalDirectory = '';

  constructor(context: ArgsParsered, packageJson: any) {
    this.context = context;
    this.packageJson = packageJson;
  }

  /**
   * 实现接口
   */
  async exec() {
    console.log();
    console.log(
      `Welcome use ${chalk.green(this.packageJson.name)} ${chalk.green(
        'v' + this.packageJson.version,
      )} to creating a new Matman app.`,
    );
    console.log();

    // 检查本体版本
    console.log('Checking latest version...');
    const checkBeginT = Date.now();
    const latest = await InitUtil.checkForLatestVersion();
    console.log(
      `Check latest version complete(${(Date.now() - checkBeginT) / 1000}s) ! The latest version is ${chalk.green(latest)} .`,
    );

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

    return this.createApp();
  }

  /**
   * 创建 app 的主要方法
   * 检查各种依赖与冲突以及工具的合法性
   */
  private createApp() {
    const name = this.context['project-name'] as string;
    const root = path.resolve(name);
    const appName = path.basename(root);

    // 检查名称合法性
    InitUtil.checkAppName(appName);

    // 创建文件夹
    fs.ensureDirSync(name);

    // 检查文件夹中的文件
    InitUtil.isSafeToCreateProjectIn(root, name);

    console.log();
    console.log(`在 ${chalk.green(root)} 中创建一个新的 Matman app.`);
    console.log();

    // 写入 package.json
    const packageJson = {
      name: appName,
      version: '0.1.0',
      private: true,
    };

    fs.writeFileSync(
      path.join(root, 'package.json'),
      JSON.stringify(packageJson, null, 2) + os.EOL,
    );

    const useYarn = this.context['use-yarn'] ? InitUtil.shouldUseYarn() : false;
    // 同步到类成员中
    this.context['use-yarn'] = useYarn;

    // 改变命令运行文件夹
    this.originalDirectory = process.cwd();
    process.chdir(root);

    if (!useYarn && !InitUtil.checkThatNpmCanReadCwd()) {
      process.exit(1);
    }

    // 检查 npm 或者 yarn
    if (!useYarn) {
      const npmInfo = InitUtil.checkNpmVersion();

      if (!npmInfo.hasMinNpm) {
        if (npmInfo.npmVersion) {
          console.log(chalk.yellow(`你整在使用的 NPM 版本为 ${npmInfo.npmVersion}.\n`));
          console.log(chalk.yellow('请将 NPM 升级到 6.x 或者更高.'));
        }
      }
    }

    if (useYarn) {
      let yarnUsesDefaultRegistry = true;
      try {
        yarnUsesDefaultRegistry =
          execSync('yarnpkg config get registry').toString().trim() ===
          'https://registry.yarnpkg.com';
      } catch (e) {
        // ignore
      }

      if (yarnUsesDefaultRegistry) {
        fs.copySync(require.resolve('./yarn.lock.cached'), path.join(root, 'yarn.lock'));
      }
    }

    return this.run();
  }

  /**
   * 安装模板等, 进行流程组装
   */
  private async run() {
    const root = path.resolve();

    const templateToInstall = await InitUtil.getTemplateInstallPackage(
      this.originalDirectory,
      this.context.template,
    );

    console.log('安装依赖包, 这可能会花费几分钟的时间.');

    const templateInfo = await InitUtil.getPackageInfo(templateToInstall);

    console.log(`安装模板 ${chalk.cyan(templateInfo.name)} ...`);
    console.log();

    return this.install([templateToInstall])
      .then(() => this.generate(templateInfo.name))
      .then(() => {
        console.log();
        console.log(`卸载模板 ${chalk.cyan(templateInfo.name)} ...`);
        console.log();

        return this.uninstall([templateInfo.name]);
      })
      .then(() => {
        console.log();
        console.log(chalk.green('初始化成功'));
        console.log('🚗🚗🚗🚗', chalk.green('快乐开发, 从我开始'));
        console.log();
      })
      .catch((reason) => {
        console.error();
        console.error('Aborting installation.');
        if (reason.command) {
          console.error(`  ${chalk.cyan(reason.command)} has failed.`);
        } else {
          console.error(chalk.red('意料之外的错误, 请报告这个问题:'));
          console.error(reason);
        }
        console.error();

        // 错误退出时删除一些文件
        const knownGeneratedFiles = [
          'package.json',
          'yarn.lock',
          'node_modules',
          'package-lock.json',
        ];
        const currentFiles = fs.readdirSync(root);

        currentFiles.forEach((file) => {
          knownGeneratedFiles.forEach((fileToMatch) => {
            if (file === fileToMatch) {
              console.error(`Deleting generated file... ${chalk.cyan(file)}`);
              fs.removeSync(path.join(root, file));
            }
          });
        });

        // 如果文件夹为空, 删除文件夹
        const remainingFiles = fs.readdirSync(path.join(root));
        if (!remainingFiles.length) {
          console.error(
            `Deleting ${chalk.blue(this.context['project-name'])} from ${chalk.cyan(
              path.resolve(root, '..'),
            )}`,
          );
          process.chdir(path.resolve(root, '..'));
          fs.removeSync(path.join(root));
        }
        console.error('Done.');
        process.exit(1);
      });
  }

  /**
   * 安装模板
   * @param dependencies
   */
  private async install(dependencies: string[]) {
    const root = path.resolve();
    let command: string;
    let args: string[];

    if (this.context['use-yarn']) {
      command = 'yarnpkg';
      args = ['add', '--exact'];
      args.concat(dependencies);
      args.push('--cwd');
      args.push(root);
    } else {
      command = 'npm';
      args = ['install', '--save', '--save-exact', '--loglevel', 'error'].concat(dependencies);
    }

    if (this.context.verbose) {
      args.push('--verbose');
    }

    return new Promise((resolve, reject) => {
      const child = spawn(command, args, { stdio: 'inherit' });

      child.on('close', (code) => {
        if (code !== 0) {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({ command: `${command} ${args.join(' ')}` });
        }
        resolve();
      });
    });
  }

  /**
   * 拷贝模板
   */
  private async generate(templateName: string) {
    let appPackage = (await import(path.join(process.cwd(), 'package.json'))).default;

    const templatePath = path.dirname(
      require.resolve(`${templateName}/package.json`, { paths: [process.cwd()] }),
    );

    // 写入 package.json
    const templateJsonPath = path.join(templatePath, 'template.json');

    let templateJson: Record<string, any> = { package: {} };
    if (fs.existsSync(templateJsonPath)) {
      templateJson = (await import(templateJsonPath)).default;
    }

    appPackage = { ...appPackage, ...templateJson.package };

    fs.writeFileSync(
      path.join(process.cwd(), 'package.json'),
      JSON.stringify(appPackage, null, 2) + os.EOL,
    );

    // 有 init 脚本时执行脚本
    const initJsPath = path.join(templatePath, 'init.js');
    if (fs.existsSync(initJsPath)) {
      const initJs = (await import(initJsPath)).default;
      initJs({ ...this.context });

      return;
    }

    glob
      .sync('**/*', {
        dot: true,
        cwd: path.join(templatePath, 'template'),
      })
      .forEach((item) => {
        const temp = item.replace(/gitignore/, '.gitignore');
        fs.copySync(path.join(templatePath, 'template', item), path.join(process.cwd(), temp));
      });

    glob
      .sync('**/gitignore', {
        dot: true,
        cwd: process.cwd(),
        ignore: '**/node_modules/**',
      })
      .forEach((item) => {
        fs.removeSync(path.join(process.cwd(), item));
      });
  }

  /**
   * 卸载模板
   */
  private uninstall(dependencies: string[]) {
    const root = path.resolve();
    let command: string;
    let args: string[];

    if (this.context['use-yarn']) {
      command = 'yarnpkg';
      args = ['remove', '--exact'];
      args.concat(dependencies);
      args.push('--cwd');
      args.push(root);
    } else {
      command = 'npm';
      args = ['uninstall'].concat(dependencies);
    }

    if (this.context.verbose) {
      args.push('--verbose');
    }

    return new Promise((resolve, reject) => {
      const child = spawn(command, args, { stdio: 'inherit' });

      child.on('close', (code) => {
        if (code !== 0) {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({ command: `${command} ${args.join(' ')}` });
        }
        resolve();
      });
    });
  }
}
