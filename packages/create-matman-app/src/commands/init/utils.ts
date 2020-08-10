import https from 'https';
import chalk from 'chalk';
import validateProjectName from 'validate-npm-package-name';

export class InitUtil {
  /**
   * 检查依赖的最新版本
   */
  static checkForLatestVersion() {
    return new Promise((resolve, reject) => {
      https
        .get('https://registry.npmjs.org/-/package/create-matman-app/dist-tags', (res) => {
          if (res.statusCode === 200) {
            let body = '';
            res.on('data', (data) => {
              body += data;
            });
            res.on('end', () => {
              resolve(JSON.parse(body).latest);
            });
          } else {
            reject();
          }
        })
        .on('error', () => {
          reject();
        });
    });
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
}
