const express = require('express');
//const handlebars = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
//const flash = require('connect-flash');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
//const passport = require('passport');
const session = require('express-session');
const app = express();
const config = require('./config/database');
const port = 5000;
mongoose.connect(config.database, { useNewUrlParser: true });
let db = mongoose.connection;
// Check connections
db.once('open', function () {
  console.log("Connected to MongoDB");
});
// Check for error
db.on('error', function (err) {
  console.log(err);
});

// Cors middleware
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// // View Engine
// app.set('views', path.join(__dirname, 'views'));
// app.engine('handlebars', handlebars({ defaultLayout: 'layout' }));
// app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport init
// app.use(passport.initialize());
// app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// // Connect Flash
// app.use(flash());

// // Global Vars
// app.use(function (req, res, next) {
//   res.locals.success_msg = req.flash('success_msg');
//   res.locals.error_msg = req.flash('error_msg');
//   res.locals.error = req.flash('error');
//   res.locals.user = req.user || null;
//   next();
// });



// Route file 

let user = require('./routes/user');
let ad = require('./routes/ad');
app.use('/user', user);
app.use('/item', ad);


app.listen(port, () => console.log(`The Server is running on port ${port}`));