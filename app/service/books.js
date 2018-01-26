const Service = require("egg").Service;
const Crawler = require("../crawler/books");
class BooksService extends Service {
  constructor(ctx) {
    super(ctx);
    this.Free = this.ctx.model.Book.Free;
    this.User = this.ctx.model.User.User;
    this.Crawler = Crawler;
  }
  // 获取书籍内容
  async FetchContent(id, chapter) {
    return await this.Crawler.read(id, chapter);
  }

  // 获取书籍章节信息
  async fetchChapter(id, name, author) {
    const dbRes = await this.Free.findOne({ _id: id }).exec();
    console.log(dbRes);
    let book;
    if (dbRes) {
      book = dbRes;
    } else {
      book = await this.Crawler.search(name, author);
      await this.Free.SaveFree({
        _id: id,
        name,
        author,
        freeId: book.id,
        href: book.href
      });
    }
    return await this.Crawler.chapter(book.href);
  }

}

module.exports = BooksService;
