const Service = require("egg").Service;
class MoviesService extends Service {
  constructor(ctx) {
    super(ctx);
    this.User = this.ctx.model.User.User;
    this.Page = this.ctx.model.Movie.Page;
    this.Online = this.ctx.model.Movie.Online;
    this.Crawler = this.ctx.helper.crawler.Online;
  }

  // 所有在线电影
  async fetchOnlineList(p) {
    const page = Number(p.page) || 1;
    const size = Number(p.size) || 10;
    const area = p.area;
    const type = p.type;
    const year = Number(p.year);
    const actor = p.actor;
    const director = p.director;
    const mySearch = () => {
      let arr = [];
      if (area) arr.push({
        area
      });
      if (type) arr.push({
        type
      });
      if (year) arr.push({
        year
      });
      if (actor) arr.push({
        actor
      });
      if (director) arr.push({
        director
      });
      return arr;
    };
    let allSearch = {};
    if (mySearch().length > 0) {
      allSearch = Object.assign({}, {
        $and: mySearch()
      });
    }
    let skip = (page - 1) * size;
    try {
      const counts = await this.Online.count(allSearch).exec();
      const movielist = await this.Online.find(allSearch)
        .sort({
          id: -1
        })
        .limit(size)
        .skip(skip)
        .exec();
      return {
        list: movielist,
        count: counts
      };
    } catch (error) {
      console.log("列表查询错误");
      console.log(error);
    }
  }

  // 单个在线电影
  async fetchOnlineMovie(id) {
    try {
      return await this.Online.findOne({
        id
      }).exec();
    } catch (error) {
      console.log("电影查询错误");
      console.log(error);
    }
  }

  // 在线电影menu 获取
  async fetchMenu() {
    const ctx = this.ctx;
    let res = await this.Page.findOne({
      name: "onlineMenu"
    });
    if (!res || ctx.helper.metaTimeOut(2, res)) {
      const list = await ctx.service.crawler.updateOnlineMenu();
      res = await this.Page.savePage({
        name: "onlineMenu",
        list
      });
    };
    return res;
  }

  // 请求页面
  async fetchPage(type, href) {
    const ctx = this.ctx;
    let res = await this.Page.findOne({
      name: href
    });
    let list;
    if (!res || ctx.helper.metaTimeOut(2, res)) {
      switch (type) {
        case 20: //筛选
          list = await ctx.service.crawler.onlineClassify(href);
          break;
        case 21: //首页
          list = await ctx.service.crawler.onlineHome(href);
          break;
        case 22: //电影
          list = await ctx.service.crawler.onlinePlay(href, type);
          break;
        case 23: //电视剧
          list = await ctx.service.crawler.onlinePlay(href, type);
          break;
        case 24: //综艺
          list = await ctx.service.crawler.onlinePlay(href, type);
          break;
        case 25: //动漫
          list = await ctx.service.crawler.onlinePlay(href, type);
          break;
        case 26: //专题
          list = await ctx.service.crawler.onlineTopic(href, type);
          break;
        case 27: //影片排行
          list = await ctx.service.crawler.onlineRank(href, type);
          break;
        case 28: //最近更新
          list = await ctx.service.crawler.onlineNewest(href, type);
          break;
        case 29: //分类页面
          list = await ctx.service.crawler.onlineTag(href, type);
          break;
      }
      res = await this.Page.savePage({
        name: href,
        list,
        type
      });
    };
    return res;
  }

  // 请求电影
  async fetchMovie(id, time) {
    const ctx = this.ctx;
    let res = await this.Online.findOne({
      _id: id
    });
    if (!res || ctx.helper.metaTimeOut(time, res)) {
      const movie = await this.Crawler.onlineMovie(id);
      res = await this.Online.saveOnline(movie);
    };
    return res;
  }
}

module.exports = MoviesService;