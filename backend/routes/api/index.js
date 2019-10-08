// Dependencies
const router = require("express").Router();

// Instantiate routes as middlewares
router.use("/", require("./users"));
router.use("/profiles", require("./profiles"));
router.use("/articles", require("./articles"));
router.use("/tags", require("./tags"));

// Validation error handler middleware
router.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    const errors = Object.entries(err.errors).reduce((acc, [key, value]) => {
      acc[key] = value.message;
      return acc;
    }, {});
    return res.status(422).json({ errors });
  }
  return next(err);
});

module.exports = router;
