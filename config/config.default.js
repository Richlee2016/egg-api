"use strict";

module.exports = appInfo => {
  let config = (exports = {});

  // 数据库配置
  config = {
    keys: appInfo.name + "_1514550505563_1708",
    mongoose: {
      url: "mongodb://localhost:27017/koaapi",
      options: {}
    },
    middleware: ["errorHandler"],
    errorHandler: {
      match: '/api',
    },
    // 测试关闭 csrf 安全检查
    security: {
      csrf: {
        enable: false,
        ignoreJSON: true
      }
    },
    cors: {
      allowMethods: "GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS"
    }
  };
  return config;
};
