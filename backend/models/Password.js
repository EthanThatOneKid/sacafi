const mongoose = require("mongoose");

const PasswordSchema = new mongoose.Schema(
  {
    secret: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    article: { type: mongoose.Schema.Types.ObjectId, ref: "Article" },
    approvals: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    disapprovals: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

PasswordSchema.methods.approve = function(user) {
  if (this.approvals.indexOf(user._id) === -1) {
    this.approvals = this.approvals.concat([user._id]);
  }
  return this.save();
};

PasswordSchema.methods.disapprove = function(user) {
  if (this.disapprovals.indexOf(user._id) === -1) {
    this.disapprovals = this.disapprovals.concat([user._id]);
  }
  return this.save();
};

PasswordSchema.methods.unapprove = function(user) {
  this.approvals.remove(user._id);
  return this.save();
};

PasswordSchema.methods.undisapprove = function(user) {
  this.disapprovals.remove(user._id);
  return this.save();
};

// Requires population of author
PasswordSchema.methods.toJSONFor = function(user) {
  return {
    id: this._id,
    secret: this.secret,
    approvals: this.approvals.length,
    disapprovals: this.disapprovals.length,
    rating: this.approvals.length - this.disapprovals.length,
    createdAt: this.createdAt,
    author: this.author.toProfileJSONFor(user)
  };
};

mongoose.model("Password", PasswordSchema);
