const Post = require('../models/post');
console.log('Connected to posts controller');
const app = require('express')();
const User = require('../models/user')

app.put("/posts/:id/vote-up", function(req, res) {
  Post.findById(req.params.id).exec(function(err, post) {
    post.upVotes.push(req.user._id);
    post.voteScore = post.voteTotal + 1;
    post.save();

    res.status(200);
  });
});

app.put("/posts/:id/vote-down", function(req, res) {
  Post.findById(req.params.id).exec(function(err, post) {
    post.downVotes.push(req.user._id);
    post.voteScore = post.voteTotal - 1;
    post.save();

    res.status(200);
  });
});

app.get('/n/:subreddit', function (req, res) {
  Post.find({
      subreddit: req.params.subreddit
    }).populate('author')
    .then(posts => {
      res.render('posts-index.handlebars', {
        posts
      });
    })
    .catch(err => {
      console.log(err.message);
    })
});

// CREATE
app.get('/posts/new', (req, res) => {
  res.render("posts-new.handlebars")
});

// Was originally /posts. Changed to /posts/new
app.post("/posts/new", (req, res) => {
  if (req.user) {
    // console.log(req.body)
    var post = new Post(req.body);
    post.author = req.user._id;
    // console.log("LOOK HERE")
    // console.log(post.author)
    // console.log(req.user)
    // console.log(req.user._id)
    post
      .save()
      .then(post => {
        return User.findById(req.user._id);
      })
      .then(user => {
        user.posts.unshift(post);
        user.save();
        // REDIRECT TO THE NEW POST
        res.redirect("/posts/" + post._id);
      })
      .catch(err => {
        console.log(err.message);
      });
  } else {
    res.send('You need to be logged in!')
  }
});


app.get("/", (req, res) => {
  console.log("req.cookies:", req.cookies)

  var currentUser = req.user;

  Post.find({})
    .then(posts => {
      res.render("posts-index.handlebars", {
        posts,
        currentUser
      });
    })
    .catch(err => {
      console.log(err.message);
    });
});

// TODO: provide with current user
// app.get("/posts/:id", function (req, res) {
//   // LOOK UP THE POST
//   var currentUser = req.user;
//   Post.findById(req.params.id).populate('author').populate('comments').then((post) => {
//     console.log(post)
//     res.render('posts-show.handlebars', {
//       post
//     })
//   }).catch((err) => {
//     console.log(err.message)
//   })
// });

app.get("/posts/:id", (req, res) => {
  var currentUser = req.user;

  // console.log('here stupid ----------------------------------')
  // console.log(req.params.id)
  Post.findById(req.params.id).populate('author').populate('comments')
    .then(post => {
      res.render("posts-show.handlebars", {
        'postId': req.params.id,
        'post': post,
        'comments': post.comments,
        'currentUser': currentUser
      });

    }).catch(err => {
      console.log(err.message);
    })
})

module.exports = app