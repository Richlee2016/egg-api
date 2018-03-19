module.exports = {
    schedule: {
        interval: '30m', // 1 分钟间隔
        type: 'all', // 指定所有的 worker 都需要执行
    },
    async task(ctx) {
        // await ctx.service.qiniu.hotQiniuUpdate();
    }
};