var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const express = require('express');
const app = express();
const Post = require('./models/post');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const db = require('./data/reddit-db');
const expressValidator = require('express-validator');
const exphbs = require('express-handlebars');



app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(cookieParser()); // Add this after you initialize express.

// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator()); // Add after body parser initialization!

var checkAuth = (req, res, next) => {
  console.log("Checking authentication");
  if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
    req.user = null;
  } else {
    var token = req.cookies.nToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
  }

  next();
};
app.use(checkAuth);

const post = require('./controllers/posts.js')(app);
const comment = require('./controllers/comments-controller.js')(app);

app.listen(process.env.PORT || 3000, () => {
  console.log('App listening on port 3000!')
})

// return app;