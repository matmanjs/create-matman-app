const _ = require('lodash');

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
          $('#msg').text(_.concat('来自接口返回：', jsonData.result.description).join(' '));
          $('#msg').removeClass('alert-info').addClass('alert-success').addClass('msg-loaded');
        } else {
          $('#msg').text(_.concat('来自接口返回：', JSON.stringify(jsonData)).join(' '));
          $('#msg').removeClass('alert-info').addClass('alert-danger').addClass('msg-loaded');
        }

      });
  });
}

function iAmNotCalled() {
  console.log('I am not called!');
}

$(function () {
  console.log('jQuery loaded!');

  bindClickEvent();
});
