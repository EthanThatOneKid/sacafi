// Dependencies
const router = require("express").Router();
const mongoose = require("mongoose");

const User = mongoose.model("User");
const auth = require("../auth");

// Preload user profile on routes with ':username'
router.param("username", (req, res, next, username) => {
  return User.findOne({ username })
    .then(user => {
      if (!user) {
        return res.sendStatus(404);
      }
      req.profile = user;
      return next();
    })
    .catch(next);
});

// Get profile information
router.get("/:username", auth.optional, (req, res) => {
  if (req.payload) {
    return User.findById(req.payload.id).then(user => {
      if (!user) {
        return res.json({ profile: req.profile.toProfileJSONFor(false) });
      }
      return res.json({ profile: req.profile.toProfileJSONFor(user) });
    });
  }
  return res.json({ profile: req.profile.toProfileJSONFor(false) });
});

// Follow a user
router.post("/:username/follow", auth.required, (req, res, next) => {
  const profileId = req.profile._id;
  return User.findById(req.payload.id)
    .then(user => {
      if (!user) {
        return res.sendStatus(401);
      }
      return user.follow(profileId).then(() => {
        return res.json({ profile: req.profile.toProfileJSONFor(user) });
      });
    })
    .catch(next);
});

// Unfollow a user
router.delete("/:username/follow", auth.required, (req, res, next) => {
  const profileId = req.profile._id;
  return User.findById(req.payload.id)
    .then(user => {
      if (!user) {
        return res.sendStatus(401);
      }
      return user.unfollow(profileId).then(() => {
        return res.json({ profile: req.profile.toProfileJSONFor(user) });
      });
    })
    .catch(next);
});

module.exports = router;
