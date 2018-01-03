'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.resources('books', '/api/books', controller.books);
  router.resources('movies', '/api/movies', controller.movies);

  // 定时任务 暂时暴露接口
  router.get('/getMovies', controller.home.getMovies);
  router.get('/getPage', controller.home.getPage);
};
