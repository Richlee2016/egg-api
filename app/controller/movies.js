'use strict';

const Controller = require('egg').Controller;

class MoviesController extends Controller {

  // 获取所有得电影
  async index() {
    const ctx = this.ctx;
    const { query: p } = ctx
    const res = await ctx.service.movies.fetchList(p);
    ctx.body = {
      movies: res
    }
    ctx.status = 200;
  }

  // 获取单个电影
  async show() {
    const ctx = this.ctx;
    const { params: { id } } = ctx;
    const res = await ctx.service.movies.fetchMovie(id);
    ctx.body = {
      movie: res
    }
    ctx.status = 200;
  }

  // 获取首页
  async new() {
    const ctx = this.ctx;
    const res = await ctx.service.movies.fetchPage();
    ctx.body = {
      page: res
    }
    ctx.status = 200;
  }
}

module.exports = MoviesController;
