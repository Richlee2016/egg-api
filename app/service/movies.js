const Service = require("egg").Service;
const Crawler = require("../crawler/movies");
class MoviesService extends Service {
  constructor(ctx) {
    super(ctx);
    this.Movie = this.ctx.model.Movie.Movie;
    this.Page = this.ctx.model.Movie.Page;
    this.Online = this.ctx.model.Movie.OnlineMovie;
    this.Hot = this.ctx.model.Movie.Hot;
  }
  // 获取所有电影
  async fetchList(p) {
    const page = Number(p.page) || 1;
    const size = Number(p.size) || 21;
    const catalog = p.catalog;
    const classify = p.classify;
    const area = p.area;
    const year = Number(p.year);
    const mySearch = () => {
      let arr = [];
      arr.push({ score: 0 });
      if (year) arr.push({ year });
      if (classify) arr.push({ classify });
      if (catalog) arr.push({ catalog });
      if (area) arr.push({ area });
      return arr;
    };
    let skip = (page - 1) * size;
    try {
      const counts = await this.Movie.count({
        name: { $ne: "none" },
        $and: mySearch()
      }).exec();
      const movielist = await this.Movie.find({
        name: { $ne: "none" },
        $and: mySearch()
      })
        .sort({ _id: -1 })
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

  // 获取单个电影
  async fetchMovie(id) {
    try {
      let movie = await this.Movie.findOne({ id }).exec();
      if (!movie) {
        // 爬取最新电影并储存
        // const more = await movieApi.movie(id);
        // movie = more.pop();
      }
      console.log("查询成功");
      return movie;
    } catch (e) {
      console.log("查询失败");
      console.error(e);
    }
  }

  // 获取首页
  async fetchPage() {
    try {
      let page = await this.Page.findOne({ name: "index" }).exec();
      console.log("查询成功");
      return page;
    } catch (e) {
      console.log("查询失败");
    }
  }

  // 获取bili
  async fetchBili(keyword) {
    try {
      let bili = await Crawler.bili(keyword);
      console.log("查询成功");
      return bili;
    } catch (e) {
      console.log("查询失败");
    }
  }

  // 更新电影
  async crawlerPage() {
    try {
      const newest = await Crawler.newestId();
      const isSave = await this._saveMovies(newest);
      if (isSave) {
        const page = await Crawler.page();
        const maxVal = await this.Page.savePage({ name: "index", list: page });
      }
      return isSave;
    } catch (error) {
      console.log("首页抓取失败");
      console.error(error);
    }
  }

  // 电影储存
  async _saveMovies(newestId) {
    const maxCount = await this.Movie.count({}).exec();
    if (newestId > maxCount) {
      const more = await Crawler.movies(newestId, maxCount);
      try {
        const insert = this.Movie.insertMany(more);
        return insert;
      } catch (error) {
        console.log("最新电影更新失败", error);
      }
    } else {
      return "电影为最新资源";
    }
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

  // 所有得推荐电影资源
  async fetchHotList() {}
  // 单个推荐电影资源
  async fetchHotMovie(id) {
    const res = await this.Hot.findOne({id}).populate("movieHome").exec();
    return res;
  }
  // 增加或修改单个推荐电影资源
  async csHotMovie(hot) {
    const res = await this.Hot.SaveHot(hot);
    return res;
  }
  // 修改单个推荐电影资源
  // async updateHotMovie(hot) {
  //   console.log(id);
  // }
  // 删除单个推荐电影资源
  async destroyHotMovie(id) {
    const res = await this.Hot.deleteMany([])
  }
}

module.exports = MoviesService;
