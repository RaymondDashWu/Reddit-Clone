console.log("Connected to comments model")

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  content: { type: String, required: true },
  author : { type: Schema.Types.ObjectId, ref: "User", required: true },
  comments: [{type: Schema.Types.ObjectId, ref: "Comment"}],
  
});

// call populate and get reference to other comments
CommentSchema.pre("find", function(next) {
  this.populate("comments");
  next();
})

module.exports = mongoose.model("Comment", CommentSchema);