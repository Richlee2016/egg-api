const MovieCrawler =  require("../crawler/movies")
const BooksCrawler =  require("../crawler/books")
module.exports = {
    crawler:{
        Movie:MovieCrawler,
        Book:BooksCrawler
    }
};
