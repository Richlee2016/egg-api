'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const ctx = this.ctx;
    // this.app.apiDoc
    await ctx.render('index.html', { apis: this.app.apiDoc });
  }

  async getPage() {
    const ctx = this.ctx;
    const res = await ctx.service.movies.crawlerPage();
    ctx.body = res;
  }
}

module.exports = HomeController;
