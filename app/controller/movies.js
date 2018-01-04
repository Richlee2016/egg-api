"use strict";

const Controller = require("egg").Controller;

class MoviesController extends Controller {
  // 所有得电影资源
  async index() {
    const ctx = this.ctx;
    const { query: p } = ctx;
    const res = await ctx.service.movies.fetchList(p);
    ctx.body = {
      movies: res
    };
    ctx.status = 200;
  }

  // 单个电影资源
  async show() {
    const ctx = this.ctx;
    const { params: { id } } = ctx;
    const res = await ctx.service.movies.fetchMovie(id);
    ctx.body = {
      movie: res
    };
    ctx.status = 200;
  }

  // 获取电影页面资源
  async new() {
    const ctx = this.ctx;
    const { query: { type, keyword } } = ctx;
    if (type === "page") await this._pageReq(ctx);
    if (type === "bili") await this._biliReq(ctx,keyword || "");
  }

  // 首页资源
  async _pageReq(ctx) {
    const res = await ctx.service.movies.fetchPage();
    ctx.body = {
      page: res
    };
    ctx.status = 200;
  }

  // bili资源
  async _biliReq(ctx, keyword) {
    const res = await ctx.service.movies.fetchBili(keyword);
    ctx.body = {
      page: res
    };
    ctx.status = 200;
  }
}

module.exports = MoviesController;
