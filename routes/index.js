var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    middleware  = require("../middleware"),
    User        = require("../models/user");
    
// root
router.get("/", function(req, res) {
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
router.post("/register", middleware.loginConfirm, function(req, res) {
    User.register(new User({email: req.body.email, username: req.body.username}), req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            res.redirect("/");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/search"); 
        });
    });
});

module.exports = router;