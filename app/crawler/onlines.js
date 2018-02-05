const cheerio = require("cheerio");
const rp = require("request-promise");

const online = {
    MENU: Symbol("online-menu"),
    CLASSIFY: Symbol("online-classify")
};

class OnlineCrawler {
    constructor() {
        this.prefix = "http://www.dy280.com/"//熊猫影院
        this.onlineSrc = {
            menu: num =>
                `${this.prefix}/index.php?m=vod-list-id-${num}.html`, //每天更新
            newest: `${this.prefix}new.html`, //每天更新
            rank: `${this.prefix}top.html`, //每天更新
            topic: `${this.prefix}topic.html` //每三天更新
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
            const list = await this[online.CLASSIFY](reqHtml)
            return list;
        } catch (error) {
            console.error(error);
        }
    }

    [online.CLASSIFY](html) {
        const $ = cheerio.load(html);
        const navs = $('.nav-tabs li a').get();
        const boxs = $('.hy-video-list li').get();
        const nowPage = $('.hy-page span').text();
        const pages = $('.hy-page a').get().map(o => {
            return {
                index: $(o).text(),
                href: $(o).attr('href')
            }
        })
        return {
            nvas:navs.map(o => {
                return {
                    title:$(o).text(),
                    href:$(o).attr("href")
                }
            }),
            page:$('.text-muted span').eq(0).text(),
            total:$('.text-muted span').eq(1).text(),
            list:boxs.map(o => {
                const a = $(o).find("a")
                return {
                    img:a.attr("data-original"),
                    title:a.attr("title"),
                    actor:$(o).find(".subtitle").text(),
                    href:a.attr("href")
                }
            }),
            page: [{ index: nowPage, href: 'nowPage' }].concat(pages)
        }
    }

    [online.MENU](html) {
        const $ = cheerio.load(html);
        const collapse = $("#collapse ul").get();
        const type = collapse.map(u => {
            const lis = $(u).find("a").get();
            return {
                title: $(u).find("span").text(),
                menus: lis.map((l, num) => {
                    return {
                        nav: $(l).text(),
                        href: $(l).attr("href")
                    }
                })
            }
        })
        return {
            name: $(".content-meun .head span").eq(1).text(),
            type
        };
    }
}

module.exports = new OnlineCrawler();
