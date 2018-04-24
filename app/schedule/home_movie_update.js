module.exports = {
    schedule: {
        interval: '10h', 
        type: 'all',
    },
    async task(ctx) {
        await ctx.service.crawler.updateMovieHome();
    }
};