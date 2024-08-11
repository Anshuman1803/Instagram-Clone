const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2")

const postModel = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  postPoster: {
    type: String,
    required: true,
  },
  postPosterPublicID: {
    type: String,
    required: true,
  },
  postCaption: {
    type: String,
  },
  postCreatedAt: {
    type: Number,
  },
  likedBy: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      likedAt: {
        type: Number
      },
      _id: { type: mongoose.Schema.Types.ObjectId, auto: false }
    }
  ],
  postLikes: {
    type: Number,
  }
});

postModel.plugin(aggregatePaginate);
const postCollection = mongoose.model("posts", postModel);

module.exports = { postCollection };
