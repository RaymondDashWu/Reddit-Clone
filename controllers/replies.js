var Post = require("../models/post");
var Comment = require("../models/comment");
var User = require("../models/user");
const app = require('express')();

// NEW REPLY
app.get("/comments/:commentId/replies/new", (req, res) => {
    let post;
    Comment.findById(req.params.commentId)
        .then(comment => {
            res.render("replies-new", {
                post,
                comment
            });
        })
        .catch(err => {
            console.log(err.message);
        });
});

// CREATE REPLY
app.post("/posts/:postId/comments/:commentId/replies", (req, res) => {
    // LOOKUP THE PARENT POST
    Post.findById(req.params.postId)
      .then(post => {
        // FIND THE CHILD COMMENT
        var comment = post.comments.id(req.params.commentId);
        // ADD THE REPLY
        comment.comments.unshift(req.body);
        // SAVE THE CHANGE TO THE PARENT DOCUMENT
        return post.save();
      })
      .then(post => {
        // REDIRECT TO THE PARENT POST#SHOW ROUTE
        res.redirect("/posts/" + post._id);
      })
      .catch(err => {
        console.log(err.message);
      });
  });

module.exports = app;