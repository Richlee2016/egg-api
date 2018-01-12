const Service = require("egg").Service;
const qs = require("querystring");
const request = require("request-promise");
class UsersService extends Service {
  constructor(ctx) {
    super(ctx);
    this.baseUrl = "https://graph.qq.com";
    this.config = {
      appID: 101435375,
      appKey: "91c323460e027125cdeef61365ca86f3",
      token: this.baseUrl + "/oauth2.0/token",
      openID: this.baseUrl + "/oauth2.0/me",
      get_user_info: this.baseUrl + "/user/get_user_info"
    };
    this.User = this.ctx.model.User.User;
  }

  // 所有用户
  async fetchUsers(page = 1, size = 20) {
    let p = page,
      s = size;
    p = Number(p) || 1;
    s = Number(s) || 20;
    let skip = (p - 1) * s;
    try {
      const res = await this.User.find({})
        .limit(size)
        .skip(skip)
        .exec();
      return res;
    } catch (error) {
      console.log(error);
    }
  }
  // 单个用户
  async fetchUser(openid) {
      console.log(openid);
    try {
      return await this.User.findOne({ openid }).exec();
    } catch (error) {
      console.log(error);
    }
  }
  //   oauth校验
  async oauth(code, state) {
    const token = await this._fetchAccessToken(code);
    console.log(code,token);
    const { access_token } = qs.parse(token);
    const openID = await this._fetchOpenId(access_token);
    const reg = /callback\(|\)|;/g;
    const openidStr = openID.replace(reg, "");
    const { openid } = JSON.parse(openidStr);
    const userInfo = await this._getUserInfo(access_token, openid);
    const res = await this._saveUser(openid, userInfo);
    return {
      state,
      openid
    };
  }
  // 获取accesstoken
  async _fetchAccessToken(code) {
    const sendData = {
      grant_type: "authorization_code",
      client_id: this.config.appID,
      client_secret: this.config.appKey,
      code,
      redirect_uri: encodeURI("http://173gg43187.iok.la/oauth/qq")
    };
    const res = await request({
      uri: `${this.config.token}?${qs.stringify(sendData)}`,
      json: true
    });
    return res;
  }
  // 获取openid
  async _fetchOpenId(access_token) {
    const res = await request({
      uri: `${this.config.openID}?access_token=${access_token}`,
      json: true
    });
    return res;
  }
  // 获取用户信息
  async _getUserInfo(access_token, openid) {
    const sendData = {
      access_token,
      oauth_consumer_key: this.config.appID,
      openid
    };
    const res = await request({
      uri: `${this.config.get_user_info}?${qs.stringify(sendData)}`,
      json: true
    });
    return res;
  }
  //   保存用户
  async _saveUser(openid, qqInfo) {
    try {
      const res = await this.User.saveUser(openid, qqInfo);
    } catch (error) {
      console.log(error);
    }
  }
  // 重定向窗口
  redirectUrl(state) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
        </head>
        <script>
          location.href = '${decodeURIComponent(state)}'
        </script>
        <body>
        </body>
      </html>
      `;
  }
}

module.exports = UsersService;
