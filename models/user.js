var mongoose            = require("mongoose"),
passportLocalMongoose   = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
   email: {
       type: String,
       required: true
   },
   username: {
       type: String,
       required: true
   },
   password: {
       type: String
   }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);