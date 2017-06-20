var helperObj = {};

helperObj.checkUserError = function(err) {
    if(err.message === "A user with the given username is already registered") {
        return err.message;
    } else {
        return err.errors.email.message;
    }
}

module.exports = helperObj;