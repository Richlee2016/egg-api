const fs = require("fs")
const path = require("path")
module.exports = app => {
    app.messenger.on('crawler-movie', data => {
        console.log("开始爬取最新电影");
        const ctx = app.createAnonymousContext();
        ctx.runInBackground(async () => {
            await ctx.service.crawler.updateMovieHome();
        });
    });
}