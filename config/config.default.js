"use strict";

module.exports = appInfo => {
  let config = (exports = {});

  // 数据库配置
  config = {
    keys: appInfo.name + "_1514550505563_1708",
    mongoose: {
      url: "mongodb://rich_movie:richmovie345642459@127.0.0.1:18888/richmovie",
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
      },
      domainWhiteList: [ 'http://localhost:8087','http://192.168.2.120:8087','http://book.richfly.cn'],
    },
    cors: {
      allowMethods: "GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS"
    },
    // 模板引擎
    view:{
      defaultViewEngine: 'nunjucks',
      mapping: {
        '.html': 'nunjucks',
      },
    }
  };
  return config;
};
