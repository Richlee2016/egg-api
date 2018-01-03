'use strict';


module.exports = appInfo => {
  let config = exports = {};

  // 数据库配置
  config.mongoose = {
    url: 'mongodb://localhost:27017/koaapi',
    options: {}
  };
  
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1514550505563_1708';

  // add your config here
  config.middleware = [];

  return config;
};

