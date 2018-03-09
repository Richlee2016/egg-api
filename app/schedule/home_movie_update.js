module.exports = {
    schedule: {
        interval: '24h', 
        type: 'all',
    },
    async task(ctx) {
        await ctx.service.movies.crawlerPage();
    }
};