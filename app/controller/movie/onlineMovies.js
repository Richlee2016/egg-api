"use strict";

const Controller = require("egg").Controller;

class OnlineMoviesController extends Controller {
  // 所有得电影资源
  async index() {
    const ctx = this.ctx;
    const { query: p } = ctx;
    const res = await ctx.service.movies.fetchOnlineList(p);
    ctx.body = {
      movies: res
    };
    ctx.status = 200;
  }

  // 单个电影资源
  async show() {
    const ctx = this.ctx;
    const { params: { id } } = ctx;
    ctx.validate({id:"int"},{id:Number(id)});
    const res = await ctx.service.movies.fetchOnlineMovie(id);
    ctx.body = {
      movie: res
    };
    ctx.status = 200;
  }
}

module.exports = OnlineMoviesController;
