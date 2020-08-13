const { expect } = require('chai');

const checkPage = require('../../../DevOps/matman-app/case_modules/page_sogou/basic-check');

describe('搜狗首页：点击获取信息', function () {
  this.timeout(30000);

  let resultData;

  before(async function () {
    resultData = await checkPage({
      show: false,
      doNotCloseBrowser: false,
      useRecorder: true,
    });
  });

  describe('第一步：开始操作之前，等待页面加载完成', function () {
    let data;

    before(function () {
      data = resultData.get('init');
    });

    it('数据快照正确', function () {
      expect(data).to.eql({
        webviewInfo: {
          title: 'hi jack in sogou.html',
          width: 1024,
          height: 520,
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36 mycustomua',
        },
        sayHelloInfo: {
          isExist: true,
          wording: '',
        },
        msgInfo: {
          isExist: true,
          wording: '我是原始信息',
          isSuccess: false,
          isLoaded: false,
        },
        btnInfo: {
          isExist: true,
          wording: '点击我获取新的信息！',
        },
      });
    });

    it('消息信息为原始信息', function () {
      expect(data.msgInfo.wording).to.be.equal('我是原始信息');
    });
  });

  describe('第二步：点击按钮', function () {
    let data;

    before(function () {
      data = resultData.get('click');
    });

    it('数据快照正确', function () {
      expect(data).to.eql({
        webviewInfo: {
          title: 'hi jack in sogou.html',
          width: 1024,
          height: 520,
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36 mycustomua',
        },
        sayHelloInfo: {
          isExist: true,
          wording: '',
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

    it('消息信息已更新为新信息', function () {
      expect(data.msgInfo.wording).to.be.equal('来自接口返回： 我是学生');
    });
  });
});
