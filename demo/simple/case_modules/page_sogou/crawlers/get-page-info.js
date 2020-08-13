const { useJquery } = require('web-crawl-util');

/**
 * 获得 webview 的信息
 */
function getWebviewInfo() {
  return {
    title: document.title,
    width: window.innerWidth,
    height: window.innerHeight,
    userAgent: navigator.userAgent,
  };
}

/**
 * 获得搜索请求的相关信息
 */
function getSearchReq() {
  return {
    searchBtnTxt: useJquery.getVal('#stb'),
    searchKeyWorld: useJquery.getVal('#query'),
  };
}

/**
 * 获得搜索结果的相关信息
 */
function getSearchRsp() {
  const searchResult = [];

  $('.pt,.vrTitle', '#main .results').each(function () {
    searchResult.push({
      title: useJquery.getText($(this)),
    });
  });

  return {
    searchBtnTxt: useJquery.getVal('#searchBtn'),
    searchKeyWorld: useJquery.getVal('#upquery'),
    searchNumTips: useJquery.getText('#main .search-info .num-tips'),
    searchResult,

  };
}

module.exports = () => {
  return {
    webviewInfo: getWebviewInfo(),
    searchReq: getSearchReq(),
    searchRsp: getSearchRsp(),
  };
};
