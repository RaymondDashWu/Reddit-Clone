const Comment = require('../models/comment');
const Post = require('../models/post')
const app = require('express')();
const User = require('../models/user')


console.log("Connected to comments controller")


// CREATE Comment
app.post("/posts/:postId/comments", (req, res) => {
  if (req.user) {
    // Find parent post
    Post.findById(req.params.postId).exec((err, post) => {
      // INSTANTIATE INSTANCE OF MODEL
      const comment = new Comment(req.body);
      comment.author = req.user._id;

      post.comments.unshift(comment._id)

      post.save()

      // SAVE INSTANCE OF Comment MODEL TO DB
      comment
        .save()
        .then(() => {
          return User.findById(req.user._id);
          // return Post.findById(req.params.postId);
        })
        .then(user => {
          // .then(post => {
          user.comments.unshift(comment)
          // post.comments.unshift(comment);
          return user.save();
        })
        .then(() => {
          res.redirect('/posts/' + post._id);
          // res.redirect(`/`);
        })
        .catch(err => {
          console.log(err);
        });
    })
  } else {
    res.send('You need to be logged in!')
  }

});
module.exports = app