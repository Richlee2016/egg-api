'use strict';

const Controller = require('egg').Controller;

class BooksController extends Controller {
  constructor(){}
  // 所有书籍
  async index() {
    const ctx = this.ctx;
    ctx.body = {
      books: []
    }
    ctx.status = 200;
  }
  // 单个书籍
  async show() {
    const ctx = this.ctx;
    const { params: { id }, query: { chapter } } = ctx;
    let resRead, resChpater;
    if (chapter) {
      resRead = await ctx.service.books.read(id, chapter);
    } else {
      resChpater = await ctx.service.books.chapter(id);
    };
    ctx.body = {
      chapter: resChpater || [],
      read: resRead || {}
    };
    ctx.status = 200;
  }
}

module.exports = BooksController;
