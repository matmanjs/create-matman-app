import { getDescribeForRes } from './util'

function bindClickEvent() {
  $('#btn').on('click', function () {
    fetch('/cgi-bin/a/b/demo_cgi')
      .then((result) => {
        return result.json();
      })
      .then((jsonData) => {
        console.log(jsonData);

        // 修改消息
        if (jsonData.retcode === 0) {
          $('#msg').text(getDescribeForRes(jsonData.result.description));
          $('#msg').removeClass('alert-info').addClass('alert-success').addClass('msg-loaded');
        } else {
          $('#msg').text(getDescribeForRes(jsonData));
          $('#msg').removeClass('alert-info').addClass('alert-danger').addClass('msg-loaded');
        }

      });
  });
}

// @ts-ignore
function iAmNotCalled() {
  // 这段代码没有被调用，因此不会被覆盖率统计到！
  console.log('I am not called in sogou.js!');
}

$(function () {
  console.log('jQuery loaded!');

  bindClickEvent();
});
