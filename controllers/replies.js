var Post = require("../models/post");
var Comment = require("../models/comment");
var User = require("../models/user");
const app = require('express')();

// NEW REPLY
// app.get("/comments/:commentId/replies/new", (req, res) => {
//     console.log("req.user:",req.user)
//     let post;
//     Comment.findById(req.params.commentId)
//         .then(comment => {
//             res.render("replies-new", {
//                 post,
//                 comment,
//                 user: req.user._id
//             });
//         })
//         .catch(err => {
//             console.log(err.message);
//         });
// });

app.get("/posts/:postId/comments/:commentId/replies/new", (req, res) => {
    let post;
    Post.findById(req.params.postId)
        .then(p => {
            post = p;
            return Comment.findById(req.params.commentId);
        })
        .then(comment => {
            res.render("replies-new", {
                post,
                comment,
                user: req.user._id
            });
        })
        .catch(err => {
            console.log(err.message);
        });
});

// TOFIX: Not gathering comment IDs
// CREATE REPLY
app.post("/comments/:commentId/replies", (req, res) => {
    // LOOKUP THE PARENT POST
    // Comment.findById(req.params.commentId)
    //   .then(post => {
    //     // FIND THE CHILD COMMENT
    //     var comment = post.comments.id(req.params.commentId);
    //     // ADD THE REPLY
    //     comment.comments.unshift(req.body);
    //     // SAVE THE CHANGE TO THE PARENT DOCUMENT
    //     return post.save();
    //   })
    //   .then(post => {
    //     // REDIRECT TO THE PARENT POST#SHOW ROUTE
    //     res.redirect("/posts/" + post._id);
    //   })
    //   .catch(err => {
    //     console.log(err.message);
    //   });
    // TODO: Not getting req.body.post_id
    // not unshifting and associating with user
    // not unshifting on parent comment
    console.log(req.body)
    comment = new Comment (req.body)
    comment.save()
        .then(newComment => {
            Comment.findById(req.params.commentId)
                .then(parentComment => {
                    parentComment.comments.unshift(newComment._id)
                    parentComment.save().then(() => {
                        res.redirect("/posts/" + req.body.post_id);
                    }).catch((err) => {
                        console.log(err)
                    })
                }).catch((err) => {
                    console.error(err)
                })

            // REDIRECT TO THE PARENT POST#SHOW ROUTE
            // res.redirect("/posts/" + req.body.post_id);
        })
        .catch(err => {
            console.log(err.message);
        });
});

module.exports = app;