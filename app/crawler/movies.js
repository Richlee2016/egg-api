const cheerio = require("cheerio");
const rp = require("request-promise");
const install = require("superagent-charset");
const request = require("superagent");
const superagent = install(request);
const puppeteer = require("puppeteer")
class BookCrawler {
  constructor() {
    this.config = {
      onlineSrc: "http://www.dy280.com/" //熊猫影院
    };
    this.crawlerSrc = {
      movie: id => `http://www.idyjy.com/sub/${id}.html`,
      page: "http://www.idyjy.com/",
      newest: "http://www.idyjy.com/w.asp?p=1&f=0",
      bili: s =>
        `https://search.bilibili.com/all?keyword=${s}&from_source=banner_search`
    };
    this.onlineSrc = {
      menu: num =>
        `${this.config.onlineSrc}/index.php?m=vod-list-id-${num}.html`, //每天更新
      newest: `${this.config.onlineSrc}new.html`, //每天更新
      rank: `${this.config.onlineSrc}top.html`, //每天更新
      topic: `${this.config.onlineSrc}topic.html` //每三天更新
    };
    this.numReg = /\d+/g;
  }
  // 请求
  async _request(url) {
    return new Promise((resolve, reject) => {
      superagent
        .get(url)
        .charset("gb2312")
        .end(function (err, res) {
          if (err) {
            reject(err);
          }
          if (res) {
            var $ = cheerio.load(res.text, {
              decodeEntities: false
            });
            resolve($);
          }
        });
    });
  }

  // 首页
  async page() {
    try {
      const $ = await this._request(this.crawlerSrc.page);
      const res = this._pageHandle($);
      return res;
    } catch (error) {
      console.error(error);
    }
  }

  // 单个电影
  async movie(id) {
    try {
      const $ = await this._request(this.crawlerSrc.movie(id));
      const res = this._movieHandle($, id);
      return res;
    } catch (error) {
      console.error(error);
    }
  }

  // 多个电影
  async movies(max, min) {
    let moreArr = [];
    for (var i = min + 1; i <= max; i++) {
      moreArr.push(this._request(this.crawlerSrc.movie(i)));
    }
    try {
      const domS = await Promise.all(moreArr);
      const moreRes = domS.map((o, i) => this._movieHandle(o, min + i + 1));
      console.log(`爬取(${min + 1}~${max})最新电影成功`);
      return moreRes;
    } catch (error) {
      console.log("爬取最新电影失败");
    }
  }

  // 抓取最新的电影id
  async newestId() {
    const $ = await this._request(this.crawlerSrc.newest);
    const list = $(".movielist li a").get();
    const idList = list.map(o => {
      return (
        $(o)
        .attr("href")
        .match(this.numReg)[0] || ""
      );
    });
    return Math.max.apply(Math, idList);
  }

  // 抓取bili 搜索
  async bili(keyword) {
    const s = encodeURIComponent(keyword);
    try {
      const reqHtml = await rp({
        uri: this.crawlerSrc.bili(s),
        json: true
      });
      const bili = this._biliHandle(reqHtml);
      return bili;
    } catch (error) {
      console.error(error);
    }
  }

  // pupptest
  async pupp() {
    const sleep = time => {
      return new Promise((resolve,reject) => {
        setTimeout(() => {
          resolve();
        }, time);
      })
    }
    const browser = await puppeteer.launch({
      arg: ['--no-sandbox'],
      dumpio: false
    });
    const page = await browser.newPage();
    await page.goto("https://movie.douban.com/", {
      waitUntil: 'networkidle2'
    });
    await sleep(3000)
    // 获取节点

    const res = await page.evaluate(() => {
      var $ = window.$;
      return $(".nav-logo").html()
    });
    console.log(res);
    await browser.close();
  }

  // 处理bili dom
  _biliHandle(dom) {
    const $ = cheerio.load(dom);
    const box = $(".ajax-render li").get();
    console.log(box.length);
    const hrefReg = /(av\d+)/g;
    const upNameReg = /(\d+)/g;
    const trimReg = str => str.replace(/(\n)|(\t)/, "").trim();
    const list = box.map((o, i) => {
      const domA = $(o).find("a");
      const tags = $(o).find(".tags span");
      const up = tags.eq(3);
      return {
        id: i + 1,
        av: domA.attr("href").match(hrefReg)[0],
        title: domA.attr("title").trim(),
        img: $(o)
          .find("img")
          .attr("data-src"),
        time: trimReg(
          $(o)
          .find(".so-imgTag_rb")
          .text()
        ),
        playTime: trimReg(tags.eq(1).text()),
        upTime: trimReg(tags.eq(2).text()),
        upZhu: {
          name: up.find("a").text(),
          id: up
            .find("a")
            .attr("href")
            .match(upNameReg)[0]
        }
      };
    });
    return list;
  }
  // 处理首页dom
  _pageHandle($) {
    const pageAttr = dom => {
      const info = cla => dom.find(`.${cla} info`).text();
      var reg = /\d+/g;
      return {
        img: dom.find("img").attr("original"),
        name: dom.find("a").attr("title"),
        year: dom
          .find(".pLeftTop info")
          .eq(0)
          .text(),
        score: info("pRightBottom"),
        episodes: info("pLefpLeftBottomtTop"),
        id: dom
          .find("a")
          .attr("href")
          .match(reg)[0]
      };
    };

    const banners = $(".moxhotcoment li").get();
    const boxs = $(".box").get();

    const banner = banners.map(o => pageAttr($(o)));
    const box = boxs.map(o => {
      const titles = $(o)
        .find("dd a")
        .get();
      const lists = $(o)
        .find("li")
        .get();
      return {
        title: titles.map(i => $(i).text()),
        list: lists.map(i => pageAttr($(i)))
      };
    });
    return {
      banner,
      box
    };
  }
  // 处理电影dom
  _movieHandle($, num) {
    var main = $("#main");

    if ($("#main").get().length === 0) {
      return {
        _id: num,
        id: num,
        name: "none"
      };
    }

    let isMovieSubject = main
      .find(".location a")
      .get()
      .map(o => $(o).text())[2];
    if (isMovieSubject === "电影专题") {
      console.log(num + ":电影专题");
      return {
        id: num,
        name: "subject"
      };
    }

    var info = $(".info ul li");
    //url 解析
    const getUrl = () => {
      let urlArr = [];
      $(".mox")
        .get()
        .forEach((o, i) => {
          if (
            $(o)
            .find(".down_list")
            .get().length === 1
          ) {
            var res = $(o)
              .find(".down_list li")
              .get()
              .map((o, j) => {
                return {
                  num: j,
                  title: $(o)
                    .find(".down_part_name a")
                    .text(),
                  url: $(o)
                    .find(".down_url")
                    .val(),
                  size: $(o)
                    .find(".file-size")
                    .text(),
                  ed2k: 0
                };
              });
            urlArr.push(res);
          }
        });
      return urlArr;
    };

    //info 解析
    const getInfo = () => {
      let firstLabel = info
        .eq(0)
        .find("span")
        .eq(0)
        .text();
      let infoRes;

      //冒号 正则
      let regNum = str => str.match(/\d+/)[0];
      let regChin = str => str.match(/([\u4e00-\u9fa5]+)/g);
      let resultArr = dom =>
        dom
        .find("a")
        .get()
        .map(o => $(o).text());
      let otherName = str => str.slice(3, str.length);
      //连续剧
      if (firstLabel === "更新状态：" || firstLabel === "更新至：") {
        //完结设置
        let isFinish = true;
        if (regChin(info.eq(0).text())[1] !== "全集可下载") {
          isFinish = false;
        }

        infoRes = {
          isFinish: isFinish,
          year: regNum(info.eq(1).text()),
          area: regChin(info.eq(1).text())[2],
          classify: resultArr(info.eq(2)),
          director: resultArr(info.eq(3)),
          actor: resultArr(info.eq(4)),
          othername: otherName(info.eq(5).text()),
          imdb: "none",
          intro: main.find(".endtext").text()
        };
        //电影
      } else if (firstLabel === "上映年代：") {
        infoRes = {
          isFinish: true,
          year: regNum(info.eq(0).text()),
          area: regChin(info.eq(0).text())[2],
          classify: resultArr(info.eq(1)),
          director: resultArr(info.eq(2)),
          actor: resultArr(info.eq(3)),
          othername: otherName(info.eq(4).text()),
          imdb: info
            .eq(5)
            .find("span")
            .eq(1)
            .text(),
          intro: main.find(".endtext").text()
        };
      }
      return infoRes;
    };

    //解析
    var myInfo = getInfo();
    let imgSrc = main.find(".pic img").attr("original");
    if (!imgSrc) {
      imgSrc = main.find(".pic img").attr("src");
    }
    var mymovie = {
      _id: num,
      id: num,
      name: $("#name").text(),
      year: myInfo.year,
      score: 0,
      area: myInfo.area,
      othername: myInfo.othername,
      img: imgSrc,
      imdb: myInfo.imdb,
      isFinish: myInfo.isFinish,
      classify: myInfo.classify,
      actor: myInfo.actor,
      catalog: main
        .find(".location a")
        .get()
        .map(o => $(o).text()),
      director: myInfo.director,
      intro: myInfo.intro,
      url: getUrl()
    };
    return mymovie;
  }

}

module.exports = new BookCrawler();