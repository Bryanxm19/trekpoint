var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local");
    
// routes config
var indexRoutes = require("./routes/index");

// connect to db
mongoose.connect("mongodb://localhost/trekpoint");

// app config
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//passport config

// use routes
app.use(indexRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server started...");
});