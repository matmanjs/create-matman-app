const _ = require('lodash');
const matman = require('matman');
const { BrowserRunner } = require('matman-runner-puppeteer');

/**
 * 创建端对端测试的 page driver
 *
 * @param {String} caseModuleFilePath caseModule的根目录，必须要绝对路径
 * @param {Object} pageDriverOpts 额外参数
 * @author helinjiang
 */
async function createPageDriver(
  caseModuleFilePath,
  pageDriverOpts,
) {
  // 创建 PageDriver，API 详见 https://matmanjs.github.io/matman/api/
  const pageDriver = await matman.launch(
    new BrowserRunner(),
    _.merge({}, pageDriverOpts, { caseModuleFilePath }),
  );

  // 设置浏览器设备型号
  await pageDriver.setDeviceConfig('iPhone 6');

  // 设置截屏
  await pageDriver.setScreenshotConfig(true);

  // 其他的配置
  // ...

  // 返回
  return pageDriver;
}

module.exports = {
  createPageDriver,
};
