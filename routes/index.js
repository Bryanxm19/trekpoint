var express = require("express"),
    router  = express.Router();
    
// root
router.get("/", function(req, res) {
    res.render("index");
});

// login and sign up page
router.get("/login", function(req, res) {
    res.render("login");
});

module.exports = router;