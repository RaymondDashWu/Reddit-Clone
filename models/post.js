const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Comment = require('../models/comment')
// const User = require('../models/user')

const PostSchema = new Schema({
  createdAt: { type: Date },
  updatedAt: { type: Date },
  title: { type: String, required: true },
  url: { type: String, required: true },
  summary: { type: String, required: true },
  subreddit: { type: String, required: true },
  // comments: [Comment.Schema],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  author : { type: Schema.Types.ObjectId, ref: "User", required: true },
});

PostSchema.pre("save", function(next) {
  // SET createdAt AND updatedAt
  const now = new Date();
  this.updatedAt = now;

  if (!this.createdAt) {
    this.createdAt = now;
  }

  next();
});

console.log("connected to post model")

module.exports = mongoose.model("Post", PostSchema);