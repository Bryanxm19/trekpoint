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
router.post("/register", middleware.registerConfirm, function(req, res) {
    User.register(new User({email: req.body.email, username: req.body.username}), req.body.password, function(err, user) {
        if(err) {
            console.log(checkEmailError(err));
            return res.redirect("/");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/search"); 
        });
    });
});

function checkEmailError(err) {
    if(err.message === "A user with the given username is already registered") {
        return err.message;
    } else {
        return err.errors.email.message;
    }
}

module.exports = router;