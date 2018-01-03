'use strict';

// had enabled by egg
// exports.static = true;
// 验证  基于 parameter  的验证
exports.validate = {
    enable: true,
    package: 'egg-validate',
};

// mongodb 数据库
exports.mongoose = {
    enable: true,
    package: 'egg-mongoose',
  };