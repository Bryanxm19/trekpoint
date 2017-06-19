var express = require("express"),
    router  = express.Router();
    
// root
router.get("/", function(req, res) {
    res.render("index");
});

module.exports = router;