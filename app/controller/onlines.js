"use strict";

const Controller = require("egg").Controller;
class MoviesController extends Controller {
  constructor(app) {
    super(app);
  }
  
  /**
   * @OnlineMovie {熊猫在线电影}
   * get => /OnlineMovie {全部}
   * get => /OnlineMovie/:id {单个}
   */
  async get_OnlineMovies() {
    const ctx = this.ctx;
    const { query: p } = ctx;
    const res = await ctx.service.movies.fetchOnlineList(p);
    ctx.body = {
      movies: res
    };
    ctx.status = 200;
  }
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
  async get_Menu(ctx){
    const menu = await ctx.service.onlines.fetchMenu();
    ctx.body = menu;
    ctx.status = 200;
  }
  async single_Classify(ctx){ 
    const {id} = ctx.params;
    const res = await this.service.onlines.crawlerClassify(id);
    ctx.body = res;
  }
}

module.exports = MoviesController;
