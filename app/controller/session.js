"use strict";

const Controller = require("egg").Controller;

class SessionController extends Controller {
  // 获取会话
  async index(){
    const ctx = this.ctx;
    const openid =ctx.session.user;
    if(openid){
      const res = await ctx.service.users.fetchUser(openid);
      ctx.body = res;
    }else{
      ctx.body = 0;
    };
    ctx.status = 200;
  }
  // 删除会话
  destroy(){
    this.ctx.session.user = null;
    ctx.body = 1;
    ctx.status = 200;
  }
}

module.exports = SessionController;
