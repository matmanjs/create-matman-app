const path = require('path');
const { E2ERunner } = require('matman-e2e-test');
const whistle = require('../DevOps/whistle');

const bootstrapMockstarPort = 9527 || process.env.MOCKSTAR_PORT;
const bootstrapWhistlePort = 8899 || process.env.WHISTLE_PORT;

(async () => {
  const WORKSPACE_PATH = path.join(__dirname, '../');
  const OUTPUT_PATH = path.join(__dirname, '../.matman_output');

  const e2eRunner = new E2ERunner({
    workspacePath: WORKSPACE_PATH,
    outputPath: OUTPUT_PATH,
  });

  // 开始启动
  await e2eRunner.start();

  // 构建项目
  await e2eRunner.buildProject('npx cross-env ENABLE_E2E_TEST=1 npm run build-prod', {
    cwd: WORKSPACE_PATH,
  });

  // 启动 mockstar
  const mockstarAppPath = path.join(WORKSPACE_PATH, './DevOps/mockstar-app');
  const mockstarPort = await e2eRunner.startMockstar(mockstarAppPath, { port: bootstrapMockstarPort });

  // 启动 whistle
  const whistlePort = await e2eRunner.startWhistle({
    port: bootstrapWhistlePort,
    useCurrentStartedWhistle: true,
    getWhistleRules: () => {
      return whistle.getProdRules({
        projectRootPath: WORKSPACE_PATH,
        shouldUseMockstar: true,
        mockstarPort,
      });
    },
  });

  // 启动 matman
  const matmanAppPath = path.join(WORKSPACE_PATH, './DevOps/matman-app');
  await e2eRunner.startMatman(matmanAppPath);

  // debug 日志
  console.log({
    bootstrapMockstarPort,
    bootstrapWhistlePort,
    mockstarPort,
    whistlePort,
  });
})();