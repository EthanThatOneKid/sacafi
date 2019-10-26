var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
var slug = require("slug");
var User = mongoose.model("User");

var ArticleSchema = new mongoose.Schema(
  {
    slug: { type: String, lowercase: true, unique: true },
    title: String,
    description: String,
    favoritesCount: { type: Number, default: 0 },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    networkTitle: {
      type: String,
      default: ""
      // required: true
    },
    isOpenAccess: Boolean,
    passwords: [{ type: mongoose.Schema.Types.ObjectId, ref: "Password" }],
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    tagList: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

ArticleSchema.plugin(uniqueValidator, { message: "is already taken" });

ArticleSchema.pre("validate", function(next) {
  if (!this.slug) {
    this.slugify();
  }
  next();
});

ArticleSchema.methods.slugify = function() {
  this.slug =
    slug(this.title) +
    "-" +
    ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
};

ArticleSchema.methods.updateFavoriteCount = function() {
  return User.count({ favorites: { $in: [this._id] } }).then(function(
    count
  ) {
    this.favoritesCount = count;
    return this.save();
  });
};

ArticleSchema.methods.toJSONFor = function(user) {
  const [lng, lat] = this.location.coordinates;
  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    location: { lat, lng },
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    tagList: this.tagList,
    favorited: user ? user.isFavorite(this._id) : false,
    favoritesCount: this.favoritesCount,
    author: this.author.toProfileJSONFor(user),
    networkTitle: this.networkTitle,
    isOpenAccess: this.isOpenAccess
  };
};

mongoose.model("Article", ArticleSchema);
