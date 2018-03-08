const fs = require("fs")
const path = require("path")
module.exports = app => {
    app.messenger.on('rich', data => {
        console.log(data);
        console.log(1);
    });
    // app.sessionStore = {
    //   async get(key) {
    //     const res = await app.redis.get(key);
    //     if (!res) return null;
    //     return JSON.parse(res);
    //   },
    //   async set(key, value, maxAge) {
    //     if (!maxAge) maxAge = 24 * 60 * 60 * 1000;
    //     value = JSON.stringify(value);
    //     await app.redis.set(key, value, 'PX', maxAge);
    //   },
    //   async destroy(key) {
    //     await app.redis.del(key);
    //   },
    // };
    // app.beforeStart(async () => {
    //     // const api =await fs.readdirSync(path.resolve(__dirname,"../run/router.json"),"utf-8")
    //     app.apiDocument = 1;
    // });
    // app.apiDocument = 1;
}