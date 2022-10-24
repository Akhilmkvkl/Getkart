const express = require("express");
const path = require("path");
const session = require("express-session");

const mongoose = require("mongoose");

const logger = require("morgan");

const indexRouter = require("./routes/index");
const signupRouter = require("./routes/signup");
const loginRouter = require("./routes/login");
const adminRouter = require("./routes/adminlogin");
const adminhome = require("./routes/adminhome");
const userhome = require("./routes/userhome");
const shop = require("./routes/shop");
const cart = require("./routes/cart");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// database
mongoose
  .connect("mongodb://localhost:27017/Getkart")
  .then(() => {
    console.log("Db connected");
  })
  .catch(() => {
    console.log("db not connected");
  });

app.use(function (req, res, next) {
  res.set(
    "cache-control",
    "no-cache , no-store,must-revalidate,max-stale=0,post-check=0,pre-checked=0"
  );
  next();
});

app.get("/logout", (req, res) => {
  session.login = false;
  session.userid=null;

  res.redirect("/login");
});

app.get("/logoutad", (req, res) => {
  session.adminlogin=false
  res.redirect("/adminlogin");
});

app.use(
  session({
    secret: "secret",
    saveUninitialized: true,
    cookie: { maxage: 69000000000000000000000 },
    resave: false,
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/adminlogin", adminRouter);
app.use("/adminhome", adminhome);
app.use("/userhome", userhome);
app.use("/shop", shop);
app.use("/cart", cart);

const port = process.env.port || 4000;


  
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// app.use(function(err, req, res, next) {

//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   res.status(err.status || 500);
//   res.render('error');
// });


app.listen(port, () => {
  console.log("server is listening");
});

module.exports = app;
