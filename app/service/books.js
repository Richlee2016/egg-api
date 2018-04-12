const Service = require("egg").Service;
const uniqBy = require("lodash/uniqBy");

class BooksService extends Service {
  constructor(ctx) {
    super(ctx);
    this.Free = this.ctx.model.Book.Free;
    this.User = this.ctx.model.User.User;
    this.Crawler = this.ctx.helper.crawler.Book;
  }
  // 获取书籍内容
  async FetchContent(id,nid, chapter) {
    return await this.Crawler.read(id,nid, chapter);
  }

  // 获取书籍章节信息
  async fetchChapter(id, name, author) {
    const dbRes = await this.Free.findOne({ _id: id }).exec();
    let book,chapterList;
    if (dbRes) {
      book = dbRes;
      chapterList = book.chapter;
    } else {
      book = await this.Crawler.search(name, author);
      if(!book) return;
      const chapter = await this.Crawler.chapter(book.href);
      chapterList = uniqBy(chapter,"href");
      chapterList.sort(function (a, b) {
        return (Number(a.href) - Number(b.href))
      });
      await this.Free.SaveFree({
        _id: id,
        name,
        author,
        freeId: book.id,
        href: book.href,
        chapter:chapterList
      });
    }
    return {
      id,
      name,
      author,
      freeId: dbRes?dbRes.freeId:book.id,
      chapter:chapterList
    };
  }

  // 去重
  _delRep(array){
    return Array.from(new Set(array));
  }
}

module.exports = BooksService;
