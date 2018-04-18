const Service = require("egg").Service;
const puppeteer = require("puppeteer");

const HOME = "http://www.idyjy.com"
const ONLINE = ""

class CrawlerService extends Service {
    constructor(ctx) {
        super(ctx);
        this.HomeMovieConfig = {
            sub: id => `${HOME}/sub/${id}.html`,
            page: HOME,
            newest: `${HOME}/w.asp?p=1&f=3&l=t`,
            bili: s =>
                `https://search.bilibili.com/all?keyword=${s}&from_source=banner_search`
        }
        this.Movie = this.ctx.model.Movie.Movie;
    }

    /**
     * 更新电影家园电影 以及 首页
     */
    async updateMovieHome() {
        try {
            const sleep = time => new Promise(resolve => {
                setTimeout(resolve, time);
            })
            const browser = await puppeteer.launch();
    
            const page = await browser.newPage();
    
            await page.goto(this.HomeMovieConfig.newest, {
                waitUntil: 'networkidle2',
                timeout: 3000000
            });
    
            await sleep(5000);
    
            // 获取到页面最新电影ID
            const maxId = await page.evaluate(() => {
                var $ = window.jQuery;
                var list = $(".movielist li>a");
                var idList = $.map(list, function (o, i) {
                    return $(o).attr("href").match(/\d+/g)[0] || ""
                })
                return Math.max.apply(Math, idList);
            });
            console.log("maxId:",maxId);
            // 递归添加新电影
            const setMovie = async (maxId) => {
                // 获取数据库最新ID
                const [dbLastData] = await this.Movie.find().sort({
                    _id: -1
                }).limit(1).exec();
                const dbLastId = dbLastData.id;
                console.log("dbLastId:",dbLastId);
                if (maxId > dbLastId) {
                    const uuid = dbLastId + 1;
                    console.log("src",this.HomeMovieConfig.sub(uuid));
                    await page.goto(this.HomeMovieConfig.sub(uuid), {
                        waitUntil: 'networkidle2',
                        timeout: 3000000
                    });
    
                    await sleep(5000);
    
                    //获取新电影 内容
                    const getNewMovie = await page.evaluate(() => {
                        var $ = window.jQuery;

                        if ($("#main").size() === 0) {
                            return {
                              name: "none"
                            };
                        }

                        function Html() {
                            this.data = {}
                            this.reg = {
                                num: /(\d+)/g,
                                china: /[\u4e00-\u9fa5]+/g
                            }
                            this.init();
                        }
    
                        Html.prototype = {
                            init: function () {
                                this.data = {
                                    name: $("#name").text(),
                                    img: $(".pic img").attr("original"),
                                    intro: $(".mox .endtext").text(),
                                    catalog: this._mptext($(".location a")),
                                    isFinish: true
                                }
                                this.info();
                                this.geturl();
                            },
                            info: function () {
                                var data = {};
                                var that = this;
                                $(".info ul li").each(function (i, o) {
                                    var span = $(o).find("span").text();
                                    if (span === "又名：" || span === "IMDB：") {
                                        $(o).remove();
                                    };
                                    switch (span) {
                                        case "更新至：":
                                            data.isFinish = false;
                                            break;
                                        case "上映年代：地区：":
                                            var ya = that._ya($(o));
                                            data.year = ya.year;
                                            data.area = ya.area;
                                            break;
                                        case "类型：":
                                            data.classify = that._mptext($(o).find(">a"))
                                            break;
                                        case "导演：":
                                            data.director = that._mptext($(o).find(">a"))
                                            break;
                                        case "主演：":
                                            data.actor = that._mptext($(o).find(">a"))
                                            break;
                                    }
                                })
                                this.data = $.extend({}, this.data, data);
                            },
                            geturl: function () {
                                var list = $(".down_list");
                                var data = {};
                                var allList = []
                                $.map(list, function (o, i) {
                                    var boxs = $(o).find(">ul li");
                                    var mylist = $.map(boxs, function (n, j) {
                                        return {
                                            title: $(n).find(".down_part_name a").text(),
                                            url: $(n).find("input").val(),
                                            size: $(n).find(".file-size").text()
                                        }
                                    })
                                    allList.push(mylist);
                                    return mylist;
                                })
                                data.url = allList;
                                this.data = $.extend({}, this.data, data);
                            },
                            _ya: function (dom) {
                                var go = dom.find("span").remove();
                                var text = dom.text().trim();
                                return {
                                    year: text.match(this.reg.num)[0] || "",
                                    area: text.match(this.reg.china)[0] || ""
                                }
                            },
                            _mptext: function (list) {
                                return $.map(list, function (o, i) {
                                    return $(o).text();
                                })
                            },
                            _outspan: function (n) {
                                var go = $(".info ul li").eq(n).find("span").remove();
                                return text = $(".info ul li").eq(n).text().trim();
                            }
                        }
                        var _html = new Html();
                        return _html.data;
                    });
                    console.log("getNewMovie",getNewMovie.name);
                    const _movie = await this.Movie.movieSave(Object.assign(getNewMovie,{id:uuid}));
                    await setMovie(uuid + 1);
                };
            }

            await setMovie(maxId);

            await browser.close();

        } catch (error) {
            console.log(error);
            this.updateMovieHome();
        }

    }

}

module.exports = CrawlerService;