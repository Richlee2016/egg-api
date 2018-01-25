"use strict";

const Controller = require("egg").Controller;

class BooksController extends Controller {
  constructor(app) {
    super(app);
  }
  /*
  @FreeBooks {热门推荐}
  get /FreeBooks {全部}
  get /FreeBooks/:id {单个}
  post /UpdateFreeBook {增加和修改}
  post /DeleteFreeBook {删除}
  */
  async get_FreeBooks() {
    const ctx = this.ctx;
    ctx.body = {
      books: []
    };
    ctx.status = 200;
  }
  async single_FreeBooks() {
    const ctx = this.ctx;
    const {id} = ctx.params;
    // const { params: { id }, query: { chapter } } = ctx;
    // let resRead, resChpater;
    // if (chapter) {
    //   resRead = await ctx.service.books.read(id, chapter);
    // } else {
    //   resChpater = await ctx.service.books.chapter(id);
    // }
    // ctx.body = {
    //   chapter: resChpater || [],
    //   read: resRead || {}
    // };
    ctx.status = 200;
  }
  async post_UpdateFreeBook() {
    const ctx = this.ctx;
    console.log(0);
    console.log(ctx.request.body);
    const res = await ctx.service.books.csFreeBook(ctx.request.body);
    ctx.body = 1;
    ctx.status = 201;
  }
  async post_DeleteFreeBook() {
    ctx.status = 204;
  }
}

module.exports = BooksController;
