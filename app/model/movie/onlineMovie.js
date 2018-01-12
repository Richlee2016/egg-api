module.exports = app => {
  const mongoose = app.mongoose;
  const onlineSchema = new mongoose.Schema({
    id: Number,
    img: String,
    name: String,
    update: {
      type: Date,
      default: Date.now()
    },
    director: String,
    actor: [],
    area: String,
    type: String,
    language: String,
    year: Number,
    intro: String,
    play: [],
    downUrl: [],
    introduce: String,
    same: [],
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

  return mongoose.model("t_online_movie", onlineSchema);
};
