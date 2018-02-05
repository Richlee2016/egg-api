"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, routerParse } = app;

  routerParse(router, controller);

  router.get("/", controller.home.index);

  router.get("/oauth/qq", controller.users.QQ);

  

  // 定时任务 暂时暴露接口
  router.get("/getPage", controller.home.getPage);
};
