const Service = require('egg').Service;
const Crawler = require("../crawler/books")
const request = require("request-promise");
class BooksService extends Service {
    constructor(ctx) {
        super(ctx);
        this.config = {
            chapter: id => `https://www.23us.cc/html/4/${id}`,
            read: (id, chapter) => `https://www.23us.cc/html/4/${id}/${chapter}.html`
        }
        this.Free = this.ctx.model.Book.Free;
    }
    // 获取书籍内容
    async read(id, chapter) {
        const resHtml = await request(this.config.read(id, chapter));
        const read = Crawler.read(resHtml);
        return read;
    }

    // 获取书籍章节
    async chapter(id) {
        const resHtml = await request(this.config.chapter(id));
        const chapter = Crawler.chapter(resHtml);
        return chapter;
    }

    async csFreeBook(free){
        const res = await this.Free.SaveFree(free)
        return res;
    }
}

module.exports = BooksService;