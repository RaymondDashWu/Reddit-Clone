const Comment = require('../models/comment');
const Post = require('../models/post')
const app = require('express')();
const User = require('../models/user')


console.log("Connected to comments controller")

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
      module.exports = app