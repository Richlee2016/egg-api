'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/qq', controller.users.QQ);
  router.resources('users', '/api/users', controller.users);
  router.resources('users', '/api/session', controller.session);
  router.resources('books', '/api/books', controller.books);
  router.resources('movies', '/api/movies', controller.movies);

  // 定时任务 暂时暴露接口
  router.get('/getPage', controller.home.getPage);
};
