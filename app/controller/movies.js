"use strict";

const Controller = require("egg").Controller;
class MoviesController extends Controller {
  constructor(app) {
    super(app);
  }

  // 所有得电影资源
  async get_Movies() {
    const ctx = this.ctx;
    const { query: p } = ctx;
    const res = await ctx.service.movies.fetchList(p);
    ctx.body = {
      movies: res
    };
    ctx.status = 200;
  }

  // 单个电影资源
  async single_Movies() {
    const ctx = this.ctx;
    const { params: { id } } = ctx;
    ctx.validate({ id: "int" }, { id: Number(id) });
    const res = await ctx.service.movies.fetchMovie(id);
    ctx.body = {
      movie: res
    };
    ctx.status = 200;
  }

  // 获取电影页面资源
  async get_MoviePage(ctx) {
    const res = await ctx.service.movies.fetchPage();
    ctx.body = {
      page: res
    };
    ctx.status = 200;
  }

  // bili资源
  async single_MovieBili(ctx) {
    const { params: { id } } = ctx;
    const res = await ctx.service.movies.fetchBili(id);
    ctx.body = {
      page: res
    };
    ctx.status = 200;
  }

  // 所有得在线电影资源
  async get_OnlineMovies() {
    const ctx = this.ctx;
    const { query: p } = ctx;
    const res = await ctx.service.movies.fetchOnlineList(p);
    ctx.body = {
      movies: res
    };
    ctx.status = 200;
  }

  // 单个电影资源
  async single_OnlineMovies() {
    const ctx = this.ctx;
    const { params: { id } } = ctx;
    console.log(id);
    ctx.validate({ id: "int" }, { id: Number(id) });
    const res = await ctx.service.movies.fetchOnlineMovie(id);
    ctx.body = {
      movie: res
    };
    ctx.status = 200;
  }
}

module.exports = MoviesController;
