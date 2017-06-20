var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
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

router.get("/search", function(req, res) {
    res.render("search");
});

module.exports = router;