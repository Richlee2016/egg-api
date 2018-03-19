"use strict";

const Controller = require("egg").Controller;
class HotController extends Controller {
  constructor(app) {
    super(app);
    this.HotRules = {//热门推荐字段
      id: "int",
      name: "string",
      movieHome: "int",
      onlineMovie: "int",
      bgm: "string",
      videoUrl: "string",
      introduce: "string"
    };
  }
  /*
  @HotMovies {热门推荐}
  get /HotMovies {全部}
  get /HotMovies/:id {单个}
  post /UpdateHotMovie {增加和修改}
  post /DeleteHotMovie {删除}
  */
  async get_HotMovies() {
    const ctx = this.ctx;
    const { page, size } = ctx.query;
    const res = await ctx.service.hot.fetchHotList({
      page: Number(page) || 1,
      size: Number(size) || 10
    });
    ctx.body = {
      movies: res
    };
    ctx.status = 200;
  }
  async single_HotMovies() {
    const ctx = this.ctx;
    const { params: { id } } = ctx;
    ctx.validate({ id: "int" }, { id: Number(id) });
    const res = await ctx.service.hot.fetchHotMovie(id);
    ctx.body = {
      movie: res
    };
    ctx.status = 200;
  }
  async post_UpdateHotMovie() {
    const ctx = this.ctx;
    // ctx.validate(this.Rules);
    let body = ctx.request.body;
    const {movieHome,hotType} = ctx.request.body;
    const sendBody = Object.assign(body,{movieHome:Number(movieHome) || 0 ,hotType:Number(hotType) || 0});
    const res = await ctx.service.hot.csHotMovie(sendBody);
    ctx.body = res;
    ctx.status = 201;
  }
  async post_DeleteHotMovie() {
    const ctx = this.ctx;
    const { id } = ctx.request.body;
    const res = await ctx.service.hot.destroyHotMovie(id);
    ctx.body = res;
    ctx.status = 204;
  }
}

module.exports = HotController;
