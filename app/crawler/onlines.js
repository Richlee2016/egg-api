const cheerio = require("cheerio");
const rp = require("request-promise");

const online = {
  MENU: Symbol("online-menu"),
  CLASSIFY: Symbol("online-classify"),
  MOVIE: Symbol("online-movie"),
  HOME: Symbol("oneline-home"),
  ONE: Symbol("box-one"),
  TWO: Symbol("box-two"),
  PLAY: Symbol("online-play")
};

class OnlineCrawler {
  constructor() {
    this.prefix = "http://www.dy280.com/"; //熊猫影院
    this.onlineSrc = {
      menu: num => `${this.prefix}/index.php?m=vod-list-id-${num}.html`, //每天更新
      newest: `${this.prefix}new.html`, //每天更新
      rank: `${this.prefix}top.html`, //每天更新
      topic: `${this.prefix}topic.html`, //每三天更新
      movie: id => `${this.prefix}vod/${id}.html`
    };
  }
  // 在线电影 menu 抓取
  async onlineMenu() {
    let type = [1, 2, 3, 4];
    let proArr = type.map(o => {
      return rp({
        uri: this.onlineSrc.menu(o),
        json: true
      });
    });
    try {
      const reqHtml = await Promise.all(proArr);
      const menuList = reqHtml.map(o => {
        return this[online.MENU](o);
      });
      return menuList;
    } catch (error) {
      console.error(error);
    }
  }

  // 抓取分类页面、
  async onlineClassify(href) {
    try {
      const reqHtml = await rp({
        uri: `${this.prefix}${href}`,
        json: true
      });
      console.log(`${this.prefix}${href}`);
      const list = await this[online.CLASSIFY](reqHtml);
      return list;
    } catch (error) {
      console.error(error);
    }
  }

  // 抓取电影
  async onlineMovie(id) {
    try {
      const reqHtml = await rp({
        uri: this.onlineSrc.movie(id)
      });
      const movie = await this[online.MOVIE](reqHtml, id);
      return movie;
    } catch (error) {
      console.error(error);
    }
  }

  // 抓取首页
  async onlineHome(href) {
    if (href !== 'home') return;
    try {
      const reqHtml = await rp({
        uri: this.prefix
      });
      const home = await this[online.HOME](reqHtml);
      return home;
    } catch (error) {
      console.error(error);
    }
  }

  // 抓取电影、电视剧、综艺、动漫
  async onlinePlay(href, type) {
    let listNum;
    if ([22, 23, 24, 25, 29].indexOf(type) !== 0) {
      if (type === 22) {
        listNum = 9
      }
      if (type === 23) {
        listNum = 6;
      }
      if (type === 24 || type === 25 || type === 29) {
        listNum = 2;
      }
    } else {
      return;
    }
    try {
      const reqHtml = await rp({
        uri: `${this.prefix}${href}`
      });
      const play = await this[online.PLAY](reqHtml, {
        listNum
      });
      return play;
    } catch (error) {
      console.error(error);
    }
  }

  // 抓取专题
  async onlineTopic(href, type) {
    if (type !== 26) return;
    try {
      const reqHtml = await rp({
        uri: `${this.prefix}${href}`
      });
      const $ = cheerio.load(reqHtml);
      return {
        list: this._blcokTopic($),
        page: this._blockPage($)
      }
    } catch (error) {
      console.error(error);
    }
  }

  // //影片排行
  async onlineRank(href, type) {
    if (type !== 27) return;
    try {
      const reqHtml = await rp({
        uri: `${this.prefix}${href}`
      });
      const $ = cheerio.load(reqHtml);
      const topList = [];
      const listNum = $('.hy-video-list').get().length;
      for (let i = 0; i < listNum; i++) {
        topList.push({
          head: this._blockHead(i, $, "head"),
          list: this._blockList(i, $)
        })
      }
      return topList
    } catch (error) {
      console.error(error);
    }
  }
  // //最近更新
  async onlineNewest(href, type) {
    if (type !== 28) return;
    try {
      const reqHtml = await rp({
        uri: `${this.prefix}${href}`
      });
      const $ = cheerio.load(reqHtml);
      return {
        tab: this._blockSwitchTab(0, $),
        list: this._blockList(0, $)
      }
    } catch (error) {
      console.error(error);
    }
  }

  [online.PLAY](html, {
    listNum,
    pageListNum
  }) {
    const $ = cheerio.load(html);
    let allList = [];
    for (let i = 0; i < listNum; i++) {
      allList.push(this[online.ONE]([i, i + 1, i], $));
    }
    return {
      header: {
        banner: this._blockBanner(0, $),
        tag: this._blockTags(0, $),
        rank: this._blockRank(0, $)
      },
      screen: this._blockScreen(0, $),
      list: allList,
      pageList: {
        tag: this._blockSwitchTab(0, $),
        list: this._blockList(listNum + 1, $),
        page: this._blockPage($)
      }
    }
  }

  [online.HOME](html) {
    const $ = cheerio.load(html);
    return {
      header: {
        banner: this._blockBanner(0, $),
        menu: $(".hy-index-menu a").get().map(o => {
          return {
            title: $(o).find("span").text(),
            href: $(o).attr("href")
          }
        }),
        tag: this._blockTags(0, $),
      },
      hot: this[online.ONE]([0, 0, 0], $),
      movie: this[online.TWO]([1, 1, 0, 2], $),
      tvplay: this[online.TWO]([2, 2, 1, 4], $),
      tvshow: {
        head: this._blockHead(3, $),
        banner: this._blockBanner(3, $),
        list: this._blockList(5, $),
        text: this._blockTextList(1, $)
      },
      cartoon: this[online.TWO]([4, 4, 2, 7], $),
      topic: {
        head: this._blockHead(5, $),
        list: this._blcokTopic($)
      }
    }
  }

  [online.MOVIE](html, id) {
    const $ = cheerio.load(html);
    const imgReg = /.+url\((.+)\)/;
    const imgDom = $(".videopic").attr("style");
    let conDom = $(".content ul li");
    let content;
    const nums = num =>
      conDom
      .eq(num)
      .find("a")
      .get()
      .map(o => {
        return $(o).text();
      });

    if (conDom.get().length === 7) {
      let actorDire = nums(1);
      content = {
        atype: "电视剧",
        director: actorDire.splice(0, 1),
        actor: actorDire,
        area: conDom
          .eq(2)
          .find("a")
          .text() || "",
        type: {
          text: conDom
            .eq(3)
            .find("a")
            .text(),
          href: conDom
            .eq(3)
            .find("a")
            .attr("href")
        },
        language: conDom.eq(4).text(),
        year: conDom.eq(5).text(),
        intro: conDom.eq(6).text()
      };
    } else {
      content = {
        atype: "电影",
        update: conDom.eq(1).text(),
        director: nums(2),
        actor: nums(3),
        area: conDom
          .eq(4)
          .find("a")
          .text() || "",
        type: {
          text: conDom
            .eq(5)
            .find("a")
            .text(),
          href: conDom
            .eq(5)
            .find("a")
            .attr("href")
        },
        language: conDom.eq(6).text(),
        year: conDom.eq(7).text(),
        intro: conDom.eq(8).text()
      };
    }
    const playList = $("#playlist .panel").get();
    const allPlay = playList.map(o => {
      let play = $(o)
        .find("div ul li a")
        .get();
      let list = play.map(p => {
        return {
          title: $(p).text(),
          href: $(p).attr("href")
        };
      });
      return {
        title: $(o)
          .find(".option")
          .text(),
        list
      };
    });
    const downList = $("#downlist table tbody tr").get();
    const allDown = downList.map(o => {
      return {
        title: $(o)
          .find("td")
          .eq(0)
          .find("span")
          .text(),
        href: $(o)
          .find("td")
          .eq(0)
          .find("input")
          .val()
      };
    });
    const sameList = $(".hy-video-list").get();
    const allSame = sameList.map((o, index) => {
      const aDiv = num =>
        $(o)
        .find("div")
        .eq(num);
      const listGo = $(o)
        .find(".hy-video-text-list")
        .find("div ul li a")
        .get();
      return {
        title: aDiv(0)
          .find("h3")
          .text() ||
          aDiv(0)
          .find("h4")
          .text(),
        more: aDiv(0)
          .find("a")
          .attr("href") || "",
        swiper: aDiv(1)
          .find("div a")
          .get()
          .map(s => {
            return {
              title: $(s).attr("title"),
              img: $(s).attr("data-original"),
              href: $(s).attr("href")
            };
          }),
        list: listGo.map(o => {
          return {
            title: $(o).text(),
            href: $(o).attr("href")
          };
        })
      };
    });
    const {
      update,
      director,
      actor,
      area,
      type,
      language,
      year,
      intro
    } = content;
    return {
      id,
      img: imgDom.match(imgReg) ? imgDom.match(imgReg)[1] : null,
      name: $(".head")
        .find("h1")
        .text(),
      update,
      director,
      actor,
      area,
      type,
      language,
      year,
      intro,
      play: allPlay,
      downUrl: allDown,
      introduce: $(".plot").text(),
      same: allSame
    };
  }

  [online.CLASSIFY](html) {
    const $ = cheerio.load(html);
    const navs = $(".nav-tabs li a").get();
    const boxs = $(".hy-video-list li").get();
    const nowPage = $(".hy-page span").text();
    const pages = $(".hy-page a")
      .get()
      .map(o => {
        return {
          index: $(o).text(),
          href: $(o).attr("href")
        };
      });
    return {
      nvas: navs.map(o => {
        return {
          title: $(o).text(),
          href: $(o).attr("href")
        };
      }),
      pagenum: $(".text-muted span")
        .eq(0)
        .text(),
      total: $(".text-muted span")
        .eq(1)
        .text(),
      list: boxs.map(o => {
        const a = $(o).find("a");
        return {
          img: a.attr("data-original"),
          title: a.attr("title"),
          actor: $(o)
            .find(".subtitle")
            .text(),
          href: a.attr("href")
        };
      }),
      page: [{
        index: nowPage,
        href: "nowPage"
      }].concat(pages)
    };
  }

  [online.MENU](html) {
    const $ = cheerio.load(html);
    const collapse = $("#collapse ul").get();
    const type = collapse.map(u => {
      const lis = $(u)
        .find("a")
        .get();
      return {
        title: $(u)
          .find("span")
          .text(),
        menus: lis.map((l, num) => {
          return {
            nav: $(l).text(),
            href: $(l).attr("href")
          };
        })
      };
    });
    return {
      name: $(".content-meun .head span")
        .eq(1)
        .text(),
      type
    };
  }

  [online.ONE](n, $) {
    return {
      head: this._blockHead(n[0], $),
      list: this._blockList(n[1], $),
      text: this._blockTextList(n[2], $)
    }
  }

  [online.TWO](n, $) {
    return {
      head: this._blockHead(n[0], $),
      banner: this._blockBanner(n[1], $),
      rank: this._blockRank(n[2], $),
      list: this._blockList(n[3], $)
    }
  }
  _blockSwitchTab(num, $) {
    const tab = $('.hy-switch-tabs').eq(num);
    tab
    return {
      navs: tab.find(".nav a").get().map(o => {
        return $(o).text()
      }),
      count: tab.find(".text-muted span").eq(0).text(),
      page: tab.find(".text-muted span").eq(1).text()
    }
  }
  _blockPage($) {
    const nowPage = $(".hy-page span").text();
    const pages = $(".hy-page a").get().map(o => {
      return {
        index: $(o).text(),
        href: $(o).attr("href")
      };
    });
    return [{
      index: nowPage,
      href: "nowPage"
    }].concat(pages)
  }
  _blockScreen(num, $) {
    const screen = $(".hy-min-screen").eq(num);
    return screen.find('dl').get().map(o => {
      return {
        name: $(o).find('dt').text(),
        list: $(o).find('a').get().map(a => {
          return {
            title: $(a).text(),
            href: $(a).attr('href')
          }
        })
      }
    })
  }
  _blockTags(num, $) {
    const tags = $(".hy-index-tags").eq(0);
    return tags.find("a").get().map(o => {
      return {
        name: $(o).text(),
        href: $(o).attr('href')
      }
    })
  }
  _blcokTopic($) {
    const topic = $('.hy-topic-list a').get();
    return topic.map(o => {
      return {
        name: $(o).find(".name").text(),
        count: $(o).find(".count").text(),
        href: $(o).attr('href'),
        img: $(o).attr('data-original')
      }
    })
  }
  _blockRank(num, $) {
    const rank = $(".hy-video-ranking").eq(num);
    const list = rank.find("a").get().map(o => {
      return {
        title: $(o).attr("title"),
        href: $(o).attr("href")
      }
    })
    return {
      head: this._blockHead(num, $, "min"),
      list
    }
  }
  _blockBanner(num, $) {
    const banner = $(".swiper-wrapper").eq(num);
    return banner.find("a").get().map(o => {
      return {
        title: $(o).attr("title"),
        href: $(o).attr("href")
      }
    })
  }
  _blockHead(num, $, min) {
    let head = !min ? $(".hy-video-head").eq(num) : $(".hy-video-min-head").eq(num);
    if (min === 'head') {
      head = $(".hy-video-list").eq(num).find(".head")
    }
    return {
      name: !min ? head.find('h3').text() : head.find('h4').text(),
      more: head.find('a').attr('href')
    }
  }
  _blockList(num, $) {
    const list = $('.hy-video-list').eq(num);
    return list.find(".videopic").get().map(o => {
      return {
        title: $(o).attr('title'),
        href: $(o).attr('href'),
        img: $(o).attr('data-original')
      }
    })
  }
  _blockTextList(num, $) {
    const text = $('.hy-video-text-list').eq(num);
    return text.find("a").get().map(o => {
      return {
        title: $(o).attr('title'),
        href: $(o).attr('href'),
      }
    })
  }
}

module.exports = new OnlineCrawler();