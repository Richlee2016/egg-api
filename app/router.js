"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller,routerParse } = app;
// console.log(app);
  routerParse(router, controller);

  router.get("/", controller.home.index);
  // oauth
  router.get("/oauth/qq", controller.users.QQ);
  // router.resources("users", "/api/users", controller.users);
  // router.resources("session", "/api/session", controller.session);
  // // books
  // router.resources("books", "/api/books", controller.books);
  // // movies
  // router.resources("movies", "/api/movies", controller.movie.movies);
  // router.resources(
  //   "onlineMovies",
  //   "/api/onlineMovies",
  //   controller.movie.onlineMovies
  // );
  // router.resources("hotMovies", "/api/hotMovies", controller.movie.hotMovies);

  // // 定时任务 暂时暴露接口
  router.get("/getPage", controller.home.getPage);
};
