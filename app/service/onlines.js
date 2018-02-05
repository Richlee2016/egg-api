const Service = require("egg").Service;
class MoviesService extends Service {
  constructor(ctx) {
    super(ctx);
    this.User = this.ctx.model.User.User;
    this.Page = this.ctx.model.Movie.Page;
    this.Online = this.ctx.model.Movie.OnlineMovie;
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
      if (area) arr.push({ area });
      if (type) arr.push({ type });
      if (year) arr.push({ year });
      if (actor) arr.push({ actor });
      if (director) arr.push({ director });
      return arr;
    };
    let allSearch = {};
    if (mySearch().length > 0) {
      allSearch = Object.assign({}, { $and: mySearch() });
    }
    let skip = (page - 1) * size;
    try {
      const counts = await this.Online.count(allSearch).exec();
      const movielist = await this.Online.find(allSearch)
        .sort({ id: -1 })
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
      return await this.Online.findOne({ id }).exec();
    } catch (error) {
      console.log("电影查询错误");
      console.log(error);
    }
  }

  // 在线电影 menu 获取
  async fetchMenu(){
    const res = await this.Page.findOne({name:"onlineMenu"});
    return res;
  }
  
  // 在线电影menu抓取
  async crawlerMenu(){
    const list =await this.Crawler.onlineMenu();
    const menu = await this.Page.savePage({ name: "onlineMenu", list });
    return menu;
  }

  // 抓取分类页面
  async crawlerClassify(href){
    let res = await this.Page.findOne({name:href});
    if(!res){
      const list =await this.Crawler.onlineClassify(href);
      res = await this.Page.savePage({name:href,list})
    };
    return res;
  }

}

module.exports = MoviesService;
