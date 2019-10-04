const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");

const User = mongoose.model("User");

passport.use(
  new LocalStrategy(
    {
      usernameField: "user[email]",
      passwordField: "user[password]"
    },
    (email, password, done) => {
      User.findOne({ email })
        .then(user => {
          return !user || !user.validPassword(password)
            ? done(null, false, {
                errors: { "email or password": "is invalid" }
              })
            : done(null, user);
        })
        .catch(done);
    }
  )
);
