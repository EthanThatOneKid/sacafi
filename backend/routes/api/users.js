// Dependencies
const mongoose = require("mongoose");
const router = require("express").Router();
const passport = require("passport");

const User = mongoose.model("User");
const auth = require("../auth");

// Get user data
router.get("/user", auth.required, (req, res, next) => {
  return User.findById(req.payload.id)
    .then(user => {
      if (!user) {
        return res.sendStatus(401);
      }
      return res.json({ user: user.toAuthJSON() });
    })
    .catch(next);
});

// Update user data
router.put("/user", auth.required, (req, res, next) => {
  return User.findById(req.payload.id)
    .then(user => {
      if (!user) {
        return res.sendStatus(401);
      }
      const changeableFields = [
        "username",
        "email",
        "bio",
        "image",
        "password"
      ];
      changeableFields.forEach(field => {
        // Only update fields that were actually passed
        if (typeof req.body.user[field] !== "undefined") {
          user[field] = req.body.user[field];
        }
      });
      return user.save().then(() => {
        return res.json({ user: user.toAuthJSON() });
      });
    })
    .catch(next);
});

// Login as user
router.post("/users/login", (req, res, next) => {
  if (!req.body.user.email) {
    return res.status(422).json({ errors: { email: "can't be blank" } });
  }
  if (!req.body.user.password) {
    return res.status(422).json({ errors: { password: "can't be blank" } });
  }
  return passport.authenticate(
    "local",
    { session: false },
    (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (user) {
        user.token = user.generateJWT();
        return res.json({ user: user.toAuthJSON() });
      }
      return res.status(422).json(info);
    }
  )(req, res, next);
});

// Create new user
router.post("/users", (req, res, next) => {
  const user = new User();
  user.username = req.body.user.username;
  user.email = req.body.user.email;
  user.setPassword(req.body.user.password);
  user
    .save()
    .then(() => {
      return res.json({ user: user.toAuthJSON() });
    })
    .catch(next);
});

module.exports = router;
