import { MatmanResult } from 'matman-core';

// @ts-ignore
import checkPage from '../../../DevOps/matman-app/case_modules/page_sogou/basic-check';

describe('搜狗首页：点击获取信息(type=1)', function () {
  jest.setTimeout(30000);

  let resultData: MatmanResult;

  beforeAll(async () => {
    resultData = await checkPage({
      show: false,
      doNotCloseBrowser: false,
      useRecorder: true,
      queryDataMap: {
        demo_cgi: 'success_js_module',
      },
    });
  });

  describe('第一步：开始操作之前，等待页面加载完成', () => {
    let data: any;

    beforeAll(() => {
      data = resultData.get('init');
    });

    test('数据快照正确', () => {
      expect(data).toEqual({
        webviewInfo: {
          title: 'hi jack in sogou.html',
          width: 1024,
          height: 520,
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36 mycustomua',
        },
        sayHelloInfo: {
          isExist: true,
          wording: '你好，我不是 www.sogou.com',
        },
        msgInfo: {
          isExist: true,
          wording: '我是原始信息，请点击下面按钮之后可更新信息',
          isSuccess: false,
          isLoaded: false,
        },
        btnInfo: {
          isExist: true,
          wording: '点击我获取新的信息！',
        },
      });
    });

    test('消息信息为原始信息', () => {
      expect(data.msgInfo.wording).toBe('我是原始信息，请点击下面按钮之后可更新信息');
    });
  });

  describe('第二步：点击按钮', () => {
    let data: any;

    beforeAll(() => {
      data = resultData.get('click');
    });

    test('数据快照正确', () => {
      expect(data).toEqual({
        webviewInfo: {
          title: 'hi jack in sogou.html',
          width: 1024,
          height: 520,
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36 mycustomua',
        },
        sayHelloInfo: {
          isExist: true,
          wording: '你好，我不是 www.sogou.com',
        },
        msgInfo: {
          isExist: true,
          wording: '来自接口返回： 我是学生',
          isSuccess: true,
          isLoaded: true,
        },
        btnInfo: {
          isExist: true,
          wording: '点击我获取新的信息！',
        },
      });
    });

    test('消息信息已更新为新信息', () => {
      expect(data.msgInfo.wording).toBe('来自接口返回： 我是学生');
    });

    test('消息信息类型：成功', () => {
      expect(data.msgInfo.isSuccess).toBe(true);
    });
  });
});
