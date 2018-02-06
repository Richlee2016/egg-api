

module.exports = app => {
  const mongoose = app.mongoose;
  const { Schema } = mongoose;
  const Mixed = Schema.Types.Mixed
  const MoviePageSchema = new mongoose.Schema({
    name: String,
    /**
     * 10 电影家园首页
     * 20 熊猫-筛选
     * 21 熊猫-首页
     * 22 熊猫-全部影片
     * 23 熊猫-影片排行
     * 24 熊猫-最近更新
     * 25 熊猫-专题
     */
    type:Number,
    list: Mixed,
    meta: {
      createAt: {
        type: Date,
        default: Date.now()
      },
      updateAt: {
        type: Date,
        default: Date.now()
      }
    }
  });

  MoviePageSchema.pre("save", function (next) {
    if (this.isNew) {
      this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
      this.meta.updateAt = Date.now();
    }
    next();
  });

  MoviePageSchema.statics = {
    async savePage(data) {
      let page = await this.findOne({ name: data.name }).exec();
      const _page = data;
      if (page) {
        page = Object.assign(page,_page);
      } else {
        page = new Page(_page);
      };

      try {
        await page.save();
        console.log(`${name}更新成功`);
      } catch (error) {
        console.log(`${name}更新失败`);
        console.log(error);
      }
      return data;
    }
  }
  const Page = mongoose.model('t_movie_page', MoviePageSchema);
  return Page;
}

