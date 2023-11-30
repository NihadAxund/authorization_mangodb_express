import { createConnection } from "../connection.js"

const mongoose = await createConnection()

const commentSchema = mongoose.Schema({
    blogID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        required: true,
    },
    userID: { type: mongoose.Types.ObjectId, ref: "User" },
    text: {
        type: String,
        required: true,
    },
    rating: [{type: mongoose.Types.ObjectId, ref: "Rating"}]

}, {
    timestamps: true
});

/////////PRE????????????????????
commentSchema.pre("save", async function (next) {
    const existingRating = await mongoose.models.Rating.findOne({
      commentID: this._id,
      userID: this.userID,
    });
  
    if (existingRating) {
      const error = new Error(":<>><:");
      return next(error);
    }
  
    next();
  });
  

export const Comment = mongoose.model('Comment', commentSchema);