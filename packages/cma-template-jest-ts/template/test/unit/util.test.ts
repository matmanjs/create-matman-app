const { getDescribeForRes } = require('../../src/util');

describe('测试 util.js', function () {
  describe('getDescribeForRes(msg)', () => {
    test('getDescribeForRes() 正确', () => {
      expect(getDescribeForRes()).toBe('来自接口返回： ');
    });

    test('getDescribeForRes(undefined) 正确', () => {
      expect(getDescribeForRes(undefined)).toBe('来自接口返回： ');
    });

    test('getDescribeForRes(null) 正确', () => {
      expect(getDescribeForRes(null)).toBe('来自接口返回： null');
    });

    test('getDescribeForRes(123) 正确', () => {
      expect(getDescribeForRes(123)).toBe('来自接口返回： 123');
    });

    test('getDescribeForRes({age:123}) 正确', () => {
      expect(getDescribeForRes({ age: 123 })).toBe('来自接口返回： {"age":123}');
    });
  });
});
