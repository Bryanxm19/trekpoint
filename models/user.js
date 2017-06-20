var mongoose            = require("mongoose"),
passportLocalMongoose   = require("passport-local-mongoose"),
uniqueValidator         = require('mongoose-unique-validator');

var userSchema = new mongoose.Schema({
   email: {
       type: String,
       unique: true,
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
userSchema.plugin(uniqueValidator, { message: 'A user with the given {PATH} is already registered' });

module.exports = mongoose.model("User", userSchema);