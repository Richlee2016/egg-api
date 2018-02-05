const MovieCrawler =  require("../crawler/movies")
const BookCrawler =  require("../crawler/books")
const OnlineCrawler =  require("../crawler/onlines")
module.exports = {
    crawler:{
        Movie:MovieCrawler,
        Book:BookCrawler,
        Online:OnlineCrawler
    }
};
