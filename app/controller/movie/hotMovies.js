"use strict";

const Controller = require("egg").Controller;

class HotController extends Controller {
    constructor(app) {
      super(app);
      this.Rules = {
        id: "int",
        name: "string",
        movieHome: "int",
        onlineMovie: "int",
        bgm: "string",
        videoUrl: "string",
        introduce: "string"
      };
    }
  // 所有得推荐电影资源
  async index() {
    const ctx = this.ctx;
    const { page, size } = ctx.query;
    const res = await ctx.service.movies.fetchHotList({
      page: Number(page) || 1,
      size: Number(size) || 10
    });
    ctx.body = {
      movies: res
    };
    ctx.status = 200;
  }

  // 单个推荐电影资源
  async show() {
    const ctx = this.ctx;
    const { params: { id } } = ctx;
    ctx.validate({ id: "int" }, { id: Number(id) });
    const res = await ctx.service.movies.fetchHotMovie(id);
    ctx.body = {
      movie: res
    };
    ctx.status = 200;
  }
  // 增加
  async create() {
    const ctx = this.ctx;
    // ctx.validate(this.Rules);
    const res = await ctx.service.movies.csHotMovie(ctx.request.body);
    ctx.body = 0;
    ctx.status = 201;
  }
  // 修改
  async update() {
    const ctx = this.ctx;
    const { id } = ctx.params;
    console.log(id,ctx.request.body);
    ctx.validate({ id: "int" }, { id:Number(id) });
    // ctx.validate(this.Rules);
    const res = await ctx.service.movies.csHotMovie(ctx.request.body);
    ctx.body = res;
    ctx.status = 201;
  }
  // 删除
  async destroy() {
    const ctx = this.ctx;
    const { id } = ctx.params;
    ctx.validate({ id: "int" }, { id });
    const res = await ctx.service.movies.destroyHotMovie(id);
    ctx.body = res;
    ctx.status = 204;
  }
}

module.exports = HotController;
