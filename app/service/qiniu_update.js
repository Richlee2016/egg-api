const Service = require("egg").Service;
const config =  require("../config");
class BooksService extends Service {
    constructor(ctx) {
        super(ctx);
        const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK)
        const cfg = new qiniu.conf.Config()
        this.bucket = config.qiniu.bucket
        this.client = new qiniu.rs.BucketManager(this.mac, this.cfg)
    }
    // 上传封装
    async _uploadToQiniu(url, key) {
        return new Promise((resolve, reject) => {
            this.client.fetch(url, this.bucket, key, (err, ret, info) => {
                if (err) {
                    reject(err)
                }
                else {
                    if (info.statusCode === 200) {
                        resolve({ key })
                    } else {
                        reject(info)
                    }
                }
            })
        })
    }

    // hot推荐 视频地址
}

module.exports = BooksService;
