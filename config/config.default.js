"use strict";

module.exports = appInfo => {
  let config = (exports = {});

  // 数据库配置
  config = {
    richCof: {
      qiniu: {
        cname: "http://go.richfly.cn/",
        bucket: "eggapi",
        AK: "OBDA2gN9-FJfAzWExCHGNNG9QW5FqNtUrD57IwIi",
        SK: "lkrOjtgXY4WmN7NcJNSKNXb7aLue13_CPg_0X0NH"
      }
    },
    keys: appInfo.name + "_1514550505563_1708",
    cluster: {
      listen: {
        port: 8081,
        hostname: '127.0.0.1',
        // path: '/var/run/egg.sock',
      }
    },
    mongoose: {
      url: "mongodb://localhost:27017/eggapi",
      // url: "mongodb://127.0.0.1:18888/richmovie",
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
      domainWhiteList: ['http://localhost:8087', 'http://192.168.2.120:8087', 'http://book.richfly.cn'],
    },
    cors: {
      allowMethods: "GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS"
    },
    // 模板引擎
    view: {
      defaultViewEngine: 'nunjucks',
      mapping: {
        '.html': 'nunjucks',
      },
    }
  };
  return config;
};