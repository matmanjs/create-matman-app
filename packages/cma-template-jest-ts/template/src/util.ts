import * as _ from 'lodash';

export function getDescribeForRes(msg: any): string {
  return _.concat('来自接口返回：', (typeof msg === 'object') ? JSON.stringify(msg) : msg).join(' ');
}

export function iAmNotCalled() {
  // 这段代码没有被调用，因此不会被覆盖率统计到！
  console.log('I am not called in util.js!');
}
