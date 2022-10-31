const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  text: { type: String, required: true },
  title: { type: String, maxLength: 100 },
  author: { type: String, maxLength: 100 },
  source: { type: String },
  year: { type: Number },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: false }, // reference to the associated category (many-to-many relationship, ??? although an item must have at least one category)
});

// Virtual for author's URL
ItemSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/item/${this._id}`;
});

// Export model
module.exports = mongoose.model("Item", ItemSchema);


