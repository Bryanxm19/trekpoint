var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    request     = require("request-promise"),
    Promise     = require("bluebird"),
    middleware  = require("../middleware"),
    helper      = require("../helpers/helper"),
    User        = require("../models/user");
    
//environment variables setup   
require('dotenv').config();
    
// root
router.get("/", middleware.landingLoggedIn, function(req, res) {
    res.render("index");
});

// login
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/search",
        failureRedirect: "/"
    })
);

// sign up
router.post("/register", middleware.registerConfirm, function(req, res) {
    User.register(new User({email: req.body.email, username: req.body.username}), req.body.password, function(err, user) {
        if(err) {
            console.log(helper.checkUserError(err));
            return res.redirect("/");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/search"); 
        });
    });
});

// logout route
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

router.get("/search", middleware.isLoggedIn, function(req, res) {
    res.render("search");
});

router.get("/activities", middleware.isLoggedIn, function(req, res) {
    var destination = req.query.destination;
    var startDate = req.query.daterange.replace(/\s+/g, '').split("to")[0];
    var endDate = req.query.daterange.replace(/\s+/g, '').split("to")[1];
    var activities =  req.query.activities;
    var results = [];
    
    var requests = helper.buildRequest(activities, startDate, endDate, destination);
    
    Promise.map(requests, function(obj) {
      return request(obj).then(function(body) {
        return JSON.parse(body);
      });
    }).then(function(response) {
      console.log(helper.buildResult(response, activities));
    }, function(err) {
      console.log(err);
    });
});

module.exports = router;