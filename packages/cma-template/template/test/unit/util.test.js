const { expect } = require('chai');

const { getDescribeForRes } = require('../../src/util');

describe('测试 util.js', function () {
  describe('getDescribeForRes(msg)', () => {
    it('getDescribeForRes 为函数', () => {
      expect(getDescribeForRes).to.be.a('function');
    });

    it('getDescribeForRes() 正确', () => {
      expect(getDescribeForRes()).to.equal('来自接口返回： ');
    });

    it('getDescribeForRes(undefined) 正确', () => {
      expect(getDescribeForRes(undefined)).to.equal('来自接口返回： ');
    });

    it('getDescribeForRes(null) 正确', () => {
      expect(getDescribeForRes(null)).to.equal('来自接口返回： null');
    });

    it('getDescribeForRes(123) 正确', () => {
      expect(getDescribeForRes(123)).to.equal('来自接口返回： 123');
    });

    it('getDescribeForRes({age:123}) 正确', () => {
      expect(getDescribeForRes({ age: 123 })).to.equal('来自接口返回： {"age":123}');
    });
  });
});
