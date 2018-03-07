const MovieCrawler = require("../crawler/movies");
const BookCrawler = require("../crawler/books");
const OnlineCrawler = require("../crawler/onlines");
const qiniu = require('qiniu')
const nanoid = require('nanoid')
module.exports = {
  // 爬虫
  crawler: {
    Movie: MovieCrawler,
    Book: BookCrawler,
    Online: OnlineCrawler
  },
  // 更新数据超时函数
  metaTimeOut(time, mod) {
    if (!mod) return;
    const { meta: { updateAt } } = mod;
    const sec = time * 24 * 60 * 60 * 1000;
    const disTime = Date.now() - new Date(updateAt).getTime();
    if (disTime > sec) {
      return true;
    }
    return false;
  }
};
