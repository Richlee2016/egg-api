"use strict";

const Controller = require("egg").Controller;

class UsersController extends Controller {
  /**
   * @users
   * get /QQ {QQoauth2.0 校验登录}
   * get /Users {query:page,size} {全部}
   * get /Users/:id {单个用户}
   */

  //QQ oauth2.0 校验 并登录
  async QQ() {
    console.log("myqq");
    const ctx = this.ctx;
    const { code, state } = ctx.query;
    const res = await ctx.service.users.oauth(code, state);
    ctx.body = ctx.service.users.redirectUrl(`${res.state}#${res.openid}`);
    ctx.status = 200;
  }
  // 全部用户
  async get_Users() {
    const ctx = this.ctx;
    const { page, size } = ctx.query;
    const res = await ctx.service.users.fetchUsers(page, size);
    ctx.body = {
      users: res
    };
    ctx.status = 200;
  }
  // 单个用户
  async single_Users() {
    const ctx = this.ctx;
    const { id } = ctx.params;
    const res = await ctx.service.users.fetchUser(id);
    ctx.body = {
      user: res
    };
    ctx.status = 200;
  }
}

module.exports = UsersController;
