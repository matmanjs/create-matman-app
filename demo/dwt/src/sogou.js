const _ = require('lodash');

fetch('https://www.sogou.com/cgi-bin/a/b/demo_cgi')
  .then((result) => {
    return result.json();
  })
  .then((jsonData) => {
    console.log(jsonData);

    // 修改消息
    document.querySelector('#msg').innerText = _.trim(jsonData.result.description);

    // 追加 DOM
    const newDiv = document.createElement('div');
    newDiv.innerText = 'loaded!';
    newDiv.setAttribute('id', 'loaded');
    document.body.appendChild(newDiv);
  });
