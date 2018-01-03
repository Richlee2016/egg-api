const cheerio = require("cheerio");
class BookCrawler {
    constructor() { }

    chapter(html) {
        const $ = cheerio.load(html);
        var chapterDom = $('.chapterlist dd a').get();
        const numReg = /(\d+).html/;
        var chapter = chapterDom.map(function (o) {
            return {
                href: $(o).attr('href').match(numReg)[1],
                text: $(o).text()
            }
        });
        return chapter;
    }

    read(html) {
        const $ = cheerio.load(html);
        const text = $("#content").html();
        const title = $(".inner h1").text();
        const reg = /\S+/g;
        if (!text) return;
        const result = text.match(reg);
        return {
            title,
            text: result
        }
    }
}

module.exports = new BookCrawler();