const { expect } = require('chai');

const checkPage = require('../../case_modules/page_sogou/check-search');

describe('搜狗首页：检查搜索功能是否正常', function () {
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

    it('网站title应该为：搜狗搜索引擎 - 上网从搜狗开始', function () {
      expect(data.webviewInfo.title).to.equal('搜狗搜索引擎 - 上网从搜狗开始');
    });

    it('搜索按钮的文字应该为：搜狗搜索', function () {
      expect(data.searchReq.searchBtnTxt).to.equal('搜狗搜索');
    });

    it('搜索框内的文字为空', function () {
      expect(data.searchReq.searchKeyWorld).to.be.empty;
    });

    it('userAgent应该正确', function () {
      expect(data.webviewInfo.userAgent).to.equal(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36 mycustomua',
      );
    });
  });

  describe('第二步：搜索输入框输入: matman', function () {
    let data;

    before(function () {
      data = resultData.get('input_key_word');
    });

    it('数据快照正确', function () {
      expect(data).to.eql({
        'webviewInfo': {
          'title': '搜狗搜索引擎 - 上网从搜狗开始',
          'width': 1024,
          'height': 520,
          'userAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36 mycustomua',
        },
        'searchReq': {
          'searchBtnTxt': '搜狗搜索',
          'searchKeyWorld': 'matman',
        },
        'searchRsp': {
          'searchNumTips': '',
          'searchResult': [],
        },
      });
    });
  });

  describe('第三步：点击搜索按钮，获得搜索结果', function () {
    let data;

    before(function () {
      data = resultData.get('click_to_search');
    });

    it('搜索结果提示存在', function () {
      expect(data.searchRsp.searchNumTips).to.match(/搜狗已为您找到约(.*)条相关结果/);
    });

    it('搜索结果不为空', function () {
      expect(data.searchRsp.searchResult).to.not.be.empty;
    });
  });
});
