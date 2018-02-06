const cheerio = require("cheerio");
const rp = require("request-promise");

const online = {
  MENU: Symbol("online-menu"),
  CLASSIFY: Symbol("online-classify"),
  MOVIE: Symbol("online-movie")
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
      return rp({ uri: this.onlineSrc.menu(o), json: true });
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
      const reqHtml = await rp({ uri: `${this.prefix}${href}`, json: true });
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
      const reqHtml = await rp({ uri: this.onlineSrc.movie(id)});
      const movie = await this[online.MOVIE](reqHtml,id);
      return movie;
    } catch (error) {
      console.error(error);
    }
}
[online.MOVIE](html,id) {
    const $ = cheerio.load(html);
    const imgReg = /.+url\((.+)\)/;
    const imgDom = $(".videopic").attr("style");
    let conDom = $('.content ul li');
    let content;
    const nums = num => conDom.eq(num).find("a").get().map(o => {
        return $(o).text();
    })
    
    if(conDom.get().length === 7){
        let actorDire = nums(1);
        content = {
            atype:'电视剧',
            director:actorDire.splice(0,1),
            actor: actorDire,
            area: conDom.eq(2).find("a").text() || "",
            type:{
                text:conDom.eq(3).find("a").text(),
                href:conDom.eq(3).find("a").attr("href")
            },
            language: conDom.eq(4).text(),
            year: conDom.eq(5).text(),
            intro: conDom.eq(6).text(),
        }
    }else{
        content = {
            atype:'电影',
            update:conDom.eq(1).text(),
            director:nums(2),
            actor: nums(3),
            area: conDom.eq(4).find("a").text() || "",
            type:{
                text:conDom.eq(5).find("a").text(),
                href:conDom.eq(5).find("a").attr("href")
            },
            language: conDom.eq(6).text(),
            year: conDom.eq(7).text(),
            intro: conDom.eq(8).text(),
        }
    }
    const playList = $("#playlist .panel").get();
    const allPlay = playList.map(o => {
        let play = $(o).find("div ul li a").get();
        let list = play.map(p => {
            return {
                title:$(p).text(),
                href:$(p).attr("href")
            }
        })
        return {
            title:$(o).find(".option").text(),
            list
        }
    })
    const downList = $("#downlist table tbody tr").get();
    const allDown = downList.map(o => {
        return {
            title:$(o).find("td").eq(0).find("span").text(),
            href:$(o).find("td").eq(0).find("input").val()
        }
    })
    const sameList = $('.hy-video-list').get();
    const allSame = sameList.map((o,index) => {
        const aDiv = num => $(o).find("div").eq(num);
        const listGo = $(o).find(".hy-video-text-list").find("div ul li a").get();
        return {
            title:aDiv(0).find("h3").text()||aDiv(0).find("h4").text(),
            more:aDiv(0).find("a").attr("href") || "",
            swiper:aDiv(1).find("div a").get().map(s => {
                return {
                    title:$(s).attr("title"),
                    img:$(s).attr("data-original"),
                    href:$(s).attr("href")
                }
            }),
            list:listGo.map(o => {
                return {
                    title:$(o).text(),
                    href:$(o).attr("href")
                }
            })
        }
    })
    const {update,director,actor,area,type,language,year,intro} = content;
    return {
      id,
      img: imgDom.match(imgReg)?imgDom.match(imgReg)[1]:null,
      name: $('.head').find('h1').text(),
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
      introduce: $('.plot').text(),
      same:allSame
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
      page: $(".text-muted span")
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
      page: [{ index: nowPage, href: "nowPage" }].concat(pages)
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
}

module.exports = new OnlineCrawler();
