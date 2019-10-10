const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const slug = require("slug");

const User = mongoose.model("User");

const LocationSchema = new mongoose.Schema(
  {
    lat: Number,
    lng: Number,
    rating: Number,
    verifications: Number,
    slug: { type: String, lowercase: true, unique: true },
    title: String,
    description: String,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    tagList: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

LocationSchema.plugin(uniqueValidator, { message: "is already taken" });

LocationSchema.pre("validate", function(next) {
  if (!this.slug) {
    this.slugify();
  }
  next();
});

LocationSchema.methods.slugify = function() {
  const discriminatorValue = (Math.random() * Math.pow(36, 6)) | 0;
  const discriminator = discriminatorValue.toString(36);
  const titleSlug = slug(this.title);
  this.slug = `${titleSlug}-${discriminator}`;
};

LocationSchema.methods.updateRating = function() {
  const locationData = this;
  const query = { ratings: { $in: [{location:locationData._id}] } };
  return new Promise(async (res, rej) => {
    let rating = 0;
    let totalRatings = 0;
    for await (const doc of User.find(query)) {
      console.log({ doc });
      rating = (rating * totalRatings + doc.value) / ++totalRatings;
    }
    locationData.rating = rating;
    res(locationData.save());
  });
};

LocationSchema.methods.toJSONFor = function(user) {
  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    body: this.body,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    tagList: this.tagList,
    rating: this.rating,
    // favorited: false, // !!user ? user.isFavorite(this._id) : false,
    // favoritesCount: this.favoritesCount,
    author: this.author.toProfileJSONFor(user)
  };
};

mongoose.model("Location", LocationSchema);
