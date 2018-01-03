
const cheerio = require("cheerio");
const install = require("superagent-charset")
const request = require("superagent")
const superagent = install(request);
class BookCrawler {
    constructor() {
        this.crawlerSrc = {
            movie: id => `http://www.idyjy.com/sub/${id}.html`,
            page: "http://www.idyjy.com/"
        }
    }

    async _request(url) {
        return new Promise((resolve, reject) => {
            superagent.get(url).charset('gb2312').end(function (err, res) {
                if (err) {
                    reject(err);
                }
                if (res) {
                    var $ = cheerio.load(res.text, { decodeEntities: false });
                    resolve($);
                };
            });
        })
    }

    async page() {
        try {
            const $ = await this._request(this.crawlerSrc.page);
            const res = this.pageHandle($);
            return res;
        } catch (error) {
            console.error(error);
        }
    }

    pageHandle($) {
        const pageAttr = dom => {
            const info = cla => dom.find(`.${cla} info`).text();
            var reg = /\d+/g;
            return {
                img: dom.find("img").attr("original"),
                name: dom.find("a").attr("title"),
                year: dom.find(".pLeftTop info").eq(0).text(),
                score: info("pRightBottom"),
                episodes: info("pLefpLeftBottomtTop"),
                id: dom.find("a").attr("href").match(reg)[0]
            }
        }

        const banners = $(".moxhotcoment li").get();
        const boxs = $(".box").get();

        const banner = banners.map(o => pageAttr($(o)));
        const box = boxs.map(o => {
            const titles = $(o).find("dd a").get();
            const lists = $(o).find("li").get();
            return {
                title: titles.map(i => $(i).text()),
                list: lists.map(i => pageAttr($(i)))
            }
        });

        return {
            banner,
            box
        }

    }
}

module.exports = new BookCrawler();