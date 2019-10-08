// Dependencies
const mongoose = require("mongoose");

// Main Process
const CommentSchema = new mongoose.Schema(
  {
    body: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    article: { type: mongoose.Schema.Types.ObjectId, ref: "Article" }
  },
  { timestamps: true }
);

CommentSchema.methods.toJSONFor = user => {
  return {
    id: this._id,
    body: this.body,
    createdAt: this.createdAt,
    author: this.author.toProfileJSONFor(user) // Requires population of author
  };
};

mongoose.model("Comment", CommentSchema);
