var middlewareObj = {};

middlewareObj.registerConfirm = function(req, res, next) {
    if(req.body.password != req.body.second_password) {
        console.log("Passwords do not match");
        res.redirect("/");
    } 
    else if(req.body.password.length < 6) {
        console.log("Password must be 6 characters");
        res.redirect("/");
    }
    else {
        next();
    }
}

module.exports = middlewareObj;

