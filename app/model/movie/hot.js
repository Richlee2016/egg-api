module.exports = app => {
  const mongoose = app.mongoose;
  const { Schema } = mongoose;
  const Mixed = Schema.Types.Mixed;
  const HotSchema = new mongoose.Schema({
    id: Number,
    name: String,
    movieHome: { type:Number, ref: "t_movie_home" },
    onlineSrc:String,
    bgm: String,
    videoUrl: String,
    introduce: String,
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

  HotSchema.pre("save", function(next) {
    if (this.isNew) {
      this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
      this.meta.updateAt = Date.now();
    }
    next();
  });

  HotSchema.statics = {
    async SaveHot(hot) {
      let getHot = await this.findOne({ name:hot.id }).exec();
      console.log(getHot);
      const _hot = hot;
      if (getHot) {
        getHot.name = hot.name;
        getHot.movieHome = hot.movieHome;
        getHot.onlineSrc = hot.onlineSrc;
        getHot.bgm = hot.bgm;
        getHot.videoUrl = hot.videoUrl;
        getHot.introduce = hot.introduce;
      } else {
        getHot = new Hot(_hot);
      }
      try {
        const res = await getHot.save();
        console.log(`${hot.name}更新成功`);
        return res;
      } catch (error) {
        console.log(`${hot.name}更新失败`);
        console.log(error);
      }
    }
  };

  const Hot = mongoose.model("t_movie_hot", HotSchema);
  return Hot;
};
