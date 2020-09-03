import https from 'https';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import semver from 'semver';
import spawn from 'cross-spawn';
import validateProjectName from 'validate-npm-package-name';
import { execSync } from 'child_process';

export class InitUtil {
  /**
   * 检查依赖的最新版本
   */
  static async checkForLatestVersion(): Promise<{ from: string, latest: string }> {
    const packageName = 'create-matman-app';

    // We first check the registry directly via the API, and if that fails, we try
    // the slower `npm view [package] version` command.
    //
    // This is important for users in environments where direct access to npm is
    // blocked by a firewall, and packages are provided exclusively via a private
    // registry.
    const getFromHttp = new Promise((resolve) => {
      // 注意，这里之所以要延时 2s，其实更希望是通过 npm 或 tnpm 等获得，以便后续知道拿谁来 instal
      setTimeout(() => {
        https.get(
          'https://registry.npmjs.org/-/package/' + packageName + '/dist-tags',
          res => {
            if (res.statusCode === 200) {
              let body = '';
              res.on('data', data => (body += data));
              res.on('end', () => {
                resolve({
                  from: 'http',
                  latest: JSON.parse(body).latest
                });
              });
            }
          })
          .on('error', () => {
            if (process.env.DEBUG) {
              console.log('get error');
            }
          });
      }, 2000);
    });

    const getFromNpm = new Promise((resolve) => {
      try {
        const latest = execSync(`npm view ${packageName} version`, { timeout: 1500 }).toString().trim();

        resolve({
          from: 'npm',
          latest
        });
      } catch (e) {
        if (process.env.DEBUG) {
          console.log(e);
        }
      }
    });

    const getFromTNpm = new Promise((resolve) => {
      try {
        const latest = execSync(`tnpm view ${packageName} version`, { timeout: 1500 }).toString().trim();

        resolve({
          from: 'tnpm',
          latest
        });
      } catch (e) {
        if (process.env.DEBUG) {
          console.log(e);
        }
      }
    });

    const getFromCNpm = new Promise((resolve) => {
      try {
        const latest = execSync(`cnpm view ${packageName} version`, { timeout: 1500 }).toString().trim();

        resolve({
          from: 'cnpm',
          latest
        });
      } catch (e) {
        if (process.env.DEBUG) {
          console.log(e);
        }
      }
    });

    const getFromTimeout = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          from: 'timeout',
          latest: 'unknown'
        });
      }, 4000);
    });

    try {
      return await Promise.race([
        getFromHttp,
        getFromNpm,
        getFromTNpm,
        getFromCNpm,
        getFromTimeout
      ]) as ({ from: string, latest: string });
    } catch (e) {
      return {
        from: 'catch',
        latest: 'unknown'
      };
    }
  }

  /**
   * 验证是否是合格的 APP 的名称
   * @param appName
   */
  static checkAppName(appName: string) {
    const validationResult = validateProjectName(appName);

    // 不是有效的包时, 退出程序
    if (!validationResult.validForNewPackages) {
      console.error(chalk.red(`因为下面的规则, 你不能创建叫做 ${chalk.green(appName)} 的包:\n`));

      [...(validationResult.errors || []), ...(validationResult.warnings || [])].forEach(
        (error) => {
          console.error(chalk.red(`  * ${error}`));
        },
      );
      console.error(chalk.red('\n请选择一个不同的名称.'));
      process.exit(1);
    }

    // 验证不能与我们的依赖同名
    const dependencies = [
      'matman',
      'matman-runner-puppeteer',
      'matman-runner-nightmare',
      'dwt',
    ].sort();

    if (dependencies.includes(appName)) {
      console.error(
        chalk.red(
          `因为同名依赖必须被安装, 不能创建叫做 ${chalk.green(appName)} 的包.\n` +
          `因为 npm 的工作方式, 下面这些名称不被允许:\n\n`,
        ) +
        chalk.cyan(dependencies.map((depName) => `  ${depName}`).join('\n')) +
        chalk.red('\n\n请选择一个不同的名称.'),
      );
      process.exit(1);
    }
  }

  /**
   * 判断文件夹是否是安全的可以创建项目
   * 如果仅仅只有 GH 文件是安全的, 并自动移除 error logs
   * @param root
   * @param name
   */
  static isSafeToCreateProjectIn(root: string, name: string) {
    const validFiles = [
      '.DS_Store',
      '.git',
      '.gitattributes',
      '.gitignore',
      '.gitlab-ci.yml',
      '.hg',
      '.hgcheck',
      '.hgignore',
      '.idea',
      '.npmignore',
      '.travis.yml',
      'docs',
      'LICENSE',
      'README.md',
      'mkdocs.yml',
      'Thumbs.db',
    ];

    // 安装失败时可以保留但是下次安装时移除
    const errorLogFilePatterns = ['npm-debug.log', 'yarn-error.log', 'yarn-debug.log'];
    const isErrorLog = (file: string) => {
      return errorLogFilePatterns.some((pattern) => file.startsWith(pattern));
    };

    const conflicts = fs
      .readdirSync(root)
      .filter((file) => !validFiles.includes(file))
      // 主要为 IDEA 系列 IDE 生成的文件
      .filter((file) => !/\.iml$/.test(file))
      .filter((file) => !isErrorLog(file));

    // 向用户显示文件
    if (conflicts.length > 0) {
      console.error(`${chalk.green(name)} 文件夹中包含可能会冲突的文件:`);
      console.log();

      conflicts.forEach((file) => {
        try {
          const stats = fs.lstatSync(path.join(root, file));
          if (stats.isDirectory()) {
            console.error(`  ${chalk.blue(`${file}/`)}`);
          } else {
            console.error(`  ${file}`);
          }
        } catch (e) {
          console.log(`  ${file}`);
        }
      });

      console.log();
      console.error('请尝试重新创建一个文件夹或者手动移除这些文件.');

      process.exit(1);
    }

    // 删除 error log 的文件
    fs.readdirSync(root).forEach((file) => {
      if (isErrorLog(file)) {
        fs.removeSync(path.join(root, file));
      }
    });
  }

  /**
   * 验证 yarn 已经正确安装
   */
  static shouldUseYarn() {
    try {
      execSync('yarnpkg --version', { stdio: 'ignore' });
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * 验证 npm 可以读取 CWD 这个问题主要在 win 出现
   * 我自己并没有进行验证
   * 来自 cra 社区的问题
   */
  static checkThatNpmCanReadCwd() {
    const cwd = process.cwd();
    let childOutput: string | null = null;

    try {
      // 据说只能用 spawn 才可以重现完全不知道为啥 hhh
      childOutput = spawn.sync('npm', ['config', 'list']).output.join('');
    } catch (err) {
      return true;
    }

    if (typeof childOutput !== 'string') {
      return true;
    }
    const lines = childOutput.split('\n');

    // `npm config list` 的输出中寻找:
    // "; cwd = C:\path\to\current\dir" (unquoted)
    const prefix = '; cwd = ';
    const line = lines.find((item) => item.startsWith(prefix));
    if (typeof line !== 'string') {
      return true;
    }

    // 配置与要求相同
    const npmCWD = line.substring(prefix.length);
    if (npmCWD === cwd) {
      return true;
    }

    console.error(chalk.red('不能在当前路径中启动 npm 进程.\n'));
    console.error(chalk.red(`当前路径为: ${chalk.bold(cwd)}`));
    console.error(chalk.red(`然而, npm 进程将运行在: ${chalk.bold(npmCWD)}\n`));
    console.error(chalk.red('这可能是由 shell 的错误配置引起的.'));

    if (process.platform === 'win32') {
      console.error(chalk.red('在 Windows 上, 通常运行下面的命令将会修复问题:\n'));
      console.error(
        `  ${chalk.cyan(
          'reg',
        )} delete "HKCU\\Software\\Microsoft\\Command Processor" /v AutoRun /f`,
      );
      console.error(
        chalk.red(
          `  ${chalk.cyan(
            'reg',
          )} delete "HKLM\\Software\\Microsoft\\Command Processor" /v AutoRun /f\n`,
        ),
      );
      console.error(chalk.red('尝试在终端中运行上面两条命令.'));
      console.error(
        chalk.red(
          '你可以在 https://blogs.msdn.microsoft.com/oldnewthing/20071121-00/?p=24433/ 找到更多的信息',
        ),
      );
    }

    return false;
  }

  /**
   * 检查 npm 版本
   */
  static checkNpmVersion() {
    let hasMinNpm = false;
    let npmVersion: string | null = null;

    try {
      npmVersion = execSync('npm --version').toString().trim();
      hasMinNpm = semver.gte(npmVersion, '6.0.0');
    } catch (err) {
      // ignore
    }

    return {
      hasMinNpm,
      npmVersion,
    };
  }

  /**
   * 得到完整的包名称, 支持简写
   * @param template
   * @param originalDirectory
   */
  static getTemplateInstallPackage(originalDirectory: string, template?: string) {
    let templateToInstall = 'cma-template';

    if (!template) {
      return Promise.resolve(templateToInstall);
    }

    // 本地文件调试
    if (template.match(/^file:/)) {
      const match = template.match(/^file:(.*)?$/);
      templateToInstall = `file:${path.resolve(originalDirectory, match ? match[1] : '')}`;

      return Promise.resolve(templateToInstall);
    }

    // 压缩包下载
    if (template.includes('://') || template.match(/^.+\.(tgz|tar\.gz)$/)) {
      // for tar.gz or alternative paths
      return Promise.resolve(template);
    }

    // 带有 scope 的处理
    const packageMatch = template.match(/^(@[^/]+\/)?([^@]+)?(@.+)?$/);
    if (!packageMatch) {
      return Promise.resolve(templateToInstall);
    }

    const scope = packageMatch[1] || '';
    const templateName = packageMatch[2] || '';
    const version = packageMatch[3] || '';

    if (templateName === templateToInstall || templateName.startsWith(`${templateToInstall}-`)) {
      // Covers:
      // - cra-template
      // - @SCOPE/cra-template
      // - cra-template-NAME
      // - @SCOPE/cra-template-NAME
      templateToInstall = `${scope}${templateName}${version}`;
    } else if (version && !scope && !templateName) {
      // Covers using @SCOPE only
      templateToInstall = `${version}/${templateToInstall}`;
    } else {
      // Covers templates without the `cra-template` prefix:
      // - NAME
      // - @SCOPE/NAME
      templateToInstall = `${scope}${templateToInstall}-${templateName}${version}`;
    }

    return Promise.resolve(templateToInstall);
  }

  /**
   * 得到包的名称与版本信息
   * @param installPackage
   */
  static async getPackageInfo(installPackage: string): Promise<{ name: string; version?: string }> {
    // git url 中获取信息 e.g:
    // git+https://github.com/mycompany/react-scripts.git
    // git+ssh://github.com/mycompany/react-scripts.git#v1.2.3
    if (installPackage.startsWith('git+')) {
      const match = installPackage.match(/([^/]+)\.git(#.*)?$/);

      return Promise.resolve({
        name: match ? match[1] : '',
      });
    }

    // scope 中获取, 同时尝试获取版本
    if (installPackage.match(/.+@/)) {
      // Do not match @scope/ when stripping off @version or @tag
      return Promise.resolve({
        name: installPackage.charAt(0) + installPackage.substr(1).split('@')[0],
        version: installPackage.split('@')[1],
      });
    }

    // 从本地文件中获取
    if (installPackage.match(/^file:/)) {
      const match = installPackage.match(/^file:(.*)?$/);
      const installPackagePath = match ? match[1] : '';

      const { name, version } = await import(path.join(installPackagePath, 'package.json'));
      return Promise.resolve({ name, version });
    }

    return Promise.resolve({ name: installPackage });
  }
}
