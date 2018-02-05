'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  constructor(app){
    super(app)
  }
  async index() {
    const ctx = this.ctx;
    // this.app.apiDoc
    await ctx.render('index.html', { apis: this.app.apiDoc });
  }
  // 定时任务
  // 获取电影家园首页
  async getPage() {
    const ctx = this.ctx;
    const res = await ctx.service.movies.crawlerPage();
    ctx.body = res;
  }
  // 获取在线电影 分类页
  async get_getOnlineMenu(ctx) {
    const res = await ctx.service.movies.crawlerOnlineMenu();
    ctx.body = res;
  }

}

module.exports = HomeController;
