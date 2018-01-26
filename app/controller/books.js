"use strict";

const Controller = require("egg").Controller;

class BooksController extends Controller {
  constructor(app) {
    super(app);
  }
  /*
  @FreeBooks {免费书籍}
  get /FreeBooks {全部}
  get /FreeBooks/:id {query:name,author} {单个}
  get /FreeBookRead {query:id,chapter} {阅读具体章节}
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
    const { params: { id }, query: { name, author } } = ctx;
    const res = await ctx.service.books.fetchChapter(id, name, author);
    ctx.body = res;
    ctx.status = 200;
  }
  async get_FreeBookRead() {
    const ctx = this.ctx;
    const { id, chapter } = ctx.query;
    const res = await ctx.service.books.FetchContent(id, chapter);
    ctx.body = res.text ? res : "";
    ctx.status = 200;
  }
  async post_UpdateFreeBook() {
    const ctx = this.ctx;
    const res = await ctx.service.books.csFreeBook(ctx.request.body);
    ctx.body = res;
    ctx.status = 201;
  }
  async post_DeleteFreeBook() {
    ctx.status = 204;
  }
  async get_BookCollect() {
    const ctx = this.ctx;
    const openid = ctx.session.user;
    const res = await ctx.service.users.fetchCollect(openid,"bookCollect.id","_id");
    ctx.body = res;
    ctx.status = 200;
  }
  async post_BookCollect() {
    const ctx = this.ctx;
    const openid = ctx.session.user;
    const {id} = ctx.request.body;
    const res = await ctx.service.users.createCollect(openid,id,"bookCollect");
    ctx.body = res;
    ctx.status = 201;
  }
}

module.exports = BooksController;
