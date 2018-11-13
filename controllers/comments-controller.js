const Comment = require('../models/comment');
const Post = require('../models/post')
const app = require('express');

console.log("Connected to comments controller")

module.exports = app => {
  // CREATE Comment
    app.post("/posts/:postId/comments", (req, res) => {
        // INSTANTIATE INSTANCE OF MODEL
        const comment = new Comment(req.body);
        comment.author = req.user._id;
      
        // SAVE INSTANCE OF Comment MODEL TO DB
        comment
          .save()
          .then(comment => {
            return User.findById(req.user._id);
            // return Post.findById(req.params.postId);
          })
          .then(user => {
          // .then(post => {
            user.post.comments.unshift(comment)
            // post.comments.unshift(comment);
            return post.save();
          })
          .then(post => {
            res.redirect('/comments' + comment._id);
            // res.redirect(`/`);
          })
          .catch(err => {
            console.log(err);
          });
      });
}