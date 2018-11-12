const Post = require('../models/post');
console.log('Connected to posts controller')
module.exports = app => {
  app.get('/n/:subreddit', function (req, res) {
    Post.find({
        subreddit: req.params.subreddit
      })
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
      var post = new Post(req.body);
      post.author = req.user._id;

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
      return res.status(401); // UNAUTHORIZED
    }
  });


  app.get("/", (req, res) => {
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

  app.get("/posts/:id", function (req, res) {
    // LOOK UP THE POST
    Post.findById(req.params.id).populate('comments').then((post) => {
      res.render('posts-show.handlebars', {
        post
      })
    }).catch((err) => {
      console.log(err.message)
    })
  });
};