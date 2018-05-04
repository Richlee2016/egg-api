const fs = require("fs")
const path = require("path")
module.exports = app => {
    app.messenger.on('crawler-movie', async data => {
        console.log("开始爬取最新电影");
        const list = await app.curl("http://www.dy280.com/",{
            dataType:"text"
        });
        console.log(list);
        // const ctx = app.createAnonymousContext();
        // ctx.runInBackground(async () => {
        //     await ctx.service.crawler.updateMovieHome();
        // });
    });
}