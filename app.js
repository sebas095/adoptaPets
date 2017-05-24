const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const favicon = require("serve-favicon");
const logger = require("morgan");
const methodOverride = require("method-override");
const path = require("path");
const expSession = require("express-session");
const User = require("./models/user");
const Publication = require("./models/publication");

require("colors");
require("./config/passport")(passport);

const env = process.env.NODE_ENV || "dev";
const config = require("./config/" + env);

const index = require("./routes/index");
const users = require("./routes/users");
const session = require("./routes/session");
const account = require("./routes/account");
const publications = require("./routes/publications");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(cookieParser());
app.use("/adopta-pets", express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

app.use(
  expSession({
    secret: config.secret,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

global.HOST = config.url;
// mongo config
mongoose.Promise = global.Promise;
mongoose.connect(config.db.url);
app.db = mongoose.connection;
app.on("open", () => {
  console.log("connected to db".yellow);
});

// Helpers
app.use((req, res, next) => {
  if (req.session.passport) {
    const id = req.session.passport.user;
    User.findById(id, (err, user) => {
      if (err) console.log(err);
      res.locals.session = {
        firstname: user.firstname,
        lastname: user.lastname,
        state: user.state
      };
      next();
    });
  } else
    next();
});

app.use((req, res, next) => {
  Publication.find({}, (err, data) => {
    if (err) console.log(err);
    res.locals.count = data.filter(item => item.available === false).length;
    next();
  });
});

// Routes
index(app, config.host, "/adopta-pets");
users(app, config.host, "/adopta-pets/users");
account(app, config.host, "/adopta-pets/account");
session(app, config.host, "/adopta-pets/session", passport);
publications(app, config.host, "/adopta-pets/publications");
app.use("/", (req, res) => res.redirect("/adopta-pets"));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = env === "dev" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
