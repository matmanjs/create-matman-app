const path = require('path');
const fse = require('fs-extra');

function generate(demoDir, npmDir, shouldClear) {
  if (shouldClear) {
    fse.removeSync(distDir);
  }

  const distTemplateDir = path.join(npmDir, 'template');

  // 清理 DevOps 不必要的文件
  fse.removeSync(path.join(demoDir, 'DevOps/matman-app/node_modules'));
  fse.removeSync(path.join(demoDir, 'DevOps/matman-app/build'));
  fse.removeSync(path.join(demoDir, 'DevOps/matman-app/.DS_Store'));
  fse.removeSync(path.join(demoDir, 'DevOps/matman-app/package-lock.json'));

  fse.removeSync(path.join(demoDir, 'DevOps/mockstar-app/node_modules'));
  fse.removeSync(path.join(demoDir, 'DevOps/mockstar-app/build'));
  fse.removeSync(path.join(demoDir, 'DevOps/mockstar-app/.DS_Store'));
  fse.removeSync(path.join(demoDir, 'DevOps/mockstar-app/package-lock.json'));

  fse.removeSync(path.join(demoDir, 'node_modules'));
  fse.removeSync(path.join(demoDir, 'build'));
  fse.removeSync(path.join(demoDir, '.DS_Store'));
  fse.removeSync(path.join(demoDir, 'package-lock.json'));
  fse.removeSync(path.join(demoDir, '.matman_output'));
  fse.removeSync(path.join(demoDir, '.nyc_output'));

  fse.copySync(demoDir, distTemplateDir);
  fse.removeSync(path.join(distTemplateDir, 'package.json'));

  // 得把 .gitignore 修改为 gitignore

  fse.copySync(path.join(distTemplateDir, 'DevOps/matman-app/.gitignore'), path.join(distTemplateDir, 'DevOps/matman-app/gitignore'));
  fse.removeSync(path.join(distTemplateDir, 'DevOps/matman-app/.gitignore'));

  fse.copySync(path.join(distTemplateDir, 'DevOps/mockstar-app/.gitignore'), path.join(distTemplateDir, 'DevOps/mockstar-app/gitignore'));
  fse.removeSync(path.join(distTemplateDir, 'DevOps/mockstar-app/.gitignore'));

  fse.copySync(path.join(distTemplateDir, '.gitignore'), path.join(distTemplateDir, 'gitignore'));
  fse.removeSync(path.join(distTemplateDir, '.gitignore'));

  // 把 package.json 的 内容生成到 template.json 的 package 字段中
  fse.outputJson(path.join(npmDir, 'template.json'), {
    package: fse.readJsonSync(path.join(demoDir, 'package.json')),
  }, {
    spaces: '  ',
  });

  // 原目录内的 package.json 和 README.md 不变化
}

generate(path.join(__dirname, '../demo/jest'), path.join(__dirname, '../packages/cma-template-jest'));
generate(path.join(__dirname, '../demo/jest-ts'), path.join(__dirname, '../packages/cma-template-jest-ts'));
generate(path.join(__dirname, '../demo/mocha'), path.join(__dirname, '../packages/cma-template'));
generate(path.join(__dirname, '../demo/mocha-ts'), path.join(__dirname, '../packages/cma-template-mocha-ts'));
