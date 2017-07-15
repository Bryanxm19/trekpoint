var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    User            = require("./models/user");
    
// routes config
var indexRoutes = require("./routes/index");

// connect to db
mongoose.connect(process.env.DATABASEURL);
// mongoose.connect("mongodb://bryan:q06362@ds145639.mlab.com:45639/trekpoint");

// app config
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//passport config
app.use(require("express-session")({
  secret: "Anything",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

// use routes
app.use(indexRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
  console.log("Server started...");
});