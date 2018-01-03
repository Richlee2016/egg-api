'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'hi, egg';
  }

  async getMovies() {
    const ctx = this.ctx;
    ctx.body = {
      movies: {}
    }
  }

  async getPage() {
    const ctx = this.ctx;
    const res = await ctx.service.movies.crawlerPage();
    ctx.body = res;
  }
}

module.exports = HomeController;
