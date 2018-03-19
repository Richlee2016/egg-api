const Service = require("egg").Service;
const qiniu = require("qiniu");
const nanoid = require("nanoid");
class QiniuService extends Service {
    constructor(ctx) {
        super(ctx);
        const config = ctx.app.config.richCof;
        this.config = config;
        const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK)
        const cfg = new qiniu.conf.Config()
        this.bucket = config.qiniu.bucket
        this.client = new qiniu.rs.BucketManager(mac, cfg)
        this.Hot = this.ctx.model.Movie.Hot;
    }
    // 上传封装
    async _uploadToQiniu(url, key) {
        return new Promise((resolve, reject) => {
            console.log(url, key);
            this.client.fetch(url, this.bucket, key, (err, ret, info) => {
                if (err) {
                    reject(err)
                } else {
                    if (info.statusCode === 200) {
                        resolve({
                            key
                        })
                    } else {
                        reject(info)
                    }
                }
            })
        })
    }
    // hot推荐 视频地址
    async hotQiniuUpdate(hot) {
        console.log(hot);
        if (hot.video && !hot.videoKey) {
            try {
                let videoData = await this._uploadToQiniu(hot.video, `${nanoid()}.mp4`);
                let coverData = await this._uploadToQiniu(hot.cover, `${nanoid()}.jpg`);
                if (videoData.key) {
                    hot.videoKey = this.config.qiniu.cname + videoData.key
                }
                if (coverData.key) {
                    hot.coverKey = this.config.qiniu.cname + coverData.key
                }
                return hot;
            } catch (error) {
                console.log(error);
            }
        }
        // const hots = await this.Hot.find({
        //     $or: [{
        //             videoKey: {
        //                 $exists: false
        //             }
        //         },
        //         {
        //             videoKey: null
        //         },
        //         {
        //             videoKey: ''
        //         }
        //     ]
        // }).exec();
        // if (hots.length === 0) {
        //     console.log("it is over");
        //     return false;
        // }
        // for (let i = 0; i < hots.length; i++) {
        //     let hot = hots[i];
        //     if (hot.video && !hot.videoKey) {
        //         try {
        //             let videoData = await this._uploadToQiniu(hot.video, `${nanoid()}.mp4`);
        //             let coverData = await this._uploadToQiniu(hot.cover, `${nanoid()}.jpg`);
        //             if (videoData.key) {
        //                 hot.videoKey = this.config.qiniu.cname + videoData.key
        //             }
        //             if (coverData.key) {
        //                 hot.coverKey = this.config.qiniu.cname + coverData.key
        //             }
        //             await hot.save();
        //         } catch (error) {
        //             console.log(error);
        //         }
        //     }
        // }
    }
}

module.exports = QiniuService;