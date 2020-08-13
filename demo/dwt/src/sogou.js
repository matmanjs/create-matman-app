const _ = require('lodash');

fetch('/cgi-bin/a/b/demo_cgi')
  .then((result) => {
    return result.json();
  })
  .then((jsonData) => {
    console.log(jsonData);

    // 修改消息
    document.querySelector('#msg').innerText = _.concat('来自接口返回：',jsonData.result.description).join(' ');

    // 追加 DOM
    const newDiv = document.createElement('div');
    newDiv.innerText = 'loaded!';
    newDiv.setAttribute('id', 'loaded');
    document.body.appendChild(newDiv);
  });
