'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  constructor(app){
    super(app)
    this.Crawler = this.ctx.helper.crawler.Movie;
  }
  async index(ctx) {
    this.app.apiDoc
    const apiDocuments = this.app.apiDocument();
    await ctx.render('index.html', { apis:apiDocuments});
  }
  /*******************************************测试 */
  // 获取在线电影 分类页
  async get_getOnlineMenu(ctx) {
    const res = await ctx.service.onlines.crawlerMenu();
    ctx.body = res;
  }
  // 获取电影家园首页
  async get_getPage() {
    const ctx = this.ctx;
    const res = await ctx.service.movies.crawlerPage();
    ctx.body = res;
  }
  // test puppeteer
  async get_pupp(ctx){
    const res = await this.Crawler.pupp();
    ctx.body = 1;
  }
  // test qiniu
  async get_qiniu(ctx){
    await ctx.service.qiniu.hotQiniuUpdate();
    ctx.body = 1;
  }

}

module.exports = HomeController;
