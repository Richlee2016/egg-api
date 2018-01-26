"use strict";

const Controller = require("egg").Controller;
class MoviesController extends Controller {
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
  /**
   * @Movies{电影家园}
   * get => /Movies {全部}
   * get => /Movies/:id {单个}
   * get => /MoviePage {首页展示}
   * get => /MovieBili/:id {bili搜索}
   * get => /MovieCollect {获取电影收藏}
   * post => /MovieCollect {body:id,handle(push,pull)} {操作电影收藏}
   */
  async get_Movies() {
    const ctx = this.ctx;
    const { query: p } = ctx;
    const res = await ctx.service.movies.fetchList(p);
    ctx.body = {
      movies: res
    };
    ctx.status = 200;
  }
  async single_Movies() {
    const ctx = this.ctx;
    const { params: { id } } = ctx;
    ctx.validate({ id: "int" }, { id: Number(id) });
    const res = await ctx.service.movies.fetchMovie(id);
    ctx.body = {
      movie: res
    };
    ctx.status = 200;
  }
  async get_MoviePage(ctx) {
    const res = await ctx.service.movies.fetchPage();
    ctx.body = {
      page: res
    };
    ctx.status = 200;
  }
  async single_MovieBili(ctx) {
    const { params: { id } } = ctx;
    const res = await ctx.service.movies.fetchBili(id);
    ctx.body = {
      page: res
    };
    ctx.status = 200;
  }
  async get_MovieCollect(){
    console.log(0);
    const ctx = this.ctx;
    const openid = ctx.session.user;
    const res = await ctx.service.users.fetchCollect("E71A6C17E7FAE3981C4F63CBE98A5F43","movieCollect.id","id name area year img");
    ctx.body = res;
    ctx.status = 200;
  }
  async post_MovieCollect(){
    const ctx = this.ctx;
    const openid = ctx.session.user;
    const {id,handle} = ctx.request.body;
    const res = await ctx.service.users.createCollect("E71A6C17E7FAE3981C4F63CBE98A5F43",id,handle,"movieCollect");
    ctx.body = res;
    ctx.status = 201;
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
    const res = await ctx.service.movies.fetchHotList({
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
    const res = await ctx.service.movies.fetchHotMovie(id);
    ctx.body = {
      movie: res
    };
    ctx.status = 200;
  }
  async post_UpdateHotMovie() {
    const ctx = this.ctx;
    // ctx.validate(this.Rules);
    const res = await ctx.service.movies.csHotMovie(ctx.request.body);
    ctx.body = res;
    ctx.status = 201;
  }
  async post_DeleteHotMovie() {
    const ctx = this.ctx;
    const { id } = ctx.request.body;
    const res = await ctx.service.movies.destroyHotMovie(id);
    ctx.body = res;
    ctx.status = 204;
  }
}

module.exports = MoviesController;
