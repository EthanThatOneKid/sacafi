const router = require("express").Router();
const mongoose = require("mongoose");

const Location = mongoose.model("Location");
const Comment = mongoose.model("Comment");
const User = mongoose.model("User");
const auth = require("../auth");

// Preload location objects on routes with ':location'
router.param("location", function(req, res, next, slug) {
  Location.findOne({ slug })
    .populate("author")
    .then(function(location) {
      if (!location) {
        return res.sendStatus(404);
      }
      req.location = location;
      return next();
    })
    .catch(next);
});

router.param("comment", function(req, res, next, id) {
  Comment.findById(id)
    .then(function(comment) {
      if (!comment) {
        return res.sendStatus(404);
      }
      req.comment = comment;
      return next();
    })
    .catch(next);
});

// GET /api/locations/
router.get("/", auth.optional, function(req, res, next) {
  const query = {};
  let limit = 20;
  let offset = 0;
  if (typeof req.query.limit !== "undefined") {
    limit = req.query.limit;
  }
  if (typeof req.query.offset !== "undefined") {
    offset = req.query.offset;
  }
  if (typeof req.query.tag !== "undefined") {
    query.tagList = { $in: [req.query.tag] };
  }
  Promise.all([
    req.query.author ? User.findOne({ username: req.query.author }) : null,
    req.query.favorited ? User.findOne({ username: req.query.favorited }) : null
  ])
    .then(function(results) {
      const author = results[0];
      const favoriter = results[1];
      if (author) {
        query.author = author._id;
      }
      if (favoriter) {
        query._id = { $in: favoriter.favorites };
      } else if (req.query.favorited) {
        query._id = { $in: [] };
      }
      return Promise.all([
        Location.find(query)
          .limit(Number(limit))
          .skip(Number(offset))
          .sort({ createdAt: "desc" })
          .populate("author")
          .exec(),
        Location.count(query).exec(),
        req.payload ? User.findById(req.payload.id) : null
      ]).then(function(results) {
        const locations = results[0];
        const locationsCount = results[1];
        const user = results[2];
        return res.json({
          locations: locations.map(location => {
            return location.toJSONFor(user);
          }),
          locationsCount: locationsCount
        });
      });
    })
    .catch(next);
});

// GET /api/locations/feed
router.get("/feed", auth.required, function(req, res, next) {
  let limit = 20;
  let offset = 0;
  if (typeof req.query.limit !== "undefined") {
    limit = req.query.limit;
  }
  if (typeof req.query.offset !== "undefined") {
    offset = req.query.offset;
  }
  User.findById(req.payload.id).then(function(user) {
    if (!user) {
      return res.sendStatus(401);
    }
    Promise.all([
      Location.find({ author: { $in: user.following } })
        .limit(Number(limit))
        .skip(Number(offset))
        .populate("author")
        .exec(),
      Location.count({ author: { $in: user.following } })
    ])
      .then(function(results) {
        const locations = results[0];
        const locationsCount = results[1];
        return res.json({
          locations: locations.map(location => {
            return location.toJSONFor(user);
          }),
          locationsCount: locationsCount
        });
      })
      .catch(next);
  });
});

// POST /api/locations
router.post("/", auth.required, function(req, res, next) {
  User.findById(req.payload.id)
    .then(function(user) {
      if (!user) {
        return res.sendStatus(401);
      }
      const location = new Location(req.body.location);
      location.author = user;
      return location.save().then(function() {
        return res.json({ location: location.toJSONFor(user) });
      });
    })
    .catch(next);
});

// GET /api/locations/:location (location id)
router.get("/:location", auth.optional, function(req, res, next) {
  Promise.all([
    req.payload ? User.findById(req.payload.id) : null,
    req.location.populate("author").execPopulate()
  ])
    .then(function(results) {
      const user = results[0];
      return res.json({ location: req.location.toJSONFor(user) });
    })
    .catch(next);
});

// PUT /api/locations/:location (update location)
router.put("/:location", auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user) {
    if (req.location.author._id.toString() === req.payload.id.toString()) {
      if (typeof req.body.location.title !== "undefined") {
        req.location.title = req.body.location.title;
      }
      if (typeof req.body.location.description !== "undefined") {
        req.location.description = req.body.location.description;
      }
      if (typeof req.body.location.lat !== "undefined") {
        req.location.lat = req.body.location.lat;
      }
      if (typeof req.body.location.lng !== "undefined") {
        req.location.lng = req.body.location.lng;
      }
      if (typeof req.body.location.tagList !== "undefined") {
        req.location.tagList = req.body.location.tagList;
      }
      req.location
        .save()
        .then(function(location) {
          return res.json({ location: location.toJSONFor(user) });
        })
        .catch(next);
    } else {
      return res.sendStatus(403);
    }
  });
});

// DELETE /api/locations/:location (delete location)
router.delete("/:location", auth.required, function(req, res, next) {
  User.findById(req.payload.id)
    .then(function(user) {
      if (!user) {
        return res.sendStatus(401);
      }
      if (req.location.author._id.toString() === req.payload.id.toString()) {
        return req.location.remove().then(() => {
          return res.sendStatus(204);
        });
      }
      return res.sendStatus(403);
    })
    .catch(next);
});

// Rate location
router.post("/:location/rate", auth.required, function(req, res, next) {
  const locationId = req.location._id;
  const ratingValue = req.body.value;
  User.findById(req.payload.id)
    .then(function(user) {
      if (!user) {
        return res.sendStatus(401);
      }
      return user.rate(locationId, ratingValue).then(function() {
        return req.location.updateRating().then(location => {
          return res.json({ location: location.toJSONFor(user) });
        });
      });
    })
    .catch(next);
});

// Remove a location's rating
router.delete("/:location/rate", auth.required, function(req, res, next) {
  const locationId = req.location._id;
  User.findById(req.payload.id)
    .then(function(user) {
      if (!user) {
        return res.sendStatus(401);
      }
      return user.unfavorite(locationId).then(function() {
        return req.location.updateFavoriteCount().then(function(location) {
          return res.json({ location: location.toJSONFor(user) });
        });
      });
    })
    .catch(next);
});

// return an location's comments
router.get("/:location/comments", auth.optional, function(req, res, next) {
  Promise.resolve(req.payload ? User.findById(req.payload.id) : null)
    .then(function(user) {
      return req.location
        .populate({
          path: "comments",
          populate: {
            path: "author"
          },
          options: {
            sort: {
              createdAt: "desc"
            }
          }
        })
        .execPopulate()
        .then(function(location) {
          return res.json({
            comments: req.location.comments.map(function(comment) {
              return comment.toJSONFor(user);
            })
          });
        });
    })
    .catch(next);
});

// create a new comment
router.post("/:location/comments", auth.required, function(req, res, next) {
  User.findById(req.payload.id)
    .then(function(user) {
      if (!user) {
        return res.sendStatus(401);
      }
      const comment = new Comment(req.body.comment);
      comment.location = req.location;
      comment.author = user;
      return comment.save().then(function() {
        req.location.comments.push(comment);
        return req.location.save().then(function(location) {
          res.json({ comment: comment.toJSONFor(user) });
        });
      });
    })
    .catch(next);
});

router.delete("/:location/comments/:comment", auth.required, function(
  req,
  res,
  next
) {
  if (req.comment.author.toString() === req.payload.id.toString()) {
    req.location.comments.remove(req.comment._id);
    req.location
      .save()
      .then(
        Comment.find({ _id: req.comment._id })
          .remove()
          .exec()
      )
      .then(function() {
        res.sendStatus(204);
      });
  } else {
    res.sendStatus(403);
  }
});

module.exports = router;
